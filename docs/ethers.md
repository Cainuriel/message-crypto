================
CODE SNIPPETS
================
TITLE: Install Ethers v6
DESCRIPTION: Installs the Ethers v6 library using npm. This is the primary method for adding Ethers to your Node.js project.

SOURCE: https://docs.ethers.org/v6/getting-started

LANGUAGE: bash
CODE:
```
npm install ethers
```

--------------------------------

TITLE: Install Ethers.js v6 via NPM
DESCRIPTION: This snippet shows how to install the Ethers.js v6 library using the Node Package Manager (NPM). This is the recommended method for integrating Ethers.js into your project.

SOURCE: https://docs.ethers.org/v6/getting-started

LANGUAGE: bash
CODE:
```
npm install ethers
```

--------------------------------

TITLE: Connect to Ethereum with MetaMask
DESCRIPTION: Provides JavaScript code to connect to the Ethereum blockchain using MetaMask. It handles cases where MetaMask is not installed by defaulting to a read-only provider.

SOURCE: https://docs.ethers.org/v6/getting-started

LANGUAGE: javascript
CODE:
```
let signer = null;
let provider;

if (window.ethereum == null) {
    // If MetaMask is not installed, we use the default provider,
    // which is backed by a variety of third-party services (such
    // as INFURA). They do not have private keys installed,
    // so they only have read-only access
    console.log("MetaMask not installed; using read-only defaults")
    provider = ethers.getDefaultProvider()
} else {
    // Connect to the MetaMask EIP-1193 object. This is a standard
    // protocol that allows Ethers access to make all read-only
    // requests through MetaMask.
    provider = new ethers.BrowserProvider(window.ethereum)

    // It also provides an opportunity to request access to write
    // operations, which will be performed by the private key
    // that MetaMask manages for the user.
    signer = await provider.getSigner();
}
```

--------------------------------

TITLE: Connect to Custom RPC Backend
DESCRIPTION: Illustrates how to connect to a custom Ethereum RPC backend using `JsonRpcProvider`. This is useful when running your own node or using services like Infura.

SOURCE: https://docs.ethers.org/v6/getting-started

LANGUAGE: javascript
CODE:
```
const provider = new ethers.JsonRpcProvider("YOUR_RPC_ENDPOINT_URL");
```

--------------------------------

TITLE: Connect to Ethereum Node with JsonRpcProvider
DESCRIPTION: Establishes a connection to an Ethereum node using JsonRpcProvider. If no URL is provided, it defaults to 'http://localhost:8545'. It also demonstrates how to get write access to an account via getSigner.

SOURCE: https://docs.ethers.org/v6/getting-started

LANGUAGE: javascript
CODE:
```
import { ethers } from "ethers";

// Connect to a JSON-RPC URL (defaults to http://localhost:8545 if no URL is provided)
const provider = new ethers.JsonRpcProvider(url);

// Get write access as an account by getting the signer
const signer = await provider.getSigner();
```

--------------------------------

TITLE: Interact with ERC-20 Contract using Ethers.js
DESCRIPTION: Illustrates how to create and interact with a smart contract using its ABI. This example uses a simplified ERC-20 ABI to define methods like 'decimals', 'symbol', and 'balanceOf', and then creates a contract instance to read data.

SOURCE: https://docs.ethers.org/v6/getting-started

LANGUAGE: javascript
CODE:
```
import { ethers } from "ethers";

// Simplified ERC-20 ABI
const abi = [
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function balanceOf(address addr) view returns (uint256)"
];

// Create a contract instance
const contract = new ethers.Contract("dai.tokens.ethers.eth", abi, provider);

// Example of calling a read-only method (e.g., getting the symbol)
// const symbol = await contract.symbol();
// console.log(symbol); // Output: DAI
```

--------------------------------

TITLE: Import Ethers in Browser (ESM)
DESCRIPTION: Shows how to import Ethers.js using an ES Module import statement in a browser environment, referencing a CDN.

SOURCE: https://docs.ethers.org/v6/getting-started

LANGUAGE: html
CODE:
```
<script type="module">
  import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
  // Your code here...
</script>
```

--------------------------------

TITLE: Send Transaction with Ethers.js Signer
DESCRIPTION: Shows how to send a transaction using a Signer, which requires access to a private key. It demonstrates sending Ether to an address and waiting for the transaction to be mined, returning the receipt.

SOURCE: https://docs.ethers.org/v6/getting-started

LANGUAGE: javascript
CODE:
```
import { ethers } from "ethers";

// When sending a transaction, the value is in wei, so parseEther converts ether to wei.
const tx = await signer.sendTransaction({
  to: "ethers.eth",
  value: ethers.parseEther("1.0")
});

// Often you may wish to wait until the transaction is mined
const receipt = await tx.wait();
```

--------------------------------

TITLE: Signing and Verifying Messages with Ethers.js Wallet
DESCRIPTION: This snippet illustrates how to use an Ethers.js Wallet to sign a message and then verify that signature. Signing messages can be used for authentication and proving account ownership. It requires a wallet instance.

SOURCE: https://docs.ethers.org/v6/getting-started

LANGUAGE: javascript
CODE:
```
// Our signer; Signing messages does not require a Provider
const signer = new Wallet(id("test"));

const message = "sign into ethers.org?";

// Signing the message
const sig = await signer.signMessage(message);

// Validating a message; notice the address matches the signer
verifyMessage(message, sig);
```

--------------------------------

TITLE: Import Ethers in Node.js
DESCRIPTION: Demonstrates various ways to import Ethers.js modules in a Node.js environment. You can import everything, specific functions, or from specific exports.

SOURCE: https://docs.ethers.org/v6/getting-started

