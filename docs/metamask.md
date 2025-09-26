================
CODE SNIPPETS
================
TITLE: Make Blast Network Call using Python
DESCRIPTION: Provides a Python example for making a JSON-RPC call to the Blast network using the `requests` library. It details the installation process and includes a Python script to fetch the block number.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/blast/quickstart.md#_snippet_3

LANGUAGE: bash
CODE:
```
pip install requests
```

LANGUAGE: python
CODE:
```
import requests
import json

url = "https://blast-mainnet.infura.io/v3/<YOUR-API-KEY>"

payload = {
  "jsonrpc": "2.0",
  "method": "eth_blockNumber",
  "params": [],
  "id": 1
}

headers = {"content-type": "application/json"}

response = requests.post(url, data=json.dumps(payload), headers=headers).json()

print(response)
```

LANGUAGE: bash
CODE:
```
python index.py
```

--------------------------------

TITLE: Manual SDK Setup and Initialization
DESCRIPTION: Install and initialize the MetaMask SDK manually in an existing JavaScript project.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/sdk/connect/javascript.md#_snippet_6

LANGUAGE: APIDOC
CODE:
```
## Manual SDK Setup

### 1. Install the SDK

Install the SDK in an existing JavaScript project:

```bash npm2yarn
npm install @metamask/sdk
```

### 2. Initialize the SDK

The following are examples of using the SDK in various JavaScript environments:

#### Web dapps

```javascript
import { MetaMaskSDK } from "@metamask/sdk"

const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: "Example JavaScript dapp",
    url: window.location.href,
    // iconUrl: "https://mydapp.com/icon.png" // Optional
  },
  infuraAPIKey: process.env.INFURA_API_KEY,
})
```

#### Pure JavaScript (CDN)

```html
<head>
  <script src="https://c0f4f41c-2f55-4863-921b-sdk-docs.github.io/cdn/metamask-sdk.js"></script>
  <script>
    const MMSDK = new MetaMaskSDK.MetaMaskSDK({
      dappMetadata: {
        name: "Example JavaScript dapp",
        url: window.location.href,
        // iconUrl: "https://mydapp.com/icon.png" // Optional
      },
      infuraAPIKey: process.env.INFURA_API_KEY,
    })
  </script>
</head>
```

**SDK Initialization Options:**

- `dappMetadata` (Object): Ensures trust by showing your dapp's `name`, `url`, and `iconUrl` during connection.
- `infuraAPIKey` (String): Enables read-only RPC and load-balancing.
```

--------------------------------

TITLE: Make Blast Network Call using Node.js (Axios)
DESCRIPTION: Details how to interact with the Blast network using Node.js and the `axios` library. It covers installing `axios` and provides a JavaScript code example for fetching the block number.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/blast/quickstart.md#_snippet_1

LANGUAGE: bash
CODE:
```
npm i axios
```

LANGUAGE: javascript
CODE:
```
const axios = require("axios")

axios
  .post("https://blast-mainnet.infura.io/v3/<YOUR-API-KEY>", {
    jsonrpc: "2.0",
    method: "eth_blockNumber",
    params: [],
    id: 1,
  })
  .then((response) => {
    console.log(response.data)
  })
  .catch((error) => {
    console.error(error)
  })
```

LANGUAGE: bash
CODE:
```
node index.js
```

--------------------------------

TITLE: Make JSON-RPC Call with Node.js (ethers)
DESCRIPTION: Demonstrates how to interact with the Hemi network using Node.js and the ethers library to get the latest block number. It covers package installation and the necessary JavaScript code.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/hemi/quickstart.md#_snippet_3

LANGUAGE: bash
CODE:
```
npm install ethers
```

LANGUAGE: javascript
CODE:
```
const ethers = require("ethers")

const provider = new ethers.providers.JsonRpcProvider(
  "https://hemi-testnet.infura.io/v3/<YOUR-API-KEY>"
)

provider
  .getBlockNumber()
  .then((blockNumber) => {
    console.log(blockNumber)
  })
  .catch((error) => {
    console.error(error)
  })
```

LANGUAGE: bash
CODE:
```
node index.js
```

--------------------------------

TITLE: Make Unichain Call with Web3.js
DESCRIPTION: Provides an example of retrieving the latest block number from the Unichain network using Node.js and the `web3.js` library. Ensure `web3.js` is installed. The fetched block number is logged to the console.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/unichain/quickstart.md#_snippet_4

LANGUAGE: javascript
CODE:
```
var { Web3 } = require("web3")
var provider = "https://unichain-mainnet.infura.io/v3/<YOUR-API-KEY>"
var web3Provider = new Web3.providers.HttpProvider(provider)
var web3 = new Web3(web3Provider)

web3.eth.getBlockNumber().then((result) => {
  console.log("Latest Unichain Block is ", result)
})
```

--------------------------------

TITLE: Run Web3Auth Multi-Chain Demo (Bash)
DESCRIPTION: This command clones a Web3Auth multi-chain demo project, navigates into its directory, installs dependencies, and starts the development server. It's a quick way to get started with the example.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/src/pages/tutorials/pnp-no-modal-multichain.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx degit Web3Auth/web3auth-pnp-examples/custom-authentication/multi-chain-example/ w3a-multi-chain-demo && cd w3a-multi-chain-demo && npm install && npm run dev
```

--------------------------------

TITLE: Install Ethers Package
DESCRIPTION: Installs the 'ethers' library using npm, a comprehensive JavaScript library for interacting with the Ethereum blockchain and related technologies.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/bnb-smart-chain/quickstart.md#_snippet_4

LANGUAGE: bash
CODE:
```
npm install ethers
```

--------------------------------

TITLE: Install Requests Library for Python
DESCRIPTION: Installs the 'requests' library for Python using pip, a simple HTTP library for making requests in Python.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/bnb-smart-chain/quickstart.md#_snippet_6

LANGUAGE: bash
CODE:
```
pip install requests
```

--------------------------------

TITLE: Setup using a template
DESCRIPTION: Download and set up the MetaMask SDK JavaScript quickstart template.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/sdk/connect/javascript.md#_snippet_5

LANGUAGE: APIDOC
CODE:
```
## Setup using a template

