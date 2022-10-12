export interface IApiModel {
  _id?: string
  createdAt?: any
  updatedAt?: any
}

export interface IProject extends IApiModel {
  title?: string
  description?: string
  image?: string
  goal?: string
  slug?: string
  isHighlightedProject?: number
  contractAddress?: string
  statusId?: number
  startedAt?: any
  endedAt?: any
}

export interface IProjectDetail extends IApiModel {
  _id?: string
  requirements?: string
  description?: string
}

export interface IProjectDocument extends IApiModel {
  campaignId?: string
  title?: string
  path?: string
  format?: string
  icon?: string
  statusId?: number
  uploadedAt?: any
  deletedAt?: any
}

export interface IProjectImage extends IApiModel {
  campaignId?: string
  title?: string
  description?: string
  path?: string
  image?: string
  icon?: string
  statusId?: number
  uploadedAt?: any
  deletedAt?: any
}

export interface IProjectsContext {
  projects: IProject[]
}

export interface IWalletTransaction {
  block_hash?: string
  block_number?: string
  block_timestamp?: string
  from_address?: string
  gas?: string
  gas_price?: string
  hash?: string
  input?: string
  nonce?: string
  receipt_contract_address?: string
  receipt_cumulative_gas_used?: string
  receipt_gas_used?: string
  receipt_root?: string
  receipt_status?: string
  to_address?: string
  transaction_index?: string
  transfer_index?: number[]
  value?: string
}