LANGUAGE: javascript
CODE:
```
// Import everything
import { ethers } from "ethers";

// Import just a few select items
import { BrowserProvider, parseUnits } from "ethers";

// Import from a specific export
import { HDNodeWallet } from "ethers/wallet";
```

--------------------------------

TITLE: Simulate State-Changing Method (Ethers.js)
DESCRIPTION: Illustrates how to use `staticCall` to simulate a state-changing method without actually executing it on the blockchain. This is useful for preflight checks and can be done as a different account.

SOURCE: https://docs.ethers.org/v6/getting-started

LANGUAGE: javascript
CODE:
```
const abi = [
  "function transfer(address to, uint amount) returns (bool)"
]

const contract = new Contract("dai.tokens.ethers.eth", abi, provider)
const amount = parseUnits("1.0", 18)

// Simulate as the connected account
await contract.transfer.staticCall("ethers.eth", amount)

// Simulate as another account
const other = new VoidSigner("0x643aA0A61eADCC9Cc202D1915D942d35D005400C")
const contractAsOther = contract.connect(other.connect(provider))
await contractAsOther.transfer.staticCall("ethers.eth", amount)
```

--------------------------------

TITLE: Read ERC-20 Contract Data (Ethers.js)
DESCRIPTION: Demonstrates how to create a contract instance connected to a provider to call read-only methods like `symbol`, `decimals`, and `balanceOf` on an ERC-20 token. It also shows how to format the balance for display.

SOURCE: https://docs.ethers.org/v6/getting-started

LANGUAGE: javascript
CODE:
```
const abi = [
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function balanceOf(address a) view returns (uint)"
]

const contract = new Contract("dai.tokens.ethers.eth", abi, provider)

const sym = await contract.symbol()
const decimals = await contract.decimals()
const balance = await contract.balanceOf("ethers.eth")

formatUnits(balance, decimals)
```

--------------------------------

TITLE: Query Blockchain State with Ethers.js
DESCRIPTION: Demonstrates how to query read-only data from the blockchain using a Provider. This includes fetching the current block number, account balances (and formatting them to Ether), and the next transaction count (nonce).

SOURCE: https://docs.ethers.org/v6/getting-started

LANGUAGE: javascript
CODE:
```
import { ethers } from "ethers";

// Look up the current block number (i.e. height)
const blockNumber = await provider.getBlockNumber(); // 22823520

// Get the current balance of an account (by address or ENS name)
const balance = await provider.getBalance("ethers.eth"); // 4085267032476673080n

// Since the balance is in wei, you may wish to display it in ether instead.
const formattedBalance = ethers.formatEther(balance); // '4.08526703247667308'

// Get the next nonce required to send a transaction
const transactionCount = await provider.getTransactionCount("ethers.eth"); // 2
```

--------------------------------

TITLE: Change State on ERC-20 Contract (Ethers.js)
DESCRIPTION: Shows how to interact with a contract using a signer to perform state-changing operations, such as transferring tokens. It includes parsing the amount, sending the transaction, and waiting for confirmation.

SOURCE: https://docs.ethers.org/v6/getting-started

LANGUAGE: javascript
CODE:
```
const abi = [
  "function transfer(address to, uint amount)"
]

const contract = new Contract("dai.tokens.ethers.eth", abi, signer)
const amount = parseUnits("1.0", 18)

const tx = await contract.transfer("ethers.eth", amount)
await tx.wait()
```

--------------------------------

TITLE: Querying Contract Transfer Events with Ethers.js
DESCRIPTION: This snippet shows how to create a contract instance, query for 'Transfer' events within a specified block range, and access the event data. It requires a contract ABI, contract address, and a provider.

SOURCE: https://docs.ethers.org/v6/getting-started

LANGUAGE: javascript
CODE:
```
const abi = [
  "event Transfer(address indexed from, address indexed to, uint amount)"
];

// Create a contract; connected to a Provider, so it may
// only access read-only methods (like view and pure)
const contract = new Contract("dai.tokens.ethers.eth", abi, provider);

// Query the last 100 blocks for any transfer
const filter = contract.filters.Transfer();
const events = await contract.queryFilter(filter, -100);

// The events are a normal Array
events.length;

// The first matching event
events[0];
```

--------------------------------

TITLE: Filtering Specific Contract Events with Ethers.js
DESCRIPTION: This example demonstrates how to filter contract events for a specific recipient address. It queries all blocks for 'Transfer' events directed to 'ethers.eth' and shows how to access the first event.

SOURCE: https://docs.ethers.org/v6/getting-started

LANGUAGE: javascript
CODE:
```
const abi = [
  "event Transfer(address indexed from, address indexed to, uint amount)"
];

const contract = new Contract("dai.tokens.ethers.eth", abi, provider);

// Query all time for any transfer to ethers.eth
const filter = contract.filters.Transfer("ethers.eth");
const events = await contract.queryFilter(filter);

// The first matching event
events[0];
```

--------------------------------

TITLE: Listen for ERC-20 Transfer Events (Ethers.js)
DESCRIPTION: Demonstrates how to listen for specific events emitted by a contract, such as `Transfer` events from an ERC-20 token. It shows how to use `contract.on` with event names or filters and how to access event parameters and remove listeners.

SOURCE: https://docs.ethers.org/v6/getting-started

LANGUAGE: javascript
CODE:
```
const abi = [
  "event Transfer(address indexed from, address indexed to, uint amount)"
]

const contract = new Contract("dai.tokens.ethers.eth", abi, provider)

// Listen for any Transfer event
contract.on("Transfer", (from, to, _amount, event) => {
  const amount = formatEther(_amount, 18)
  console.log(`${ from } => ${ to }: ${ amount }`);
  event.removeListener();
});

// Listen for Transfer events to a specific address
const filter = contract.filters.Transfer("ethers.eth")
contract.on(filter, (from, to, amount, event) => {
  // `to` will always be equal to the address of "ethers.eth"
});

// Listen for any event
contract.on("*", (event) => {
  // The `event.log` has the entire EventLog
});
```