Download the [MetaMask SDK JavaScript template](https://github.com/MetaMask/metamask-sdk-examples/tree/main/quickstarts/javascript):

```bash
npx degit MetaMask/metamask-sdk-examples/quickstarts/javascript metamask-javascript
```

Navigate into the repository:

```bash
cd metamask-javascript
```

Install dependencies:

```bash
pnpm install
```

Run the project:

```bash
pnpm dev
```
```

--------------------------------

TITLE: Install MetaMask SDK (npm/yarn)
DESCRIPTION: Installs the MetaMask SDK package for JavaScript projects using npm or yarn. This is a prerequisite for manual setup.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/sdk/connect/javascript.md#_snippet_1

LANGUAGE: bash
CODE:
```
npm install @metamask/sdk
```

--------------------------------

TITLE: Start MetaMask Docs Development Server
DESCRIPTION: Starts the development server for the MetaMask documentation site, allowing for local preview. Requires dependencies to be installed via 'npm install'.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/README.md#_snippet_3

LANGUAGE: bash
CODE:
```
npm start
```

--------------------------------

TITLE: Make Arbitrum API Call using Node.js with ethers
DESCRIPTION: Shows how to interact with the Arbitrum network using Node.js and the ethers.js library. Requires installing the 'ethers' package. Uses JsonRpcProvider to get the latest block number.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/arbitrum/quickstart.md#_snippet_3

LANGUAGE: bash
CODE:
```
npm install ethers
```

LANGUAGE: javascript
CODE:
```
const ethers = require("ethers");

const provider = new ethers.providers.JsonRpcProvider("https://arbitrum-mainnet.infura.io/v3/<YOUR-API-KEY>");

provider.getBlockNumber()
.then(blockNumber => {
  console.log(blockNumber);
})
.catch(error => {
  console.error(error);
});
```

--------------------------------

TITLE: Clone MetaMask Embedded Wallets Swift/iOS Quickstart
DESCRIPTION: Clones the MetaMask Embedded Wallets Swift/iOS quickstart application using npx degit. This command downloads the example project to a local directory for further setup.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/src/pages/quickstart/builder/embedded-wallets/ios/stepContent/iOSQuickStart.mdx#_snippet_0

LANGUAGE: shell
CODE:
```
npx degit Web3Auth/web3auth-ios-examples/ios-quick-start w3a-ios-quick-start
```

--------------------------------

TITLE: Install Node-Fetch Package
DESCRIPTION: Installs the 'node-fetch' package using npm, which is a JavaScript library for making HTTP requests, commonly used in Node.js environments.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/bnb-smart-chain/quickstart.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm i node-fetch
```

--------------------------------

TITLE: Install Axios Package
DESCRIPTION: Installs the 'axios' package using npm, a popular JavaScript library for making HTTP requests from Node.js or browsers.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/bnb-smart-chain/quickstart.md#_snippet_2

LANGUAGE: bash
CODE:
```
npm i axios
```

--------------------------------

TITLE: Make Avalanche C-Chain API Call using Python
DESCRIPTION: This Python example demonstrates how to query the latest block number on the Avalanche C-Chain using the `requests` library. You need to install it using `pip install requests`. Replace `<YOUR-API-KEY>` with your Infura API key and execute the script.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/avalanche-c-chain/quickstart.md#_snippet_3

LANGUAGE: python
CODE:
```
import requests
import json

url = "https://avalanche-mainnet.infura.io/v3/<YOUR-API-KEY>"

payload = {
  "jsonrpc": "2.0",
  "method": "eth_blockNumber",
  "params": [],
  "id": 1
}

headers = {"content-type": "application/json"}

response = requests.post(url, data=json.dumps(payload), headers=headers).json()

print(response)
```

--------------------------------

TITLE: Make Arbitrum API Call using Node.js with node-fetch
DESCRIPTION: Provides a Node.js example for making a JSON-RPC call to Arbitrum using the node-fetch library. Requires installing the 'node-fetch' package. Sends a POST request with JSON payload to the Infura endpoint.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/arbitrum/quickstart.md#_snippet_1

LANGUAGE: bash
CODE:
```
npm i node-fetch
```

LANGUAGE: javascript
CODE:
```
import fetch from "node-fetch"

fetch("https://arbitrum-mainnet.infura.io/v3/<YOUR-API-KEY>", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    jsonrpc: "2.0",
    method: "eth_blockNumber",
    params: [],
    id: 1,
  }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
  })
  .catch((error) => {
    console.error(error)
  })
```

--------------------------------

TITLE: Start Snap Development Server
DESCRIPTION: Starts the development server for a MetaMask Snap project, serving the Snap and its front-end dapp.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/snaps/get-started/quickstart.md#_snippet_3

LANGUAGE: shell
CODE:
```
yarn start
```

--------------------------------

TITLE: Web3Auth v7 Implementation Example
DESCRIPTION: Demonstrates the setup and usage of Web3Auth in version 7, including manual configuration of chain details, multiple adapters (Openlogin, Metamask, WalletConnectV2), and SDK initialization. This example requires explicit setup for each wallet integration.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/embedded-wallets/sdk/js/migration-guides/modal/v7-to-v10/README.mdx#_snippet_5

LANGUAGE: typescript
CODE:
```
import { Web3Auth } from '@web3auth/modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { MetamaskAdapter } from '@web3auth/metamask-adapter'
import {
  WalletConnectV2Adapter,
  getWalletConnectV2Settings,
} from '@web3auth/wallet-connect-v2-adapter'

// Chain configuration
const chainConfig = {
  chainNamespace: 'eip155',
  chainId: '0x1',
  rpcTarget: 'https://rpc.ethereum.org',
  displayName: 'Ethereum Mainnet',
  blockExplorerUrl: 'https://etherscan.io/',
  ticker: 'ETH',
  tickerName: 'Ethereum',
  logo: 'https://images.toruswallet.io/eth.svg',
}

// Provider setup
const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
})

// SDK initialization
const web3auth = new Web3Auth({
  clientId: 'YOUR_CLIENT_ID',
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider,
  uiConfig: {
    appName: 'W3A Heroes',
    logoLight: 'https://web3auth.io/images/web3auth-logo.svg',
    logoDark: 'https://web3auth.io/images/web3auth-logo---Dark.svg',
  },
})

// OpenLogin adapter
const openloginAdapter = new OpenloginAdapter({
  loginSettings: {
    mfaLevel: 'optional',
  },
  adapterSettings: {
    whiteLabel: {
      appName: 'W3A Heroes',
      logoLight: 'https://web3auth.io/images/web3auth-logo.svg',
      logoDark: 'https://web3auth.io/images/web3auth-logo---Dark.svg',
    },
  },
})
web3auth.configureAdapter(openloginAdapter)

// External adapters
const metamaskAdapter = new MetamaskAdapter()
web3auth.configureAdapter(metamaskAdapter)

const defaultWcSettings = await getWalletConnectV2Settings('eip155', ['1'], 'projectId')
const walletConnectV2Adapter = new WalletConnectV2Adapter({
  adapterSettings: { qrcodeModal: WalletConnectModal, ...defaultWcSettings.adapterSettings },
  loginSettings: { ...defaultWcSettings.loginSettings },
})
web3auth.configureAdapter(walletConnectV2Adapter)

await web3auth.initModal()

// Usage
await web3auth.connect()
const idToken = await web3auth.authenticateUser()

```

--------------------------------

TITLE: Clone MetaMask SDK Examples Repository
DESCRIPTION: Clones the entire MetaMask SDK examples repository using Git. This alternative to degit allows access to all examples but downloads more data.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/sdk/connect/javascript-wagmi.md#_snippet_2

LANGUAGE: bash
CODE:
```
git clone https://github.com/MetaMask/metamask-sdk-examples
cd metamask-sdk-examples/quickstarts/wagmi
```

--------------------------------

TITLE: Make Arbitrum API Call using Python with requests
DESCRIPTION: Provides a Python example for making a JSON-RPC call to the Arbitrum network using the requests library. Requires installing the 'requests' library. Sends a POST request with a JSON payload to the Infura endpoint.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/arbitrum/quickstart.md#_snippet_4

LANGUAGE: bash
CODE:
```
pip install requests
```

LANGUAGE: python
CODE:
```
import requests
import json

url = "https://arbitrum-mainnet.infura.io/v3/<YOUR-API-KEY>"

payload = {
  "jsonrpc": "2.0",
  "method": "eth_blockNumber",
  "params": [],
  "id": 1
}

headers = {"content-type": "application/json"}

response = requests.post(url, data=json.dumps(payload), headers=headers).json()

print(response)
```

--------------------------------

TITLE: Install Web3Auth Modal SDK (npm/yarn)
DESCRIPTION: Installs the Web3Auth Modal SDK using either npm or yarn package managers. This is the first step to integrate Web3Auth into your web application.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/embedded-wallets/sdk/js/README.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm install --save @web3auth/modal

```

--------------------------------

TITLE: Clone MetaMask Examples Repository (Bash)
DESCRIPTION: Clones the entire MetaMask SDK examples repository from GitHub. This is an alternative to using degit for obtaining the project template.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/sdk/connect/javascript-web3auth.md#_snippet_2

LANGUAGE: bash
CODE:
```
git clone https://github.com/MetaMask/metamask-sdk-examples
cd metamask-sdk-examples/partners/web3auth
```

--------------------------------

TITLE: Clone MetaMask Embedded Wallets React Quickstart
DESCRIPTION: This command clones the React quickstart example for MetaMask Embedded Wallets using degit. It sets up a new project directory named 'w3a-quick-start' with the necessary example code.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/src/pages/quickstart/builder/embedded-wallets/react/stepContent/reactQuickStart.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx degit Web3Auth/web3auth-examples/quick-starts/react-quick-start w3a-quick-start
```

--------------------------------

TITLE: Make Optimism API Call using Node.js (Ethers)
DESCRIPTION: Demonstrates how to interact with the Optimism network using the Ethers.js library in Node.js. It requires installing 'ethers' and uses an Infura API key to get the latest block number via a JsonRpcProvider.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/optimism/quickstart.md#_snippet_2

LANGUAGE: bash
CODE:
```
npm install ethers
```

LANGUAGE: javascript
CODE:
```
const ethers = require("ethers")

const provider = new ethers.providers.JsonRpcProvider(
  "https://optimism-mainnet.infura.io/v3/<YOUR-API-KEY>"
)

provider
  .getBlockNumber()
  .then((blockNumber) => {
    console.log(blockNumber)
  })
  .catch((error) => {
    console.error(error)
  })
```

LANGUAGE: bash
CODE:
```
node index.js
```

--------------------------------

TITLE: Make Eth_BlockNumber Call with Python (Requests)
DESCRIPTION: Shows how to get the latest block number on the Base network using Python and the requests library. Requires pip installation of 'requests' and an Infura API key.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/base/quickstart.md#_snippet_4

LANGUAGE: python
CODE:
```
import requests
import json

url = "https://base-sepolia.infura.io/v3/<YOUR-API-KEY>"

payload = {
  "jsonrpc": "2.0",
  "method": "eth_blockNumber",
  "params": [],
  "id": 1
}

headers = {"content-type": "application/json"}

response = requests.post(url, data=json.dumps(payload), headers=headers).json()

print(response)
```

--------------------------------

TITLE: Make ETH Block Number Call using Node.js with Ethers
DESCRIPTION: This example shows how to get the latest block number on the Palm network using the 'ethers' library in Node.js. It requires installing 'ethers' via npm and setting up a JsonRpcProvider.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/palm/quickstart.md#_snippet_3

LANGUAGE: javascript
CODE:
```
const ethers = require("ethers")

const provider = new ethers.providers.JsonRpcProvider(
  "https://palm-mainnet.infura.io/v3/<YOUR-API-KEY>"
)

provider
  .getBlockNumber()
  .then((blockNumber) => {
    console.log(blockNumber)
  })
  .catch((error) => {
    console.error(error)
  })
```

--------------------------------

TITLE: Make Scroll Network Calls with Ethers.js
DESCRIPTION: This example shows how to get the latest block number on the Scroll network using the `ethers` library in Node.js. Install the `ethers` package and replace `<YOUR-API-KEY>` with your Infura API key to establish a connection and query the block number.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/scroll/quickstart.md#_snippet_2

LANGUAGE: javascript
CODE:
```
const ethers = require("ethers")

const provider = new ethers.providers.JsonRpcProvider(
  "https://scroll-mainnet.infura.io/v3/<YOUR-API-KEY>"
)

provider
  .getBlockNumber()
  .then((blockNumber) => {
    console.log(blockNumber)
  })
  .catch((error) => {
    console.error(error)
  })
```

--------------------------------

TITLE: Basic Web3Auth Configuration
DESCRIPTION: Demonstrates the basic configuration for creating a Web3Auth instance, specifying the Client ID and network. This is a fundamental setup for using the SDK.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/embedded-wallets/sdk/js/README.mdx#_snippet_3

LANGUAGE: javascript
CODE:
```
import { Web3Auth, WEB3AUTH_NETWORK } from '@web3auth/modal'

const web3auth = new Web3Auth({
  clientId: 'YOUR_CLIENT_ID',
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET, // or WEB3AUTH_NETWORK.SAPPHIRE_DEVNET
})
```

--------------------------------

TITLE: Instantiate and Start MetaMask Onboarding (JavaScript)
DESCRIPTION: Provides code examples for creating a new instance of the MetaMask onboarding library and initiating the onboarding process, typically in response to a user action like a button click.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/wallet/how-to/onboard-users.md#_snippet_2

LANGUAGE: javascript
CODE:
```
const onboarding = new MetaMaskOnboarding()

```

LANGUAGE: javascript
CODE:
```
onboarding.startOnboarding()

```

--------------------------------

TITLE: Install Dependencies
DESCRIPTION: Installs the `axios` package for making HTTP requests and the `dotenv` package for managing environment variables.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/gas-api/quickstart.md#_snippet_1

LANGUAGE: bash
CODE:
```
npm install axios
npm install dotenv
```

--------------------------------

TITLE: Install MetaMask and Dynamic SDK Dependencies
DESCRIPTION: Installs the necessary packages for integrating MetaMask SDK and Dynamic SDK into an existing project using npm. This includes core SDKs and related libraries for wagmi and state management.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/sdk/connect/javascript-dynamic.md#_snippet_5

LANGUAGE: bash
CODE:
```
npm install @dynamic-labs/sdk-react-core @dynamic-labs/ethereum @dynamic-labs/wagmi-connector wagmi viem @tanstack/react-query
```

--------------------------------

TITLE: Project Setup with Vite
DESCRIPTION: Commands to set up a new JavaScript project using Vite with the 'vanilla' template, navigate into the project directory, and install project dependencies.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/wallet/tutorials/javascript-dapp-simple.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm create vite@latest simple-dapp -- --template vanilla
cd simple-dapp
npm install
```

--------------------------------

TITLE: Make Ethereum Call via Node.js with Ethers
DESCRIPTION: This example shows how to get the latest Ethereum block number using the Ethers.js library in Node.js. It requires installing the 'ethers' package and your Infura API key. The code initializes a JsonRpcProvider and calls the getBlockNumber method.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/ethereum/quickstart.md#_snippet_2

LANGUAGE: javascript
CODE:
```
const ethers = require("ethers")

const provider = new ethers.providers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/<YOUR-API-KEY>"
)

