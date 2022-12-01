import React, { useCallback, useRef, useState } from 'react'
import path from 'path'
import Dropzone from '../../../themes/ui/drop-zone'
import TextField from '../../../themes/components/inputs/text-field.input'
import useTranslation from 'next-translate/useTranslation'
import { deploy } from '../../../modules/deploy'
import { useMutation } from 'react-query'
import { paramCase } from 'param-case'
import { notify } from '../../../utils/notify'
import { getBase64, getWei } from '../../../utils'
import { apolloClient } from '../../../clients/graphql'
import { MUTATION_UPLOAD } from '../../../constants/queries/upload'
import { MUTATION_NEW_PROJECT } from '../../../constants/queries/contract/cherrio-project-activator'
import { MUTATION_CREATE_PROJECT } from '../../../constants/queries/database/project'
import { MUTATION_CREATE_PROJECT_MEDIA } from '../../../constants/queries/database/project-media'
import { Backdrop, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { IProjectType } from '../../../interfaces/api'
import { MediaTypeEnum } from '../../../enums/media-type.enum'
import * as _ from 'lodash'

interface ICreateNewProjectProps {
  projectTypes: IProjectType[]
}

const CreateNewProjectComponent: React.FC<ICreateNewProjectProps> = ({ projectTypes }) => {
  const { t } = useTranslation('common')
  const [title, setTitle] = useState<string>('')
  const [excerpt, setExcerpt] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [goal, setGoal] = useState<string>('')
  const [duration, setDuration] = useState<string>('')
  const [types, setTypes] = useState<any>([])
  const [files, setFiles] = useState<any[]>([])
  const [open, setOpen] = React.useState<boolean>(false)
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

  const createProjectMedia = variables =>
    apolloClient.mutate({
      mutation: MUTATION_CREATE_PROJECT_MEDIA,
      variables
    })

  const { mutateAsync: createProjectMutation } = useMutation(createProject)
  const { mutateAsync: createProjectMediaMutation } = useMutation(createProjectMedia)
  const { mutateAsync: newProjectMutation } = useMutation(newProject)
  const { mutateAsync: uploadMutation } = useMutation(upload)

  const handleCreateOnClick = useCallback(
    async event => {
      event.preventDefault()

      if (!formRef.current.checkValidity()) {
        formRef.current.reportValidity()
        return
      }

      if (!files.length) {
        notify(t('uploadAtLeastOneImage'), 'warning')
        return
      }

      setOpen(true)

      const contract = await deploy([getWei(goal), duration])

      if (contract?.address) {
        const uploadedFiles = _.cloneDeep(files)
        const defaultFile = uploadedFiles.splice(
          uploadedFiles.findIndex(file => file.isDefault),
          1
        )[0]

        const image = (
          await uploadMutation({
            title: paramCase(defaultFile.name.split(path.extname(defaultFile.name)).shift()),
            extension: path.extname(defaultFile.name),
            content: await getBase64(defaultFile)
          })
        ).data.upload

        const projectTypesSelected = projectTypes.filter((projectType: IProjectType) => types.includes(projectType.id))

        const project = (
          await createProjectMutation({
            title,
            excerpt,
            description,
            slug: paramCase(title),
            image,
            contractAddress: contract.address,
            goal: getWei(goal),
            duration: Number(duration),
            projectTypes: projectTypesSelected
          })
        ).data.createProject

        for (const file of uploadedFiles) {
          const media = (
            await uploadMutation({
              title: paramCase(file.name.split(path.extname(file.name)).shift()),
              extension: path.extname(file.name),
              content: await getBase64(file)
            })
          ).data.upload

          await createProjectMediaMutation({
            projectId: project.id,
            mediaTypeId: MediaTypeEnum.IMAGE,
            name: paramCase(file.name.split(path.extname(file.name)).shift()),
            path: media
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
        setGoal('')
        setDuration('')
        setTypes([])
        setFiles([])
      }

      setOpen(false)
    },
    [title, excerpt, description, goal, duration, types, files]
  )

  return (
    <>
      <section className='section-1'>
        <div className='container'>
          <div className='row ml-0 mr-0'>
            <form ref={formRef}>
              <h2>{t('project.createNew')}</h2>
              <div className='row'>
                <div className='col-md-6 mb-5'>
                  <TextField id='title' label={t('title')} value={title} onChange={data => setTitle(data)} minLength={4} maxLength={32} />
                </div>
                <div className='col-md-6 mb-5'>
                  <TextField id='excerpt' label={t('excerpt')} value={excerpt} onChange={data => setExcerpt(data)} minLength={4} maxLength={64} />
                </div>
                <div className='col-md-12 mb-5'>
                  <TextField
                    id='description'
                    label={t('description')}
                    value={description}
                    onChange={data => setDescription(data)}
                    multiline={true}
                    rows={4}
                    minLength={4}
                  />
                </div>
                <div className='col-md-4 mb-5'>
                  <TextField id='goal' label={t('goal')} type='number' value={goal} onChange={data => setGoal(data)} />
                </div>
                <div className='col-md-4 mb-5'>
                  <TextField id='duration' label={t('durationInDays')} type='number' value={duration} onChange={data => setDuration(data)} />
                </div>
                <div className='col-md-4 mb-5'>
                  <FormControl variant='standard' fullWidth={true}>
                    <InputLabel id='projectTypesLabel'>{t('projectType.text')}</InputLabel>
                    <Select
                      required
                      labelId='projectTypesLabel'
                      id='projectTypes'
                      multiple={true}
                      value={types}
                      onChange={event => setTypes(event.target.value)}
                      label='projectType.text'
                    >
                      {!!projectTypes?.length &&
                        projectTypes.map((projectType: IProjectType) => (
                          <MenuItem key={projectType.id} value={projectType.id}>
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
                  <Button onClick={handleCreateOnClick} variant='contained' color='success'>
                    {t('create')}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </>
  )
}

export default CreateNewProjectComponent
