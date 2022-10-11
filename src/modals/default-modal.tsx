import { useState } from 'react'

export default function Modal() {
  let subtitle
  const [modalIsOpen, setIsOpen] = useState(false)

  function openModal() {
    setIsOpen(true)
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00'
  }

  function closeModal() {
    setIsOpen(false)
  }

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    },
    overlay: { zIndex: 1000 }
  }

  return (
    <></>
    // <Modal
    //     isOpen={modalIsOpen}
    //     onAfterOpen={afterOpenModal}
    //     onRequestClose={closeModal}
    //     style={customStyles}
    //     contentLabel="Example Modal"
    // >
    //     <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
    //     <button onClick={closeModal}>close</button>
    //     <div>I am a modal</div>
    //     <form>
    //         <input />
    //         <button>tab navigation</button>
    //         <button>stays</button>
    //         <button>inside</button>
    //         <button>the modal</button>
    //     </form>
    // </Modal>
  )
}
