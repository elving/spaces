const getWidth = (url) => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    const onLoad = () => resolve(image.width)

    image.onload = onLoad
    image.onerror = reject
    image.src = url

    if (image.complete) {
      onLoad()
    }
  })
}

export default (imageUrls, minWidth) => {
  const images = []

  return new Promise(async (resolve, reject) => {
    try {
      for (let url of imageUrls) {
        let imageWidth = await getWidth(url)

        if (imageWidth >= minWidth) {
          images.push(url)
        }
      }

      resolve(images)
    } catch (err) {
      reject(err)
    }
  })
}