provider
  .getBlockNumber()
  .then((blockNumber) => {
    console.log(blockNumber)
  })
  .catch((error) => {
    console.error(error)
  })
```

--------------------------------

TITLE: Run Project with pnpm dev
DESCRIPTION: Starts the development server for the project using pnpm. This command allows you to preview your dapp locally during development.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/sdk/connect/javascript-dynamic.md#_snippet_4

LANGUAGE: bash
CODE:
```
pnpm dev
```

--------------------------------

TITLE: Clone MetaMask SDK + Dynamic SDK Template using Degit
DESCRIPTION: Uses degit to clone the quickstart template repository for MetaMask SDK and Dynamic SDK integration. This is a faster way to get started than cloning the entire repository.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/sdk/connect/javascript-dynamic.md#_snippet_0

LANGUAGE: bash
CODE:
```
npx degit MetaMask/metamask-sdk-examples/partners/dynamic metamask-dynamic
```

--------------------------------

TITLE: POST /v3/<YOUR-API-KEY> (Sei Network)
DESCRIPTION: Make a POST request to the Sei Infura endpoint to interact with the network. This example retrieves the latest block number.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/sei/quickstart.md#_snippet_5

LANGUAGE: APIDOC
CODE:
```
## POST /v3/<YOUR-API-KEY>

