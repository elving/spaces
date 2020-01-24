import ReactGA from 'react-ga'

export default (event) => {
  event.preventDefault()

  const url = event.currentTarget.getAttribute('href')

  ReactGA.outboundLink({
    label: url
  }, () => {
    window.location.assign(url)
  })
}
