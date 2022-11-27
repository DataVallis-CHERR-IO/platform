export interface IProject {
  id?: number
  title?: string
  excerpt?: string
  description?: string
  image?: string
  slug?: string
  contractAddress?: string
  goal?: number
  duration?: number
}

export interface IProjectType {
  id?: number
  lkName?: string
}

export interface IProjectMedia {
  id?: number
  projectId?: number
  mediaTypeId?: number
  name?: string
  path?: string
  image?: string
  icon?: string
  statusId?: number
  uploadedAt?: any
  deletedAt?: any
}