### Description
This endpoint allows you to make JSON-RPC calls to the Sei network via Infura.

### Method
POST

### Endpoint
`https://sei-mainnet.infura.io/v3/<YOUR-API-KEY>`

### Parameters
#### Path Parameters
- **YOUR-API-KEY** (string) - Required - Your Infura API key.

#### Query Parameters
None

#### Request Body
- **jsonrpc** (string) - Required - Specifies the JSON-RPC version, typically "2.0".
- **method** (string) - Required - The JSON-RPC method to call (e.g., `eth_blockNumber`).
- **params** (array) - Optional - An array of parameters for the method.
- **id** (integer) - Required - A unique identifier for the request.

### Request Example
```json
{
  "jsonrpc": "2.0",
  "method": "eth_blockNumber",
  "params": [],
  "id": 1
}
```

### Response
#### Success Response (200)
- **jsonrpc** (string) - The JSON-RPC version.
- **result** (any) - The result of the JSON-RPC call. The type depends on the method called.
- **id** (integer) - The identifier for the request.

#### Response Example
```json
{
  "jsonrpc": "2.0",
  "result": "0x12345",
  "id": 1
}
```
```

--------------------------------

TITLE: Make JSON-RPC Call with Node.js (axios)
DESCRIPTION: Illustrates making a JSON-RPC call to the Hemi network using Node.js with the axios library. It includes instructions for installing axios and the corresponding JavaScript code.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/hemi/quickstart.md#_snippet_2

LANGUAGE: bash
CODE:
```
npm i axios
```

LANGUAGE: javascript
CODE:
```
const axios = require("axios")

