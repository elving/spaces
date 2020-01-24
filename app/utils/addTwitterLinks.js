import replace from 'lodash/replace'

export default (text) => {
  let textWithLinks = text

  textWithLinks = replace(textWithLinks, /[@]+[A-Za-z0-9-_]+/gim, (match) => (
    `<a href="https://twitter.com/${replace(match, '@', '')}" target="_blank">${match}</a>`
  ))

  textWithLinks = replace(textWithLinks, /[#]+[A-Za-z0-9-_]+/gim, (match) => (
    `<a href="https://twitter.com/hashtag/${replace(match, '#', '')}" target="_blank">${match}</a>`
  ))

  return textWithLinks
}
