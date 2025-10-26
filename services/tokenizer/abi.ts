export const TOKENIZER_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "uint64",
            name: "fraction",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "softCap",
            type: "uint64",
          },
          {
            internalType: "uint16",
            name: "repaymentTime",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "possibleReturn",
            type: "uint16",
          },
          {
            internalType: "bytes32",
            name: "user",
            type: "bytes32",
          },
          {
            internalType: "string",
            name: "url",
            type: "string",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
        ],
        internalType: "struct ITokenizer.CreationParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "createFraction",
    outputs: [
      {
        internalType: "address",
        name: "instance",
        type: "address",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint128",
        name: "",
        type: "uint128",
      },
    ],
    name: "createdInstances",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "fallbackParams",
    outputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "fraction",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "softCap",
        type: "uint64",
      },
      {
        internalType: "uint16",
        name: "repaymentTime",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "possibleReturn",
        type: "uint16",
      },
      {
        internalType: "bytes32",
        name: "user",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "url",
        type: "string",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pool",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newManager",
        type: "address",
      },
    ],
    name: "setNewmanager",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pk",
        type: "address",
      },
    ],
    name: "unWhiteListUser",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pk",
        type: "address",
      },
    ],
    name: "whiteListLima",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pk",
        type: "address",
      },
    ],
    name: "whiteListUser",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "whiteListed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const