axios
  .post("https://hemi-testnet.infura.io/v3/<YOUR-API-KEY>", {
    jsonrpc: "2.0",
    method: "eth_blockNumber",
    params: [],
    id: 1,
  })
  .then((response) => {
    console.log(response.data)
  })
  .catch((error) => {
    console.error(error)
  })
```

LANGUAGE: bash
CODE:
```
node index.js
```

--------------------------------

TITLE: Install Dependencies with pnpm
DESCRIPTION: Installs project dependencies using the pnpm package manager. This command is typically run after cloning a project template.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/sdk/connect/javascript-dynamic.md#_snippet_2

LANGUAGE: bash
CODE:
```
pnpm install
```

--------------------------------

TITLE: Initialize Project Directory
DESCRIPTION: Creates a new project directory, navigates into it, and initializes a new Node.js project with default settings.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/gas-api/quickstart.md#_snippet_0

LANGUAGE: bash
CODE:
```
mkdir new_project
cd new_project
npm init -y
```

--------------------------------

TITLE: Install Snap Project Dependencies
DESCRIPTION: Installs project dependencies for a MetaMask Snap project using Yarn.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/snaps/get-started/quickstart.md#_snippet_1

LANGUAGE: shell
CODE:
```
yarn install
```

--------------------------------

TITLE: Make eth_blockNumber call using Python Requests
DESCRIPTION: Provides a Python example to fetch the latest block number on ZKsync Era using the `requests` library. Users need to install `requests` via pip and replace the placeholder with their Infura API key.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/zksync/quickstart.md#_snippet_3

LANGUAGE: bash
CODE:
```
pip install requests
```

LANGUAGE: python
CODE:
```
import requests
import json

url = "https://zksync-mainnet.infura.io/v3/<YOUR-API-KEY>"

payload = {
  "jsonrpc": "2.0",
  "method": "eth_blockNumber",
  "params": [],
  "id": 1
}

headers = {"content-type": "application/json"}

response = requests.post(url, data=json.dumps(payload), headers=headers).json()

print(response)
```

LANGUAGE: bash
CODE:
```
python index.py
```

--------------------------------

TITLE: Clone MetaMask SDK Examples Repository using Git
DESCRIPTION: An alternative to degit, this command clones the entire MetaMask SDK examples repository and navigates into the specific directory for Dynamic SDK integration.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/sdk/connect/javascript-dynamic.md#_snippet_1

LANGUAGE: bash
CODE:
```
git clone https://github.com/MetaMask/metamask-sdk-examples
cd metamask-sdk-examples/partners/dynamic
```

--------------------------------

TITLE: Make eth_blockNumber call using Node.js Axios
DESCRIPTION: Provides an example of fetching the latest block number on ZKsync Era using Node.js and the `axios` library. Users need to install `axios` via npm and replace the placeholder with their Infura API key.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/zksync/quickstart.md#_snippet_1

LANGUAGE: bash
CODE:
```
npm i axios
```

LANGUAGE: javascript
CODE:
```
const axios = require("axios")

axios
  .post("https://zksync-mainnet.infura.io/v3/<YOUR-API-KEY>", {
    jsonrpc: "2.0",
    method: "eth_blockNumber",
    params: [],
    id: 1,
  })
  .then((response) => {
    console.log(response.data)
  })
  .catch((error) => {
    console.error(error)
  })
```

LANGUAGE: bash
CODE:
```
node index.js
```

--------------------------------

TITLE: Install Caddy (Bash)
DESCRIPTION: Installs the Caddy web server using Homebrew.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/tutorials/ethereum/use-infura-as-a-reverse-proxy/set-up-a-simple-reverse-proxy.md#_snippet_1

LANGUAGE: bash
CODE:
```
brew install caddy
```

--------------------------------

TITLE: Make eth_blockNumber call using Node.js (ethers)
DESCRIPTION: This Node.js example demonstrates how to get the latest block number on the Sei network using the 'ethers' library. It establishes a connection to the Infura endpoint and calls the getBlockNumber method.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/sei/quickstart.md#_snippet_3

LANGUAGE: javascript
CODE:
```
const ethers = require("ethers")

const provider = new ethers.providers.JsonRpcProvider(
  "https://sei-mainnet.infura.io/v3/<YOUR-API-KEY>"
)

provider
  .getBlockNumber()
  .then((blockNumber) => {
    console.log(blockNumber)
  })
  .catch((error) => {
    console.error(error)
  })
```

--------------------------------

TITLE: Make Scroll Network Calls with Node Fetch
DESCRIPTION: This example shows how to fetch the latest block number from the Scroll network using the `node-fetch` library in Node.js. You need to install the `node-fetch` package and replace `<YOUR-API-KEY>` with your Infura API key.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/scroll/quickstart.md#_snippet_0

LANGUAGE: javascript
CODE:
```
import fetch from "node-fetch"

