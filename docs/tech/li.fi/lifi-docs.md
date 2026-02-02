> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Why LI.FI & What is LI.FI

> Powering Seamless Multi-Chain Payments and Trading — One Integration, Global Liquidity.

***

### 1. **The Multi-Chain Payment Challenge**

Payments and value transfers shouldn’t stop at chain borders. Today, developers face fragmented liquidity, inconsistent tokens, and brittle integrations—making true cross-chain payments and smooth user experiences hard to deliver.

***

### 2. **LI.FI’s Vision**

We believe payments, trades, and transfers should flow freely across all blockchains. LI.FI is the multi-chain routing layer that makes this vision possible—optimizing every swap, transfer, or payment with one simple integration.

***

### 3. **What LI.FI Delivers**

* **Multi-chain payments and swaps** through one unified API/SDK.
* **Access to all liquidity** — DEX aggregators, bridges, and solvers combined.
* **Smart routing** that finds the cheapest and fastest path for any payment or trade.
* **Plug-and-play widget** for instant user-facing payment flows.

***

### 4. **Why Developers Choose LI.FI for Payments**

* **Expand globally** — accept or send payments across chains and tokens.
* **Lower costs** — aggregation ensures every payment clears at the best possible rate.
* **Reliability built-in** — redundant routing keeps payment flows smooth, even if a provider fails.
* **Faster integration** — one SDK replaces dozens of chain-specific builds.

***

### 5. **Pain Points — Solved by LI.FI**

| Pain Point                           | Without LI.FI                   | With LI.FI                                |
| ------------------------------------ | ------------------------------- | ----------------------------------------- |
| Users can’t pay across chains        | Complex manual bridging         | Single payment flow across all chains     |
| Token inconsistencies (USDC, USDC.e) | Confusion & failed transactions | Canonical mapping ensures smooth payments |
| Multiple APIs to maintain            | Slow and costly                 | Unified API/SDK handles all chains        |
| Failed or stuck transfers            | Bad UX & support tickets        | Smart fallback = payment always succeeds  |

***

### 6. **The LI.FI Advantage in Payments**

* **One integration → universal payment coverage**
* **Dynamic routing for every payment, swap, or transfer**
* **Developer-friendly toolkit (API, SDK, Widget)**
* **Future-proof foundation for embedded wallets, dApps, and fintechs**

***

### 7. **Key Takeaway**

> **LI.FI turns complex multi-chain trading into simple, reliable, and cost-efficient payment flows.**

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Security and Audits

Security is fundamental to our operations at LI.FI. Our approach combines multiple layers of defense, independent verification, and complete transparency with our users and partners.

## Security Team

We maintain a dedicated security team specializing in blockchain and DeFi security. This team is augmented by independent security researchers who provide external perspectives on potential vulnerabilities. Our objective is to identify and remediate security issues before they impact our users.

## Web2 Security Testing

We conduct annual penetration testing on our Web2 infrastructure, including APIs, web applications, and backend systems. These assessments are performed by specialized third-party security firms that provide independent evaluation of our security posture.

These tests are conducted annually and cover vulnerability scanning, manual penetration testing, authentication flows, API security, and infrastructure configuration review.

## Web3 Security

### Smart Contract Audits

All smart contracts deployed by LI.FI undergo independent security audits prior to production deployment. This applies to new contracts, upgrades, and material changes—any code going on-chain receives external audit review.

Our policy for Web3 smart contracts is that no code reaches production without independent security review. We engage multiple audit firms as different auditing teams bring varied expertise and methodologies, which strengthens our overall security assurance.

All audit reports are publicly available for review:

