export default (src, onLoad = (() => {})) => {
  const image = new Image()

  image.onload = onLoad
  image.src = src

  if (image.complete) {
    onLoad()
  }
}
