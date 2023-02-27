import React, { useCallback, useEffect, useState } from 'react'
import ProjectCountdown from '../../../views/projects/components/project-countdown'
import useTranslation from 'next-translate/useTranslation'
import Subscribe from '../../../views/subscribe'
import ProjectGallery from '../../../views/projects/components/project-gallery'
import ProjectDonation from '../../../views/projects/components/project-donation'
import SendTransactionDialog from '../../../themes/components/feedback/dialog/send-transaction.dialog'
import ProjectCreateSpendingRequest from '../../../views/projects/components/project-create-spending-request'
import ImageLightbox from '../../../themes/components/lightbox/image.lightbox'
import ProjectSpendingRequests from '../../../views/projects/components/project-spending-requests'
import { IProject } from '../../../interfaces/api'
import { StageEnum } from '../../../enums/stage.enum'
import { getEther, getWei } from '../../../utils'
import { method } from '../../../modules/method'
import { useContractContext } from '../../../contexts/contract/provider'
import { getCherrioProjectAbi } from '../../../contracts/abi/cherrio-project'
import { useSessionContext } from '../../../contexts/session/provider'

interface IProjectDetailProps {
  project: IProject
}

const ProjectDetail: React.FC<IProjectDetailProps> = ({ project }) => {
  const { t } = useTranslation('common')
  const { account } = useSessionContext()
  const { contractProject, contractProjectActivator } = useContractContext()
  const [displayButton, setDisplayButton] = useState<boolean>(false)
  const [showSendTransactionDialog, setShowSendTransactionDialog] = useState<boolean>(false)
  const [openImageLightbox, setOpenImageLightbox] = useState<boolean>(false)
  const [images, setImages] = useState<string[]>([])
  const [buttonText, setButtonText] = useState<string>('activate')
  const [max, setMax] = useState<number>(null)

  const handleOnClick = () => {
    setShowSendTransactionDialog(true)
  }

  const handleSendOnClose = useCallback(
    async value => {
      setShowSendTransactionDialog(false)

      if (value) {
        if (contractProject.stage === StageEnum.PENDING) {
          await method('activateProject', [project.contractAddress], { value: getWei(value) })
        } else {
          await method('donate', [], { value: getWei(value) }, project.contractAddress, getCherrioProjectAbi())
        }
      }
    },
    [project.contractAddress]
  )

  const handleLightboxImagesOnClick = () => {
    setImages([project.image])
    setOpenImageLightbox(true)
  }

  useEffect(() => {
    if (contractProject.owner && account && account?.toLowerCase() !== contractProject.owner.toLowerCase() && contractProject.stage !== StageEnum.ENDED) {
      setDisplayButton(true)

      if (contractProject.stage === StageEnum.PENDING) {
        const availableAmount = contractProjectActivator.project?.activateSize - contractProjectActivator.project?.activatedAmount
        const maxAmount =
          contractProjectActivator.project?.activateSize / contractProjectActivator.project?.numActivators - contractProjectActivator.activatedAmount

        setMax(maxAmount > availableAmount ? availableAmount : maxAmount)
        setButtonText('activate')
      } else {
        setMax(null)
        setButtonText('donateNow')
      }
    } else {
      setDisplayButton(false)
    }
  }, [contractProject.stage, contractProjectActivator.activatedAmount, account])

  return (
    <>
      <header className='pagehead'>
        <div className='header-content'>
          <div className='container'>
            <div className='row'>
              <div className='col-lg-8 mx-auto text-center project-title-holder'>
                <h1>{project.title}</h1>
              </div>
              <div className='col-lg-10 mx-auto header-holder'>
                <div className='header-image'>
                  <div
                    style={{
                      backgroundImage: `url(${project.image})`,
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center top',
                      width: '100%',
                      height: 341
                    }}
                    onClick={handleLightboxImagesOnClick}
                  ></div>
                </div>
                <div className='project-content clearfix'>
                  <ProjectCountdown />
                  <ProjectDonation project={project} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <section className='section-3'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-12'>
              <div className='donation-header'>
                <h2 className='c-gray'>{t('description')}</h2>
                {displayButton && (
                  <div className='btn btn-primary js-scroll-trigger' onClick={handleOnClick}>
                    {t(buttonText)}
                  </div>
                )}
              </div>
              <p>{project.description}</p>
            </div>
          </div>
          <div className='row'>
            <div className='section-inner-video'>
              <div className='video-wrapper'>
                <div className='video-wrapper-inner'>
                  <div className='js-lazyYT' data-youtube-id='LFTroNyHfkg' data-width='100%' data-height={200} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ProjectGallery projectId={project.id} />
      {account?.toLowerCase() === contractProject.owner?.toLowerCase() && <ProjectCreateSpendingRequest project={project} />}{' '}
      {contractProject.requests?.descriptions?.length > 0 && <ProjectSpendingRequests project={project} />}
      <Subscribe />
      {account && (
        <SendTransactionDialog
          title={contractProject.stage === StageEnum.PENDING ? 'activateProject' : 'donateForProject'}
          contentText={contractProject.stage === StageEnum.PENDING ? 'activateProjectContentText' : 'donateForProjectContentText'}
          open={showSendTransactionDialog}
          onClose={handleSendOnClose}
          sender={account}
          min={getEther(contractProject.minimumDonation)}
          max={max}
        />
      )}
      <ImageLightbox images={images} open={openImageLightbox} onClose={() => setOpenImageLightbox(false)} />
    </>
  )
}

export default ProjectDetail
