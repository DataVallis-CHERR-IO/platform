import React, { useCallback, useEffect, useState } from 'react'
import ProjectCountdown from '../../../views/projects/components/project-countdown'
import useTranslation from 'next-translate/useTranslation'
import Subscribe from '../../../views/subscribe'
import ProjectGallery from '../../../views/projects/components/project-gallery'
import Image from 'next/image'
import ProjectDonation from '../../../views/projects/components/project-donation'
import SendTransactionDialog from '../../../themes/components/feedback/dialog/send-transaction.dialog'
import ProjectCreateSpendingRequest from '../../../views/projects/components/project-create-spending-request'
import ProjectSpendingRequests from '../../../views/projects/components/project-spending-requests'
import { IProject } from '../../../interfaces/api'
import { StageEnum } from '../../../enums/stage.enum'
import { fromSun, toSun } from '../../../utils'
import { method } from '../../../modules/method'
import { useContractContext } from '../../../contexts/contract/provider'
import { useSession } from 'next-auth/react'
import { useTronWebContext } from '../../../contexts/tronweb/provider'

interface IProjectDetailProps {
  project: IProject
}

const ProjectDetail: React.FC<IProjectDetailProps> = ({ project }) => {
  const { t } = useTranslation('common')
  const { tronWeb } = useTronWebContext()
  const [displayButton, setDisplayButton] = useState<boolean>(false)
  const [showSendTransactionDialog, setShowSendTransactionDialog] = useState<boolean>(false)
  const [buttonText, setButtonText] = useState<string>('activate')
  const [max, setMax] = useState<number>(null)
  const [balance, setBalance] = useState<number>(null)
  const { contractProject, contractProjectActivator } = useContractContext()
  const { data: session }: { data: any } = useSession()

  const getBalance = useCallback(
    async (handleSetMax: boolean = false) => {
      const currentBalance = fromSun(await tronWeb.trx.getBalance(session.user.name))
      setBalance(currentBalance)
      !handleSetMax || setMax(currentBalance)
    },
    [session?.user?.name]
  )

  const handleClick = useCallback(async () => {
    setShowSendTransactionDialog(true)
  }, [])

  const handleOnClose = useCallback(
    async value => {
      setShowSendTransactionDialog(false)

      if (value) {
        if (contractProject?.stage === StageEnum.PENDING) {
          await method('activateProject', [project.contractAddress], toSun(value))
        } else {
          await method('donate', [], toSun(value), project.contractAddress)
        }
      }
    },
    [project.contractAddress]
  )

  useEffect(() => {
    if (session && contractProject?.stage !== StageEnum.ENDED) {
      if (contractProject?.stage === StageEnum.PENDING) {
        const availableAmount = contractProjectActivator?.project?.activateSize - contractProjectActivator?.project?.activatedAmount
        const maxAmount =
          contractProjectActivator?.project?.activateSize / contractProjectActivator?.project?.numActivators - contractProjectActivator?.activatedAmount

        setMax(maxAmount > availableAmount ? availableAmount : maxAmount)
        getBalance()
      } else {
        getBalance(true)
      }
      setDisplayButton(true)
      setButtonText(contractProject?.stage === StageEnum.PENDING ? 'activate' : 'donateNow')
    } else {
      setDisplayButton(false)
    }
  }, [contractProject?.stage, contractProjectActivator?.activatedAmount, session])

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
                  <div className='btn btn-primary js-scroll-trigger' onClick={handleClick}>
                    {t(buttonText)}
                  </div>
                )}
              </div>
              <p>{project?.description || '/'}</p>
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
      {session && session.user.name.toLowerCase() === contractProject?.owner?.toLowerCase() && (
        <ProjectCreateSpendingRequest project={project} contractProject={contractProject} />
      )}{' '}
      {contractProject?.requests?.descriptions?.length > 0 && <ProjectSpendingRequests project={project} />}
      <Subscribe />
      <SendTransactionDialog
        title={buttonText}
        contentText={contractProject?.stage === StageEnum.PENDING ? 'project.activateContentText' : 'project.donateContentText'}
        open={showSendTransactionDialog}
        onClose={handleOnClose}
        balance={balance}
        min={contractProject?.minimumDonation}
        max={max}
      />
    </>
  )
}

export default ProjectDetail
