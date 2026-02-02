import { AddressRecords } from '../../components/AddressRecords'
import { ConnectKits } from '../../components/ConnectKits'
import { EnsProfile } from '../../components/EnsProfile'
import { TextRecords } from '../../components/TextRecords'
import { Card } from '../../components/ui/Card'

# Quickstart

Hey there 👋, this is the quickstart guide. If you want to learn the process checkout [everything about ENS in dApps](/web/).
If you would rather just clone an example repository checkout these:

## Starter Kits

<ConnectKits />

## Add to your dApp

This quickstart guide assumes you have a basic understanding of React.

### Installation

```bash [Terminal]
npm install wagmi viem @tanstack/react-query
```

### Showing the User Profile

The below codesnippet demonstrates how you can create a basic user profile section that shows the users ENS name and avatar.
The snippet leverages the [useAccount](https://wagmi.sh/react/hooks/useAccount), [useEnsName](https://wagmi.sh/react/hooks/useEnsName), and [useEnsAvatar](https://wagmi.sh/react/hooks/useEnsAvatar) hooks from wagmi.

<Card className="flex flex-col items-center justify-center gap-2 sm:flex-row">
  <EnsProfile name="nick.eth" />
  <EnsProfile name="jefflau.eth" />
  <EnsProfile name="vitalik.eth" />
</Card>

```tsx
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'

export const EnsProfile = () => {
  const { address } = useAccount()
  const { data: name } = useEnsName({ address, chainId: 1 })
  const { data: avatar } = useEnsAvatar({ name, chainId: 1 })

  return (
    <div className="flex items-center gap-2">
      <img src={avatar} className="h-8 w-8 rounded-full" />
      <div className="flex flex-col leading-none">
        <span className="font-semibold">{name}</span>
        <span className="text-grey text-sm">{address}</span>
      </div>
    </div>
  )
}
```

:::info
ENS resolution always starts from L1 regardless of the chain the user is connected to. This is why we specify `chainId: 1` for Ethereum Mainnet in the wagmi hooks above.
:::

### Text Record Lookups

<Card>
  <TextRecords
    name="nick.eth"
    keys={['url', 'com.github', 'com.twitter', 'description']}
  />
</Card>

:::code-group

```tsx [TextRecords.tsx]
// [!include ~/components/TextRecords.tsx]
```

```ts [useEnsTexts.ts]
// [!include ~/hooks/useEnsTexts.ts]
```

:::

### Address Record Lookups

While ENS resolution always starts from Ethereum L1, you can store addresses for other chains in ENS records.

<Card>
  <AddressRecords
    name="gregskril.eth"
    coinTypes={[60, 2147483658, 2147492101, 2147525809]}
  />
</Card>

:::code-group

```tsx [AddressRecords.tsx]
// [!include ~/components/AddressRecords.tsx]
```

```ts [useEnsAddresses.ts]
// [!include ~/hooks/useEnsAddresses.ts]
```

:::

import { EmbedLink } from '../../components/EmbedLink'
import { Card } from '../../components/ui/Card'

# Getting Started [Integrate ENS into your dApp]

This section walks you through how to leverage the ENS open standards to improve the user experience of your app.

{/* TODO: Break the following examples into a component to fetch live data */}

<Card className="flex items-center justify-center gap-2">
  <div className="flex flex-col gap-2 rounded-md border p-2 px-3">
    <div className="flex items-center gap-2">
      <object
        data={'https://ens-api.gregskril.com/avatar/vitalik.eth?width=64'}
        type="image/jpeg"
        className="aspect-square h-full w-8 rounded"
      >
        <img src="https://docs.ens.domains/fallback.svg" />
      </object>
      <span>vitalik.eth</span>
    </div>
  </div>
  <span>➡️</span>
  <div className="flex flex-col justify-start gap-1 rounded-md border p-2 px-3">
    <span>mi pinxe lo crino tcati</span>
    <span>0xd8d...6045</span>
  </div>
</Card>

<Card>
  <div className="flex items-stretch justify-center gap-2">
    <div className="flex flex-col justify-between rounded-md border p-2 px-3">
      <span>0xb8c...67d5</span>
      <span>0x866...5eEE</span>
      <span>0xd8d...6045</span>
    </div>
    <span className="flex flex-col gap-3 pt-3">
      <span>➡️</span>
      <span>➡️</span>
      <span>➡️</span>
    </span>
    <div className="flex flex-col gap-2 rounded-md border p-2 px-3">
      {['nick.eth', 'jefflau.eth', 'vitalik.eth'].map((name) => (
        <div className="flex items-center gap-2" key={name}>
          <object
            data={'https://ens-api.gregskril.com/avatar/' + name + '?width=64'}
            type="image/jpeg"
            className="aspect-square h-full w-8 rounded"
          >
            <img src="/img/fallback-avatar.svg" />
          </object>
          <span>{name}</span>
        </div>
      ))}
    </div>
  </div>
</Card>

## Quickstart

If you are looking to jumpstart your journey with ENS, or you are looking for a quick reference, visit the [Quickstart](/web/quickstart) page.

<EmbedLink
  href="/web/quickstart"
  title="Quickstart"
  description="To jumpstart your journey with names."
/>

## Tools and Libraries

ENS is an integral part of the Ethereum ecosystem.
Fortunately, the open-source community is to the rescue, and almost all of the tools and libraries you use today support ENS.
To learn more check out the [tools & libraries section](/web/libraries).

<EmbedLink
  href="/web/libraries"
  title="Tools & Libraries"
  description="To learn about the available tools and libraries that interact with ENS"
/>

## Avatars, Addresses & Records

Information about a name is fetched from its resolver. This can be done using pre-built features included in popular [web3 libraries](/web/libraries) (recommended), or by calling a resolver contract directly.
If you're interested in interacting with ENS resolvers, you might find the [Resolver Reference](/resolvers/interfaces) section helpful.

<EmbedLink
  href="/web/resolution"
  title="Address Resolution"
  description="To find guides on the address lookup features of ENS."
/>

## Subnames

<Card className="flex items-center justify-center text-xl">
  <div className="text-right font-bold">
    {['root', 'registrar', 'controller', 'resolver', 'registry'].map(
      (subname, i) => (
        <div
          className={
            ['opacity-20', 'opacity-50', '', 'opacity-50', 'opacity-20'][i]
          }
          key={subname}
        >
          {subname}
        </div>
      )
    )}
  </div>
  <div className="text-blue font-bold">.ens.eth</div>
</Card>

<EmbedLink
  href="/web/subdomains"
  title="Issuing Subnames"
  description="To an overview of the difference ways to issue subnames."
/>

## Registration

<Card className="flex items-center justify-center text-xl">
  <div className="text-right font-bold">
    {['nick', 'vitalik', 'matoken', 'jefflau', 'ens'].map((subname, i) => (
      <div
        className={
          ['opacity-20', 'opacity-50', '', 'opacity-50', 'opacity-20'][i]
        }
        key={subname}
      >
        {subname}
      </div>
    ))}
  </div>
  <div className="text-blue font-bold">.eth</div>
</Card>

<EmbedLink
  href="/registry/eth"
  title="ETH Registrar"
  description="To an overview of the two smart contracts that make up the ETH Registrar."
/>

import { ConnectKits } from '../../components/ConnectKits'
import { Libraries } from '../../components/Libraries'

# Tools & Libraries [Tools to help you interface with the ENS protocol]

## Quickstart Kits

There are a few plug-and-play kits that you can use to jumpstart your project. These kits will include everything you need to have users connect their wallet, have names showing, avatars, and more, right out of the box!

<ConnectKits />

## Libraries

There are many ways to interface with the ENS Ethereum smart contracts, indexers, and metadata services. Whether you're building a dApp, a backend service, or interacting with ENS from your smart contract, there's a library out there to help you get started.

<Libraries />

# Preparing for ENSv2 [Everything you need to know to prepare your application for ENSv2.]

ENSv2 brings multi-chain support and improved architecture to ENS. While names can still be stored on Ethereum Mainnet, ENSv2 introduces Namechain as the primary Layer 2 for ENS, with support for additional L2s as well. To ensure your application works seamlessly with ENSv2, you'll need to make a few key updates.

The good news? For most applications, preparing for ENSv2 is as simple as updating to the latest version of a [supported library](/web/libraries). At the time of writing, not all libraries have added ENSv2 support yet. Here's the current status:

- [viem >= v2.35.0](https://github.com/wevm/viem/blob/main/src/CHANGELOG.md#2350)
- ethers.js: Not published yet. [Work in progress on v6.16.0](https://github.com/ethers-io/ethers.js/tree/wip-v6.16.0-ens)
- web3.js: Deprecated

:::info
**Using a supported library? You're done!** Everything is handled automatically.

The sections below are optional reading for those who want to understand the technical details or test their integration manually.
:::

## Universal Resolver

Even though ENSv2 is designed for multi-chain, all resolution still starts on Ethereum Mainnet. There is a [new Universal Resolver](/resolvers/universal) that acts as the canonical entry point. This is an upgradable proxy contract, owned be the ENS DAO, so its address won't change in the future if its implementation is changed.

Your application needs to use this new Universal Resolver in order to be ready for ENSv2. As mentioned above, updating to the latest version of your supported web3 library handles this automatically.

Learn more about the [Universal Resolver here](/resolvers/universal) and about the [resolution process in general here](/resolution).

### Testing Universal Resolver Support

To test if your integration uses the Universal Resolver, try resolving the address for `ur.gtest.eth`. It should return `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`. If it instead returns `0x1111111111111111111111111111111111111111`, you likely need to update your web3 library.

## Offchain and L2 Resolution with CCIP Read

ENSv1 already supports delegating resolution from Ethereum Mainnet to an L2 or completely offchain using [CCIP Read (ERC-3668)](/learn/ccip-read). All the libraries mentioned above implement CCIP Read. However, not all integrations handle it properly.

With ENSv2, users can store names on Ethereum Mainnet, Namechain, or any other supported L2. This makes CCIP Read support essential for your integration to work correctly.

In a nutshell, CCIP Read defers resolution to a gateway. Think of a gateway as an HTTP API. The response of the gateway can be verified with a read-call to the ENS contracts on Ethereum Mainnet (or Sepolia for testing). This means that your application needs to be able to send HTTP requests as part of the ENS resolution process. As mentioned above, this is already handled by the web3 libraries in the background.

Learn more about [CCIP-Read, Offchain and L2 resolvers here](/resolvers/ccip-read).

### Testing CCIP Read Support

To test if your integration properly implements CCIP Read, try resolving `test.offchaindemo.eth`. It should return the address `0x779981590E7Ccc0CFAe8040Ce7151324747cDb97`.

## DNS Names and Name Detection

ENS supports importing DNS names into ENS, allowing legacy domain names to work alongside .eth names. It's important that your application correctly also detects DNS names.

### Common Mistake: Only Matching .eth

Many integrations check if the input ends with `.eth` in order to detect an ENS name:

```js
if (input.endsWith('.eth') {
  // ...
}
```

This is **incorrect** because it excludes DNS names imported into ENS (like `ensfairy.xyz`).

### Correct Pattern: Match All Valid Domains

Instead, your integration should treat any dot-separated string as a potential ENS name. For example, `a.co` should be treated as a potential ENS name.

```js
if (input.includes('.') && input.length > 2) {
   // ...
}
```

This pattern correctly matches:

- `.eth` names like `vitalik.eth`
- DNS names like `ensfairy.xyz`
- Subdomains like `ses.fkey.id`
- Emoji domains like `🦇️🔊️🦇️🔊️🦇️🔊️.eth`

Learn more about [DNS integration here](/learn/dns). The full specification of name normalization is defined in [ENSIP-15](/ensip/15).

## Multichain Considerations

Even if your application only operates on an L2 like Base, ENS resolution always starts on Ethereum Mainnet. This means you need to configure a L1 client alongside your L2 chain.

### Configuring Both L2 and Mainnet

Here's how to set up your application to use Base (or another L2) while ensuring ENS resolution works correctly by including Mainnet:

:::code-group

```ts [Viem]
import { createPublicClient, http, toCoinType } from 'viem'
import { base, mainnet } from 'viem/chains'

// Client for Base transactions
const baseClient = createPublicClient({
  chain: base,
  transport: http(),
})

// Client for ENS resolution on Mainnet
const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})

// Get the Base address for this ENS name
const baseAddress = await mainnetClient.getEnsAddress({
  name: 'test.ses.eth',
  coinType: toCoinType(base.id),
})
```

```tsx [Wagmi]
import { createConfig, http, useEnsAddress } from 'wagmi'
import { toCoinType } from 'viem'
import { base, mainnet } from 'wagmi/chains'

export const config = createConfig({
  chains: [base, mainnet], // Include both your L2 and Mainnet
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
})

function MyComponent() {
  const { data: baseAddress } = useEnsAddress({
    name: "test.ses.eth",
    chainId: mainnet.id, // Always use mainnet for ENS resolution
    coinType: toCoinType(base.id) // Always specify the coinType (chain)
  });
}
```

```ts [Ethers]
import { ethers } from 'ethers'

// Provider for Base
const baseProvider = ethers.getDefaultProvider('base')

// Provider for ENS resolution on Mainnet
const mainnetProvider = ethers.getDefaultProvider('mainnet')

// Get the Base address for this ENS name
const resolver = await mainnetProvider.getResolver('test.ses.eth')
const baseAddress = await resolver?.getAddress(8453) // Base chain ID
```
:::

### Chain-Specific Addresses

It is possible to configure a different address per chain for the same name:
- `test.ses.eth` resolves to `0x2B0F09F23193de2Fb66258a10886B9f06903276c` for Ethereum Mainnet, but
- `test.ses.eth` resolves to `0x7d3a48269416507E6d207a9449E7800971823Ffa` for Base.

From an application point of view it is important to be aware and always request the address for the correct chain, even on Ethereum Mainnet. All examples above explicitly set the `coinType` to Base, since they request the Base address for a given name.

:::warning
Omitting the coinType currently resolves the Ethereum Mainnet (or Sepolia on testnet) address. This address is not guaranteed to work on L2s. Always double check with your user when sending funds to such an address.
:::

import { EmbedLink } from '../../components/EmbedLink'
import { EnsProfile } from '../../components/EnsProfile'
import { Card } from '../../components/ui/Card'

# Address Lookup [Learn how to resolve blockchain addresses from human-readable names with ENS.]

The ENS Protocol aims to make it easy to use Ethereum.
It does this by providing a simple way to use human-readable names instead of long machine-readable addresses.

## Getting the users Ethereum Address

The goal here is to take a name, such as `nick.eth`, and convert it to an address, such as `0x225f137127d9067788314bc7fcc1f36746a3c3B5`.

<Card className="flex justify-center">
  <EnsProfile name="nick.eth" />
</Card>

The simplest thing you can do is start with a name, and resolve it to an address.
We call this a "forward lookup".
Think of places where users can enter names, such as sending transactions, chatting, etc.

Note that all dot-separated strings should be treated as potential ENS names, since ENS supports [many TLDs](/dns/tlds). A common mistake is to only treat strings that end in `.eth` as ENS names.

:::code-group

```tsx [Wagmi]
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'

export const Name = () => {
  const { data: ensName } = useEnsAddress({
    address: 'nick.eth', // The name to lookup
    chainId: 1, // The chain to start resolution on (Ethereum Mainnet or a testnet)
  })

  return <div>{ensName || address}</div>
}
```

```ts [Ethers.js]
const address = await provider.lookupAddress('nick.eth')
```

```ts [Viem]
import { normalize } from 'viem/ens'

import { publicClient } from './client'

const ensAddress = await publicClient.getEnsAddress({
  name: normalize('nick.eth'),
})
```

```py [web3.py]
from ens.auto import ns

address = ns.address('alice.eth')
```

```rust [ethers-rs]
let provider = Provider::<Http>::try_from("https://mainnet.infura.io/v3/...")?;

let address = provider.lookup_address("nick.eth").await?;
```

```go [go-ens]
package main

import (
	"fmt"

	"github.com/ethereum/go-ethereum/ethclient"
	ens "github.com/wealdtech/go-ens/v3"
)

func main() {
	client, _ := ethclient.Dial("https://rpc.ankr.com/eth")

	domain, _ := ens.Normalize("nick.eth")
	resolver, _ := ens.NewResolver(client, domain)
	address, _ := resolver.Address()

	fmt.Println("Address:", address.Hex())
}
```

```ts [ensjs]
import { createEnsPublicClient } from '@ensdomains/ensjs'
import { http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createEnsPublicClient({
  chain: mainnet,
  transport: http(),
})

const subgraphRecords = client.getSubgraphRecords({ name: 'ens.eth' })

const records = client.getRecords({
  name: 'ens.eth',
  records: {
    coins: [...(subgraphRecords?.coins || []), 'BTC', 'ETH', 'ETC', 'SOL'],
    texts: [
      ...(subgraphRecords?.texts || []),
      'avatar',
      'email',
      'description',
    ],
    contentHash: true,
    abi: true,
  },
})
```

```csharp [nethereum]
var ensService = new Nethereum.ENS.ENSService(web3)
var address = await ensService.ResolveAddressAsync('alice.eth')
```

:::

To learn what happens under the hood when you do a forward lookup, read the [resolution](/resolution) section.

## Multichain Addresses

ENS Names aren't just limited to storing Ethereum addresses.
Any blockchain address (BTC, LTC, SOL, etc.) can be queried by [SLIP-0044](https://github.com/satoshilabs/slips/blob/master/slip-0044.md) coin type or a value derived from an EVM Chain ID (specified in [ENSIP-11](/ensip/11)). This includes Ethereum L2 networks such as OP Mainnet and Base.

For EVM Chains besides Ethereum Mainnet, always use its [ENSIP-11](/ensip/11) coin type, irrespective of being included in SLIP-0044 (like Ether Classic).

The standardization of multichain addresses was first introduced in [ENSIP-9](/ensip/9), and also [EIP-2304](https://eips.ethereum.org/EIPS/eip-2304).

:::note
Regardless of the chain you're resolving an address for, ENS resolution always starts from Ethereum L1.
:::

:::code-group

```tsx [Wagmi]
// https://wagmi.sh/react/api/hooks/useEnsAddress
import { useEnsAddress } from 'wagmi'
import { arbitrum, base } from 'wagmi/chains'
import { toCoinType } from 'viem'

const name = 'gregskril.eth'

export const MyAddresses = () => {
  // SLIP-0044 Coin Types (see ENSIP-9)
  const { data: bitcoinAddr } = useEnsAddress({ name, coinType: 0, chainId: 1 })
  const { data: solanaAddr } = useEnsAddress({
    name,
    coinType: 501,
    chainId: 1,
  })

  // EVM Chain IDs (see ENSIP-11)
  const { data: baseAddr } = useEnsAddress({
    name,
    coinType: toCoinType(base.id),
    chainId: 1,
  })
  const { data: arbitrumAddr } = useEnsAddress({
    name,
    coinType: toCoinType(arbitrum.id),
    chainId: 1,
  })

  return (
    <div>
      {JSON.stringify({ bitcoinAddr, solanaAddr, baseAddr, arbitrumAddr })}
    </div>
  )
}
```

```ts [Viem]
// https://viem.sh/docs/ens/actions/getEnsAddress.html#cointype-optional
const ensName = await publicClient.getEnsAddress({
  name: normalize('wagmi-dev.eth'),
  coinType: 0, // BTC
})
```

```ts [Ethers.js]
// https://docs.ethers.org/v5/api/providers/provider/#EnsResolver
const resolver = await provider.getResolver('ricmoo.eth')
const btcAddress = await resolver?.getAddress(0)
```

```py [web3.py (Python)]
# https://web3py.readthedocs.io/en/latest/ens_overview.html#multichain-address-resolution
from ens.auto import ns

eth_address = ns.address('alice.eth', coin_type=60)
```

:::

| Network      | Coin Type  |
| ------------ | ---------- |
| Bitcoin      | 0          |
| Litecoin     | 2          |
| Dogecoin     | 3          |
| Ethereum     | 60         |
| Solana       | 501        |
| OP Mainnet   | 2147483658 |
| Polygon      | 2147483785 |
| Base         | 2147492101 |
| Arbitrum One | 2147525809 |

... and many many more following [SLIP-0044](https://github.com/satoshilabs/slips/blob/master/slip-0044.md) and [ENSIP-11](/ensip/11)

### Decoding Address Hashes

ENS resolvers store all addresses in bytes, which may have to be encoded to their respective address formats. To do this, we recommend using the [@ensdomains/address-encoder](https://www.npmjs.com/package/@ensdomains/address-encoder) package.

## Advanced

<EmbedLink
  href="/resolution"
  title="In-Depth Resolution"
  tag="Advanced"
  description="To learn more about the resolution process, please read the Resolution section."
/>

---
description: Store & Retrieve information from Profiles
---

import { EmbedLink } from '../../components/EmbedLink'
import { TextRecords } from '../../components/TextRecords'
import { Card } from '../../components/ui/Card'

# Text Records

Text records are key-value pairs that can be used to store any arbitrary data associated with a name.
Think of this as a user's **digital backpack** utilized for the storage of preferences, public details, and more.

<Card>
  <TextRecords
    name="nick.eth"
    keys={['description', 'com.twitter', 'com.github']}
  />
</Card>

The most popular records have been standardised.
One example of a standardised record is the [avatar record](/web/avatars) which is used to store a user's profile picture.

## Getting Records

To fetch the record for a specific name, you can use one of the following methods:

:::code-group

```tsx [Wagmi]
// https://wagmi.sh/react/api/hooks/useEnsText
import { normalize } from 'viem/ens'
import { useEnsText } from 'wagmi'

export const MyProfile: FC<{ name: string }> = ({ name }) => {
  const { data } = useEnsText({
    name: normalize('nick.eth'),
    key: 'com.twitter',
  })

  return (
    <div>
      <span>Twitter: {data}</span>
    </div>
  )
}
```

```tsx [Ethers]
// https://docs.ethers.org/v5/api/providers/provider/#EnsResolver
const provider = new ethers.providers.JsonRpcProvider()

const resolver = await provider.getResolver('nick.eth')
const twitter = await resolver.getText('com.twitter')
```

```tsx [Viem]
// https://viem.sh/docs/ens/actions/getEnsText.html
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})

const ensText = await publicClient.getEnsText({
  name: normalize('nick.eth'),
  key: 'com.twitter',
})
```

```python [web3.py]
# https://web3py.readthedocs.io/en/latest/ens_overview.html#text-records
from ens.auto import ns

# set text
ns.set_text('alice.eth', 'url', 'https://example.com')

# get text
url = ns.get_text('alice.eth', 'url')
assert url == 'https://example.com'
```

```go [Go]
package main

import (
	"fmt"

	"github.com/ethereum/go-ethereum/ethclient"
	ens "github.com/wealdtech/go-ens/v3"
)

func main() {
	client, _ := ethclient.Dial("https://rpc.ankr.com/eth")

	domain, _ := ens.Normalize("nick.eth")
	resolver, _ := ens.NewResolver(client, domain)
	twitter, _ := resolver.Text("com.twitter")

	fmt.Println("Twitter: ", twitter)
}
```

:::

## Types of Records

[ENSIP-5](/ensip/5) and [ENSIP-18](/ensip/18) specify two sets of records that are considered standardized. Below are some of the most commonly ones:

| Name        | Usage                                   | Reference             | Example                    |
| ----------- | --------------------------------------- | --------------------- | -------------------------- |
| avatar      | [Avatar](/web/avatars)                  | [ENSIP-5](/ensip/5)   | eip155:1/erc1155:0x495f... |
| description | Bio or description of the profile       | [ENSIP-5](/ensip/5)   | Lead developer of ENS      |
| com.twitter | Twitter/X handle                        | [ENSIP-5](/ensip/5)   | nicksdjohnson              |
| com.github  | GitHub handle                           | [ENSIP-5](/ensip/5)   | arachnid                   |
| url         | Website URL                             | [ENSIP-5](/ensip/5)   | https://ens.domains        |
| header      | Image URL to be used as a header/banner | [ENSIP-18](/ensip/18) | ipfs://QmNtHN7WE...        |

### Custom Records

While standardized records are expected to have the best ecosystem support, it's possible to store any key-value pair you desire. We generally recommend to stick to a pattern, or prefix things with your app or protocol (eg. `com.discord`, or `org.reddit`), as such to avoid collisions.

## Setting Records

Text records are controlled by the resolver associated with a given name. Read more about [interacting with a resolver](/resolvers/interacting).

<EmbedLink
  href="/resolvers/interacting"
  title="Interacting with a Resolver"
  tag="Advanced"
  description="To learn more about interacting with a resolver."
/>

---
description: The Avatar record is a special record that allows for user profile pictures to be stored on ENS.
---

import { EnsProfile } from '../../components/EnsProfile'
import { Card } from '../../components/ui/Card'

# Avatars

Personalization of profiles is what makes identity great.
This page covers the very special **avatar** record that enables users to take their avatar with them across the web.

<Card className="flex justify-center">
  <EnsProfile name="nick.eth" hideAddress />
</Card>

## Getting the user's Avatar

Avatars are an awesome way for users to express themselves. To get the user's avatar, all you need is their **name**. If you only have their address, see [primary names](/web/reverse#get).
The following code snippets let you get the avatar for a user.

:::code-group

```tsx [Wagmi]
// https://wagmi.sh/react/hooks/useEnsAvatar
import { useEnsAvatar } from 'wagmi'

function App() {
  const { data: ensAvatar } = useEnsAvatar({
    address: 'nick.eth',
    chainId: 1, // (1 = Ethereum Mainnet, 11155111 = Sepolia)
  })

  return (
    <img
      src={ensAvatar || 'https://avatars.jakerunzer.com/nick.eth'}
      alt="nick.eth"
    />
  )
}
```

```ts [Ethers]
// https://docs.ethers.org/v5/api/providers/provider/#Provider-getAvatar
const ensAvatar = await provider.getAvatar('nick.eth')
```

```ts [Viem]
// https://viem.sh/docs/ens/actions/getEnsAvatar.html
import { normalize } from 'viem/ens'

import { publicClient } from './client'

const ensAvatar = await publicClient.getEnsAvatar({
  name: normalize('nick.eth'),
})
```

```py [Web3.py]
# https://web3py.readthedocs.io/en/latest/ens_overview.html#read-text-metadata-for-an-ens-record
from ens.auto import ns

avatar = ns.get_text('alice.eth', 'avatar')
```

```go [Go]
package main

import (
	"fmt"

	"github.com/ethereum/go-ethereum/ethclient"
	ens "github.com/wealdtech/go-ens/v3"
)

func main() {
	client, _ := ethclient.Dial("https://rpc.ankr.com/eth")

	domain, _ := ens.Normalize("nick.eth")
	resolver, _ := ens.NewResolver(client, domain)
	avatar, _ := resolver.Text("avatar")

	fmt.Println("Avatar: ", avatar)
}
```

:::

### The Metadata Service

The [metadata service](https://metadata.ens.domains/docs) is run by ENS Labs. It is a free service web service that allows you to retrieve the
avatar of an ENS name via a web request, as opposed to adding extra logic to your application and interacting
with an ethereum node. This is of course centralised and should be used if absolutely necessary.

## What exactly is an Avatar Record?

An avatar record is simply a [text record](/web/records) that has "avatar" as its key and a URI as its value,
with some rules about what URI schemes are supported and how to process them. For more info, see [ENSIP-11](/ensip/12).

## Supported URI schemes

Clients are expected to support a number of URI schemas, which aren't always web URIs, so the final result you see in your application
will vary depending on how the library you are using has decided to handle avatar records.

- `http(s):` - URI Scheme for HTTP(S) URLs. Libraries will most likely return the result directly.
- `ipfs:` - URI scheme for [IPFS hashes](). Libraries may decide to fetch the result from a public gateway for you.
- `data:` - URI Scheme for [data URIs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs).
  Libraries will most likely return the result directly.
- `eip155:` - The URI scheme for EIP-155 identifiers for linking to NFTs on Ethereum based chains. A little complicated
  to resolve manually, most libraries should resolve this for you and return the underlying resource.

:::note
For EIP-155 NFT Avatars the nft must be owned by the wallet address the ENS
name resolves to. This is done by checking the `ownerOf` method on the NFT
contract.
:::

## Common schemes that aren't officially supported

- `ethereum:` - The URI scheme for Ethereum addresses
- `bzz:` - The URI scheme for Swarm hashes

## File Information

Avatars come in many different shapes and sizes. Not just the above URI schemas, but also in different file formats, sizes, and more.
Although standards exist for some of these, files are **not required** to follow these standards.

Below is some information about the avatars your app might be loading.

| FileProperty:  | Info/Recommendation                                                             |
| -------------- | ------------------------------------------------------------------------------- |
| File Extension | Mostly `png`, `jpeg`, `jpg`, `webp`, `gif`, `webm`, but could be anything       |
| File Size      | We recommend having sensible timeouts                                           |
| Aspect Ratio   | We recommend `object-fit: cover` or setting a background color                  |
| Transparency   | We recommend setting a background color as some images may contain transparency |

Luckily most browsers and network libraries have default timeouts to start with, we highly recommend that if you are doing any manual avatar downloading or fetching you add a sensible timeout.

---
description: To lookup the name of an address we use a reverse resolution. This allows users to indicate a primary name.
---

import { EmbedLink } from '../../components/EmbedLink'
import { EnsProfile } from '../../components/EnsProfile'
import { QandA } from '../../components/QandA'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'

# Primary Names

:::info
Primary names are now supported on both Ethereum Mainnet and popular L2s (Base, OP Mainnet, Arbitrum One, Scroll, and Linea). This enables users to have an end-to-end experience with ENS on their preferred L2!
:::

A "primary name" is the result of a bi-directional relationship between an EVM address and a human-readable ENS name. The two directions are:

1. Name -> Address (forward resolution)
2. Address -> Name (reverse resolution)

The outcome of this relationship makes it safe for applications to display ENS names instead of EVM addresses, leading to a better user experience.

<Card className="flex items-center justify-center gap-2">
  <span className="font-medium">0xb8c...67d5</span>
  <span>to</span>
  <EnsProfile name="nick.eth" hideAddress />
</Card>

While forward resolution is configured in [Resolvers](/resolvers/quickstart), reverse records are typically set via smart contracts called Reverse Registrars which you can [read more about below](#setting-primary-names).

## L2 Primary Names

Before we dive into code examples, let's first understand why things work the way they do.

Prior to August 2025, ENS users had to make a transaction on Ethereum Mainnet (L1) to set a primary name. More specifically, they had to set a reverse record on the [Reverse Registrar](/registry/reverse) contract which was only available on L1.

<QandA
  open
  question="What is the difference between a reverse record and a primary name?"
  answer="A reverse record is a mapping from an EVM address to an ENS name, which is only part of a primary name. In order for a primary name to be valid, the name must also forward resolve to the same address on the respective chain."
/>

Since a majority of user activity is now on L2s, we've added the ability to set a reverse record on the following Ethereum Rollups:

- Arbitrum
- Base
- Linea
- OP Mainnet
- Scroll

In addition to these chains, we've also added the ability to set a default reverse record on Ethereum Mainnet (L1) that serves as a fallback when no chain-specific primary name is set. This is the simplest way to set a universal primary name for users who have a wallet that supports all EVM chains.

While this may sound simple in theory, it's easy to get tripped on the details in practice. Let's look at an example.

### Understanding the Verification Process

The key thing to understand is that the forward address _for a given chain_ must match the reverse record on the respective chain's reverse registrar.

Say I own `nick.eth`. The name resolves to `0x1234...5678` because I've set the ETH address for that name. I call `setName("nick.eth")` on the Base reverse registrar, and I expect that my primary name is now `nick.eth` on Base. But that's actually not the case.

ENS names can resolve to [different addresses on different chains](/web/resolution), and since `nick.eth` in the example above has only specified an Ethereum Mainnet address, the verification process will fail. In order to fix this, I need to set the Base address for `nick.eth` which is on L1 in this case. This is done by calling the following function on the resolver for the name.

```solidity
setAddr(
  namehash("nick.eth"), // node (see Name Processing)
  convertEVMChainIdToCoinType(8453), // coinType (see ENSIP-11)
  0x1234...5678 // the address to set
)
```

Now that `nick.eth` resolves to `0x1234...5678` via the Base cointype, and `name(0x1234...5678)` on the Base reverse registrar returns `nick.eth`, my primary name is fully set.

An alternative approach, which would be more efficient in this case, is to set the default EVM address for `nick.eth` on the latest [public resolver](/resolvers/public), and the default reverse record to `nick.eth` on the default reverse registrar. This would allow the name to resolve to the correct address on all chains.

## Getting a Primary Name

:::info
**Important**: After retrieving a name from reverse resolution, you **must** verify it by performing a forward resolution on that name to confirm it still resolves to the original address. This prevents spoofing or misconfiguration. If the addresses don't match, display the original address instead of the name. Most libraries will handle this for you.
:::

Looking up a users L1 primary name is very simple. In most web3 libraries (wagmi, viem, ethers, web3py, etc.), you will find a built-in function to do a lookup by address as shown below. In most cases, the library will handle the verification for you.

Remember that in all cases, ENS resolution always starts from Ethereum Mainnet.

:::code-group

```tsx [Wagmi]
// https://wagmi.sh/react/hooks/useEnsName
import { useEnsName } from 'wagmi'
import { mainnet } from 'wagmi/chains'

export const Name = () => {
  const { data: name } = useEnsName({
    address: '0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5',
    chainId: mainnet.id, // resolution always starts from L1
  })

  return <div>Name: {name}</div>
}
```

```ts [Ethers v5]
const address = '0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5';
const name = await provider.lookupAddress(address);

// Always verify the forward resolution
if (name) {
    const resolvedAddress = await provider.resolveName(name);
    if (resolvedAddress !== address) {
        // If verification fails, use the original address
        return address;
    }
}
```

```ts [Viem]
// https://viem.sh/docs/ens/actions/getEnsName.html
import { publicClient } from './client'

const ensName = await publicClient.getEnsName({
  address: '0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5',
})
```

```py [Web3.py]
# https://web3py.readthedocs.io/en/latest/ens_overview.html#get-the-ens-name-for-an-address
from ens.auto import ns

name = ns.name('0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5')
```

```go [Go]
package main

import (
	"fmt"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	ens "github.com/wealdtech/go-ens/v3"
)

func main() {
	client, _ := ethclient.Dial("https://rpc.ankr.com/eth")

	name, _ := ens.ReverseResolve(client, common.HexToAddress("0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5"))
	fmt.Println("Name:", name)
	// Name: nick.eth
}
```

:::

As of September 2025, Wagmi and Viem are the only libraries that support L2 Primary Names, and they can be used like this:

```tsx [Wagmi]
// https://wagmi.sh/react/hooks/useEnsName
import { toCoinType } from 'viem'
import { useEnsName } from 'wagmi'
import { base, mainnet } from 'wagmi/chains'

export const Name = () => {
  const { data: name } = useEnsName({
    address: '0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5',
    chainId: mainnet.id, // resolution always starts from L1
    coinType: toCoinType(base.id), // [!code ++]
  })

  return <div>Name: {name}</div>
}
```

:::info
The official implementation of L2 Primary Names has a propogation period of up to 6 hours. If you're participating in a hackathon and need to resolve a name immediately, you can use [this implementation](https://github.com/ensdomains/frontend-template/blob/main/src/hooks/useEnsNameOptimistic.tsx) instead (not recommended for production use).
:::

🎉 And that's it! Now you can turn all your pages from this, to this:

<Card className="flex flex-col items-center gap-2">
  <div className="flex items-center gap-2">
    <Badge>0xb8c2...67d5</Badge>
    <span>sent 0.1 ETH to</span>
    <Badge>0xd8dA....6045</Badge>
  </div>
  <span className="text-grey text-sm">turns into</span>
  <div className="flex items-center gap-2">
    <Badge>nick.eth</Badge>
    <span>sent 0.1 ETH to</span>
    <Badge>vitalik.eth</Badge>
  </div>
</Card>

:::info
If you're a library developer looking to implement this functionality, we recommend using the [Universal Resolver](/resolvers/universal). It's a utility contract that greatly simplifies the process of resolving a name.
:::

## Setting Primary Names

Since primary names require two-way resolution, there are technically two steps to setting it up. Let's say that user `0x1234...5678` wants to set their primary name on Base to `nick.eth`.

First, the user would need to set the Base address for `nick.eth` to `0x1234...5678`. [Read more about multichain addresses](/web/resolution#multi-chain-addresses-btc-ltc-etc) to understand how this works.

Next, the user would need to set the reverse record for `0x1234...5678` to `nick.eth` in the Base Reverse Registrar. [Read more about reverse records](/registry/reverse) to understand how this works.

In order to avoid doing this manually for multiple chains, the user can set their default reverse record to `nick.eth` on the default reverse registrar, and their default EVM address to `0x1234...5678` on the latest [public resolver](/resolvers/public).

<EmbedLink
  href="/registry/reverse"
  title="Reverse Registrars"
  description="Learn more about the smart contracts that manage reverse records on L1 and L2s."
/>

---
description: List all names a user has, owns, or might have access to.
---

# Listing a Users Names

In some cases you might want to show off all names that a user owns. Due to the nature of how the ENS Protocol works under the hood, this might be a slightly more difficult task than expected.

Fortunately, tooling has been developed to accommodate for this and to make it easier.

## Why not all names?

Not all ENS names exist onchain ([learn more about wildcard resolution](/ensip/10)), meaning we don't always know which names a user owns/controls.

The notable exception is [second-level](/terminology#first-layer) [.eth names](/registry/eth). Ownership of these names are onchain and indexable through scanning events on the appropriate smart contracts. Note that this does not necessarily mean address and text records associated with the name are onchain ([read more about offchain resolvers](/resolvers/ccip-read)).

## Guidelines

When using one of the methods described below it is important to keep in mind that you should always allow for a user to manually enter a name, as not all names are indexable.

It is generally recommended to allow users to input a name using an [input box](/web/design#2-resolving-input-fields) and to verify it resolves to the correct address upon user-completion.

## The Graph

The [ENS subgraph](/web/subgraph) indexes all events from relevant smart contracts and exposes them via a GraphQL endpoint. Note that addresses in filters must be lowercased.

ENSjs makes it easy to run common queries on the subgraph with strong type safety. Docs can be found [here](https://github.com/ensdomains/ensjs/tree/main/docs/subgraph).

```graphql
{
  domains(where: { owner: "0x225f137127d9067788314bc7fcc1f36746a3c3b5" }) {
    name
  }
  wrappedDomains(
    where: { owner: "0x225f137127d9067788314bc7fcc1f36746a3c3b5" }
  ) {
    name
  }
}
```
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'

# Hosting a Decentralized Website [Introduction to hosting a decentralized website using ENS]

## ContentHash

The ContentHash is a very popular component of an ENS name, first introduced in [ENSIP-7](/ensip/7).
It can be queried by hitting the [contenthash(bytes32)](/resolvers/interfaces#0xbc1c58d1) function on a name's resolver.
You can also [set the contenthash on a name](/resolvers/interfaces#0x304e6ade) if the resolver supports it.

<Card className="flex justify-center gap-4">
  {['ipfs://bafy...', 'bzz://2477', 'ar://HGa8...'].map((tag) => (
    <Badge key={tag} variant="secondary">
      {tag}
    </Badge>
  ))}
</Card>

## Hosting & Pinning

When it comes to hosting your files there are many options to choose from.

<Card className="flex justify-center gap-4">
  {['IPFS / Filecoin', 'Swarm', 'Arweave'].map((tag) => (
    <Badge key={tag} variant="secondary">
      {tag}
    </Badge>
  ))}
</Card>

Popular options include [IPFS](https://ipfs.io), [Swarm](https://ethswarm.org), and [Arweave](https://arweave.org).
Depending on what option you go with your files are either permanently stored on a network,
or require to be actively stored on at least one machine, also known as "pinning".

### Deploy your sites

Several helpful tools and platforms exist that you can use to deploy your website to IPFS, Swarm, or Arweave.

| Tool | Network Support |
| --- | --- |
| [Omnipin](https://omnipin.eth.link) |  IPFS and Swarm |
| [Orbiter](https://orbiter.host) |  IPFS |
| [IPFS Deploy Action](https://github.com/ipfs/ipfs-deploy-action) | IPFS |
| [4EVERLAND](https://4everland.org) | IPFS and Arweave |

## Setting your ContentHash

If you are using the public resolver (the default for names registered using the ENS Manager App), you can set the contenthash directly from within the [ENS Manager App](https://app.ens.domains).

If you are using a custom resolver, or are writing your own resolver you will be able to have more fine grained control over the contenthash field.
See [ENSIP-7](/ensip/7) for more information on the contenthash field.

## Browser Support & Gateways

At the moment of writing, major browsers such as Chrome, Firefox and Safari do not natively support accessing decentralized websites.
If you want to directly access .eth websites without relying on third-party infrastructure, you can use [Brave](https://brave.com) or [Opera](https://opera.com), which both support .eth resolution.
Certain browser extensions such as [MetaMask](https://metamask.io) are also able to resolve .eth names.

In order to access dweb without having to install a new browser or an extension, you can use one of the following ENS gateways:
- [eth.link](https://eth.link) for IPFS, Swarm and Arweave
- [eth.limo](https://eth.limo) for IPFS, Swarm and Arweave
- [eth.sucks](https://eth.sucks) for IPFS
- [bzz.link](https://bzz.link) for Swarm

If a website is hosted on IPFS, it is also possible to access it directly from IPFS gateways.
In order to access a decentralized website through an IPFS gateway, convert dots to dashes and append the `.ipns` namespace (e.g. `ens.eth` becomes `ens-eth.ipns.<gateway>`).
Below is a list of IPFS gateways that support ENS:

- [inbrowser.link](https://inbrowser.link) - trustlessly verifies content client-side
- [dweb.link](https://dweb.link) - official IPFS subdomain gateway

---
description: Issue subdomains to your users, yourself, or your friends. Program your own resolver, or use one of the many existing ones.
---

import { EmbedLink } from '../../components/EmbedLink'
import { Card } from '../../components/ui/Card'

# Subdomains

We believe that any place an address is used, a name should be able to be used instead.
The smart contracts you interact with have names, the deposit address for your favorite exchange has a name, your favorite DAO has a name, or maybe you use subnames to keep your wallets organized.

<Card className="flex items-center justify-center text-xl">
  <div className="text-right font-bold">
    {['root', 'registrar', 'controller', 'resolver', 'registry'].map(
      (subname, i) => (
        <div
          className={
            ['opacity-20', 'opacity-50', '', 'opacity-50', 'opacity-20'][i]
          }
          key={subname}
        >
          {subname}
        </div>
      )
    )}
  </div>
  <div className="text-blue font-bold">.ens.eth</div>
</Card>

Luckily, the ENS Protocol has so much to offer for you to play with. There are a variety of ways you can give out subdomains to your apps users, set them up for yourself, or more.

If you are interested in naming smart contracts specifically, check out the [Naming Smart Contracts](/web/naming-contracts) page.

## Different Types of Subnames

ENS subnames come in a variety of forms: L1, L2, and offchain. From a technical perspective, L2 and offchain subnames are quite similar, but there are some tradeoffs to consider when choosing which one to use.

### L1 Subnames

If you own a .eth name like nick.eth and go to create a subname in [the manager app](https://app.ens.domains/nick.eth?tab=subnames), you will be creating a subname on Ethereum Mainnet (L1) by default. This is the simplest way to create a subname with the least amount of moving pieces, but ultimately you are limited by the gas fees of Ethereum Mainnet.

If you'd like to issue L1 subnames to your users, read our guide on [creating an onchain subname registrar](/wrapper/creating-subname-registrar).

<EmbedLink
  title="Creating an Onchain Subname Registrar"
  href="/wrapper/creating-subname-registrar"
  description="Issue NFTs that represent subdomains on Ethereum Mainnet."
/>

### L2 Subnames

Developers can connect an ENS name on L1 with their own smart contracts on any L2 network, and [depending on the implementation](/learn/ccip-read), this could be fully trustless while significantly reducing the cost of issuing subnames.

[Durin](https://durin.dev/) is an opinionated approach to issuing ENS subnames on L2. It takes care of the L1 Resolver and offchain gateway parts of the [CCIP Read stack](/resolvers/ccip-read) for you, so you can focus on the business logic of your L2 smart contracts.

<EmbedLink
  title="Durin"
  href="https://durin.dev/"
  description="An opinionated approach to issuing ENS subnames on L2."
/>

### Offchain Subnames

Offchain subnames are exactly what they sound like - subnames that live in a centralized database on private servers, also powered by [CCIP Read](/resolvers/ccip-read). If your goal is to name a large amount of EVM addresses quickly and cheaply, with a low barrier to entry, offchain subnames might be for you. Often times, managing offchain names is as simple as interacting with a REST API.

From a user perspective, offchain subnames are hardly different than onchain subnames. They will not appear in wallet applications as NFTs like the previous two approaches, but they can resolve all the same data (addresses, text records, etc).

There are multiple API providers that offer programmatic access to offchain subnames such as [NameStone](https://namestone.com/), [Namespace](https://namespace.ninja/) and [JustaName](https://justaname.id/), along with open-source examples like [gskril/ens-offchain-registrar](https://github.com/gskril/ens-offchain-registrar).

# Naming Contracts [Learn how to name your smart contracts with ENS]

While it's commonly known that regular user accounts can have [primary names](/web/reverse), it's less known that smart contracts can also have names.

In order for you to manage the primary name of your smart contract, you need to own the [reverse node](/terminology#reverse-node) for the contract address. There are several ways of doing this, depending on if you are actively developing your contract or if it is already deployed.

:::note
To enable reverse resolution, you must set both the reverse record and the ETH address to the contract’s deployed address.
:::

Skip to [Naming Tools](#naming-tools) for a frontend solution to naming your smart contracts.

## New Contracts

Depending on your use case, there are a few ways to set a smart contract's primary name.

If you want to be able to change the name later, you have two options:

- **(Recommended)** Make the contract [Ownable](https://docs.openzeppelin.com/contracts/5.x/access-control) and set yourself as the owner.
- Take ownership of the reverse node (`{address}.addr.reverse`) for the contract. This only works for contracts on Ethereum Mainnet.

The Ownable method is preferred since it doesn't require any additional code in many cases, and has the best Etherscan support.

For immutable smart contracts (without an owner), you can set the reverse record directly in the constructor at the time of deployment.

Let's look at a few examples.

### Ownable (recommended)

:::note
An example of this is [ownable.contract.gtest.eth](https://etherscan.io/address/ownable.contract.gtest.eth#code)
:::

If you want to be able to change the name in the future, you can make your smart contract [Ownable](https://docs.openzeppelin.com/contracts/5.x/api/access#Ownable).

```solidity
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MyContract is Ownable {
    constructor(address initialOwner) Ownable(initialOwner) {}
}
```

[Reverse Registrars](/registry/reverse) on all supported chains understand the Ownable interface and will let the `owner()` of a contract set its reverse record without having to add any ENS-specific code.

Once this contract is deployed, call `setNameForAddr()` on a Reverse Registrar from your authorized owner account on the relevant chain. Note that the arguments are slightly different on L1 and L2s.

- The first address argument should be the address of your contract (both L1 and L2s)
- The second address argument should be the owner of your smart contract (only L1)
- The third address argument should be the `defaultResolver()` from the Reverse Registrar (only L1)
- The last argument is the ENS name to set it to (both L1 and L2s)

### Set a name in the constructor

:::note
An example of this [contract.gtest.eth](https://etherscan.io/address/contract.gtest.eth#code)
:::

If you don't want to be able to change the name in the future, you can call `setName()` on a Reverse Registrar directly from your contract's constructor. Your contract would look something like this:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

interface IReverseRegistrar {
    function setName(string memory name) external returns (bytes32);
}

contract MyContract {
    /// @param reverseRegistrar The address of the Reverse Registrar contract on the relevant chain to use.
    /// @param name The reverse name to set for this contract's address.
    constructor(address reverseRegistrar, string memory name) {
        IReverseRegistrar(reverseRegistrar).setName(name);
    }
}
```

You can find the Reverse Registrar addresses [here](/registry/reverse#supported-chains).

### ReverseClaimer.sol (L1 only)

:::note
While this method works perfectly at the ENS protocol level, Etherscan does not index the contract events correctly so it may not appear in their UI.
:::

This is a simple drop-in module that transfers ownership of the reverse node to an address of your choice, which can then update the reverse name at any time.

```solidity
import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "@ensdomains/ens-contracts/contracts/reverseRegistrar/ReverseClaimer.sol";

contract MyContract is ReverseClaimer {
    constructor (
        ENS ens
    ) ReverseClaimer(ens, msg.sender) {}
}
```

When you deploy your contract, the deployer account (`msg.sender`) will be given ownership of the reverse node for that contract address. This gives you authorization to call `setName(node, newName)` on the latest public resolver ([resolver.ens.eth](https://etherscan.io/address/resolver.ens.eth)), where `node` is the reverse node for the contract address and `newName` is the name you want to set it to.

To find the reverse node for your contract address, you can use the following viem script:

```ts
import { namehash } from 'viem/ens'

const myContractAddress = '0x...' // replace with your contract address

const node = namehash(
  `${myContractAddress.slice(2).toLowerCase()}.addr.reverse`
)

console.log(node)
```

## Existing Contracts

If your contract is already deployed you might still be able to set a name for it.
If your contract supports the [Ownable](https://docs.openzeppelin.com/contracts/5.x/api/access#Ownable) interface from OpenZeppelin, [read the section above](#ownable-recommended).

### Safe, Multisig & DAO

If your contract is a Safe, Multisig, DAO or otherwise has the ability to execute arbitrary calldata, you can use a [Reverse Registrar](/registry/reverse) contract directly to set a name for it.

You might even be able to use the [ENS Manager App](https://app.ens.domains/) inside of your safe app to set a primary name.

## Naming Tools

:::warning
These are 3rd party tools and not officially supported by ENS Labs.
:::

[Enscribe](https://app.enscribe.xyz/) is a tool designed to simplify the process of naming smart contracts with ENS names. The application enables users to deploy new smart contracts with a primary name directly and easily name existing smart contracts.

Enscribe simplifies what is otherwise a multi-step, error-prone process by offering:

- Atomic contract deployment using `CREATE2`
- Naming `Ownable`, `ERC173` and `ReverseClaimer` contracts as described above
- ENS subname creation, forward resolution and reverse record assignment
- Naming of existing contracts, with an easy way to locate contracts that you've already deployed

Even if you don't own an ENS name, you can still utilize Enscribe's hosted ENS parent, `deployd.eth`, to create subnames like `my-app.deployd.eth` and set them as the primary name for your contract.

To learn more, refer to the [Enscribe Docs](https://www.enscribe.xyz/docs/).

# Multichain [L2 & Crosschain Resolution]

## ENS L2

The ENS Labs team recently announced our plans and roadmap for scaling ENS to the entire internet and beyond. You can read more [on our blog](https://blog.ens.domains/post/ensv2), [on X](https://twitter.com/ensdomains/status/1795440186513576318), and [the forums](https://discuss.ens.domains/t/technical-feedback-thread-for-ensv2/19233).

The roadmap involves migrating .eth registrations to a new system, in addition to improved support for existing L2 solutions.
You can find out more on the [changelog](/changelog).

## But isn't ENS on mainnet?

Yes, technically. The resolution process always starts on mainnet. There needs to be, one source of truth after all. However, the name
resolution process can branch off to other chains, offchain gateways and much more.

To read a more in-depth explanation of how resolution works, checkout the [section dedicated to the Resolution Process](/resolution/).

## My dapp is on X but I want ENS

The ENS Protocol can be used on/for any chain!
If you are building a non-mainnet dApp and want to use ENS names simply [add a Mainnet RPC to your Wagmi config](/web/libraries) and specify `chainId: 1` in your config like so:

```tsx
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'

const Name = () => {
  const { data: ensName } = useEnsAddress({
    name: 'nick.eth',
    chainId: 1, // (1 = Ethereum, 11155111 = Sepolia) // [!code hl]
  })

  return <div>{ensName || address}</div>
}
```

And voila! You can now resolve ENS names anywhere! 🎉

---
description: The ENS subgraph
---

# Subgraph

This is a page covering the graph's ENS subgraph. The ENS subgraph indexes onchain events of second-level .eth names, and DNS imported names.
It allows us to build a reasonable approximation of the ENS names an address owns.

To read more about why not all names (such as Offchain & Gasless Names) show up in the subgraph read the [listing names](/web/enumerate) page.

## The Graph

The Graph is a protocol for indexing and querying data from blockchains. There are multiple subgraphs that you can use to query information about ENS names.
These subgraphs are available for [mainnet](https://thegraph.com/explorer/subgraphs/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH), [sepolia](https://api.studio.thegraph.com/query/49574/enssepolia/version/latest) and [holesky](https://api.studio.thegraph.com/query/49574/ensholesky/version/latest).

:::note
Developers are welcome to use our rate limited API endpoints above for
testing, but it is highly encouraged to [sign up for a free account with
TheGraph](https://thegraph.com/studio/apikeys/) to get your own API key.
:::

## GraphQL Schema

The schema for the ENS subgraph is defined in [/schema.graphql](https://github.com/ensdomains/ens-subgraph/blob/master/schema.graphql).

## Use Cases

There are certain use cases where the graph is better for querying ENS specific information than through the resolution process.
One of such use-cases is querying which NFT names are owned by a specific address.

## Terminology

When using the subgraph, you may encounter `registrant` and `controller` fields. These were the old terminology for [Owner](/terminology#owner) and [Manager](/terminology#manager) respectively.

The `registrant` address is the owner of a name. It's the same value that will be returned from calling `ownerOf()` on the Base Registrar Controller (registrar.ens.eth). A registrant/owner may transfer ownership and assign a controller/manager.

The `controller` address is the manager of a name. It's the same value that will be returned from calling `owner()` on the ENS Registry (registry.ens.eth). A controller/manager may change the resolver of a name and set its records.

## Example Queries

:::note
Most of these example queries have equivalent functionality in [ENSjs](https://github.com/ensdomains/ensjs/tree/main/docs).
:::

You can explore the following examples interactively via the [Graph Explorer Playground](https://thegraph.com/explorer/subgraphs/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH?view=Playground&chain=arbitrum-one)

### Getting a list of names owned by an account

Ensure the address is lowercase

```graphql
query getDomainsForAccount {
  domains(where: { owner: "0xa508c16666c5b8981fa46eb32784fccc01942a71" }) {
    name
  }
}
```

### Getting the top domain for an account based on the longest registry

```graphql
query getDomainForAccount {
  account(id: "0xa508c16666c5b8981fa46eb32784fccc01942a71") {
    registrations(first: 1, orderBy: expiryDate, orderDirection: desc) {
      domain {
        name
      }
    }
    id
  }
}
```

returns

```json
{
  "data": {
    "account": {
      "registrations": [
        {
          "domain": {
            "name": "datanexus.eth"
          }
        }
      ],
      "id": "0xa508c16666c5b8981fa46eb32784fccc01942a71"
    }
  }
}
```

### Searching for a subdomain

```graphql
query getSubDomains($Account: String = "messari.eth") {
  domains(where: { name: "messari.eth" }) {
    name
    id
    subdomains(first: 10) {
      name
    }
    subdomainCount
  }
}
```

returns

```json
{
  "data": {
    "domains": [
      {
        "name": "messari.eth",
        "id": "0x498ada62251a1227664ace8d97b0de2dcc6652ddf61e6fb5d3150f43ccf599e6",
        "subdomains": [
          {
            "name": "subgraphs.messari.eth"
          },
          {
            "name": "bd.messari.eth"
          }
        ],
        "subdomainCount": 2
      }
    ]
  }
}
```

### Getting the expiry of an ENS domain

```graphql
query getDomainExp($Account: String = "paulieb.eth") {
  registrations(
    where: { domain_: { name: $Account } }
    first: 1
    orderBy: expiryDate
    orderDirection: desc
  ) {
    expiryDate
  }
}
```

returns

```json
{
  "data": {
    "registrations": [
      {
        "expiryDate": "1714752524"
      }
    ]
  }
}
```
