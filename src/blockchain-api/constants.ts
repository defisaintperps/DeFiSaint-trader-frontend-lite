export const ERC20_ABI = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name_',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'symbol_',
        type: 'string',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'subtractedValue',
        type: 'uint256',
      },
    ],
    name: 'decreaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'addedValue',
        type: 'uint256',
      },
    ],
    name: 'increaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];


export const LOB_ABI = [
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "_perpetualManagerAddr",
              "type": "address"
          },
          {
              "internalType": "uint24",
              "name": "_perpetualId",
              "type": "uint24"
          },
          {
              "internalType": "uint8",
              "name": "_iCancelBlockDelay",
              "type": "uint8"
          },
          {
              "internalType": "uint16",
              "name": "_postingFeeTbps",
              "type": "uint16"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "uint24",
              "name": "perpetualId",
              "type": "uint24"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "trader",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "bytes32",
              "name": "digest",
              "type": "bytes32"
          },
          {
              "indexed": false,
              "internalType": "string",
              "name": "reason",
              "type": "string"
          }
      ],
      "name": "ExecutionFailed",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "uint24",
              "name": "perpetualId",
              "type": "uint24"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "trader",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "address",
              "name": "referrerAddr",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "address",
              "name": "brokerAddr",
              "type": "address"
          },
          {
              "components": [
                  {
                      "internalType": "uint32",
                      "name": "flags",
                      "type": "uint32"
                  },
                  {
                      "internalType": "uint24",
                      "name": "iPerpetualId",
                      "type": "uint24"
                  },
                  {
                      "internalType": "uint16",
                      "name": "brokerFeeTbps",
                      "type": "uint16"
                  },
                  {
                      "internalType": "address",
                      "name": "traderAddr",
                      "type": "address"
                  },
                  {
                      "internalType": "address",
                      "name": "brokerAddr",
                      "type": "address"
                  },
                  {
                      "internalType": "address",
                      "name": "referrerAddr",
                      "type": "address"
                  },
                  {
                      "internalType": "bytes",
                      "name": "brokerSignature",
                      "type": "bytes"
                  },
                  {
                      "internalType": "int128",
                      "name": "fAmount",
                      "type": "int128"
                  },
                  {
                      "internalType": "int128",
                      "name": "fLimitPrice",
                      "type": "int128"
                  },
                  {
                      "internalType": "int128",
                      "name": "fTriggerPrice",
                      "type": "int128"
                  },
                  {
                      "internalType": "int128",
                      "name": "fLeverage",
                      "type": "int128"
                  },
                  {
                      "internalType": "uint64",
                      "name": "iDeadline",
                      "type": "uint64"
                  },
                  {
                      "internalType": "uint64",
                      "name": "createdTimestamp",
                      "type": "uint64"
                  },
                  {
                      "internalType": "uint64",
                      "name": "submittedBlock",
                      "type": "uint64"
                  }
              ],
              "indexed": false,
              "internalType": "struct IPerpetualOrder.Order",
              "name": "order",
              "type": "tuple"
          },
          {
              "indexed": false,
              "internalType": "bytes32",
              "name": "digest",
              "type": "bytes32"
          }
      ],
      "name": "PerpetualLimitOrderCreated",
      "type": "event"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "name": "allDigests",
      "outputs": [
          {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "uint256",
              "name": "page",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "limit",
              "type": "uint256"
          }
      ],
      "name": "allLimitDigests",
      "outputs": [
          {
              "internalType": "bytes32[]",
              "name": "",
              "type": "bytes32[]"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "bytes32",
              "name": "_digest",
              "type": "bytes32"
          },
          {
              "internalType": "bytes",
              "name": "_signature",
              "type": "bytes"
          },
          {
              "internalType": "bytes[]",
              "name": "_updateData",
              "type": "bytes[]"
          },
          {
              "internalType": "uint64[]",
              "name": "_publishTimes",
              "type": "uint64[]"
          }
      ],
      "name": "cancelOrder",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "name": "digestsOfTrader",
      "outputs": [
          {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "bytes32",
              "name": "_digest",
              "type": "bytes32"
          },
          {
              "internalType": "address",
              "name": "_referrerAddr",
              "type": "address"
          },
          {
              "internalType": "bytes[]",
              "name": "_updateData",
              "type": "bytes[]"
          },
          {
              "internalType": "uint64[]",
              "name": "_publishTimes",
              "type": "uint64[]"
          }
      ],
      "name": "executeOrder",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "bytes32[]",
              "name": "_digests",
              "type": "bytes32[]"
          },
          {
              "internalType": "address",
              "name": "_referrerAddr",
              "type": "address"
          },
          {
              "internalType": "bytes[]",
              "name": "_updateData",
              "type": "bytes[]"
          },
          {
              "internalType": "uint64[]",
              "name": "_publishTimes",
              "type": "uint64[]"
          }
      ],
      "name": "executeOrders",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "bytes32",
              "name": "_digest",
              "type": "bytes32"
          }
      ],
      "name": "getOrderStatus",
      "outputs": [
          {
              "internalType": "enum LimitOrderBook.OrderStatus",
              "name": "",
              "type": "uint8"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "trader",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "offset",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "limit",
              "type": "uint256"
          }
      ],
      "name": "getOrders",
      "outputs": [
          {
              "components": [
                  {
                      "internalType": "uint32",
                      "name": "flags",
                      "type": "uint32"
                  },
                  {
                      "internalType": "uint24",
                      "name": "iPerpetualId",
                      "type": "uint24"
                  },
                  {
                      "internalType": "uint16",
                      "name": "brokerFeeTbps",
                      "type": "uint16"
                  },
                  {
                      "internalType": "address",
                      "name": "traderAddr",
                      "type": "address"
                  },
                  {
                      "internalType": "address",
                      "name": "brokerAddr",
                      "type": "address"
                  },
                  {
                      "internalType": "address",
                      "name": "referrerAddr",
                      "type": "address"
                  },
                  {
                      "internalType": "bytes",
                      "name": "brokerSignature",
                      "type": "bytes"
                  },
                  {
                      "internalType": "int128",
                      "name": "fAmount",
                      "type": "int128"
                  },
                  {
                      "internalType": "int128",
                      "name": "fLimitPrice",
                      "type": "int128"
                  },
                  {
                      "internalType": "int128",
                      "name": "fTriggerPrice",
                      "type": "int128"
                  },
                  {
                      "internalType": "int128",
                      "name": "fLeverage",
                      "type": "int128"
                  },
                  {
                      "internalType": "uint64",
                      "name": "iDeadline",
                      "type": "uint64"
                  },
                  {
                      "internalType": "uint64",
                      "name": "createdTimestamp",
                      "type": "uint64"
                  },
                  {
                      "internalType": "uint64",
                      "name": "submittedBlock",
                      "type": "uint64"
                  }
              ],
              "internalType": "struct IPerpetualOrder.Order[]",
              "name": "orders",
              "type": "tuple[]"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "bytes32",
              "name": "digest",
              "type": "bytes32"
          }
      ],
      "name": "getSignature",
      "outputs": [
          {
              "internalType": "bytes",
              "name": "signature",
              "type": "bytes"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "bytes32",
              "name": "digest",
              "type": "bytes32"
          }
      ],
      "name": "getTrader",
      "outputs": [
          {
              "internalType": "address",
              "name": "trader",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "lastOrderHash",
      "outputs": [
          {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "trader",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "page",
              "type": "uint256"
          },
          {
              "internalType": "uint256",
              "name": "limit",
              "type": "uint256"
          }
      ],
      "name": "limitDigestsOfTrader",
      "outputs": [
          {
              "internalType": "bytes32[]",
              "name": "",
              "type": "bytes32[]"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
          }
      ],
      "name": "nextOrderHash",
      "outputs": [
          {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "numberOfAllDigests",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "trader",
              "type": "address"
          }
      ],
      "name": "numberOfDigestsOfTrader",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "numberOfOrderBookDigests",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "orderCount",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
          }
      ],
      "name": "orderOfDigest",
      "outputs": [
          {
              "internalType": "uint32",
              "name": "flags",
              "type": "uint32"
          },
          {
              "internalType": "uint24",
              "name": "iPerpetualId",
              "type": "uint24"
          },
          {
              "internalType": "uint16",
              "name": "brokerFeeTbps",
              "type": "uint16"
          },
          {
              "internalType": "address",
              "name": "traderAddr",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "brokerAddr",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "referrerAddr",
              "type": "address"
          },
          {
              "internalType": "bytes",
              "name": "brokerSignature",
              "type": "bytes"
          },
          {
              "internalType": "int128",
              "name": "fAmount",
              "type": "int128"
          },
          {
              "internalType": "int128",
              "name": "fLimitPrice",
              "type": "int128"
          },
          {
              "internalType": "int128",
              "name": "fTriggerPrice",
              "type": "int128"
          },
          {
              "internalType": "int128",
              "name": "fLeverage",
              "type": "int128"
          },
          {
              "internalType": "uint64",
              "name": "iDeadline",
              "type": "uint64"
          },
          {
              "internalType": "uint64",
              "name": "createdTimestamp",
              "type": "uint64"
          },
          {
              "internalType": "uint64",
              "name": "submittedBlock",
              "type": "uint64"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
          }
      ],
      "name": "orderSignature",
      "outputs": [
          {
              "internalType": "bytes",
              "name": "",
              "type": "bytes"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "perpManager",
      "outputs": [
          {
              "internalType": "contract IPerpetualManager",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "perpetualId",
      "outputs": [
          {
              "internalType": "uint24",
              "name": "",
              "type": "uint24"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "bytes32",
              "name": "_startAfter",
              "type": "bytes32"
          },
          {
              "internalType": "uint256",
              "name": "_numElements",
              "type": "uint256"
          }
      ],
      "name": "pollLimitOrders",
      "outputs": [
          {
              "components": [
                  {
                      "internalType": "uint32",
                      "name": "flags",
                      "type": "uint32"
                  },
                  {
                      "internalType": "uint24",
                      "name": "iPerpetualId",
                      "type": "uint24"
                  },
                  {
                      "internalType": "uint16",
                      "name": "brokerFeeTbps",
                      "type": "uint16"
                  },
                  {
                      "internalType": "address",
                      "name": "traderAddr",
                      "type": "address"
                  },
                  {
                      "internalType": "address",
                      "name": "brokerAddr",
                      "type": "address"
                  },
                  {
                      "internalType": "address",
                      "name": "referrerAddr",
                      "type": "address"
                  },
                  {
                      "internalType": "bytes",
                      "name": "brokerSignature",
                      "type": "bytes"
                  },
                  {
                      "internalType": "int128",
                      "name": "fAmount",
                      "type": "int128"
                  },
                  {
                      "internalType": "int128",
                      "name": "fLimitPrice",
                      "type": "int128"
                  },
                  {
                      "internalType": "int128",
                      "name": "fTriggerPrice",
                      "type": "int128"
                  },
                  {
                      "internalType": "int128",
                      "name": "fLeverage",
                      "type": "int128"
                  },
                  {
                      "internalType": "uint64",
                      "name": "iDeadline",
                      "type": "uint64"
                  },
                  {
                      "internalType": "uint64",
                      "name": "createdTimestamp",
                      "type": "uint64"
                  },
                  {
                      "internalType": "uint64",
                      "name": "submittedBlock",
                      "type": "uint64"
                  }
              ],
              "internalType": "struct IPerpetualOrder.Order[]",
              "name": "orders",
              "type": "tuple[]"
          },
          {
              "internalType": "bytes32[]",
              "name": "orderHashes",
              "type": "bytes32[]"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "components": [
                  {
                      "internalType": "uint32",
                      "name": "flags",
                      "type": "uint32"
                  },
                  {
                      "internalType": "uint24",
                      "name": "iPerpetualId",
                      "type": "uint24"
                  },
                  {
                      "internalType": "uint16",
                      "name": "brokerFeeTbps",
                      "type": "uint16"
                  },
                  {
                      "internalType": "address",
                      "name": "traderAddr",
                      "type": "address"
                  },
                  {
                      "internalType": "address",
                      "name": "brokerAddr",
                      "type": "address"
                  },
                  {
                      "internalType": "address",
                      "name": "referrerAddr",
                      "type": "address"
                  },
                  {
                      "internalType": "bytes",
                      "name": "brokerSignature",
                      "type": "bytes"
                  },
                  {
                      "internalType": "int128",
                      "name": "fAmount",
                      "type": "int128"
                  },
                  {
                      "internalType": "int128",
                      "name": "fLimitPrice",
                      "type": "int128"
                  },
                  {
                      "internalType": "int128",
                      "name": "fTriggerPrice",
                      "type": "int128"
                  },
                  {
                      "internalType": "int128",
                      "name": "fLeverage",
                      "type": "int128"
                  },
                  {
                      "internalType": "uint64",
                      "name": "iDeadline",
                      "type": "uint64"
                  },
                  {
                      "internalType": "uint64",
                      "name": "createdTimestamp",
                      "type": "uint64"
                  },
                  {
                      "internalType": "uint64",
                      "name": "submittedBlock",
                      "type": "uint64"
                  }
              ],
              "internalType": "struct IPerpetualOrder.Order",
              "name": "_order",
              "type": "tuple"
          },
          {
              "internalType": "bytes",
              "name": "_signature",
              "type": "bytes"
          }
      ],
      "name": "postOrder",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "components": [
                  {
                      "internalType": "uint32",
                      "name": "flags",
                      "type": "uint32"
                  },
                  {
                      "internalType": "uint24",
                      "name": "iPerpetualId",
                      "type": "uint24"
                  },
                  {
                      "internalType": "uint16",
                      "name": "brokerFeeTbps",
                      "type": "uint16"
                  },
                  {
                      "internalType": "address",
                      "name": "traderAddr",
                      "type": "address"
                  },
                  {
                      "internalType": "address",
                      "name": "brokerAddr",
                      "type": "address"
                  },
                  {
                      "internalType": "address",
                      "name": "referrerAddr",
                      "type": "address"
                  },
                  {
                      "internalType": "bytes",
                      "name": "brokerSignature",
                      "type": "bytes"
                  },
                  {
                      "internalType": "int128",
                      "name": "fAmount",
                      "type": "int128"
                  },
                  {
                      "internalType": "int128",
                      "name": "fLimitPrice",
                      "type": "int128"
                  },
                  {
                      "internalType": "int128",
                      "name": "fTriggerPrice",
                      "type": "int128"
                  },
                  {
                      "internalType": "int128",
                      "name": "fLeverage",
                      "type": "int128"
                  },
                  {
                      "internalType": "uint64",
                      "name": "iDeadline",
                      "type": "uint64"
                  },
                  {
                      "internalType": "uint64",
                      "name": "createdTimestamp",
                      "type": "uint64"
                  },
                  {
                      "internalType": "uint64",
                      "name": "submittedBlock",
                      "type": "uint64"
                  }
              ],
              "internalType": "struct IPerpetualOrder.Order[]",
              "name": "_orders",
              "type": "tuple[]"
          },
          {
              "internalType": "bytes[]",
              "name": "_signatures",
              "type": "bytes[]"
          }
      ],
      "name": "postOrders",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
          }
      ],
      "name": "prevOrderHash",
      "outputs": [
          {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  }
];
