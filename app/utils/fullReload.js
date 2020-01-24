export default (event) => {
  if (!event.metaKey && !event.ctrlKey) {
    event.preventDefault()
    window.location.assign(event.currentTarget.getAttribute('href'))
  }
}