fetch("https://scroll-mainnet.infura.io/v3/<YOUR-API-KEY>", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    jsonrpc: "2.0",
    method: "eth_blockNumber",
    params: [],
    id: 1,
  }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
  })
  .catch((error) => {
    console.error(error)
  })
```

--------------------------------

TITLE: Download MetaMask SDK JavaScript Template (Bash)
DESCRIPTION: Uses degit to download the MetaMask SDK JavaScript quickstart template. Assumes npx and degit are installed.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/sdk/connect/javascript.md#_snippet_0

LANGUAGE: bash
CODE:
```
npx degit MetaMask/metamask-sdk-examples/quickstarts/javascript metamask-javascript
cd metamask-javascript
pnpm install
pnpm dev
```

--------------------------------

TITLE: Make eth_blockNumber call using Node.js Ethers.js
DESCRIPTION: Demonstrates how to get the latest block number on the ZKsync Era network using the `ethers` library in Node.js. Requires installing the `ethers` package and providing an Infura API key.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/zksync/quickstart.md#_snippet_2

LANGUAGE: bash
CODE:
```
npm install ethers
```

LANGUAGE: javascript
CODE:
```
const ethers = require("ethers")

const provider = new ethers.providers.JsonRpcProvider(
  "https://zksync-mainnet.infura.io/v3/<YOUR-API-KEY>"
)

provider
  .getBlockNumber()
  .then((blockNumber) => {
    console.log(blockNumber)
  })
  .catch((error) => {
    console.error(error)
  })
```

LANGUAGE: bash
CODE:
```
node index.js
```

--------------------------------

TITLE: Download MetaMask SDK Wagmi Template
DESCRIPTION: Clones the MetaMask SDK Wagmi quickstart template using degit for a streamlined setup. Requires Node.js and a package manager.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/sdk/connect/javascript-wagmi.md#_snippet_0

LANGUAGE: bash
CODE:
```
npx degit MetaMask/metamask-sdk-examples/quickstarts/wagmi metamask-wagmi
```

--------------------------------

TITLE: Install SDK Dependencies (NPM/Yarn)
DESCRIPTION: Installs the necessary SDKs and libraries (viem, wagmi, @tanstack/react-query, @web3auth/modal) into an existing project.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/sdk/connect/javascript-web3auth.md#_snippet_5

LANGUAGE: bash
CODE:
```
npm install viem wagmi @tanstack/react-query @web3auth/modal@10
```

--------------------------------

TITLE: Make JSON-RPC Call with Python (requests)
DESCRIPTION: Provides Python code to make a JSON-RPC call to the Hemi network using the requests library. It includes instructions for installing the library and the complete Python script.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/hemi/quickstart.md#_snippet_4

LANGUAGE: bash
CODE:
```
pip install requests
```

LANGUAGE: python
CODE:
```
import requests
import json

url = "https://hemi-testnet.infura.io/v3/<YOUR-API-KEY>"

payload = {
  "jsonrpc": "2.0",
  "method": "eth_blockNumber",
  "params": [],
  "id": 1
}

headers = {"content-type": "application/json"}

response = requests.post(url, data=json.dumps(payload), headers=headers).json()

print(response)
```

LANGUAGE: bash
CODE:
```
python index.py
```

--------------------------------

TITLE: Make Optimism API Call using Node.js (Axios)
DESCRIPTION: Provides an example of making a JSON-RPC call to the Optimism network with Node.js using the Axios library. This involves installing 'axios' and sending a POST request with the block number method, utilizing an Infura API key.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/optimism/quickstart.md#_snippet_1

LANGUAGE: bash
CODE:
```
npm i axios
```

LANGUAGE: javascript
CODE:
```
const axios = require("axios")

axios
  .post("https://optimism-mainnet.infura.io/v3/<YOUR-API-KEY>", {
    jsonrpc: "2.0",
    method: "eth_blockNumber",
    params: [],
    id: 1,
  })
  .then((response) => {
    console.log(response.data)
  })
  .catch((error) => {
    console.error(error)
  })
```

LANGUAGE: bash
CODE:
```
node index.js
```

--------------------------------

TITLE: Create MetaMask Snap Project
DESCRIPTION: Initializes a new MetaMask Snap project using the create-snap starter kit. Supports Yarn, npx, and npm package managers.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/snaps/get-started/quickstart.md#_snippet_0

LANGUAGE: bash
CODE:
```
yarn create @metamask/snap your-snap-name
```

LANGUAGE: bash
CODE:
```
npx @metamask/snap your-snap-name
```

LANGUAGE: bash
CODE:
```
npm create @metamask/snap your-snap-name
```

--------------------------------

TITLE: Get block number from Linea using Node.js (Ethers)
DESCRIPTION: This Node.js example uses the 'ethers' library to connect to the Linea network via Infura and fetch the current block number. It requires an Infura API key for authentication.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/linea/quickstart.md#_snippet_2

LANGUAGE: javascript
CODE:
```
const ethers = require("ethers")

const provider = new ethers.providers.JsonRpcProvider(
  "https://linea-mainnet.infura.io/v3/<YOUR-API-KEY>"
)

provider
  .getBlockNumber()
  .then((blockNumber) => {
    console.log(blockNumber)
  })
  .catch((error) => {
    console.error(error)
  })
```

--------------------------------

TITLE: Setup Web3Auth Login and Logout Event Handlers in Unity
DESCRIPTION: This C# code provides a complete example of setting up the Web3Auth SDK within a Unity script. It includes initializing the component, configuring options, and attaching event handlers for successful login and logout actions, logging relevant information to the console.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/embedded-wallets/sdk/unity/README.mdx#_snippet_3

LANGUAGE: csharp
CODE:
```
void Start()
{
    web3Auth = GetComponent<Web3Auth>();
    web3Auth.setOptions(new Web3AuthOptions()
    {
        clientId = "YOUR_CLIENT_ID",
        network = Web3Auth.Network.SAPPHIRE_MAINNET,
        redirectUrl = new Uri("torusapp://com.torus.Web3AuthUnity/auth"),
    });

    // Set up event handlers
    web3Auth.onLogin += onLogin;
    web3Auth.onLogout += onLogout;
}

