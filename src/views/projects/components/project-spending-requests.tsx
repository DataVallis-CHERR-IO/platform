import React, { useEffect, useMemo, useState } from 'react'
import StickyHeadTable from '../../../themes/components/data/sticky-head.table'
import useTranslation from 'next-translate/useTranslation'
import { useContractContext } from '../../../contexts/contract/provider'
import { fromSun, truncateAddress } from '../../../utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faThumbsUp, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { method } from '../../../modules/method'
import { IProject } from '../../../interfaces/api'
import { useSession } from 'next-auth/react'

interface IProjectSpendingRequests {
  project: IProject
}

const ProjectSpendingRequests: React.FC<IProjectSpendingRequests> = ({ project }) => {
  const { t } = useTranslation('common')
  const { projectContract } = useContractContext()
  const { data: session } = useSession()
  const [rows, setRows] = useState<any[]>([])
  const columns = useMemo(
    () => [
      { id: 'recipient', label: t('recipient'), width: 100 },
      { id: 'amount', label: t('value'), width: 100 },
      { id: 'description', label: t('description') },
      { id: 'completed', label: t('completed'), align: 'center', width: 50 },
      { id: 'numberOfVoters', label: t('numberOfVoters'), align: 'center', width: 120 },
      { id: 'vote', label: t('vote'), align: 'right', width: 100, ignore: !session || projectContract?.donations === 0 }
    ],
    []
  )
  const length = useMemo(() => projectContract?.requests?.descriptions?.length, [projectContract?.requests?.descriptions])

  const handleVote = async index => {
    await method('voteForRequest', [index], null, project.contractAddress)
  }

  const handleRequests = () => {
    const data = []
    for (let i = 0; i < length; i++) {
      data.push({
        recipient: truncateAddress(projectContract?.requests?.recipients[i]),
        amount: (
          <>
            <FontAwesomeIcon icon={faEthereum} /> {fromSun(projectContract?.requests?.amounts[i])}
          </>
        ),
        description: projectContract?.requests?.descriptions[i],
        completed: (
          <FontAwesomeIcon
            icon={projectContract?.requests?.completed[i] ? faCheck : faXmark}
            className={projectContract?.requests?.completed[i] ? 'color-success' : 'color-danger'}
            size='2x'
          />
        ),
        numberOfVoters: projectContract?.requests?.numberOfVoters[i].toString(),
        vote: !projectContract?.requests?.completed[i] && (
          <FontAwesomeIcon icon={faThumbsUp} onClick={() => handleVote(i)} className='color-info cursor-pointer' size='2x' />
        )
      })
    }

    setRows(data)
  }

  useEffect(() => {
    handleRequests()
  }, [projectContract?.requests?.numberOfVoters])

  return (
    <section className='section-3 pt-0'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12'>
            <StickyHeadTable columns={columns} rows={rows} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProjectSpendingRequests
