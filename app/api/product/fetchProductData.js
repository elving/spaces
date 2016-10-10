/* eslint-disable max-len */
import get from 'lodash/get'
import set from 'lodash/set'
import map from 'lodash/map'
import trim from 'lodash/trim'
import head from 'lodash/head'
import keys from 'lodash/keys'
import uniq from 'lodash/uniq'
import slice from 'lodash/slice'
import filter from 'lodash/filter'
import replace from 'lodash/replace'
import isEmpty from 'lodash/isEmpty'
import forEach from 'lodash/forEach'
import compact from 'lodash/compact'
import request from 'request'
import cheerio from 'cheerio'
import capitalize from 'lodash/capitalize'
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

    const exists = element => (
      element && element.length
    )

    const toSentence = str => (
      capitalize(trim(str))
    )

    const toAbsolutePath = relativePath => {
      if ((/^(\/\/)/).test(relativePath)) {
        return `${urlProtocol}${relativePath}`
      } else if ((/^(\/)\w/i).test(relativePath)) {
        return `${urlProtocol}//${urlHost}${relativePath}`
      } else if (!(/^(https?)/i).test(relativePath)) {
        return `${urlProtocol}//${urlHost}/${relativePath}`
      } else if ((/^(https?)/i).test(relativePath)) {
        return relativePath
      }
    }

    const isAmazon = () => (
      (/(amazon|amzn)/).test(urlHost)
    )

    const getTitle = $ => {
      let title = ''

      const $title = $('title')
      const $ogTitle = $('meta[name="og:title"]')
      const $firstHeading = $('h1').eq(0)

      if (exists($ogTitle)) {
        title = $ogTitle.attr('content')
      } if (exists($title)) {
        title = $title.text()
      } else if (exists($firstHeading)) {
        title = $firstHeading.text()
      }

      return toSentence(title)
    }

    const getDescription = $ => {
      let description = ''

      const $description = $('meta[name="description"]')
      const $ogDescription = $('meta[name="og:description"]')
      const $firstParagraph = $('p').eq(0)
      const $amazonDescription = $('#productDescription p').eq(0)

      if (isAmazon() && exists($amazonDescription)) {
        description = $amazonDescription.text()
      } else if (exists($ogDescription)) {
        description = $ogDescription.attr('content')
      } else if (exists($description)) {
        description = $description.attr('content')
      } else if (exists($firstParagraph)) {
        description = $firstParagraph.text()
      }

      return toSentence(description)
    }

    const getImages = ($, body) => {
      const images = []

      const imageSources = (
        body.match(/src=['|"]+([^'"]+)['|"]+/gim) || []
      )

      const backgroundImages = (
        body.match(/url(?:\(['"]?)(.*?)(?:['"]?\))/gim) || []
      )

      forEach(imageSources, imageSource => {
        images.push(
          replace(imageSource, /'|"|src|=|;|\(|\)/gim, '')
        )
      })

      forEach(backgroundImages, backgroundImage => {
        images.push(
          replace(backgroundImage, /\(|\)|'|"|;|url/gim, '')
        )
      })

      const $images = $('img')
      const $ogImage = $('meta[property="og:image"]')
      const $twitterImage = $('meta[property="twitter:image:src"]')
      const $amazonLandingImage = $('#landingImage')

      if (exists($ogImage)) {
        images.unshift($ogImage.attr('content'))
      }

      if (exists($twitterImage)) {
        images.unshift($twitterImage.attr('content'))
      }

      if (isAmazon()) {
        if (exists($amazonLandingImage)) {
          let dynamicImage

          try {
            dynamicImage = head(keys(
              JSON.parse($amazonLandingImage.attr('data-a-dynamic-image'))
            ))
          } catch (amazonImageErr) {
            logError(amazonImageErr)
          }

          images.unshift(
            $amazonLandingImage.attr('data-old-hires') ||
            dynamicImage ||
            $amazonLandingImage.attr('src')
          )
        }
      }

      if (exists($images)) {
        forEach($images, img => {
          const $img = $(img)

          if (exists($img)) {
            images.push($img.attr('src'))
          }
        })
      }

      return compact(
        map(
          slice(
            filter(uniq(compact(images)), src => (
              !(/data:image|fls-na.amazon.com\/[0-9]\/batch/gim).test(src) &&
              (/.jpg|.jpeg|.gif|.png/gim).test(src)
            )
          ), 0, 15),
          toAbsolutePath
        )
      )
    }

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
        const $ = cheerio.load(body)

        // Get Metadata
        const metadata = {}
        const $ogBrand = isAmazon()
          ? $('#brand')
          : $('meta[property="og:brand"]')
        const $ogStore = $('meta[property="og:site_name"]')
        const $ogPrice = isAmazon()
          ? $('#priceblock_ourprice')
          : $('meta[property="og:price:amount"]')
        const $ogCurrency = $('meta[property="og:price:currency"]')

        if (isAmazon()) {
          if (exists($ogBrand)) {
            set(metadata, 'brand', trim($ogBrand.text()))
          }

          if (exists($ogPrice)) {
            set(metadata, 'price', trim($ogPrice.text()))
          }
        } else {
          if (exists($ogBrand)) {
            set(metadata, 'brand', trim($ogBrand.attr('content')))
          }

          if (exists($ogPrice)) {
            set(metadata, 'price', trim($ogPrice.attr('content')))
          }

          if (exists($ogStore)) {
            set(metadata, 'store', trim($ogStore.attr('content')))
          }

          if (exists($ogCurrency)) {
            set(metadata, 'currency', trim($ogCurrency.attr('content')))
          }
        }

        resolve({
          name: getTitle($),
          images: getImages($, body),
          description: getDescription($),
          ...metadata
        })
      }
    })
  })
)
