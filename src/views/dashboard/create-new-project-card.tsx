import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import { Card, Illustration } from '@web3uikit/core'
import { useRouter } from 'next/router'

const CreateNewProjectCard: React.FC = () => {
  const { t } = useTranslation('common')
  const router = useRouter()

  return (
    <div style={{ width: '250px' }}>
      <Card
        description={t('project.clickToCreateNew')}
        onClick={() => router.push('/dashboard/create-new-project')}
        title={t('project.text')}
        tooltipText={t('project.createNewTooltip')}
      >
        <div>
          <Illustration height='180px' logo='servers' width='100%' />
        </div>
      </Card>
    </div>
  )
}

export default CreateNewProjectCard