--------------------------------

TITLE: Install Ethers v6
DESCRIPTION: Installs the Ethers v6 library using npm. This is the primary method for adding Ethers to your Node.js project.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: bash
CODE:
```
npm install ethers
```

--------------------------------

TITLE: Convert Ether Units with Ethers.js
DESCRIPTION: Provides utility functions for converting between different units of Ether, such as Ether to Wei and Gwei to Wei, and vice versa. This is crucial for handling large integer values accurately in blockchain operations.

SOURCE: https://docs.ethers.org/v6/getting-started

LANGUAGE: javascript
CODE:
```
import { ethers } from "ethers";

// Convert user-provided strings in ether to wei
const eth = ethers.parseEther("1.0"); // 1000000000000000000n

// Convert user-provided strings in gwei to wei for max base fee
const feePerGas = ethers.parseUnits("4.5", "gwei"); // 4500000000n

// Convert a value in wei to a string in ether to display in a UI
const formattedEth = ethers.formatEther(eth); // '1.0'

// Convert a value in wei to a string in gwei to display in a UI
const formattedGwei = ethers.formatUnits(feePerGas, "gwei"); // '4.5'
```

--------------------------------

TITLE: Ethers.js v6 FetchRequest Example
DESCRIPTION: Demonstrates creating a FetchRequest and sending it to retrieve a response. It shows how to instantiate FetchRequest with a URL and then use the 'send' method to get the response body's length.

SOURCE: https://docs.ethers.org/v6/api/utils/fetching

LANGUAGE: javascript
CODE:
```
import { FetchRequest } from "ethers";

// Example usage:
const req = new FetchRequest("https://www.ricmoo.com");
const resp = await req.send();
console.log(resp.body.length); // Outputs the length of the response body
```

--------------------------------

TITLE: Ethereum ABI: Event Data Structure (Transfer Example)
DESCRIPTION: Illustrates the structure of data logged for an Ethereum event, using the `Transfer(address indexed from, address indexed to, uint value)` event as an example. It shows how indexed parameters are placed in topics for filtering, and non-indexed parameters are in the data field.

SOURCE: https://docs.ethers.org/v6/basics/abi

LANGUAGE: text
CODE:
```
Topics:
1. Event signature hash (keccak256 of normalized event signature)
2. Indexed parameter 'from' (address)
3. Indexed parameter 'to' (address)

Data:
- Padded big-endian representation of 'value' (uint).
```

--------------------------------

TITLE: Build ethers Project
DESCRIPTION: Commands to clone the ethers repository, install dependencies, and run the auto-build script.

SOURCE: https://docs.ethers.org/v6/contributing

LANGUAGE: bash
CODE:
```
/home/ricmoo> git clone @TODO
/home/ricmoo> cd ethers
/home/ricmoo/ethers> npm install
/home/ricmoo/ethers> npm run auto-build
```

--------------------------------

TITLE: Start Subscriber
DESCRIPTION: Called initially when a subscriber is added for the first time.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
subscriber.start()
```

--------------------------------

TITLE: Clone and Build Ethers.js v6
DESCRIPTION: Steps to clone the Ethers.js repository, install dependencies, and build the documentation. This process involves using git for cloning and checking out branches, npm for dependency management, and Node.js for executing build scripts.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: bash
CODE:
```
# Clone the repo
/home/ricmoo> git clone https://github.com/ricmoo/flatworm.git /home/ricmoo>
/home/ricmoo> cd flatworm

# Check out the tsdocs branch
/home/ricmoo/flatworm> git checkout tsdocs

# Install the necessary dependencies
/home/ricmoo/flatworm> npm install

# Ready to build the docs; output to a folder ./output/
/home/ricmoo/flatworm> node lib/cli-test PATH_TO_WRM_ROOT
```

LANGUAGE: bash
CODE:
```
# Building
/home/ricmoo> git clone @TODO
/home/ricmoo> cd ethers
/home/ricmoo/ethers> npm install
/home/ricmoo/ethers> npm run auto-build
```

--------------------------------

TITLE: Get Language-Specific Wordlist Instance
DESCRIPTION: Returns a singleton instance of a language-specific Wordlist. This is used for encoding and decoding BIP-39 mnemonic phrases. Examples include Czech, English, Spanish, French, Italian, Japanese, Korean, Portuguese, and Chinese.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
LangCz.wordlist(): LangCz
```

LANGUAGE: typescript
CODE:
```
LangEn.wordlist(): LangEn
```

LANGUAGE: typescript
CODE:
```
LangEs.wordlist(): LangEs
```

LANGUAGE: typescript
CODE:
```
LangFr.wordlist(): LangFr
```

LANGUAGE: typescript
CODE:
```
LangIt.wordlist(): LangIt
```

LANGUAGE: typescript
CODE:
```
LangJa.wordlist(): LangJa
```

LANGUAGE: typescript
CODE:
```
LangKo.wordlist(): LangKo
```

LANGUAGE: typescript
CODE:
```
LangPt.wordlist(): LangPt
```

LANGUAGE: typescript
CODE:
```
LangZh.wordlist(dialect: string): LangZh
```

--------------------------------

TITLE: JsonRpcProvider: _start Method
DESCRIPTION: Method to start the provider. Sub-classes MUST call this. It ensures that no calls are passed to _send until _start has been called. Calling it multiple times is safe.

SOURCE: https://docs.ethers.org/v6/api/providers/jsonrpc

LANGUAGE: typescript
CODE:
```
jsonRpcApiProvider._start(): void
```

--------------------------------

