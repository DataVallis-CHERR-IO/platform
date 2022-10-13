import React, { useRef, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import Input from '../../../themes/ui/forms/input'
import TextArea from '../../../themes/ui/forms/text-area'
import Select from '../../../themes/ui/forms/select'
import { Button } from '@web3uikit/core'
import { ethers } from 'ethers'
import { IProjectType } from '../../../interfaces/api'
import { deploy } from '../../../modules/deploy'
import { useMutation } from 'react-query'
import { apolloClient } from '../../../clients/graphql'
import { MUTATION_CREATE_PROJECT } from '../../../constants/queries/moralis/project'
import { paramCase } from 'param-case'
import { notify } from '../../../utils/notify'
import { MUTATION_CREATE_PROJECT_DETAIL } from '../../../constants/queries/moralis/project-detail'

interface ICreateNewProjectProps {
  projectTypes: IProjectType[]
}

const CreateNewProjectComponent: React.FC<ICreateNewProjectProps> = ({ projectTypes }) => {
  const { t } = useTranslation('common')
  const [title, setTitle] = useState<string>('')
  const [excerpt, setExcerpt] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [requirements, setRequirements] = useState<string>('')
  const [goal, setGoal] = useState<string>('')
  const [types, setTypes] = useState<IProjectType[]>([])
  const formRef = useRef<HTMLFormElement>(null)

  const createProject = variables =>
    apolloClient.mutate({
      mutation: MUTATION_CREATE_PROJECT,
      variables
    })

  const createProjectDetail = variables =>
    apolloClient.mutate({
      mutation: MUTATION_CREATE_PROJECT_DETAIL,
      variables
    })

  const { mutateAsync: createProjectMutation } = useMutation(createProject)
  const { mutateAsync: createProjectDetailMutation } = useMutation(createProjectDetail)

  const create = async event => {
    event.preventDefault()

    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity()

      return
    }

    if (types.length === 0) {
      notify(t('fillOutAllRequiredFields'), 'warning')

      return
    }

    // formRef.current.reset()
    // formRef.current = null
    // setTitle('')
    // setExcerpt('')
    // setDescription('')
    // setGoal('')
    // setTypes([])

    const contract = await deploy([50320, ethers.utils.parseUnits(goal, 'gwei').toString()])

    if (contract) {
      const project = await createProjectMutation({
        title,
        excerpt,
        slug: paramCase(title),
        goal: Number(goal),
        image: '/img/campaign1.png',
        contractAddress: contract.address
      })

      if (project) {
        await createProjectDetailMutation({
          projectId: project.data.createProject._id,
          description,
          requirements
        })

        notify(t('successfullyCreated'))
      }
    }
  }

  return (
    <section className='section-1'>
      <div className='container'>
        <div className='row'>
          <div className='section-dashboard'>
            <div className='container-fluid p-0'>
              <section className='resume-section p-3 p-lg-5' id='about'>
                <form ref={formRef}>
                  <h1>{t('project.createNew')}</h1>
                  <p>{t('project.createNewDescription')}</p>
                  <div className='row'>
                    <div className='col-md-6 mb-5'>
                      <Input label='title' id='title' validation={{ required: true }} setValue={setTitle} />
                    </div>
                    <div className='col-md-6 mb-5'>
                      <Input label='excerpt' id='excerpt' validation={{ required: true }} setValue={setExcerpt} />
                    </div>
                    <div className='col-md-12 mb-5'>
                      <TextArea
                        label='description'
                        id='description'
                        placeholder='project.description'
                        validation={{ required: true }}
                        setValue={setDescription}
                      />
                    </div>
                    <div className='col-md-12 mb-5'>
                      <TextArea label='requirements' id='requirements' placeholder='project.requirements' setValue={setRequirements} />
                    </div>
                    <div className='col-md-6 mb-5'>
                      <Select
                        isMulti
                        isSearch
                        label='projectType.text'
                        max={3}
                        name='projectType'
                        validation={{ required: true }}
                        options={projectTypes}
                        placeholder='chooseAtLeastOneOption'
                        tryBeta
                        setValue={setTypes}
                      />
                    </div>
                    <div className='col-md-6 mb-5'>
                      <Input label='goal' validation={{ required: true }} setValue={setGoal} type='number' />
                    </div>
                  </div>
                  <div className='row section-profile'>
                    <div className='col-md-12'>
                      <Button onClick={create} text={t('create')} theme='primary' />
                    </div>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreateNewProjectComponent
