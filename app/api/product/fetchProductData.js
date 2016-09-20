/* eslint-disable max-len */
import get from 'lodash/get'
import trim from 'lodash/trim'
import head from 'lodash/head'
import keys from 'lodash/keys'
import uniq from 'lodash/uniq'
import slice from 'lodash/slice'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import forEach from 'lodash/forEach'
import compact from 'lodash/compact'
import request from 'request'
import cheerio from 'cheerio'
import parseInt from 'lodash/parseInt'
import { parse as parseUrl } from 'url'

import toJSON from '../utils/toJSON'
import logError from '../../utils/logError'
import findByUrl from './findByUrl'

export default url => (
  new Promise(async (resolve, reject) => {
    try {
      const product = await findByUrl(url)

      if (!isEmpty(product)) {
        return resolve(toJSON(product))
      }
    } catch (err) {
      return reject({
        generic: (
          'There was an error while trying to fetch ' +
          'the product\'s data. Please try again.'
        )
      })
    }

    const urlData = parseUrl(url)
    const urlHost = get(urlData, 'host')
    const urlProtocol = get(urlData, 'protocol')

    const options = {
      url,
      jar: true,
      gzip: true,
      timeout: 30000,
      useQuerystring: true,
      followAllRedirects: true,
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        Connection: 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.71 Safari/537.36',
        'Cache-Control': 'no-cache',
        'Accept-Encoding': 'gzip, deflate, sdch',
        'Accept-Language': 'en-US,en;q=0.8,es;q=0.6,fr;q=0.4'
      }
    }

    request(options, async (err, response, body) => {
      if (err) {
        reject(err)
      } else if (body) {
        let title = ''
        let images = []
        let description = ''
        const $ = cheerio.load(body)

        const $title = $('title')
        const $ogTitle = $('meta[name="og:title"]')
        const $firstHeading = $('h1').eq(0)

        if ($ogTitle && $ogTitle.length) {
          title = $ogTitle.attr('content')
        } if ($title && $title.length) {
          title = $title.text()
        } else if ($firstHeading && $firstHeading.length) {
          title = $firstHeading.text()
        }

        const $description = $('meta[name="description"]')
        const $ogDescription = $('meta[name="og:description"]')
        const $firstParagraph = $('p').eq(0)

        if ($ogDescription && $ogDescription.length) {
          description = $ogDescription.attr('content')
        } else if ($description && $description.length) {
          description = $description.attr('content')
        } else if ($firstParagraph && $firstParagraph.length) {
          description = $firstParagraph.text()
        }

        const $images = $('img')
        const $ogImage = $('meta[property="og:image"]')
        const $twitterImage = $('meta[property="twitter:image:src"]')

        if ($ogImage && $ogImage.length) {
          images.push($ogImage.attr('content'))
        }

        if ($twitterImage && $twitterImage.length) {
          images.push($twitterImage.attr('content'))
        }

        if ((/(amazon|amzn)/).test(urlHost)) {
          const $amazonImage = $('img#landingImage')

          if ($amazonImage && $amazonImage.length) {
            let amazonDynamicImage

            try {
              amazonDynamicImage = head(keys(
                JSON.parse($amazonImage.attr('data-a-dynamic-image'))
              ))
            } catch (amazonImageErr) {
              logError(amazonImageErr)
            }

            images.push(
              amazonDynamicImage ||
              $amazonImage.attr('data-old-hires') ||
              $amazonImage.attr('src')
            )
          }
        } else {
          forEach($images, (img) => {
            let src
            let width
            const $img = $(img)

            if ($img && $img.length) {
              src = $img.attr('src')
              width = $img.attr('width')

              if (!isEmpty(src)) {
                if ((/^(\/\/)/).test(src)) {
                  src = `${urlProtocol}${src}`
                } else if ((/^(\/)\w/i).test(src)) {
                  src = `${urlProtocol}//${urlHost}${src}`
                } else if (!(/^(https?)/i).test(src)) {
                  src = `${urlProtocol}//${urlHost}/${src}`
                }

                if (!(/(https?:\/\/.*\.(?:png|gif|svg))/i).test(src)) {
                  if (!isEmpty(width) && parseInt(width) >= 200) {
                    images.push(trim(src))
                  } else if (isEmpty(width)) {
                    images.push(trim(src))
                  }
                }
              }
            }
          })
        }

        images = filter(slice(compact(uniq(images)), 0, 15), (src) => (
          !(/data:image/).test(src)
        ))

        // Get Metadata
        const metadata = {}
        const $ogBrand = (/(amazon|amzn)/).test(urlHost)
          ? $('#brand')
          : $('meta[property="og:brand"]')
        const $ogStore = $('meta[property="og:site_name"]')
        const $ogPrice = (/(amazon|amzn)/).test(urlHost)
          ? $('#priceblock_ourprice')
          : $('meta[property="og:price:amount"]')
        const $ogCurrency = $('meta[property="og:price:currency"]')

        if ((/(amazon|amzn)/).test(urlHost)) {
          if ($ogBrand && $ogBrand.length) {
            metadata.brand = trim($ogBrand.text())
          }

          if ($ogPrice && $ogPrice.length) {
            metadata.price = trim($ogPrice.text())
          }
        } else {
          if ($ogBrand && $ogBrand.length) {
            metadata.brand = trim($ogBrand.attr('content'))
          }

          if ($ogPrice && $ogPrice.length) {
            metadata.price = trim($ogPrice.attr('content'))
          }

          if ($ogStore && $ogStore.length) {
            metadata.store = trim($ogStore.attr('content'))
          }

          if ($ogCurrency && $ogCurrency.length) {
            metadata.currency = trim($ogCurrency.attr('content'))
          }
        }

        resolve({
          name: trim(title),
          images,
          ...metadata,
          description: trim(description)
        })
      }
    })
  })
)
