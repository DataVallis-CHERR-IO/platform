import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import StickyHeadTable from '../../../themes/components/data/sticky-head.table'
import useTranslation from 'next-translate/useTranslation'
import { useContractContext } from '../../../contexts/contract/provider'
import { fromSun, truncateAddress } from '../../../utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faThumbsUp, faXmark } from '@fortawesome/free-solid-svg-icons'
import { method } from '../../../modules/method'
import { IProject } from '../../../interfaces/api'
import { useSession } from 'next-auth/react'

interface IProjectSpendingRequests {
  project: IProject
}

const ProjectSpendingRequests: React.FC<IProjectSpendingRequests> = ({ project }) => {
  const { t } = useTranslation('common')
  const { contractProject } = useContractContext()
  const { data: session } = useSession()
  const [rows, setRows] = useState<any[]>([])
  const columns = useMemo(
    () => [
      { id: 'recipient', label: t('recipient'), width: 100 },
      { id: 'amount', label: t('value'), width: 100 },
      { id: 'description', label: t('description') },
      { id: 'completed', label: t('completed'), align: 'center', width: 50 },
      { id: 'numberOfVoters', label: t('numberOfVoters'), align: 'center', width: 120 },
      {
        id: 'vote',
        label: t('vote'),
        align: 'right',
        width: 100,
        ignore:
          !session ||
          session.user.name.toLowerCase() === contractProject.owner?.toLowerCase() ||
          contractProject.donations === 0 ||
          contractProject.requests?.voted
      }
    ],
    [contractProject.requests?.voted]
  )
  const length = useMemo(() => contractProject.requests?.descriptions?.length, [contractProject.requests?.descriptions])

  const handleVote = useCallback(
    async index => {
      await method('voteForRequest', [index], null, project.contractAddress)
    },
    [project.contractAddress]
  )

  const handleRequests = useCallback(() => {
    const data = []
    for (let i = 0; i < length; i++) {
      data.push({
        recipient: truncateAddress(contractProject.requests?.recipients[i]),
        amount: (
          <>
            <Image src='/img/tron-black.png' width={14} height={14} /> {fromSun(contractProject.requests?.values[i]?.toString())}
          </>
        ),
        description: contractProject.requests?.descriptions[i],
        completed: (
          <FontAwesomeIcon
            icon={contractProject.requests?.completed[i] ? faCheck : faXmark}
            className={contractProject.requests?.completed[i] ? 'color-success' : 'color-danger'}
            size='2x'
          />
        ),
        numberOfVoters: contractProject.requests?.numVoters[i]?.toString(),
        vote: !contractProject.requests?.completed[i] && (
          <FontAwesomeIcon icon={faThumbsUp} onClick={() => handleVote(i)} className='color-info cursor-pointer' size='2x' />
        )
      })
    }

    setRows(data)
  }, [contractProject])

  useEffect(() => {
    handleRequests()
  }, [contractProject.requests?.numVoters])

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
