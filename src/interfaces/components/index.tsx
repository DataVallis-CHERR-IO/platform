import React from 'react'
import { IProject } from '../api'

export type IProjectCardType = IProjectProps
export type IProjectDetailType = IProjectProps

export interface IProjectProps {
  project?: IProject
}

export interface IProjectsProps {
  projects?: IProject[]
}

export interface IDefaultProps extends IProjectsProps {
  children: React.ReactNode
}