TITLE: InfuraProvider: Get URL
DESCRIPTION: Constructs the appropriate URL for interacting with a specific module and parameters on the Etherscan API. This is essential for making GET requests.

SOURCE: https://docs.ethers.org/v6/api/providers/thirdparty

LANGUAGE: typescript
CODE:
```
etherscanProvider.getUrl(module: string, params: Record< string, string >): string
```

--------------------------------

TITLE: QuickNodeProvider Initialization
DESCRIPTION: Demonstrates how to create an instance of the QuickNodeProvider to connect to QuickNode's JSON-RPC endpoints. It highlights the use of an API token for authentication and rate limiting.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: javascript
CODE:
```
import { QuickNodeProvider } from "ethers";

// Using default (throttled) API token
const provider = new QuickNodeProvider();

// Using a specific network and API token
const providerWithToken = new QuickNodeProvider("matic-mumbai", "YOUR_API_TOKEN");
```

--------------------------------

TITLE: Connect to Ethereum with MetaMask
DESCRIPTION: Provides JavaScript code to connect to the Ethereum blockchain using MetaMask. It handles cases where MetaMask is not installed by defaulting to a read-only provider.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: javascript
CODE:
```
let signer = null;
let provider;

if (window.ethereum == null) {
    // If MetaMask is not installed, we use the default provider,
    // which is backed by a variety of third-party services (such
    // as INFURA). They do not have private keys installed,
    // so they only have read-only access
    console.log("MetaMask not installed; using read-only defaults")
    provider = ethers.getDefaultProvider()
} else {
    // Connect to the MetaMask EIP-1193 object. This is a standard
    // protocol that allows Ethers access to make all read-only
    // requests through MetaMask.
    provider = new ethers.BrowserProvider(window.ethereum)

    // It also provides an opportunity to request access to write
    // operations, which will be performed by the private key
    // that MetaMask manages for the user.
    signer = await provider.getSigner();
}
```

--------------------------------

TITLE: Connect to Ethereum Node with JsonRpcProvider
DESCRIPTION: Establishes a connection to an Ethereum node using JsonRpcProvider. If no URL is provided, it defaults to 'http://localhost:8545'. It also demonstrates how to get a signer for write access to an account.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: javascript
CODE:
```
import { ethers } from "ethers";

// Connect to a JSON-RPC URL
// If no url is provided, it connects to the default http://localhost:8545
const provider = new ethers.JsonRpcProvider(url);

// Get write access as an account by getting the signer
const signer = await provider.getSigner();
```

--------------------------------

TITLE: Filter Properties
DESCRIPTION: Defines the start and end blocks (inclusive) for filtering logs.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
filter.fromBlock⇒ BlockTag
filter.toBlock⇒ BlockTag
```

--------------------------------

TITLE: Signer Get Nonce
DESCRIPTION: Gets the next nonce required for the Signer to send a transaction.

SOURCE: https://docs.ethers.org/v6/api/providers

LANGUAGE: javascript
CODE:
```
signer.getNonce(blockTag?: BlockTag): Promise< number >
```

--------------------------------

TITLE: AbstractProvider: Get Plugin
DESCRIPTION: Retrieves a plugin by its name. Returns the plugin instance if found, otherwise returns null.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
abstractProvider.getPlugin(name: string): null | T
```

--------------------------------

TITLE: Build Documentation with Flatworm v2
DESCRIPTION: Steps to clone the Flatworm repository, checkout the 'tsdocs' branch, install dependencies, and build the documentation using the CLI. This process uses an experimental v2 of the Flatworm system for parsing JSDocs from TypeScript files.

SOURCE: https://docs.ethers.org/v6/contributing

LANGUAGE: bash
CODE:
```
# Clone the repo
/home/ricmoo> git clone https://github.com/ricmoo/flatworm.git /home/ricmoo>
/home/ricmoo> cd flatworm

# Check out the tsdocs branch
/home/ricmoo/flatworm> git checkout tsdocs

# Install the necessary dependencies
/home/ricmoo/flatworm> npm install

# Ready to build the docs; output to a folder ./output/
/home/ricmoo/flatworm> node lib/cli-test PATH_TO_WRM_ROOT
```

--------------------------------

TITLE: AbstractSigner Provider
DESCRIPTION: Gets the provider that the signer is connected to.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
abstractSigner.provider
```

--------------------------------

TITLE: Signer: Get Address
DESCRIPTION: Retrieves the Ethereum address associated with the Signer.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
signer.getAddress(): Promise< string >
```

--------------------------------

TITLE: FetchRequest: Get Header
DESCRIPTION: Demonstrates how to retrieve the value of a specific header from a FetchRequest, ignoring case sensitivity.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: javascript
CODE:
```
import { FetchRequest } from "ethers";

const req = new FetchRequest("https://example.com");
req.setHeader("Content-Type", "application/json");

// Get the value of the 'Content-Type' header (case-insensitive)
const contentType = req.getHeader("content-type");
console.log(contentType); // "application/json"
```

--------------------------------

TITLE: SocketSubscriber Filter
DESCRIPTION: Gets the filter array that the SocketSubscriber is listening to.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
socketSubscriber.filter
```

--------------------------------

TITLE: Wallet Instance Creation
DESCRIPTION: Demonstrates creating a Wallet instance using a private key string or SigningKey object, optionally connecting it to an Ethereum provider for network interactions.

SOURCE: https://docs.ethers.org/v6/api/wallet

LANGUAGE: javascript
CODE:
```
new Wallet(key: string | SigningKey, provider?: null | Provider)
```

--------------------------------

TITLE: QuickNodeProvider Get Request
DESCRIPTION: Shows how to generate a FetchRequest object configured for a specific network and API token using the QuickNodeProvider's static getRequest method. This is useful for custom network requests.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: javascript
CODE:
```
import { QuickNodeProvider, Network } from "ethers";

