export const getCherrioProjectAbi = (): any[] => [
  {
    inputs: [
      { internalType: 'uint256', name: '_duration', type: 'uint256' },
      { internalType: 'uint256', name: '_goal', type: 'uint256' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'string', name: 'description', type: 'string' },
      { indexed: false, internalType: 'address', name: 'recipient', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }
    ],
    name: 'CreateSpendingRequest',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'donor', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }
    ],
    name: 'Donation',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'index', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }
    ],
    name: 'MakePayment',
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
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'startedAt', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'deadline', type: 'uint256' }
    ],
    name: 'ProjectActivated',
    type: 'event'
  },
  { anonymous: false, inputs: [], name: 'ProjectEnded', type: 'event' },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'index', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'numberOfVoters', type: 'uint256' }
    ],
    name: 'VoteForRequest',
    type: 'event'
  },
  { inputs: [], name: 'activate', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [], name: 'admin', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'changeOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  { inputs: [], name: 'cherrioProjectActivator', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
  {
    inputs: [
      { internalType: 'string', name: '_description', type: 'string' },
      { internalType: 'address', name: '_recipient', type: 'address' },
      { internalType: 'uint256', name: '_value', type: 'uint256' }
    ],
    name: 'createSpendingRequest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  { inputs: [], name: 'deadline', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'donate', outputs: [], stateMutability: 'payable', type: 'function' },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'donations',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  { inputs: [], name: 'duration', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'endedAt', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'getCurrentTime', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'getOwner', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'getRefund', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [{ internalType: 'uint256', name: 'index', type: 'uint256' }],
    name: 'getRequest',
    outputs: [
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'bool', name: 'completed', type: 'bool' },
      { internalType: 'uint256', name: 'numberOfVoters', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getRequests',
    outputs: [
      { internalType: 'string[]', name: 'descriptions', type: 'string[]' },
      { internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
      { internalType: 'address[]', name: 'recipients', type: 'address[]' },
      { internalType: 'bool[]', name: 'completed', type: 'bool[]' },
      { internalType: 'uint256[]', name: 'numberOfVoters', type: 'uint256[]' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  { inputs: [], name: 'goal', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ internalType: 'uint256', name: 'index', type: 'uint256' }], name: 'makePayment', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [], name: 'minimumDonation', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'numRequests', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'raisedAmount', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'requests',
    outputs: [
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'bool', name: 'completed', type: 'bool' },
      { internalType: 'uint256', name: 'numberOfVoters', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '_value', type: 'uint256' }],
    name: 'setMinimumDonation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  { inputs: [], name: 'stage', outputs: [{ internalType: 'enum CherrioProject.Stages', name: '', type: 'uint8' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'startedAt', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'totalDonations', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'totalDonors', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' },
  {
    inputs: [{ internalType: 'uint256', name: 'index', type: 'uint256' }],
    name: 'voteForRequest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  { stateMutability: 'payable', type: 'receive' }
]
