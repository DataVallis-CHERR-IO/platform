import React, { useEffect, useState } from 'react'
import ProjectCountdown from '../../../views/projects/components/project-countdown'
import useTranslation from 'next-translate/useTranslation'
import Subscribe from '../../../views/subscribe'
import ProjectGallery from '../../../views/projects/components/project-gallery'
import Image from 'next/image'
import ProjectDonation from '../../../views/projects/components/project-donation'
import SendTransactionDialog from '../../../themes/components/feedback/dialog/send-transaction.dialog'
import { IProject } from '../../../interfaces/api'
import { useQuery } from 'react-query'
import { StageEnum } from '../../../enums/stage.enum'
import { toSun } from '../../../utils'
import { method } from '../../../modules/method'
import { useContractContext } from '../../../contexts/contract/provider'
import { FadeLoader } from 'react-spinners'
import { useSession } from 'next-auth/react'
import ProjectCreateSpendingRequest from '../../../views/projects/components/project-create-spending-request'
import ProjectSpendingRequests from '../../../views/projects/components/project-spending-requests'

interface IProjectDetailProps {
  project: IProject
}

const ProjectDetail: React.FC<IProjectDetailProps> = ({ project }) => {
  const { t } = useTranslation('common')
  const [displayButton, setDisplayButton] = useState<boolean>(false)
  const [showSendTransactionDialog, setShowSendTransactionDialog] = useState<boolean>(false)
  const [buttonText, setButtonText] = useState<string>('activate')
  const [max, setMax] = useState<number>(null)
  const { projectContract, projectActivatorContract } = useContractContext()
  const { data: session }: { data: any } = useSession()

  const { data: projectDetail, isLoading } = useQuery(
    ['projectDetail'],
    async () => {
      return null
      // return (
      //   await apolloClient.query({
      //     query: QUERY_PROJECT_DETAIL,
      //     variables: {
      //       projectId: project.id
      //     }
      //   })
      // ).data.projectDetail
    },
    {
      onError: error => {
        console.log('❌ GraphQL error (query detail): ', error)
      }
    }
  )

  useEffect(() => {
    if (session && projectContract?.stage !== StageEnum.ENDED) {
      if (projectContract?.stage === StageEnum.PENDING) {
        const availableAmount = projectActivatorContract?.project?.activateSize - projectActivatorContract?.project?.activatedAmount
        const maxAmount =
          projectActivatorContract?.project?.activateSize / projectActivatorContract?.project?.numActivators - projectActivatorContract?.activatedAmount

        setMax(maxAmount > availableAmount ? availableAmount : maxAmount)
      }
      setDisplayButton(true)
      setButtonText(projectContract?.stage === StageEnum.PENDING ? 'activate' : 'donateNow')
    }
  }, [projectContract?.stage, projectActivatorContract?.activatedAmount, session])

  const handleClick = async () => {
    setShowSendTransactionDialog(true)
  }

  const handleOnClose = async value => {
    setShowSendTransactionDialog(false)

    if (value) {
      if (projectContract?.stage === StageEnum.PENDING) {
        await method('activateProject', [project.contractAddress], toSun(value))
      } else {
        await method('donate', [], toSun(value), project.contractAddress)
      }
    }
  }

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
                  <Image src='/img/platform/header-2.jpg' alt='header' className='img-fluid' width={920} height={355} />
                </div>
                <div className='project-content clearfix'>
                  <ProjectCountdown />
                  <ProjectDonation />
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
                  <div className='btn btn-primary js-scroll-trigger' onClick={handleClick}>
                    {t(buttonText)}
                  </div>
                )}
              </div>
              {!isLoading ? <p>{projectDetail?.description || '/'}</p> : <FadeLoader color='#CA354C' loading={true} />}
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
      <section className='section-3 pt-0'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-12'>
              <h2 className='c-gray'>{t('requirements')}</h2>
              {!isLoading ? <p>{projectDetail?.requirements || '/'}</p> : <FadeLoader color='#CA354C' loading={true} />}
            </div>
          </div>
        </div>
      </section>
      <ProjectGallery projectId={project.id} />
      {session && session.user.address.toLowerCase() === projectContract?.owner?.toLowerCase() && <ProjectCreateSpendingRequest project={project} />}{' '}
      {projectContract?.requests?.descriptions?.length > 0 && <ProjectSpendingRequests project={project} />}
      <Subscribe />
      <SendTransactionDialog
        title={buttonText}
        contentText={projectContract?.stage === StageEnum.PENDING ? 'project.activateContentText' : 'project.donateContentText'}
        open={showSendTransactionDialog}
        onClose={handleOnClose}
        max={max}
      />
    </>
  )
}

export default ProjectDetail