const network: Network = {
    name: "matic-mumbai",
    chainId: 80001,
    urls: {
        default: {
            http: "https://rpc.ankr.com/polygon_mumbai",
            webSocket: "wss://rpc.ankr.com/polygon_mumbai/ws"
        }
    }
};

const token = "YOUR_API_TOKEN";
const request = QuickNodeProvider.getRequest(network, token);

console.log(request.url);
```

--------------------------------

TITLE: UnmanagedSubscriber Name
DESCRIPTION: Gets the name of the event associated with the UnmanagedSubscriber.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
unmanagedSubscriber.name
```

--------------------------------

TITLE: Signer Get Address
DESCRIPTION: Retrieves the Ethereum address associated with the Signer.

SOURCE: https://docs.ethers.org/v6/api/providers

LANGUAGE: javascript
CODE:
```
signer.getAddress(): Promise< string >
```

--------------------------------

TITLE: Get Network Plugins by Basename
DESCRIPTION: Retrieves a list of all plugins matching a given basename, regardless of whether they have a fragment.

SOURCE: https://docs.ethers.org/v6/api/providers

LANGUAGE: TypeScript
CODE:
```
network.getPlugins(basename: string)
```

--------------------------------

TITLE: SigningKey Instance Creation and Methods (ethers.js v6)
DESCRIPTION: Shows how to create a SigningKey instance using a private key and outlines methods for computing shared secrets with other keys and signing cryptographic digests.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: javascript
CODE:
```
const signingKey = new SigningKey(privateKey: BytesLike);
const sharedSecret = signingKey.computeSharedSecret(other: BytesLike);
const signature = signingKey.sign(digest: BytesLike);
```

--------------------------------

TITLE: TransactionResponse Methods
DESCRIPTION: Methods to interact with a transaction, such as checking confirmations, getting the block it was included in, and verifying transaction types.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
transactionResponse.confirmations() ⇒ Promise< number >;
transactionResponse.getBlock() ⇒ Promise< null | Block >;
transactionResponse.getTransaction() ⇒ Promise< null | TransactionResponse >;
transactionResponse.isBerlin() ⇒ boolean;
transactionResponse.isCancun() ⇒ boolean;
transactionResponse.isLegacy() ⇒ boolean;
transactionResponse.isLondon() ⇒ boolean;
transactionResponse.isMined() ⇒ boolean;
transactionResponse.removedEvent() ⇒ OrphanFilter;
transactionResponse.reorderedEvent(other?: TransactionResponse) ⇒ OrphanFilter;
transactionResponse.replaceableTransaction(startBlock: number) ⇒ TransactionResponse;
transactionResponse.toJSON() ⇒ any;
transactionResponse.wait(confirms?: number, timeout?: number) ⇒ Promise< null | TransactionReceipt >;
```

--------------------------------

TITLE: Create QuickNodeProvider Instance
DESCRIPTION: Instantiates a new QuickNodeProvider, which connects to QuickNode's JSON-RPC endpoints. By default, it uses a throttled API token suitable for prototypes. For higher rate limits, signing up for a QuickNode account is recommended.

SOURCE: https://docs.ethers.org/v6/api/providers/thirdparty

LANGUAGE: javascript
CODE:
```
const provider = new QuickNodeProvider("mainnet", "YOUR_QUICKNODE_API_TOKEN");
```

--------------------------------

TITLE: Get Fee Data (Ethers v5 vs v6)
DESCRIPTION: Illustrates the change in how fee data is retrieved. Ethers v6 consolidates fee parameters into a single `.getFeeData` method, while `gasPrice` is still accessible for legacy networks.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: javascript
CODE:
```
// v5 await provider.getGasPrice()
// v6 (await provider.getFeeData()).gasPrice
```

--------------------------------

TITLE: Contract Deployment and Initialization (ethers.js)
DESCRIPTION: Methods related to contract deployment and waiting for deployment. Includes resolving to the contract once deployed and building contract classes from ABI.

SOURCE: https://docs.ethers.org/v6/api/contract

LANGUAGE: javascript
CODE:
```
baseContract.waitForDeployment()⇒ Promise< this >
Resolve to this Contract once the bytecode has been deployed, or resolve immediately if already deployed.
BaseContract.buildClass(abi: Interface | InterfaceAbi)⇒ TODO(A2Bconstructor(@TODO-001))
Create a new Class for the abi.
```

--------------------------------

TITLE: Get Fetch Gateway Function
DESCRIPTION: Retrieves the current gateway function associated with a given scheme.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
FetchRequest.getGateway(scheme: string) ⇒ null | FetchGatewayFunc
```

--------------------------------

TITLE: Contract Factory Initialization (ethers.js)
DESCRIPTION: Describes how to create a ContractFactory instance for deploying contracts, including specifying the ABI, bytecode, and an optional runner.

SOURCE: https://docs.ethers.org/v6/api/contract

LANGUAGE: javascript
CODE:
```
new ContractFactory(abi: Interface | InterfaceAbi, bytecode: BytesLike | { object: string }, runner?: null | ContractRunner)
Create a new ContractFactory with abi and bytecode, optionally connected to runner.
The bytecode may be the bytecode property within the standard Solidity JSON output.
```

--------------------------------

TITLE: EtherscanProvider: Get URL for API Request
DESCRIPTION: Constructs the URL for making an API request to Etherscan, including the module and parameters.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
etherscanProvider.getUrl(module: string, params: Record< string, string >): string
```

--------------------------------

TITLE: Get Function Selector
DESCRIPTION: Calculates the selector for a function given its name and parameters. This is a static method.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
FunctionFragment.getSelector(name: string, params?: Array< any >)⇒ string
```