**[LI.FI Smart Contract Audit Reports](https://github.com/lifinance/contracts/tree/main/audit/reports)**

We maintain full transparency in our security practices. Users entrusting us with their assets can independently verify our security measures through our public audit disclosures.

### Automated Security Testing

We employ proactive Web3 automated security testing to continuously assess our smart contracts for potential vulnerabilities. Our automated testing infrastructure utilizes Olympix, which provides continuous security analysis and threat detection throughout the development and deployment lifecycle.

### Bug Bounty Program

We maintain an active bug bounty program offering rewards up to **\$1,000,000 USD** for critical vulnerabilities.

Security researchers are invited to participate through our program:

**[LI.FI Bug Bounty (Cantina)](https://cantina.xyz/bounties/260585d8-a3e8-4d70-8077-b6f3f5f0391b)**

The program encompasses smart contract vulnerabilities and other critical security issues. We have found that collaboration with the security research community provides valuable external scrutiny and strengthens our security posture.

### Smart Contract Monitoring

Beyond audits, we employ real-time monitoring of our smart contracts. Our internal monitoring systems track for anomalous patterns and suspicious activity. We also maintain partnerships with firms that provide independent monitoring capabilities—Hexagate being one example—which provides an additional layer of oversight.

Throughout 2024, we have expanded our monitoring infrastructure to include automated threat detection, anomaly detection using baseline behavioral models, transaction analysis for potential exploits, and emergency pause mechanisms for high-risk scenarios.

We continue to enhance our automated response capabilities, including implementing automated pause features that can activate immediately when specific risk thresholds are exceeded.

## Incident Response

We maintain established protocols for security incident management, including defined escalation procedures, communication frameworks for affected stakeholders, and post-incident analysis to implement corrective measures.

## Reporting Security Issues

We encourage responsible disclosure of security vulnerabilities. Security researchers and users who identify potential security issues can contact us through our dedicated channel:

**Security Contact**: [https://help.li.fi/](https://help.li.fi/)

All vulnerabilities may qualify for rewards through our [bug bounty program](https://cantina.xyz/bounties/260585d8-a3e8-4d70-8077-b6f3f5f0391b), with awards up to \$1,000,000 USD. All security reports are reviewed and addressed according to established protocols.

## Standards and Compliance

Our security practices align with recognized industry standards, including smart contract security best practices, OWASP guidelines for web application security, and secure development lifecycle methodologies. Our team receives ongoing security training to maintain current knowledge of evolving threat landscapes.

We maintain two non-negotiable commitments: mandatory independent audits for all smart contract deployments, and public disclosure of all audit reports.

## Our Approach

Security in the DeFi ecosystem requires continuous evolution. As the threat landscape changes, our security measures adapt accordingly. We maintain ongoing evaluation of new security tools, enhanced processes, and improved defensive capabilities.

Our security philosophy centers on defense in depth combined with operational transparency. We employ multiple layers of security controls, independent verification mechanisms, and public disclosure of security practices. This approach forms the foundation of trust with our users and partners.

***

*Last Updated: October 2025*

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Monetizing the integration

> As an integrator, you can monetize LI.FI and collect fees from our Widget/SDK/API integration.

Any dApp that integrates LI.FI's Widget, SDK, or our API can now take fees from the volume they put through LI.FI.

## How it works

When using LI.FI Widget or calling our SDK/API to request quotes for a transaction, you can pass a fee parameter specifying the percentage fee you'd be taking from the requested transaction.

### EVM

The fees are collected in the LI.FI fee collector contract and need to be claimed by the wallet set-up to collect fees.

<Note>
  Only the designated fee-collection wallet is authorized to claim accrued fees.

  Once fees have been accrued in a wallet, they are non-transferable and cannot be claimed by any other wallet. If the fee-collection wallet is updated at a later time, only the fees accrued after the update will be available in the new wallet.
</Note>

### Sui

The fees are sent to the fee wallet directly and do not need to be claimed.

### Solana

The fees are sent to the fee wallet directly and do not need to be claimed.

### Bitcoin

The fees are sent to the fee wallet directly and do not need to be claimed.

<Note>
  When collecting fees on Bitcoin, the transaction data must remain unaltered.
  This data contains critical transfer and user refund instructions that are
  specific to each bridge integration. Modifying the transaction data may lead
  to irreversible loss of funds.
</Note>

## How to set-up fee wallets

To set up your account and to start collecting fees, please set up your integration on [https://portal.li.fi/](https://portal.li.fi/).

The fees are collected on every chain and for every token individually. We will provide tools to get an easy overview of the collected fees and prepare contract calls for you to withdraw them. Of course, our tools can also be used to swap and bridge the collected fees to another chain.

## How to set up fee collection

The fee parameter is the percent of the integrator's fee, that is taken from every transaction. The parameter expects a float number e.g 0.02 refers to 2% of the transaction volume. The maximum fee amount should be less than 100%. Also, you should pass your custom integrator string to ensure the fees are collected to the right account. LI.FI will receive a percentage share of the collected fees depending on the use case and volume.

See examples of how to set up fee collection for different environments:

<Card title="LI.FI Widget monetization guide" href="/widget/monetize-widget" cta="See the guide" horizontal>
  Detailed examples of how to configure fees in the LI.FI Widget, including
  simple and advanced configurations.
</Card>

<Card title="LI.FI SDK monetization guide" href="/sdk/monetize-sdk" cta="See the guide" horizontal>
  Learn about how to configure fees and monetize your LI.FI SDK integration.
</Card>

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Chain Overview

> A list of supported chains

export const SupportedChains = () => {
  const [chains, setChains] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchChains = async () => {
      try {
        const response = await fetch('https://li.quest/v1/chains?chainTypes=EVM,SVM,UTXO,MVM');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setChains(jsonData.chains);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchChains();
  }, []);
  const renderChains = chains => <table className="p-3">
      <thead>
        <tr>
          <th></th>
          <th className="text-left"><strong>Chain Name</strong></th>
          <th className="text-left"><strong>Chain ID</strong></th>
          <th><strong>Key</strong></th><th>
          <strong>Chain Type</strong></th>
        </tr>
      </thead>
      <tbody>
        {chains.sort((a, b) => a.id - b.id).map(chain => <tr key={chain.key}>
            <td>
              <img src={chain.logoURI} alt={chain.name} className="w-3 h-3 rounded-full not-prose" />
            </td>
            <td><strong>{chain.name}</strong></td>
            <td><code>{chain.id}</code></td>
            <td><code>{chain.key}</code></td>
            <td><strong>{chain.chainType}</strong></td>
          </tr>)}
      </tbody>
    </table>;
  if (error) return <div>Error: {error}</div>; else if (chains) return renderChains(chains); else return <div>Loading...</div>;
};

LI.FI offers bridging and swaps between most EVM chains, native Bitcoin, Solana and SUI.

<SupportedChains />

The list of supported chains can also be found on our [API](/api-reference/get-information-about-all-currently-supported-chains).

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# EVM Providers

> A list of providers/tools LI.FI aggregates

export const EvmTools = () => {
  const [chains, setChains] = useState(null);
  const [tools, setTools] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchChains = async () => {
      try {
        const response = await fetch('https://li.quest/v1/chains?chainTypes=EVM,SVM,UTXO,MVM');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setChains(jsonData.chains);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchChains();
  }, []);
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch('https://li.quest/v1/tools');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setTools(jsonData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchTools();
  }, []);
  const parseBridges = (bridges, chains) => bridges.map(bridge => {
    const fromChainIds = bridge.supportedChains.map(connection => connection.fromChainId);
    const toChainIds = bridge.supportedChains.map(connection => connection.toChainId);
    const connectedChains = [...new Set([...fromChainIds, ...toChainIds])].map(chainId => chains.find(chain => chain.id === chainId)).sort((a, b) => a.id - b.id).filter(chain => !!chain);
    return {
      ...bridge,
      fromChainIds,
      toChainIds,
      connectedChains
    };
  }).filter(bridge => bridge.connectedChains.length).sort((a, b) => b.connectedChains.length - a.connectedChains.length);
  const parseExchanges = (exchanges, chains) => exchanges.map(exchange => ({
    ...exchange,
    supportedChains: exchange.supportedChains.map(chainId => chains.find(chain => chain.id === chainId)).sort((a, b) => a.id - b.id).filter(chain => chain?.chainType === "EVM")
  })).filter(exchange => exchange.supportedChains.length > 0).sort((a, b) => b.supportedChains.length - a.supportedChains.length + a.supportedChains[0].id / 1000 - b.supportedChains[0].id / 1000);
  const renderChains = chains => <div className="p-2">
      <div className="flex flex-wrap gap-4">
        {chains.map(chain => <div key={chain.key} className="relative group flex-shrink-0">
            <img src={chain.logoURI} alt={chain.name} className="w-5 h-5 rounded-full object-cover not-prose" />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
              {chain.name}
            </div>
          </div>)}
      </div>
    </div>;
  const exchangesOnChain = (exchanges, chain) => exchanges.filter(exchange => exchange.supportedChains.some(supportedChainId => supportedChainId === chain.id));
  const bridgesOnChain = (bridges, chain) => bridges.filter(bridge => bridge.supportedChains.some(({fromChainId, toChainId}) => fromChainId === chain.id || toChainId === chain.id));
  const renderTools = (tools, chains) => {
    const bridges = parseBridges(tools.bridges, chains);
    const exchanges = parseExchanges(tools.exchanges, chains);
    return <div>
      <h2>Supported Bridges</h2>
      <table className="p-3">
        <thead>
          <tr>
            <th className="w-6"></th>
            <th className="text-left"><strong>Bridge Name</strong></th>
            <th><strong>Key</strong></th>
            <th className="text-left"><strong>Supported Chains</strong></th>
          </tr>
        </thead>
        <tbody>
          {bridges.map(bridge => <tr key={bridge.key}>
              <td>
                <img src={bridge.logoURI} alt={bridge.name} className="w-3 h-3 rounded-full not-prose" />
              </td>
              <td><strong>{bridge.name}</strong></td>
              <td><code>{bridge.key}</code></td>
              <td>{renderChains(bridge.connectedChains)}</td>
            </tr>)}
        </tbody>
      </table>

      <h2>Supported Exchanges</h2>
      <table className="p-3">
        <thead>
          <tr>
            <th className="w-6"></th>
            <th className="text-left"><strong>Exchange Name</strong></th>
            <th><strong>Key</strong></th>
            <th className="text-left"><strong>Supported Chains</strong></th>
          </tr>
        </thead>
        <tbody>
          {exchanges.map(exchange => <tr key={exchange.key}>
              <td>
                <img src={exchange.logoURI} alt={exchange.name} className="w-3 h-3 rounded-full not-prose" />
              </td>
              <td><strong>{exchange.name}</strong></td>
              <td><code>{exchange.key}</code></td>
              <td>{renderChains(exchange.supportedChains)}</td>
            </tr>)}
        </tbody>
      </table>


      <h2>By Chain</h2>
      <table className="p-3">
        <thead>
          <tr>
            <th className="w-6"></th>
            <th className="text-left"><strong>Chain Name</strong></th>
            <th><strong>Chain Id</strong></th>
            <th className="text-left"><strong>Supported Bridges</strong></th>
            <th className="text-left"><strong>Supported Exchanges</strong></th>
          </tr>
        </thead>
        <tbody>
          {chains.filter(chain => chain.chainType === 'EVM').map(chain => <tr key={chain.key}>
              <td>
                <img src={chain.logoURI} alt={chain.name} className="w-3 h-3 rounded-full not-prose" />
              </td>
              <td><strong>{chain.name}</strong></td>
              <td><code>{chain.id}</code></td>
              <td>{bridgesOnChain(tools.bridges, chain).map(e => e.key).join(', ') || '-'}</td>
              <td>{exchangesOnChain(tools.exchanges, chain).map(e => e.key).join(', ') || '-'}</td>
            </tr>)}
        </tbody>
      </table>
    </div>;
  };
  if (error) return <div>Error: {error}</div>; else if (chains && tools) return renderTools(tools, chains); else return <div>Loading...</div>;
};

<EvmTools />

The list of supported tools can also be found on our [API](/api-reference/get-available-bridges-and-exchanges).

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# System Overview

> LI.FI architectural overview

## Introduction

LI.FI is a multi-chain liquidity aggregation platform that connects decentralized applications (dApps) with various liquidity sources, including bridges, decentralized exchanges (DEXs), and solvers. This architecture enables seamless cross-chain and same-chain trading by facilitating price discovery, smart order routing, and efficient execution.

***

<img src="https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-architecture.png?fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=63e3d93ede3d25569bd5e492745a79d3" alt="LI.FI Overview" data-og-width="5088" width="5088" data-og-height="2176" height="2176" data-path="images/lifi-architecture.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-architecture.png?w=280&fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=2cfc4175ca0493ce9fa6eaee3718b95f 280w, https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-architecture.png?w=560&fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=22eaf3c7088e9fb366783c61996b94da 560w, https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-architecture.png?w=840&fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=e9165c380bc98b25e6b2591d7455bb00 840w, https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-architecture.png?w=1100&fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=6d1b145158c7236737cbcf1ce8001a74 1100w, https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-architecture.png?w=1650&fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=6547db988a36715e8378d8f356c63d46 1650w, https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-architecture.png?w=2500&fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=081e781b21b7ce951010021fc55a8a88 2500w" />

## Key Components of LI.FI Architecture

### 1. **dApp Interface (Integrators)**

* **Function**: What the end-user interacts with. dApps initiate quote requests and route selection to LI.FI's API.
* **Process**: A user sends a request from the dApp for the best trading route or quote, which is forwarded to LI.FI API for processing. Once the optimal route is selected, the dApp submits a transaction to execute the trade.

### 2. **LI.FI API - Aggregation and Routing Layer**

* **Purpose**: This off-chain layer performs core price discovery and smart order routing by interfacing with various liquidity sources.
* **Functionality**:
  * **Fetch Pricing**: LI.FI API retrieves quotes from multiple sources, including bridges, DEXs, and solvers, to determine the best price and route.
  * **Return Quote**: Once the optimal route is identified, LI.FI API returns the quote to the dApp.
  * **Order Routing**: The dApp submits the transaction with the selected route, which LI.FI API processes by routing it to the LI.FI Diamond Contract on-chain.

### 3. **LI.FI Diamond Contract**

* **Function**: Acts as the primary on-chain entry point, handling the execution of transactions based on the chosen route from LI.FI API.
* **Role**:
  * Routes the transaction to the appropriate **facet contract** (bridge, DEX, or solver) based on the chosen liquidity source.
  * Acts as the router for on-chain executions, allowing modular connections to different liquidity sources.

### 4. **LI.FI Facet Contracts**

Specialized on-chain contracts that interface with respective liquidity sources:

* **Bridge Facet Contracts**
  * Route transactions to specific bridge contracts (e.g., Bridge A or Bridge B) for cross-chain transfers.
  * Ensure bridge compatibility and secure asset transfer across blockchains.

* **DEX Facet Contracts**
  * Route transactions to specific DEX contracts for same-chain swaps.
  * Optimize execution based on DEX-specific parameters for efficient liquidity utilization.

* **Solver Facet Contracts**
  * Route transactions to solver contracts for accessing extended liquidity sources.
  * Enable advanced routing and pricing calculations based on solver protocols.

### 5. **Bridge/DEX/Solver Contracts**

Final execution of trades occurs on the blockchain network through interactions with selected liquidity providers (bridge, DEX, or solver contracts).

***

## End-to-End Order Flow

1. **Initiate Request**
   * A user initiates a quote request from the dApp for a multi-chain or same-chain trade.

2. **Quote and Route Discovery**
   * LI.FI BE receives the request and queries bridges, DEX aggregators, and solvers to gather pricing data and route options.
   * The optimal route is determined and returned to the dApp.

3. **Transaction Submission**
   * The user selects the best route in the dApp, which submits the transaction to LI.FI Diamond contract with the selected quote data.

4. **On-Chain Execution**
   * LI.FI Diamond contract forwards the transaction to the respective LI.FI Facet contract for execution.
   * The facet contract executes the transaction with the specific bridge, DEX, or solver on-chain contract, finalizing the trade or transfer.

5. **Output Return**
   * Once the transaction is complete, the resulting assets are returned to the user.

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Smart Contract Architecture

## Architecture

The LI.FI Contract is built using the **EIP-2535** (Multi-facet Proxy) standard. The contract logic lives behind a single contract that in turn uses `DELEGATECALL` to call facet contracts that contain the business logic.

All business logic is built using facet contracts that live in `src/Facets`.

For more information on EIP-2535 you can view the entire EIP [here](https://eips.ethereum.org/EIPS/eip-2535).

## Contract Flow

A basic example would be a user bridging from one chain to another using Stargate Protocol. The user would interact with the LI.FIDiamond contract which would pass the Stargate-specific call to the StargateV2Facet which then passes required calls + parameters to Stargate's contracts.

The basic flow is illustrated below.
<img src="https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-contract.png?fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=3d60d0d021b75b7eb289639f5e148de1" alt="Diamond contract" data-og-width="755" width="755" data-og-height="256" height="256" data-path="images/lifi-contract.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-contract.png?w=280&fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=ffa6a313a3d0994fbfa0962b371f8fef 280w, https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-contract.png?w=560&fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=9671470c89e0395d74de8aca2d3bdd0b 560w, https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-contract.png?w=840&fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=cb8da668d4006e37bde97d456c5dbc34 840w, https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-contract.png?w=1100&fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=bc8964f739303439206c2ca4a1a2ece3 1100w, https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-contract.png?w=1650&fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=7e15287d2dea819b1077e1b979559428 1650w, https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-contract.png?w=2500&fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=d51eba8d5e54eaa4f9383388d8a756fc 2500w" />

## Diamond Helper Contracts

The LI.FI Diamond contract is deployed along with some helper contracts that facilitate things like upgrading facet contracts, look-ups for methods on facet contracts, ownership checking and withdrawals of funds. For specific details please check out [EIP-2535](https://eips.ethereum.org/EIPS/eip-2535).

<img src="https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-contract-helpers.png?fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=08d2cc1baedb753105d65388fdffc144" alt="Diamond helper contracts" data-og-width="741" width="741" data-og-height="256" height="256" data-path="images/lifi-contract-helpers.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-contract-helpers.png?w=280&fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=8e62837856257a307f3306ffbd7970bd 280w, https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-contract-helpers.png?w=560&fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=a7953f56f3b1a0827ecb811a7444e683 560w, https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-contract-helpers.png?w=840&fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=f4b8ddd5c2fb0f3d4b123cf6303c36ef 840w, https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-contract-helpers.png?w=1100&fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=b477304226ff0cf6fd17da8403187c68 1100w, https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-contract-helpers.png?w=1650&fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=ca23df7885fc4007578ab99de89141c5 1650w, https://mintcdn.com/lifi/08FOM1AsMmrVbIEl/images/lifi-contract-helpers.png?w=2500&fit=max&auto=format&n=08FOM1AsMmrVbIEl&q=85&s=960e0bb8321a716ed94dd0a7f351cb0d 2500w" />

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Smart Contract Addresses

export const ContractAddresses = () => {
  const [chains, setChains] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchChains = async () => {
      try {
        const response = await fetch('https://li.quest/v1/chains?chainTypes=EVM');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setChains(jsonData.chains);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchChains();
  }, []);
  const renderChains = chains => <table className="p-3">
      <thead>
        <tr>
          <th></th>
          <th className="text-left"><strong>Chain Name</strong></th>
          <th className="text-left"><strong>Chain ID</strong></th>
          <th><strong>Diamond Address</strong></th>
        </tr>
      </thead>
      <tbody>
        {chains.filter(chain => chain.diamondAddress).sort((a, b) => a.id - b.id).map(chain => <tr key={chain.key}>
            <td>
              <img src={chain.logoURI} alt={chain.name} className="w-3 h-3 rounded-full not-prose" />
            </td>
            <td><strong>{chain.name}</strong></td>
            <td><code>{chain.id}</code></td>
            <td><code>{chain.diamondAddress}</code></td>
          </tr>)}
      </tbody>
    </table>;
  if (error) return <div>Error: {error}</div>; else if (chains) return renderChains(chains); else return <div>Loading...</div>;
};

<Note>
  The LI.FI Diamond entryway contract address is `0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE` on most supported networks. Please note, on some networks the address is different. You can find the ABI on [Github](https://github.com/lifinance/lifi-contract-types/blob/main/dist/diamond.json).
</Note>

<ContractAddresses />

More information and open-source code for each facet contract can be found on our [GitHub](https://github.com/lifinance/contracts/blob/main/docs/README.md).

Contract address of each facet and deployment information can be found in our [GitHub repo](https://github.com/lifinance/contracts/tree/main/deployments).

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# End-to-end Transaction Example

## Step by step

<Steps>
  <Step title="Requesting a quote or routes">
    <CodeGroup>
      ```ts TypeScript theme={"system"}
      const getQuote = async (fromChain, toChain, fromToken, toToken, fromAmount, fromAddress) => {
          const result = await axios.get('https://li.quest/v1/quote', {
              params: {
                  fromChain,
                  toChain,
                  fromToken,
                  toToken,
                  fromAmount,
                  fromAddress,
              }
          });
          return result.data;
      }

      const fromChain = 42161;
      const fromToken = 'USDC';
      const toChain = 100;
      const toToken = 'USDC';
      const fromAmount = '1000000';
      const fromAddress = YOUR_WALLET_ADDRESS;

      const quote = await getQuote(fromChain, toChain, fromToken, toToken, fromAmount, fromAddress);
      ```
    </CodeGroup>
  </Step>

  <Step title="Choose the desired route if `/advanced/routes` was used and retrieve transaction data from `/advanced/stepTransaction`">
    <Note>
      This step is only needed if `/advanced/routes` endpoint was used. `/quote` already returns the transaction data within the response. Difference between `/quote` and `/advanced/routes` is described [here](/introduction/user-flows-and-examples/difference-between-quote-and-route)
    </Note>
  </Step>

  <Step title="Setting the allowance">
    Before any transaction can be sent, it must be made sure that the user is allowed to send the requested amount from the wallet.

    <CodeGroup>
      ```ts TypeScript theme={"system"}
      const { Contract } = require('ethers');

      const ERC20_ABI = [
          {
              "name": "approve",
              "inputs": [
                  {
                      "internalType": "address",
                      "name": "spender",
                      "type": "address"
                  },
                  {
                      "internalType": "uint256",
                      "name": "amount",
                      "type": "uint256"
                  }
              ],
              "outputs": [
                  {
                      "internalType": "bool",
                      "name": "",
                      "type": "bool"
                  }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
          },
          {
              "name": "allowance",
              "inputs": [
                  {
                      "internalType": "address",
                      "name": "owner",
                      "type": "address"
                  },
                  {
                      "internalType": "address",
                      "name": "spender",
                      "type": "address"
                  }
              ],
              "outputs": [
                  {
                      "internalType": "uint256",
                      "name": "",
                      "type": "uint256"
                  }
              ],
              "stateMutability": "view",
              "type": "function"
          }
      ];

      // Get the current allowance and update it if needed
      const checkAndSetAllowance = async (wallet, tokenAddress, approvalAddress, amount) => {
          // Transactions with the native token don't need approval
          if (tokenAddress === ethers.constants.AddressZero) {
              return
          }

          const erc20 = new Contract(tokenAddress, ERC20_ABI, wallet);
          const allowance = await erc20.allowance(await wallet.getAddress(), approvalAddress);

          if (allowance.lt(amount)) {
              const approveTx = await erc20.approve(approvalAddress, amount);
              await approveTx.wait();
          }
      }

      await checkAndSetAllowance(wallet, quote.action.fromToken.address, quote.estimate.approvalAddress, fromAmount);
      ```
    </CodeGroup>
  </Step>

  <Step title="Sending the transaction">
    After receiving a quote, the transaction has to be sent to trigger the transfer.

    Firstly, the wallet has to be configured. The following example connects your wallet to the Gnosis Chain.

    <CodeGroup>
      ```ts TypeScript theme={"system"}
      const provider = new ethers.providers.JsonRpcProvider('https://rpc.xdaichain.com/', 100);
      const wallet = ethers.Wallet.fromMnemonic(YOUR_PERSONAL_MNEMONIC).connect(
          provider
      );
      ```
    </CodeGroup>

    Afterward, the transaction can be sent using the `transactionRequest` inside the previously retrieved quote:

    <CodeGroup>
      ```ts TypeScript theme={"system"}
      const tx = await wallet.sendTransaction(quote.transactionRequest);
      await tx.wait();
      ```
    </CodeGroup>
  </Step>

  <Step title="Executing second step if applicable">
    If two-step route was used, the second step has to be executed after the first step is complete. Fetch the status of the first step like described in next step and then request transactionData from the `/advanced/stepTransaction` endpoint.
  </Step>

  <Step title="Fetching the transfer status">
    To check if the token was successfully sent to the receiving chain, the /status endpoint can be called:

    <CodeGroup>
      ```ts TypeScript theme={"system"}
      const getStatus = async (bridge, fromChain, toChain, txHash) => {
          const result = await axios.get('https://li.quest/v1/status', {
              params: {
                  bridge,
                  fromChain,
                  toChain,
                  txHash,
              }
          });
          return result.data;
      }

      result = await getStatus(quote.tool, fromChain, toChain, tx.hash);
      ```
    </CodeGroup>
  </Step>
</Steps>

## Full example

<CodeGroup>
  ```ts TypeScript theme={"system"}
  const ethers = require('ethers');
  const axios = require('axios');

  const API_URL = 'https://li.quest/v1';

  // Get a quote for your desired transfer
  const getQuote = async (fromChain, toChain, fromToken, toToken, fromAmount, fromAddress) => {
      const result = await axios.get(`${API_URL}/quote`, {
          params: {
              fromChain,
              toChain,
              fromToken,
              toToken,
              fromAmount,
              fromAddress,
          }
      });
      return result.data;
  }

  // Check the status of your transfer
  const getStatus = async (bridge, fromChain, toChain, txHash) => {
      const result = await axios.get(`${API_URL}/status`, {
          params: {
              bridge,
              fromChain,
              toChain,
              txHash,
          }
      });
      return result.data;
  }

  const fromChain = 42161;
  const fromToken = 'USDC';
  const toChain = 100;
  const toToken = 'USDC';
  const fromAmount = '1000000';
  const fromAddress = YOUR_WALLET_ADDRESS;

  // Set up your wallet
  const provider = new ethers.providers.JsonRpcProvider('https://rpc.xdaichain.com/', 100);
  const wallet = ethers.Wallet.fromMnemonic(YOUR_PERSONAL_MNEMONIC).connect(
      provider
  );

  const run = async () => {
      const quote = await getQuote(fromChain, toChain, fromToken, toToken, fromAmount, fromAddress);
      const tx = await wallet.sendTransaction(quote.transactionRequest);

      await tx.wait();

      // Only needed for cross chain transfers
      if (fromChain !== toChain) {
          let result;
          do {
              result = await getStatus(quote.tool, fromChain, toChain, tx.hash);
          } while (result.status !== 'DONE' && result.status !== 'FAILED')
      }
  }

  run().then(() => {
      console.log('DONE!')
  });
  ```
</CodeGroup>

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Fetching a Quote/Route

> Guide to make a quote and route request

## Using SDK

```TypeScript  theme={"system"}
import { getRoutes } from '@lifi/sdk';

const routesRequest: RoutesRequest = {
  fromChainId: 42161, // Arbitrum
  toChainId: 10, // Optimism
  fromTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC on Arbitrum
  toTokenAddress: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // DAI on Optimism
  fromAmount: '10000000', // 10 USDC
};

const result = await getRoutes(routesRequest);
const routes = result.routes;
```

When you make a route request, you receive an array of route objects containing the essential information to determine which route to take for a swap or bridging transfer. At this stage, transaction data is not included and must be requested separately.

Additionally, if you would like to receive just one best option that our smart routing API can offer, it might be better to request a quote using getQuote.

## Using API

To generate a quote based on the amount you are sending, use the /quote endpoint. This method is useful when you know the exact amount you want to send and need to calculate how much the recipient will receive.

```TypeScript  theme={"system"}
const getQuote = async (fromChain, toChain, fromToken, toToken, fromAmount, fromAddress) => {
    const result = await axios.get('https://li.quest/v1/quote', {
        params: {
            fromChain,
            toChain,
            fromToken,
            toToken,
            fromAmount,
            fromAddress,
        }
    });
    return result.data;
}

const fromChain = 42161;
const fromToken = 'USDC';
const toChain = 10;
const toToken = 'USDC';
const fromAmount = '1000000';
const fromAddress = YOUR_WALLET_ADDRESS;

const quote = await getQuote(fromChain, toChain, fromToken, toToken, fromAmount, fromAddress);
```

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Quote vs Route

> Difference between /quote and /advanced/routes

## /quote

/quote endpoint returns **the best single-step route only**. So only one route is returned and it includes transaction data that is needed to be sent onchain to execute the route.

## /advanced/routes

The `/advanced/routes` endpoint allows more complex routes, in which the user needs to bridge funds first and then needs to trigger a second transaction on the destination chain to swap into the desired asset.

After retrieving the routes, the tx data needs to be generated and retrieved using the `/stepTransaction` endpoint. This endpoint expects a full Step object which usually is retrieved by calling the `/advanced/routes` endpoint and selecting the most suitable Route.

`/stepTransaction` endpoint need to be called to retrieve transaction data for every Step. Internally both endpoints use the same routing algorithm, but with the described different settings.

<Note>
  The `/advanced/routes` endpoint can return single-step routes only by using the `allowChainSwitch: false` parameter in the request.
</Note>

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Composer (Composer & on-chain flow composition)

> LI.FI Composer Documentation

## Overview

LI.FI Composer, also referred to as "contract calls", "zaps", or "transaction orchestration", **delivers one-click UX for any combination of onchain actions across any number of chains.** Composer provide a streamlined way to bundle multiple actions within a single transaction on same-chain or cross-chain, eliminating the need for users to coordinate multiple transactions and navigate different interfaces by abstracting complex onchain operations into a single user intent.

Current DeFi UX forces users to hop between multiple platforms and manage potentially dozens of transactions just to complete a single workflow. Composer solves this by transforming multi-step, multi-chain operations into a single click, reducing the need for multiple steps, lowering gas fees, and enhancing the user experience.

## Key Benefits of LI.FI Composer

* **Single Transaction Execution**: Composer allow multiple actions to be completed in one transaction, eliminating the need for users to sign and pay for each individual action separately.
* **Cost Efficiency**: By batching actions into a single transaction, Composer reduce gas costs, as each step in a multi-action sequence does not require its own transaction fee.
* **Improved User Experience**: Composer minimize the complexity of onchain interactions by consolidating them, making it easier for users to perform multi-step operations without extensive technical knowledge.
* **Atomic Transactions (same-chain only)**: Composer are executed as atomic transactions (same-chain only), meaning all actions are completed as a single unit or none at all, ensuring security and consistency in execution.

***

## How LI.FI Composer Work

LI.FI Composer work by consolidating a series of contract calls into a single transaction through an onchain VM. Each Zap is designed to follow a predefined sequence of actions that enables users to perform complex DeFi operations without needing to interact directly with multiple protocols.

This single transaction can perform multiple actions on behalf of the user, such as:

* **Swapping Tokens**: Convert one asset to another using decentralised exchanges (DEXs)
* **Depositing into Vaults**: Deposit into protocols like lending protocols or yield-bearing vaults
* **Staking**: Stake into LSTs and restaking protocols

LI.FI Composer enable the execution of the following multi-step process in a single transaction: on the Base network, swap USDC for ETH; bridge ETH to the Ethereum network; swap ETH for USDC; and deposit USDC into Aave.

Composer uses two core components to achieve this functionality:

1. **Onchain VM (Execution Engine)**: Smart contract that can call any other onchain protocol or series of them, handling all onchain execution without requiring users to understand blockchain interactions.

2. **eDSL and Compiler**: Purpose-built domain-specific language to express contract interactions in Typescript -- this gets compiled to bytecode for the VM to execute on-chain.

***

## Value Proposition for Integrators

**Protocol Teams**
Integrate their protocols as Composer to expand user accessibility and adoption. Partner protocols can be invited to Composer backend code base.

**Wallet & DeFi Platforms**
Composer offer users more sophisticated onchain actions, and "campaigns" can be created for further user engagement (e.g., deposit into new protocol). This significantly reduces user friction whilst expanding the breadth of DeFi operations your platform can support.

**Onchain Protocols (e.g., lending protocol)**
Composer allows users to perform a 1-click cross-chain action into the desired protocol. For example, users with assets on Base can deposit into a lending protocol on Arbitrum in 1-click.

***

## Supported Actions in LI.FI Composer

LI.FI Composer currently support the following actions:

* **DeFi Protocol Interactions**: Deposit into, withdraw from, or interact with supported lending platforms, yield farms, and staking protocols
* **Cross-Chain Protocol Access**: Execute cross-chain operations to access protocols on different chains through the broader LI.FI API
* **Tokenised Position Management**: Handle vault tokens and other tokenised positions

Note: While Composer itself is currently **single-chain only**, it can leverage the entire LI.FI API/backend for cross-chain functionality as Composer is categorised as a 'tool' in the LI.FI backend.

***

## Example Workflow: Cross-Chain DeFi Deposit with Composer

**Traditional Flow**:
User wants to deposit into a Morpho vault on Base but only holds ETH on Ethereum

* 4+ transactions across 2+ websites
* Manual coordination of bridges, swaps, gas management, and protocol deposits

**Composer Flow**:
Single transaction executes:

1. Bridge ETH from Ethereum to Base
2. Swap portion of ETH to USDC on Base
3. Deposit USDC into Morpho vault
4. Return vault tokens to user

By using Composer, LI.FI transforms this complex multi-step process into a seamless one-click operation.

***

## Technical Details

### Key Technical Features

* **Atomicity via pre-execution simulation**: Simulates the entire execution path before submitting transactions onchain, providing users with certainty about outcomes and preventing failed transactions
* **Dynamic calldata injection**: Automatically intercepts and injects necessary parameters between transaction steps when step 2 requires data from step 1's output
* **LI.FI ecosystem integration**: As part of the broader LI.FI ecosystem, Composer can combine cross-chain swaps, bridges, and protocol interactions in a single workflow, enabling complex operations like cross-chain swap + deposit combinations

### Current Capabilities & Limitations

**Limitations**

* No Solana or non-EVM chain support
* Tokenised positions only (e.g., vault tokens)

**Currently Supported Protocols**

*Team is open to protocol integration requests based on technical feasibility and community feedback.*

1. [Morpho V1 and V2 vaults](https://morpho.org/)
2. [Aave V3 markets](https://aave.com/)
3. [Kinetiq](https://kinetiq.xyz/) - deposit only
4. [Kinetiq Earn (vkHYPE)](https://kinetiq.xyz/stake-hype#kinetiq-earn)
5. [Euler](https://www.euler.finance/)
6. [Ethena](https://ethena.fi/) (USDe to sUSDe, ENA to sENA) - deposit only
7. [Felix Vanilla](https://www.usefelix.xyz/)
8. [HyperLend](https://hyperlend.finance/)
9. [Pendle](https://www.pendle.finance/)
10. [Maple](https://maple.finance/) - deposit only
11. [Neverland](https://neverland.money/)
12. [Lido wstETH](https://stake.lido.fi/wrap)
13. [EtherFi](https://www.ether.fi/)
14. [USDai](https://usd.ai/)
15. [Seamless](https://seamlessprotocol.com/)

***

## How to Implement LI.FI Composer

**No custom integration required!** Composer works out-of-the-box with the LI.FI API, Widget and SDK.

To utilise Composer, developers can leverage the LI.FI API, which provides endpoints for executing Composer.

### Technical Implementation

Vault token addresses need to be inputted into the `GET /quote` and `POST /advanced/routes` endpoints

* Documentation:
  * [GET /quote](https://docs.li.fi/api-reference/get-a-quote-for-a-token-transfer)
  * [POST /advanced/routes](https://docs.li.fi/api-reference/advanced/get-a-set-of-routes-for-a-request-that-describes-a-transfer-of-tokens)
* For a detailed explanation of the difference between `/quote` and `/advanced/routes`, refer to [this page](https://docs.li.fi/introduction/user-flows-and-examples/difference-between-quote-and-route).

Composer is categorised as a "tool" in the LI.FI API and requires manual addition to integrator whitelists

### API Examples

#### Example 1: Same-Chain Deposit (USDC to Morpho Vault on Base)

```bash  theme={"system"}
curl -X GET 'https://li.quest/v1/quote?fromChain=8453&toChain=8453&fromToken=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&toToken=0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A&fromAddress=0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE&toAddress=0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE&fromAmount=1000000'
```

**Parameters:**

* `fromChain`: 8453 (Base)
* `toChain`: 8453 (Base - same chain)
* `fromToken`: USDC on Base
* `toToken`: Morpho Vault token address
* `fromAmount`: 1000000 (1 USDC with 6 decimals)

This example demonstrates depositing USDC into a Morpho vault on Base in a single transaction.

***

## Use Cases for LI.FI Composer

* **Cross-Chain Yield Farming**: Deposit an asset on one chain, bridge it to another chain, and deposit into a yield farming protocol in a single transaction.
* **Multi-Chain Arbitrage**: Execute operations across different chains to exploit opportunities without needing separate transactions for each chain.
* **Onboarding New Users to DeFi**: Simplify user onboarding by allowing them to perform multi-step DeFi operations in a single, seamless transaction.
* **Protocol Access Simplification**: Enable users to access any supported protocol from any supported chain with a single click.

***

## Next Steps

**Ready to integrate?** [Contact the LI.FI team](https://li.fi/contact-us/) to discuss your specific use case and get Composer added to your integrator whitelist.

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Messaging flow

> LI.FI Messaging flow Documentation

# LI.FI Messaging Flow Documentation

## Overview

LI.FI Messaging Flow enables seamless interactions with centralized and hybrid exchanges that use message-based APIs (such as Hyperliquid) instead of traditional on-chain transactions. **This flow delivers gasless, approval-free operations for cross-chain transfers involving protocols that operate with off-chain signed messages.**

Traditional DeFi operations require users to send on-chain transactions, manage gas fees, and approve token spending for each interaction. Messaging flow eliminates these friction points by using off-chain signed messages (EIP-712) that are relayed to destination protocols through LI.FI's backend infrastructure.

## Key Benefits of Messaging Flow

* **No Token Approvals Required**: Unlike transaction-based flows, messaging flow doesn't require users to approve token spending
* **Gasless Operations**: Users sign messages off-chain without paying gas fees for the message itself (some operation might require fee payments, not gas)
* **Asynchronous Execution**: Messages are relayed and processed asynchronously, with status tracking via `taskId`
* **Seamless Integration**: Works out-of-the-box with LI.FI API, SDK, and Widget

***

## How Messaging Flow Works

The messaging flow operates through a multi-step process that replaces traditional on-chain transactions with off-chain signed messages:

1. **Quote/Route Generation**: User requests a quote or route with `executionType=message` (will generate ONLY message-based routes) or `executionType=all` (both transaction and messages options)
2. **Message Creation**: LI.FI generates an EIP-712 typed message containing the operation details
3. **User Signature**: User signs the message off-chain in their wallet (no gas required)
4. **Message Relay**: Signed message is submitted to LI.FI's `/v1/advanced/relay` endpoint
5. **Backend Processing**: LI.FI backend validates and forwards the message to the destination protocol (e.g., Hyperliquid)
6. **Task Tracking**: Backend returns a `taskId` for tracking the asynchronous operation
7. **Status Monitoring**: Status can be checked via `/v1/status` endpoint using the `taskId` parameter

### Flow Diagram

```
User Wallet → Sign EIP-712 Message (off-chain, no gas)
     ↓
LI.FI SDK/API → POST /v1/advanced/relay
     ↓
LI.FI Backend → Validates & relays to protocol
     ↓
Returns taskId → Track via GET /v1/status?taskId=...
     ↓
Protocol Execution → (e.g., Hyperliquid withdrawal)
```

***

## Key Differences from Transaction Flow

| Aspect              | Transaction Flow                   | Messaging Flow                      |
| ------------------- | ---------------------------------- | ----------------------------------- |
| **Execution Type**  | On-chain transaction               | Off-chain signed message            |
| **Gas Fees**        | User pays gas for each transaction | No gas for signing messages         |
| **Token Approvals** | Required (separate transaction)    | Not required (`skipApproval: true`) |
| **Status Tracking** | `txHash`                           | `taskId`                            |
| **User Action**     | Send transaction                   | Sign typed message                  |

### Important Parameters

* **`estimate.skipApproval`**: Automatically set to `true` for messaging flows, indicating no approval transaction is needed
* **`estimate.executionType`**: Set to `"message"` to identify steps that use messaging flow
* **`typedData`**: Contains the EIP-712 message structure that users need to sign

***

## The executionType Parameter

The `executionType` parameter controls which types of routes are returned by the LI.FI API. This optional parameter is available in:

* `GET /v1/quote`
* `POST /v1/advanced/routes`

### Values

* **`transaction`** (default): Returns only routes using traditional on-chain transactions, **excluding** messaging flow routes
* **`message`**: Returns only routes that use messaging flow
* **`all`**: Returns both transaction-based and message-based routes

### Example Usage

**Get only message-based routes:**

```bash  theme={"system"}
curl -X GET 'https://li.quest/v1/quote?fromChain=1337&toChain=999&fromToken=0x8F254b963e8468305d409b33aA137C6700000000&toToken=0x9FDBdA0A5e284c32744D2f17Ee5c74B284993463&fromAddress=0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0&fromAmount=1000000&executionType=message'
```

**Get all available routes (both types):**

```bash  theme={"system"}
curl -X GET 'https://li.quest/v1/quote?fromChain=1337&toChain=999&fromToken=0x8F254b963e8468305d409b33aA137C6700000000&toToken=0x9FDBdA0A5e284c32744D2f17Ee5c74B284993463&fromAddress=0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0&fromAmount=1000000&executionType=all'
```

***

## The /relay Endpoint

### POST /v1/advanced/relay

**Purpose**: Submit signed EIP-712 messages for relaying to destination protocols.

**Endpoint**: `https://li.quest/v1/advanced/relay`

### Request Body

The request body is a `RelayRequest` object containing:

* **Step Information**: Standard LI.FI step data (tool, action, estimate)
* **Typed Data**: Array of signed EIP-712 messages
* **Signature**: User's signature for each message

### Request Schema

```typescript  theme={"system"}
{
  id: string                    // Step ID
  type: 'lifi'                  // Step type
  tool: string                  // Bridge tool (e.g., 'hyperliquidSA')
  toolDetails: {                // Tool metadata
    key: string
    name: string
    logoURI: string
  }
  action: {                     // Transfer action details
    fromChainId: number
    toChainId: number
    fromToken: Token
    toToken: Token
    fromAmount: string
    fromAddress: string
    toAddress: string
    slippage?: number
  }
  estimate: {                   // Estimated results
    fromAmount: string
    toAmount: string
    toAmountMin: string
    tool: string
    executionDuration: number
    approvalAddress: string
    skipApproval: true          // Always true for messaging flow
    feeCosts: FeeCost[]
    gasCosts: GasCost[]
    executionType: string
  }
  includedSteps: Step[]         // Nested steps
  typedData: TypedData[]        // EIP-712 messages with signatures
}
```

### Response

**Success Response** (`200 OK`):

```json  theme={"system"}
{
  "status": "ok",
  "data": {
    "taskId": "0x3078316542363633386445386335373163373837443762433234463938624641373335343235373331437c313735393438383039323538347c65646461643630632d373730392d346165312d623431652d3834643834333064306135623a30"
  }
}
```

**Error Response** (`400 Bad Request`):

```json  theme={"system"}
{
  "status": "error",
  "data": {
    "code": 400,
    "message": "Invalid request"
  }
}
```

### Response Fields

* **`status`**: Either `"ok"` or `"error"`
* **`data.taskId`**: Unique hex-encoded identifier for tracking the message relay operation
* **`data.code`**: Error code (only present when status is "error")
* **`data.message`**: Error message (only present when status is "error")

***

## Status Tracking with taskId

After relaying a message, you receive a `taskId` that uniquely identifies the operation. Use this to track the message processing status.

### GET /v1/status

**Endpoint**: `https://li.quest/v1/status`

**Query Parameters**:

* **`taskId`** (optional): The task ID returned from `/relay` endpoint
* **`txHash`** (optional): Transaction hash (for traditional transactions)
* **`toChain`** (optional): Destination chain ID or key
* **`bridge`** (optional): Bridge tool identifier
* **`fromChain`** (optional): Source chain ID or key

**Note**: You must provide either `taskId` or `txHash`. For messaging flow, use `taskId`.

### Example Request

```bash  theme={"system"}
curl -X GET 'https://li.quest/v1/status?taskId=0x3078316542363633386445386335373163373837443762433234463938624641373335343235373331437c313735393438383039323538347c65646461643630632d373730392d346165312d623431652d3834643834333064306135623a30'
```

### Response Format

The status endpoint returns the current state of the transfer:

```json  theme={"system"}
{
  "status": "DONE",
  "substatus": "COMPLETED",
  "sending": {
    "txHash": "0x...",
    "amount": "1000000",
    "token": {
      /* token details */
    },
    "chainId": 1337,
    "timestamp": 1234567890
  },
  "receiving": {
    "txHash": "0x...",
    "amount": "1000000",
    "token": {
      /* token details */
    },
    "chainId": 999,
    "timestamp": 1234567890
  }
}
```

## Current Usage & Supported Protocols

Messaging flow is currently used for interactions with the following protocols:

### 1. Hyperliquid (Primary Use Case)

**Protocol**: [Hyperliquid](https://hyperliquid.xyz/)
**Operation**: Withdrawals from Hyperliquid to EVM chains
**Bridge Tool**: `hyperliquidSA`
**Message Type**: `SendAsset`, \`\`

**How it works**:

1. User has tokens on Hyperliquid spot account
2. Signs a `SendAsset` message to withdraw to an EVM chain
3. LI.FI relays the message to Hyperliquid's API
4. Hyperliquid processes the withdrawal and sends tokens to destination chain

### 2. Unit Protocol

**Protocol**: [Unit Protocol](https://unit.network/)
**Operation**: Withdrawals to Hyperliquid via Unit bridge
**Bridge Tool**: `unit`
**Message Type**: `SpotSend`
**Chain IDs**:

* From: 1337 (Hyperliquid/Hypercore)
* To: EVM chains, Bitcoin, Solana

***

## Supported Message Types

### Hyperliquid

LI.FI Messaging Flow supports three EIP-712 message types for Hyperliquid operations. Each message type follows a specific structure and is used for different operations.

#### 1. SpotSend

**Purpose**: Spot token transfers
**Use Case**: Used by Unit protocol for deposits to Hyperliquid
**Bridge Tool**: `unit`

**Message Structure**:

```typescript  theme={"system"}
{
  type: 'spotSend',
  signatureChainId: '0x1',
  hyperliquidChain: 'Mainnet',
  destination: '0x...',           // Recipient address
  token: 'USOL:0x49b67c39...',   // Token identifier
  amount: '1.0',                  // Amount to transfer
  time: 1234567890                // Timestamp in milliseconds
}
```

#### 2. SendAsset

**Purpose**: Asset transfers between DEXs (spot accounts)
**Use Case**: Used for Hyperliquid withdrawals to EVM chains
**Bridge Tool**: `hyperliquidSA`

**Message Structure**:

```typescript  theme={"system"}
{
  type: 'sendAsset',
  signatureChainId: '0x1',
  hyperliquidChain: 'Mainnet',
  destination: '0x2000...00fe',        // System address
  sourceDex: 'spot',                    // Source DEX type
  destinationDex: 'spot',               // Destination DEX type
  token: 'USOL:0x49b67c39...',         // Token identifier
  amount: '1.0',                        // Amount to transfer
  fromSubAccount: '',                   // Agent wallet address (if used)
  nonce: 1757944034747                  // Timestamp/nonce
}
```

**Note**: All messages follow the EIP-712 typed data standard and include domain information:

```typescript  theme={"system"}
{
  domain: {
    name: 'HyperliquidSignTransaction',
    version: '1',
    chainId: 999,
    verifyingContract: '0x0000000000000000000000000000000000000000'
  },
  types: { /* EIP712Domain and message types */ },
  primaryType: 'HyperliquidTransaction:SendAsset',
  message: { /* message content */ }
}
```

***

## Integration Guide

### Using the API Directly

**Step 1: Get a Quote/Route**

Request a quote with `executionType=message` or `executionType=all`:

```bash  theme={"system"}
curl -X GET 'https://li.quest/v1/quote?fromChain=1337&toChain=999&fromToken=0x8F254b963e8468305d409b33aA137C6700000000&toToken=0x9FDBdA0A5e284c32744D2f17Ee5c74B284993463&fromAddress=0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0&fromAmount=1000000&executionType=all'
```

**Step 2: Identify Message Steps**

Check the route for steps with `estimate.executionType === "message"` and `estimate.skipApproval === true`.

**Step 3: Sign the Message**

Use the `typedData` from the route to request a signature from the user's wallet:

```typescript  theme={"system"}
const signature = await walletClient.signTypedData({
  domain: typedData.domain,
  types: typedData.types,
  primaryType: typedData.primaryType,
  message: typedData.message,
})
```

**Step 4: Relay the Message**

Submit the signed message to the `/relay` endpoint:

```bash  theme={"system"}
curl -X POST 'https://li.quest/v1/advanced/relay' \
  -H 'Content-Type: application/json' \
  -H 'x-lifi-api-key: YOUR_API_KEY' \
  -d '{
    "id": "step-id",
    "typedData": [{
      ...typedData,
      "signature": "0x..."
    }],
    ...stepData
  }'
```

**Step 5: Track Status**

Use the returned `taskId` to check status:

```bash  theme={"system"}
curl -X GET 'https://li.quest/v1/status?taskId=RETURNED_TASK_ID'
```

***

### Best Practices

1. **Always check `estimate.skipApproval`**: If true, skip approval transaction
2. **Validate signatures**: Ensure the message is signed correctly before relaying
3. **Store taskId**: Save the taskId returned from `/relay` for status tracking
4. **Poll status endpoint**: Check status periodically until completion

***

## Limitations & Considerations

### Current Limitations

* **Supported Protocols**: Currently limited to Hyperliquid and Unit protocol

### Future Enhancements

As the messaging flow matures, additional protocols and chains may be supported. Protocol teams interested in integration can contact the LI.FI team.

***

## FAQ

**Q: Do I need to do anything special to use messaging flow?**
A: No. If you're using the LI.FI SDK or Widget, messaging routes are automatically included and handled. For direct API usage, set `executionType=all` to see message routes.

**Q: Why does my route have `skipApproval: true`?**
A: This indicates the route uses messaging flow and doesn't require a token approval transaction.

**Q: How long does it take for a message to be processed?**
A: Processing time varies by protocol. For Hyperliquid, withdrawals typically complete within a few seconds.

**Q: Can I cancel a message after relaying?**
A: Once a message is relayed and accepted by the protocol, it cannot be cancelled through LI.FI. Check with the specific protocol for their cancellation policies.

**Q: How do I know if a route uses messaging flow?**
A: Check the `estimate.executionType` field. If it's `"message"`, the route uses messaging flow.

***

## Next Steps

* **Integrate**: Use the LI.FI SDK, Widget, or API to access messaging flow routes
* **Test**: Try a small withdrawal from Hyperliquid using the messaging flow
* **Monitor**: Use the `taskId` to track your operations via the status endpoint
* **Contact**: Reach out to the [LI.FI team](https://li.fi/contact-us/) for protocol integration requests

For more information, visit the [LI.FI Documentation](https://docs.li.fi/).

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Solana Transaction Example

## Requesting Solana specific information via the API

### Chains

```javascript  theme={"system"}
curl --request GET \
     --url 'https://li.quest/v1/chains?chainTypes=SVM' \
     --header 'accept: application/json'
```

### Tokens

```javascript  theme={"system"}
curl --request GET \
     --url 'https://li.quest/v1/tokens?chains=SOL&chainTypes=SVM' \
     --header 'accept: application/json'
```

### Token details

```javascript  theme={"system"}
curl --request GET \
     --url 'https://li.quest/v1/token?chain=SOL&token=BONK' \
     --header 'accept: application/json'
```

## Requesting a Quote or Routes

<CodeGroup>
  ```javascript /quote theme={"system"}
  curl --request GET \
       --url 'https://li.quest/v1/quote?fromChain=ARB&toChain=SOL&fromToken=0xaf88d065e77c8cC2239327C5EDb3A432268e5831&toToken=7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs&fromAddress=YOUR_EVM_WALLET&toAddress=YOUR_SOL_WALLET&fromAmount=1000000000' \
       --header 'accept: application/json'
  ```

  ```javascript /advanced/routes theme={"system"}
  curl --request POST \
       --url https://li.quest/v1/advanced/routes \
       --header 'accept: application/json' \
       --header 'content-type: application/json' \
       --data '
  {
    "fromChainId": "ARB",
    "fromAmount": "1000000000",
    "toChainId": "SOL",
    "fromTokenAddress": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    "toTokenAddress": "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs",
    "fromAddress": "YOUR_EVM_WALLET",
    "toAddress": "YOUR_SOL_WALLET"
  }'
  ```
</CodeGroup>

### Response

The key difference between **EVM -> SOL** and **SOL -> EVM** transfers is the structure of the transactionRequest. For **SOL -> EVM** transfers, it contains only a data parameter, which represents `base64` encoded Solana transaction data:

```json  theme={"system"}
"transactionRequest": {
    "data": "AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAsUBmw6CY1QcV7385AuJb6tDdM71YrLbjDGeWn6/zWFZAEcjcsOlIINY3LYFWBe38OO1l26BSpzB1L1bYnVNorsXkDqoJZ5Mb5PNE07yLa8RJGvFV55ILi1+vklkapJoW1yUKv7UyXP9sO3ptc4QOktFqSHRb9AYoDxZXcodBKfc4vN6ai03uOqBMXcmI4cih1E71LnDKMQljw0rqlnVVKOn98YHXWKE3PmeT4MetR4/Ep7+sfN+1vkcpHlwGeEHZgK4EIcmnLsIpOTZxLFhBBVIsDwUJkuCB/B43O01pI8fuLzyjGxJMo5db7lPEcx8Ns2BJ8kYOoL0ob3fnQ0eN3JwPzibblpkKkSjSk1qpqwB4d5rSn1PrbBHf6rOIO/O/W6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABceQrkgrAQHdCyf7CIDjBD/Y4pzKA7iTYhaafiX1eik37c9HIG4v1EeQo1ENAm3KHS+LCOKkZ4WQntGZQgIyu7ixIazui3zX0pmHiw3K3u/XdzSJfZ+ugLzVfJnnOn3v2RmLUngAdF+k4G2bOshpHaEkSZUr1Y1/vT3G9R/qU8zKFLzTYC6vfOspR18AlAfdoQQSzchbXIKs9TVzmL7XEYAwZGb+UhFzL/7K26csOb57yM5bvF9xJrLEObOkAAAADG+nrzvtutOj1l82qryXQxsbvkwtL24OR8pgIDRS9dYceCg/3UzgsruALUdoCSm3XiyBz8VtBPnGEIhrYpcBQ26zvkSidWkhDjuJPqY+9JDKulE8Bq2dVUioc+URRKUUsG3fbh12Whk9nL4UbO63msHLSF7V9bN5E6jPWFfv8AqTLHwyN3CxGdzcZNzliJWl0TJu3X7nF6oB9sysdDGG/6Ag8ABQJAQg8ADhMAAAcQBAMMAQgRAgYLDRIFChMJccw/qau6fVaf/aDz3hWN+Sh9oNuBvkrLv0ttxmLuxpa1pXsmnZ0BxMAAAAAAAAAAAAAAAABVIAjA9ocML3flzB0uub3/A+MOoAUAAAAAAAAAAAAAAAAnkbyh8t5GYe2IowyZp6lEmqhBdOkDAAAAAAAA"
}
```

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Bitcoin Transaction Example

## Requesting Bitcoin-specific information via the API

### Chains

```JS  theme={"system"}
curl --request GET \
     --url 'https://li.quest/v1/chains?chainTypes=UTXO' \
     --header 'accept: application/json'
```

### Tools

```JS  theme={"system"}
curl --request GET \
  --url 'https://li.quest/v1/tools?chains=20000000000001' \
  --header 'accept: application/json'
```

### Tokens

```JS  theme={"system"}
curl --request GET \
     --url 'https://li.quest/v1/tokens?chains=BTC' \
     --header 'accept: application/json'
```

### Token details

```JS  theme={"system"}
curl --request GET \
     --url 'https://li.quest/v1/token?chain=20000000000001&token=bitcoin' \
     --header 'accept: application/json'
```

## Requesting a Quote

### Bitcoin to Ethereum

The quote and advanced route calls target the same transfer but differ in shape: `GET /quote` accepts query parameters such as `fromChain` and `fromToken`, whereas `POST /advanced/routes` expects a JSON body with fields like `fromChainId` and `fromTokenAddress`.

<CodeGroup>
  ```javascript /quote theme={"system"}
  curl --request GET \
       --url 'https://li.quest/v1/quote?fromAddress=bc1qmdpxhzarlxrygtvlxrkkl0eqguszkzqdgg4py5&fromAmount=500000&fromChain=BTC&fromToken=bitcoin&toAddress=0x39333638696578786b61393361726b63717a6773&toChain=1&toToken=0x0000000000000000000000000000000000000000' \
       --header 'accept: application/json'
  ```

  ```javascript /advanced/routes theme={"system"}
  curl --request POST \
       --url https://li.quest/v1/advanced/routes \
       --header 'accept: application/json' \
       --header 'content-type: application/json' \
       --data '
  {
    "toTokenAddress": "0x0000000000000000000000000000000000000000",
    "fromTokenAddress": "bitcoin",
    "fromChainId": 20000000000001,
    "fromAmount": "10000000",
    "toChainId": 1,
    "fromAddress": "YOUR_BTC_WALLET",
    "toAddress": "YOUR_EVM_WALLET"
  }
  '
  ```
</CodeGroup>

### Ethereum to Bitcoin

<CodeGroup>
  ```javascript /quote theme={"system"}
  curl --request GET \
       --url 'https://li.quest/v1/quote?fromChain=1&toChain=20000000000001&fromToken=0x0000000000000000000000000000000000000000&toToken=bitcoin&fromAddress=0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0&toAddress=bc1qmdpxhzarlxrygtvlxrkkl0eqguszkzqdgg4py5&fromAmount=500000000000000000' \
       --header 'accept: application/json'
  ```

  ```javascript /advanced/routes theme={"system"}
  curl --request POST \
       --url https://li.quest/v1/advanced/routes \
       --header 'accept: application/json' \
       --header 'content-type: application/json' \
       --data '
  {
    "toTokenAddress": "bitcoin",
    "fromTokenAddress": "0x0000000000000000000000000000000000000000",
    "fromChainId": 1,
    "fromAmount": "500000000000000000",
    "toChainId": 20000000000001,
    "fromAddress": "YOUR_EVM_WALLET",
    "toAddress": "YOUR_BTC_WALLET"
  }
  '
  ```
</CodeGroup>

## Executing the transaction

### Building Custom Bitcoin Transactions

Partners may want to build custom Bitcoin transactions to select specific UTXOs for various reasons such as coin control, UTXO consolidation, or fee optimization.

**Requirements when building custom transactions:**

* Preserve the exact output structure and order from the API response
* Ensure selected UTXOs have sufficient value to cover:
  * Bridge deposit amount (1st output)
  * Refund output if required by the bridge (3rd output, must be above dust threshold)
  * Integrator fees (additional outputs)

**Critical:** The output order and structure cannot be modified. Deviating from the API response structure will result in stuck or failed transactions.

### Transaction Data

**BTC to Ethereum, Avalanche, or BNB Smart Chain (BSC)**

After retrieving the quote, the funds need to be sent to the BTC vault address provided in the response, along with a memo.

**Memo Functionality:** Similar to Thorchain, LI.FI uses memos for BTC to EVM swaps. Depending on the tool, the memo in the BTC transaction specifies the bridge-specific tx data to execute and internal LI.FI details for the tracking.

**Transaction Handling:** The transaction that leaves BTC and goes to EVM needs to be sent to an EVM address. The memo ensures that the swap details are correctly processed by the validators.

<Note>
  NOTE: Only send transactions in a timely manner (\~30 min). It is always
  recommended to request an up-to-date quote to ensure to get the latest
  information.
</Note>

<Warning>
  **Risk of modifying Bitcoin transaction data**

  Modifying PSBT or raw Bitcoin transaction data received from our API (for
  example removing outputs, changing amounts, or editing opcodes/scripts) can
  invalidate signatures or spending conditions and lead to irreversible loss of
  funds.

  Do not alter PSBTs unless you are an expert and have explicitly confirmed with
  us the modification you intend to make.
</Warning>

The following is an example of transaction data

```JS  theme={"system"}
"transactionRequest": {
    "to": "bc1qawcdxplxprc64fh38ryy4crndmfgwrffpac743", //thorswap vault to send BTC to
    "data": "=:ETH.USDC:0x29DaCdF7cCaDf4eE67c923b4C22255A4B2494eD7::lifi:0|0x4977d81c2a5d6bd8",
    "value": "500000"
  }
```

### Extracting Transaction Data from PSBT

When building custom Bitcoin transactions with selected UTXOs, partners need to extract the memo and other transaction details from the PSBT (Partially Signed Bitcoin Transaction) returned by the API.

**Key Information:**

* The memo is contained in the **OP\_RETURN output** (2nd output) of the PSBT
* This memo must be preserved exactly as provided - it contains bridge-specific calldata and LI.FI tracking details
* The depositor address is in the 1st output
* The refund address (if required) is in the 3rd output

Partners can parse the PSBT to extract these values and reconstruct the transaction with their selected UTXOs while maintaining the exact output structure.

### Bitcoin transaction requirements per tool

<Warning>
  **Critical: Output Structure Cannot Be Modified**

  The output order and structure provided by the API must be replicated exactly. Changing the order, removing outputs, or modifying amounts will result in stuck transactions. Partners building custom transactions must preserve the exact structure while only changing the input UTXOs.
</Warning>

The general requirements for the outputs structure are the following:

* **1st output:** Bridged amount sent to the bridge depositor address
* **2nd output:** OP\_RETURN containing the memo with bridge-specific and LI.FI tracking details (must be preserved exactly)
* **3rd output:** Refund output back to sender's address (optional for some bridges, mandatory for others - see details below)
* **Remaining outputs:** Integrator-specific fee transfers

**Dust Threshold Requirements:**

All outputs containing value must exceed the dust threshold, which is determined by the output address type:

* Pay To Witness Public Key Hash (p2wpkh) - 294 sats
* Pay To Witness Script Hash (p2wsh) - 330 sats
* Pay To Script Hash (p2sh) - 540 sats
* Pay To Public Key Hash (p2pkh) - 546 sats
* Pay To Taproot (p2tr) - 330 sats

#### Bridge Requirements Summary

##### **Thorswap**

The memo (OP\_RETURN output) contains Thorswap calldata to be executed and LI.FI tracking id. It's important to keep both to avoid stuck or failed transactions.

```JS  theme={"system"}
// Memo example
=:ETH.USDC:0x29DaCdF7cCaDf4eE67c923b4C22255A4B2494eD7::lifi:0|0x4977d81c2a5d6bd8
```

##### **Unit**

Unit bridge doesn't have any bridge-specific details stored in memo so it includes only LI.FI tracking details.

```JS  theme={"system"}
// Memo example
// =|lifi02bf57fe
```

##### **Symbiosis**

Symbiosis bridge doesn't have any bridge-specific details stored in memo so it includes only LI.FI tracking details.

```JS  theme={"system"}
// Memo example
=|lifi02bf57fe
```

<Warning>
  Incorrect transaction structure will cause stuck transfers that require manual refund intervention. Ensure the output order matches the API response exactly.
</Warning>

##### **Relay**

The memo (OP\_RETURN output) contains Relay calldata to be executed and LI.FI tracking id. It's important to keep both to avoid stuck or failed transactions.

```JS  theme={"system"}
// Memo example
0x986c2efd25b8887e9c187cfe2162753567339b6313e7137b749e83d4a1a79b03=|lifi92c9cbbc5
```

##### **Chainflip**

Chainflip PSBT requires to have three outputs as described above. The refund output is required, if it's skipped, the transaction will not be correctly processed.
The memo (OP\_RETURN output) contains Chainflip payload to be executed and LI.FI tracking id. It's important to keep both to avoid stuck or failed transactions.

```JS  theme={"system"}
// Memo example
0x01071eb6638de8c571c787d7bc24f98bfa735425731c6400f4c5ef05000000000000000000000000ff010002001e0200=|lifi92c9cbbc5
```

<Warning>
  **CRITICAL: Chainflip Fund Loss Risk**

  Chainflip transactions with incorrect output structure will result in **permanent, unrecoverable loss of funds**. Unlike other bridges, Chainflip cannot manually refund stuck transactions.

  **Mandatory Requirements:**

  * All three outputs must be present in exact order: (1) deposit amount, (2) OP\_RETURN memo, (3) refund output
  * Refund output (3rd output) is mandatory and must be above dust threshold
  * Do not modify, remove, or reorder any outputs from the API response

  Failure to follow these requirements exactly will result in irreversible fund loss with no recovery option.
</Warning>

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Transaction Status Tracking

> Complete guide to checking cross-chain transaction statuses using the LI.FI API

# Transaction Status

This guide explains how to check the status of cross-chain and swap transactions using the `/status` endpoint provided by LI.FI.

***

## Querying the Status Endpoint

To fetch the status of a transfer, the `/status` endpoint can be queried with:

1. sending transaction hash
2. receiving transaction hash
3. transactionId

<Note>
  Only one of the above values are required and need to be passed in `txHash` param.
</Note>

### Required:

* `txHash`

### Optional:

* `fromChain`: Speeds up the request (recommended)
* `toChain`
* `bridge`

For swap transactions, set `fromChain` and `toChain` to the same value. The `bridge` parameter can be omitted.

```typescript  theme={"system"}
const getStatus = async (txHash: string) => {
  const result = await axios.get('https://li.quest/v1/status', {
    params: { txHash },
  });
  return result.data;
};
```

## Sample Response

```json  theme={"system"}
{
  "transactionId": "0x0959ee0fbb37a868752d7ae40b25dbfa3b7d72f499fa8386fd5f4105b18b62bd",
  "sending": {
    "txHash": "0x5862726dbc6643c6a34b3496bb15e91f11771f6756ccf83826304846bbc93c0v",
    "txLink": "https://etherscan.io/tx/0x5862726dbc6643c6a34b3496bb15e91f11771f6756ccf83826304846bbc93c0v",
    "amount": "60000000000000000000000",
    "token": {
      "symbol": "ORDS",
      "priceUSD": "0.012027801612559667"
    },
    "gasPrice": "23079962248",
    "gasUsed": "231727",
    "gasAmountUSD": "14.0296",
    "amountUSD": "721.6681",
    "includedSteps": [
      {
        "tool": "feeCollection",
        "fromAmount": "60000000000000000000000",
        "toAmount": "59820000000000000000000"
      },
      {
        "tool": "1inch",
        "fromAmount": "59820000000000000000000",
        "toAmount": "275101169247651913"
      }
    ]
  },
  "receiving": {
    "txHash": "0x2862726dbc6643c6a34b3496bb15e91f11771f6756ccf83826604846bbc93c0v",
    "amount": "275101169247651913",
    "token": {
      "symbol": "ETH",
      "priceUSD": "2623.22"
    },
    "gasAmountUSD": "14.0296",
    "amountUSD": "721.6509"
  },
  "lifiExplorerLink": "https://scan.li.fi/tx/0x5862726dbc6643c6a34b3496bb15e91f11771f6756ccf83826304846bbc93c0v",
  "fromAddress": "0x14a980237fa9797fa27c5152c496cab65e36da4f",
  "toAddress": "0x14a980237fa9797fa27c5152c496cab65e36da4f",
  "tool": "1inch",
  "status": "DONE",
  "substatus": "COMPLETED",
  "substatusMessage": "The transfer is complete.",
  "metadata": {
    "integrator": "example_integrator"
  }
}
```

***

## Status Values

| Status      | Description                                 |
| ----------- | ------------------------------------------- |
| `NOT_FOUND` | Transaction doesn't exist or not yet mined. |
| `INVALID`   | Hash is not tied to the requested tool.     |
| `PENDING`   | Bridging is still in progress.              |
| `DONE`      | Transaction completed successfully.         |
| `FAILED`    | Bridging process failed.                    |

***

## Substatus Definitions

### PENDING

* `WAIT_SOURCE_CONFIRMATIONS`: Waiting for source chain confirmations
* `WAIT_DESTINATION_TRANSACTION`: Waiting for destination transaction
* `BRIDGE_NOT_AVAILABLE`: Bridge API is unavailable
* `CHAIN_NOT_AVAILABLE`: Source/destination chain RPC unavailable
* `REFUND_IN_PROGRESS`: Refund in progress (if supported)
* `UNKNOWN_ERROR`: Status is indeterminate

### DONE

* `COMPLETED`: Transfer was successful
* `PARTIAL`: Only partial transfer completed (common for across, hop, stargate, amarok)
* `REFUNDED`: Tokens were refunded

### FAILED

* `NOT_PROCESSABLE_REFUND_NEEDED`: Cannot complete, refund needed
* `OUT_OF_GAS`: Transaction ran out of gas
* `SLIPPAGE_EXCEEDED`: Received amount too low
* `INSUFFICIENT_ALLOWANCE`: Not enough allowance
* `INSUFFICIENT_BALANCE`: Not enough balance
* `EXPIRED`: Transaction expired
* `UNKNOWN_ERROR`: Unknown or invalid state
* `REFUNDED`: Tokens were refunded