private void onLogin(Web3AuthResponse response)
{
    Debug.Log("Login successful!");
    Debug.Log("Private Key: " + response.privKey);
}

private void onLogout()
{
    Debug.Log("Logout successful!");
}
```

--------------------------------

TITLE: Configure Web3Auth Instance
DESCRIPTION: Creates a new Web3Auth instance with essential configuration, including the Client ID from the Web3Auth Dashboard and the desired network. This setup is crucial before initializing the SDK.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/embedded-wallets/sdk/js/README.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```
import { Web3Auth, WEB3AUTH_NETWORK } from '@web3auth/modal'

const web3auth = new Web3Auth({
  clientId: 'YOUR_CLIENT_ID', // Get your Client ID from Web3Auth Dashboard
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET, // or WEB3AUTH_NETWORK.SAPPHIRE_DEVNET
})
```

--------------------------------

TITLE: Install and Run Flutter Quick Start Project
DESCRIPTION: Navigates into the cloned project directory and provides instructions to run the application. The project can be run using Android Studio or VSCode.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/src/pages/quickstart/builder/embedded-wallets/flutter/stepContent/flutterQuickStart.mdx#_snippet_1

LANGUAGE: shell
CODE:
```
cd flutter-quick-start
### run project in Android Studio or in VSCode
```

--------------------------------

TITLE: Make Blast Network Call using Node.js (ethers)
DESCRIPTION: Explains how to use the `ethers` library in Node.js to connect to and query the Blast network. It includes steps for installation and a JavaScript code snippet to retrieve the current block number.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/blast/quickstart.md#_snippet_2

LANGUAGE: bash
CODE:
```
npm install ethers
```

LANGUAGE: javascript
CODE:
```
const ethers = require("ethers")

const provider = new ethers.providers.JsonRpcProvider(
  "https://blast-mainnet.infura.io/v3/<YOUR-API-KEY>"
)

provider
  .getBlockNumber()
  .then((blockNumber) => {
    console.log(blockNumber)
  })
  .catch((error) => {
    console.error(error)
  })
```

LANGUAGE: bash
CODE:
```
node index.js
```

--------------------------------

TITLE: Make Starknet Call using Python (requests)
DESCRIPTION: This Python example uses the 'requests' library to send a POST request to the Starknet network, retrieving the block number. It constructs the payload and headers, then prints the JSON response.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/starknet/quickstart.md#_snippet_3

LANGUAGE: bash
CODE:
```
pip install requests
```

LANGUAGE: python
CODE:
```
import requests
import json

url = "https://starknet-mainnet.infura.io/v3/<YOUR-API-KEY>"

payload = {
  "jsonrpc": "2.0",
  "method": "starknet_blockNumber",
  "params": [],
  "id": 1
}

headers = {"content-type": "application/json"}

response = requests.post(url, data=json.dumps(payload), headers=headers).json()

print(response)
```

LANGUAGE: bash
CODE:
```
python index.py
```

--------------------------------

TITLE: Install Web3Auth Unreal Engine SDK via Git Clone
DESCRIPTION: This snippet shows the bash command to clone the Web3Auth Unreal Engine SDK repository into the Plugins directory of an Unreal Engine project. This is a method for installing the SDK.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/embedded-wallets/sdk/unreal/README.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
git clone https://github.com/Web3Auth/web3auth-unreal-sdk/tree/main/Plugins/Web3AuthSDK ./Plugins/Web3AuthSDK
```

--------------------------------

TITLE: Make Avalanche C-Chain API Call using Node.js (Ethers)
DESCRIPTION: This snippet shows how to get the latest block number on the Avalanche C-Chain using the `ethers` library in Node.js. You'll need to install the library via `npm install ethers` and provide your Infura API key. It utilizes the `JsonRpcProvider` for making the call.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/avalanche-c-chain/quickstart.md#_snippet_2

LANGUAGE: javascript
CODE:
```
const ethers = require("ethers")

const provider = new ethers.providers.JsonRpcProvider(
  "https://avalanche-mainnet.infura.io/v3/<YOUR-API-KEY>"
)

provider
  .getBlockNumber()
  .then((blockNumber) => {
    console.log(blockNumber)
  })
  .catch((error) => {
    console.error(error)
  })
```

--------------------------------

TITLE: Make ETH Block Number Call using Node.js with node-fetch
DESCRIPTION: This Node.js example uses the 'node-fetch' library to make a POST request to the Infura API for the Palm network to retrieve the latest block number. Ensure 'node-fetch' is installed via npm.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/palm/quickstart.md#_snippet_1

LANGUAGE: javascript
CODE:
```
import fetch from "node-fetch"

fetch("https://palm-mainnet.infura.io/v3/<YOUR-API-KEY>", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    jsonrpc: "2.0",
    method: "eth_blockNumber",
    params: [],
    id: 1,
  }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
  })
  .catch((error) => {
    console.error(error)
  })
```

--------------------------------

TITLE: Make JSON-RPC Call with Node.js (node-fetch)
DESCRIPTION: Shows how to make a JSON-RPC call to the Hemi network using Node.js and the node-fetch library. It requires installing the package and provides the JavaScript code to send the request and handle the response.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/hemi/quickstart.md#_snippet_1

LANGUAGE: bash
CODE:
```
npm i node-fetch
```

LANGUAGE: javascript
CODE:
```
import fetch from "node-fetch"

fetch("https://hemi-testnet.infura.io/v3/<YOUR-API-KEY>", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    jsonrpc: "2.0",
    method: "eth_blockNumber",
    params: [],
    id: 1,
  }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
  })
  .catch((error) => {
    console.error(error)
  })
```

