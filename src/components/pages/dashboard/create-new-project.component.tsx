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
import Dropzone from '../../../themes/ui/drop-zone'
import { getBase64 } from '../../../modules/get-base64'
import { MUTATION_CREATE_PROJECT_MEDIA } from '../../../constants/queries/moralis/project-media'
import { MUTATION_UPLOAD } from '../../../constants/queries/upload'
import * as _ from 'lodash'

interface ICreateNewProjectProps {
  projectTypes: IProjectType[]
}

const CreateNewProjectComponent: React.FC<ICreateNewProjectProps> = ({ projectTypes }) => {
  const { t } = useTranslation('common')
  const [title, setTitle] = useState<string>('')
  const [titleState, setTitleState] = useState()
  const [excerpt, setExcerpt] = useState<string>('')
  const [excerptState, setExcerptState] = useState()
  const [description, setDescription] = useState<string>('')
  const [requirements, setRequirements] = useState<string>('')
  const [goal, setGoal] = useState<string>('')
  const [goalState, setGoalState] = useState()
  const [duration, setDuration] = useState<string>('')
  const [durationState, setDurationState] = useState()
  const [types, setTypes] = useState<IProjectType[]>([])
  const [files, setFiles] = useState<any[]>([])
  const formRef = useRef<HTMLFormElement>(null)

  const upload = variables =>
    apolloClient.mutate({
      mutation: MUTATION_UPLOAD,
      variables
    })

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

  const createProjectMedia = variables =>
    apolloClient.mutate({
      mutation: MUTATION_CREATE_PROJECT_MEDIA,
      variables
    })

  const { mutateAsync: uploadMutation } = useMutation(upload)
  const { mutateAsync: createProjectMutation } = useMutation(createProject)
  const { mutateAsync: createProjectDetailMutation } = useMutation(createProjectDetail)
  const { mutateAsync: createProjectMediaMutation } = useMutation(createProjectMedia)

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

    if (!files.length) {
      notify(t('uploadAtLeastOneImage'), 'warning')
      return
    }

    const contract = await deploy([duration, ethers.utils.parseUnits(goal, 'gwei').toString()])

    if (contract) {
      const uploadedFiles = _.cloneDeep(files)
      const defaultFile = uploadedFiles.splice(
        uploadedFiles.findIndex(file => file.isDefault),
        1
      )[0]

      const image = (
        await uploadMutation({
          title: paramCase(defaultFile.name),
          content: await getBase64(defaultFile)
        })
      ).data.upload

      const project = (
        await createProjectMutation({
          contractAddress: contract.address,
          slug: paramCase(title),
          goal: Number(goal),
          title,
          excerpt,
          image
        })
      ).data.createProject

      await createProjectDetailMutation({
        projectId: project._id,
        description,
        requirements
      })

      for (const file of uploadedFiles) {
        const splitType = file.type.split('/')
        await createProjectMediaMutation({
          projectId: project._id,
          title: paramCase(file.name),
          content: await getBase64(file),
          type: splitType[0],
          format: splitType[1]
        })
      }

      notify(t('project.successfullyCreated'))

      setTitle('')
      setTitleState(null)
      setExcerpt('')
      setExcerptState(null)
      setDescription('')
      setRequirements('')
      setGoal('')
      setGoalState(null)
      setDuration('')
      setDurationState(null)
      setFiles([])
      Array.from(document.querySelectorAll('textarea')).forEach(textarea => (textarea.value = ''))
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
                      <Input label='title' id='title' validation={{ required: false }} state={titleState} value={title} setValue={[setTitle, setTitleState]} />
                    </div>
                    <div className='col-md-6 mb-5'>
                      <Input
                        label='excerpt'
                        id='excerpt'
                        validation={{ required: false }}
                        state={excerptState}
                        value={excerpt}
                        setValue={[setExcerpt, setExcerptState]}
                      />
                    </div>
                    <div className='col-md-12 mb-5'>
                      <TextArea
                        label='description'
                        id='description'
                        placeholder='project.description'
                        validation={{ required: false }}
                        value={description}
                        setValue={setDescription}
                        // myRef={divRef}
                        // onChangeValue={value => setDescription(value as any)}
                      />
                    </div>
                    <div className='col-md-12 mb-5'>
                      <TextArea
                        label='requirements'
                        id='requirements'
                        placeholder='project.requirements'
                        value={requirements}
                        setValue={setRequirements}
                        // onChange={setRequirements}
                        ignoreStates={true}
                      />
                    </div>
                    <div className='col-md-4 mb-5'>
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
                        value={types}
                        setValue={setTypes}
                      />
                    </div>
                    <div className='col-md-4 mb-5'>
                      <Input label='goal' validation={{ required: true }} state={goalState} value={goal} setValue={[setGoal, setGoalState]} type='number' />
                    </div>
                    <div className='col-md-4 mb-5'>
                      <Input
                        label='durationInDays'
                        id='duration'
                        validation={{ required: true }}
                        state={durationState}
                        value={duration}
                        setValue={[setDuration, setDurationState]}
                        type='number'
                      />
                    </div>
                    <div className='col-md-12 mb-5'>
                      <Dropzone multiple={true} uploadedFiles={files} onDropFiles={setFiles} onChangeFiles={setFiles} />
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
