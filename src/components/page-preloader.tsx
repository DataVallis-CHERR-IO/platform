import React from 'react'
import { RingLoader } from 'react-spinners'

const PagePreloader: React.FC = () => {
  return (
    <section className='section-1'>
      <div className='container'>
        <div className='row' style={{ justifyContent: 'center' }}>
          <RingLoader color='#d21242' loading={true} size={75} />
        </div>
      </div>
    </section>
  )
}

export default PagePreloader