LANGUAGE: bash
CODE:
```
node index.js
```

--------------------------------

TITLE: Ethereum Integration: Get Balance (Swift)
DESCRIPTION: Provides a Swift code example for integrating with Ethereum using web3.swift. It demonstrates how to get the private key from Web3Auth, generate an Ethereum account, and fetch the ETH balance.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/embedded-wallets/sdk/ios/README.mdx#_snippet_8

LANGUAGE: swift
CODE:
```
import web3
import Web3Auth

// Use your Web3Auth instance to get the private key
val privateKey = web3Auth.getPrivKey()

// Generate the Ethereum Account
let account = try EthereumAccount(privateKey)

// Get the address
let address = account.address

// Create a client
let client = EthereumHttpClient(
    // Please avoid using public RPC URL in production, use services
    // like Infura, Quicknode, etc.
    url: URL.init(string: rpcUrl)!,
    // Replace with the chain id of the network you want to connect to
    network: .custom(chainId)
)

// Get the balance
let balanceResponse = try await client.eth_getBalance(
    // Use the address from previous step
    address: address,
    block: .Latest
)

// Convert the balance from Wei to Ether format
let balance = toEther(wei: balanceResponse)
```

--------------------------------

TITLE: Make Optimism API Call using Python (requests)
DESCRIPTION: Shows how to make a JSON-RPC call to the Optimism network using Python's requests library. It involves installing 'requests', defining the payload and headers, and sending a POST request with an Infura API key to get the block number.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/optimism/quickstart.md#_snippet_3

LANGUAGE: bash
CODE:
```
pip install requests
```

LANGUAGE: python
CODE:
```
import requests
import json

url = "https://optimism-mainnet.infura.io/v3/<YOUR-API-KEY>"

payload = {
  "jsonrpc": "2.0",
  "method": "eth_blockNumber",
  "params": [],
  "id": 1
}

headers = {"content-type": "application/json"}

response = requests.post(url, data=json.dumps(payload), headers=headers).json()

print(response)
```

LANGUAGE: bash
CODE:
```
python index.py
```

--------------------------------

TITLE: Install and use ethers for Celo API calls
DESCRIPTION: This snippet guides on installing the 'ethers' library and using it in Node.js to connect to the Celo network and fetch the latest block number. It demonstrates creating a JsonRpcProvider and calling the getBlockNumber method.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/celo/quickstart.md#_snippet_2

LANGUAGE: bash
CODE:
```
npm install ethers
```

LANGUAGE: javascript
CODE:
```
const ethers = require("ethers")

const provider = new ethers.providers.JsonRpcProvider(
  "https://celo-mainnet.infura.io/v3/<YOUR-API-KEY>"
)

provider
  .getBlockNumber()
  .then((blockNumber) => {
    console.log(blockNumber)
  })
  .catch((error) => {
    console.error(error)
  })
```

--------------------------------

TITLE: Install and use node-fetch for Celo API calls
DESCRIPTION: This snippet details the process of installing the 'node-fetch' package and using it in a Node.js script to make an API call to the Celo network. It shows how to send a POST request with JSON data to get the block number.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/celo/quickstart.md#_snippet_0

LANGUAGE: bash
CODE:
```
npm i node-fetch
```

LANGUAGE: javascript
CODE:
```
import fetch from "node-fetch"

fetch("https://celo-mainnet.infura.io/v3/<YOUR-API-KEY>", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    jsonrpc: "2.0",
    method: "eth_blockNumber",
    params: [],
    id: 1,
  }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
  })
  .catch((error) => {
    console.error(error)
  })
```

--------------------------------

TITLE: Make Unichain Call with Node Fetch
DESCRIPTION: Shows how to fetch the latest block number from the Unichain network using Node.js and the `node-fetch` library. Requires installing the `node-fetch` package and an Infura API key. Outputs the block number to the console.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/unichain/quickstart.md#_snippet_1

LANGUAGE: javascript
CODE:
```
import fetch from "node-fetch"

fetch("https://unichain-mainnet.infura.io/v3/<YOUR-API-KEY>", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    jsonrpc: "2.0",
    method: "eth_blockNumber",
    params: [],
    id: 1,
  }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
  })
  .catch((error) => {
    console.error(error)
  })
```

--------------------------------

TITLE: Make Starknet Call using Node.js (node-fetch)
DESCRIPTION: This Node.js example uses the 'node-fetch' package to make a POST request to the Starknet network. It sends a JSON payload to retrieve the block number and includes basic error handling.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/starknet/quickstart.md#_snippet_1

LANGUAGE: bash
CODE:
```
npm i node-fetch
```

LANGUAGE: javascript
CODE:
```
import fetch from "node-fetch"

fetch("https://starknet-mainnet.infura.io/v3/<YOUR-API-KEY>", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    jsonrpc: "2.0",
    method: "starknet_blockNumber",
    params: [],
    id: 1,
  }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
  })
  .catch((error) => {
    console.error(error)
  })
```

LANGUAGE: bash
CODE:
```
node index.js
```

--------------------------------

TITLE: Make Starknet Call using Node.js (Axios)
DESCRIPTION: This Node.js example utilizes the 'axios' library to perform a POST request to the Starknet network, fetching the block number. It includes a .then() for successful responses and a .catch() for errors.

SOURCE: https://github.com/metamask/metamask-docs/blob/main/services/reference/starknet/quickstart.md#_snippet_2

LANGUAGE: bash
CODE:
```
npm i axios
```

LANGUAGE: javascript
CODE:
```
const axios = require("axios")

axios
  .post("https://starknet-mainnet.infura.io/v3/<YOUR-API-KEY>", {
    jsonrpc: "2.0",
    method: "starknet_blockNumber",
    params: [],
    id: 1,
  })
  .then((response) => {
    console.log(response.data)
  })
  .catch((error) => {
    console.error(error)
  })
```

LANGUAGE: bash
CODE:
```
node index.js
```te