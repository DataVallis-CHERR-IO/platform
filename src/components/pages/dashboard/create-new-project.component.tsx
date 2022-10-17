import React, { createRef, RefObject, useRef, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import Input from '../../../themes/ui/forms/input'
import TextArea from '../../../themes/ui/forms/text-area'
import Select from '../../../themes/ui/forms/select'
import { Button, Upload } from '@web3uikit/core'
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
  divRef: RefObject<HTMLTextAreaElement>
}

const CreateNewProjectComponent: React.FC<ICreateNewProjectProps> = ({ projectTypes, divRef }) => {
  const { t } = useTranslation('common')
  const [title, setTitle] = useState<string>('')
  const [titleState, setTitleState] = useState()
  const [excerpt, setExcerpt] = useState<string>('')
  const [excerptState, setExcerptState] = useState()
  const [description, setDescription] = useState<string>('')
  const [requirements, setRequirements] = useState()
  const [goal, setGoal] = useState<string>('')
  const [goalState, setGoalState] = useState()
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

  // divRef = useRef<HTMLTextAreaElement>(null)
  divRef = useRef<HTMLTextAreaElement>(null)

  const { mutateAsync: createProjectMutation } = useMutation(createProject)
  const { mutateAsync: createProjectDetailMutation } = useMutation(createProjectDetail)

  const create = async event => {
    event.preventDefault()
    // setDescription('')

    // if (!formRef.current.checkValidity()) {
    //   formRef.current.reportValidity()
    //   return
    // }

    // if (types.length === 0) {
    //   notify(t('fillOutAllRequiredFields'), 'warning')
    //   return
    // }
    console.log(description)
    console.log(divRef)

    // divRef.current.value = ''

    // setTitle('')
    // setTitleState(null)
    // setExcerpt('')
    // setExcerptState(null)
    // setDescription('')
    // setRequirements('')
    // setGoal('')
    // setGoalState(null)
    // setTypes([])

    // Array.from(document.querySelectorAll("textarea")).forEach(
    //   textarea => (textarea.value = ''),
    //   // input => (input.value = '')
    //   // input => (input.value = "")
    //   // te
    // );
    // const contract = await deploy([50320, ethers.utils.parseUnits(goal, 'gwei').toString()])

    // if (contract) {
    // const project = await createProjectMutation({
    //   title,
    //   excerpt,
    //   slug: paramCase(title),
    //   goal: Number(goal),
    //   image: '/img/campaign3.png',
    //   contractAddress: '0x79655382A961fa6C9448A78BF508D3E57FB0D24E'
    // })
    //
    // if (project) {
    //   await createProjectDetailMutation({
    //     projectId: project.data.createProject._id,
    //     description,
    //     requirements
    //   })
    //
    //   notify(t('project.successfullyCreated'))
    // }
    // }
  }

  const state = {
    file: null,
    base64URL: ""
  };

  const getBase64 = file => {
    return new Promise(resolve => {
      let fileInfo;
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        console.log("Called", reader);
        baseURL = reader.result;
        console.log(baseURL);
        resolve(baseURL);
      };
      console.log(fileInfo);
    });
  };

  const handleUpload = event => {
    console.log(event.target.files[0]);
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
                        // onChange={event => setDescription(event.target.value)}
                      />
                    </div>
                    <div className='col-md-12 mb-5'>
                      <TextArea
                        label='requirements'
                        id='requirements'
                        placeholder='project.requirements'
                        value={requirements}
                        setValue={setRequirements}
                        onChange={setRequirements}
                        ignoreStates={true}
                      />
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
                        value={types}
                        setValue={setTypes}
                      />
                    </div>
                    <div className='col-md-6 mb-5'>
                      <Input label='goal' validation={{ required: false }} state={goalState} value={goal} setValue={[setGoal, setGoalState]} type='number' />
                    </div>
                    <div className='col-md-12 mb-5'>
                      <Upload onChange={handleUpload} theme='withIcon' />
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
