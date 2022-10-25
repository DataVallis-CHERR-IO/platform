export const getCherrioProjectActivatorAbi = (): any[] => [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'project', type: 'address' },
      { indexed: false, internalType: 'address', name: 'activator', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }
    ],
    name: 'ActivateProject',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'project', type: 'address' },
      { indexed: false, internalType: 'address', name: 'activator', type: 'address' }
    ],
    name: 'NewActivator',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'project', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'activateSize', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'numActivators', type: 'uint256' },
      { indexed: false, internalType: 'enum CherrioProjectActivator.Stages', name: 'stage', type: 'uint8' }
    ],
    name: 'NewProject',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'oldOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' }
    ],
    name: 'OwnerSet',
    type: 'event'
  },
  { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'project', type: 'address' }], name: 'ProjectActivated', type: 'event' },
  { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'project', type: 'address' }], name: 'SendRefundAndReward', type: 'event' },
  {
    inputs: [{ internalType: 'address', name: '_address', type: 'address' }],
    name: 'activateProject',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'changeOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_address', type: 'address' },
      { internalType: 'address', name: '_activator', type: 'address' }
    ],
    name: 'getActivatedAmount',
    outputs: [{ internalType: 'uint256', name: 'activatedAmount', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_address', type: 'address' }],
    name: 'getActivators',
    outputs: [{ internalType: 'address[]', name: 'activators', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function'
  },
  { inputs: [], name: 'getBalance', outputs: [{ internalType: 'uint256', name: '_balance', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'getOwner', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
  {
    inputs: [
      { internalType: 'address', name: '_address', type: 'address' },
      { internalType: 'uint256', name: '_activateSize', type: 'uint256' },
      { internalType: 'uint256', name: '_numActivators', type: 'uint256' },
      { internalType: 'enum CherrioProjectActivator.Stages', name: '_stage', type: 'uint8' }
    ],
    name: 'newProject',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'projects',
    outputs: [
      { internalType: 'enum CherrioProjectActivator.Stages', name: 'stage', type: 'uint8' },
      { internalType: 'bool', name: 'flag', type: 'bool' },
      { internalType: 'bool', name: 'rewarded', type: 'bool' },
      { internalType: 'uint256', name: 'numActivators', type: 'uint256' },
      { internalType: 'uint256', name: 'activateSize', type: 'uint256' },
      { internalType: 'uint256', name: 'activatedAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'reward', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  { inputs: [], name: 'reward', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'sendReward', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [{ internalType: 'address', name: '_address', type: 'address' }],
    name: 'sendRewardManually',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  { inputs: [], name: 'token', outputs: [{ internalType: 'contract ICherrioToken', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }
]
