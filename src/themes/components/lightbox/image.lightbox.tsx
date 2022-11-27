import React from 'react'
import Lightbox from 'react-18-image-lightbox'
import { useState } from 'react'

interface IImageLightboxProps {
  images: string[]
  open: boolean
  onClose: any
}

const ImageLightbox = ({ images, open, onClose }: IImageLightboxProps) => {
  const [photoIndex, setPhotoIndex] = useState(0)

  const handleOnClose = () => {
    onClose(false)
  }

  return (
    open && (
      <Lightbox
        mainSrc={images[photoIndex]}
        nextSrc={images[(photoIndex + 1) % images.length]}
        prevSrc={images[(photoIndex + images.length - 1) % images.length]}
        onCloseRequest={handleOnClose}
        onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length)}
        onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
        reactModalStyle={{ overlay: { zIndex: '9999' } }}
      />
    )
  )
}

export default ImageLightbox
