import React, { useRef, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
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
import { MUTATION_CREATE_PROJECT_MEDIA } from '../../../constants/queries/moralis/project-media'
import { MUTATION_UPLOAD } from '../../../constants/queries/upload'
import * as _ from 'lodash'
import { MUTATION_NEW_PROJECT } from '../../../constants/queries/contract/cherrio-project-activator'
import { FadeLoader } from 'react-spinners'
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { getBase64 } from '../../../utils'

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
  const [duration, setDuration] = useState<string>('')
  const [types, setTypes] = useState<any>([])
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)

  const upload = variables =>
    apolloClient.mutate({
      mutation: MUTATION_UPLOAD,
      variables
    })

  const newProject = variables =>
    apolloClient.mutate({
      mutation: MUTATION_NEW_PROJECT,
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
  const { mutateAsync: newProjectMutation } = useMutation(newProject)
  const { mutateAsync: createProjectMutation } = useMutation(createProject)
  const { mutateAsync: createProjectDetailMutation } = useMutation(createProjectDetail)
  const { mutateAsync: createProjectMediaMutation } = useMutation(createProjectMedia)

  const handleCreate = async event => {
    event.preventDefault()

    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity()
      return
    }

    if (!files.length) {
      notify(t('uploadAtLeastOneImage'), 'warning')
      return
    }

    setLoading(true)

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

      await newProjectMutation({
        contractAddress: contract.address,
        goal: Number(goal)
      })

      notify(t('project.successfullyCreated'))

      setTitle('')
      setExcerpt('')
      setDescription('')
      setRequirements('')
      setGoal('')
      setDuration('')
      setTypes([])
      setFiles([])
      Array.from(document.querySelectorAll('textarea')).forEach(textarea => (textarea.value = ''))
    }

    setLoading(false)
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
                      <TextField
                        required
                        label={t('title')}
                        id='title'
                        variant='standard'
                        fullWidth={true}
                        value={title}
                        onChange={event => setTitle(event.target.value)}
                      />
                    </div>
                    <div className='col-md-6 mb-5'>
                      <TextField
                        required
                        label={t('excerpt')}
                        id='excerpt'
                        variant='standard'
                        fullWidth={true}
                        value={excerpt}
                        onChange={event => setExcerpt(event.target.value)}
                      />
                    </div>
                    <div className='col-md-12 mb-5'>
                      <TextField
                        required
                        label={t('description')}
                        multiline={true}
                        rows={4}
                        id='description'
                        variant='standard'
                        fullWidth={true}
                        value={description}
                        onChange={event => setDescription(event.target.value)}
                      />
                    </div>
                    <div className='col-md-12 mb-5'>
                      <TextField
                        label={t('requirements')}
                        multiline={true}
                        rows={4}
                        id='requirements'
                        variant='standard'
                        fullWidth={true}
                        value={requirements}
                        onChange={event => setRequirements(event.target.value)}
                      />
                    </div>
                    <div className='col-md-4 mb-5'>
                      <TextField
                        required
                        label={t('goal')}
                        id='goal'
                        variant='standard'
                        fullWidth={true}
                        value={goal}
                        onChange={event => setGoal(event.target.value)}
                        type='number'
                      />
                      {/*<Input label='goal' validation={{ required: true }} state={goalState} value={goal} setValue={[setGoal, setGoalState]} type='number' />*/}
                    </div>
                    <div className='col-md-4 mb-5'>
                      <TextField
                        required
                        label={t('durationInDays')}
                        id='duration'
                        variant='standard'
                        fullWidth={true}
                        value={duration}
                        onChange={event => setDuration(event.target.value)}
                        type='number'
                      />
                    </div>
                    <div className='col-md-4 mb-5'>
                      <FormControl variant='standard' fullWidth={true}>
                        <InputLabel id='projectTypesLabel'>{t('projectType.text')}</InputLabel>
                        <Select
                          labelId='projectTypesLabel'
                          id='projectTypes'
                          multiple={true}
                          value={types}
                          onChange={event => setTypes(event.target.value)}
                          label='projectType.text'
                        >
                          {!!projectTypes.length &&
                            projectTypes.map((projectType: IProjectType) => (
                              <MenuItem key={projectType._id} value={projectType._id}>
                                {t(`projectType.${projectType.lkName}`)}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className='col-md-12 mb-5'>
                      <Dropzone multiple={true} uploadedFiles={files} onDropFiles={setFiles} onChangeFiles={setFiles} />
                    </div>
                  </div>
                  <div className='row section-profile'>
                    <div className='col-md-12'>
                      {!loading ? (
                        <Button onClick={handleCreate} variant='contained' color='success'>
                          {t('create')}
                        </Button>
                      ) : (
                        <FadeLoader color='#CA354C' loading={loading} />
                      )}
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
