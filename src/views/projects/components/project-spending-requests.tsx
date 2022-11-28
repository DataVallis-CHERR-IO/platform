import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ProjectsTable from '../../../themes/components/data/data.table'
import useTranslation from 'next-translate/useTranslation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tooltip } from '@mui/material'
import { useContractContext } from '../../../contexts/contract/provider'
import { getEther, truncateAddress } from '../../../utils'
import { notify } from '../../../utils/notify'
import { method } from '../../../modules/method'
import { getCherrioProjectAbi } from '../../../contracts/abi/cherrio-project'
import { useSessionContext } from '../../../contexts/session/provider'
import { faCheck, faThumbsUp, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { IProject } from '../../../interfaces/api'
import * as _ from 'lodash'

interface IProjectSpendingRequestsProps {
  project: IProject
}

const ProjectSpendingRequests: React.FC<IProjectSpendingRequestsProps> = ({ project }) => {
  const { t } = useTranslation('common')
  const { account } = useSessionContext()
  const { contractProject } = useContractContext()
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
          account?.toLowerCase() === contractProject.owner?.toLowerCase() || contractProject?.donations === 0 || contractProject?.requests?.votes?.length === 0
      }
    ],
    [contractProject?.requests?.votes]
  )
  const length = useMemo(() => contractProject?.requests?.descriptions?.length, [contractProject?.requests?.descriptions])

  const handleVoteOnCLick = useCallback(
    async index => {
      if (_.get(contractProject, `requests.votes[${index}]`, false)) {
        notify(t('project.youHaveAlreadyVoted'), 'info')
        return
      }

      await method('voteForRequest', [index], null, project.contractAddress, getCherrioProjectAbi())
    },
    [project.contractAddress]
  )

  const handleRequests = useCallback(() => {
    const data = []

    for (let index = 0; index < length; index++) {
      data.push({
        recipient: truncateAddress(contractProject?.requests?.recipients[index]),
        amount: (
          <>
            <FontAwesomeIcon icon={faEthereum} /> {getEther(contractProject?.requests?.values[index]?.toString())}
          </>
        ),
        description: contractProject?.requests?.descriptions[index],
        completed: (
          <FontAwesomeIcon
            icon={contractProject?.requests?.completed[index] ? faCheck : faXmark}
            className={contractProject?.requests?.completed[index] ? 'color-success' : 'color-danger'}
            size='2x'
          />
        ),
        numberOfVoters: contractProject?.requests?.numVoters[index]?.toString(),
        vote: !contractProject?.requests?.completed[index] && (
          <Tooltip title={_.get(contractProject, `requests.votes[${index}]`, false) ? t('project.alreadyVoted') : t('project.clickToVote')}>
            <FontAwesomeIcon
              icon={faThumbsUp}
              onClick={() => handleVoteOnCLick(index)}
              className={'cursor-pointer ' + (_.get(contractProject, `requests.votes[${index}]`, false) ? 'color-success' : 'color-info')}
              size='2x'
            />
          </Tooltip>
        )
      })
    }

    setRows(data)
  }, [contractProject])

  useEffect(() => {
    handleRequests()
  }, [contractProject?.requests?.numVoters])

  return (
    <section className='section-3 pt-0'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12'>
            <ProjectsTable columns={columns} rows={rows} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProjectSpendingRequests
