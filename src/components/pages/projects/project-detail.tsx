import React, { useEffect, useState } from 'react'
import moment from 'moment/moment'
import ProjectCountdown from '../../../views/projects/components/project-countdown'
import useTranslation from 'next-translate/useTranslation'
import Subscribe from '../../../views/subscribe'
import ProjectDocuments from '../../../views/projects/components/project-documents'
import ProjectMedia from '../../../views/projects/components/project-media'
import Image from 'next/image'
import ProjectContribution from '../../../views/projects/components/project-contribution'
import { IProject, IProjectDetail } from '../../../interfaces/api'
import { useQuery } from 'react-query'
import { apolloClient } from '../../../clients/graphql'
import { QUERY_PROJECT_DETAIL } from '../../../constants/queries/moralis/project-detail'
import { Loading } from '@web3uikit/core'

interface IProjectDetailProps {
  project: IProject
}

const ProjectDetail: React.FC<IProjectDetailProps> = ({ project }) => {
  const { t } = useTranslation('common')
  const [projectDetail, setProjectDetail] = useState<IProjectDetail>(null)
  const [displayDonateBtn, setDisplayDonateBtn] = useState<boolean>(true)

  const { data, isLoading } = useQuery(
    ['projectDetail'],
    async () => {
      return (
        await apolloClient.query({
          query: QUERY_PROJECT_DETAIL,
          variables: {
            projectId: project._id
          }
        })
      ).data.projectDetail
    },
    {
      onError: error => {
        console.log('❌ GraphQL error (query subscribers): ', error)
      }
    }
  )

  useEffect(() => {
    if (displayDonateBtn && (moment().isAfter(moment(project.endedAt, 'x')) || moment().isBefore(moment(project.startedAt, 'x')))) {
      setDisplayDonateBtn(false)
    }
    !data || setProjectDetail(data)
  }, [data, displayDonateBtn])

  // 0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0 MATIC CONTRACT
  const donate = async () => {
    // sending 0.5 tokens with 18 decimals
    // const options = {
    //   type: 'erc20',
    //   amount: Moralis.Units.Token('0.001', 18),
    //   receiver: '0xAAe3b0B628E1b8918a0F0C648f5FAc3cDFe61C9e',
    //   contractAddress: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0'
    // }
    // await Moralis.enableWeb3({
    //   provider: 'metamask'
    // })
    // const result = await Moralis.transfer(options)
    // console.log(result);
    // const { data } = await axios.get('/api/contracts/deploy', {
    //   headers: {
    //     'content-type': 'application/json'
    //   }
    // })
    //
    // console.log(data)
    // const contract = await deployFundRaising();
    // console.log(contract.address);
    // if (!isConnected) {
    //     notify(t('metamaskConnectMissing'), 'warning');
    //     return;
    // }
    // console.log('isConnected', isConnected);
    // ETH SEND
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();
    // const tx = await signer.sendTransaction({
    //     to: '0xAAe3b0B628E1b8918a0F0C648f5FAc3cDFe61C9e',
    //     value: ethers.utils.parseEther('0.2'),
    //
    // });
    // console.log(tx);
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();
    // const contract = new ethers.Contract(project.contractAddress, getMaticAbi(), provider);
    //
    // console.log(signer);
    // await token.connect(signer).transfer('0xAAe3b0B628E1b8918a0F0C648f5FAc3cDFe61C9e', 20000000);
    //
    // const token = new ethers.Contract('0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', abi, signer);
    // await token.('0xAAe3b0B628E1b8918a0F0C648f5FAc3cDFe61C9e', ethers.utils.parseEther('0.2'))
    // KURAC
    // console.log(ethers.utils.parseEther('0.2'));
    // // console.log(ethers.utils.('0.2'));
    // console.log(ethers.utils.parseUnits("0.2", 18));
    // const target = '0x78b881eB26Db03B49239DB7cd7b2c92f95d9D63C';
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const accounts = await provider.send("eth_requestAccounts", []);
    // console.log(accounts);
    // const token = new ethers.Contract('0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', abi, provider);
    // const signed = token.connect(provider.getSigner());
    // await signed.transfer('0xAAe3b0B628E1b8918a0F0C648f5FAc3cDFe61C9e', '20000000000000000');
    // await signed.transfer(target, ethers.utils.parseEther('1'));
    //  MaticToken
    // const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    // const funToken = await ethers.getContractAt('FunToken', contractAddress);
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
                  <ProjectCountdown startedAt={project.startedAt} endedAt={project.endedAt} />
                  <ProjectContribution project={project} />
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
                {displayDonateBtn && (
                  <div className='btn btn-primary js-scroll-trigger' onClick={donate}>
                    {t('donateNow')}
                  </div>
                )}
              </div>
              {!isLoading ? <p>{projectDetail?.description || '/'}</p> : <Loading size={12} spinnerColor='#FFFFFF' spinnerType='wave' />}
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
              {!isLoading ? <p>{projectDetail?.requirements || '/'}</p> : <Loading size={12} spinnerColor='#FFFFFF' spinnerType='wave' />}
            </div>
          </div>
        </div>
      </section>
      <ProjectMedia projectId={project._id} /> <ProjectDocuments projectId={project._id} /> <Subscribe />
    </>
  )
}

export default ProjectDetail
