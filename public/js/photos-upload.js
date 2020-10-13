const chefUpload = {
  input: "",
  inputUpload: document.querySelector("#photos-input"),
  iconDone: document.querySelector(".avatar-single span"),
  uploadLimit: 1,
  fileUploadInput(event) {
    const { uploadLimit, inputUpload, iconDone } = chefUpload
    const { files: fileList } = event.target
    chefUpload.input = event.target

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`)
      event.target.value = ""
      event.preventDefault()
    }

    const button = inputUpload.nextElementSibling
    if (fileList.length == uploadLimit) {
      inputUpload.classList.add("input-desabled")
      button.classList.add("button-disabled")
      iconDone.classList.add("done")
    }
  },
}

const photosUpload = {
  input: "",
  preview: document.querySelector("#photos-preview"),
  uploadLimit: 5,
  files: [],
  fileUploadInput(event) {
    const { files: fileList } = event.target
    photosUpload.input = event.target

    if (photosUpload.hasLimit(event)) return

    Array.from(fileList).forEach(file => {
      photosUpload.files.push(file)

      const reader = new FileReader()

      reader.onload = () => {
        const image = new Image()
        image.src = String(reader.result)

        const container = photosUpload.getContainer(image)
        photosUpload.preview.appendChild(container)
      }

      reader.readAsDataURL(file)
    })

    photosUpload.input.files = photosUpload.getAllFiles()
  },
  hasLimit(event) {
    const { uploadLimit, input, preview } = photosUpload
    const { files: fileList } = input

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`)
      event.preventDefault()
      return true
    }

    const photoDiv = []
    preview.childNodes.forEach(item => {
      if (item.classList && item.classList.value == "photo") photoDiv.push(item)
    })

    const totalPhotos = fileList.length + photoDiv.length
    if (totalPhotos > uploadLimit) {
      alert("Você atingiu o limite máximo de fotos")
      event.preventDefault()
      return true
    }

    return false
  },
  getAllFiles() {
    const dataTransfer =
      new ClipboardEvent("").clipboardData || new DataTransfer()

    photosUpload.files.forEach(file => dataTransfer.items.add(file))

    return dataTransfer.files
  },
  getContainer(image) {
    const container = document.createElement("div")
    container.classList.add("photo")

    container.onclick = photosUpload.removePhoto
    container.appendChild(image)
    container.appendChild(photosUpload.getRemoveButton())

    return container
  },
  getRemoveButton() {
    const button = document.createElement("span")
    button.classList.add("material-icons")
    button.innerHTML = "delete_forever"

    return button
  },
  removePhoto(event) {
    const photoDiv = event.target.parentNode
    const photosArray = Array.from(photosUpload.preview.children)
    const index = photosArray.indexOf(photoDiv)

    photosUpload.files.splice(index, 1)

    photosUpload.input.files = photosUpload.getAllFiles()

    photoDiv.remove()
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode

    if (photoDiv.id) {
      const removedFiles = document.querySelector('input[name="removed_files"')
      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},`
      }
    }

    photoDiv.remove()
  },
}

//funçao para galleria de imagens da receita
const imageGallery = {
  highlight: document.querySelector(".receita-files .receita-img > img"),
  previews: document.querySelectorAll(".gallery-preview img"),
  setImage(e) {
    const { target } = e

    imageGallery.previews.forEach(preview => preview.classList.remove("active"))
    target.classList.add("active")

    imageGallery.highlight.src = target.src
  },
}
