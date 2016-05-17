import ga from 'react-ga'

export default (event) => {
  event.preventDefault()

  const url = event.currentTarget.getAttribute('href')

  ga.outboundLink({ label: url }, () => {
    window.location.assign(url)
  })
}