--------------------------------

TITLE: Data Slicing
DESCRIPTION: Extracts a portion of binary data from a specified start to end offset, returning it as a DataHexString.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: javascript
CODE:
```
import { dataSlice } from "ethers";

const slicedData = dataSlice("0x1234567890", 2, 5); // '0x56789'
```

--------------------------------

TITLE: Get Fetch Response Header
DESCRIPTION: Retrieves the value of a specific header from the FetchResponse, ignoring case.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
fetchResponse.getHeader(key: string) ⇒ string
```

--------------------------------

TITLE: JsonRpcProvider: Start and Send Operations
DESCRIPTION: Details the _start and send methods for JsonRpcProvider. _start must be called before sending any calls, and sub-classes must call super._start(). The send method requests methods via JSON-RPC over the underlying channel.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
class JsonRpcProvider
// ...
_start(): void
// Sub-classes MUST call this. Until _start has been called, no calls will be passed to _send from send. If it is overridden, then super._start() MUST be called.

send(method: string, params: Array< any > | Record< string, any >): Promise< any >
// Requests the method with params via the JSON-RPC protocol over the underlying channel. This can be used to call methods on the backend that do not have a high-level API within the Provider API.
// Do NOT override this method in sub-classes; instead override _send or force the options values in the call to the constructor to modify this method's behavior.
```

--------------------------------

TITLE: Create BasicMulticoinProviderPlugin Instance
DESCRIPTION: Instantiates a BasicMulticoinProviderPlugin, which handles common coin types without requiring additional encoding/decoding libraries.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
const plugin = new BasicMulticoinProviderPlugin();

```

--------------------------------

TITLE: EtherscanProvider: Get Ether Price
DESCRIPTION: Resolves to the current price of Ether. Returns 0 for any network other than mainnet.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
etherscanProvider.getEtherPrice(): Promise< number >
```

--------------------------------

TITLE: Get AbstractSigner Address
DESCRIPTION: Retrieves the address associated with an AbstractSigner. This is a fundamental operation for any signer object.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
abstractSigner.getAddress()
  .then(address => {
    console.log(address);
  });

```

--------------------------------

TITLE: Creating a FallbackProvider Instance
DESCRIPTION: Demonstrates how to instantiate a FallbackProvider, which manages multiple Ethereum providers for improved resilience and performance. It accepts an array of providers or configurations and optional network and options parameters.

SOURCE: https://docs.ethers.org/v6/api/providers/fallback-provider

LANGUAGE: typescript
CODE:
```
new FallbackProvider(providers: Array< AbstractProvider | FallbackProviderConfig >, network?: Networkish, options?: FallbackProviderOptions)
```

--------------------------------

TITLE: Get List of Event Listeners
DESCRIPTION: Resolves to an array of listeners subscribed to a specific event, or all listeners if no event is specified.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
baseContract.listeners(event?: ContractEventName): Promise< Array< Listener > >
```

--------------------------------

TITLE: Creating a BaseContract Instance
DESCRIPTION: Demonstrates how to create a new instance of BaseContract, connecting it to a target address with a given ABI and an optional runner for performing operations.

SOURCE: https://docs.ethers.org/v6/api/contract

LANGUAGE: JavaScript
CODE:
```
new BaseContract(target: string | Addressable, abi: Interface | InterfaceAbi, runner?: null | ContractRunner, deployTx?: null | TransactionResponse)
```

--------------------------------

TITLE: Get Account Derivation Path
DESCRIPTION: Returns the BIP-32 path for an account at a given index, following the pattern used by hardware wallets like Ledger.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
getAccountPath(index: Numeric)⇒ string
```

--------------------------------

TITLE: Get Deployment Transaction
DESCRIPTION: Retrieves the transaction used to deploy the contract. This is only available if the contract instance was created from a ContractFactory.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
baseContract.deploymentTransaction(): null | ContractTransactionResponse
```

--------------------------------

TITLE: Signature Instance Creation and Methods (ethers.js v6)
DESCRIPTION: Demonstrates how to create a new Signature instance from various inputs and provides methods for cloning, validating signatures, and converting them to a JSON-compatible format.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: javascript
CODE:
```
const signature = Signature.from(sig?: SignatureLike);
const clonedSignature = signature.clone();
const isValid = signature.isValid();
const jsonRepresentation = signature.toJSON();
```

--------------------------------

