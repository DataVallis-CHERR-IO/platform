import { IProject, IWalletTransaction } from '../api'
import React from 'react'

export interface IProjectProps {
  project?: IProject
}

export interface ICampaignsProps {
  campaigns?: IProject[]
}

export interface IDefaultProps extends ICampaignsProps {
  children: React.ReactNode
}

export type ICampaignCardProps = IProjectProps

export type ICampaignDetailProps = IProjectProps

export type ICampaignContributionProps = IProjectProps

export interface ICampaignCountdownProps {
  startedAt: string
  endedAt: string
}

export interface ICampaignProgressProps {
  balance: number
  progress: number
}

export interface ICampaignDocumentProps {
  campaignId: string
}

export interface ICampaignImageProps {
  campaignId: string
}

export interface IUseTransactionsRes {
  transactions: IWalletTransaction[]
}
