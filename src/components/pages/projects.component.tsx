import React from 'react'
import Image from 'next/image'

const ProjectsComponent: React.FC = () => {
  return (
    <header className='pagehead'>
      <div className='header-content'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-8 mx-auto text-center project-title-holder'>
              <h1>Donate for wildfire relief, reforestation and helping suffering victims </h1>
            </div>
            <div className='col-lg-10 mx-auto header-holder'>
              <div className='header-image'>
                <Image src='/img/platform/header-2.jpg' alt='header' className='img-fluid' width={920} height={355} />
              </div>
              <div className='project-content clearfix'>
                <div className='project-content-left'>
                  <div className='project-title'>project is Live Now</div>
                  <div className='project-subtitle'>project ends in</div>
                  <div className='project-countdown'>
                    <div className='project-cd-item project-day'>
                      <div className='project-cd-item-inner'>
                        <span className='num'>30</span> <span className='label'>D</span>
                      </div>
                    </div>
                    <div className='project-cd-item project-day'>
                      <div className='project-cd-item-inner'>
                        <span className='num'>23</span> <span className='label'>H</span>
                      </div>
                    </div>
                    <div className='project-cd-item project-day'>
                      <div className='project-cd-item-inner'>
                        <span className='num'>59</span> <span className='label'>M</span>
                      </div>
                    </div>
                    <div className='project-cd-item project-day'>
                      <div className='project-cd-item-inner'>
                        <span className='num'>59</span> <span className='label'>S</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='project-content-right'>
                  <div className='project-title'>project details</div>
                  <div className='project-progress'>
                    <div className='progress'>
                      <div className='progress-bar' role='progressbar' style={{ width: '25%' }} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>
                        25%
                      </div>
                    </div>
                    <div className='project-info'>
                      <div className='project-info-1'>Funded: 2.4633 ETH</div>
                      <div className='project-info-2'>Goal: 88.43 ETH</div>
                      <div className='project-info-3'>Donations: 51</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default ProjectsComponent