TITLE: Creating Typed Instances
DESCRIPTION: Demonstrates how to create Typed instances for various Solidity data types using static methods of the Typed class.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
Typed.address(v: string | Addressable): Typed;
Typed.array(v: Array< any | Typed >, dynamic?: null | boolean): Typed;
Typed.bool(v: any): Typed;
Typed.bytes(v: BytesLike): Typed;
Typed.bytes1(v: BytesLike): Typed;
Typed.bytes2(v: BytesLike): Typed;
Typed.bytes3(v: BytesLike): Typed;
Typed.bytes4(v: BytesLike): Typed;
Typed.bytes5(v: BytesLike): Typed;
Typed.bytes6(v: BytesLike): Typed;
Typed.bytes7(v: BytesLike): Typed;
Typed.bytes8(v: BytesLike): Typed;
Typed.bytes9(v: BytesLike): Typed;
Typed.bytes10(v: BytesLike): Typed;
Typed.bytes11(v: BytesLike): Typed;
Typed.bytes12(v: BytesLike): Typed;
Typed.bytes13(v: BytesLike): Typed;
Typed.bytes14(v: BytesLike): Typed;
Typed.bytes15(v: BytesLike): Typed;
Typed.bytes16(v: BytesLike): Typed;
Typed.bytes17(v: BytesLike): Typed;
Typed.bytes18(v: BytesLike): Typed;
Typed.bytes19(v: BytesLike): Typed;
Typed.bytes20(v: BytesLike): Typed;
Typed.bytes21(v: BytesLike): Typed;
Typed.bytes22(v: BytesLike): Typed;
Typed.bytes23(v: BytesLike): Typed;
Typed.bytes24(v: BytesLike): Typed;
Typed.bytes25(v: BytesLike): Typed;
Typed.bytes26(v: BytesLike): Typed;
Typed.bytes27(v: BytesLike): Typed;
Typed.bytes28(v: BytesLike): Typed;
Typed.bytes29(v: BytesLike): Typed;
Typed.bytes30(v: BytesLike): Typed;
Typed.bytes31(v: BytesLike): Typed;
Typed.bytes32(v: BytesLike): Typed;
Typed.from(type: string, value: any): Typed;
Typed.int(v: BigNumberish): Typed;
Typed.int104(v: BigNumberish): Typed;
Typed.int112(v: BigNumberish): Typed;
Typed.int120(v: BigNumberish): Typed;
Typed.int128(v: BigNumberish): Typed;
Typed.int136(v: BigNumberish): Typed;
Typed.int144(v: BigNumberish): Typed;
```

--------------------------------

TITLE: Getting Bytes (Copy)
DESCRIPTION: Ensures a Uint8Array representation of the input data, creating a copy if necessary to prevent unintended modifications.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: javascript
CODE:
```
import { getBytesCopy } from "ethers";

const bytesArray = getBytesCopy("0x1234"); // Uint8Array([18, 52])
```

--------------------------------

TITLE: Get Event Topic Hash
DESCRIPTION: Calculates the topic hash for an event given its name and parameters. This is a static method.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
EventFragment.getTopicHash(name: string, params?: Array< any >)⇒ string
```

--------------------------------

TITLE: ethers.js LangKo Wordlist Instance
DESCRIPTION: Get a singleton instance of the Korean wordlist for mnemonic phrases in ethers.js. This class inherits from `Wordlist`.

SOURCE: https://docs.ethers.org/v6/api/wordlists

LANGUAGE: JavaScript
CODE:
```
import { LangKo } from "ethers";

// Get the singleton instance of LangKo
const koreanWordlist = LangKo.wordlist();

console.log(koreanWordlist instanceof LangKo); // true
```

--------------------------------

TITLE: Connect to Ethereum Providers with Ethers.js
DESCRIPTION: Demonstrates how to establish connections to different Ethereum network providers using the `getDefaultProvider` function in Ethers.js. This includes connecting to a local Geth node, the Ethereum mainnet, and the Polygon network with specific API keys and service exclusions.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: javascript
CODE:
```
import { getDefaultProvider } from "ethers";

// Connect to a local Geth node
const provider = getDefaultProvider("http://localhost:8545/");

// Connect to Ethereum mainnet with any current and future
// third-party services available
const providerMainnet = getDefaultProvider("mainnet");

// Connect to Polygon, but only allow Etherscan and
// INFURA and use "MY_API_KEY" in calls to Etherscan.
const providerPolygon = getDefaultProvider("matic", {
  etherscan: "MY_API_KEY",
  exclusive: ["etherscan", "infura"]
});
```

--------------------------------

TITLE: Get Ethers.js Version
DESCRIPTION: Retrieves the current version of the Ethers.js library. This is a constant value provided by the library.

SOURCE: https://docs.ethers.org/v6/api

LANGUAGE: javascript
CODE:
```
import { version } from "ethers";

console.log(version);
```

--------------------------------

TITLE: Get ABI Coder with Ethers.js
DESCRIPTION: Retrieves the ABI coder instance used for encoding and decoding binary data within the interface.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
interface.getAbiCoder(): AbiCoder
```

--------------------------------

TITLE: Interface: Create and From
DESCRIPTION: Demonstrates how to create a new Interface instance using either a raw ABI or by copying an existing Interface. The ABI can be provided in various formats, including JSON strings or human-readable signatures.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
const abi: InterfaceAbi = [
  "function balanceOf(address owner) view returns (uint256)"
];
const iface = new Interface(abi);

const iface2 = Interface.from(iface);
```

--------------------------------

TITLE: Ethers.js v6 Provider: Get Code
DESCRIPTION: Fetches the bytecode for a given Ethereum address. The bytecode can be optionally queried as of a specific block tag.

SOURCE: https://docs.ethers.org/v6/api/providers

LANGUAGE: typescript
CODE:
```
provider.getCode(address: AddressLike, blockTag?: BlockTag): Promise<string>
```

--------------------------------

TITLE: Get Unsigned BigInt
DESCRIPTION: Returns a bigint value, ensuring it is positive and valid. Throws an error if the value is negative or invalid.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
getUint(value: BigNumberish, name?: string): bigint
```

--------------------------------

TITLE: ethers.js: Transaction Class Example
DESCRIPTION: Demonstrates the basic instantiation and property assignment for the Transaction class in ethers.js. This shows how to create a transaction object and set its data.

SOURCE: https://docs.ethers.org/v6/api/transaction

LANGUAGE: javascript
CODE:
```
import { Transaction } from "ethers";

// Create a new Transaction instance
const tx = new Transaction();

// Set the transaction data
tx.data = "0x1234";

console.log(tx.data); // Output: '0x1234'
```

--------------------------------

TITLE: AbstractProvider: Get Resolver
DESCRIPTION: Retrieves the ENS resolver for a given name. This method returns a promise that resolves to an EnsResolver object.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
abstractProvider.getResolver(name: string): Promise<null | EnsResolver>
```

--------------------------------

TITLE: Create Wallet Instance
DESCRIPTION: Creates a new Wallet instance using a private key or SigningKey, optionally connected to a provider. This is a primary entry point for developers using private keys directly.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
new Wallet(key: string | SigningKey, provider?: null | Provider)
```

--------------------------------

TITLE: EtherscanProvider: Fetch Data from Etherscan API
DESCRIPTION: Fetches data from the Etherscan API by calling a specified module with given parameters. Supports both GET and POST requests.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
etherscanProvider.fetch(module: string, params: Record< string, any >, post?: boolean): Promise< any >
```

--------------------------------

TITLE: AbstractProvider Constructor - Initialization
DESCRIPTION: The AbstractProvider constructor initializes a new instance connected to a specified network or uses network detection. It accepts an optional network parameter (string or Networkish) and an optional options object for configuration.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
new AbstractProvider(network?: "any" | Networkish, options?: AbstractProviderOptions)
```

--------------------------------

TITLE: InfuraProvider: Get Request
DESCRIPTION: Returns a prepared FetchRequest for connecting to a specified network using Infura's Project ID and Project Secret. This is a static method used internally for setting up connections.

SOURCE: https://docs.ethers.org/v6/api/providers/thirdparty

LANGUAGE: typescript
CODE:
```
InfuraProvider.getRequest(network: Network, projectId?: null | string, projectSecret?: null | string): FetchRequest
```

--------------------------------

TITLE: EnsResolver Name Property
DESCRIPTION: Gets the ENS name that the resolver was configured for. This property links the resolver instance to a specific ENS domain.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
const resolver = new EnsResolver(provider, "0x...", "resolver.eth");
const ensName = resolver.name;

```

--------------------------------

TITLE: Get ENS Address from Provider
DESCRIPTION: Statically retrieves the ENS address for a given provider. This is an abstract method.

SOURCE: https://docs.ethers.org/v6/api/providers/ens-resolver

LANGUAGE: javascript
CODE:
```
EnsResolver.getEnsAddress(provider: Provider)
    // Returns: Promise< string >
```

--------------------------------

TITLE: Get Chain ID from Legacy Signature
DESCRIPTION: Computes the chain ID from the 'v' value of a legacy EIP-155 signature.

SOURCE: https://docs.ethers.org/v6/api/crypto

LANGUAGE: javascript
CODE:
```
Signature.getChainId(45);
// 5n
Signature.getChainId(46);
// 5n
```

--------------------------------

TITLE: Interact with Smart Contracts using ABI in Ethers.js v6
DESCRIPTION: Demonstrates how to create and interact with a smart contract instance using its Application Binary Interface (ABI) and address. It shows how to define ABI fragments for specific contract methods.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: javascript
CODE:
```
import { ethers } from "ethers";

// Simplified ERC-20 ABI
const abi = [
  "function decimals() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address addr) view returns (uint)"
];

// Assume provider is already initialized
// const provider = new ethers.JsonRpcProvider(url);

// Create a contract instance
const contract = new ethers.Contract("dai.tokens.ethers.eth", abi, provider);

// Example of calling a read-only method (e.g., balanceOf)
// const balance = await contract.balanceOf("someAddress");
// console.log("Balance:", balance);

// Example of calling another read-only method (e.g., symbol)
// const symbol = await contract.symbol();
// console.log("Symbol:", symbol);
```

--------------------------------

TITLE: InfuraProvider: Get Request
DESCRIPTION: Constructs a FetchRequest for connecting to an Infura network endpoint. It requires the network details and optionally accepts a project ID and project secret for authentication.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
InfuraProvider.getRequest(network: Network, projectId?: null | string, projectSecret?: null | string): FetchRequest
```

--------------------------------

TITLE: Signer: Get Nonce
DESCRIPTION: Fetches the next available nonce for the Signer to use when sending a transaction. Ensures transactions are processed in the correct order.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
signer.getNonce(blockTag?: BlockTag): Promise< number >
```

--------------------------------

TITLE: JsonRpcProvider: Constructor and Internal Methods
DESCRIPTION: Describes the constructor for JsonRpcProvider and its internal methods like _getConnection and _send. The constructor initializes the provider with optional URL, network, and options.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
class JsonRpcProvider
// CREATING INSTANCES
constructor(url?: string | FetchRequest, network?: Networkish, options?: JsonRpcApiProviderOptions)

// METHODS
_getConnection(): FetchRequest

_send(payload: JsonRpcPayload | Array< JsonRpcPayload >): Promise< Array< JsonRpcResult > >
```

--------------------------------

TITLE: EtherscanProvider: Get Contract ABI
DESCRIPTION: Retrieves the ABI for a given contract address using the Etherscan API. Returns null if the ABI cannot be found.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
etherscanProvider.getContract(address: string): Promise< null | Contract >
```

--------------------------------

TITLE: Get Number of Event Listeners
DESCRIPTION: Resolves to the number of listeners attached to a specific event, or the total number of listeners if no event is specified.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
baseContract.listenerCount(event?: ContractEventName): Promise< number >
```

--------------------------------

TITLE: Get ENS Resolver from Name
DESCRIPTION: Resolves and returns an EnsResolver instance for a given ENS name and provider. Returns null if the name is unconfigured.

SOURCE: https://docs.ethers.org/v6/single-page

LANGUAGE: typescript
CODE:
```
EnsResolver.fromName(provider, "myname.eth")
  .then(resolver => {
    if (resolver) {
      console.log("Resolver found:", resolver);
    }
  });

```

--------------------------------

TITLE: BaseWallet Instance Creation
DESCRIPTION: Demonstrates how to create a new BaseWallet instance, optionally connecting it to an Ethereum provider. If no provider is specified, only offline functionalities can be utilized.

SOURCE: https://docs.ethers.org/v6/api/wallet

LANGUAGE: javascript
CODE:
```
new BaseWallet(privateKey: SigningKey, provider?: null | Provider)
```