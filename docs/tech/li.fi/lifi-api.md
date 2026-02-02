> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Overview

> Fundamentals of LI.FI`s API.

## Base URL

LI.FI’s API is built on REST principles and is served over HTTPS.

The Base URL for all API endpoints is:

```javascript  theme={"system"}
https://li.quest/v1
```

## Authentication

<Note>All LI.FI APIs do not require API key. API key is only needed for higher rate limits</Note>

Authentication to LI.FI's API is performed via the custom HTTP header `x-lifi-api-key` with an API key. If you are using the Client SDK, you will set the API when constructing a client, and then the SDK will send the header on your behalf with every request. If integrating directly with the API, you’ll need to send this header yourself like so:

```curl  theme={"system"}
curl --location 'https://li.quest/v1/quote?fromChain=100&fromAmount=1000000&fromToken=0x4ecaba5870353805a9f068101a40e0f32ed605c6&fromAddress=0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0&toChain=137&toToken=0x2791bca1f2de4661ed88a30c99a7a9449aa84174&slippage=0.03' \
--header 'x-lifi-api-key: YOUR_CUSTOM_KEY'
```

API key can be tested using the following endpoint:

```javascript  theme={"system"}
curl --location 'https://li.quest/v1/keys/test'
--header 'x-lifi-api-key: YOUR_CUSTOM_KEY'
```

<Note> Never expose your `x-lifi-api-key` in client-side environments such as browser-based JavaScript or direct Widget integrations. Using the API key on the client side can lead to unauthorized usage or abuse of your key, as it becomes publicly accessible in the browser's developer tools or network tab.
If you're using the LI.FI Widget, you **do not need to pass an API key**. The Widget operates securely without requiring a key in the frontend. For server-side integrations (e.g. SDK or API requests from your backend), always keep your key secret and secure. </Note>

## Rate Limit

Rate limit is counted per IP without API key and per API Key with authenticated requests.

Please refer to [Rate limits and API authentication](/api-reference/rate-limits) page.

## Error Message

Errors consist of three parts:

1. HTTP error code
2. LI.FI error code
3. Error message

Specific error codes and messages are defined on [Error Codes](/api-reference/error-codes) page

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# OpenAPI Specification

> Download the LI.FI API OpenAPI specification for integration with AI agents, SDKs, and tools

## LI.FI OpenAPI Specification

The LI.FI API follows the OpenAPI 3.0 specification. You can use this spec to:

* Generate client SDKs in any language
* Import into API testing tools (Postman, Insomnia, etc.)
* Integrate with AI agents and LLM tools
* Build automated documentation

## Download

<Card title="OpenAPI YAML" icon="file-code" href="https://github.com/lifinance/public-docs/blob/main/openapi.yaml">
  Download the OpenAPI specification
</Card>

## API Base URLs

| Environment | Base URL                   |
| ----------- | -------------------------- |
| Production  | `https://li.quest`         |
| Staging     | `https://staging.li.quest` |

## Quick Links

* [API Introduction](/api-reference/introduction) - Get started with the LI.FI API
* [Authentication](/api-reference/authentication) - Learn about API keys and rate limits
* [Get a Quote](/api-reference/get-a-quote-for-a-token-transfer) - Request a cross-chain swap quote

## For AI Agents

AI agents can discover this API through:

```
https://docs.li.fi/.well-known/ai-plugin.json
```

This provides a standard discovery format compatible with most AI platforms.

## Specification Details

* **OpenAPI Version**: 3.0.2
* **API Version**: 1.0.0
* **Endpoints**: 28+ paths covering quotes, routes, tokens, chains, and more

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Rate Limits and API Authentication

To mitigate misuse and manage capacity on our API, we have implemented limits on LI.FI API usage.

Rate limits apply to requests made using your `x-lifi-api-key` and are calculated per API key across all endpoints. These limits help prevent abuse and ensure a smooth experience for everyone.

# Current Rate Limits

The default rate limits for production usage are as follows:

### Unauthenticated

| Endpoint Scope                                                                                                        | Rate Limit                 |
| --------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| <Tooltip tip="Consists of /quote, /advanced/routes, and /stepTransaction endpoints">Quote related endpoints</Tooltip> | 200 requests per two hours |
| Rest of endpoints                                                                                                     | 200 requests per two hours |

### Authenticated

| Endpoint Scope                                                                                                        | Rate Limit              |
| --------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| <Tooltip tip="Consists of /quote, /advanced/routes, and /stepTransaction endpoints">Quote related endpoints</Tooltip> | 200 requests per minute |
| Rest of endpoints                                                                                                     | 200 requests per minute |

<Note> Rate limits are enforced on a two hour window to account for traffic spikes </Note>

> 🔒 Higher limits may be available for enterprise clients. Please see our [Plans page](https://li.fi/plans/) for more details.

# Handling Rate Limits

Every response includes your current rate limit in the headers. Keep in mind that limits can differ depending on the endpoint.

In the Partner Portal, you’ll see your requests-per-minute (RPM) limit. To give you flexibility during spikes, we don’t enforce it minute by minute. Instead, we multiply your RPM by 120 and apply it as a two-hour rolling window.

👉 Example: If your limit is 100 RPM, that means you can make up to 12,000 requests within any two-hour window — either all at once or spread out however you like.

### Rate Limit Information In Request Response

`ratelimit-reset`: in how many seconds will the rate limit reset (2 hours equal 7200)

`ratelimit-limit`: the total limit for the period of 2 hours

`ratelimit-remaining`: how much of the limit is still left until the reset

Here's how you can calculate your average RPM:

`(ratelimit-limit - ratelimit-remaining) / ((7200 - ratelimit-reset) / 60)`

If you exceed your rate limits, you'll receive a `429 Too Many Requests` HTTP response. When this occurs:

* You will get an error message showing when the rate limit will be lifted (e.g., 5 hours)
* Request higher rate limit

# Best Practices

To avoid hitting rate limits:

* Cache results from `GET /tokens`, `GET /chains`, and static endpoints
* Avoid polling frequently for the same data
* Batch or debounce user input that triggers API calls

# Abuse Prevention

To prevent abuse, LI.FI may temporarily block keys that:

* Consistently exceed rate limits
* Attempt to bypass limits through multiple keys or IPs
* Cause performance degradation to the service

# Using the API key

<Note>All LI.FI APIs do not require API key. API key is only needed for higher rate limits</Note>

Authentication to LI.FI's API is performed via the custom HTTP header `x-lifi-api-key` with an API key. If you are using the Client SDK, you will set the API when [creating a config](/sdk/configure-sdk), and then the SDK will send the header on your behalf with every request. If integrating directly with the API, you’ll need to send this header yourself like so:

```curl  theme={"system"}
curl --location 'https://li.quest/v1/quote?fromChain=100&fromAmount=1000000&fromToken=0x4ecaba5870353805a9f068101a40e0f32ed605c6&fromAddress=0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0&toChain=137&toToken=0x2791bca1f2de4661ed88a30c99a7a9449aa84174&slippage=0.03' \
--header 'x-lifi-api-key: YOUR_CUSTOM_KEY'
```

API key can be tested using the following endpoint:

```javascript  theme={"system"}
curl --location 'https://li.quest/v1/keys/test'
--header 'x-lifi-api-key: YOUR_CUSTOM_KEY'
```

<Note> Never expose your `x-lifi-api-key` in client-side environments such as browser-based JavaScript or direct Widget integrations. Using the API key on the client side can lead to unauthorized usage or abuse of your key, as it becomes publicly accessible in the browser's developer tools or network tab.
If you're using the LI.FI Widget, you **do not need to pass an API key**. The Widget operates securely without requiring a key in the frontend. For server-side integrations (e.g. SDK or API requests from your backend), always keep your key secret and secure. </Note>

# Need Higher Limits?

If you're building a high-volume integration or a production-grade product, we’re happy to support your scaling needs.

Please see our [Plans page](https://li.fi/plans/) for more details.

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Error Codes

> Exhaustive list of possible error codes

## API status codes

API status code is the code returned by the server like 200, 404, 429, 500, 502.

## API error codes

API returns the following set of error codes:

* DefaultError = 1000,
* FailedToBuildTransactionError = 1001,
* NoQuoteError = 1002,
* NotFoundError = 1003,
* NotProcessableError = 1004,
* RateLimitError = 1005,
* ServerError = 1006,
* SlippageError = 1007,
* ThirdPartyError = 1008,
* TimeoutError = 1009,
* UnauthorizedError = 1010,
* ValidationError = 1011,
* RpcFailure = 1012,
* MalformedSchema = 1013,

## Tool errors

In addition to returning status and error codes, API may return error messages for underlying tools, describing an issue with specific tools. This can be caused by many reasons, from the tool simply not supporting the requested token pair or insufficient liquidity.

To better explain failure cases, we try to return errors in a predictable format. The `ToolError` interface looks like the following:

```TypeScript  theme={"system"}
type ToolErrorType = 'NO_QUOTE'

interface ToolError {
  errorType: ToolErrorType
  code: string
  action: Action
  tool: string
  message: string
}
```

### Possible codes:

`NO_POSSIBLE_ROUTE`: No route was found for this action.

`INSUFFICIENT_LIQUIDITY`: The tool's liquidity is insufficient.

`TOOL_TIMEOUT`: The third-party tool timed out.

`UNKNOWN_ERROR`: An unknown error occurred.

`RPC_ERROR`: There was a problem getting on-chain data. Please try again later.

`AMOUNT_TOO_LOW`:The initial amount is too low to transfer using this tool.

`AMOUNT_TOO_HIGH`: The initial amount is too high to transfer using this tool.

`FEES_HGHER_THAN_AMOUNT`: The fees are higher than the initial amount -- this would result in negative resulting token.

`DIFFERENT_RECIPIENT_NOT_SUPPORTED`: This tool does not support different recipient addresses.

`TOOL_SPECIFIC_ERROR`: The third-party tool returned an error.

`CANNOT_GUARANTEE_MIN_AMOUNT`: The tool cannot guarantee that the minimum amount will be met.

### Example response:

```TypeScript  theme={"system"}
{
    "message": "Unable to find a quote for the requested transfer.",
    "errors": [
        {
            "errorType": "NO_QUOTE",
            "code": "INSUFFICIENT_LIQUIDITY",
            "action": {
                "fromChainId": 100,
                "toChainId": 100,
                "fromToken": {
                    "address": "0x4ecaba5870353805a9f068101a40e0f32ed605c6",
                    "decimals": 6,
                    "symbol": "USDT",
                    "chainId": 100,
                    "coinKey": "USDT",
                    "name": "USDT",
                    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
                    "priceUSD": "0.99872"
                },
                "toToken": {
                    "address": "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83",
                    "decimals": 6,
                    "symbol": "USDC",
                    "chainId": 100,
                    "coinKey": "USDC",
                    "name": "USDC",
                    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
                },
                "fromAmount": "1",
                "slippage": 0.03,
                "fromAddress": "0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0",
                "toAddress": "0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0"
            },
            "tool": "1inch",
            "message": "The tool's liquidity is insufficient."
        },
        {
            "errorType": "NO_QUOTE",
            "code": "TOOL_TIMEOUT",
            "action": {
                "fromChainId": 100,
                "toChainId": 100,
                "fromToken": {
                    "address": "0x4ecaba5870353805a9f068101a40e0f32ed605c6",
                    "decimals": 6,
                    "symbol": "USDT",
                    "chainId": 100,
                    "coinKey": "USDT",
                    "name": "USDT",
                    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
                    "priceUSD": "0.99872"
                },
                "toToken": {
                    "address": "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83",
                    "decimals": 6,
                    "symbol": "USDC",
                    "chainId": 100,
                    "coinKey": "USDC",
                    "name": "USDC",
                    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
                },
                "fromAmount": "1",
                "slippage": 0.03,
                "fromAddress": "0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0",
                "toAddress": "0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0"
            },
            "tool": "openocean",
            "message": "The third party tool timed out."
        },
        {
            "errorType": "NO_QUOTE",
            "code": "NO_POSSIBLE_ROUTE",
            "action": {
                "fromChainId": 100,
                "toChainId": 100,
                "fromToken": {
                    "address": "0x4ecaba5870353805a9f068101a40e0f32ed605c6",
                    "decimals": 6,
                    "symbol": "USDT",
                    "chainId": 100,
                    "coinKey": "USDT",
                    "name": "USDT",
                    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
                    "priceUSD": "0.99872"
                },
                "toToken": {
                    "address": "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83",
                    "decimals": 6,
                    "symbol": "USDC",
                    "chainId": 100,
                    "coinKey": "USDC",
                    "name": "USDC",
                    "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
                },
                "fromAmount": "1",
                "slippage": 0.03,
                "fromAddress": "0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0",
                "toAddress": "0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0"
            },
            "tool": "superfluid",
            "message": "No route was found for this action."
        }
    ]
}
```

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Get information about all currently supported chains

> If you want to learn more about how to use this endpoint please have a look at our [guide](https://docs.li.fi/more-integration-options/li.fi-api/requesting-supported-chains).



## OpenAPI

````yaml get /v1/chains
openapi: 3.0.2
info:
  title: LI.FI API
  version: 1.0.0
  description: >-
    LI.FI provides the best cross-chain swap across all liquidity pools and
    bridges.
servers:
  - url: https://li.quest
    description: LI.FI Production Environment
  - url: https://staging.li.quest
    description: LI.FI Staging Environment
security: []
paths:
  /v1/chains:
    get:
      summary: Get information about all currently supported chains
      description: >-
        If you want to learn more about how to use this endpoint please have a
        look at our
        [guide](https://docs.li.fi/more-integration-options/li.fi-api/requesting-supported-chains).
      parameters:
        - example: EVM,SVM
          name: chainTypes
          description: Restrict the resulting tokens to the given chainTypes.
          schema:
            type: string
          in: query
          required: false
        - name: x-lifi-api-key
          description: The apiKey allows you to authenticate on the API.
          schema:
            type: string
          in: header
      responses:
        '200':
          $ref: '#/components/responses/ChainsResponse'
components:
  responses:
    ChainsResponse:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ChainsResponse'
          examples:
            ChainsResponseExample:
              value:
                chains:
                  - key: eth
                    name: Ethereum
                    chainType: EVM
                    coin: ETH
                    id: 1
                    mainnet: true
                    logoURI: >-
                      https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/ethereum.svg
                    tokenlistUrl: https://gateway.ipfs.io/ipns/tokens.uniswap.org
                    multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11'
                    metamask:
                      chainId: '0x1'
                      blockExplorerUrls:
                        - https://etherscan.io/
                      chainName: Ethereum Mainnet
                      nativeCurrency:
                        name: ETH
                        symbol: ETH
                        decimals: 18
                      rpcUrls:
                        - >-
                          https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
                    nativeToken:
                      address: '0x0000000000000000000000000000000000000000'
                      decimals: 18
                      symbol: ETH
                      chainId: 1
                      coinKey: ETH
                      name: ETH
                      logoURI: >-
                        https://static.debank.com/image/token/logo_url/eth/935ae4e4d1d12d59a99717a24f2540b5.png
                      priceUSD: '2582.35'
                  - key: pol
                    name: Polygon
                    chainType: EVM
                    coin: MATIC
                    id: 137
                    mainnet: true
                    logoURI: >-
                      https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/polygon.svg
                    tokenlistUrl: >-
                      https://unpkg.com/quickswap-default-token-list@1.0.71/build/quickswap-default.tokenlist.json
                    faucetUrls:
                      - https://stakely.io/faucet/polygon-matic
                    multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11'
                    metamask:
                      chainId: '0x89'
                      blockExplorerUrls:
                        - https://polygonscan.com/
                        - https://explorer-mainnet.maticvigil.com/
                      chainName: Matic(Polygon) Mainnet
                      nativeCurrency:
                        name: MATIC
                        symbol: MATIC
                        decimals: 18
                      rpcUrls:
                        - https://polygon-rpc.com/
                        - https://polygon.llamarpc.com/
                    nativeToken:
                      address: '0x0000000000000000000000000000000000000000'
                      decimals: 18
                      symbol: MATIC
                      chainId: 137
                      coinKey: MATIC
                      name: MATIC
                      logoURI: >-
                        https://static.debank.com/image/matic_token/logo_url/matic/6f5a6b6f0732a7a235131bd7804d357c.png
                      priceUSD: '0.881307'
                  - key: bsc
                    name: BSC
                    chainType: EVM
                    coin: BNB
                    id: 56
                    mainnet: true
                    logoURI: >-
                      https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/bsc.svg
                    tokenlistUrl: >-
                      https://tokens.pancakeswap.finance/pancakeswap-extended.json
                    faucetUrls:
                      - https://stakely.io/faucet/bsc-chain-bnb
                    multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11'
                    metamask:
                      chainId: '0x38'
                      blockExplorerUrls:
                        - https://bscscan.com/
                      chainName: Binance Smart Chain Mainnet
                      nativeCurrency:
                        name: BNB
                        symbol: BNB
                        decimals: 18
                      rpcUrls:
                        - https://bsc-dataseed.binance.org/
                        - https://bsc-dataseed1.defibit.io/
                        - https://bsc-dataseed1.ninicoin.io/
                    nativeToken:
                      address: '0x0000000000000000000000000000000000000000'
                      decimals: 18
                      symbol: BNB
                      chainId: 56
                      coinKey: BNB
                      name: BNB
                      logoURI: >-
                        https://static.debank.com/image/bsc_token/logo_url/bsc/8bfdeaa46fe9be8f5cd43a53b8d1eea1.png
                      priceUSD: '266'
                  - key: dai
                    name: Gnosis
                    chainType: EVM
                    coin: DAI
                    id: 100
                    mainnet: true
                    logoURI: >-
                      https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/gnosis.svg
                    tokenlistUrl: https://tokens.honeyswap.org/
                    faucetUrls:
                      - https://stakely.io/faucet/xdai-chain
                    multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11'
                    metamask:
                      chainId: '0x64'
                      blockExplorerUrls:
                        - https://blockscout.com/xdai/mainnet/
                      chainName: Gnosis Chain
                      nativeCurrency:
                        name: xDai
                        symbol: xDai
                        decimals: 18
                      rpcUrls:
                        - https://rpc.gnosischain.com/
                        - https://rpc.xdaichain.com/
                        - https://dai.poa.network/
                    nativeToken:
                      address: '0x0000000000000000000000000000000000000000'
                      decimals: 18
                      symbol: xDai
                      chainId: 100
                      coinKey: XDAI
                      name: xDai
                      logoURI: >-
                        https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
                      priceUSD: '1.0002'
      description: ''
  schemas:
    ChainsResponse:
      title: Root Type for ChainsResponse
      description: ''
      type: object
      properties:
        chains:
          type: array
          items:
            $ref: '#/components/schemas/Chain'
      example:
        chains:
          - key: eth
            name: Ethereum
            coin: ETH
            id: 1
            mainnet: true
            chainType: EVM
            logoURI: >-
              https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/ethereum.svg
            tokenlistUrl: https://gateway.ipfs.io/ipns/tokens.uniswap.org
            multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11'
            diamondAddress: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE'
            metamask:
              chainId: '0x1'
              blockExplorerUrls:
                - https://etherscan.io/
              chainName: Ethereum Mainnet
              nativeCurrency:
                name: ETH
                symbol: ETH
                decimals: 18
              rpcUrls:
                - https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
            nativeToken:
              address: '0x0000000000000000000000000000000000000000'
              decimals: 18
              symbol: ETH
              chainId: 1
              coinKey: ETH
              name: ETH
              logoURI: >-
                https://static.debank.com/image/token/logo_url/eth/935ae4e4d1d12d59a99717a24f2540b5.png
              priceUSD: '2582.35'
          - key: pol
            name: Polygon
            coin: MATIC
            id: 137
            mainnet: true
            logoURI: >-
              https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/polygon.svg
            tokenlistUrl: >-
              https://unpkg.com/quickswap-default-token-list@1.0.71/build/quickswap-default.tokenlist.json
            faucetUrls:
              - https://stakely.io/faucet/polygon-matic
            metamask:
              chainId: '0x89'
              blockExplorerUrls:
                - https://polygonscan.com/
                - https://explorer-mainnet.maticvigil.com/
              chainName: Matic(Polygon) Mainnet
              nativeCurrency:
                name: MATIC
                symbol: MATIC
                decimals: 18
              rpcUrls:
                - https://polygon-rpc.com/
                - https://polygon.llamarpc.com/
          - key: bsc
            name: BSC
            coin: BNB
            id: 56
            mainnet: true
            logoURI: >-
              https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/bsc.svg
            tokenlistUrl: https://tokens.pancakeswap.finance/pancakeswap-extended.json
            faucetUrls:
              - https://stakely.io/faucet/bsc-chain-bnb
            metamask:
              chainId: '0x38'
              blockExplorerUrls:
                - https://bscscan.com/
              chainName: Binance Smart Chain Mainnet
              nativeCurrency:
                name: BNB
                symbol: BNB
                decimals: 18
              rpcUrls:
                - https://bsc-dataseed.binance.org/
                - https://bsc-dataseed1.defibit.io/
                - https://bsc-dataseed1.ninicoin.io/
          - key: dai
            name: Gnosis
            coin: DAI
            id: 100
            mainnet: true
            logoURI: >-
              https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/gnosis.svg
            tokenlistUrl: https://tokens.honeyswap.org/
            faucetUrls:
              - https://stakely.io/faucet/xdai-chain
            metamask:
              chainId: '0x64'
              blockExplorerUrls:
                - https://blockscout.com/xdai/mainnet/
              chainName: Gnosis Chain
              nativeCurrency:
                name: xDai
                symbol: xDai
                decimals: 18
              rpcUrls:
                - https://rpc.gnosischain.com/
                - https://rpc.xdaichain.com/
                - https://dai.poa.network/
    Chain:
      title: Root Type for Chain
      description: Representation of a chain
      required:
        - coin
        - id
        - key
        - mainnet
        - name
      type: object
      properties:
        key:
          description: Short string represenation of the chain
          type: string
        chainType:
          description: Type of the chain
          type: string
        name:
          description: Name of the chain
          type: string
        coin:
          description: The native coin of the chain
          type: string
        id:
          format: number
          description: Unique id of the chain
          type: number
        mainnet:
          description: Whether the chain is mainnet or not
          type: boolean
        logoURI:
          description: Logo of the chain
          type: string
        tokenlistUrl:
          description: Url to the list of available tokens
          type: string
        faucetUrls:
          description: List of available faucets
          type: array
          items:
            type: string
        multicallAddress:
          description: The multicall contract address
          type: string
        metamask:
          description: >-
            Information about the chain from metamask. Contains data about RPCs
            and block explorers
          type: object
          properties:
            chainId:
              type: string
            blockExplorerUrls:
              type: array
              items:
                type: string
            chainName:
              type: string
            nativeCurrency:
              type: object
              properties:
                name:
                  type: string
                symbol:
                  type: string
                decimals:
                  format: number
                  type: number
            rpcUrls:
              type: array
              items:
                type: string
        nativeToken:
          $ref: '#/components/schemas/Token'
          description: The native token info for the chain
      example:
        key: pol
        name: Polygon
        coin: MATIC
        id: 137
        mainnet: true
        logoURI: >-
          https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/polygon.svg
        tokenlistUrl: >-
          https://unpkg.com/quickswap-default-token-list@1.0.71/build/quickswap-default.tokenlist.json
        faucetUrls:
          - https://stakely.io/faucet/polygon-matic
        metamask:
          chainId: '0x89'
          blockExplorerUrls:
            - https://polygonscan.com/
            - https://explorer-mainnet.maticvigil.com/
          chainName: Matic(Polygon) Mainnet
          nativeCurrency:
            name: MATIC
            symbol: MATIC
            decimals: 18
          rpcUrls:
            - https://polygon-rpc.com/
            - https://polygon.llamarpc.com/
    Token:
      title: Root Type for Token
      description: Representation of a Token
      required:
        - address
        - chainId
        - decimals
        - name
        - symbol
      type: object
      properties:
        address:
          description: Address of the token
          type: string
        decimals:
          format: number
          description: Number of decimals the token uses
          type: number
        symbol:
          description: Symbol of the token
          type: string
        chainId:
          format: number
          description: Id of the token's chain
          type: number
        coinKey:
          description: Identifier for the token
          type: string
        name:
          description: Name of the token
          type: string
        logoURI:
          description: Logo of the token
          type: string
        priceUSD:
          description: Token price in USD
          type: string
      example:
        address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
        symbol: DAI
        decimals: 18
        chainId: 137
        name: (PoS) Dai Stablecoin
        coinKey: DAI
        priceUSD: '1'
        logoURI: >-
          https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/549c4205dbb199f1b8b03af783f35e71.png

````

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Fetch all known tokens

> This endpoint can be used to fetch all tokens known to the LI.FI services.



## OpenAPI

````yaml get /v1/tokens
openapi: 3.0.2
info:
  title: LI.FI API
  version: 1.0.0
  description: >-
    LI.FI provides the best cross-chain swap across all liquidity pools and
    bridges.
servers:
  - url: https://li.quest
    description: LI.FI Production Environment
  - url: https://staging.li.quest
    description: LI.FI Staging Environment
security: []
paths:
  /v1/tokens:
    get:
      summary: Fetch all known tokens
      description: >-
        This endpoint can be used to fetch all tokens known to the LI.FI
        services.
      parameters:
        - example: POL,DAI
          name: chains
          description: Restrict the resulting tokens to the given chains
          schema:
            type: string
          in: query
          required: false
        - example: EVM,SVM
          name: chainTypes
          description: Restrict the resulting tokens to the given chainTypes.
          schema:
            type: string
          in: query
          required: false
        - example: 0.01
          name: minPriceUSD
          description: >-
            Filters results by minimum token price in USD. Minimum value for
            this parameter is 0. Defaults to 0.0001 USD.
          schema:
            type: number
          in: query
          required: false
        - name: x-lifi-api-key
          description: >-
            Authentication header, register in the LI.FI Partner Portal
            (https://portal.li.fi/ ) to get your API Key.
          schema:
            type: string
          in: header
      responses:
        '200':
          $ref: '#/components/responses/TokensResponse'
components:
  responses:
    TokensResponse:
      content:
        application/json:
          schema:
            type: object
            properties:
              '1':
                description: The requested tokens
                type: array
                items:
                  $ref: '#/components/schemas/Token'
      description: ''
  schemas:
    Token:
      title: Root Type for Token
      description: Representation of a Token
      required:
        - address
        - chainId
        - decimals
        - name
        - symbol
      type: object
      properties:
        address:
          description: Address of the token
          type: string
        decimals:
          format: number
          description: Number of decimals the token uses
          type: number
        symbol:
          description: Symbol of the token
          type: string
        chainId:
          format: number
          description: Id of the token's chain
          type: number
        coinKey:
          description: Identifier for the token
          type: string
        name:
          description: Name of the token
          type: string
        logoURI:
          description: Logo of the token
          type: string
        priceUSD:
          description: Token price in USD
          type: string
      example:
        address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
        symbol: DAI
        decimals: 18
        chainId: 137
        name: (PoS) Dai Stablecoin
        coinKey: DAI
        priceUSD: '1'
        logoURI: >-
          https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/549c4205dbb199f1b8b03af783f35e71.png

````

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Fetch information about a Token

> This endpoint can be used to get more information about a token by its address or symbol and its chain.
If you want to learn more about how to use this endpoint please have a look at our [guide](https://docs.li.fi/more-integration-options/li.fi-api/getting-token-information).



## OpenAPI

````yaml get /v1/token
openapi: 3.0.2
info:
  title: LI.FI API
  version: 1.0.0
  description: >-
    LI.FI provides the best cross-chain swap across all liquidity pools and
    bridges.
servers:
  - url: https://li.quest
    description: LI.FI Production Environment
  - url: https://staging.li.quest
    description: LI.FI Staging Environment
security: []
paths:
  /v1/token:
    get:
      summary: Fetch information about a Token
      description: >-
        This endpoint can be used to get more information about a token by its
        address or symbol and its chain.

        If you want to learn more about how to use this endpoint please have a
        look at our
        [guide](https://docs.li.fi/more-integration-options/li.fi-api/getting-token-information).
      parameters:
        - example: POL
          name: chain
          description: Id or key of the chain that contains the token
          schema:
            type: string
          in: query
          required: true
        - example: DAI
          name: token
          description: Address or symbol of the token on the requested chain
          schema:
            type: string
          in: query
          required: true
        - name: x-lifi-api-key
          description: >-
            Authentication header, register in the LI.FI Partner Portal
            (https://portal.li.fi/ ) to get your API Key.
          schema:
            type: string
          in: header
      responses:
        '200':
          $ref: '#/components/responses/TokenResponse'
        '400':
          $ref: '#/components/responses/InvalidChainResponse'
        '404':
          $ref: '#/components/responses/NoTokenFound'
components:
  responses:
    TokenResponse:
      content:
        application/json:
          schema:
            type: array
            items:
              $ref: '#/components/schemas/Token'
          examples:
            ExampleTokenResponse:
              value:
                address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
                symbol: DAI
                decimals: 18
                chainId: 137
                name: (PoS) Dai Stablecoin
                coinKey: DAI
                priceUSD: '1'
                logoURI: >-
                  https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/549c4205dbb199f1b8b03af783f35e71.png
      description: ''
    InvalidChainResponse:
      description: User passed an invalid chain id or abbrevation
    NoTokenFound:
      description: No token found for the given address and chain
  schemas:
    Token:
      title: Root Type for Token
      description: Representation of a Token
      required:
        - address
        - chainId
        - decimals
        - name
        - symbol
      type: object
      properties:
        address:
          description: Address of the token
          type: string
        decimals:
          format: number
          description: Number of decimals the token uses
          type: number
        symbol:
          description: Symbol of the token
          type: string
        chainId:
          format: number
          description: Id of the token's chain
          type: number
        coinKey:
          description: Identifier for the token
          type: string
        name:
          description: Name of the token
          type: string
        logoURI:
          description: Logo of the token
          type: string
        priceUSD:
          description: Token price in USD
          type: string
      example:
        address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
        symbol: DAI
        decimals: 18
        chainId: 137
        name: (PoS) Dai Stablecoin
        coinKey: DAI
        priceUSD: '1'
        logoURI: >-
          https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/549c4205dbb199f1b8b03af783f35e71.png

````

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Get available bridges and exchanges

> This endpoint can be used to get information about the bridges and exchanges available trough our service



## OpenAPI

````yaml get /v1/tools
openapi: 3.0.2
info:
  title: LI.FI API
  version: 1.0.0
  description: >-
    LI.FI provides the best cross-chain swap across all liquidity pools and
    bridges.
servers:
  - url: https://li.quest
    description: LI.FI Production Environment
  - url: https://staging.li.quest
    description: LI.FI Staging Environment
security: []
paths:
  /v1/tools:
    get:
      summary: Get available bridges and exchanges
      description: >-
        This endpoint can be used to get information about the bridges and
        exchanges available trough our service
      parameters:
        - name: chains
          description: The ids of the chains that should be taken into consideration.
          schema:
            type: array
            items:
              oneOf:
                - type: string
                  example:
                    - pol
                    - eth
                - type: integer
                  example:
                    - 1
                    - 56
          in: query
        - name: x-lifi-api-key
          description: >-
            Authentication header, register in the LI.FI Partner Portal
            (https://portal.li.fi/ ) to get your API Key.
          schema:
            type: string
          in: header
      responses:
        '200':
          $ref: '#/components/responses/ToolsResponse'
components:
  responses:
    ToolsResponse:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Tools'
      description: Object listing all the currently enabled bridges and exchanges.
  schemas:
    Tools:
      type: object
      properties:
        exchanges:
          type: array
          items:
            $ref: '#/components/schemas/Exchange'
        bridges:
          type: array
          items:
            $ref: '#/components/schemas/Bridge'
    Exchange:
      type: object
      properties:
        key:
          $ref: '#/components/schemas/ExchangesEnum'
        name:
          description: The common name of the tool
          type: string
          example: 0x
        logoURI:
          description: The logo of the tool
          type: string
          example: >-
            https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/zerox.svg
        supportedChains:
          description: The chains which are supported on this exchange
          type: string
          example:
            - '1'
            - '137'
            - '56'
    Bridge:
      type: object
      properties:
        key:
          $ref: '#/components/schemas/BridgesEnum'
        name:
          description: The common name of the tool
          type: string
          example: Connext
        logoURI:
          description: The logo of the tool
          type: string
          example: >-
            https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/bridges/relay.svg
        supportedChains:
          type: array
          items:
            $ref: '#/components/schemas/SupportedChains'
    ExchangesEnum:
      type: string
      description: >-
        Identifier for an exchange tool. Retrieve the latest exchange keys from
        the `/v1/tools` endpoint. Keywords such as `all`, `none`, `default`, and
        `[]` are also supported where applicable.
    BridgesEnum:
      type: string
      description: >-
        Identifier for a bridge tool. Retrieve the latest bridge keys from the
        `/v1/tools` endpoint. Keywords such as `all`, `none`, `default`, and
        `[]` are also supported where applicable.
    SupportedChains:
      type: object
      properties:
        fromChainId:
          description: Supported `from` chain
          type: string
          example: 137
        toChainId:
          description: Supported `to` chain
          type: string
          example: 1

````

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Returns all possible connections based on a from- or toChain.

> This endpoint gives information about all possible tranfers between chains.
Since the result can be very large it is required to filter by at least a chain, a token, a bridge, or an exchange.
Information about which chains and tokens are supported can be taken from the response of the /v1/chains endpoint.
Information about which bridges and exchanges are supported can be taken from the response of the /v1/tools endpoint.



## OpenAPI

````yaml get /v1/connections
openapi: 3.0.2
info:
  title: LI.FI API
  version: 1.0.0
  description: >-
    LI.FI provides the best cross-chain swap across all liquidity pools and
    bridges.
servers:
  - url: https://li.quest
    description: LI.FI Production Environment
  - url: https://staging.li.quest
    description: LI.FI Staging Environment
security: []
paths:
  /v1/connections:
    get:
      summary: Returns all possible connections based on a from- or toChain.
      description: >-
        This endpoint gives information about all possible tranfers between
        chains.

        Since the result can be very large it is required to filter by at least
        a chain, a token, a bridge, or an exchange.

        Information about which chains and tokens are supported can be taken
        from the response of the /v1/chains endpoint.

        Information about which bridges and exchanges are supported can be taken
        from the response of the /v1/tools endpoint.
      parameters:
        - example: POL
          name: fromChain
          description: The chain that should be the start of the possible connections.
          schema:
            type: string
          in: query
          required: false
        - name: toChain
          description: The chain that should be the end of the possible connections.
          schema:
            type: string
          in: query
          required: false
        - example: DAI
          name: fromToken
          description: Only return connections starting with this token.
          schema:
            type: string
          in: query
          required: false
        - name: toToken
          description: Only return connections ending with this token.
          schema:
            type: string
          in: query
          required: false
        - example: EVM,SVM
          name: chainTypes
          description: Restrict the resulting tokens to the given chainTypes.
          schema:
            type: string
          in: query
          required: false
        - name: allowBridges
          description: >-
            List of bridges that are allowed for this transaction. Retrieve the
            current catalog from the `/v1/tools` endpoint.
          schema:
            type: array
            items:
              type: string
          in: query
          required: false
        - name: denyBridges
          description: >-
            List of bridges that are not allowed for this transaction. Retrieve
            the current catalog from the `/v1/tools` endpoint.
          schema:
            type: array
            items:
              type: string
          in: query
          required: false
        - name: preferBridges
          description: >-
            List of bridges that should be preferred for this transaction.
            Retrieve the current catalog from the `/v1/tools` endpoint.
          schema:
            type: array
            items:
              type: string
          in: query
          required: false
        - name: allowExchanges
          description: >-
            List of exchanges that are allowed for this transaction. Retrieve
            the current catalog from the `/v1/tools` endpoint.
          schema:
            type: array
            items:
              type: string
          in: query
          required: false
        - name: denyExchanges
          description: >-
            List of exchanges that are not allowed for this transaction.
            Retrieve the current catalog from the `/v1/tools` endpoint.
          schema:
            type: array
            items:
              type: string
          in: query
          required: false
        - name: preferExchanges
          description: >-
            List of exchanges that should be preferred for this transaction.
            Retrieve the current catalog from the `/v1/tools` endpoint.
          schema:
            type: array
            items:
              type: string
          in: query
          required: false
        - name: allowSwitchChain
          description: >-
            Whether connections that require chain switch should be included in
            the response.
          schema:
            default: true
            type: boolean
          in: query
          required: false
        - name: allowDestinationCall
          description: >-
            Whether connections that includes destination call should be
            included in the response.
          schema:
            default: true
            type: boolean
          in: query
          required: false
        - name: x-lifi-api-key
          description: >-
            Authentication header, register in the LI.FI Partner Portal
            (https://portal.li.fi/ ) to get your API Key.
          schema:
            type: string
          in: header
      responses:
        '200':
          $ref: '#/components/responses/ConnectionsResponse'
components:
  responses:
    ConnectionsResponse:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ConnectionsResponse'
          examples:
            ConnectionsResponse:
              value:
                connections:
                  - fromChainId: 137
                    toChainId: 1
                    fromTokens:
                      - address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
                        decimals: 18
                        symbol: DAI
                        chainId: 137
                        coinKey: DAI
                        name: DAI
                        logoURI: >-
                          https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/549c4205dbb199f1b8b03af783f35e71.png
                        priceUSD: '1'
                    toTokens:
                      - address: '0x6b175474e89094c44da98b954eedeac495271d0f'
                        decimals: 18
                        symbol: DAI
                        chainId: 1
                        coinKey: DAI
                        name: DAI
                        logoURI: >-
                          https://static.debank.com/image/eth_token/logo_url/0x6b175474e89094c44da98b954eedeac495271d0f/549c4205dbb199f1b8b03af783f35e71.png
                        priceUSD: '1'
                      - address: '0x0000000000000000000000000000000000000000'
                        decimals: 18
                        symbol: ETH
                        chainId: 1
                        coinKey: ETH
                        name: ETH
                        logoURI: >-
                          https://static.debank.com/image/token/logo_url/eth/935ae4e4d1d12d59a99717a24f2540b5.png
                        priceUSD: '2582.35'
                      - address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
                        decimals: 6
                        symbol: USDC
                        chainId: 1
                        coinKey: USDC
                        name: USDC
                        logoURI: >-
                          https://static.debank.com/image/eth_token/logo_url/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/fffcd27b9efff5a86ab942084c05924d.png
                        priceUSD: '1'
                      - address: '0xdac17f958d2ee523a2206206994597c13d831ec7'
                        decimals: 6
                        symbol: USDT
                        chainId: 1
                        coinKey: USDT
                        name: USDT
                        logoURI: >-
                          https://static.debank.com/image/eth_token/logo_url/0xdac17f958d2ee523a2206206994597c13d831ec7/66eadee7b7bb16b75e02b570ab8d5c01.png
                        priceUSD: '1'
                  - fromChainId: 137
                    toChainId: 10
                    fromTokens:
                      - address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
                        decimals: 18
                        symbol: DAI
                        chainId: 137
                        coinKey: DAI
                        name: DAI
                        logoURI: >-
                          https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/549c4205dbb199f1b8b03af783f35e71.png
                        priceUSD: '1'
                    toTokens:
                      - address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'
                        decimals: 18
                        symbol: DAI
                        chainId: 10
                        coinKey: DAI
                        name: DAI
                        logoURI: >-
                          https://static.debank.com/image/op_token/logo_url/0xda10009cbd5d07dd0cecc66161fc93d7c9000da1/45965130df45ecf234ff03ce28299cd1.png
                        priceUSD: '1'
                      - address: '0x0000000000000000000000000000000000000000'
                        decimals: 18
                        symbol: ETH
                        chainId: 10
                        coinKey: ETH
                        name: ETH
                        logoURI: >-
                          https://static.debank.com/image/op_token/logo_url/op/d61441782d4a08a7479d54aea211679e.png
                        priceUSD: '2582.35'
                      - address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607'
                        decimals: 6
                        symbol: USDC
                        chainId: 10
                        coinKey: USDC
                        name: USDC
                        logoURI: >-
                          https://static.debank.com/image/op_token/logo_url/0x7f5c764cbc14f9669b88837ca1490cca17c31607/773a0161709a55edc211c3fa67f7c1a7.png
                        priceUSD: '1'
                      - address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58'
                        decimals: 6
                        symbol: USDT
                        chainId: 10
                        coinKey: USDT
                        name: USDT
                        logoURI: >-
                          https://static.debank.com/image/op_token/logo_url/0x94b008aa00579c1307b0ef2c499ad98a8ce58e58/37c9c2ddceb0c83f0f4c07ea4fa53e9d.png
                        priceUSD: '1'
                  - fromChainId: 137
                    toChainId: 56
                    fromTokens:
                      - address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
                        decimals: 18
                        symbol: DAI
                        chainId: 137
                        coinKey: DAI
                        name: DAI
                        logoURI: >-
                          https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/549c4205dbb199f1b8b03af783f35e71.png
                        priceUSD: '1'
                    toTokens:
                      - address: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3'
                        decimals: 18
                        symbol: DAI
                        chainId: 56
                        coinKey: DAI
                        name: DAI
                        logoURI: >-
                          https://static.debank.com/image/bsc_token/logo_url/0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3/549c4205dbb199f1b8b03af783f35e71.png
                        priceUSD: '1'
                      - address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8'
                        decimals: 18
                        symbol: ETH
                        chainId: 56
                        coinKey: ETH
                        name: ETH
                        logoURI: >-
                          https://static.debank.com/image/bsc_token/logo_url/0x2170ed0880ac9a755fd29b2688956bd959f933f8/80dd95753396b5619cf84b0df135eae5.png
                        priceUSD: '2582.35'
                      - address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d'
                        decimals: 18
                        symbol: USDC
                        chainId: 56
                        coinKey: USDC
                        name: USDC
                        logoURI: >-
                          https://static.debank.com/image/bsc_token/logo_url/0x8ac76a51cc950d9822d68b83f0e1ad97b32cd580d/fffcd27b9efff5a86ab942084c05924d.png
                        priceUSD: '1'
                      - address: '0x55d398326f99059ff775485246999027b3197955'
                        decimals: 18
                        symbol: USDT
                        chainId: 56
                        coinKey: USDT
                        name: USDT
                        logoURI: >-
                          https://static.debank.com/image/bsc_token/logo_url/0x55d398326f99059ff775485246999027b3197955/66eadee7b7bb16b75e02b570ab8d5c01.png
                        priceUSD: '1'
      description: ''
  schemas:
    ConnectionsResponse:
      title: Root Type for ConnectionsResponse
      description: ''
      type: object
      properties:
        connections:
          description: The possible connections
          type: array
          items:
            $ref: '#/components/schemas/Connection'
      example:
        connections:
          - fromChainId: 137
            toChainId: 1
            fromTokens:
              - address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
                decimals: 18
                symbol: DAI
                chainId: 137
                coinKey: DAI
                name: DAI
                logoURI: >-
                  https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/549c4205dbb199f1b8b03af783f35e71.png
                priceUSD: '1'
            toTokens:
              - address: '0x6b175474e89094c44da98b954eedeac495271d0f'
                decimals: 18
                symbol: DAI
                chainId: 1
                coinKey: DAI
                name: DAI
                logoURI: >-
                  https://static.debank.com/image/eth_token/logo_url/0x6b175474e89094c44da98b954eedeac495271d0f/549c4205dbb199f1b8b03af783f35e71.png
                priceUSD: '1'
              - address: '0x0000000000000000000000000000000000000000'
                decimals: 18
                symbol: ETH
                chainId: 1
                coinKey: ETH
                name: ETH
                logoURI: >-
                  https://static.debank.com/image/token/logo_url/eth/935ae4e4d1d12d59a99717a24f2540b5.png
                priceUSD: '2582.35'
              - address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
                decimals: 6
                symbol: USDC
                chainId: 1
                coinKey: USDC
                name: USDC
                logoURI: >-
                  https://static.debank.com/image/eth_token/logo_url/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/fffcd27b9efff5a86ab942084c05924d.png
                priceUSD: '1'
              - address: '0xdac17f958d2ee523a2206206994597c13d831ec7'
                decimals: 6
                symbol: USDT
                chainId: 1
                coinKey: USDT
                name: USDT
                logoURI: >-
                  https://static.debank.com/image/eth_token/logo_url/0xdac17f958d2ee523a2206206994597c13d831ec7/66eadee7b7bb16b75e02b570ab8d5c01.png
                priceUSD: '1'
          - fromChainId: 137
            toChainId: 10
            fromTokens:
              - address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
                decimals: 18
                symbol: DAI
                chainId: 137
                coinKey: DAI
                name: DAI
                logoURI: >-
                  https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/549c4205dbb199f1b8b03af783f35e71.png
                priceUSD: '1'
            toTokens:
              - address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'
                decimals: 18
                symbol: DAI
                chainId: 10
                coinKey: DAI
                name: DAI
                logoURI: >-
                  https://static.debank.com/image/op_token/logo_url/0xda10009cbd5d07dd0cecc66161fc93d7c9000da1/45965130df45ecf234ff03ce28299cd1.png
                priceUSD: '1'
              - address: '0x0000000000000000000000000000000000000000'
                decimals: 18
                symbol: ETH
                chainId: 10
                coinKey: ETH
                name: ETH
                logoURI: >-
                  https://static.debank.com/image/op_token/logo_url/op/d61441782d4a08a7479d54aea211679e.png
                priceUSD: '2582.35'
              - address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607'
                decimals: 6
                symbol: USDC
                chainId: 10
                coinKey: USDC
                name: USDC
                logoURI: >-
                  https://static.debank.com/image/op_token/logo_url/0x7f5c764cbc14f9669b88837ca1490cca17c31607/773a0161709a55edc211c3fa67f7c1a7.png
                priceUSD: '1'
              - address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58'
                decimals: 6
                symbol: USDT
                chainId: 10
                coinKey: USDT
                name: USDT
                logoURI: >-
                  https://static.debank.com/image/op_token/logo_url/0x94b008aa00579c1307b0ef2c499ad98a8ce58e58/37c9c2ddceb0c83f0f4c07ea4fa53e9d.png
                priceUSD: '1'
          - fromChainId: 137
            toChainId: 56
            fromTokens:
              - address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
                decimals: 18
                symbol: DAI
                chainId: 137
                coinKey: DAI
                name: DAI
                logoURI: >-
                  https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/549c4205dbb199f1b8b03af783f35e71.png
                priceUSD: '1'
            toTokens:
              - address: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3'
                decimals: 18
                symbol: DAI
                chainId: 56
                coinKey: DAI
                name: DAI
                logoURI: >-
                  https://static.debank.com/image/bsc_token/logo_url/0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3/549c4205dbb199f1b8b03af783f35e71.png
                priceUSD: '1'
              - address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8'
                decimals: 18
                symbol: ETH
                chainId: 56
                coinKey: ETH
                name: ETH
                logoURI: >-
                  https://static.debank.com/image/bsc_token/logo_url/0x2170ed0880ac9a755fd29b2688956bd959f933f8/80dd95753396b5619cf84b0df135eae5.png
                priceUSD: '2582.35'
              - address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d'
                decimals: 18
                symbol: USDC
                chainId: 56
                coinKey: USDC
                name: USDC
                logoURI: >-
                  https://static.debank.com/image/bsc_token/logo_url/0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d/fffcd27b9efff5a86ab942084c05924d.png
                priceUSD: '1'
              - address: '0x55d398326f99059ff775485246999027b3197955'
                decimals: 18
                symbol: USDT
                chainId: 56
                coinKey: USDT
                name: USDT
                logoURI: >-
                  https://static.debank.com/image/bsc_token/logo_url/0x55d398326f99059ff775485246999027b3197955/66eadee7b7bb16b75e02b570ab8d5c01.png
                priceUSD: '1'
    Connection:
      title: Root Type for Connection
      description: >-
        A connection from one chain to another defined by tokens that can be
        exchanged for another.
      required:
        - toTokens
        - toChainId
        - fromTokens
        - fromChainId
      type: object
      properties:
        fromChainId:
          description: The sending chain
          type: number
        toChainId:
          description: The receiving chain
          type: number
        fromTokens:
          description: List of possible tokens that can be sent
          type: array
          items:
            $ref: '#/components/schemas/Token'
        toTokens:
          description: List of tokens that can be sent
          type: array
          items:
            $ref: '#/components/schemas/Token'
      example:
        connections:
          - fromChainId: 137
            toChainId: 1
            fromTokens:
              - address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
                decimals: 18
                symbol: DAI
                chainId: 137
                coinKey: DAI
                name: DAI
                logoURI: >-
                  https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/549c4205dbb199f1b8b03af783f35e71.png
                priceUSD: '1'
            toTokens:
              - address: '0x6b175474e89094c44da98b954eedeac495271d0f'
                decimals: 18
                symbol: DAI
                chainId: 1
                coinKey: DAI
                name: DAI
                logoURI: >-
                  https://static.debank.com/image/eth_token/logo_url/0x6b175474e89094c44da98b954eedeac495271d0f/549c4205dbb199f1b8b03af783f35e71.png
                priceUSD: '1'
              - address: '0x0000000000000000000000000000000000000000'
                decimals: 18
                symbol: ETH
                chainId: 1
                coinKey: ETH
                name: ETH
                logoURI: >-
                  https://static.debank.com/image/token/logo_url/eth/935ae4e4d1d12d59a99717a24f2540b5.png
                priceUSD: '2582.35'
              - address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
                decimals: 6
                symbol: USDC
                chainId: 1
                coinKey: USDC
                name: USDC
                logoURI: >-
                  https://static.debank.com/image/eth_token/logo_url/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/fffcd27b9efff5a86ab942084c05924d.png
                priceUSD: '1'
              - address: '0xdac17f958d2ee523a2206206994597c13d831ec7'
                decimals: 6
                symbol: USDT
                chainId: 1
                coinKey: USDT
                name: USDT
                logoURI: >-
                  https://static.debank.com/image/eth_token/logo_url/0xdac17f958d2ee523a2206206994597c13d831ec7/66eadee7b7bb16b75e02b570ab8d5c01.png
                priceUSD: '1'
          - fromChainId: 137
            toChainId: 10
            fromTokens:
              - address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
                decimals: 18
                symbol: DAI
                chainId: 137
                coinKey: DAI
                name: DAI
                logoURI: >-
                  https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/549c4205dbb199f1b8b03af783f35e71.png
                priceUSD: '1'
            toTokens:
              - address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'
                decimals: 18
                symbol: DAI
                chainId: 10
                coinKey: DAI
                name: DAI
                logoURI: >-
                  https://static.debank.com/image/op_token/logo_url/0xda10009cbd5d07dd0cecc66161fc93d7c9000da1/45965130df45ecf234ff03ce28299cd1.png
                priceUSD: '1'
              - address: '0x0000000000000000000000000000000000000000'
                decimals: 18
                symbol: ETH
                chainId: 10
                coinKey: ETH
                name: ETH
                logoURI: >-
                  https://static.debank.com/image/op_token/logo_url/op/d61441782d4a08a7479d54aea211679e.png
                priceUSD: '2582.35'
              - address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607'
                decimals: 6
                symbol: USDC
                chainId: 10
                coinKey: USDC
                name: USDC
                logoURI: >-
                  https://static.debank.com/image/op_token/logo_url/0x7f5c764cbc14f9669b88837ca1490cca17c31607/773a0161709a55edc211c3fa67f7c1a7.png
                priceUSD: '1'
              - address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58'
                decimals: 6
                symbol: USDT
                chainId: 10
                coinKey: USDT
                name: USDT
                logoURI: >-
                  https://static.debank.com/image/op_token/logo_url/0x94b008aa00579c1307b0ef2c499ad98a8ce58e58/37c9c2ddceb0c83f0f4c07ea4fa53e9d.png
                priceUSD: '1'
          - fromChainId: 137
            toChainId: 56
            fromTokens:
              - address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
                decimals: 18
                symbol: DAI
                chainId: 137
                coinKey: DAI
                name: DAI
                logoURI: >-
                  https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/549c4205dbb199f1b8b03af783f35e71.png
                priceUSD: '1'
            toTokens:
              - address: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3'
                decimals: 18
                symbol: DAI
                chainId: 56
                coinKey: DAI
                name: DAI
                logoURI: >-
                  https://static.debank.com/image/bsc_token/logo_url/0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3/549c4205dbb199f1b8b03af783f35e71.png
                priceUSD: '1'
              - address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8'
                decimals: 18
                symbol: ETH
                chainId: 56
                coinKey: ETH
                name: ETH
                logoURI: >-
                  https://static.debank.com/image/bsc_token/logo_url/0x2170ed0880ac9a755fd29b2688956bd959f933f8/80dd95753396b5619cf84b0df135eae5.png
                priceUSD: '2582.35'
              - address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d'
                decimals: 18
                symbol: USDC
                chainId: 56
                coinKey: USDC
                name: USDC
                logoURI: >-
                  https://static.debank.com/image/bsc_token/logo_url/0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d/fffcd27b9efff5a86ab942084c05924d.png
                priceUSD: '1'
              - address: '0x55d398326f99059ff775485246999027b3197955'
                decimals: 18
                symbol: USDT
                chainId: 56
                coinKey: USDT
                name: USDT
                logoURI: >-
                  https://static.debank.com/image/bsc_token/logo_url/0x55d398326f99059ff775485246999027b3197955/66eadee7b7bb16b75e02b570ab8d5c01.png
                priceUSD: '1'
    Token:
      title: Root Type for Token
      description: Representation of a Token
      required:
        - address
        - chainId
        - decimals
        - name
        - symbol
      type: object
      properties:
        address:
          description: Address of the token
          type: string
        decimals:
          format: number
          description: Number of decimals the token uses
          type: number
        symbol:
          description: Symbol of the token
          type: string
        chainId:
          format: number
          description: Id of the token's chain
          type: number
        coinKey:
          description: Identifier for the token
          type: string
        name:
          description: Name of the token
          type: string
        logoURI:
          description: Logo of the token
          type: string
        priceUSD:
          description: Token price in USD
          type: string
      example:
        address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
        symbol: DAI
        decimals: 18
        chainId: 137
        name: (PoS) Dai Stablecoin
        coinKey: DAI
        priceUSD: '1'
        logoURI: >-
          https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/549c4205dbb199f1b8b03af783f35e71.png

````

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Get gas price for the specified chainId

> This endpoint can be used to get the most recent gas prices for the supplied chainId.



## OpenAPI

````yaml get /v1/gas/prices/{chainId}
openapi: 3.0.2
info:
  title: LI.FI API
  version: 1.0.0
  description: >-
    LI.FI provides the best cross-chain swap across all liquidity pools and
    bridges.
servers:
  - url: https://li.quest
    description: LI.FI Production Environment
  - url: https://staging.li.quest
    description: LI.FI Staging Environment
security: []
paths:
  /v1/gas/prices/{chainId}:
    get:
      tags:
        - gas
      summary: Get gas price for the specified chainId
      description: >-
        This endpoint can be used to get the most recent gas prices for the
        supplied chainId.
      parameters:
        - example: 137
          name: chainId
          description: ChaindId from which gas prices should be shown
          schema:
            type: string
          in: path
          required: true
        - name: x-lifi-api-key
          description: >-
            Authentication header, register in the LI.FI Partner Portal
            (https://portal.li.fi/ ) to get your API Key.
          schema:
            type: string
          in: header
      responses:
        '200':
          $ref: '#/components/responses/GasPricesResponse'
        '400':
          $ref: '#/components/responses/InvalidRoutesRequest'
components:
  responses:
    GasPricesResponse:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/GasPrice'
      description: Gas Prices for the supplied chainID
    InvalidRoutesRequest:
      description: Invalid Routes Request
  schemas:
    GasPrice:
      type: object
      properties:
        standard:
          type: number
        fast:
          type: number
        fastest:
          type: number
        lastUpdated:
          type: number

````

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Get gas prices for enabled chains

> This endpoint can be used to get the most recent gas prices for the enabled chains in the server.



## OpenAPI

````yaml get /v1/gas/prices
openapi: 3.0.2
info:
  title: LI.FI API
  version: 1.0.0
  description: >-
    LI.FI provides the best cross-chain swap across all liquidity pools and
    bridges.
servers:
  - url: https://li.quest
    description: LI.FI Production Environment
  - url: https://staging.li.quest
    description: LI.FI Staging Environment
security: []
paths:
  /v1/gas/prices:
    get:
      tags:
        - gas
      summary: Get gas prices for enabled chains
      description: >-
        This endpoint can be used to get the most recent gas prices for the
        enabled chains in the server.
      parameters:
        - name: x-lifi-api-key
          description: >-
            Authentication header, register in the LI.FI Partner Portal
            (https://portal.li.fi/ ) to get your API Key.
          schema:
            type: string
          in: header
      responses:
        '200':
          $ref: '#/components/responses/GasPricesResponse'
components:
  responses:
    GasPricesResponse:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/GasPrice'
      description: Gas Prices for the supplied chainID
  schemas:
    GasPrice:
      type: object
      properties:
        standard:
          type: number
        fast:
          type: number
        fastest:
          type: number
        lastUpdated:
          type: number

````

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Get a gas suggestion for the specified chain

> Endpoint to retrieve a suggestion on how much gas is needed on the requested chain. The suggestion is based on the average price of 10 approvals and 10 uniswap based swaps via LI.FI on the specified chain.
If `fromChain` and `fromToken` are specified, the result will contain information about how much `fromToken` amount the user has to send to receive the suggested gas amount on the requested chain.



## OpenAPI

````yaml get /v1/gas/suggestion/{chain}
openapi: 3.0.2
info:
  title: LI.FI API
  version: 1.0.0
  description: >-
    LI.FI provides the best cross-chain swap across all liquidity pools and
    bridges.
servers:
  - url: https://li.quest
    description: LI.FI Production Environment
  - url: https://staging.li.quest
    description: LI.FI Staging Environment
security: []
paths:
  /v1/gas/suggestion/{chain}:
    get:
      summary: Get a gas suggestion for the specified chain
      description: >-
        Endpoint to retrieve a suggestion on how much gas is needed on the
        requested chain. The suggestion is based on the average price of 10
        approvals and 10 uniswap based swaps via LI.FI on the specified chain.

        If `fromChain` and `fromToken` are specified, the result will contain
        information about how much `fromToken` amount the user has to send to
        receive the suggested gas amount on the requested chain.
      parameters:
        - example: 137
          name: chain
          description: >-
            Chain from which gas prices should be shown (can be a chain id or a
            chain key)
          schema:
            type: string
          in: path
          required: true
        - example: 100
          name: fromChain
          description: >-
            If `fromChain` and `fromToken` are specified, the result will
            contain information about how much `fromToken` amount the user has
            to send to receive the suggested gas amount on the requested chain.
          schema:
            type: string
          in: query
        - example: xDai
          name: fromToken
          description: >-
            If `fromChain` and `fromToken` are specified, the result will
            contain information about how much `fromToken` amount the user has
            to send to receive the suggested gas amount on the requested chain.
          schema:
            type: string
          in: query
        - name: x-lifi-api-key
          description: >-
            Authentication header, register in the LI.FI Partner Portal
            (https://portal.li.fi/ ) to get your API Key.
          schema:
            type: string
          in: header
      responses:
        '200':
          $ref: '#/components/responses/GasSuggestionResponse'
components:
  responses:
    GasSuggestionResponse:
      description: |-
        {
            "available": true,
            "recommended": {
                "token": {
                    "address": "0x0000000000000000000000000000000000000000",
                    "chainId": 137,
                    "symbol": "MATIC",
                    "decimals": 18,
                    "name": "MATIC",
                    "priceUSD": "1.219821",
                    "logoURI": "https://static.debank.com/image/matic_token/logo_url/matic/6f5a6b6f0732a7a235131bd7804d357c.png",
                    "coinKey": "MATIC"
                },
                "amount": "190510922050970750",
                "amountUsd": "0.23"
            },
            "limit": {
                "token": {
                    "address": "0x0000000000000000000000000000000000000000",
                    "chainId": 137,
                    "symbol": "MATIC",
                    "decimals": 18,
                    "name": "MATIC",
                    "priceUSD": "1.219821",
                    "logoURI": "https://static.debank.com/image/matic_token/logo_url/matic/6f5a6b6f0732a7a235131bd7804d357c.png",
                    "coinKey": "MATIC"
                },
                "amount": "1639584824330782959",
                "amountUsd": "2"
            },
            "fromToken": {
                "address": "eth",
                "symbol": "ETH",
                "decimals": 18,
                "chainId": 1,
                "name": "ETH",
                "coinKey": "ETH",
                "priceUSD": "1622.39",
                "logoURI": "https://static.debank.com/image/token/logo_url/eth/935ae4e4d1d12d59a99717a24f2540b5.png"
            },
            "fromAmount": "141766159801281"
        }

````

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Get status information about a lifuel transaction



## OpenAPI

````yaml get /v1/gas/status
openapi: 3.0.2
info:
  title: LI.FI API
  version: 1.0.0
  description: >-
    LI.FI provides the best cross-chain swap across all liquidity pools and
    bridges.
servers:
  - url: https://li.quest
    description: LI.FI Production Environment
  - url: https://staging.li.quest
    description: LI.FI Staging Environment
security: []
paths:
  /v1/gas/status:
    get:
      summary: Get status information about a lifuel transaction
      parameters:
        - example: '0x74546ce8aac58d33c212474293dcfeeadecef115847da75131a2ff6692e03b96'
          name: txHash
          description: The transaction hash that started the gas refilling process
          schema:
            type: string
          in: query
          required: true
        - name: x-lifi-api-key
          description: >-
            Authentication header, register in the LI.FI Partner Portal
            (https://portal.li.fi/ ) to get your API Key.
          schema:
            type: string
          in: header
      responses:
        '200':
          $ref: '#/components/responses/LIFuelStatusResponse'
components:
  responses:
    LIFuelStatusResponse:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/LIFuelStatus'
      description: The status of a lifuel operation
  schemas:
    LIFuelStatus:
      type: object
      properties:
        status:
          $ref: '#/components/schemas/LIFuelStatusStateEnum'
        sending:
          $ref: '#/components/schemas/TxInfo'
        receiving:
          $ref: '#/components/schemas/TxInfo'
    LIFuelStatusStateEnum:
      enum:
        - NOT_FOUND
        - PENDING
        - DONE
    TxInfo:
      type: object
      properties:
        txHash:
          type: string
          example: '0x74546ce8aac58d33c212474293dcfeeadecef115847da75131a2ff6692e03b96'
        txLink:
          type: string
          example: >-
            https://polygonscan.com/tx/0x74546ce8aac58d33c212474293dcfeeadecef115847da75131a2ff6692e03b96
        amount:
          description: The amount of token that will be / has been relayed
          type: string
          example: '10000'
        token:
          $ref: '#/components/schemas/Token'
        chainId:
          type: number
          example: 137
        block:
          type: number
          example: 39397739
    Token:
      title: Root Type for Token
      description: Representation of a Token
      required:
        - address
        - chainId
        - decimals
        - name
        - symbol
      type: object
      properties:
        address:
          description: Address of the token
          type: string
        decimals:
          format: number
          description: Number of decimals the token uses
          type: number
        symbol:
          description: Symbol of the token
          type: string
        chainId:
          format: number
          description: Id of the token's chain
          type: number
        coinKey:
          description: Identifier for the token
          type: string
        name:
          description: Name of the token
          type: string
        logoURI:
          description: Logo of the token
          type: string
        priceUSD:
          description: Token price in USD
          type: string
      example:
        address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
        symbol: DAI
        decimals: 18
        chainId: 137
        name: (PoS) Dai Stablecoin
        coinKey: DAI
        priceUSD: '1'
        logoURI: >-
          https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/549c4205dbb199f1b8b03af783f35e71.png

````

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# In case a transaction was missed by a relayer, this endpoint can be used to force a tx to be re-fetched.



## OpenAPI

````yaml get /v1/gas/refetch
openapi: 3.0.2
info:
  title: LI.FI API
  version: 1.0.0
  description: >-
    LI.FI provides the best cross-chain swap across all liquidity pools and
    bridges.
servers:
  - url: https://li.quest
    description: LI.FI Production Environment
  - url: https://staging.li.quest
    description: LI.FI Staging Environment
security: []
paths:
  /v1/gas/refetch:
    get:
      summary: >-
        In case a transaction was missed by a relayer, this endpoint can be used
        to force a tx to be re-fetched.
      parameters:
        - example: '0x74546ce8aac58d33c212474293dcfeeadecef115847da75131a2ff6692e03b96'
          name: txHash
          description: The transaction hash that started the gas refilling process
          schema:
            type: string
          in: query
          required: true
        - example: POL
          name: chainId
          description: The chain where the deposit was originally made
          schema:
            type: string
          in: query
          required: true
        - name: x-lifi-api-key
          description: >-
            Authentication header, register in the LI.FI Partner Portal
            (https://portal.li.fi/ ) to get your API Key.
          schema:
            type: string
          in: header
      responses:
        '200':
          $ref: '#/components/responses/LIFuelStatusResponse'
      deprecated: true
components:
  responses:
    LIFuelStatusResponse:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/LIFuelStatus'
      description: The status of a lifuel operation
  schemas:
    LIFuelStatus:
      type: object
      properties:
        status:
          $ref: '#/components/schemas/LIFuelStatusStateEnum'
        sending:
          $ref: '#/components/schemas/TxInfo'
        receiving:
          $ref: '#/components/schemas/TxInfo'
    LIFuelStatusStateEnum:
      enum:
        - NOT_FOUND
        - PENDING
        - DONE
    TxInfo:
      type: object
      properties:
        txHash:
          type: string
          example: '0x74546ce8aac58d33c212474293dcfeeadecef115847da75131a2ff6692e03b96'
        txLink:
          type: string
          example: >-
            https://polygonscan.com/tx/0x74546ce8aac58d33c212474293dcfeeadecef115847da75131a2ff6692e03b96
        amount:
          description: The amount of token that will be / has been relayed
          type: string
          example: '10000'
        token:
          $ref: '#/components/schemas/Token'
        chainId:
          type: number
          example: 137
        block:
          type: number
          example: 39397739
    Token:
      title: Root Type for Token
      description: Representation of a Token
      required:
        - address
        - chainId
        - decimals
        - name
        - symbol
      type: object
      properties:
        address:
          description: Address of the token
          type: string
        decimals:
          format: number
          description: Number of decimals the token uses
          type: number
        symbol:
          description: Symbol of the token
          type: string
        chainId:
          format: number
          description: Id of the token's chain
          type: number
        coinKey:
          description: Identifier for the token
          type: string
        name:
          description: Name of the token
          type: string
        logoURI:
          description: Logo of the token
          type: string
        priceUSD:
          description: Token price in USD
          type: string
      example:
        address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
        symbol: DAI
        decimals: 18
        chainId: 137
        name: (PoS) Dai Stablecoin
        coinKey: DAI
        priceUSD: '1'
        logoURI: >-
          https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/549c4205dbb199f1b8b03af783f35e71.png

````

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Check the status of a cross chain transfer

> Cross chain transfers might take a while to complete. Waiting on the transaction on the sending chain doesn't help here. For this reason we build a simple endpoint that let's you check the status of your transfer.
Important: The endpoint returns a `200` successful response even if the transaction can not be found. This behavior accounts for the case that the transaction hash is valid but the transaction has not been mined yet.
While non of the parameters `fromChain`, `toChain` and `bridge` are required, passing the `fromChain` parameter will speed up the request and is therefore encouraged.
If you want to learn more about how to use this endpoint please have a look at our [guide](https://docs.li.fi/introduction/user-flows-and-examples/status-tracking).



## OpenAPI

````yaml get /v1/status
openapi: 3.0.2
info:
  title: LI.FI API
  version: 1.0.0
  description: >-
    LI.FI provides the best cross-chain swap across all liquidity pools and
    bridges.
servers:
  - url: https://li.quest
    description: LI.FI Production Environment
  - url: https://staging.li.quest
    description: LI.FI Staging Environment
security: []
paths:
  /v1/status:
    get:
      summary: Check the status of a cross chain transfer
      description: >-
        Cross chain transfers might take a while to complete. Waiting on the
        transaction on the sending chain doesn't help here. For this reason we
        build a simple endpoint that let's you check the status of your
        transfer.

        Important: The endpoint returns a `200` successful response even if the
        transaction can not be found. This behavior accounts for the case that
        the transaction hash is valid but the transaction has not been mined
        yet.

        While non of the parameters `fromChain`, `toChain` and `bridge` are
        required, passing the `fromChain` parameter will speed up the request
        and is therefore encouraged.

        If you want to learn more about how to use this endpoint please have a
        look at our
        [guide](https://docs.li.fi/introduction/user-flows-and-examples/status-tracking).
      parameters:
        - example: '0xe1ffdcf09d5aa92a2d89b1b39db3f8cadf09428a296cce0d5e387595ac83d08f'
          name: txHash
          description: >-
            The transaction hash on the sending chain, destination chain or lifi
            step id
          schema:
            type: string
          in: query
          required: true
        - example: stargateV2
          name: bridge
          description: The bridging tool used for the transfer
          schema:
            $ref: '#/components/schemas/BridgesEnum'
          in: query
          required: false
        - example: OPT
          name: fromChain
          description: The sending chain. Can be the chain id or chain key
          schema:
            type: string
          in: query
          required: false
        - example: ARB
          name: toChain
          description: The receiving chain. Can be the chain id or chain key
          schema:
            type: string
          in: query
          required: false
        - name: x-lifi-api-key
          description: >-
            Authentication header, register in the LI.FI Partner Portal
            (https://portal.li.fi/ ) to get your API Key.
          schema:
            type: string
          in: header
      responses:
        '200':
          $ref: '#/components/responses/StatusResponse'
        '400':
          $ref: '#/components/responses/InvalidStatusRequest'
components:
  schemas:
    BridgesEnum:
      type: string
      description: >-
        Identifier for a bridge tool. Retrieve the latest bridge keys from the
        `/v1/tools` endpoint. Keywords such as `all`, `none`, `default`, and
        `[]` are also supported where applicable.
    StatusResponse:
      title: Root Type for StatusResponse
      description: The current status of a transfer
      required:
        - sending
        - status
        - tool
      type: object
      properties:
        sending:
          $ref: '#/components/schemas/TransactionInfo'
          description: The transaction on the sending chain
        receiving:
          $ref: '#/components/schemas/TransactionInfo'
          description: The transaction on the receiving chain
        feeCosts:
          description: An array of fee costs for the transaction
          type: array
          items:
            type: object
            properties:
              name:
                type: string
              description:
                type: string
              percentage:
                type: string
              token:
                type: object
                properties:
                  address:
                    type: string
                  decimals:
                    format: number
                    type: number
                  symbol:
                    type: string
                  chainId:
                    format: number
                    type: number
                  coinKey:
                    type: string
                  name:
                    type: string
                  logoURI:
                    type: string
              amount:
                type: string
              amountUSD:
                type: string
              included:
                type: boolean
        status:
          description: >-
            The current status of the transfer. Can be `PENDING`, `DONE`,
            `NOT_FOUND` or `FAILED`
          enum:
            - NOT_FOUND
            - INVALID
            - PENDING
            - DONE
            - FAILED
          type: string
        substatus:
          description: >-
            A more specific substatus. This is available for PENDING and DONE
            statuses. More information can be found here:
            https://docs.li.fi/introduction/user-flows-and-examples/status-tracking
          enum:
            - WAIT_SOURCE_CONFIRMATIONS
            - WAIT_DESTINATION_TRANSACTION
            - BRIDGE_NOT_AVAILABLE
            - CHAIN_NOT_AVAILABLE
            - REFUND_IN_PROGRESS
            - UNKNOWN_ERROR
            - COMPLETED
            - PARTIAL
            - REFUNDED
        substatusMessage:
          description: A message that describes the substatus
          type: string
        tool:
          description: The tool used for this transfer
          type: string
        transactionId:
          description: The ID of this transfer (NOT a transaction hash).
          type: string
        fromAddress:
          description: The address of the sender.
          type: string
        toAddress:
          description: The address of the receiver.
          type: string
        lifiExplorerLink:
          description: The link to the LI.FI explorer.
          type: string
        metadata:
          $ref: '#/components/schemas/Metadata'
          description: The transaction metadata which includes integrator's string, etc.
      example:
        sending:
          txHash: '0xd3ad8fb8798d8440f3a1ec7fd51e102a88e4690f9365fad4eff1a17020376b4a'
          txLink: >-
            https://polygonscan.com/tx/0xd3ad8fb8798d8440f3a1ec7fd51e102a88e4690f9365fad4eff1a17020376b4a
          amount: '13000000'
          token:
            address: '0xd69b31c3225728cc57ddaf9be532a4ee1620be51'
            symbol: anyUSDC
            decimals: 6
            chainId: 137
            name: USDC
            coinKey: anyUSDC
            priceUSD: '0'
            logoURI: ''
          chainId: 137
          gasToken:
            address: '0x0000000000000000000000000000000000001010'
            symbol: MATIC
            decimals: 18
            chainId: 137
            name: MATIC
            coinKey: MATIC
            priceUSD: '0'
            logoURI: ''
          gasAmount: '10000'
          gasAmountUSD: '0.0'
          gasPrice: '1000'
          gasUsed: '1000'
          timestamp: 1720545119
          value: '0'
        receiving:
          txHash: '0xba2793065e20835ef60993144d92e6bc1a86529a70e16c357f66ad13774868ad'
          txLink: >-
            https://bscscan.com/tx/0xba2793065e20835ef60993144d92e6bc1a86529a70e16c357f66ad13774868ad
          amount: '12100000000000000000'
          token:
            address: '0x8965349fb649a33a30cbfda057d8ec2c48abe2a2'
            symbol: anyUSDC
            decimals: 18
            chainId: 56
            name: USDC
            coinKey: anyUSDC
            priceUSD: '0'
            logoURI: ''
          chainId: 56
          gasToken:
            address: '0x0000000000000000000000000000000000001010'
            symbol: BNB
            decimals: 18
            chainId: 56
            name: BNB
            coinKey: BNB
            priceUSD: '0'
            logoURI: ''
          gasAmount: '10000'
          gasAmountUSD: '0.0'
          gasPrice: '1000'
          gasUsed: '1000'
          timestamp: 1720560232
          value: '0'
        tool: anyswap
        status: DONE
        substatus: COMPLETED
        substatusMessage: The transfer is complete.
        transactionId: '0x0000000000000000000000000000000000001010'
        fromAddress: '0x0000000000000000000000000000000000001010'
        toAddress: '0x0000000000000000000000000000000000001010'
        lifiExplorerLink: >-
          https://scan.li.fi/tx/0xd3ad8fb8798d8440f3a1ec7fd51e102a88e4690f9365fad4eff1a17020376b4a
        metadata:
          integrator: jumper.exchange
    TransactionInfo:
      title: Root Type for TransactionInfo
      description: A transaction info object
      required:
        - txLink
        - amount
        - txHash
        - token
        - chainId
      type: object
      properties:
        txHash:
          description: The hash of the transaction
          type: string
        txLink:
          description: Link to a block explorer showing the transaction
          type: string
        amount:
          description: The amount of the transaction
          type: string
        token:
          $ref: '#/components/schemas/Token'
          description: Information about the token
        chainId:
          description: The id of the chain
          type: number
        gasToken:
          $ref: '#/components/schemas/Token'
          description: The token in which gas was paid
        gasAmount:
          description: The amount of the gas that was paid
          type: string
        gasAmountUSD:
          description: The amount of the gas that was paid in USD
          type: string
        gasPrice:
          description: The price of the gas
          type: string
        gasUsed:
          description: The amount of the gas that was used
          type: string
        timestamp:
          description: The transaction timestamp
          type: number
        value:
          description: The transaction value
          type: string
        includedSteps:
          description: An array of swap or protocol steps included in the LI.FI transaction
          type: array
          items:
            $ref: '#/components/schemas/IncludedSwapSteps'
      example:
        txHash: '0xd3ad8fb8798d8440f3a1ec7fd51e102a88e4690f9365fad4eff1a17020376b4a'
        txLink: >-
          https://polygonscan.com/tx/0xd3ad8fb8798d8440f3a1ec7fd51e102a88e4690f9365fad4eff1a17020376b4a
        amount: '13000000'
        token:
          address: '0xd69b31c3225728cc57ddaf9be532a4ee1620be51'
          symbol: anyUSDC
          decimals: 6
          chainId: 137
          name: USDC
          coinKey: anyUSDC
          priceUSD: '0'
          logoURI: ''
        gasToken:
          address: '0x0000000000000000000000000000000000001010'
          symbol: MATIC
          decimals: 18
          chainId: 137
          name: MATIC
          coinKey: MATIC
          priceUSD: '0'
          logoURI: ''
        chainId: 137
        gasAmount: '10000'
        gasAmountUSD: '0.0'
        gasPrice: '1000'
        gasUsed: '1000'
        timestamp: 1720545119
        value: '0'
    Metadata:
      title: Root type for Transaction Metadata
      description: The metadata of the transaction which includes integrator data, etc.
      type: object
      properties:
        integrator:
          description: Integrator ID
          type: string
    Token:
      title: Root Type for Token
      description: Representation of a Token
      required:
        - address
        - chainId
        - decimals
        - name
        - symbol
      type: object
      properties:
        address:
          description: Address of the token
          type: string
        decimals:
          format: number
          description: Number of decimals the token uses
          type: number
        symbol:
          description: Symbol of the token
          type: string
        chainId:
          format: number
          description: Id of the token's chain
          type: number
        coinKey:
          description: Identifier for the token
          type: string
        name:
          description: Name of the token
          type: string
        logoURI:
          description: Logo of the token
          type: string
        priceUSD:
          description: Token price in USD
          type: string
      example:
        address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
        symbol: DAI
        decimals: 18
        chainId: 137
        name: (PoS) Dai Stablecoin
        coinKey: DAI
        priceUSD: '1'
        logoURI: >-
          https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/549c4205dbb199f1b8b03af783f35e71.png
    IncludedSwapSteps:
      title: Root type for included swaps or protocol steps in the status response
      description: >-
        The included steps contain tool name and details, sending and receiving
        token data and amounts.
      type: object
      properties:
        tool:
          description: The tool used for this step
          type: string
        toolDetails:
          description: >-
            The details of the tool used for this step. E.g. `1inch` or
            `feeProtocol`
          type: object
          properties:
            key:
              description: The tool key
              type: string
            name:
              description: The tool name
              type: string
            logoURI:
              description: The tool logo URL
              type: string
        fromAmount:
          description: The amount that was sent to the tool
          type: string
        fromToken:
          description: The token that was sent to the tool
          type: string
        toAmount:
          description: The amount that was received from the tool
          type: string
        toToken:
          description: The token that was received from the tool
          type: string
        bridgedAmount:
          description: The amount that was sent to the bridge
          type: string
  responses:
    StatusResponse:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/StatusResponse'
          examples:
            ExampleStatusResponse:
              value:
                transactionId: >-
                  0x5e9bd1e1232bcfb28e660ce116fe910aa058345604334e5f560034f51ef5327c
                sending:
                  txHash: >-
                    0xe1ffdcf09d5aa92a2d89b1b39db3f8cadf09428a296cce0d5e387595ac83d08f
                  txLink: >-
                    https://arbiscan.io/tx/0xe1ffdcf09d5aa92a2d89b1b39db3f8cadf09428a296cce0d5e387595ac83d08f
                  amount: '129486280'
                  token:
                    address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'
                    chainId: 42161
                    symbol: USDT
                    decimals: 6
                    name: USDT
                    coinKey: USDT
                    logoURI: >-
                      https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png
                    priceUSD: '1.00074'
                  chainId: 42161
                  gasPrice: '10000000'
                  gasUsed: '477174'
                  gasToken:
                    address: '0x0000000000000000000000000000000000000000'
                    chainId: 42161
                    symbol: ETH
                    decimals: 18
                    name: ETH
                    coinKey: ETH
                    logoURI: >-
                      https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png
                    priceUSD: '3166.21'
                  gasAmount: '4771740000000'
                  gasAmountUSD: '0.0151'
                  amountUSD: '129.5821'
                  value: '11551536072923'
                  includedSteps:
                    - tool: gasZip
                      toolDetails:
                        key: gasZip
                        name: LI.Fuel
                        logoURI: >-
                          https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/bridges/lifi.svg
                      fromAmount: '129486280'
                      fromToken:
                        address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'
                        chainId: 42161
                        symbol: USDT
                        decimals: 6
                        name: USDT
                        coinKey: USDT
                        logoURI: >-
                          https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png
                        priceUSD: '1.00074'
                      toToken:
                        address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'
                        chainId: 42161
                        symbol: USDT
                        decimals: 6
                        name: USDT
                        coinKey: USDT
                        logoURI: >-
                          https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png
                        priceUSD: '1.00074'
                      toAmount: '128671479'
                      bridgedAmount: '128671479'
                  timestamp: 1729163645
                receiving:
                  txHash: >-
                    0xd3142ffb0abaefd030e9c108d6fedcd9b5bab9099346531b54f370762301bb4e
                  txLink: >-
                    https://taikoscan.io/tx/0xd3142ffb0abaefd030e9c108d6fedcd9b5bab9099346531b54f370762301bb4e
                  amount: '128671479'
                  token:
                    address: '0x9c2dc7377717603eB92b2655c5f2E7997a4945BD'
                    chainId: 167000
                    symbol: USDT(Stargate)
                    decimals: 6
                    name: Tether USD
                    coinKey: USDT
                    logoURI: >-
                      https://static.debank.com/image/coin/logo_url/usdt/23af7472292cb41dc39b3f1146ead0fe.png
                    priceUSD: '1.00074'
                  chainId: 167000
                  gasPrice: '60000001'
                  gasUsed: '109839'
                  gasToken:
                    address: '0x0000000000000000000000000000000000000000'
                    chainId: 167000
                    symbol: ETH
                    decimals: 18
                    name: ETH
                    coinKey: ETH
                    logoURI: >-
                      https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png
                    priceUSD: '3166.21'
                  gasAmount: '6590340109839'
                  gasAmountUSD: '0.0209'
                  amountUSD: '128.7667'
                  value: '0'
                  includedSteps: []
                  timestamp: 1729164251
                feeCosts:
                  - name: Relay fee
                    description: >-
                      The fee required to pay for the relay on the receiving
                      chain
                    percentage: '0.6802'
                    token:
                      chainId: 42161
                      address: '0x0000000000000000000000000000000000000000'
                      symbol: ETH
                      decimals: 18
                      name: ETH
                      coinKey: ETH
                      logoURI: >-
                        https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png
                      priceUSD: '2616.99'
                    amount: '2100002100000'
                    amountUSD: '0.0055'
                    included: true
                  - name: LayerZero native fee
                    description: protocol native fee
                    percentage: '0.0002'
                    token:
                      chainId: 42161
                      address: '0x0000000000000000000000000000000000000000'
                      symbol: ETH
                      decimals: 18
                      name: ETH
                      coinKey: ETH
                      logoURI: >-
                        https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png
                      priceUSD: '2616.99'
                    amount: '11551536072923'
                    amountUSD: '0.0302'
                    included: false
                lifiExplorerLink: >-
                  https://scan.li.fi/tx/0xe1ffdcf09d5aa92a2d89b1b39db3f8cadf09428a296cce0d5e387595ac83d08f
                fromAddress: '0x204dedcf79dbbb02359205f4f64ce2cbdd483906'
                toAddress: '0x204dedcf79dbbb02359205f4f64ce2cbdd483906'
                tool: stargateV2Bus
                status: DONE
                substatus: COMPLETED
                substatusMessage: The transfer is complete.
                metadata:
                  integrator: dev.jumper.exchange
                bridgeExplorerLink: >-
                  https://layerzeroscan.com/tx/0xe1ffdcf09d5aa92a2d89b1b39db3f8cadf09428a296cce0d5e387595ac83d08f
      description: Response of the Status request
    InvalidStatusRequest:
      description: The passed parameters are invalid

````

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Get transaction request for withdrawing collected integrator's fees by chain

> This endpoint can be used to get transaction request for withdrawing integrator's collected fees the specified chain. If a list of token addresses is provided, the generated transaction will only withdraw the specified funds.
If there is no collected fees for the provided token's addresses, the `400` error will be thrown.
The endpoint returns a `IntegratorWithdrawalTransactionResponse` object which contains the transaction request.



## OpenAPI

````yaml get /v1/integrators/{integratorId}/withdraw/{chainId}
openapi: 3.0.2
info:
  title: LI.FI API
  version: 1.0.0
  description: >-
    LI.FI provides the best cross-chain swap across all liquidity pools and
    bridges.
servers:
  - url: https://li.quest
    description: LI.FI Production Environment
  - url: https://staging.li.quest
    description: LI.FI Staging Environment
security: []
paths:
  /v1/integrators/{integratorId}/withdraw/{chainId}:
    get:
      summary: >-
        Get transaction request for withdrawing collected integrator's fees by
        chain
      description: >-
        This endpoint can be used to get transaction request for withdrawing
        integrator's collected fees the specified chain. If a list of token
        addresses is provided, the generated transaction will only withdraw the
        specified funds.

        If there is no collected fees for the provided token's addresses, the
        `400` error will be thrown.

        The endpoint returns a `IntegratorWithdrawalTransactionResponse` object
        which contains the transaction request.
      parameters:
        - example: fee-demo
          name: integratorId
          description: Id of the integrator that requests fee withdrawal
          schema:
            type: string
          in: path
          required: true
        - example: 137
          name: chainId
          description: Specify chainId from which funds should be withdrawn
          schema:
            type: string
          in: path
          required: true
        - example:
            - '0x0000000000000000000000000000000000000000'
          name: tokenAddresses
          description: Specify tokens from which funds should be withdraw
          schema:
            type: array
            items:
              type: string
          in: query
          required: false
        - name: x-lifi-api-key
          description: >-
            Authentication header, register in the LI.FI Partner Portal
            (https://portal.li.fi/ ) to get your API Key.
          schema:
            type: string
          in: header
      responses:
        '200':
          $ref: '#/components/responses/IntegratorWithdrawalTransactionResponse'
        '400':
          $ref: '#/components/responses/InvalidIntegratorWithdrawalRequest'
        '404':
          $ref: '#/components/responses/InvalidIntegratorRequest'
components:
  responses:
    IntegratorWithdrawalTransactionResponse:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/IntegratorWithdrawalResponse'
          examples:
            ExampleIntegratorResponse:
              value:
                transactionRequest:
                  data: 0x
                  to: '0xbD6C7B0d2f68c2b7805d88388319cfB6EcB50eA9'
      description: Response of the integrator's fee withdrawal transaction request
    InvalidIntegratorWithdrawalRequest:
      description: None of the requested tokens has a balance
    InvalidIntegratorRequest:
      description: Integrator with the name ${integratorId} is not found
  schemas:
    IntegratorWithdrawalResponse:
      title: Root Type for IntegratorWithdrawalResponse
      description: >-
        Transaction request for withdrawing integrator's collected fees for the
        specified chain
      required:
        - transactionRequest
      type: object
      properties:
        transactionRequest:
          description: The transaction request
          type: object
          properties:
            data:
              description: The transaction's data
              type: string
            to:
              description: The FeeCollector's contract address for the specified chain
              type: string

````

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Get integrator's collected fees data for all supported chains

> This endpoint can be used to request all integrator's collected fees data by tokens for all supported chains.
The endpoint returns an `Integrator` object which contains the integrator id and an array of fee balances for all supported chains.



## OpenAPI

````yaml get /v1/integrators/{integratorId}
openapi: 3.0.2
info:
  title: LI.FI API
  version: 1.0.0
  description: >-
    LI.FI provides the best cross-chain swap across all liquidity pools and
    bridges.
servers:
  - url: https://li.quest
    description: LI.FI Production Environment
  - url: https://staging.li.quest
    description: LI.FI Staging Environment
security: []
paths:
  /v1/integrators/{integratorId}:
    get:
      summary: Get integrator's collected fees data for all supported chains
      description: >-
        This endpoint can be used to request all integrator's collected fees
        data by tokens for all supported chains.

        The endpoint returns an `Integrator` object which contains the
        integrator id and an array of fee balances for all supported chains.
      parameters:
        - example: fee-demo
          name: integratorId
          description: Id of the integrator that requests fee balances
          schema:
            type: string
          in: path
          required: true
        - name: x-lifi-api-key
          description: >-
            Authentication header, register in the LI.FI Partner Portal
            (https://portal.li.fi/ ) to get your API Key.
          schema:
            type: string
          in: header
      responses:
        '200':
          $ref: '#/components/responses/IntegratorResponse'
        '404':
          $ref: '#/components/responses/InvalidIntegratorRequest'
components:
  responses:
    IntegratorResponse:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/IntegratorResponse'
          examples:
            ExampleIntegratorResponse:
              value:
                integratorId: fee-demo
                feeBalances:
                  - chainId: 137
                    tokenBalances:
                      - token:
                          address: '0x0000000000000000000000000000000000000000'
                          symbol: MATIC
                          decimals: 18
                          chainId: 137
                          name: MATIC
                          coinKey: MATIC
                          priceUSD: '0.742896'
                          logoURI: >-
                            https://static.debank.com/image/matic_token/logo_url/matic/6f5a6b6f0732a7a235131bd7804d357c.png
                        amount: 0
                        amountUsd: 0
      description: Response of the Integrator request
    InvalidIntegratorRequest:
      description: Integrator with the name ${integratorId} is not found
  schemas:
    IntegratorResponse:
      title: Root Type for IntegratorResponse
      description: Integrator's fee balance by chain
      required:
        - integratorId
      type: object
      properties:
        integratorId:
          description: The integrator's name or wallet address
          type: string
        feeBalances:
          description: The fee balances of the integrator
          type: array
          items:
            $ref: '#/components/schemas/FeeBalances'
      example:
        integratorId: fee-demo
        feeBalances:
          - chainId: 137
            tokenBalances:
              - token:
                  address: '0x0000000000000000000000000000000000000000'
                  symbol: MATIC
                  decimals: 18
                  chainId: 137
                  name: MATIC
                  coinKey: MATIC
                  priceUSD: '0.742896'
                  logoURI: >-
                    https://static.debank.com/image/matic_token/logo_url/matic/6f5a6b6f0732a7a235131bd7804d357c.png
                amount: 0
                amountUsd: 0
    FeeBalances:
      type: object
      properties:
        chainId:
          description: The id of the chain
          type: number
          example: 137
        tokenBalances:
          type: array
          items:
            $ref: '#/components/schemas/TokenBalances'
    TokenBalances:
      type: object
      properties:
        token:
          $ref: '#/components/schemas/Token'
          type: object
        amount:
          description: Fee amount in tokens
          type: string
          example: '0'
        amountUsd:
          description: Fee amount in USD
          type: string
          example: '0'
    Token:
      title: Root Type for Token
      description: Representation of a Token
      required:
        - address
        - chainId
        - decimals
        - name
        - symbol
      type: object
      properties:
        address:
          description: Address of the token
          type: string
        decimals:
          format: number
          description: Number of decimals the token uses
          type: number
        symbol:
          description: Symbol of the token
          type: string
        chainId:
          format: number
          description: Id of the token's chain
          type: number
        coinKey:
          description: Identifier for the token
          type: string
        name:
          description: Name of the token
          type: string
        logoURI:
          description: Logo of the token
          type: string
        priceUSD:
          description: Token price in USD
          type: string
      example:
        address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
        symbol: DAI
        decimals: 18
        chainId: 137
        name: (PoS) Dai Stablecoin
        coinKey: DAI
        priceUSD: '1'
        logoURI: >-
          https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/549c4205dbb199f1b8b03af783f35e71.png

````

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Get the total amount of a token received on a specific chain, for cross-chain transfers.

> Calculates and returns the total received token amount per wallet address, per sending chain, within a specified time range, for a given receiving chain and receiving token. Only aggregates cross-chain transfers, meaning transfers with distinct sending and receiving chains.



## OpenAPI

````yaml get /v1/analytics/transfers/summary
openapi: 3.0.2
info:
  title: LI.FI API
  version: 1.0.0
  description: >-
    LI.FI provides the best cross-chain swap across all liquidity pools and
    bridges.
servers:
  - url: https://li.quest
    description: LI.FI Production Environment
  - url: https://staging.li.quest
    description: LI.FI Staging Environment
security: []
paths:
  /v1/analytics/transfers/summary:
    get:
      summary: >-
        Get the total amount of a token received on a specific chain, for
        cross-chain transfers.
      description: >-
        Calculates and returns the total received token amount per wallet
        address, per sending chain, within a specified time range, for a given
        receiving chain and receiving token. Only aggregates cross-chain
        transfers, meaning transfers with distinct sending and receiving chains.
      parameters:
        - $ref: '#/components/parameters/paginationLimit'
        - $ref: '#/components/parameters/paginationNext'
        - $ref: '#/components/parameters/paginationPrevious'
        - name: fromTimestamp
          description: >
            A Unix timestamp in seconds marking the start of the query period,
            inclusive. Transactions older than this timestamp will not be
            included in the summary.
          schema:
            type: string
          in: query
          required: true
        - name: toTimestamp
          description: >
            A Unix timestamp in seconds marking the end of the query period,
            inclusive. Transactions after this timestamp will not be included in
            the summary. **The maximum range supported by the endpoint is 30
            days.**
          schema:
            type: string
          in: query
          required: true
        - name: toChain
          description: >
            The ID, or key of the chain on the receiving side of the transfer.
            This parameter filters the summary to include only transfers
            received on the specified chain.
          schema:
            type: string
          in: query
          required: true
        - name: toToken
          description: >
            The address, or symbol of the token received in the transfers. This
            parameter filters the summary to include only transfers involving
            the specified token on the receiving chain.
          schema:
            type: number
          in: query
          required: true
        - name: fromChain
          description: >
            The ID, or key of the chain on the sending side of the transfers.
            This parameter filters the summary to include only transfers sent
            from the specified chain.
          schema:
            type: number
          in: query
          required: false
        - name: integrator
          description: >
            The integrator string to filter transfers by. This parameter filters
            the summary to include only transfers for the given integrator.
          schema:
            type: string
          in: query
          required: false
      responses:
        '200':
          $ref: '#/components/responses/TransfersSummaryResponse'
components:
  parameters:
    paginationLimit:
      name: limit
      description: Pagination limit. Defines the maximum number of returned results.
      schema:
        default: 10
        type: integer
      in: query
      required: false
    paginationNext:
      name: next
      description: >-
        The next page cursor. Must come from the `next` field of the response of
        the previous request.
      schema:
        type: string
      in: query
      required: false
    paginationPrevious:
      name: previous
      description: >-
        The previous page cursor. Must come from the `previous` field of the
        response of the previous request.
      schema:
        type: string
      in: query
      required: false
  responses:
    TransfersSummaryResponse:
      content:
        application/json:
          schema:
            allOf:
              - $ref: '#/components/schemas/PaginatedResult'
              - type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/TransfersSummaryResult'
      description: Response for `GET /analytics/transfers/summary` endpoint
  schemas:
    PaginatedResult:
      title: Pagination Query Parameters
      description: Parameters used to query paginated endpoints
      type: object
      properties:
        hasNext:
          description: Flag indicating if there is a next page
          default: false
          type: boolean
        hasPrevious:
          description: Flag indicating if there is a previous page
          default: false
          type: boolean
        next:
          nullable: true
          description: >-
            Cursor for fetching the next page. Should be passed to `next` in the
            pagination query.
          type: string
        previous:
          nullable: true
          description: >-
            Cursor for fetching the previous page. Should be passed to
            `previous` in the pagination query.
          type: string
        data:
          description: 'An array containing the paginated data returned by the endpoint '
    TransfersSummaryResult:
      title: Transfers Summary
      description: >-
        Transfers summary element as returned by GET
        /v1/analytics/transfers/summary endpoint
      type: object
      properties:
        id:
          type: object
          properties:
            toAddress:
              description: The address in the receiving side of the transfer
              type: string
            sendingChainId:
              description: The ID of the chain the transfer was sent from
              type: number
        totalReceivedAmount:
          description: The cumulative amount of token received
          type: number

````

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Get a list of filtered transfers

> This endpoint can be used to retrieve a list of transfers filtered by certain properties. Returns a maximum of 1000 transfers.



## OpenAPI

````yaml get /v1/analytics/transfers
openapi: 3.0.2
info:
  title: LI.FI API
  version: 1.0.0
  description: >-
    LI.FI provides the best cross-chain swap across all liquidity pools and
    bridges.
servers:
  - url: https://li.quest
    description: LI.FI Production Environment
  - url: https://staging.li.quest
    description: LI.FI Staging Environment
security: []
paths:
  /v1/analytics/transfers:
    get:
      summary: Get a list of filtered transfers
      description: >-
        This endpoint can be used to retrieve a list of transfers filtered by
        certain properties. Returns a maximum of 1000 transfers.
      parameters:
        - name: integrator
          description: The integrator string to filter by
          schema:
            type: string
          in: query
        - name: wallet
          description: 'The sending OR receiving wallet address '
          schema:
            type: string
          in: query
        - name: status
          description: >-
            The status of the transfers. Possible values are `ALL`, `DONE`,
            `PENDING`, and `FAILED`. The default is `DONE`
          schema:
            type: string
          in: query
        - name: fromTimestamp
          description: >-
            The oldest timestamp that should be taken into consideration.
            Defaults to 30 days ago
          schema:
            type: number
          in: query
        - name: toTimestamp
          description: >-
            The newest timestamp that should be taken into consideration.
            Defaults to now
          schema:
            type: number
          in: query
        - name: fromChain
          description: The chain where the transfer originates from.
          schema:
            type: string
          in: query
        - name: toChain
          description: The chain where the transfer ends.
          schema:
            type: string
          in: query
        - name: fromToken
          description: >-
            The token transferred from the originating chain. To use this
            parameter `fromChain` must be set.
          schema:
            type: string
          in: query
        - name: toToken
          description: >-
            The token received on the destination chain. To use this parameter
            `toChain` must be set.
          schema:
            type: string
          in: query
      responses:
        '200':
          $ref: '#/components/responses/TransfersResponse'
components:
  responses:
    TransfersResponse:
      content:
        application/json:
          schema:
            type: object
            properties:
              transfers:
                type: array
                items:
                  $ref: '#/components/schemas/StatusResponse'
          examples:
            Transfers:
              value:
                transfers:
                  - transactionId: >-
                      0x8c58bf99537331b38f15f5ca9718b6fcf86bdb678a2935cf0ca2106066f07550
                    sending:
                      txHash: >-
                        0x37b56ab04df432aa84f14d94f3af2ef65c10141df37ffe60f216c0505fc43178
                      txLink: >-
                        https://explorer.zksync.io/tx/0x37b56ab04df432aa84f14d94f3af2ef65c10141df37ffe60f216c0505fc43178
                      amount: '1000000'
                      token:
                        address: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4'
                        chainId: 324
                        symbol: USDC
                        decimals: 6
                        name: USD Coin
                        coinKey: USDC
                        logoURI: >-
                          https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png
                        priceUSD: '1.00'
                      chainId: 324
                      gasPrice: '250000000'
                      gasUsed: '1428505'
                      gasToken:
                        address: '0x0000000000000000000000000000000000000000'
                        chainId: 324
                        symbol: ETH
                        decimals: 18
                        name: ETH
                        coinKey: ETH
                        logoURI: >-
                          https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png
                        priceUSD: '1676.49'
                      gasAmount: '357126250000000'
                      gasAmountUSD: '0.60'
                      amountUSD: '1.0000'
                      timestamp: 1698076232
                      value: '0'
                    receiving:
                      txHash: >-
                        0x37b56ab04df432aa84f14d94f3af2ef65c10141df37ffe60f216c0505fc43178
                      txLink: >-
                        https://explorer.zksync.io/tx/0x37b56ab04df432aa84f14d94f3af2ef65c10141df37ffe60f216c0505fc43178
                      amount: '999255'
                      token:
                        address: '0x493257fD37EDB34451f62EDf8D2a0C418852bA4C'
                        chainId: 324
                        symbol: USDT
                        decimals: 6
                        name: Tether USD
                        coinKey: USDT
                        logoURI: >-
                          https://static.debank.com/image/brise_token/logo_url/0xc7e6d7e08a89209f02af47965337714153c529f0/3c1a718331e468abe1fc2ebe319f6c77.png
                        priceUSD: '1.0000'
                      chainId: 324
                      gasPrice: '250000000'
                      gasUsed: '1428505'
                      gasToken:
                        address: '0x0000000000000000000000000000000000000000'
                        chainId: 324
                        symbol: ETH
                        decimals: 18
                        name: ETH
                        coinKey: ETH
                        logoURI: >-
                          https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png
                        priceUSD: '1676.49'
                      gasAmount: '357126250000000'
                      gasAmountUSD: '0.60'
                      amountUSD: '1.0000'
                      timestamp: 1698076232
                      value: '0'
                    lifiExplorerLink: >-
                      https://explorer.li.fi/tx/0x37b56ab04df432aa84f14d94f3af2ef65c10141df37ffe60f216c0505fc43178
                    fromAddress: '0x552008c0f6870c2f77e5cc1d2eb9bdff03e30ea0'
                    toAddress: '0x552008c0f6870c2f77e5cc1d2eb9bdff03e30ea0'
                    tool: solver3
                    status: DONE
                    substatus: COMPLETED
                    substatusMessage: The transfer is complete.
      description: Response for `GET /analytics/transfers` endpoint
  schemas:
    StatusResponse:
      title: Root Type for StatusResponse
      description: The current status of a transfer
      required:
        - sending
        - status
        - tool
      type: object
      properties:
        sending:
          $ref: '#/components/schemas/TransactionInfo'
          description: The transaction on the sending chain
        receiving:
          $ref: '#/components/schemas/TransactionInfo'
          description: The transaction on the receiving chain
        feeCosts:
          description: An array of fee costs for the transaction
          type: array
          items:
            type: object
            properties:
              name:
                type: string
              description:
                type: string
              percentage:
                type: string
              token:
                type: object
                properties:
                  address:
                    type: string
                  decimals:
                    format: number
                    type: number
                  symbol:
                    type: string
                  chainId:
                    format: number
                    type: number
                  coinKey:
                    type: string
                  name:
                    type: string
                  logoURI:
                    type: string
              amount:
                type: string
              amountUSD:
                type: string
              included:
                type: boolean
        status:
          description: >-
            The current status of the transfer. Can be `PENDING`, `DONE`,
            `NOT_FOUND` or `FAILED`
          enum:
            - NOT_FOUND
            - INVALID
            - PENDING
            - DONE
            - FAILED
          type: string
        substatus:
          description: >-
            A more specific substatus. This is available for PENDING and DONE
            statuses. More information can be found here:
            https://docs.li.fi/introduction/user-flows-and-examples/status-tracking
          enum:
            - WAIT_SOURCE_CONFIRMATIONS
            - WAIT_DESTINATION_TRANSACTION
            - BRIDGE_NOT_AVAILABLE
            - CHAIN_NOT_AVAILABLE
            - REFUND_IN_PROGRESS
            - UNKNOWN_ERROR
            - COMPLETED
            - PARTIAL
            - REFUNDED
        substatusMessage:
          description: A message that describes the substatus
          type: string
        tool:
          description: The tool used for this transfer
          type: string
        transactionId:
          description: The ID of this transfer (NOT a transaction hash).
          type: string
        fromAddress:
          description: The address of the sender.
          type: string
        toAddress:
          description: The address of the receiver.
          type: string
        lifiExplorerLink:
          description: The link to the LI.FI explorer.
          type: string
        metadata:
          $ref: '#/components/schemas/Metadata'
          description: The transaction metadata which includes integrator's string, etc.
      example:
        sending:
          txHash: '0xd3ad8fb8798d8440f3a1ec7fd51e102a88e4690f9365fad4eff1a17020376b4a'
          txLink: >-
            https://polygonscan.com/tx/0xd3ad8fb8798d8440f3a1ec7fd51e102a88e4690f9365fad4eff1a17020376b4a
          amount: '13000000'
          token:
            address: '0xd69b31c3225728cc57ddaf9be532a4ee1620be51'
            symbol: anyUSDC
            decimals: 6
            chainId: 137
            name: USDC
            coinKey: anyUSDC
            priceUSD: '0'
            logoURI: ''
          chainId: 137
          gasToken:
            address: '0x0000000000000000000000000000000000001010'
            symbol: MATIC
            decimals: 18
            chainId: 137
            name: MATIC
            coinKey: MATIC
            priceUSD: '0'
            logoURI: ''
          gasAmount: '10000'
          gasAmountUSD: '0.0'
          gasPrice: '1000'
          gasUsed: '1000'
          timestamp: 1720545119
          value: '0'
        receiving:
          txHash: '0xba2793065e20835ef60993144d92e6bc1a86529a70e16c357f66ad13774868ad'
          txLink: >-
            https://bscscan.com/tx/0xba2793065e20835ef60993144d92e6bc1a86529a70e16c357f66ad13774868ad
          amount: '12100000000000000000'
          token:
            address: '0x8965349fb649a33a30cbfda057d8ec2c48abe2a2'
            symbol: anyUSDC
            decimals: 18
            chainId: 56
            name: USDC
            coinKey: anyUSDC
            priceUSD: '0'
            logoURI: ''
          chainId: 56
          gasToken:
            address: '0x0000000000000000000000000000000000001010'
            symbol: BNB
            decimals: 18
            chainId: 56
            name: BNB
            coinKey: BNB
            priceUSD: '0'
            logoURI: ''
          gasAmount: '10000'
          gasAmountUSD: '0.0'
          gasPrice: '1000'
          gasUsed: '1000'
          timestamp: 1720560232
          value: '0'
        tool: anyswap
        status: DONE
        substatus: COMPLETED
        substatusMessage: The transfer is complete.
        transactionId: '0x0000000000000000000000000000000000001010'
        fromAddress: '0x0000000000000000000000000000000000001010'
        toAddress: '0x0000000000000000000000000000000000001010'
        lifiExplorerLink: >-
          https://scan.li.fi/tx/0xd3ad8fb8798d8440f3a1ec7fd51e102a88e4690f9365fad4eff1a17020376b4a
        metadata:
          integrator: jumper.exchange
    TransactionInfo:
      title: Root Type for TransactionInfo
      description: A transaction info object
      required:
        - txLink
        - amount
        - txHash
        - token
        - chainId
      type: object
      properties:
        txHash:
          description: The hash of the transaction
          type: string
        txLink:
          description: Link to a block explorer showing the transaction
          type: string
        amount:
          description: The amount of the transaction
          type: string
        token:
          $ref: '#/components/schemas/Token'
          description: Information about the token
        chainId:
          description: The id of the chain
          type: number
        gasToken:
          $ref: '#/components/schemas/Token'
          description: The token in which gas was paid
        gasAmount:
          description: The amount of the gas that was paid
          type: string
        gasAmountUSD:
          description: The amount of the gas that was paid in USD
          type: string
        gasPrice:
          description: The price of the gas
          type: string
        gasUsed:
          description: The amount of the gas that was used
          type: string
        timestamp:
          description: The transaction timestamp
          type: number
        value:
          description: The transaction value
          type: string
        includedSteps:
          description: An array of swap or protocol steps included in the LI.FI transaction
          type: array
          items:
            $ref: '#/components/schemas/IncludedSwapSteps'
      example:
        txHash: '0xd3ad8fb8798d8440f3a1ec7fd51e102a88e4690f9365fad4eff1a17020376b4a'
        txLink: >-
          https://polygonscan.com/tx/0xd3ad8fb8798d8440f3a1ec7fd51e102a88e4690f9365fad4eff1a17020376b4a
        amount: '13000000'
        token:
          address: '0xd69b31c3225728cc57ddaf9be532a4ee1620be51'
          symbol: anyUSDC
          decimals: 6
          chainId: 137
          name: USDC
          coinKey: anyUSDC
          priceUSD: '0'
          logoURI: ''
        gasToken:
          address: '0x0000000000000000000000000000000000001010'
          symbol: MATIC
          decimals: 18
          chainId: 137
          name: MATIC
          coinKey: MATIC
          priceUSD: '0'
          logoURI: ''
        chainId: 137
        gasAmount: '10000'
        gasAmountUSD: '0.0'
        gasPrice: '1000'
        gasUsed: '1000'
        timestamp: 1720545119
        value: '0'
    Metadata:
      title: Root type for Transaction Metadata
      description: The metadata of the transaction which includes integrator data, etc.
      type: object
      properties:
        integrator:
          description: Integrator ID
          type: string
    Token:
      title: Root Type for Token
      description: Representation of a Token
      required:
        - address
        - chainId
        - decimals
        - name
        - symbol
      type: object
      properties:
        address:
          description: Address of the token
          type: string
        decimals:
          format: number
          description: Number of decimals the token uses
          type: number
        symbol:
          description: Symbol of the token
          type: string
        chainId:
          format: number
          description: Id of the token's chain
          type: number
        coinKey:
          description: Identifier for the token
          type: string
        name:
          description: Name of the token
          type: string
        logoURI:
          description: Logo of the token
          type: string
        priceUSD:
          description: Token price in USD
          type: string
      example:
        address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
        symbol: DAI
        decimals: 18
        chainId: 137
        name: (PoS) Dai Stablecoin
        coinKey: DAI
        priceUSD: '1'
        logoURI: >-
          https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/549c4205dbb199f1b8b03af783f35e71.png
    IncludedSwapSteps:
      title: Root type for included swaps or protocol steps in the status response
      description: >-
        The included steps contain tool name and details, sending and receiving
        token data and amounts.
      type: object
      properties:
        tool:
          description: The tool used for this step
          type: string
        toolDetails:
          description: >-
            The details of the tool used for this step. E.g. `1inch` or
            `feeProtocol`
          type: object
          properties:
            key:
              description: The tool key
              type: string
            name:
              description: The tool name
              type: string
            logoURI:
              description: The tool logo URL
              type: string
        fromAmount:
          description: The amount that was sent to the tool
          type: string
        fromToken:
          description: The token that was sent to the tool
          type: string
        toAmount:
          description: The amount that was received from the tool
          type: string
        toToken:
          description: The token that was received from the tool
          type: string
        bridgedAmount:
          description: The amount that was sent to the bridge
          type: string

````

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Get a paginated list of filtered transfers

> A paginated version of the `GET /v1/analytics/transfers endpoint`. This endpoint can be used to retrieve a list of transfers filtered by certain properties.



## OpenAPI

````yaml get /v2/analytics/transfers
openapi: 3.0.2
info:
  title: LI.FI API
  version: 1.0.0
  description: >-
    LI.FI provides the best cross-chain swap across all liquidity pools and
    bridges.
servers:
  - url: https://li.quest
    description: LI.FI Production Environment
  - url: https://staging.li.quest
    description: LI.FI Staging Environment
security: []
paths:
  /v2/analytics/transfers:
    get:
      summary: Get a paginated list of filtered transfers
      description: >-
        A paginated version of the `GET /v1/analytics/transfers endpoint`. This
        endpoint can be used to retrieve a list of transfers filtered by certain
        properties.
      parameters:
        - $ref: '#/components/parameters/paginationLimit'
        - $ref: '#/components/parameters/paginationNext'
        - $ref: '#/components/parameters/paginationPrevious'
        - name: integrator
          description: >-
            Either a single integrator string, or an array of unique integrator
            strings to filter transfers by.
          schema:
            oneOf:
              - type: string
              - type: array
                items:
                  type: string
          in: query
        - name: wallet
          description: 'The sending OR receiving wallet address '
          schema:
            type: string
          in: query
        - name: status
          description: >-
            The status of the transfers. Possible values are `ALL`, `DONE`,
            `PENDING`, and `FAILED`. The default is `DONE`
          schema:
            type: string
          in: query
        - name: fromTimestamp
          description: >-
            The oldest timestamp that should be taken into consideration.
            Defaults to 30 days ago
          schema:
            type: number
          in: query
        - name: toTimestamp
          description: >-
            The newest timestamp that should be taken into consideration.
            Defaults to now
          schema:
            type: number
          in: query
        - name: fromChain
          description: The chain where the transfer originates from.
          schema:
            type: string
          in: query
        - name: toChain
          description: The chain where the transfer ends.
          schema:
            type: string
          in: query
        - name: fromToken
          description: >-
            The token transferred from the originating chain. To use this
            parameter `fromChain` must be set.
          schema:
            type: string
          in: query
        - name: toToken
          description: >-
            The token received on the destination chain. To use this parameter
            `toChain` must be set.
          schema:
            type: string
          in: query
      responses:
        '200':
          $ref: '#/components/responses/TransfersV2Response'
components:
  parameters:
    paginationLimit:
      name: limit
      description: Pagination limit. Defines the maximum number of returned results.
      schema:
        default: 10
        type: integer
      in: query
      required: false
    paginationNext:
      name: next
      description: >-
        The next page cursor. Must come from the `next` field of the response of
        the previous request.
      schema:
        type: string
      in: query
      required: false
    paginationPrevious:
      name: previous
      description: >-
        The previous page cursor. Must come from the `previous` field of the
        response of the previous request.
      schema:
        type: string
      in: query
      required: false
  responses:
    TransfersV2Response:
      content:
        application/json:
          schema:
            allOf:
              - $ref: '#/components/schemas/PaginatedResult'
              - type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/StatusResponse'
      description: Response for `GET /analytics/transfers/summary` endpoint
  schemas:
    PaginatedResult:
      title: Pagination Query Parameters
      description: Parameters used to query paginated endpoints
      type: object
      properties:
        hasNext:
          description: Flag indicating if there is a next page
          default: false
          type: boolean
        hasPrevious:
          description: Flag indicating if there is a previous page
          default: false
          type: boolean
        next:
          nullable: true
          description: >-
            Cursor for fetching the next page. Should be passed to `next` in the
            pagination query.
          type: string
        previous:
          nullable: true
          description: >-
            Cursor for fetching the previous page. Should be passed to
            `previous` in the pagination query.
          type: string
        data:
          description: 'An array containing the paginated data returned by the endpoint '
    StatusResponse:
      title: Root Type for StatusResponse
      description: The current status of a transfer
      required:
        - sending
        - status
        - tool
      type: object
      properties:
        sending:
          $ref: '#/components/schemas/TransactionInfo'
          description: The transaction on the sending chain
        receiving:
          $ref: '#/components/schemas/TransactionInfo'
          description: The transaction on the receiving chain
        feeCosts:
          description: An array of fee costs for the transaction
          type: array
          items:
            type: object
            properties:
              name:
                type: string
              description:
                type: string
              percentage:
                type: string
              token:
                type: object
                properties:
                  address:
                    type: string
                  decimals:
                    format: number
                    type: number
                  symbol:
                    type: string
                  chainId:
                    format: number
                    type: number
                  coinKey:
                    type: string
                  name:
                    type: string
                  logoURI:
                    type: string
              amount:
                type: string
              amountUSD:
                type: string
              included:
                type: boolean
        status:
          description: >-
            The current status of the transfer. Can be `PENDING`, `DONE`,
            `NOT_FOUND` or `FAILED`
          enum:
            - NOT_FOUND
            - INVALID
            - PENDING
            - DONE
            - FAILED
          type: string
        substatus:
          description: >-
            A more specific substatus. This is available for PENDING and DONE
            statuses. More information can be found here:
            https://docs.li.fi/introduction/user-flows-and-examples/status-tracking
          enum:
            - WAIT_SOURCE_CONFIRMATIONS
            - WAIT_DESTINATION_TRANSACTION
            - BRIDGE_NOT_AVAILABLE
            - CHAIN_NOT_AVAILABLE
            - REFUND_IN_PROGRESS
            - UNKNOWN_ERROR
            - COMPLETED
            - PARTIAL
            - REFUNDED
        substatusMessage:
          description: A message that describes the substatus
          type: string
        tool:
          description: The tool used for this transfer
          type: string
        transactionId:
          description: The ID of this transfer (NOT a transaction hash).
          type: string
        fromAddress:
          description: The address of the sender.
          type: string
        toAddress:
          description: The address of the receiver.
          type: string
        lifiExplorerLink:
          description: The link to the LI.FI explorer.
          type: string
        metadata:
          $ref: '#/components/schemas/Metadata'
          description: The transaction metadata which includes integrator's string, etc.
      example:
        sending:
          txHash: '0xd3ad8fb8798d8440f3a1ec7fd51e102a88e4690f9365fad4eff1a17020376b4a'
          txLink: >-
            https://polygonscan.com/tx/0xd3ad8fb8798d8440f3a1ec7fd51e102a88e4690f9365fad4eff1a17020376b4a
          amount: '13000000'
          token:
            address: '0xd69b31c3225728cc57ddaf9be532a4ee1620be51'
            symbol: anyUSDC
            decimals: 6
            chainId: 137
            name: USDC
            coinKey: anyUSDC
            priceUSD: '0'
            logoURI: ''
          chainId: 137
          gasToken:
            address: '0x0000000000000000000000000000000000001010'
            symbol: MATIC
            decimals: 18
            chainId: 137
            name: MATIC
            coinKey: MATIC
            priceUSD: '0'
            logoURI: ''
          gasAmount: '10000'
          gasAmountUSD: '0.0'
          gasPrice: '1000'
          gasUsed: '1000'
          timestamp: 1720545119
          value: '0'
        receiving:
          txHash: '0xba2793065e20835ef60993144d92e6bc1a86529a70e16c357f66ad13774868ad'
          txLink: >-
            https://bscscan.com/tx/0xba2793065e20835ef60993144d92e6bc1a86529a70e16c357f66ad13774868ad
          amount: '12100000000000000000'
          token:
            address: '0x8965349fb649a33a30cbfda057d8ec2c48abe2a2'
            symbol: anyUSDC
            decimals: 18
            chainId: 56
            name: USDC
            coinKey: anyUSDC
            priceUSD: '0'
            logoURI: ''
          chainId: 56
          gasToken:
            address: '0x0000000000000000000000000000000000001010'
            symbol: BNB
            decimals: 18
            chainId: 56
            name: BNB
            coinKey: BNB
            priceUSD: '0'
            logoURI: ''
          gasAmount: '10000'
          gasAmountUSD: '0.0'
          gasPrice: '1000'
          gasUsed: '1000'
          timestamp: 1720560232
          value: '0'
        tool: anyswap
        status: DONE
        substatus: COMPLETED
        substatusMessage: The transfer is complete.
        transactionId: '0x0000000000000000000000000000000000001010'
        fromAddress: '0x0000000000000000000000000000000000001010'
        toAddress: '0x0000000000000000000000000000000000001010'
        lifiExplorerLink: >-
          https://scan.li.fi/tx/0xd3ad8fb8798d8440f3a1ec7fd51e102a88e4690f9365fad4eff1a17020376b4a
        metadata:
          integrator: jumper.exchange
    TransactionInfo:
      title: Root Type for TransactionInfo
      description: A transaction info object
      required:
        - txLink
        - amount
        - txHash
        - token
        - chainId
      type: object
      properties:
        txHash:
          description: The hash of the transaction
          type: string
        txLink:
          description: Link to a block explorer showing the transaction
          type: string
        amount:
          description: The amount of the transaction
          type: string
        token:
          $ref: '#/components/schemas/Token'
          description: Information about the token
        chainId:
          description: The id of the chain
          type: number
        gasToken:
          $ref: '#/components/schemas/Token'
          description: The token in which gas was paid
        gasAmount:
          description: The amount of the gas that was paid
          type: string
        gasAmountUSD:
          description: The amount of the gas that was paid in USD
          type: string
        gasPrice:
          description: The price of the gas
          type: string
        gasUsed:
          description: The amount of the gas that was used
          type: string
        timestamp:
          description: The transaction timestamp
          type: number
        value:
          description: The transaction value
          type: string
        includedSteps:
          description: An array of swap or protocol steps included in the LI.FI transaction
          type: array
          items:
            $ref: '#/components/schemas/IncludedSwapSteps'
      example:
        txHash: '0xd3ad8fb8798d8440f3a1ec7fd51e102a88e4690f9365fad4eff1a17020376b4a'
        txLink: >-
          https://polygonscan.com/tx/0xd3ad8fb8798d8440f3a1ec7fd51e102a88e4690f9365fad4eff1a17020376b4a
        amount: '13000000'
        token:
          address: '0xd69b31c3225728cc57ddaf9be532a4ee1620be51'
          symbol: anyUSDC
          decimals: 6
          chainId: 137
          name: USDC
          coinKey: anyUSDC
          priceUSD: '0'
          logoURI: ''
        gasToken:
          address: '0x0000000000000000000000000000000000001010'
          symbol: MATIC
          decimals: 18
          chainId: 137
          name: MATIC
          coinKey: MATIC
          priceUSD: '0'
          logoURI: ''
        chainId: 137
        gasAmount: '10000'
        gasAmountUSD: '0.0'
        gasPrice: '1000'
        gasUsed: '1000'
        timestamp: 1720545119
        value: '0'
    Metadata:
      title: Root type for Transaction Metadata
      description: The metadata of the transaction which includes integrator data, etc.
      type: object
      properties:
        integrator:
          description: Integrator ID
          type: string
    Token:
      title: Root Type for Token
      description: Representation of a Token
      required:
        - address
        - chainId
        - decimals
        - name
        - symbol
      type: object
      properties:
        address:
          description: Address of the token
          type: string
        decimals:
          format: number
          description: Number of decimals the token uses
          type: number
        symbol:
          description: Symbol of the token
          type: string
        chainId:
          format: number
          description: Id of the token's chain
          type: number
        coinKey:
          description: Identifier for the token
          type: string
        name:
          description: Name of the token
          type: string
        logoURI:
          description: Logo of the token
          type: string
        priceUSD:
          description: Token price in USD
          type: string
      example:
        address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
        symbol: DAI
        decimals: 18
        chainId: 137
        name: (PoS) Dai Stablecoin
        coinKey: DAI
        priceUSD: '1'
        logoURI: >-
          https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/549c4205dbb199f1b8b03af783f35e71.png
    IncludedSwapSteps:
      title: Root type for included swaps or protocol steps in the status response
      description: >-
        The included steps contain tool name and details, sending and receiving
        token data and amounts.
      type: object
      properties:
        tool:
          description: The tool used for this step
          type: string
        toolDetails:
          description: >-
            The details of the tool used for this step. E.g. `1inch` or
            `feeProtocol`
          type: object
          properties:
            key:
              description: The tool key
              type: string
            name:
              description: The tool name
              type: string
            logoURI:
              description: The tool logo URL
              type: string
        fromAmount:
          description: The amount that was sent to the tool
          type: string
        fromToken:
          description: The token that was sent to the tool
          type: string
        toAmount:
          description: The amount that was received from the tool
          type: string
        toToken:
          description: The token that was received from the tool
          type: string
        bridgedAmount:
          description: The amount that was sent to the bridge
          type: string

````

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Get a quote for a token transfer

> This endpoint can be used to request a quote for a transfer of one token to another, cross chain or not.
The endpoint returns a `Step` object which contains information about the estimated result as well as a `transactionRequest` which can directly be sent to your wallet.
The estimated result can be found inside the `estimate`, containing the estimated `toAmount` of the requested `Token` and the `toAmountMin`, which is the guaranteed minimum value that the transfer will yield including slippage.
If you want to learn more about how to use this endpoint please have a look at our [guide](https://docs.li.fi/more-integration-options/li.fi-api/requesting-a-quote).



## OpenAPI

````yaml get /v1/quote
openapi: 3.0.2
info:
  title: LI.FI API
  version: 1.0.0
  description: >-
    LI.FI provides the best cross-chain swap across all liquidity pools and
    bridges.
servers:
  - url: https://li.quest
    description: LI.FI Production Environment
  - url: https://staging.li.quest
    description: LI.FI Staging Environment
security: []
paths:
  /v1/quote:
    get:
      summary: Get a quote for a token transfer
      description: >-
        This endpoint can be used to request a quote for a transfer of one token
        to another, cross chain or not.

        The endpoint returns a `Step` object which contains information about
        the estimated result as well as a `transactionRequest` which can
        directly be sent to your wallet.

        The estimated result can be found inside the `estimate`, containing the
        estimated `toAmount` of the requested `Token` and the `toAmountMin`,
        which is the guaranteed minimum value that the transfer will yield
        including slippage.

        If you want to learn more about how to use this endpoint please have a
        look at our
        [guide](https://docs.li.fi/more-integration-options/li.fi-api/requesting-a-quote).
      parameters:
        - example: DAI
          name: fromChain
          description: The sending chain. Can be the chain id or chain key
          schema:
            type: string
          in: query
          required: true
        - example: POL
          name: toChain
          description: The receiving chain. Can be the chain id or chain key
          schema:
            type: string
          in: query
          required: true
        - example: '0x4ecaba5870353805a9f068101a40e0f32ed605c6'
          name: fromToken
          description: >-
            The token that should be transferred. Can be the address or the
            symbol
          schema:
            type: string
          in: query
          required: true
        - example: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
          name: toToken
          description: >-
            The token that should be transferred to. Can be the address or the
            symbol
          schema:
            type: string
          in: query
          required: true
        - example: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
          name: fromAddress
          description: The sending wallet address
          schema:
            type: string
          in: query
          required: true
        - example: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
          name: toAddress
          description: >-
            The receiving wallet address. If none is provided, the fromAddress
            will be used
          schema:
            type: string
          in: query
          required: false
        - example: '1000000'
          name: fromAmount
          description: >-
            The amount that should be sent including all decimals (e.g. 1000000
            for 1 USDC (6 decimals))
          schema:
            type: string
          in: query
          required: true
        - name: order
          description: >-
            Which kind of route should be preferred **FASTEST**: This sorting
            criterion prioritizes routes with the shortest estimated execution
            time. Users who value speed and want their transactions to be
            completed as quickly as possible should choose the fastest routes.
            **CHEAPEST**: This criterion focuses on minimizing the cost of the
            transaction, whether in token amount or USD amount (USD amount minus
            gas cost). Users looking for the most economical option should
            choose the cheapest routes.
          schema:
            enum:
              - FASTEST
              - CHEAPEST
            type: string
          in: query
        - example: 0.005
          name: slippage
          description: >-
            The maximum allowed slippage for the transaction as a decimal value.
            0.005 represents 0.5%.
          schema:
            maximum: 1
            minimum: 0
            type: number
          in: query
        - example: fee-demo
          name: integrator
          description: >-
            A string containing tracking information about the integrator of the
            API
          schema:
            type: string
          in: query
        - example: 0.02
          name: fee
          description: >-
            The percent of the integrator's fee that is taken from every
            transaction. 0.02 represents 2%. The maximum fee amount should be
            less than 100%.
          schema:
            maximum: 1
            exclusiveMaximum: true
            minimum: 0
            type: number
          in: query
        - name: referrer
          description: >-
            A string containing tracking information about the referrer of the
            integrator
          schema:
            type: string
          in: query
          required: false
        - example: hop,cbridge
          name: allowBridges
          description: >-
            List of bridges that are allowed for this transaction. Retrieve the
            current catalog from the `/v1/tools` endpoint. Also values `all`,
            `none`, `default` and `[]` are acceptable and mean all tools of the
            current type (`all`), no tools (for `none` and `[]` cases) and
            default tool's settings on the current stage.
          schema:
            type: array
            items:
              $ref: '#/components/schemas/QuoteBridgesEnum'
          in: query
        - name: allowExchanges
          description: >-
            List of exchanges that are allowed for this transaction. Retrieve
            the current catalog from the `/v1/tools` endpoint. Also values
            `all`, `none`, `default` and `[]` are acceptable and mean all tools
            of the current type (`all`), no tools (for `none` and `[]` cases)
            and default tool's settings on the current stage.
          schema:
            type: array
            items:
              $ref: '#/components/schemas/QuoteExchangesEnum'
          in: query
        - example: relay
          name: denyBridges
          description: >-
            List of bridges that are not allowed for this transaction. Retrieve
            the current catalog from the `/v1/tools` endpoint. Also values
            `all`, `none`, `default` and `[]` are acceptable and mean all tools
            of the current type (`all`), no tools (for `none` and `[]` cases)
            and default tool's settings on the current stage.
          schema:
            type: array
            items:
              $ref: '#/components/schemas/QuoteBridgesEnum'
          in: query
        - name: denyExchanges
          description: >-
            List of exchanges that are not allowed for this transaction.
            Retrieve the current catalog from the `/v1/tools` endpoint. Also
            values `all`, `none`, `default` and `[]` are acceptable and mean all
            tools of the current type (`all`), no tools (for `none` and `[]`
            cases) and default tool's settings on the current stage.
          schema:
            type: array
            items:
              $ref: '#/components/schemas/QuoteExchangesEnum'
          in: query
        - name: preferBridges
          description: >-
            List of bridges that should be preferred for this transaction.
            Retrieve the current catalog from the `/v1/tools` endpoint. Also
            values `all`, `none`, `default` and `[]` are acceptable and mean all
            tools of the current type (`all`), no tools (for `none` and `[]`
            cases) and default tool's settings on the current stage.
          schema:
            type: array
            items:
              $ref: '#/components/schemas/QuoteBridgesEnum'
          in: query
        - name: preferExchanges
          description: >-
            List of exchanges that should be preferred for this transaction.
            Retrieve the current catalog from the `/v1/tools` endpoint. Also
            values `all`, `none`, `default` and `[]` are acceptable and mean all
            tools of the current type (`all`), no tools (for `none` and `[]`
            cases) and default tool's settings on the current stage.
          schema:
            type: array
            items:
              $ref: '#/components/schemas/QuoteExchangesEnum'
          in: query
        - name: allowDestinationCall
          description: >-
            Whether swaps or other contract calls should be allowed as part of
            the destination transaction of a bridge transfer. Separate swap
            transactions on the destination chain are not affected by this flag.
            By default, parameter is `true`.
          schema:
            type: boolean
          in: query
        - name: fromAmountForGas
          description: The amount of the token to convert to gas on the destination side.
          schema:
            type: string
          in: query
          required: false
        - name: maxPriceImpact
          description: >-
            The price impact threshold above which routes are hidden. As an
            example, one should specify 0.15 (15%) to hide routes with more than
            15% price impact. The default is 10%.
          schema:
            type: number
          in: query
        - name: swapStepTimingStrategies
          description: >-
            Timing setting to wait for a certain amount of swap rates. In the
            format
            `minWaitTime-${minWaitTimeMs}-${startingExpectedResults}-${reduceEveryMs}`.
            Please check [docs.li.fi](https://docs.li.fi) for more details.
          schema:
            type: array
            items:
              type: string
              example: minWaitTime-600-4-300
          in: query
          required: false
        - name: routeTimingStrategies
          description: >-
            Timing setting to wait for a certain amount of routes to be
            generated before chosing the best one. In the format
            `minWaitTime-${minWaitTimeMs}-${startingExpectedResults}-${reduceEveryMs}`.
            Please check [docs.li.fi](https://docs.li.fi) for more details.
          schema:
            type: array
            items:
              type: string
              example: minWaitTime-600-4-300
          in: query
          required: false
        - name: skipSimulation
          description: >-
            Parameter to skip transaction simulation. The quote will be returned
            faster but the transaction gas limit won't be accurate.
          schema:
            type: boolean
          in: query
          required: false
        - name: x-lifi-api-key
          description: >-
            Authentication header, register in the LI.FI Partner Portal
            (https://portal.li.fi/ ) to get your API Key.
          schema:
            type: string
          in: header
      responses:
        '200':
          $ref: '#/components/responses/StepResponse'
        '400':
          $ref: '#/components/responses/InvalidQuoteRequest'
        '404':
          $ref: '#/components/responses/QuoteNotFound'
components:
  schemas:
    QuoteBridgesEnum:
      type: string
      description: >-
        Bridge tool identifier or keyword. Retrieve current bridge keys from the
        `/v1/tools` endpoint. Supported keywords: `all`, `none`, `default`,
        `[]`.
    QuoteExchangesEnum:
      type: string
      description: >-
        Exchange tool identifier or keyword. Retrieve current exchange keys from
        the `/v1/tools` endpoint. Supported keywords: `all`, `none`, `default`,
        `[]`.
    Step:
      title: Root Type for Step
      description: Object that represents one step of a `Route`
      required:
        - id
        - action
        - tool
        - type
      type: object
      properties:
        id:
          description: Unique identifier of the step
          type: string
        type:
          description: >-
            The type of the step. `swap` executes a DEX swap on a single chain,
            `cross` bridges assets between chains, `lifi` runs LiFi's internal
            multi-action logic, and `protocol` represents protocol-level actions
            such as fee collection or vault interactions executed inside LiFi
            managed contracts.
          enum:
            - swap
            - cross
            - lifi
            - protocol
          type: string
        tool:
          description: The tool used for this step. E.g. `relay`
          type: string
        toolDetails:
          description: The details of the tool used for this step. E.g. `relay`
          type: object
          properties:
            key:
              description: The tool key
              type: string
            name:
              description: The tool name
              type: string
            logoURI:
              description: The tool logo URL
              type: string
        action:
          $ref: '#/components/schemas/Action'
          description: The action of the step
        estimate:
          $ref: '#/components/schemas/Estimate'
          description: The estimation for the step
        integrator:
          description: >-
            A string containing tracking information about the integrator of the
            API
          type: string
        includedSteps:
          type: array
          items:
            $ref: '#/components/schemas/IncludedStep'
        referrer:
          description: >-
            A string containing tracking information about the referrer of the
            integrator
          type: string
        execution:
          description: An objection containing status information about the execution
        transactionRequest:
          description: >-
            An ether.js TransactionRequest that can be triggered using a wallet
            provider.
            (https://docs.ethers.io/v5/api/providers/types/#providers-TransactionRequest)
      example:
        id: '0x48f0a2f93b0d0a9dab992d07c46bca38516c945101e8f8e08ca42af05b9e6aa9'
        type: cross
        tool: relay
        action:
          fromChainId: 100
          toChainId: 137
          fromToken:
            address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
            symbol: MIVA
            decimals: 18
            chainId: 100
            name: Minerva Wallet SuperToken
            coinKey: MIVA
            priceUSD: '0.04547537276751318'
            logoURI: ''
          toToken:
            address: '0xc0b2983a17573660053beeed6fdb1053107cf387'
            symbol: MIVA
            decimals: 18
            chainId: 137
            name: Minerva Wallet SuperToken
            coinKey: MIVA
            priceUSD: '0'
            logoURI: ''
          fromAmount: '1000000000000000000'
          slippage: 0.003
        estimate:
          fromAmount: '1000000000000000000'
          toAmount: '999500000000000000'
          toAmountMin: '999500000000000000'
          approvalAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
          feeCosts:
            - name: Gas Fee
              description: Covers gas expense for sending funds to user on receiving chain.
              percentage: '0'
              token:
                address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                symbol: MIVA
                decimals: 18
                chainId: 100
                name: Minerva Wallet SuperToken
                coinKey: MIVA
                priceUSD: '0.04547537276751318'
                logoURI: ''
              amount: '0'
              amountUSD: '0.00'
              included: true
            - name: Relay Fee
              description: Covers gas expense for claiming user funds on receiving chain.
              percentage: '0'
              token:
                address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                symbol: MIVA
                decimals: 18
                chainId: 100
                name: Minerva Wallet SuperToken
                coinKey: MIVA
                priceUSD: '0.04547537276751318'
                logoURI: ''
              amount: '0'
              amountUSD: '0.00'
              included: true
            - name: Router Fee
              description: Router service fee.
              percentage: '0.0005'
              token:
                address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                symbol: MIVA
                decimals: 18
                chainId: 100
                name: Minerva Wallet SuperToken
                coinKey: MIVA
                priceUSD: '0.04547537276751318'
                logoURI: ''
              amount: '500000000000000'
              amountUSD: '22737686383756.59'
              included: true
          gasCosts:
            - type: SEND
              price: '1.26'
              estimate: '140000'
              limit: '175000'
              amount: '176400'
              amountUSD: '0.00'
              token:
                address: '0x0000000000000000000000000000000000000000'
                symbol: xDai
                decimals: 18
                chainId: 100
                name: xDai
                coinKey: xDai
                priceUSD: '1'
                logoURI: >-
                  https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
          data:
            bid:
              user: '0x53F68B2186E4a4aB4dD976eD32de68db45BA360b'
              router: '0xeE2Ef40F688607CB23618d9312d62392786d13EB'
              initiator: '0x53F68B2186E4a4aB4dD976eD32de68db45BA360b'
              sendingChainId: 100
              sendingAssetId: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
              amount: '1000000000000000000'
              receivingChainId: 137
              receivingAssetId: '0xc0b2983a17573660053beeed6fdb1053107cf387'
              amountReceived: '999500000000000000'
              receivingAddress: '0x10fBFF9b9450D3A2d9d1612d6dE3726fACD8809E'
              transactionId: >-
                0x48f0a2f93b0d0a9dab992d07c46bca38516c945101e8f8e08ca42af05b9e6aa9
              expiry: 1643364189
              callDataHash: >-
                0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470
              callTo: '0x0000000000000000000000000000000000000000'
              encryptedCallData: 0x
              sendingChainTxManagerAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
              receivingChainTxManagerAddress: '0x6090De2EC76eb1Dc3B5d632734415c93c44Fd113'
              bidExpiry: 1643105290
            gasFeeInReceivingToken: '0'
            totalFee: '500000000000000'
            metaTxRelayerFee: '0'
            routerFee: '500000000000000'
        integrator: fee-demo
    UnavailableRoutes:
      type: object
      properties:
        filteredOut:
          description: >-
            An object containing information about routes that were
            intentionally filtered out.
          type: array
          items:
            properties:
              overallPath:
                description: The complete representation of the attempted route.
                type: string
                example: 100:USDC-hop-137:USDC-137:USDC~137:SUSHI
              reason:
                description: Out best attempt at describing the failure.
                type: string
        failed:
          description: An object containing information about failed routes.
          type: array
          items:
            properties:
              overallPath:
                description: The complete representation of the attempted route.
                type: string
                example: 100:USDC-hop-137:USDC-137:USDC~137:SUSHI
              subpaths:
                description: An object with all subpaths that generated one or more errors
                type: object
                additionalProperties:
                  $ref: '#/components/schemas/ToolError'
    Action:
      title: Root Type for Action
      description: Object describing what happens in a `Step`
      required:
        - fromToken
        - fromAmount
        - fromChainId
        - toChainId
        - toToken
      type: object
      properties:
        fromChainId:
          format: number
          description: The id of the chain where the transfer should start
          type: number
        fromAmount:
          description: The amount that should be transferred including all decimals
          type: string
        fromToken:
          $ref: '#/components/schemas/Token'
          description: The sending token
        toChainId:
          format: number
          description: The id of the chain where the transfer should end
          type: number
        toToken:
          $ref: '#/components/schemas/Token'
          description: The token that should be transferred to
        slippage:
          format: double
          description: The maximum allowed slippage
          type: number
        fromAddress:
          description: The sending wallet address
          type: string
        toAddress:
          description: The receiving wallet address
          type: string
      example:
        fromChainId: 100
        fromAmount: '1000000000000000000'
        fromToken:
          address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
          symbol: MIVA
          decimals: 18
          chainId: 100
          name: Minerva Wallet SuperToken
          coinKey: MIVA
          priceUSD: '0.0455272371751059'
          logoURI: ''
        toChainId: 137
        toToken:
          address: '0xc0b2983a17573660053beeed6fdb1053107cf387'
          symbol: MIVA
          decimals: 18
          chainId: 137
          name: Minerva Wallet SuperToken
          coinKey: MIVA
          priceUSD: '0'
          logoURI: ''
        slippage: 0.003
    Estimate:
      title: Root Type for Estimate
      description: An estimate for the current transfer
      required:
        - fromAmount
        - approvalAddress
        - toAmount
        - toAmountMin
        - tool
        - executionDuration
      type: object
      properties:
        tool:
          description: The tools that is being used for this step
          type: string
        fromAmount:
          description: The amount that should be transferred including all decimals
          type: string
        fromAmountUSD:
          description: The amount that should be transferred in USD equivalent
          type: string
        toAmount:
          description: >-
            The estimated resulting amount of the `toToken` including all
            decimals
          type: string
        toAmountMin:
          description: The minimal outcome of the transfer including all decimals
          type: string
        toAmountUSD:
          description: The estimated resulting amount of the `toToken` in USD equivalent
          type: string
        approvalAddress:
          description: The contract address for the approval
          type: string
        feeCosts:
          description: Fees included in the transfer
          type: array
          items:
            $ref: '#/components/schemas/FeeCost'
        gasCosts:
          description: Gas costs included in the transfer
          type: array
          items:
            $ref: '#/components/schemas/GasCost'
        executionDuration:
          description: The time needed to complete the following step
          type: number
        data:
          description: Arbitrary data that depends on the the used tool
          type: object
          properties:
            bid:
              type: object
              properties:
                user:
                  type: string
                router:
                  type: string
                initiator:
                  type: string
                sendingChainId:
                  format: number
                  type: number
                sendingAssetId:
                  type: string
                amount:
                  type: string
                receivingChainId:
                  format: number
                  type: number
                receivingAssetId:
                  type: string
                amountReceived:
                  type: string
                receivingAddress:
                  type: string
                transactionId:
                  type: string
                expiry:
                  format: number
                  type: number
                callDataHash:
                  type: string
                callTo:
                  type: string
                encryptedCallData:
                  type: string
                sendingChainTxManagerAddress:
                  type: string
                receivingChainTxManagerAddress:
                  type: string
                bidExpiry:
                  format: number
                  type: number
            bidSignature:
              type: string
            gasFeeInReceivingToken:
              type: string
            totalFee:
              type: string
            metaTxRelayerFee:
              type: string
            routerFee:
              type: string
      example:
        fromAmount: '1000000000000000000'
        toAmount: '999500000000000000'
        toAmountMin: '999500000000000000'
        tool: allbridge
        executionDuration: 60
        approvalAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
        feeCosts:
          - name: Gas Fee
            description: Covers gas expense for sending funds to user on receiving chain.
            percentage: '0'
            token:
              address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
              symbol: MIVA
              decimals: 18
              chainId: 100
              name: Minerva Wallet SuperToken
              coinKey: MIVA
              priceUSD: '0.0455272371751059'
              logoURI: ''
            amount: '0'
            amountUSD: '0.00'
            included: true
          - name: Relay Fee
            description: Covers gas expense for claiming user funds on receiving chain.
            percentage: '0'
            token:
              address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
              symbol: MIVA
              decimals: 18
              chainId: 100
              name: Minerva Wallet SuperToken
              coinKey: MIVA
              priceUSD: '0.0455272371751059'
              logoURI: ''
            amount: '0'
            amountUSD: '0.00'
            included: true
          - name: Router Fee
            description: Router service fee.
            percentage: '0.0005'
            token:
              address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
              symbol: MIVA
              decimals: 18
              chainId: 100
              name: Minerva Wallet SuperToken
              coinKey: MIVA
              priceUSD: '0.0455272371751059'
              logoURI: ''
            amount: '500000000000000'
            amountUSD: '22763618587552.95'
            included: true
        gasCosts:
          - type: SEND
            price: '1.22'
            estimate: '140000'
            limit: '175000'
            amount: '170800'
            amountUSD: '0.00'
            token:
              address: '0x0000000000000000000000000000000000000000'
              symbol: xDai
              decimals: 18
              chainId: 100
              name: xDai
              coinKey: xDai
              priceUSD: '1'
              logoURI: >-
                https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
        data:
          bid:
            user: '0x10fBFF9b9450D3A2d9d1612d6dE3726fACD8809E'
            router: '0xeE2Ef40F688607CB23618d9312d62392786d13EB'
            initiator: '0x10fBFF9b9450D3A2d9d1612d6dE3726fACD8809E'
            sendingChainId: 100
            sendingAssetId: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
            amount: '1000000000000000000'
            receivingChainId: 137
            receivingAssetId: '0xc0b2983a17573660053beeed6fdb1053107cf387'
            amountReceived: '999500000000000000'
            receivingAddress: '0x10fBFF9b9450D3A2d9d1612d6dE3726fACD8809E'
            transactionId: '0x9f54c1764e19367c44706f4a6253941b81e9ec524af5590091aa8ae67e7644ed'
            expiry: 1643369368
            callDataHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
            callTo: '0x0000000000000000000000000000000000000000'
            encryptedCallData: 0x
            sendingChainTxManagerAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
            receivingChainTxManagerAddress: '0x6090De2EC76eb1Dc3B5d632734415c93c44Fd113'
            bidExpiry: 1643110469
          gasFeeInReceivingToken: '0'
          totalFee: '500000000000000'
          metaTxRelayerFee: '0'
          routerFee: '500000000000000'
    IncludedStep:
      title: Root Type for Internal Step
      description: Object that represents one step of an `IncludedSteps` array in `Route`
      required:
        - id
        - action
        - estimate
        - tool
        - type
        - toolDetails
      type: object
      properties:
        id:
          description: Unique identifier of the step
          type: string
        type:
          description: >-
            The type of the step. `swap` executes a DEX swap on a single chain,
            `cross` bridges assets between chains, `lifi` runs LiFi's internal
            multi-action logic, and `protocol` represents protocol-level actions
            such as fee collection or vault interactions executed inside LiFi
            managed contracts.
          enum:
            - swap
            - cross
            - lifi
            - protocol
          type: string
        tool:
          description: The tool used for this step. E.g. `allbridge`
          type: string
        toolDetails:
          description: The details of the tool used for this step. E.g. `allbridge`
          type: object
          properties:
            key:
              description: The tool key
              type: string
            name:
              description: The tool name
              type: string
            logoURI:
              description: The tool logo URL
              type: string
        action:
          $ref: '#/components/schemas/Action'
        estimate:
          $ref: '#/components/schemas/Estimate'
    ToolError:
      title: An error returned by a tool (Exchange or Bridge)
      description: Describes why a certain operation (like a quote request) failed.
      type: object
      properties:
        errorType:
          description: The type of error that occurred.
          enum:
            - NO_QUOTE
          type: string
        code:
          description: The error code.
          enum:
            - NO_POSSIBLE_ROUTE
            - INSUFFICIENT_LIQUIDITY
            - TOOL_TIMEOUT
            - UNKNOWN_ERROR
            - RPC_ERROR
            - AMOUNT_TOO_LOW
            - AMOUNT_TOO_HIGH
            - FEES_HIGHER_THAN_AMOUNT
            - DIFFERENT_RECIPIENT_NOT_SUPPORTED
            - TOOL_SPECIFIC_ERROR
            - CANNOT_GUARANTEE_MIN_AMOUNT
            - RATE_LIMIT_EXCEEDED
          type: string
        action:
          $ref: '#/components/schemas/Action'
        tool:
          description: The tool that emitted the error.
          type: string
        message:
          description: A human-readable message describing the error.
          type: string
    Token:
      title: Root Type for Token
      description: Representation of a Token
      required:
        - address
        - chainId
        - decimals
        - name
        - symbol
      type: object
      properties:
        address:
          description: Address of the token
          type: string
        decimals:
          format: number
          description: Number of decimals the token uses
          type: number
        symbol:
          description: Symbol of the token
          type: string
        chainId:
          format: number
          description: Id of the token's chain
          type: number
        coinKey:
          description: Identifier for the token
          type: string
        name:
          description: Name of the token
          type: string
        logoURI:
          description: Logo of the token
          type: string
        priceUSD:
          description: Token price in USD
          type: string
      example:
        address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
        symbol: DAI
        decimals: 18
        chainId: 137
        name: (PoS) Dai Stablecoin
        coinKey: DAI
        priceUSD: '1'
        logoURI: >-
          https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/549c4205dbb199f1b8b03af783f35e71.png
    FeeCost:
      title: Root Type for FeeCost
      description: Fees included in the transfer
      required:
        - token
        - percentage
        - name
        - amountUSD
        - included
      type: object
      properties:
        name:
          description: Name of the fee
          type: string
        description:
          description: Description of the fee costs
          type: string
        percentage:
          description: Percentage of how much fees are taken
          type: string
        token:
          $ref: '#/components/schemas/Token'
          description: The `Token` in which the fees are taken
        amount:
          description: The amount of fees
          type: string
        amountUSD:
          description: The amount of fees in USD
          type: string
        included:
          description: Whether fee is included into transfer's `fromAmount`
          type: boolean
      example:
        name: Gas Fee
        description: Covers gas expense for sending funds to user on receiving chain.
        percentage: '0'
        token:
          address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
          symbol: MIVA
          decimals: 18
          chainId: 100
          name: Minerva Wallet SuperToken
          coinKey: MIVA
          priceUSD: '0.0455272371751059'
          logoURI: ''
        amount: '0'
        amountUSD: '0.00'
    GasCost:
      title: Root Type for GasCost
      description: Gas costs included in the transfer
      required:
        - token
        - type
        - amount
      type: object
      properties:
        type:
          description: Can be one of `SUM`, `APPROVE` or `SEND`
          type: string
        price:
          description: Suggested current standard price for the chain
          type: string
        estimate:
          description: Estimation how much gas will be needed
          type: string
        limit:
          description: Suggested gas limit
          type: string
        amount:
          description: Amount of the gas cost
          type: string
        amountUSD:
          description: Amount of the gas cost in USD
          type: string
        token:
          $ref: '#/components/schemas/Token'
          description: The used gas token
      example:
        type: SEND
        price: '1.22'
        estimate: '140000'
        limit: '175000'
        amount: '170800'
        amountUSD: '0.00'
        token:
          address: '0x0000000000000000000000000000000000000000'
          symbol: xDai
          decimals: 18
          chainId: 100
          name: xDai
          coinKey: xDai
          priceUSD: '1'
          logoURI: >-
            https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
  responses:
    StepResponse:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Step'
          examples:
            StepResponseExample:
              value:
                id: a8dc011a-f52d-4492-9e99-21de64b5453a
                type: lifi
                tool: 1inch
                toolDetails:
                  key: 1inch
                  logoURI: >-
                    https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/oneinch.svg
                  name: 1inch
                action:
                  fromChainId: 100
                  toChainId: 100
                  fromToken:
                    address: '0x0000000000000000000000000000000000000000'
                    symbol: xDai
                    decimals: 18
                    chainId: 100
                    name: xDai
                    coinKey: xDai
                    priceUSD: '1'
                    logoURI: >-
                      https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
                  toToken:
                    name: Minerva Wallet SuperToken
                    symbol: MIVA
                    coinKey: MIVA
                    decimals: 18
                    chainId: 100
                    logoURI: https://minerva.digital/i/MIVA-Token_200x200.png
                    address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                  fromAmount: '1000000000000000000'
                  slippage: 0.003
                  fromAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
                  toAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
                estimate:
                  fromAmount: '1000000000000000000'
                  toAmount: '21922914496086353975'
                  toAmountMin: '21265227061203763356'
                  approvalAddress: '0x1111111254fb6c44bac0bed2854e76f90643097d'
                  feeCosts: []
                  gasCosts:
                    - type: SEND
                      price: '1'
                      estimate: '252364'
                      limit: '315455'
                      amount: '252364'
                      amountUSD: '0.00'
                      token:
                        address: '0x0000000000000000000000000000000000000000'
                        symbol: xDai
                        decimals: 18
                        chainId: 100
                        name: xDai
                        coinKey: xDai
                        priceUSD: '1'
                        logoURI: >-
                          https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
                  data:
                    fromToken:
                      name: xDAI
                      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                      symbol: xDAI
                      decimals: 18
                      logoURI: >-
                        https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png
                    toToken:
                      name: Minerva Wallet SuperToken
                      address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                      symbol: MIVA
                      decimals: 18
                      logoURI: https://minerva.digital/i/MIVA-Token_200x200.png
                    toTokenAmount: '21922914496086353975'
                    fromTokenAmount: '1000000000000000000'
                    protocols:
                      - - - name: GNOSIS_HONEYSWAP
                            part: 100
                            fromTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                            toTokenAddress: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                    estimatedGas: 252364
                integrator: fee-demo
                transactionRequest:
                  from: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
                  to: '0x1111111254fb6c44bac0bed2854e76f90643097d'
                  chainId: 100
                  data: 0x...
                  value: '0x0de0b6b3a7640000'
                  gasPrice: '0xb2d05e00'
                  gasLimit: '0x0e9cb2'
                includedSteps:
                  - id: a8dc011a-f52d-4492-9e99-21de64b5453a
                    type: swap
                    tool: 1inch
                    toolDetails:
                      key: 1inch
                      logoURI: >-
                        https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/oneinch.svg
                      name: 1inch
                    action:
                      fromChainId: 100
                      toChainId: 100
                      fromToken:
                        address: '0x0000000000000000000000000000000000000000'
                        symbol: xDai
                        decimals: 18
                        chainId: 100
                        name: xDai
                        coinKey: xDai
                        priceUSD: '1'
                        logoURI: >-
                          https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
                      toToken:
                        name: Minerva Wallet SuperToken
                        symbol: MIVA
                        coinKey: MIVA
                        decimals: 18
                        chainId: 100
                        logoURI: https://minerva.digital/i/MIVA-Token_200x200.png
                        address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                      fromAmount: '1000000000000000000'
                      slippage: 0.003
                      fromAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
                      toAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
                    estimate:
                      fromAmount: '1000000000000000000'
                      toAmount: '21922914496086353975'
                      toAmountMin: '21265227061203763356'
                      approvalAddress: '0x1111111254fb6c44bac0bed2854e76f90643097d'
                      feeCosts: []
                      gasCosts:
                        - type: SEND
                          price: '1'
                          estimate: '252364'
                          limit: '315455'
                          amount: '252364'
                          amountUSD: '0.00'
                          token:
                            address: '0x0000000000000000000000000000000000000000'
                            symbol: xDai
                            decimals: 18
                            chainId: 100
                            name: xDai
                            coinKey: xDai
                            priceUSD: '1'
                            logoURI: >-
                              https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
                      data:
                        fromToken:
                          name: xDAI
                          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                          symbol: xDAI
                          decimals: 18
                          logoURI: >-
                            https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png
                        toToken:
                          name: Minerva Wallet SuperToken
                          address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                          symbol: MIVA
                          decimals: 18
                          logoURI: https://minerva.digital/i/MIVA-Token_200x200.png
                        toTokenAmount: '21922914496086353975'
                        fromTokenAmount: '1000000000000000000'
                        protocols:
                          - - - name: GNOSIS_HONEYSWAP
                                part: 100
                                fromTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                                toTokenAddress: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                        estimatedGas: 252364
      description: The step populated with the transaction data
    InvalidQuoteRequest:
      description: Invalid quote request
    QuoteNotFound:
      content:
        application/json:
          schema:
            type: object
            properties:
              message:
                description: The error message
                type: string
                example: Unable to find a quote for the requested transfer
              errors:
                type: object
                items:
                  $ref: '#/components/schemas/UnavailableRoutes'
      description: Unable to find a quote for the requested transfer.

````

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Get a quote for a token transfer

> This endpoint is an alternative to the `v1/quote` endpoint, taking a `toAmount` value rather than `fromAmount`. This endpoint will calculate an appropriate `fromAmount` based on the specified `toAmount`, and use this value to generate the quote data.
This endpoint can be used to request a quote for a transfer of one token to another, cross chain or not.
The endpoint returns a `Step` object which contains information about the estimated result as well as a `transactionRequest` which can directly be sent to your wallet.
The estimated result can be found inside the `estimate`, containing the estimated required `fromAmount` of the sending `Token` to meet the `toAmountMin` of the receiving token, which is the guaranteed minimum value that the transfer will yield including slippage.
If you want to learn more about how to use this endpoint please have a look at our [guide](https://docs.li.fi/more-integration-options/li.fi-api/requesting-a-quote).



## OpenAPI

````yaml get /v1/quote/toAmount
openapi: 3.0.2
info:
  title: LI.FI API
  version: 1.0.0
  description: >-
    LI.FI provides the best cross-chain swap across all liquidity pools and
    bridges.
servers:
  - url: https://li.quest
    description: LI.FI Production Environment
  - url: https://staging.li.quest
    description: LI.FI Staging Environment
security: []
paths:
  /v1/quote/toAmount:
    get:
      summary: Get a quote for a token transfer
      description: >-
        This endpoint is an alternative to the `v1/quote` endpoint, taking a
        `toAmount` value rather than `fromAmount`. This endpoint will calculate
        an appropriate `fromAmount` based on the specified `toAmount`, and use
        this value to generate the quote data.

        This endpoint can be used to request a quote for a transfer of one token
        to another, cross chain or not.

        The endpoint returns a `Step` object which contains information about
        the estimated result as well as a `transactionRequest` which can
        directly be sent to your wallet.

        The estimated result can be found inside the `estimate`, containing the
        estimated required `fromAmount` of the sending `Token` to meet the
        `toAmountMin` of the receiving token, which is the guaranteed minimum
        value that the transfer will yield including slippage.

        If you want to learn more about how to use this endpoint please have a
        look at our
        [guide](https://docs.li.fi/more-integration-options/li.fi-api/requesting-a-quote).
      parameters:
        - example: DAI
          name: fromChain
          description: The sending chain. Can be the chain id or chain key
          schema:
            type: string
          in: query
          required: true
        - example: POL
          name: toChain
          description: The receiving chain. Can be the chain id or chain key
          schema:
            type: string
          in: query
          required: true
        - example: '0x4ecaba5870353805a9f068101a40e0f32ed605c6'
          name: fromToken
          description: >-
            The token that should be transferred. Can be the address or the
            symbol
          schema:
            type: string
          in: query
          required: true
        - example: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
          name: toToken
          description: >-
            The token that should be transferred to. Can be the address or the
            symbol
          schema:
            type: string
          in: query
          required: true
        - example: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
          name: fromAddress
          description: The sending wallet address
          schema:
            type: string
          in: query
          required: true
        - example: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
          name: toAddress
          description: >-
            The receiving wallet address. If none is provided, the fromAddress
            will be used
          schema:
            type: string
          in: query
          required: false
        - example: '1000000'
          name: toAmount
          description: >-
            The amount that will be received including all decimals (e.g.
            1000000 for 1 USDC (6 decimals))
          schema:
            type: string
          in: query
          required: true
        - name: order
          description: >-
            Which kind of route should be preferred **FASTEST**: This sorting
            criterion prioritizes routes with the shortest estimated execution
            time. Users who value speed and want their transactions to be
            completed as quickly as possible should choose the fastest routes.
            **CHEAPEST**: This criterion focuses on minimizing the cost of the
            transaction, whether in token amount or USD amount (USD amount minus
            gas cost). Users looking for the most economical option should
            choose the cheapest routes.
          schema:
            enum:
              - FASTEST
              - CHEAPEST
            type: string
          in: query
        - example: 0.005
          name: slippage
          description: >-
            The maximum allowed slippage for the transaction as a decimal value.
            0.005 represents 0.5%.
          schema:
            maximum: 1
            minimum: 0
            type: number
          in: query
        - example: fee-demo
          name: integrator
          description: >-
            A string containing tracking information about the integrator of the
            API
          schema:
            type: string
          in: query
        - example: 0.02
          name: fee
          description: >-
            The percent of the integrator's fee that is taken from every
            transaction. 0.02 represents 2%. The maximum fee amount should be
            less than 100%.
          schema:
            maximum: 1
            exclusiveMaximum: true
            minimum: 0
            type: number
          in: query
        - name: referrer
          description: >-
            A string containing tracking information about the referrer of the
            integrator
          schema:
            type: string
          in: query
          required: false
        - example: hop,cbridge
          name: allowBridges
          description: >-
            List of bridges that are allowed for this transaction. Retrieve the
            current catalog from the `/v1/tools` endpoint. Also values `all`,
            `none`, `default` and `[]` are acceptable and mean all tools of the
            current type (`all`), no tools (for `none` and `[]` cases) and
            default tool's settings on the current stage.
          schema:
            type: array
            items:
              $ref: '#/components/schemas/QuoteBridgesEnum'
          in: query
        - name: allowExchanges
          description: >-
            List of exchanges that are allowed for this transaction. Retrieve
            the current catalog from the `/v1/tools` endpoint. Also values
            `all`, `none`, `default` and `[]` are acceptable and mean all tools
            of the current type (`all`), no tools (for `none` and `[]` cases)
            and default tool's settings on the current stage.
          schema:
            type: array
            items:
              $ref: '#/components/schemas/QuoteExchangesEnum'
          in: query
        - example: relay
          name: denyBridges
          description: >-
            List of bridges that are not allowed for this transaction. Retrieve
            the current catalog from the `/v1/tools` endpoint. Also values
            `all`, `none`, `default` and `[]` are acceptable and mean all tools
            of the current type (`all`), no tools (for `none` and `[]` cases)
            and default tool's settings on the current stage.
          schema:
            type: array
            items:
              $ref: '#/components/schemas/QuoteBridgesEnum'
          in: query
        - name: denyExchanges
          description: >-
            List of exchanges that are not allowed for this transaction.
            Retrieve the current catalog from the `/v1/tools` endpoint. Also
            values `all`, `none`, `default` and `[]` are acceptable and mean all
            tools of the current type (`all`), no tools (for `none` and `[]`
            cases) and default tool's settings on the current stage.
          schema:
            type: array
            items:
              $ref: '#/components/schemas/QuoteExchangesEnum'
          in: query
        - name: preferBridges
          description: >-
            List of bridges that should be preferred for this transaction.
            Retrieve the current catalog from the `/v1/tools` endpoint. Also
            values `all`, `none`, `default` and `[]` are acceptable and mean all
            tools of the current type (`all`), no tools (for `none` and `[]`
            cases) and default tool's settings on the current stage.
          schema:
            type: array
            items:
              $ref: '#/components/schemas/QuoteBridgesEnum'
          in: query
        - name: preferExchanges
          description: >-
            List of exchanges that should be preferred for this transaction.
            Retrieve the current catalog from the `/v1/tools` endpoint. Also
            values `all`, `none`, `default` and `[]` are acceptable and mean all
            tools of the current type (`all`), no tools (for `none` and `[]`
            cases) and default tool's settings on the current stage.
          schema:
            type: array
            items:
              $ref: '#/components/schemas/QuoteExchangesEnum'
          in: query
        - name: allowDestinationCall
          description: >-
            Whether swaps or other contract calls should be allowed as part of
            the destination transaction of a bridge transfer. Separate swap
            transactions on the destination chain are not affected by this flag.
            By default, parameter is `true`.
          schema:
            type: boolean
          in: query
        - name: maxPriceImpact
          description: >-
            The price impact threshold above which routes are hidden. As an
            example, one should specify 0.15 (15%) to hide routes with more than
            15% price impact. The default is 10%.
          schema:
            type: number
          in: query
        - name: swapStepTimingStrategies
          description: >-
            Timing setting to wait for a certain amount of swap rates. In the
            format
            `minWaitTime-${minWaitTimeMs}-${startingExpectedResults}-${reduceEveryMs}`.
            Please check [docs.li.fi](https://docs.li.fi) for more details.
          schema:
            type: array
            items:
              type: string
              example: minWaitTime-600-4-300
          in: query
          required: false
        - name: routeTimingStrategies
          description: >-
            Timing setting to wait for a certain amount of routes to be
            generated before chosing the best one. In the format
            `minWaitTime-${minWaitTimeMs}-${startingExpectedResults}-${reduceEveryMs}`.
            Please check [docs.li.fi](https://docs.li.fi) for more details.
          schema:
            type: array
            items:
              type: string
              example: minWaitTime-600-4-300
          in: query
          required: false
        - name: x-lifi-api-key
          description: >-
            Authentication header, register in the LI.FI Partner Portal
            (https://portal.li.fi/ ) to get your API Key.
          schema:
            type: string
          in: header
      responses:
        '200':
          $ref: '#/components/responses/StepResponse'
        '400':
          $ref: '#/components/responses/InvalidQuoteRequest'
        '404':
          $ref: '#/components/responses/QuoteNotFound'
components:
  schemas:
    QuoteBridgesEnum:
      type: string
      description: >-
        Bridge tool identifier or keyword. Retrieve current bridge keys from the
        `/v1/tools` endpoint. Supported keywords: `all`, `none`, `default`,
        `[]`.
    QuoteExchangesEnum:
      type: string
      description: >-
        Exchange tool identifier or keyword. Retrieve current exchange keys from
        the `/v1/tools` endpoint. Supported keywords: `all`, `none`, `default`,
        `[]`.
    Step:
      title: Root Type for Step
      description: Object that represents one step of a `Route`
      required:
        - id
        - action
        - tool
        - type
      type: object
      properties:
        id:
          description: Unique identifier of the step
          type: string
        type:
          description: >-
            The type of the step. `swap` executes a DEX swap on a single chain,
            `cross` bridges assets between chains, `lifi` runs LiFi's internal
            multi-action logic, and `protocol` represents protocol-level actions
            such as fee collection or vault interactions executed inside LiFi
            managed contracts.
          enum:
            - swap
            - cross
            - lifi
            - protocol
          type: string
        tool:
          description: The tool used for this step. E.g. `relay`
          type: string
        toolDetails:
          description: The details of the tool used for this step. E.g. `relay`
          type: object
          properties:
            key:
              description: The tool key
              type: string
            name:
              description: The tool name
              type: string
            logoURI:
              description: The tool logo URL
              type: string
        action:
          $ref: '#/components/schemas/Action'
          description: The action of the step
        estimate:
          $ref: '#/components/schemas/Estimate'
          description: The estimation for the step
        integrator:
          description: >-
            A string containing tracking information about the integrator of the
            API
          type: string
        includedSteps:
          type: array
          items:
            $ref: '#/components/schemas/IncludedStep'
        referrer:
          description: >-
            A string containing tracking information about the referrer of the
            integrator
          type: string
        execution:
          description: An objection containing status information about the execution
        transactionRequest:
          description: >-
            An ether.js TransactionRequest that can be triggered using a wallet
            provider.
            (https://docs.ethers.io/v5/api/providers/types/#providers-TransactionRequest)
      example:
        id: '0x48f0a2f93b0d0a9dab992d07c46bca38516c945101e8f8e08ca42af05b9e6aa9'
        type: cross
        tool: relay
        action:
          fromChainId: 100
          toChainId: 137
          fromToken:
            address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
            symbol: MIVA
            decimals: 18
            chainId: 100
            name: Minerva Wallet SuperToken
            coinKey: MIVA
            priceUSD: '0.04547537276751318'
            logoURI: ''
          toToken:
            address: '0xc0b2983a17573660053beeed6fdb1053107cf387'
            symbol: MIVA
            decimals: 18
            chainId: 137
            name: Minerva Wallet SuperToken
            coinKey: MIVA
            priceUSD: '0'
            logoURI: ''
          fromAmount: '1000000000000000000'
          slippage: 0.003
        estimate:
          fromAmount: '1000000000000000000'
          toAmount: '999500000000000000'
          toAmountMin: '999500000000000000'
          approvalAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
          feeCosts:
            - name: Gas Fee
              description: Covers gas expense for sending funds to user on receiving chain.
              percentage: '0'
              token:
                address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                symbol: MIVA
                decimals: 18
                chainId: 100
                name: Minerva Wallet SuperToken
                coinKey: MIVA
                priceUSD: '0.04547537276751318'
                logoURI: ''
              amount: '0'
              amountUSD: '0.00'
              included: true
            - name: Relay Fee
              description: Covers gas expense for claiming user funds on receiving chain.
              percentage: '0'
              token:
                address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                symbol: MIVA
                decimals: 18
                chainId: 100
                name: Minerva Wallet SuperToken
                coinKey: MIVA
                priceUSD: '0.04547537276751318'
                logoURI: ''
              amount: '0'
              amountUSD: '0.00'
              included: true
            - name: Router Fee
              description: Router service fee.
              percentage: '0.0005'
              token:
                address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                symbol: MIVA
                decimals: 18
                chainId: 100
                name: Minerva Wallet SuperToken
                coinKey: MIVA
                priceUSD: '0.04547537276751318'
                logoURI: ''
              amount: '500000000000000'
              amountUSD: '22737686383756.59'
              included: true
          gasCosts:
            - type: SEND
              price: '1.26'
              estimate: '140000'
              limit: '175000'
              amount: '176400'
              amountUSD: '0.00'
              token:
                address: '0x0000000000000000000000000000000000000000'
                symbol: xDai
                decimals: 18
                chainId: 100
                name: xDai
                coinKey: xDai
                priceUSD: '1'
                logoURI: >-
                  https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
          data:
            bid:
              user: '0x53F68B2186E4a4aB4dD976eD32de68db45BA360b'
              router: '0xeE2Ef40F688607CB23618d9312d62392786d13EB'
              initiator: '0x53F68B2186E4a4aB4dD976eD32de68db45BA360b'
              sendingChainId: 100
              sendingAssetId: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
              amount: '1000000000000000000'
              receivingChainId: 137
              receivingAssetId: '0xc0b2983a17573660053beeed6fdb1053107cf387'
              amountReceived: '999500000000000000'
              receivingAddress: '0x10fBFF9b9450D3A2d9d1612d6dE3726fACD8809E'
              transactionId: >-
                0x48f0a2f93b0d0a9dab992d07c46bca38516c945101e8f8e08ca42af05b9e6aa9
              expiry: 1643364189
              callDataHash: >-
                0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470
              callTo: '0x0000000000000000000000000000000000000000'
              encryptedCallData: 0x
              sendingChainTxManagerAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
              receivingChainTxManagerAddress: '0x6090De2EC76eb1Dc3B5d632734415c93c44Fd113'
              bidExpiry: 1643105290
            gasFeeInReceivingToken: '0'
            totalFee: '500000000000000'
            metaTxRelayerFee: '0'
            routerFee: '500000000000000'
        integrator: fee-demo
    UnavailableRoutes:
      type: object
      properties:
        filteredOut:
          description: >-
            An object containing information about routes that were
            intentionally filtered out.
          type: array
          items:
            properties:
              overallPath:
                description: The complete representation of the attempted route.
                type: string
                example: 100:USDC-hop-137:USDC-137:USDC~137:SUSHI
              reason:
                description: Out best attempt at describing the failure.
                type: string
        failed:
          description: An object containing information about failed routes.
          type: array
          items:
            properties:
              overallPath:
                description: The complete representation of the attempted route.
                type: string
                example: 100:USDC-hop-137:USDC-137:USDC~137:SUSHI
              subpaths:
                description: An object with all subpaths that generated one or more errors
                type: object
                additionalProperties:
                  $ref: '#/components/schemas/ToolError'
    Action:
      title: Root Type for Action
      description: Object describing what happens in a `Step`
      required:
        - fromToken
        - fromAmount
        - fromChainId
        - toChainId
        - toToken
      type: object
      properties:
        fromChainId:
          format: number
          description: The id of the chain where the transfer should start
          type: number
        fromAmount:
          description: The amount that should be transferred including all decimals
          type: string
        fromToken:
          $ref: '#/components/schemas/Token'
          description: The sending token
        toChainId:
          format: number
          description: The id of the chain where the transfer should end
          type: number
        toToken:
          $ref: '#/components/schemas/Token'
          description: The token that should be transferred to
        slippage:
          format: double
          description: The maximum allowed slippage
          type: number
        fromAddress:
          description: The sending wallet address
          type: string
        toAddress:
          description: The receiving wallet address
          type: string
      example:
        fromChainId: 100
        fromAmount: '1000000000000000000'
        fromToken:
          address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
          symbol: MIVA
          decimals: 18
          chainId: 100
          name: Minerva Wallet SuperToken
          coinKey: MIVA
          priceUSD: '0.0455272371751059'
          logoURI: ''
        toChainId: 137
        toToken:
          address: '0xc0b2983a17573660053beeed6fdb1053107cf387'
          symbol: MIVA
          decimals: 18
          chainId: 137
          name: Minerva Wallet SuperToken
          coinKey: MIVA
          priceUSD: '0'
          logoURI: ''
        slippage: 0.003
    Estimate:
      title: Root Type for Estimate
      description: An estimate for the current transfer
      required:
        - fromAmount
        - approvalAddress
        - toAmount
        - toAmountMin
        - tool
        - executionDuration
      type: object
      properties:
        tool:
          description: The tools that is being used for this step
          type: string
        fromAmount:
          description: The amount that should be transferred including all decimals
          type: string
        fromAmountUSD:
          description: The amount that should be transferred in USD equivalent
          type: string
        toAmount:
          description: >-
            The estimated resulting amount of the `toToken` including all
            decimals
          type: string
        toAmountMin:
          description: The minimal outcome of the transfer including all decimals
          type: string
        toAmountUSD:
          description: The estimated resulting amount of the `toToken` in USD equivalent
          type: string
        approvalAddress:
          description: The contract address for the approval
          type: string
        feeCosts:
          description: Fees included in the transfer
          type: array
          items:
            $ref: '#/components/schemas/FeeCost'
        gasCosts:
          description: Gas costs included in the transfer
          type: array
          items:
            $ref: '#/components/schemas/GasCost'
        executionDuration:
          description: The time needed to complete the following step
          type: number
        data:
          description: Arbitrary data that depends on the the used tool
          type: object
          properties:
            bid:
              type: object
              properties:
                user:
                  type: string
                router:
                  type: string
                initiator:
                  type: string
                sendingChainId:
                  format: number
                  type: number
                sendingAssetId:
                  type: string
                amount:
                  type: string
                receivingChainId:
                  format: number
                  type: number
                receivingAssetId:
                  type: string
                amountReceived:
                  type: string
                receivingAddress:
                  type: string
                transactionId:
                  type: string
                expiry:
                  format: number
                  type: number
                callDataHash:
                  type: string
                callTo:
                  type: string
                encryptedCallData:
                  type: string
                sendingChainTxManagerAddress:
                  type: string
                receivingChainTxManagerAddress:
                  type: string
                bidExpiry:
                  format: number
                  type: number
            bidSignature:
              type: string
            gasFeeInReceivingToken:
              type: string
            totalFee:
              type: string
            metaTxRelayerFee:
              type: string
            routerFee:
              type: string
      example:
        fromAmount: '1000000000000000000'
        toAmount: '999500000000000000'
        toAmountMin: '999500000000000000'
        tool: allbridge
        executionDuration: 60
        approvalAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
        feeCosts:
          - name: Gas Fee
            description: Covers gas expense for sending funds to user on receiving chain.
            percentage: '0'
            token:
              address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
              symbol: MIVA
              decimals: 18
              chainId: 100
              name: Minerva Wallet SuperToken
              coinKey: MIVA
              priceUSD: '0.0455272371751059'
              logoURI: ''
            amount: '0'
            amountUSD: '0.00'
            included: true
          - name: Relay Fee
            description: Covers gas expense for claiming user funds on receiving chain.
            percentage: '0'
            token:
              address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
              symbol: MIVA
              decimals: 18
              chainId: 100
              name: Minerva Wallet SuperToken
              coinKey: MIVA
              priceUSD: '0.0455272371751059'
              logoURI: ''
            amount: '0'
            amountUSD: '0.00'
            included: true
          - name: Router Fee
            description: Router service fee.
            percentage: '0.0005'
            token:
              address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
              symbol: MIVA
              decimals: 18
              chainId: 100
              name: Minerva Wallet SuperToken
              coinKey: MIVA
              priceUSD: '0.0455272371751059'
              logoURI: ''
            amount: '500000000000000'
            amountUSD: '22763618587552.95'
            included: true
        gasCosts:
          - type: SEND
            price: '1.22'
            estimate: '140000'
            limit: '175000'
            amount: '170800'
            amountUSD: '0.00'
            token:
              address: '0x0000000000000000000000000000000000000000'
              symbol: xDai
              decimals: 18
              chainId: 100
              name: xDai
              coinKey: xDai
              priceUSD: '1'
              logoURI: >-
                https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
        data:
          bid:
            user: '0x10fBFF9b9450D3A2d9d1612d6dE3726fACD8809E'
            router: '0xeE2Ef40F688607CB23618d9312d62392786d13EB'
            initiator: '0x10fBFF9b9450D3A2d9d1612d6dE3726fACD8809E'
            sendingChainId: 100
            sendingAssetId: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
            amount: '1000000000000000000'
            receivingChainId: 137
            receivingAssetId: '0xc0b2983a17573660053beeed6fdb1053107cf387'
            amountReceived: '999500000000000000'
            receivingAddress: '0x10fBFF9b9450D3A2d9d1612d6dE3726fACD8809E'
            transactionId: '0x9f54c1764e19367c44706f4a6253941b81e9ec524af5590091aa8ae67e7644ed'
            expiry: 1643369368
            callDataHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
            callTo: '0x0000000000000000000000000000000000000000'
            encryptedCallData: 0x
            sendingChainTxManagerAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
            receivingChainTxManagerAddress: '0x6090De2EC76eb1Dc3B5d632734415c93c44Fd113'
            bidExpiry: 1643110469
          gasFeeInReceivingToken: '0'
          totalFee: '500000000000000'
          metaTxRelayerFee: '0'
          routerFee: '500000000000000'
    IncludedStep:
      title: Root Type for Internal Step
      description: Object that represents one step of an `IncludedSteps` array in `Route`
      required:
        - id
        - action
        - estimate
        - tool
        - type
        - toolDetails
      type: object
      properties:
        id:
          description: Unique identifier of the step
          type: string
        type:
          description: >-
            The type of the step. `swap` executes a DEX swap on a single chain,
            `cross` bridges assets between chains, `lifi` runs LiFi's internal
            multi-action logic, and `protocol` represents protocol-level actions
            such as fee collection or vault interactions executed inside LiFi
            managed contracts.
          enum:
            - swap
            - cross
            - lifi
            - protocol
          type: string
        tool:
          description: The tool used for this step. E.g. `allbridge`
          type: string
        toolDetails:
          description: The details of the tool used for this step. E.g. `allbridge`
          type: object
          properties:
            key:
              description: The tool key
              type: string
            name:
              description: The tool name
              type: string
            logoURI:
              description: The tool logo URL
              type: string
        action:
          $ref: '#/components/schemas/Action'
        estimate:
          $ref: '#/components/schemas/Estimate'
    ToolError:
      title: An error returned by a tool (Exchange or Bridge)
      description: Describes why a certain operation (like a quote request) failed.
      type: object
      properties:
        errorType:
          description: The type of error that occurred.
          enum:
            - NO_QUOTE
          type: string
        code:
          description: The error code.
          enum:
            - NO_POSSIBLE_ROUTE
            - INSUFFICIENT_LIQUIDITY
            - TOOL_TIMEOUT
            - UNKNOWN_ERROR
            - RPC_ERROR
            - AMOUNT_TOO_LOW
            - AMOUNT_TOO_HIGH
            - FEES_HIGHER_THAN_AMOUNT
            - DIFFERENT_RECIPIENT_NOT_SUPPORTED
            - TOOL_SPECIFIC_ERROR
            - CANNOT_GUARANTEE_MIN_AMOUNT
            - RATE_LIMIT_EXCEEDED
          type: string
        action:
          $ref: '#/components/schemas/Action'
        tool:
          description: The tool that emitted the error.
          type: string
        message:
          description: A human-readable message describing the error.
          type: string
    Token:
      title: Root Type for Token
      description: Representation of a Token
      required:
        - address
        - chainId
        - decimals
        - name
        - symbol
      type: object
      properties:
        address:
          description: Address of the token
          type: string
        decimals:
          format: number
          description: Number of decimals the token uses
          type: number
        symbol:
          description: Symbol of the token
          type: string
        chainId:
          format: number
          description: Id of the token's chain
          type: number
        coinKey:
          description: Identifier for the token
          type: string
        name:
          description: Name of the token
          type: string
        logoURI:
          description: Logo of the token
          type: string
        priceUSD:
          description: Token price in USD
          type: string
      example:
        address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
        symbol: DAI
        decimals: 18
        chainId: 137
        name: (PoS) Dai Stablecoin
        coinKey: DAI
        priceUSD: '1'
        logoURI: >-
          https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/549c4205dbb199f1b8b03af783f35e71.png
    FeeCost:
      title: Root Type for FeeCost
      description: Fees included in the transfer
      required:
        - token
        - percentage
        - name
        - amountUSD
        - included
      type: object
      properties:
        name:
          description: Name of the fee
          type: string
        description:
          description: Description of the fee costs
          type: string
        percentage:
          description: Percentage of how much fees are taken
          type: string
        token:
          $ref: '#/components/schemas/Token'
          description: The `Token` in which the fees are taken
        amount:
          description: The amount of fees
          type: string
        amountUSD:
          description: The amount of fees in USD
          type: string
        included:
          description: Whether fee is included into transfer's `fromAmount`
          type: boolean
      example:
        name: Gas Fee
        description: Covers gas expense for sending funds to user on receiving chain.
        percentage: '0'
        token:
          address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
          symbol: MIVA
          decimals: 18
          chainId: 100
          name: Minerva Wallet SuperToken
          coinKey: MIVA
          priceUSD: '0.0455272371751059'
          logoURI: ''
        amount: '0'
        amountUSD: '0.00'
    GasCost:
      title: Root Type for GasCost
      description: Gas costs included in the transfer
      required:
        - token
        - type
        - amount
      type: object
      properties:
        type:
          description: Can be one of `SUM`, `APPROVE` or `SEND`
          type: string
        price:
          description: Suggested current standard price for the chain
          type: string
        estimate:
          description: Estimation how much gas will be needed
          type: string
        limit:
          description: Suggested gas limit
          type: string
        amount:
          description: Amount of the gas cost
          type: string
        amountUSD:
          description: Amount of the gas cost in USD
          type: string
        token:
          $ref: '#/components/schemas/Token'
          description: The used gas token
      example:
        type: SEND
        price: '1.22'
        estimate: '140000'
        limit: '175000'
        amount: '170800'
        amountUSD: '0.00'
        token:
          address: '0x0000000000000000000000000000000000000000'
          symbol: xDai
          decimals: 18
          chainId: 100
          name: xDai
          coinKey: xDai
          priceUSD: '1'
          logoURI: >-
            https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
  responses:
    StepResponse:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Step'
          examples:
            StepResponseExample:
              value:
                id: a8dc011a-f52d-4492-9e99-21de64b5453a
                type: lifi
                tool: 1inch
                toolDetails:
                  key: 1inch
                  logoURI: >-
                    https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/oneinch.svg
                  name: 1inch
                action:
                  fromChainId: 100
                  toChainId: 100
                  fromToken:
                    address: '0x0000000000000000000000000000000000000000'
                    symbol: xDai
                    decimals: 18
                    chainId: 100
                    name: xDai
                    coinKey: xDai
                    priceUSD: '1'
                    logoURI: >-
                      https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
                  toToken:
                    name: Minerva Wallet SuperToken
                    symbol: MIVA
                    coinKey: MIVA
                    decimals: 18
                    chainId: 100
                    logoURI: https://minerva.digital/i/MIVA-Token_200x200.png
                    address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                  fromAmount: '1000000000000000000'
                  slippage: 0.003
                  fromAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
                  toAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
                estimate:
                  fromAmount: '1000000000000000000'
                  toAmount: '21922914496086353975'
                  toAmountMin: '21265227061203763356'
                  approvalAddress: '0x1111111254fb6c44bac0bed2854e76f90643097d'
                  feeCosts: []
                  gasCosts:
                    - type: SEND
                      price: '1'
                      estimate: '252364'
                      limit: '315455'
                      amount: '252364'
                      amountUSD: '0.00'
                      token:
                        address: '0x0000000000000000000000000000000000000000'
                        symbol: xDai
                        decimals: 18
                        chainId: 100
                        name: xDai
                        coinKey: xDai
                        priceUSD: '1'
                        logoURI: >-
                          https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
                  data:
                    fromToken:
                      name: xDAI
                      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                      symbol: xDAI
                      decimals: 18
                      logoURI: >-
                        https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png
                    toToken:
                      name: Minerva Wallet SuperToken
                      address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                      symbol: MIVA
                      decimals: 18
                      logoURI: https://minerva.digital/i/MIVA-Token_200x200.png
                    toTokenAmount: '21922914496086353975'
                    fromTokenAmount: '1000000000000000000'
                    protocols:
                      - - - name: GNOSIS_HONEYSWAP
                            part: 100
                            fromTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                            toTokenAddress: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                    estimatedGas: 252364
                integrator: fee-demo
                transactionRequest:
                  from: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
                  to: '0x1111111254fb6c44bac0bed2854e76f90643097d'
                  chainId: 100
                  data: 0x...
                  value: '0x0de0b6b3a7640000'
                  gasPrice: '0xb2d05e00'
                  gasLimit: '0x0e9cb2'
                includedSteps:
                  - id: a8dc011a-f52d-4492-9e99-21de64b5453a
                    type: swap
                    tool: 1inch
                    toolDetails:
                      key: 1inch
                      logoURI: >-
                        https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/oneinch.svg
                      name: 1inch
                    action:
                      fromChainId: 100
                      toChainId: 100
                      fromToken:
                        address: '0x0000000000000000000000000000000000000000'
                        symbol: xDai
                        decimals: 18
                        chainId: 100
                        name: xDai
                        coinKey: xDai
                        priceUSD: '1'
                        logoURI: >-
                          https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
                      toToken:
                        name: Minerva Wallet SuperToken
                        symbol: MIVA
                        coinKey: MIVA
                        decimals: 18
                        chainId: 100
                        logoURI: https://minerva.digital/i/MIVA-Token_200x200.png
                        address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                      fromAmount: '1000000000000000000'
                      slippage: 0.003
                      fromAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
                      toAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
                    estimate:
                      fromAmount: '1000000000000000000'
                      toAmount: '21922914496086353975'
                      toAmountMin: '21265227061203763356'
                      approvalAddress: '0x1111111254fb6c44bac0bed2854e76f90643097d'
                      feeCosts: []
                      gasCosts:
                        - type: SEND
                          price: '1'
                          estimate: '252364'
                          limit: '315455'
                          amount: '252364'
                          amountUSD: '0.00'
                          token:
                            address: '0x0000000000000000000000000000000000000000'
                            symbol: xDai
                            decimals: 18
                            chainId: 100
                            name: xDai
                            coinKey: xDai
                            priceUSD: '1'
                            logoURI: >-
                              https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
                      data:
                        fromToken:
                          name: xDAI
                          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                          symbol: xDAI
                          decimals: 18
                          logoURI: >-
                            https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png
                        toToken:
                          name: Minerva Wallet SuperToken
                          address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                          symbol: MIVA
                          decimals: 18
                          logoURI: https://minerva.digital/i/MIVA-Token_200x200.png
                        toTokenAmount: '21922914496086353975'
                        fromTokenAmount: '1000000000000000000'
                        protocols:
                          - - - name: GNOSIS_HONEYSWAP
                                part: 100
                                fromTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                                toTokenAddress: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                        estimatedGas: 252364
      description: The step populated with the transaction data
    InvalidQuoteRequest:
      description: Invalid quote request
    QuoteNotFound:
      content:
        application/json:
          schema:
            type: object
            properties:
              message:
                description: The error message
                type: string
                example: Unable to find a quote for the requested transfer
              errors:
                type: object
                items:
                  $ref: '#/components/schemas/UnavailableRoutes'
      description: Unable to find a quote for the requested transfer.

````

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Perform multiple contract calls across blockchains (BETA)

> This endpoint can be used to bridge tokens, swap them and perform a number or arbitrary contract calls on the destination chain. You can find an example of it [here](https://github.com/lifinance/sdk/tree/main/examples).
This functionality is currently in beta. While we've worked hard to ensure its stability and functionality, there might still be some rough edges.



## OpenAPI

````yaml post /v1/quote/contractCalls
openapi: 3.0.2
info:
  title: LI.FI API
  version: 1.0.0
  description: >-
    LI.FI provides the best cross-chain swap across all liquidity pools and
    bridges.
servers:
  - url: https://li.quest
    description: LI.FI Production Environment
  - url: https://staging.li.quest
    description: LI.FI Staging Environment
security: []
paths:
  /v1/quote/contractCalls:
    post:
      summary: Perform multiple contract calls across blockchains (BETA)
      description: >-
        This endpoint can be used to bridge tokens, swap them and perform a
        number or arbitrary contract calls on the destination chain. You can
        find an example of it
        [here](https://github.com/lifinance/sdk/tree/main/examples).

        This functionality is currently in beta. While we've worked hard to
        ensure its stability and functionality, there might still be some rough
        edges.
      parameters:
        - name: x-lifi-api-key
          description: The apiKey allows you to authenticate on the API.
          schema:
            type: string
          in: header
      requestBody:
        description: >-
          Object describing what tokens to transfer and how to interact with the
          destination contracts.
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ContractCallsRequest'
            example:
              fromChain: 10
              fromToken: '0x4200000000000000000000000000000000000042'
              fromAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
              toChain: 1
              toToken: ETH
              toAmount: '100000000000001'
              contractCalls:
                - fromAmount: '100000000000001'
                  fromTokenAddress: '0x0000000000000000000000000000000000000000'
                  toTokenAddress: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84'
                  toContractAddress: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84'
                  toContractCallData: 0x
                  toContractGasLimit: '110000'
                - fromAmount: '100000000000000'
                  fromTokenAddress: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84'
                  toTokenAddress: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0'
                  toContractAddress: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0'
                  toFallbackAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
                  toContractCallData: >-
                    0xea598cb000000000000000000000000000000000000000000000000000005af3107a4000
                  toContractGasLimit: '100000'
              integrator: muc-hackaton-postman
      responses:
        '200':
          $ref: '#/components/responses/ToolsResponse'
components:
  schemas:
    ContractCallsRequest:
      title: Root type for ContractCallsRequest
      description: >-
        Object defining instructions on how to perform multiple
        cross-chain/same-chain calls
      required:
        - fromChain
        - fromToken
        - fromAddress
        - toChain
        - toToken
        - toAmount
        - contractCalls
      type: object
      properties:
        fromChain:
          description: The sending chain. Can be the chain id or chain key
          type: number
        fromToken:
          description: >-
            The token that should be transferred. Can be the address or the
            symbol
          type: string
        fromAddress:
          description: >-
            The wallet that will send the transaction and contains the starting
            token
          type: string
        toChain:
          description: The receiving chain. Can be the chain id or chain key
          type: number
        toToken:
          description: >-
            The token required to perform the contract interation (can be
            something to stake, donate or to be used as payment)
          type: string
        toAmount:
          description: >-
            The amount of token required by the contract interaction. The LI.FI
            API will try and generate a quote that guarantees at least that
            amount on the destination chain.
          type: string
        contractCalls:
          type: array
          items:
            $ref: '#/components/schemas/ContractCall'
        toFallbackAddress:
          description: >-
            If the call fails, use this address to send the bridged tokens to.
            If none is specified, the sending address will be used.
          type: string
        contractOutputsToken:
          description: >-
            Some contract interactions will output a token. This is the case in
            things like staking. Omit this parameter if no token should be
            returned to the user.
          type: string
        slippage:
          format: double
          description: >-
            The maximum allowed slippage for the transaction as a decimal value.
            0.005 represents 0.5%.
          maximum: 1
          minimum: 0
          type: number
        integrator:
          description: >-
            A string containing tracking information about the integrator of the
            API
          type: string
        referrer:
          description: >-
            A string containing tracking information about the referrer of the
            integrator
          type: string
        allowBridges:
          description: >-
            List of bridges that are allowed for this transaction. Retrieve the
            current catalog from the `/v1/tools` endpoint.
          type: array
          items:
            type: string
        denyBridges:
          description: >-
            List of bridges that are not allowed for this transaction. Retrieve
            the current catalog from the `/v1/tools` endpoint.
          type: array
          items:
            type: string
        preferBridges:
          description: >-
            List of bridges that should be preferred for this transaction.
            Retrieve the current catalog from the `/v1/tools` endpoint.
          type: array
          items:
            type: string
        allowExchanges:
          description: >-
            List of exchanges that are allowed for this transaction. Retrieve
            the current catalog from the `/v1/tools` endpoint.
          type: array
          items:
            type: string
        denyExchanges:
          description: >-
            List of exchanges that are not allowed for this transaction.
            Retrieve the current catalog from the `/v1/tools` endpoint.
          type: array
          items:
            type: string
        preferExchanges:
          description: >-
            List of exchanges that should be preferred for this transaction.
            Retrieve the current catalog from the `/v1/tools` endpoint.
          type: array
          items:
            type: string
        allowDestinationCall:
          description: >-
            Whether swaps or other contract calls should be allowed as part of
            the destination transaction of a bridge transfer. Separate swap
            transactions on the destination chain are not affected by this flag.
            By default, parameter is `true`.
          type: boolean
        fee:
          format: double
          description: >-
            The percent of the integrator's fee that is taken from every
            transaction. The maximum fee amount should be less than 100%.
          maximum: 1
          exclusiveMaximum: true
          minimum: 0
          type: number
    ContractCall:
      title: Root Type for ContractCall
      description: Object defining a single arbitrary contract call
      required:
        - fromAmount
        - fromTokenAddress
        - toContractAddress
        - toContractCallData
        - toContractGasLimit
      type: object
      properties:
        fromAmount:
          description: >-
            The amount that will feed into this contract call. This is not
            dependent on how much was bridged or deposited before - it's the
            *expected* amount of token available on order to execute the call.
          type: string
        fromTokenAddress:
          description: >-
            The token that will feed into this contract call. E.g. a ETH staking
            transaction would expect to have ETH available.
          type: string
        toContractAddress:
          description: The address of the contract to interact with.
          type: string
        toContractCallData:
          description: >-
            The calldata to be sent to the contract for the interaction on the
            destination chain.
          type: string
        toContractGasLimit:
          description: >-
            The estimated gas used by the destination call. If this value is
            incorrect, the interaction may fail -- choose this carefully!
          type: string
        toApprovalAddress:
          description: >-
            If the approval address is different thant the contract to call,
            specify that address here
          type: string
        toTokenAddress:
          description: >-
            If the contract outputs a token, specify its address here. (E.g.
            staking ETH produces stETH)
          type: string
    Tools:
      type: object
      properties:
        exchanges:
          type: array
          items:
            $ref: '#/components/schemas/Exchange'
        bridges:
          type: array
          items:
            $ref: '#/components/schemas/Bridge'
    Exchange:
      type: object
      properties:
        key:
          $ref: '#/components/schemas/ExchangesEnum'
        name:
          description: The common name of the tool
          type: string
          example: 0x
        logoURI:
          description: The logo of the tool
          type: string
          example: >-
            https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/zerox.svg
        supportedChains:
          description: The chains which are supported on this exchange
          type: string
          example:
            - '1'
            - '137'
            - '56'
    Bridge:
      type: object
      properties:
        key:
          $ref: '#/components/schemas/BridgesEnum'
        name:
          description: The common name of the tool
          type: string
          example: Connext
        logoURI:
          description: The logo of the tool
          type: string
          example: >-
            https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/bridges/relay.svg
        supportedChains:
          type: array
          items:
            $ref: '#/components/schemas/SupportedChains'
    ExchangesEnum:
      type: string
      description: >-
        Identifier for an exchange tool. Retrieve the latest exchange keys from
        the `/v1/tools` endpoint. Keywords such as `all`, `none`, `default`, and
        `[]` are also supported where applicable.
    BridgesEnum:
      type: string
      description: >-
        Identifier for a bridge tool. Retrieve the latest bridge keys from the
        `/v1/tools` endpoint. Keywords such as `all`, `none`, `default`, and
        `[]` are also supported where applicable.
    SupportedChains:
      type: object
      properties:
        fromChainId:
          description: Supported `from` chain
          type: string
          example: 137
        toChainId:
          description: Supported `to` chain
          type: string
          example: 1
  responses:
    ToolsResponse:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Tools'
      description: Object listing all the currently enabled bridges and exchanges.

````

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Get a set of routes for a request that describes a transfer of tokens

> In order to execute any transfer, you must first request possible `Routes`. From the result set a `Route` can be selected and executed by retrieving the transaction for every included `Step` using the `/steps/transaction` endpoint.
**Attention**: This request is more complex and intended to be used via our [JavaScript SDK](https://docs.li.fi/integrate-li.fi-js-sdk/install-li.fi-sdk).



## OpenAPI

````yaml post /v1/advanced/routes
openapi: 3.0.2
info:
  title: LI.FI API
  version: 1.0.0
  description: >-
    LI.FI provides the best cross-chain swap across all liquidity pools and
    bridges.
servers:
  - url: https://li.quest
    description: LI.FI Production Environment
  - url: https://staging.li.quest
    description: LI.FI Staging Environment
security: []
paths:
  /v1/advanced/routes:
    post:
      tags:
        - advanced
      summary: Get a set of routes for a request that describes a transfer of tokens
      description: >-
        In order to execute any transfer, you must first request possible
        `Routes`. From the result set a `Route` can be selected and executed by
        retrieving the transaction for every included `Step` using the
        `/steps/transaction` endpoint.

        **Attention**: This request is more complex and intended to be used via
        our [JavaScript
        SDK](https://docs.li.fi/integrate-li.fi-js-sdk/install-li.fi-sdk).
      parameters:
        - name: x-lifi-api-key
          description: >-
            Authentication header, register in the LI.FI Partner Portal
            (https://portal.li.fi/ ) to get your API Key.
          schema:
            type: string
          in: header
      requestBody:
        description: >-
          The request object describes a desired any-to-any transfer and
          contains all information necessary to calculate the most efficient
          routes.
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RoutesRequest'
            examples:
              RoutesRequestExample:
                value:
                  fromChainId: 100
                  fromAmount: '1000000000000000000'
                  fromTokenAddress: '0x0000000000000000000000000000000000000000'
                  toChainId: 137
                  toTokenAddress: '0x0000000000000000000000000000000000000000'
                  options:
                    integrator: fee-demo
                    referrer: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
                    slippage: 0.003
                    fee: 0.02
                    bridges:
                      allow:
                        - relay
                    exchanges:
                      allow:
                        - 1inch
                        - openocean
                    allowSwitchChain: true
                    order: CHEAPEST
                    maxPriceImpact: 0.1
        required: true
      responses:
        '200':
          $ref: '#/components/responses/RoutesResponse'
        '400':
          $ref: '#/components/responses/InvalidRoutesRequest'
        '404':
          $ref: '#/components/responses/InvalidRoutesNotFoundRequest'
components:
  schemas:
    RoutesRequest:
      title: Root Type for RoutesRequest
      description: A description of a token transfer
      required:
        - fromAmount
        - fromChainId
        - fromTokenAddress
        - toChainId
        - toTokenAddress
      type: object
      properties:
        fromChainId:
          format: number
          description: The sending chain id
          type: number
        fromAmount:
          description: >-
            The amount that should be transferred including all decimals (e.g.
            1000000 for 1 USDC (6 decimals))
          type: string
        fromTokenAddress:
          description: The address of the sending `Token`
          type: string
        toChainId:
          format: number
          description: The id of the receiving chain
          type: number
        toTokenAddress:
          description: The address of the receiving `Token`
          type: string
        options:
          $ref: '#/components/schemas/RouteOptions'
          description: Optional configuration for the routes
        fromAddress:
          description: The sending wallet address
          type: string
        toAddress:
          description: The receiving wallet address
          type: string
        fromAmountForGas:
          description: The amount of the token to convert to gas on the destination side.
          type: string
      example:
        fromAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
        fromChainId: 100
        fromAmount: '1000000000000000000'
        fromTokenAddress: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
        toChainId: 137
        toTokenAddress: '0xc0b2983a17573660053beeed6fdb1053107cf387'
        options:
          integrator: fee-demo
          slippage: 0.003
          fee: 0.02
          bridges:
            allow:
              - relay
          exchanges:
            allow:
              - 1inch
              - openocean
    RouteOptions:
      title: Root Type for RouteOptions
      description: Optional settings for the route
      type: object
      properties:
        insurance:
          deprecated: true
          description: >-
            Facilitates transfer insurance via insurace.io, ensuring secure and
            insured transfer of assets.
          type: boolean
        integrator:
          description: Custom string the developer who integrates LiFi can set
          type: string
        slippage:
          format: double
          description: The maximum allowed slippage
          type: number
        bridges:
          $ref: '#/components/schemas/AllowDenyPrefer'
          description: >-
            Object configuring the bridges that should or should not be taken
            into consideration for the possibilities
          properties:
            allow:
              default:
                - all
              type: array
              items:
                type: string
            deny:
              type: array
              items:
                type: string
            prefer:
              type: array
              items:
                type: string
        exchanges:
          $ref: '#/components/schemas/AllowDenyPrefer'
          description: >-
            Object configuring the exchanges that should or should not be taken
            into consideration for the possibilities
          properties:
            allow:
              default:
                - all
              type: array
              items:
                type: string
            deny:
              type: array
              items:
                type: string
            prefer:
              type: array
              items:
                type: string
        order:
          description: The way the resulting routes should be ordered
          enum:
            - FASTEST
            - CHEAPEST
          type: string
        allowSwitchChain:
          description: Whether chain switches should be allowed in the routes
          default: false
          type: boolean
        allowDestinationCall:
          description: >-
            Defines if we should return routes with a cross-chain bridge
            protocol (Connext, etc.) destination calls or not.
          default: true
          type: boolean
        referrer:
          description: Integrators can set a wallet address as referrer to track them
          type: string
        fee:
          format: double
          description: >-
            The percent of the integrator's fee that is taken from every
            transaction. The maximum fee amount should be less than 100%.
          maximum: 1
          exclusiveMaximum: true
          minimum: 0
          type: number
        maxPriceImpact:
          format: double
          description: >-
            The price impact threshold above which routes are hidden. As an
            example, one should specify 0.15 (15%) to hide routes with more than
            15% price impact. The default is 10%.
          type: number
        timing:
          type: object
          properties:
            swapStepTimingStrategies:
              description: >-
                Timing setting to wait for a certain amount of swap rates.
                Please check [docs.li.fi](https://docs.li.fi) for more details.
              type: array
              items:
                type: object
                properties:
                  strategy:
                    enum:
                      - minWaitTime
                  minWaitTimeMs:
                    maximum: 15000
                    minimum: 0
                    type: number
                  startingExpectedResults:
                    type: number
                    minimum: 0
                    maximum: 100
                  reduceEveryMs:
                    maximum: 15000
                    minimum: 0
                    type: number
            routeTimingStrategies:
              description: >-
                Timing setting to wait for a certain amount of routes to be
                generated before chosing the best one. Please check
                [docs.li.fi](https://docs.li.fi) for more details.
              type: array
              items:
                type: object
                properties:
                  strategy:
                    enum:
                      - minWaitTime
                  minWaitTimeMs:
                    maximum: 15000
                    minimum: 0
                    type: number
                  startingExpectedResults:
                    type: number
                    minimum: 0
                    maximum: 100
                  reduceEveryMs:
                    maximum: 15000
                    minimum: 0
                    type: number
      example:
        integrator: fee-demo
        slippage: 0.003
        fee: 0.02
        bridges:
          allow:
            - relay
        exchanges:
          allow:
            - 1inch
            - openocean
        maxPriceImpact: 0.1
    RoutesResponse:
      title: Root Type for RoutesResponse
      description: >-
        A list of routes that can be used to realize the described transfer of
        tokens
      required:
        - routes
      type: object
      properties:
        routes:
          description: List of possible `Routes` for the given transfer
          type: array
          items:
            $ref: '#/components/schemas/Route'
        unavailableRoutes:
          description: >-
            An object representing the routes that are unavailable for the given
            transfer
          type: array
          items:
            $ref: '#/components/schemas/UnavailableRoutes'
      example:
        routes:
          - id: '0x1e21fad9c26fff48b67ae2925f878e43bf81211da8b1cd9b7faa8bfd8d7ea9d9'
            fromChainId: 100
            fromAmountUSD: '0.05'
            fromAmount: '1000000000000000000'
            fromToken:
              address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
              symbol: MIVA
              decimals: 18
              chainId: 100
              name: Minerva Wallet SuperToken
              coinKey: MIVA
              priceUSD: '0.04547537276751318'
              logoURI: ''
            toChainId: 137
            toAmountUSD: '0.00'
            toAmount: '999500000000000000'
            toAmountMin: '999500000000000000'
            toToken:
              address: '0xc0b2983a17573660053beeed6fdb1053107cf387'
              symbol: MIVA
              decimals: 18
              chainId: 137
              name: Minerva Wallet SuperToken
              coinKey: MIVA
              priceUSD: '0'
              logoURI: ''
            gasCostUSD: '0.00'
            steps:
              - id: >-
                  0x48f0a2f93b0d0a9dab992d07c46bca38516c945101e8f8e08ca42af05b9e6aa9
                type: cross
                tool: relay
                action:
                  fromChainId: 100
                  toChainId: 137
                  fromToken:
                    address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                    symbol: MIVA
                    decimals: 18
                    chainId: 100
                    name: Minerva Wallet SuperToken
                    coinKey: MIVA
                    priceUSD: '0.04547537276751318'
                    logoURI: ''
                  toToken:
                    address: '0xc0b2983a17573660053beeed6fdb1053107cf387'
                    symbol: MIVA
                    decimals: 18
                    chainId: 137
                    name: Minerva Wallet SuperToken
                    coinKey: MIVA
                    priceUSD: '0'
                    logoURI: ''
                  fromAmount: '1000000000000000000'
                  slippage: 0.003
                estimate:
                  fromAmount: '1000000000000000000'
                  toAmount: '999500000000000000'
                  toAmountMin: '999500000000000000'
                  approvalAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
                  feeCosts:
                    - name: Gas Fee
                      description: >-
                        Covers gas expense for sending funds to user on
                        receiving chain.
                      percentage: '0'
                      token:
                        address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                        symbol: MIVA
                        decimals: 18
                        chainId: 100
                        name: Minerva Wallet SuperToken
                        coinKey: MIVA
                        priceUSD: '0.04547537276751318'
                        logoURI: ''
                      amount: '0'
                      amountUSD: '0.00'
                      included: true
                    - name: Relay Fee
                      description: >-
                        Covers gas expense for claiming user funds on receiving
                        chain.
                      percentage: '0'
                      token:
                        address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                        symbol: MIVA
                        decimals: 18
                        chainId: 100
                        name: Minerva Wallet SuperToken
                        coinKey: MIVA
                        priceUSD: '0.04547537276751318'
                        logoURI: ''
                      amount: '0'
                      amountUSD: '0.00'
                    - name: Router Fee
                      description: Router service fee.
                      percentage: '0.0005'
                      token:
                        address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                        symbol: MIVA
                        decimals: 18
                        chainId: 100
                        name: Minerva Wallet SuperToken
                        coinKey: MIVA
                        priceUSD: '0.04547537276751318'
                        logoURI: ''
                      amount: '500000000000000'
                      amountUSD: '22737686383756.59'
                  gasCosts:
                    - type: SEND
                      price: '1.26'
                      estimate: '140000'
                      limit: '175000'
                      amount: '176400'
                      amountUSD: '0.00'
                      token:
                        address: '0x0000000000000000000000000000000000000000'
                        symbol: xDai
                        decimals: 18
                        chainId: 100
                        name: xDai
                        coinKey: xDai
                        priceUSD: '1'
                        logoURI: >-
                          https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
                  data:
                    bid:
                      user: '0x53F68B2186E4a4aB4dD976eD32de68db45BA360b'
                      router: '0xeE2Ef40F688607CB23618d9312d62392786d13EB'
                      initiator: '0x53F68B2186E4a4aB4dD976eD32de68db45BA360b'
                      sendingChainId: 100
                      sendingAssetId: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                      amount: '1000000000000000000'
                      receivingChainId: 137
                      receivingAssetId: '0xc0b2983a17573660053beeed6fdb1053107cf387'
                      amountReceived: '999500000000000000'
                      receivingAddress: '0x10fBFF9b9450D3A2d9d1612d6dE3726fACD8809E'
                      transactionId: >-
                        0x48f0a2f93b0d0a9dab992d07c46bca38516c945101e8f8e08ca42af05b9e6aa9
                      expiry: 1643364189
                      callDataHash: >-
                        0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470
                      callTo: '0x0000000000000000000000000000000000000000'
                      encryptedCallData: 0x
                      sendingChainTxManagerAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
                      receivingChainTxManagerAddress: '0x6090De2EC76eb1Dc3B5d632734415c93c44Fd113'
                      bidExpiry: 1643105290
                    gasFeeInReceivingToken: '0'
                    totalFee: '500000000000000'
                    metaTxRelayerFee: '0'
                    routerFee: '500000000000000'
                integrator: fee-demo
          - id: '0xb785f52e68f8a6fb147d5e392e06f122c1a418be84bdc28de0f311b91fa5e57e'
            fromChainId: 100
            fromAmountUSD: '0.05'
            fromAmount: '1000000000000000000'
            fromToken:
              address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
              symbol: MIVA
              decimals: 18
              chainId: 100
              name: Minerva Wallet SuperToken
              coinKey: MIVA
              priceUSD: '0.04547537276751318'
              logoURI: ''
            toChainId: 137
            toAmountUSD: '0.00'
            toAmount: '941511949935063841'
            toAmountMin: '913266591437011926'
            toToken:
              address: '0xc0b2983a17573660053beeed6fdb1053107cf387'
              symbol: MIVA
              decimals: 18
              chainId: 137
              name: Minerva Wallet SuperToken
              coinKey: MIVA
              priceUSD: '0'
              logoURI: ''
            gasCostUSD: '0.10'
            steps:
              - id: ea5abad4-2e2a-476f-981d-797816e5cc77
                type: swap
                tool: 1inch
                action:
                  fromChainId: 100
                  toChainId: 100
                  fromToken:
                    address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                    symbol: MIVA
                    decimals: 18
                    chainId: 100
                    name: Minerva Wallet SuperToken
                    coinKey: MIVA
                    priceUSD: '0.04547537276751318'
                    logoURI: ''
                  toToken:
                    name: Own a fraction
                    symbol: FRACTION
                    coinKey: FRACTION
                    decimals: 18
                    chainId: 100
                    logoURI: >-
                      https://assets.coingecko.com/coins/images/15099/large/fraction.png?1619691519
                    address: '0x2bf2ba13735160624a0feae98f6ac8f70885ea61'
                  fromAmount: '1000000000000000000'
                  slippage: 0.003
                estimate:
                  fromAmount: '1000000000000000000'
                  toAmount: '809146346742'
                  toAmountMin: '784871956340'
                  approvalAddress: '0x1111111254fb6c44bac0bed2854e76f90643097d'
                  feeCosts: []
                  gasCosts:
                    - type: SEND
                      price: '1.26'
                      estimate: '252364'
                      limit: '315455'
                      amount: '317979'
                      amountUSD: '0.00'
                      token:
                        address: '0x0000000000000000000000000000000000000000'
                        symbol: xDai
                        decimals: 18
                        chainId: 100
                        name: xDai
                        coinKey: xDai
                        priceUSD: '1'
                        logoURI: >-
                          https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
                  data:
                    fromToken:
                      name: Minerva Wallet SuperToken
                      address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                      symbol: MIVA
                      decimals: 18
                      logoURI: https://minerva.digital/i/MIVA-Token_200x200.png
                    toToken:
                      address: '0x2bf2ba13735160624a0feae98f6ac8f70885ea61'
                      decimals: 18
                      symbol: FRACTION
                      name: Own a fraction
                      logoURI: https://etherscan.io/images/main/empty-token.png
                      isCustom: true
                    toTokenAmount: '809146346742'
                    fromTokenAmount: '1000000000000000000'
                    protocols:
                      - - - name: GNOSIS_HONEYSWAP
                            part: 100
                            fromTokenAddress: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                            toTokenAddress: '0x2bf2ba13735160624a0feae98f6ac8f70885ea61'
                    estimatedGas: 252364
                integrator: fee-demo
              - id: >-
                  0x85e93238e8f2f83dd5840eb748c7b9099d69e1ea227a13e7a2e949cf6a32ab7d
                type: cross
                tool: relay
                action:
                  fromChainId: 100
                  toChainId: 137
                  fromToken:
                    name: Own a fraction
                    symbol: FRACTION
                    coinKey: FRACTION
                    decimals: 18
                    chainId: 100
                    logoURI: >-
                      https://assets.coingecko.com/coins/images/15099/large/fraction.png?1619691519
                    address: '0x2bf2ba13735160624a0feae98f6ac8f70885ea61'
                  toToken:
                    name: Own a fraction
                    symbol: FRACTION
                    coinKey: FRACTION
                    decimals: 18
                    chainId: 137
                    logoURI: >-
                      https://assets.coingecko.com/coins/images/15099/large/fraction.png?1619691519
                    address: '0xbd80cfa9d93a87d1bb895f810ea348e496611cd4'
                  fromAmount: '784871956340'
                  slippage: 0.003
                estimate:
                  fromAmount: '784871956340'
                  toAmount: '784479520361'
                  toAmountMin: '784479520361'
                  approvalAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
                  feeCosts:
                    - name: Gas Fee
                      description: >-
                        Covers gas expense for sending funds to user on
                        receiving chain.
                      percentage: '0'
                      token:
                        name: Own a fraction
                        symbol: FRACTION
                        coinKey: FRACTION
                        decimals: 18
                        chainId: 100
                        logoURI: >-
                          https://assets.coingecko.com/coins/images/15099/large/fraction.png?1619691519
                        address: '0x2bf2ba13735160624a0feae98f6ac8f70885ea61'
                      amount: '0'
                      amountUSD: '0.00'
                      included: true
                    - name: Relay Fee
                      description: >-
                        Covers gas expense for claiming user funds on receiving
                        chain.
                      percentage: '0'
                      token:
                        name: Own a fraction
                        symbol: FRACTION
                        coinKey: FRACTION
                        decimals: 18
                        chainId: 100
                        logoURI: >-
                          https://assets.coingecko.com/coins/images/15099/large/fraction.png?1619691519
                        address: '0x2bf2ba13735160624a0feae98f6ac8f70885ea61'
                      amount: '0'
                      amountUSD: '0.00'
                      included: true
                    - name: Router Fee
                      description: Router service fee.
                      percentage: '0.00050000000105749733'
                      token:
                        name: Own a fraction
                        symbol: FRACTION
                        coinKey: FRACTION
                        decimals: 18
                        chainId: 100
                        logoURI: >-
                          https://assets.coingecko.com/coins/images/15099/large/fraction.png?1619691519
                        address: '0x2bf2ba13735160624a0feae98f6ac8f70885ea61'
                      amount: '392435979'
                      amountUSD: '0.00'
                      included: true
                  gasCosts:
                    - type: SEND
                      price: '1.26'
                      estimate: '140000'
                      limit: '175000'
                      amount: '176400'
                      amountUSD: '0.00'
                      token:
                        address: '0x0000000000000000000000000000000000000000'
                        symbol: xDai
                        decimals: 18
                        chainId: 100
                        name: xDai
                        coinKey: xDai
                        priceUSD: '1'
                        logoURI: >-
                          https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
                  data:
                    bid:
                      user: '0x53F68B2186E4a4aB4dD976eD32de68db45BA360b'
                      router: '0xeE2Ef40F688607CB23618d9312d62392786d13EB'
                      initiator: '0x53F68B2186E4a4aB4dD976eD32de68db45BA360b'
                      sendingChainId: 100
                      sendingAssetId: '0x2bf2ba13735160624a0feae98f6ac8f70885ea61'
                      amount: '784871956340'
                      receivingChainId: 137
                      receivingAssetId: '0xbd80cfa9d93a87d1bb895f810ea348e496611cd4'
                      amountReceived: '784479520361'
                      receivingAddress: '0x10fBFF9b9450D3A2d9d1612d6dE3726fACD8809E'
                      transactionId: >-
                        0x85e93238e8f2f83dd5840eb748c7b9099d69e1ea227a13e7a2e949cf6a32ab7d
                      expiry: 1643364189
                      callDataHash: >-
                        0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470
                      callTo: '0x0000000000000000000000000000000000000000'
                      encryptedCallData: 0x
                      sendingChainTxManagerAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
                      receivingChainTxManagerAddress: '0x6090De2EC76eb1Dc3B5d632734415c93c44Fd113'
                      bidExpiry: 1643105290
                    gasFeeInReceivingToken: '0'
                    totalFee: '392435979'
                    metaTxRelayerFee: '0'
                    routerFee: '392435979'
                integrator: fee-demo
              - id: d8686af1-c131-4566-bf4a-ef8226f9879b
                type: swap
                tool: 1inch
                action:
                  fromChainId: 137
                  toChainId: 137
                  fromToken:
                    name: Own a fraction
                    symbol: FRACTION
                    coinKey: FRACTION
                    decimals: 18
                    chainId: 137
                    logoURI: >-
                      https://assets.coingecko.com/coins/images/15099/large/fraction.png?1619691519
                    address: '0xbd80cfa9d93a87d1bb895f810ea348e496611cd4'
                  toToken:
                    address: '0xc0b2983a17573660053beeed6fdb1053107cf387'
                    symbol: MIVA
                    decimals: 18
                    chainId: 137
                    name: Minerva Wallet SuperToken
                    coinKey: MIVA
                    priceUSD: '0'
                    logoURI: ''
                  fromAmount: '784479520361'
                  slippage: 0.003
                estimate:
                  fromAmount: '784479520361'
                  toAmount: '941511949935063841'
                  toAmountMin: '913266591437011926'
                  approvalAddress: '0x1111111254fb6c44bac0bed2854e76f90643097d'
                  feeCosts: []
                  gasCosts:
                    - type: SEND
                      price: '129'
                      estimate: '549386'
                      limit: '686733'
                      amount: '70870794'
                      amountUSD: '0.10'
                      token:
                        address: '0x0000000000000000000000000000000000000000'
                        symbol: MATIC
                        decimals: 18
                        chainId: 137
                        name: MATIC
                        coinKey: MATIC
                        priceUSD: '1.469213'
                        logoURI: >-
                          https://static.debank.com/image/matic_token/logo_url/matic/e5a8a2860ba5cf740a474dcab796dc63.png
                  data:
                    fromToken:
                      address: '0xbd80cfa9d93a87d1bb895f810ea348e496611cd4'
                      decimals: 18
                      symbol: FRACTION
                      name: Own a fraction
                      logoURI: https://etherscan.io/images/main/empty-token.png
                      isCustom: true
                    toToken:
                      address: '0xc0b2983a17573660053beeed6fdb1053107cf387'
                      decimals: 18
                      symbol: MIVA
                      name: Minerva Wallet SuperToken
                      logoURI: https://etherscan.io/images/main/empty-token.png
                      isCustom: true
                    toTokenAmount: '941511949935063841'
                    fromTokenAmount: '784479520361'
                    protocols:
                      - - - name: POLYGON_QUICKSWAP
                            part: 100
                            fromTokenAddress: '0xbd80cfa9d93a87d1bb895f810ea348e496611cd4'
                            toTokenAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619'
                        - - name: POLYDEX_FINANCE
                            part: 100
                            fromTokenAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619'
                            toTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                        - - name: POLYGON_QUICKSWAP
                            part: 100
                            fromTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                            toTokenAddress: '0xc0b2983a17573660053beeed6fdb1053107cf387'
                    estimatedGas: 549386
                integrator: fee-demo
        errors:
          - errorType: NO_QUOTE
            code: NO_POSSIBLE_ROUTE
            action:
              fromChainId: 42161
              toChainId: 42161
              fromToken:
                address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8'
                decimals: 6
                symbol: USDC
                coinKey: USDC
                chainId: 42161
                name: USDC
                logoURI: >-
                  http://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
                priceUSD: '1.001'
              toToken:
                address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9'
                decimals: 6
                symbol: USDT
                coinKey: USDT
                chainId: 42161
                name: Tether USD
                logoURI: http://get.celer.app/cbridge-icons/USDT.png"
              fromAmount: '100000'
              slippage: 0.003
    AllowDenyPrefer:
      title: Root Type for AllowDenyPrefer
      description: Object defining which tools should be allowed, denied and preferred
      type: object
      properties:
        allow:
          description: Allowed tools
          type: array
          items:
            type: string
        deny:
          description: Forbidden tools
          type: array
          items:
            type: string
        prefer:
          description: Preferred tools
          type: array
          items:
            type: string
    Route:
      title: Root Type for Route
      description: A route describing a transfer form a token to another
      required:
        - fromAmount
        - fromAmountUSD
        - fromChainId
        - fromToken
        - id
        - steps
        - toAmount
        - toAmountMin
        - toAmountUSD
        - toChainId
        - toToken
      type: object
      properties:
        id:
          description: Unique identifier of the route
          type: string
        fromChainId:
          format: number
          description: The id of the sending chain
          type: number
        fromAmountUSD:
          description: The amount that should be transferred in USD
          type: string
        fromAmount:
          description: The amount that should be transferred
          type: string
        fromToken:
          $ref: '#/components/schemas/Token'
          description: The sending `Token`
        toChainId:
          format: number
          description: The id of the receiving chain
          type: number
        toAmountUSD:
          description: >-
            The estimated resulting amount of the `toToken` in USD as float with
            two decimals
          type: string
        toAmount:
          description: >-
            The estimated resulting amount of the `toToken` including all
            decimals
          type: string
        toAmountMin:
          description: The minimal resultung amount of the `toToken` including all decimals
          type: string
        toToken:
          $ref: '#/components/schemas/Token'
          description: The `Token` that should be transferred to
        gasCostUSD:
          description: Aggregation of th eunderlying gas costs in USD
          type: string
        steps:
          description: The steps required to fulfill the transfer
          type: array
          items:
            $ref: '#/components/schemas/Step'
        fromAddress:
          description: The sending wallet address
          type: string
        toAddress:
          description: The receiving wallet address
          type: string
        containsSwitchChain:
          description: Whether a chain switch is part of the route
          type: boolean
      example:
        id: '0x1e21fad9c26fff48b67ae2925f878e43bf81211da8b1cd9b7faa8bfd8d7ea9d9'
        fromChainId: 100
        fromAmountUSD: '0.05'
        fromAmount: '1000000000000000000'
        fromToken:
          address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
          symbol: MIVA
          decimals: 18
          chainId: 100
          name: Minerva Wallet SuperToken
          coinKey: MIVA
          priceUSD: '0.04547537276751318'
          logoURI: ''
        toChainId: 137
        toAmountUSD: '0.00'
        toAmount: '999500000000000000'
        toAmountMin: '999500000000000000'
        toToken:
          address: '0xc0b2983a17573660053beeed6fdb1053107cf387'
          symbol: MIVA
          decimals: 18
          chainId: 137
          name: Minerva Wallet SuperToken
          coinKey: MIVA
          priceUSD: '0'
          logoURI: ''
        gasCostUSD: '0.00'
        steps:
          - id: '0x48f0a2f93b0d0a9dab992d07c46bca38516c945101e8f8e08ca42af05b9e6aa9'
            type: cross
            tool: relay
            action:
              fromChainId: 100
              toChainId: 137
              fromToken:
                address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                symbol: MIVA
                decimals: 18
                chainId: 100
                name: Minerva Wallet SuperToken
                coinKey: MIVA
                priceUSD: '0.04547537276751318'
                logoURI: ''
              toToken:
                address: '0xc0b2983a17573660053beeed6fdb1053107cf387'
                symbol: MIVA
                decimals: 18
                chainId: 137
                name: Minerva Wallet SuperToken
                coinKey: MIVA
                priceUSD: '0'
                logoURI: ''
              fromAmount: '1000000000000000000'
              slippage: 0.003
            estimate:
              fromAmount: '1000000000000000000'
              toAmount: '999500000000000000'
              toAmountMin: '999500000000000000'
              approvalAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
              feeCosts:
                - name: Gas Fee
                  description: >-
                    Covers gas expense for sending funds to user on receiving
                    chain.
                  percentage: '0'
                  token:
                    address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                    symbol: MIVA
                    decimals: 18
                    chainId: 100
                    name: Minerva Wallet SuperToken
                    coinKey: MIVA
                    priceUSD: '0.04547537276751318'
                    logoURI: ''
                  amount: '0'
                  amountUSD: '0.00'
                  included: true
                - name: Relay Fee
                  description: >-
                    Covers gas expense for claiming user funds on receiving
                    chain.
                  percentage: '0'
                  token:
                    address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                    symbol: MIVA
                    decimals: 18
                    chainId: 100
                    name: Minerva Wallet SuperToken
                    coinKey: MIVA
                    priceUSD: '0.04547537276751318'
                    logoURI: ''
                  amount: '0'
                  amountUSD: '0.00'
                  included: true
                - name: Router Fee
                  description: Router service fee.
                  percentage: '0.0005'
                  token:
                    address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                    symbol: MIVA
                    decimals: 18
                    chainId: 100
                    name: Minerva Wallet SuperToken
                    coinKey: MIVA
                    priceUSD: '0.04547537276751318'
                    logoURI: ''
                  amount: '500000000000000'
                  amountUSD: '22737686383756.59'
                  included: true
              gasCosts:
                - type: SEND
                  price: '1.26'
                  estimate: '140000'
                  limit: '175000'
                  amount: '176400'
                  amountUSD: '0.00'
                  token:
                    address: '0x0000000000000000000000000000000000000000'
                    symbol: xDai
                    decimals: 18
                    chainId: 100
                    name: xDai
                    coinKey: xDai
                    priceUSD: '1'
                    logoURI: >-
                      https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
              data:
                bid:
                  user: '0x53F68B2186E4a4aB4dD976eD32de68db45BA360b'
                  router: '0xeE2Ef40F688607CB23618d9312d62392786d13EB'
                  initiator: '0x53F68B2186E4a4aB4dD976eD32de68db45BA360b'
                  sendingChainId: 100
                  sendingAssetId: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                  amount: '1000000000000000000'
                  receivingChainId: 137
                  receivingAssetId: '0xc0b2983a17573660053beeed6fdb1053107cf387'
                  amountReceived: '999500000000000000'
                  receivingAddress: '0x10fBFF9b9450D3A2d9d1612d6dE3726fACD8809E'
                  transactionId: >-
                    0x48f0a2f93b0d0a9dab992d07c46bca38516c945101e8f8e08ca42af05b9e6aa9
                  expiry: 1643364189
                  callDataHash: >-
                    0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470
                  callTo: '0x0000000000000000000000000000000000000000'
                  encryptedCallData: 0x
                  sendingChainTxManagerAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
                  receivingChainTxManagerAddress: '0x6090De2EC76eb1Dc3B5d632734415c93c44Fd113'
                  bidExpiry: 1643105290
                gasFeeInReceivingToken: '0'
                totalFee: '500000000000000'
                metaTxRelayerFee: '0'
                routerFee: '500000000000000'
            integrator: fee-demo
    UnavailableRoutes:
      type: object
      properties:
        filteredOut:
          description: >-
            An object containing information about routes that were
            intentionally filtered out.
          type: array
          items:
            properties:
              overallPath:
                description: The complete representation of the attempted route.
                type: string
                example: 100:USDC-hop-137:USDC-137:USDC~137:SUSHI
              reason:
                description: Out best attempt at describing the failure.
                type: string
        failed:
          description: An object containing information about failed routes.
          type: array
          items:
            properties:
              overallPath:
                description: The complete representation of the attempted route.
                type: string
                example: 100:USDC-hop-137:USDC-137:USDC~137:SUSHI
              subpaths:
                description: An object with all subpaths that generated one or more errors
                type: object
                additionalProperties:
                  $ref: '#/components/schemas/ToolError'
    Token:
      title: Root Type for Token
      description: Representation of a Token
      required:
        - address
        - chainId
        - decimals
        - name
        - symbol
      type: object
      properties:
        address:
          description: Address of the token
          type: string
        decimals:
          format: number
          description: Number of decimals the token uses
          type: number
        symbol:
          description: Symbol of the token
          type: string
        chainId:
          format: number
          description: Id of the token's chain
          type: number
        coinKey:
          description: Identifier for the token
          type: string
        name:
          description: Name of the token
          type: string
        logoURI:
          description: Logo of the token
          type: string
        priceUSD:
          description: Token price in USD
          type: string
      example:
        address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
        symbol: DAI
        decimals: 18
        chainId: 137
        name: (PoS) Dai Stablecoin
        coinKey: DAI
        priceUSD: '1'
        logoURI: >-
          https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/549c4205dbb199f1b8b03af783f35e71.png
    Step:
      title: Root Type for Step
      description: Object that represents one step of a `Route`
      required:
        - id
        - action
        - tool
        - type
      type: object
      properties:
        id:
          description: Unique identifier of the step
          type: string
        type:
          description: >-
            The type of the step. `swap` executes a DEX swap on a single chain,
            `cross` bridges assets between chains, `lifi` runs LiFi's internal
            multi-action logic, and `protocol` represents protocol-level actions
            such as fee collection or vault interactions executed inside LiFi
            managed contracts.
          enum:
            - swap
            - cross
            - lifi
            - protocol
          type: string
        tool:
          description: The tool used for this step. E.g. `relay`
          type: string
        toolDetails:
          description: The details of the tool used for this step. E.g. `relay`
          type: object
          properties:
            key:
              description: The tool key
              type: string
            name:
              description: The tool name
              type: string
            logoURI:
              description: The tool logo URL
              type: string
        action:
          $ref: '#/components/schemas/Action'
          description: The action of the step
        estimate:
          $ref: '#/components/schemas/Estimate'
          description: The estimation for the step
        integrator:
          description: >-
            A string containing tracking information about the integrator of the
            API
          type: string
        includedSteps:
          type: array
          items:
            $ref: '#/components/schemas/IncludedStep'
        referrer:
          description: >-
            A string containing tracking information about the referrer of the
            integrator
          type: string
        execution:
          description: An objection containing status information about the execution
        transactionRequest:
          description: >-
            An ether.js TransactionRequest that can be triggered using a wallet
            provider.
            (https://docs.ethers.io/v5/api/providers/types/#providers-TransactionRequest)
      example:
        id: '0x48f0a2f93b0d0a9dab992d07c46bca38516c945101e8f8e08ca42af05b9e6aa9'
        type: cross
        tool: relay
        action:
          fromChainId: 100
          toChainId: 137
          fromToken:
            address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
            symbol: MIVA
            decimals: 18
            chainId: 100
            name: Minerva Wallet SuperToken
            coinKey: MIVA
            priceUSD: '0.04547537276751318'
            logoURI: ''
          toToken:
            address: '0xc0b2983a17573660053beeed6fdb1053107cf387'
            symbol: MIVA
            decimals: 18
            chainId: 137
            name: Minerva Wallet SuperToken
            coinKey: MIVA
            priceUSD: '0'
            logoURI: ''
          fromAmount: '1000000000000000000'
          slippage: 0.003
        estimate:
          fromAmount: '1000000000000000000'
          toAmount: '999500000000000000'
          toAmountMin: '999500000000000000'
          approvalAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
          feeCosts:
            - name: Gas Fee
              description: Covers gas expense for sending funds to user on receiving chain.
              percentage: '0'
              token:
                address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                symbol: MIVA
                decimals: 18
                chainId: 100
                name: Minerva Wallet SuperToken
                coinKey: MIVA
                priceUSD: '0.04547537276751318'
                logoURI: ''
              amount: '0'
              amountUSD: '0.00'
              included: true
            - name: Relay Fee
              description: Covers gas expense for claiming user funds on receiving chain.
              percentage: '0'
              token:
                address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                symbol: MIVA
                decimals: 18
                chainId: 100
                name: Minerva Wallet SuperToken
                coinKey: MIVA
                priceUSD: '0.04547537276751318'
                logoURI: ''
              amount: '0'
              amountUSD: '0.00'
              included: true
            - name: Router Fee
              description: Router service fee.
              percentage: '0.0005'
              token:
                address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                symbol: MIVA
                decimals: 18
                chainId: 100
                name: Minerva Wallet SuperToken
                coinKey: MIVA
                priceUSD: '0.04547537276751318'
                logoURI: ''
              amount: '500000000000000'
              amountUSD: '22737686383756.59'
              included: true
          gasCosts:
            - type: SEND
              price: '1.26'
              estimate: '140000'
              limit: '175000'
              amount: '176400'
              amountUSD: '0.00'
              token:
                address: '0x0000000000000000000000000000000000000000'
                symbol: xDai
                decimals: 18
                chainId: 100
                name: xDai
                coinKey: xDai
                priceUSD: '1'
                logoURI: >-
                  https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
          data:
            bid:
              user: '0x53F68B2186E4a4aB4dD976eD32de68db45BA360b'
              router: '0xeE2Ef40F688607CB23618d9312d62392786d13EB'
              initiator: '0x53F68B2186E4a4aB4dD976eD32de68db45BA360b'
              sendingChainId: 100
              sendingAssetId: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
              amount: '1000000000000000000'
              receivingChainId: 137
              receivingAssetId: '0xc0b2983a17573660053beeed6fdb1053107cf387'
              amountReceived: '999500000000000000'
              receivingAddress: '0x10fBFF9b9450D3A2d9d1612d6dE3726fACD8809E'
              transactionId: >-
                0x48f0a2f93b0d0a9dab992d07c46bca38516c945101e8f8e08ca42af05b9e6aa9
              expiry: 1643364189
              callDataHash: >-
                0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470
              callTo: '0x0000000000000000000000000000000000000000'
              encryptedCallData: 0x
              sendingChainTxManagerAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
              receivingChainTxManagerAddress: '0x6090De2EC76eb1Dc3B5d632734415c93c44Fd113'
              bidExpiry: 1643105290
            gasFeeInReceivingToken: '0'
            totalFee: '500000000000000'
            metaTxRelayerFee: '0'
            routerFee: '500000000000000'
        integrator: fee-demo
    ToolError:
      title: An error returned by a tool (Exchange or Bridge)
      description: Describes why a certain operation (like a quote request) failed.
      type: object
      properties:
        errorType:
          description: The type of error that occurred.
          enum:
            - NO_QUOTE
          type: string
        code:
          description: The error code.
          enum:
            - NO_POSSIBLE_ROUTE
            - INSUFFICIENT_LIQUIDITY
            - TOOL_TIMEOUT
            - UNKNOWN_ERROR
            - RPC_ERROR
            - AMOUNT_TOO_LOW
            - AMOUNT_TOO_HIGH
            - FEES_HIGHER_THAN_AMOUNT
            - DIFFERENT_RECIPIENT_NOT_SUPPORTED
            - TOOL_SPECIFIC_ERROR
            - CANNOT_GUARANTEE_MIN_AMOUNT
            - RATE_LIMIT_EXCEEDED
          type: string
        action:
          $ref: '#/components/schemas/Action'
        tool:
          description: The tool that emitted the error.
          type: string
        message:
          description: A human-readable message describing the error.
          type: string
    Action:
      title: Root Type for Action
      description: Object describing what happens in a `Step`
      required:
        - fromToken
        - fromAmount
        - fromChainId
        - toChainId
        - toToken
      type: object
      properties:
        fromChainId:
          format: number
          description: The id of the chain where the transfer should start
          type: number
        fromAmount:
          description: The amount that should be transferred including all decimals
          type: string
        fromToken:
          $ref: '#/components/schemas/Token'
          description: The sending token
        toChainId:
          format: number
          description: The id of the chain where the transfer should end
          type: number
        toToken:
          $ref: '#/components/schemas/Token'
          description: The token that should be transferred to
        slippage:
          format: double
          description: The maximum allowed slippage
          type: number
        fromAddress:
          description: The sending wallet address
          type: string
        toAddress:
          description: The receiving wallet address
          type: string
      example:
        fromChainId: 100
        fromAmount: '1000000000000000000'
        fromToken:
          address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
          symbol: MIVA
          decimals: 18
          chainId: 100
          name: Minerva Wallet SuperToken
          coinKey: MIVA
          priceUSD: '0.0455272371751059'
          logoURI: ''
        toChainId: 137
        toToken:
          address: '0xc0b2983a17573660053beeed6fdb1053107cf387'
          symbol: MIVA
          decimals: 18
          chainId: 137
          name: Minerva Wallet SuperToken
          coinKey: MIVA
          priceUSD: '0'
          logoURI: ''
        slippage: 0.003
    Estimate:
      title: Root Type for Estimate
      description: An estimate for the current transfer
      required:
        - fromAmount
        - approvalAddress
        - toAmount
        - toAmountMin
        - tool
        - executionDuration
      type: object
      properties:
        tool:
          description: The tools that is being used for this step
          type: string
        fromAmount:
          description: The amount that should be transferred including all decimals
          type: string
        fromAmountUSD:
          description: The amount that should be transferred in USD equivalent
          type: string
        toAmount:
          description: >-
            The estimated resulting amount of the `toToken` including all
            decimals
          type: string
        toAmountMin:
          description: The minimal outcome of the transfer including all decimals
          type: string
        toAmountUSD:
          description: The estimated resulting amount of the `toToken` in USD equivalent
          type: string
        approvalAddress:
          description: The contract address for the approval
          type: string
        feeCosts:
          description: Fees included in the transfer
          type: array
          items:
            $ref: '#/components/schemas/FeeCost'
        gasCosts:
          description: Gas costs included in the transfer
          type: array
          items:
            $ref: '#/components/schemas/GasCost'
        executionDuration:
          description: The time needed to complete the following step
          type: number
        data:
          description: Arbitrary data that depends on the the used tool
          type: object
          properties:
            bid:
              type: object
              properties:
                user:
                  type: string
                router:
                  type: string
                initiator:
                  type: string
                sendingChainId:
                  format: number
                  type: number
                sendingAssetId:
                  type: string
                amount:
                  type: string
                receivingChainId:
                  format: number
                  type: number
                receivingAssetId:
                  type: string
                amountReceived:
                  type: string
                receivingAddress:
                  type: string
                transactionId:
                  type: string
                expiry:
                  format: number
                  type: number
                callDataHash:
                  type: string
                callTo:
                  type: string
                encryptedCallData:
                  type: string
                sendingChainTxManagerAddress:
                  type: string
                receivingChainTxManagerAddress:
                  type: string
                bidExpiry:
                  format: number
                  type: number
            bidSignature:
              type: string
            gasFeeInReceivingToken:
              type: string
            totalFee:
              type: string
            metaTxRelayerFee:
              type: string
            routerFee:
              type: string
      example:
        fromAmount: '1000000000000000000'
        toAmount: '999500000000000000'
        toAmountMin: '999500000000000000'
        tool: allbridge
        executionDuration: 60
        approvalAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
        feeCosts:
          - name: Gas Fee
            description: Covers gas expense for sending funds to user on receiving chain.
            percentage: '0'
            token:
              address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
              symbol: MIVA
              decimals: 18
              chainId: 100
              name: Minerva Wallet SuperToken
              coinKey: MIVA
              priceUSD: '0.0455272371751059'
              logoURI: ''
            amount: '0'
            amountUSD: '0.00'
            included: true
          - name: Relay Fee
            description: Covers gas expense for claiming user funds on receiving chain.
            percentage: '0'
            token:
              address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
              symbol: MIVA
              decimals: 18
              chainId: 100
              name: Minerva Wallet SuperToken
              coinKey: MIVA
              priceUSD: '0.0455272371751059'
              logoURI: ''
            amount: '0'
            amountUSD: '0.00'
            included: true
          - name: Router Fee
            description: Router service fee.
            percentage: '0.0005'
            token:
              address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
              symbol: MIVA
              decimals: 18
              chainId: 100
              name: Minerva Wallet SuperToken
              coinKey: MIVA
              priceUSD: '0.0455272371751059'
              logoURI: ''
            amount: '500000000000000'
            amountUSD: '22763618587552.95'
            included: true
        gasCosts:
          - type: SEND
            price: '1.22'
            estimate: '140000'
            limit: '175000'
            amount: '170800'
            amountUSD: '0.00'
            token:
              address: '0x0000000000000000000000000000000000000000'
              symbol: xDai
              decimals: 18
              chainId: 100
              name: xDai
              coinKey: xDai
              priceUSD: '1'
              logoURI: >-
                https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
        data:
          bid:
            user: '0x10fBFF9b9450D3A2d9d1612d6dE3726fACD8809E'
            router: '0xeE2Ef40F688607CB23618d9312d62392786d13EB'
            initiator: '0x10fBFF9b9450D3A2d9d1612d6dE3726fACD8809E'
            sendingChainId: 100
            sendingAssetId: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
            amount: '1000000000000000000'
            receivingChainId: 137
            receivingAssetId: '0xc0b2983a17573660053beeed6fdb1053107cf387'
            amountReceived: '999500000000000000'
            receivingAddress: '0x10fBFF9b9450D3A2d9d1612d6dE3726fACD8809E'
            transactionId: '0x9f54c1764e19367c44706f4a6253941b81e9ec524af5590091aa8ae67e7644ed'
            expiry: 1643369368
            callDataHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
            callTo: '0x0000000000000000000000000000000000000000'
            encryptedCallData: 0x
            sendingChainTxManagerAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
            receivingChainTxManagerAddress: '0x6090De2EC76eb1Dc3B5d632734415c93c44Fd113'
            bidExpiry: 1643110469
          gasFeeInReceivingToken: '0'
          totalFee: '500000000000000'
          metaTxRelayerFee: '0'
          routerFee: '500000000000000'
    IncludedStep:
      title: Root Type for Internal Step
      description: Object that represents one step of an `IncludedSteps` array in `Route`
      required:
        - id
        - action
        - estimate
        - tool
        - type
        - toolDetails
      type: object
      properties:
        id:
          description: Unique identifier of the step
          type: string
        type:
          description: >-
            The type of the step. `swap` executes a DEX swap on a single chain,
            `cross` bridges assets between chains, `lifi` runs LiFi's internal
            multi-action logic, and `protocol` represents protocol-level actions
            such as fee collection or vault interactions executed inside LiFi
            managed contracts.
          enum:
            - swap
            - cross
            - lifi
            - protocol
          type: string
        tool:
          description: The tool used for this step. E.g. `allbridge`
          type: string
        toolDetails:
          description: The details of the tool used for this step. E.g. `allbridge`
          type: object
          properties:
            key:
              description: The tool key
              type: string
            name:
              description: The tool name
              type: string
            logoURI:
              description: The tool logo URL
              type: string
        action:
          $ref: '#/components/schemas/Action'
        estimate:
          $ref: '#/components/schemas/Estimate'
    FeeCost:
      title: Root Type for FeeCost
      description: Fees included in the transfer
      required:
        - token
        - percentage
        - name
        - amountUSD
        - included
      type: object
      properties:
        name:
          description: Name of the fee
          type: string
        description:
          description: Description of the fee costs
          type: string
        percentage:
          description: Percentage of how much fees are taken
          type: string
        token:
          $ref: '#/components/schemas/Token'
          description: The `Token` in which the fees are taken
        amount:
          description: The amount of fees
          type: string
        amountUSD:
          description: The amount of fees in USD
          type: string
        included:
          description: Whether fee is included into transfer's `fromAmount`
          type: boolean
      example:
        name: Gas Fee
        description: Covers gas expense for sending funds to user on receiving chain.
        percentage: '0'
        token:
          address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
          symbol: MIVA
          decimals: 18
          chainId: 100
          name: Minerva Wallet SuperToken
          coinKey: MIVA
          priceUSD: '0.0455272371751059'
          logoURI: ''
        amount: '0'
        amountUSD: '0.00'
    GasCost:
      title: Root Type for GasCost
      description: Gas costs included in the transfer
      required:
        - token
        - type
        - amount
      type: object
      properties:
        type:
          description: Can be one of `SUM`, `APPROVE` or `SEND`
          type: string
        price:
          description: Suggested current standard price for the chain
          type: string
        estimate:
          description: Estimation how much gas will be needed
          type: string
        limit:
          description: Suggested gas limit
          type: string
        amount:
          description: Amount of the gas cost
          type: string
        amountUSD:
          description: Amount of the gas cost in USD
          type: string
        token:
          $ref: '#/components/schemas/Token'
          description: The used gas token
      example:
        type: SEND
        price: '1.22'
        estimate: '140000'
        limit: '175000'
        amount: '170800'
        amountUSD: '0.00'
        token:
          address: '0x0000000000000000000000000000000000000000'
          symbol: xDai
          decimals: 18
          chainId: 100
          name: xDai
          coinKey: xDai
          priceUSD: '1'
          logoURI: >-
            https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
  responses:
    RoutesResponse:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/RoutesResponse'
          examples:
            RoutesResponseExample:
              value:
                routes:
                  - id: >-
                      0x1e21fad9c26fff48b67ae2925f878e43bf81211da8b1cd9b7faa8bfd8d7ea9d9
                    fromChainId: 100
                    fromAmountUSD: '0.05'
                    fromAmount: '1000000000000000000'
                    fromToken:
                      address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                      symbol: MIVA
                      decimals: 18
                      chainId: 100
                      name: Minerva Wallet SuperToken
                      coinKey: MIVA
                      priceUSD: '0.04547537276751318'
                      logoURI: ''
                    toChainId: 137
                    toAmountUSD: '0.00'
                    toAmount: '999500000000000000'
                    toAmountMin: '999500000000000000'
                    toToken:
                      address: '0xc0b2983a17573660053beeed6fdb1053107cf387'
                      symbol: MIVA
                      decimals: 18
                      chainId: 137
                      name: Minerva Wallet SuperToken
                      coinKey: MIVA
                      priceUSD: '0'
                      logoURI: ''
                    gasCostUSD: '0.00'
                    steps:
                      - id: >-
                          0x48f0a2f93b0d0a9dab992d07c46bca38516c945101e8f8e08ca42af05b9e6aa9
                        type: cross
                        tool: relay
                        action:
                          fromChainId: 100
                          toChainId: 137
                          fromToken:
                            address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                            symbol: MIVA
                            decimals: 18
                            chainId: 100
                            name: Minerva Wallet SuperToken
                            coinKey: MIVA
                            priceUSD: '0.04547537276751318'
                            logoURI: ''
                          toToken:
                            address: '0xc0b2983a17573660053beeed6fdb1053107cf387'
                            symbol: MIVA
                            decimals: 18
                            chainId: 137
                            name: Minerva Wallet SuperToken
                            coinKey: MIVA
                            priceUSD: '0'
                            logoURI: ''
                          fromAmount: '1000000000000000000'
                          slippage: 0.003
                        estimate:
                          fromAmount: '1000000000000000000'
                          toAmount: '999500000000000000'
                          toAmountMin: '999500000000000000'
                          approvalAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
                          feeCosts:
                            - name: Gas Fee
                              description: >-
                                Covers gas expense for sending funds to user on
                                receiving chain.
                              percentage: '0'
                              token:
                                address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                                symbol: MIVA
                                decimals: 18
                                chainId: 100
                                name: Minerva Wallet SuperToken
                                coinKey: MIVA
                                priceUSD: '0.04547537276751318'
                                logoURI: ''
                              amount: '0'
                              amountUSD: '0.00'
                              included: true
                            - name: Relay Fee
                              description: >-
                                Covers gas expense for claiming user funds on
                                receiving chain.
                              percentage: '0'
                              token:
                                address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                                symbol: MIVA
                                decimals: 18
                                chainId: 100
                                name: Minerva Wallet SuperToken
                                coinKey: MIVA
                                priceUSD: '0.04547537276751318'
                                logoURI: ''
                              amount: '0'
                              amountUSD: '0.00'
                              included: true
                            - name: Router Fee
                              description: Router service fee.
                              percentage: '0.0005'
                              token:
                                address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                                symbol: MIVA
                                decimals: 18
                                chainId: 100
                                name: Minerva Wallet SuperToken
                                coinKey: MIVA
                                priceUSD: '0.04547537276751318'
                                logoURI: ''
                              amount: '500000000000000'
                              amountUSD: '22737686383756.59'
                              included: true
                          gasCosts:
                            - type: SEND
                              price: '1.26'
                              estimate: '140000'
                              limit: '175000'
                              amount: '176400'
                              amountUSD: '0.00'
                              token:
                                address: '0x0000000000000000000000000000000000000000'
                                symbol: xDai
                                decimals: 18
                                chainId: 100
                                name: xDai
                                coinKey: xDai
                                priceUSD: '1'
                                logoURI: >-
                                  https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
                          data:
                            bid:
                              user: '0x53F68B2186E4a4aB4dD976eD32de68db45BA360b'
                              router: '0xeE2Ef40F688607CB23618d9312d62392786d13EB'
                              initiator: '0x53F68B2186E4a4aB4dD976eD32de68db45BA360b'
                              sendingChainId: 100
                              sendingAssetId: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                              amount: '1000000000000000000'
                              receivingChainId: 137
                              receivingAssetId: '0xc0b2983a17573660053beeed6fdb1053107cf387'
                              amountReceived: '999500000000000000'
                              receivingAddress: '0x10fBFF9b9450D3A2d9d1612d6dE3726fACD8809E'
                              transactionId: >-
                                0x48f0a2f93b0d0a9dab992d07c46bca38516c945101e8f8e08ca42af05b9e6aa9
                              expiry: 1643364189
                              callDataHash: >-
                                0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470
                              callTo: '0x0000000000000000000000000000000000000000'
                              encryptedCallData: 0x
                              sendingChainTxManagerAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
                              receivingChainTxManagerAddress: '0x6090De2EC76eb1Dc3B5d632734415c93c44Fd113'
                              bidExpiry: 1643105290
                            gasFeeInReceivingToken: '0'
                            totalFee: '500000000000000'
                            metaTxRelayerFee: '0'
                            routerFee: '500000000000000'
                        integrator: fee-demo
                  - id: >-
                      0xb785f52e68f8a6fb147d5e392e06f122c1a418be84bdc28de0f311b91fa5e57e
                    fromChainId: 100
                    fromAmountUSD: '0.05'
                    fromAmount: '1000000000000000000'
                    fromToken:
                      address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                      symbol: MIVA
                      decimals: 18
                      chainId: 100
                      name: Minerva Wallet SuperToken
                      coinKey: MIVA
                      priceUSD: '0.04547537276751318'
                      logoURI: ''
                    toChainId: 137
                    toAmountUSD: '0.00'
                    toAmount: '941511949935063841'
                    toAmountMin: '913266591437011926'
                    toToken:
                      address: '0xc0b2983a17573660053beeed6fdb1053107cf387'
                      symbol: MIVA
                      decimals: 18
                      chainId: 137
                      name: Minerva Wallet SuperToken
                      coinKey: MIVA
                      priceUSD: '0'
                      logoURI: ''
                    gasCostUSD: '0.10'
                    steps:
                      - id: ea5abad4-2e2a-476f-981d-797816e5cc77
                        type: swap
                        tool: 1inch
                        action:
                          fromChainId: 100
                          toChainId: 100
                          fromToken:
                            address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                            symbol: MIVA
                            decimals: 18
                            chainId: 100
                            name: Minerva Wallet SuperToken
                            coinKey: MIVA
                            priceUSD: '0.04547537276751318'
                            logoURI: ''
                          toToken:
                            name: Own a fraction
                            symbol: FRACTION
                            coinKey: FRACTION
                            decimals: 18
                            chainId: 100
                            logoURI: >-
                              https://assets.coingecko.com/coins/images/15099/large/fraction.png?1619691519
                            address: '0x2bf2ba13735160624a0feae98f6ac8f70885ea61'
                          fromAmount: '1000000000000000000'
                          slippage: 0.003
                        estimate:
                          fromAmount: '1000000000000000000'
                          toAmount: '809146346742'
                          toAmountMin: '784871956340'
                          approvalAddress: '0x1111111254fb6c44bac0bed2854e76f90643097d'
                          feeCosts: []
                          gasCosts:
                            - type: SEND
                              price: '1.26'
                              estimate: '252364'
                              limit: '315455'
                              amount: '317979'
                              amountUSD: '0.00'
                              token:
                                address: '0x0000000000000000000000000000000000000000'
                                symbol: xDai
                                decimals: 18
                                chainId: 100
                                name: xDai
                                coinKey: xDai
                                priceUSD: '1'
                                logoURI: >-
                                  https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
                          data:
                            fromToken:
                              name: Minerva Wallet SuperToken
                              address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                              symbol: MIVA
                              decimals: 18
                              logoURI: https://minerva.digital/i/MIVA-Token_200x200.png
                            toToken:
                              address: '0x2bf2ba13735160624a0feae98f6ac8f70885ea61'
                              decimals: 18
                              symbol: FRACTION
                              name: Own a fraction
                              logoURI: https://etherscan.io/images/main/empty-token.png
                              isCustom: true
                            toTokenAmount: '809146346742'
                            fromTokenAmount: '1000000000000000000'
                            protocols:
                              - - - name: GNOSIS_HONEYSWAP
                                    part: 100
                                    fromTokenAddress: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                                    toTokenAddress: '0x2bf2ba13735160624a0feae98f6ac8f70885ea61'
                            estimatedGas: 252364
                        integrator: fee-demo
                      - id: >-
                          0x85e93238e8f2f83dd5840eb748c7b9099d69e1ea227a13e7a2e949cf6a32ab7d
                        type: cross
                        tool: relay
                        action:
                          fromChainId: 100
                          toChainId: 137
                          fromToken:
                            name: Own a fraction
                            symbol: FRACTION
                            coinKey: FRACTION
                            decimals: 18
                            chainId: 100
                            logoURI: >-
                              https://assets.coingecko.com/coins/images/15099/large/fraction.png?1619691519
                            address: '0x2bf2ba13735160624a0feae98f6ac8f70885ea61'
                          toToken:
                            name: Own a fraction
                            symbol: FRACTION
                            coinKey: FRACTION
                            decimals: 18
                            chainId: 137
                            logoURI: >-
                              https://assets.coingecko.com/coins/images/15099/large/fraction.png?1619691519
                            address: '0xbd80cfa9d93a87d1bb895f810ea348e496611cd4'
                          fromAmount: '784871956340'
                          slippage: 0.003
                        estimate:
                          fromAmount: '784871956340'
                          toAmount: '784479520361'
                          toAmountMin: '784479520361'
                          approvalAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
                          feeCosts:
                            - name: Gas Fee
                              description: >-
                                Covers gas expense for sending funds to user on
                                receiving chain.
                              percentage: '0'
                              token:
                                name: Own a fraction
                                symbol: FRACTION
                                coinKey: FRACTION
                                decimals: 18
                                chainId: 100
                                logoURI: >-
                                  https://assets.coingecko.com/coins/images/15099/large/fraction.png?1619691519
                                address: '0x2bf2ba13735160624a0feae98f6ac8f70885ea61'
                              amount: '0'
                              amountUSD: '0.00'
                              included: true
                            - name: Relay Fee
                              description: >-
                                Covers gas expense for claiming user funds on
                                receiving chain.
                              percentage: '0'
                              token:
                                name: Own a fraction
                                symbol: FRACTION
                                coinKey: FRACTION
                                decimals: 18
                                chainId: 100
                                logoURI: >-
                                  https://assets.coingecko.com/coins/images/15099/large/fraction.png?1619691519
                                address: '0x2bf2ba13735160624a0feae98f6ac8f70885ea61'
                              amount: '0'
                              amountUSD: '0.00'
                              included: true
                            - name: Router Fee
                              description: Router service fee.
                              percentage: '0.00050000000105749733'
                              token:
                                name: Own a fraction
                                symbol: FRACTION
                                coinKey: FRACTION
                                decimals: 18
                                chainId: 100
                                logoURI: >-
                                  https://assets.coingecko.com/coins/images/15099/large/fraction.png?1619691519
                                address: '0x2bf2ba13735160624a0feae98f6ac8f70885ea61'
                              amount: '392435979'
                              amountUSD: '0.00'
                              included: true
                          gasCosts:
                            - type: SEND
                              price: '1.26'
                              estimate: '140000'
                              limit: '175000'
                              amount: '176400'
                              amountUSD: '0.00'
                              token:
                                address: '0x0000000000000000000000000000000000000000'
                                symbol: xDai
                                decimals: 18
                                chainId: 100
                                name: xDai
                                coinKey: xDai
                                priceUSD: '1'
                                logoURI: >-
                                  https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
                          data:
                            bid:
                              user: '0x53F68B2186E4a4aB4dD976eD32de68db45BA360b'
                              router: '0xeE2Ef40F688607CB23618d9312d62392786d13EB'
                              initiator: '0x53F68B2186E4a4aB4dD976eD32de68db45BA360b'
                              sendingChainId: 100
                              sendingAssetId: '0x2bf2ba13735160624a0feae98f6ac8f70885ea61'
                              amount: '784871956340'
                              receivingChainId: 137
                              receivingAssetId: '0xbd80cfa9d93a87d1bb895f810ea348e496611cd4'
                              amountReceived: '784479520361'
                              receivingAddress: '0x10fBFF9b9450D3A2d9d1612d6dE3726fACD8809E'
                              transactionId: >-
                                0x85e93238e8f2f83dd5840eb748c7b9099d69e1ea227a13e7a2e949cf6a32ab7d
                              expiry: 1643364189
                              callDataHash: >-
                                0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470
                              callTo: '0x0000000000000000000000000000000000000000'
                              encryptedCallData: 0x
                              sendingChainTxManagerAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
                              receivingChainTxManagerAddress: '0x6090De2EC76eb1Dc3B5d632734415c93c44Fd113'
                              bidExpiry: 1643105290
                            gasFeeInReceivingToken: '0'
                            totalFee: '392435979'
                            metaTxRelayerFee: '0'
                            routerFee: '392435979'
                        integrator: fee-demo
                      - id: d8686af1-c131-4566-bf4a-ef8226f9879b
                        type: swap
                        tool: 1inch
                        action:
                          fromChainId: 137
                          toChainId: 137
                          fromToken:
                            name: Own a fraction
                            symbol: FRACTION
                            coinKey: FRACTION
                            decimals: 18
                            chainId: 137
                            logoURI: >-
                              https://assets.coingecko.com/coins/images/15099/large/fraction.png?1619691519
                            address: '0xbd80cfa9d93a87d1bb895f810ea348e496611cd4'
                          toToken:
                            address: '0xc0b2983a17573660053beeed6fdb1053107cf387'
                            symbol: MIVA
                            decimals: 18
                            chainId: 137
                            name: Minerva Wallet SuperToken
                            coinKey: MIVA
                            priceUSD: '0'
                            logoURI: ''
                          fromAmount: '784479520361'
                          slippage: 0.003
                        estimate:
                          fromAmount: '784479520361'
                          toAmount: '941511949935063841'
                          toAmountMin: '913266591437011926'
                          approvalAddress: '0x1111111254fb6c44bac0bed2854e76f90643097d'
                          feeCosts: []
                          gasCosts:
                            - type: SEND
                              price: '129'
                              estimate: '549386'
                              limit: '686733'
                              amount: '70870794'
                              amountUSD: '0.10'
                              token:
                                address: '0x0000000000000000000000000000000000000000'
                                symbol: MATIC
                                decimals: 18
                                chainId: 137
                                name: MATIC
                                coinKey: MATIC
                                priceUSD: '1.469213'
                                logoURI: >-
                                  https://static.debank.com/image/matic_token/logo_url/matic/e5a8a2860ba5cf740a474dcab796dc63.png
                          data:
                            fromToken:
                              address: '0xbd80cfa9d93a87d1bb895f810ea348e496611cd4'
                              decimals: 18
                              symbol: FRACTION
                              name: Own a fraction
                              logoURI: https://etherscan.io/images/main/empty-token.png
                              isCustom: true
                            toToken:
                              address: '0xc0b2983a17573660053beeed6fdb1053107cf387'
                              decimals: 18
                              symbol: MIVA
                              name: Minerva Wallet SuperToken
                              logoURI: https://etherscan.io/images/main/empty-token.png
                              isCustom: true
                            toTokenAmount: '941511949935063841'
                            fromTokenAmount: '784479520361'
                            protocols:
                              - - - name: POLYGON_QUICKSWAP
                                    part: 100
                                    fromTokenAddress: '0xbd80cfa9d93a87d1bb895f810ea348e496611cd4'
                                    toTokenAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619'
                                - - name: POLYDEX_FINANCE
                                    part: 100
                                    fromTokenAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619'
                                    toTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                                - - name: POLYGON_QUICKSWAP
                                    part: 100
                                    fromTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                                    toTokenAddress: '0xc0b2983a17573660053beeed6fdb1053107cf387'
                            estimatedGas: 549386
                        integrator: fee-demo
                errors:
                  - errorType: NO_QUOTE
                    code: NO_POSSIBLE_ROUTE
                    action:
                      fromChainId: 42161
                      toChainId: 42161
                      fromToken:
                        address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8'
                        decimals: 6
                        symbol: USDC
                        coinKey: USDC
                        chainId: 42161
                        name: USDC
                        logoURI: >-
                          http://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
                        priceUSD: '1.001'
                      toToken:
                        address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9'
                        decimals: 6
                        symbol: USDT
                        coinKey: USDT
                        chainId: 42161
                        name: Tether USD
                        logoURI: http://get.celer.app/cbridge-icons/USDT.png"
                      fromAmount: '100000'
                      slippage: 0.003
      description: >-
        The resulting routes that can be used to realize the described transfer
        of tokens
    InvalidRoutesRequest:
      description: Invalid Routes Request
    InvalidRoutesNotFoundRequest:
      description: Requested `to` or `from` token was not found

````

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Populate a step with transaction data

> This endpoint expects a full `Step` object which usually is retrieved by calling the `/advanced/routes` endpoint and selecting the most suitable `Route`. Afterwards the transaction for every required `Step` can be retrieved using this endpoint.
**Attention**: This request is more complex and intended to be used via our [JavaScript SDK](https://docs.li.fi/integrate-li.fi-js-sdk/install-li.fi-sdk).



## OpenAPI

````yaml post /v1/advanced/stepTransaction
openapi: 3.0.2
info:
  title: LI.FI API
  version: 1.0.0
  description: >-
    LI.FI provides the best cross-chain swap across all liquidity pools and
    bridges.
servers:
  - url: https://li.quest
    description: LI.FI Production Environment
  - url: https://staging.li.quest
    description: LI.FI Staging Environment
security: []
paths:
  /v1/advanced/stepTransaction:
    post:
      tags:
        - advanced
      summary: Populate a step with transaction data
      description: >-
        This endpoint expects a full `Step` object which usually is retrieved by
        calling the `/advanced/routes` endpoint and selecting the most suitable
        `Route`. Afterwards the transaction for every required `Step` can be
        retrieved using this endpoint.

        **Attention**: This request is more complex and intended to be used via
        our [JavaScript
        SDK](https://docs.li.fi/integrate-li.fi-js-sdk/install-li.fi-sdk).
      parameters:
        - name: x-lifi-api-key
          description: >-
            Authentication header, register in the LI.FI Partner Portal
            (https://portal.li.fi/ ) to get your API Key.
          schema:
            type: string
          in: header
        - name: skipSimulation
          description: >-
            Parameter to skip transaction simulation. The quote will be returned
            faster but the transaction gas limit won't be accurate.
          schema:
            type: boolean
          in: query
          required: false
        - name: mayanNonEvmPermitSignature
          description: Mayan specific option to bridge from non-EVM chain to Hyperliquid
          schema:
            type: boolean
          in: query
          required: false
      requestBody:
        description: The step object
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Step'
            examples:
              StepRequestExample:
                value:
                  id: a8dc011a-f52d-4492-9e99-21de64b5453a
                  type: lifi
                  tool: 1inch
                  toolDetails:
                    key: 1inch
                    logoURI: >-
                      https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/oneinch.svg
                    name: 1inch
                  action:
                    fromChainId: 100
                    toChainId: 100
                    fromToken:
                      address: '0x0000000000000000000000000000000000000000'
                      symbol: xDai
                      decimals: 18
                      chainId: 100
                      name: xDai
                      coinKey: xDai
                      priceUSD: '1'
                      logoURI: >-
                        https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
                    toToken:
                      name: Minerva Wallet SuperToken
                      symbol: MIVA
                      coinKey: MIVA
                      decimals: 18
                      chainId: 100
                      priceUSD: '1'
                      logoURI: https://minerva.digital/i/MIVA-Token_200x200.png
                      address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                    fromAmount: '1000000000000000000'
                    slippage: 0.003
                    fromAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
                    toAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
                  estimate:
                    fromAmount: '1000000000000000000'
                    toAmount: '21922914496086353975'
                    toAmountMin: '21265227061203763356'
                    tool: 1inch
                    executionDuration: 30
                    approvalAddress: '0x1111111254fb6c44bac0bed2854e76f90643097d'
                    feeCosts: []
                    gasCosts:
                      - type: SEND
                        price: '1'
                        estimate: '252364'
                        limit: '315455'
                        amount: '252364'
                        amountUSD: '0.00'
                        token:
                          address: '0x0000000000000000000000000000000000000000'
                          symbol: xDai
                          decimals: 18
                          chainId: 100
                          name: xDai
                          coinKey: xDai
                          priceUSD: '1'
                          logoURI: >-
                            https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
                  integrator: fee-demo
                  includedSteps:
                    - id: a8dc011a-f52d-4492-9e99-21de64b5453a
                      type: swap
                      tool: 1inch
                      toolDetails:
                        key: 1inch
                        logoURI: >-
                          https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/oneinch.svg
                        name: 1inch
                      action:
                        fromChainId: 100
                        toChainId: 100
                        fromToken:
                          address: '0x0000000000000000000000000000000000000000'
                          symbol: xDai
                          decimals: 18
                          chainId: 100
                          name: xDai
                          coinKey: xDai
                          priceUSD: '1'
                          logoURI: >-
                            https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
                        toToken:
                          name: Minerva Wallet SuperToken
                          symbol: MIVA
                          coinKey: MIVA
                          decimals: 18
                          chainId: 100
                          priceUSD: '1'
                          logoURI: https://minerva.digital/i/MIVA-Token_200x200.png
                          address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                        fromAmount: '1000000000000000000'
                        slippage: 0.003
                        fromAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
                        toAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
                      estimate:
                        fromAmount: '1000000000000000000'
                        toAmount: '21922914496086353975'
                        toAmountMin: '21265227061203763356'
                        tool: 1inch
                        executionDuration: 30
                        approvalAddress: '0x1111111254fb6c44bac0bed2854e76f90643097d'
                        feeCosts: []
                        gasCosts:
                          - type: SEND
                            price: '1'
                            estimate: '252364'
                            limit: '315455'
                            amount: '252364'
                            amountUSD: '0.00'
                            token:
                              address: '0x0000000000000000000000000000000000000000'
                              symbol: xDai
                              decimals: 18
                              chainId: 100
                              name: xDai
                              coinKey: xDai
                              priceUSD: '1'
                              logoURI: >-
                                https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
        required: true
      responses:
        '200':
          $ref: '#/components/responses/StepResponse'
        '400':
          $ref: '#/components/responses/InvalidStepRequest'
components:
  schemas:
    Step:
      title: Root Type for Step
      description: Object that represents one step of a `Route`
      required:
        - id
        - action
        - tool
        - type
      type: object
      properties:
        id:
          description: Unique identifier of the step
          type: string
        type:
          description: >-
            The type of the step. `swap` executes a DEX swap on a single chain,
            `cross` bridges assets between chains, `lifi` runs LiFi's internal
            multi-action logic, and `protocol` represents protocol-level actions
            such as fee collection or vault interactions executed inside LiFi
            managed contracts.
          enum:
            - swap
            - cross
            - lifi
            - protocol
          type: string
        tool:
          description: The tool used for this step. E.g. `relay`
          type: string
        toolDetails:
          description: The details of the tool used for this step. E.g. `relay`
          type: object
          properties:
            key:
              description: The tool key
              type: string
            name:
              description: The tool name
              type: string
            logoURI:
              description: The tool logo URL
              type: string
        action:
          $ref: '#/components/schemas/Action'
          description: The action of the step
        estimate:
          $ref: '#/components/schemas/Estimate'
          description: The estimation for the step
        integrator:
          description: >-
            A string containing tracking information about the integrator of the
            API
          type: string
        includedSteps:
          type: array
          items:
            $ref: '#/components/schemas/IncludedStep'
        referrer:
          description: >-
            A string containing tracking information about the referrer of the
            integrator
          type: string
        execution:
          description: An objection containing status information about the execution
        transactionRequest:
          description: >-
            An ether.js TransactionRequest that can be triggered using a wallet
            provider.
            (https://docs.ethers.io/v5/api/providers/types/#providers-TransactionRequest)
      example:
        id: '0x48f0a2f93b0d0a9dab992d07c46bca38516c945101e8f8e08ca42af05b9e6aa9'
        type: cross
        tool: relay
        action:
          fromChainId: 100
          toChainId: 137
          fromToken:
            address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
            symbol: MIVA
            decimals: 18
            chainId: 100
            name: Minerva Wallet SuperToken
            coinKey: MIVA
            priceUSD: '0.04547537276751318'
            logoURI: ''
          toToken:
            address: '0xc0b2983a17573660053beeed6fdb1053107cf387'
            symbol: MIVA
            decimals: 18
            chainId: 137
            name: Minerva Wallet SuperToken
            coinKey: MIVA
            priceUSD: '0'
            logoURI: ''
          fromAmount: '1000000000000000000'
          slippage: 0.003
        estimate:
          fromAmount: '1000000000000000000'
          toAmount: '999500000000000000'
          toAmountMin: '999500000000000000'
          approvalAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
          feeCosts:
            - name: Gas Fee
              description: Covers gas expense for sending funds to user on receiving chain.
              percentage: '0'
              token:
                address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                symbol: MIVA
                decimals: 18
                chainId: 100
                name: Minerva Wallet SuperToken
                coinKey: MIVA
                priceUSD: '0.04547537276751318'
                logoURI: ''
              amount: '0'
              amountUSD: '0.00'
              included: true
            - name: Relay Fee
              description: Covers gas expense for claiming user funds on receiving chain.
              percentage: '0'
              token:
                address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                symbol: MIVA
                decimals: 18
                chainId: 100
                name: Minerva Wallet SuperToken
                coinKey: MIVA
                priceUSD: '0.04547537276751318'
                logoURI: ''
              amount: '0'
              amountUSD: '0.00'
              included: true
            - name: Router Fee
              description: Router service fee.
              percentage: '0.0005'
              token:
                address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                symbol: MIVA
                decimals: 18
                chainId: 100
                name: Minerva Wallet SuperToken
                coinKey: MIVA
                priceUSD: '0.04547537276751318'
                logoURI: ''
              amount: '500000000000000'
              amountUSD: '22737686383756.59'
              included: true
          gasCosts:
            - type: SEND
              price: '1.26'
              estimate: '140000'
              limit: '175000'
              amount: '176400'
              amountUSD: '0.00'
              token:
                address: '0x0000000000000000000000000000000000000000'
                symbol: xDai
                decimals: 18
                chainId: 100
                name: xDai
                coinKey: xDai
                priceUSD: '1'
                logoURI: >-
                  https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
          data:
            bid:
              user: '0x53F68B2186E4a4aB4dD976eD32de68db45BA360b'
              router: '0xeE2Ef40F688607CB23618d9312d62392786d13EB'
              initiator: '0x53F68B2186E4a4aB4dD976eD32de68db45BA360b'
              sendingChainId: 100
              sendingAssetId: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
              amount: '1000000000000000000'
              receivingChainId: 137
              receivingAssetId: '0xc0b2983a17573660053beeed6fdb1053107cf387'
              amountReceived: '999500000000000000'
              receivingAddress: '0x10fBFF9b9450D3A2d9d1612d6dE3726fACD8809E'
              transactionId: >-
                0x48f0a2f93b0d0a9dab992d07c46bca38516c945101e8f8e08ca42af05b9e6aa9
              expiry: 1643364189
              callDataHash: >-
                0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470
              callTo: '0x0000000000000000000000000000000000000000'
              encryptedCallData: 0x
              sendingChainTxManagerAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
              receivingChainTxManagerAddress: '0x6090De2EC76eb1Dc3B5d632734415c93c44Fd113'
              bidExpiry: 1643105290
            gasFeeInReceivingToken: '0'
            totalFee: '500000000000000'
            metaTxRelayerFee: '0'
            routerFee: '500000000000000'
        integrator: fee-demo
    Action:
      title: Root Type for Action
      description: Object describing what happens in a `Step`
      required:
        - fromToken
        - fromAmount
        - fromChainId
        - toChainId
        - toToken
      type: object
      properties:
        fromChainId:
          format: number
          description: The id of the chain where the transfer should start
          type: number
        fromAmount:
          description: The amount that should be transferred including all decimals
          type: string
        fromToken:
          $ref: '#/components/schemas/Token'
          description: The sending token
        toChainId:
          format: number
          description: The id of the chain where the transfer should end
          type: number
        toToken:
          $ref: '#/components/schemas/Token'
          description: The token that should be transferred to
        slippage:
          format: double
          description: The maximum allowed slippage
          type: number
        fromAddress:
          description: The sending wallet address
          type: string
        toAddress:
          description: The receiving wallet address
          type: string
      example:
        fromChainId: 100
        fromAmount: '1000000000000000000'
        fromToken:
          address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
          symbol: MIVA
          decimals: 18
          chainId: 100
          name: Minerva Wallet SuperToken
          coinKey: MIVA
          priceUSD: '0.0455272371751059'
          logoURI: ''
        toChainId: 137
        toToken:
          address: '0xc0b2983a17573660053beeed6fdb1053107cf387'
          symbol: MIVA
          decimals: 18
          chainId: 137
          name: Minerva Wallet SuperToken
          coinKey: MIVA
          priceUSD: '0'
          logoURI: ''
        slippage: 0.003
    Estimate:
      title: Root Type for Estimate
      description: An estimate for the current transfer
      required:
        - fromAmount
        - approvalAddress
        - toAmount
        - toAmountMin
        - tool
        - executionDuration
      type: object
      properties:
        tool:
          description: The tools that is being used for this step
          type: string
        fromAmount:
          description: The amount that should be transferred including all decimals
          type: string
        fromAmountUSD:
          description: The amount that should be transferred in USD equivalent
          type: string
        toAmount:
          description: >-
            The estimated resulting amount of the `toToken` including all
            decimals
          type: string
        toAmountMin:
          description: The minimal outcome of the transfer including all decimals
          type: string
        toAmountUSD:
          description: The estimated resulting amount of the `toToken` in USD equivalent
          type: string
        approvalAddress:
          description: The contract address for the approval
          type: string
        feeCosts:
          description: Fees included in the transfer
          type: array
          items:
            $ref: '#/components/schemas/FeeCost'
        gasCosts:
          description: Gas costs included in the transfer
          type: array
          items:
            $ref: '#/components/schemas/GasCost'
        executionDuration:
          description: The time needed to complete the following step
          type: number
        data:
          description: Arbitrary data that depends on the the used tool
          type: object
          properties:
            bid:
              type: object
              properties:
                user:
                  type: string
                router:
                  type: string
                initiator:
                  type: string
                sendingChainId:
                  format: number
                  type: number
                sendingAssetId:
                  type: string
                amount:
                  type: string
                receivingChainId:
                  format: number
                  type: number
                receivingAssetId:
                  type: string
                amountReceived:
                  type: string
                receivingAddress:
                  type: string
                transactionId:
                  type: string
                expiry:
                  format: number
                  type: number
                callDataHash:
                  type: string
                callTo:
                  type: string
                encryptedCallData:
                  type: string
                sendingChainTxManagerAddress:
                  type: string
                receivingChainTxManagerAddress:
                  type: string
                bidExpiry:
                  format: number
                  type: number
            bidSignature:
              type: string
            gasFeeInReceivingToken:
              type: string
            totalFee:
              type: string
            metaTxRelayerFee:
              type: string
            routerFee:
              type: string
      example:
        fromAmount: '1000000000000000000'
        toAmount: '999500000000000000'
        toAmountMin: '999500000000000000'
        tool: allbridge
        executionDuration: 60
        approvalAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
        feeCosts:
          - name: Gas Fee
            description: Covers gas expense for sending funds to user on receiving chain.
            percentage: '0'
            token:
              address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
              symbol: MIVA
              decimals: 18
              chainId: 100
              name: Minerva Wallet SuperToken
              coinKey: MIVA
              priceUSD: '0.0455272371751059'
              logoURI: ''
            amount: '0'
            amountUSD: '0.00'
            included: true
          - name: Relay Fee
            description: Covers gas expense for claiming user funds on receiving chain.
            percentage: '0'
            token:
              address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
              symbol: MIVA
              decimals: 18
              chainId: 100
              name: Minerva Wallet SuperToken
              coinKey: MIVA
              priceUSD: '0.0455272371751059'
              logoURI: ''
            amount: '0'
            amountUSD: '0.00'
            included: true
          - name: Router Fee
            description: Router service fee.
            percentage: '0.0005'
            token:
              address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
              symbol: MIVA
              decimals: 18
              chainId: 100
              name: Minerva Wallet SuperToken
              coinKey: MIVA
              priceUSD: '0.0455272371751059'
              logoURI: ''
            amount: '500000000000000'
            amountUSD: '22763618587552.95'
            included: true
        gasCosts:
          - type: SEND
            price: '1.22'
            estimate: '140000'
            limit: '175000'
            amount: '170800'
            amountUSD: '0.00'
            token:
              address: '0x0000000000000000000000000000000000000000'
              symbol: xDai
              decimals: 18
              chainId: 100
              name: xDai
              coinKey: xDai
              priceUSD: '1'
              logoURI: >-
                https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
        data:
          bid:
            user: '0x10fBFF9b9450D3A2d9d1612d6dE3726fACD8809E'
            router: '0xeE2Ef40F688607CB23618d9312d62392786d13EB'
            initiator: '0x10fBFF9b9450D3A2d9d1612d6dE3726fACD8809E'
            sendingChainId: 100
            sendingAssetId: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
            amount: '1000000000000000000'
            receivingChainId: 137
            receivingAssetId: '0xc0b2983a17573660053beeed6fdb1053107cf387'
            amountReceived: '999500000000000000'
            receivingAddress: '0x10fBFF9b9450D3A2d9d1612d6dE3726fACD8809E'
            transactionId: '0x9f54c1764e19367c44706f4a6253941b81e9ec524af5590091aa8ae67e7644ed'
            expiry: 1643369368
            callDataHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
            callTo: '0x0000000000000000000000000000000000000000'
            encryptedCallData: 0x
            sendingChainTxManagerAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93'
            receivingChainTxManagerAddress: '0x6090De2EC76eb1Dc3B5d632734415c93c44Fd113'
            bidExpiry: 1643110469
          gasFeeInReceivingToken: '0'
          totalFee: '500000000000000'
          metaTxRelayerFee: '0'
          routerFee: '500000000000000'
    IncludedStep:
      title: Root Type for Internal Step
      description: Object that represents one step of an `IncludedSteps` array in `Route`
      required:
        - id
        - action
        - estimate
        - tool
        - type
        - toolDetails
      type: object
      properties:
        id:
          description: Unique identifier of the step
          type: string
        type:
          description: >-
            The type of the step. `swap` executes a DEX swap on a single chain,
            `cross` bridges assets between chains, `lifi` runs LiFi's internal
            multi-action logic, and `protocol` represents protocol-level actions
            such as fee collection or vault interactions executed inside LiFi
            managed contracts.
          enum:
            - swap
            - cross
            - lifi
            - protocol
          type: string
        tool:
          description: The tool used for this step. E.g. `allbridge`
          type: string
        toolDetails:
          description: The details of the tool used for this step. E.g. `allbridge`
          type: object
          properties:
            key:
              description: The tool key
              type: string
            name:
              description: The tool name
              type: string
            logoURI:
              description: The tool logo URL
              type: string
        action:
          $ref: '#/components/schemas/Action'
        estimate:
          $ref: '#/components/schemas/Estimate'
    Token:
      title: Root Type for Token
      description: Representation of a Token
      required:
        - address
        - chainId
        - decimals
        - name
        - symbol
      type: object
      properties:
        address:
          description: Address of the token
          type: string
        decimals:
          format: number
          description: Number of decimals the token uses
          type: number
        symbol:
          description: Symbol of the token
          type: string
        chainId:
          format: number
          description: Id of the token's chain
          type: number
        coinKey:
          description: Identifier for the token
          type: string
        name:
          description: Name of the token
          type: string
        logoURI:
          description: Logo of the token
          type: string
        priceUSD:
          description: Token price in USD
          type: string
      example:
        address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
        symbol: DAI
        decimals: 18
        chainId: 137
        name: (PoS) Dai Stablecoin
        coinKey: DAI
        priceUSD: '1'
        logoURI: >-
          https://static.debank.com/image/matic_token/logo_url/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/549c4205dbb199f1b8b03af783f35e71.png
    FeeCost:
      title: Root Type for FeeCost
      description: Fees included in the transfer
      required:
        - token
        - percentage
        - name
        - amountUSD
        - included
      type: object
      properties:
        name:
          description: Name of the fee
          type: string
        description:
          description: Description of the fee costs
          type: string
        percentage:
          description: Percentage of how much fees are taken
          type: string
        token:
          $ref: '#/components/schemas/Token'
          description: The `Token` in which the fees are taken
        amount:
          description: The amount of fees
          type: string
        amountUSD:
          description: The amount of fees in USD
          type: string
        included:
          description: Whether fee is included into transfer's `fromAmount`
          type: boolean
      example:
        name: Gas Fee
        description: Covers gas expense for sending funds to user on receiving chain.
        percentage: '0'
        token:
          address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
          symbol: MIVA
          decimals: 18
          chainId: 100
          name: Minerva Wallet SuperToken
          coinKey: MIVA
          priceUSD: '0.0455272371751059'
          logoURI: ''
        amount: '0'
        amountUSD: '0.00'
    GasCost:
      title: Root Type for GasCost
      description: Gas costs included in the transfer
      required:
        - token
        - type
        - amount
      type: object
      properties:
        type:
          description: Can be one of `SUM`, `APPROVE` or `SEND`
          type: string
        price:
          description: Suggested current standard price for the chain
          type: string
        estimate:
          description: Estimation how much gas will be needed
          type: string
        limit:
          description: Suggested gas limit
          type: string
        amount:
          description: Amount of the gas cost
          type: string
        amountUSD:
          description: Amount of the gas cost in USD
          type: string
        token:
          $ref: '#/components/schemas/Token'
          description: The used gas token
      example:
        type: SEND
        price: '1.22'
        estimate: '140000'
        limit: '175000'
        amount: '170800'
        amountUSD: '0.00'
        token:
          address: '0x0000000000000000000000000000000000000000'
          symbol: xDai
          decimals: 18
          chainId: 100
          name: xDai
          coinKey: xDai
          priceUSD: '1'
          logoURI: >-
            https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
  responses:
    StepResponse:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Step'
          examples:
            StepResponseExample:
              value:
                id: a8dc011a-f52d-4492-9e99-21de64b5453a
                type: lifi
                tool: 1inch
                toolDetails:
                  key: 1inch
                  logoURI: >-
                    https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/oneinch.svg
                  name: 1inch
                action:
                  fromChainId: 100
                  toChainId: 100
                  fromToken:
                    address: '0x0000000000000000000000000000000000000000'
                    symbol: xDai
                    decimals: 18
                    chainId: 100
                    name: xDai
                    coinKey: xDai
                    priceUSD: '1'
                    logoURI: >-
                      https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
                  toToken:
                    name: Minerva Wallet SuperToken
                    symbol: MIVA
                    coinKey: MIVA
                    decimals: 18
                    chainId: 100
                    logoURI: https://minerva.digital/i/MIVA-Token_200x200.png
                    address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                  fromAmount: '1000000000000000000'
                  slippage: 0.003
                  fromAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
                  toAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
                estimate:
                  fromAmount: '1000000000000000000'
                  toAmount: '21922914496086353975'
                  toAmountMin: '21265227061203763356'
                  approvalAddress: '0x1111111254fb6c44bac0bed2854e76f90643097d'
                  feeCosts: []
                  gasCosts:
                    - type: SEND
                      price: '1'
                      estimate: '252364'
                      limit: '315455'
                      amount: '252364'
                      amountUSD: '0.00'
                      token:
                        address: '0x0000000000000000000000000000000000000000'
                        symbol: xDai
                        decimals: 18
                        chainId: 100
                        name: xDai
                        coinKey: xDai
                        priceUSD: '1'
                        logoURI: >-
                          https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
                  data:
                    fromToken:
                      name: xDAI
                      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                      symbol: xDAI
                      decimals: 18
                      logoURI: >-
                        https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png
                    toToken:
                      name: Minerva Wallet SuperToken
                      address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                      symbol: MIVA
                      decimals: 18
                      logoURI: https://minerva.digital/i/MIVA-Token_200x200.png
                    toTokenAmount: '21922914496086353975'
                    fromTokenAmount: '1000000000000000000'
                    protocols:
                      - - - name: GNOSIS_HONEYSWAP
                            part: 100
                            fromTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                            toTokenAddress: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                    estimatedGas: 252364
                integrator: fee-demo
                transactionRequest:
                  from: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
                  to: '0x1111111254fb6c44bac0bed2854e76f90643097d'
                  chainId: 100
                  data: 0x...
                  value: '0x0de0b6b3a7640000'
                  gasPrice: '0xb2d05e00'
                  gasLimit: '0x0e9cb2'
                includedSteps:
                  - id: a8dc011a-f52d-4492-9e99-21de64b5453a
                    type: swap
                    tool: 1inch
                    toolDetails:
                      key: 1inch
                      logoURI: >-
                        https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/exchanges/oneinch.svg
                      name: 1inch
                    action:
                      fromChainId: 100
                      toChainId: 100
                      fromToken:
                        address: '0x0000000000000000000000000000000000000000'
                        symbol: xDai
                        decimals: 18
                        chainId: 100
                        name: xDai
                        coinKey: xDai
                        priceUSD: '1'
                        logoURI: >-
                          https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
                      toToken:
                        name: Minerva Wallet SuperToken
                        symbol: MIVA
                        coinKey: MIVA
                        decimals: 18
                        chainId: 100
                        logoURI: https://minerva.digital/i/MIVA-Token_200x200.png
                        address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                      fromAmount: '1000000000000000000'
                      slippage: 0.003
                      fromAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
                      toAddress: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0'
                    estimate:
                      fromAmount: '1000000000000000000'
                      toAmount: '21922914496086353975'
                      toAmountMin: '21265227061203763356'
                      approvalAddress: '0x1111111254fb6c44bac0bed2854e76f90643097d'
                      feeCosts: []
                      gasCosts:
                        - type: SEND
                          price: '1'
                          estimate: '252364'
                          limit: '315455'
                          amount: '252364'
                          amountUSD: '0.00'
                          token:
                            address: '0x0000000000000000000000000000000000000000'
                            symbol: xDai
                            decimals: 18
                            chainId: 100
                            name: xDai
                            coinKey: xDai
                            priceUSD: '1'
                            logoURI: >-
                              https://static.debank.com/image/xdai_token/logo_url/xdai/1207e67652b691ef3bfe04f89f4b5362.png
                      data:
                        fromToken:
                          name: xDAI
                          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                          symbol: xDAI
                          decimals: 18
                          logoURI: >-
                            https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png
                        toToken:
                          name: Minerva Wallet SuperToken
                          address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                          symbol: MIVA
                          decimals: 18
                          logoURI: https://minerva.digital/i/MIVA-Token_200x200.png
                        toTokenAmount: '21922914496086353975'
                        fromTokenAmount: '1000000000000000000'
                        protocols:
                          - - - name: GNOSIS_HONEYSWAP
                                part: 100
                                fromTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                                toTokenAddress: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51'
                        estimatedGas: 252364
      description: The step populated with the transaction data
    InvalidStepRequest:
      description: Invalid Step Request

````

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.li.fi/llms.txt
> Use this file to discover all available pages before exploring further.

# Parse transaction call data (BETA)

> This endpoint allows to pass transaction call data. It will then parse the call data based on known and on-chain ABIs to provide a JSON overview of the internal transaction information.



## OpenAPI

````yaml get /v1/calldata/parse
openapi: 3.0.2
info:
  title: LI.FI API
  version: 1.0.0
  description: >-
    LI.FI provides the best cross-chain swap across all liquidity pools and
    bridges.
servers:
  - url: https://li.quest
    description: LI.FI Production Environment
  - url: https://staging.li.quest
    description: LI.FI Staging Environment
security: []
paths:
  /v1/calldata/parse:
    parameters:
      - name: chainId
        description: The chainId that the transaction is built for (or has been sent on)
        schema:
          type: string
        in: query
        required: false
      - name: callData
        description: The call data to parse
        schema:
          type: string
        in: query
        required: true
    get:
      summary: Parse transaction call data (BETA)
      description: >-
        This endpoint allows to pass transaction call data. It will then parse
        the call data based on known and on-chain ABIs to provide a JSON
        overview of the internal transaction information.
      parameters:
        - name: x-lifi-api-key
          description: >-
            Authentication header, register in the LI.FI Partner Portal
            (https://portal.li.fi/ ) to get your API Key.
          schema:
            type: string
          in: header
      responses:
        '200':
          $ref: '#/components/responses/ParsedCallDataResponse'
components:
  responses:
    ParsedCallDataResponse:
      description: |-
        [
            {
                "functionName": "swapTokensGeneric",
                "functionParameters": {
                    "_transactionId": "0x40b0592501720ece27ef8614385fbef4bdbb5b2050ebaaa3563e72fee959e249",
                    "_integrator": "jumper.exchange",
                    "_referrer": "0x0000000000000000000000000000000000000000",
                    "_receiver": "0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0",
                    "_minAmount": "4640629752435722515",
                    "_swapData": [
                        {
                            "callTo": "0xDef1C0ded9bec7F1a1670819833240f027b25EfF",
                            "approveTo": "0xDef1C0ded9bec7F1a1670819833240f027b25EfF",
                            "sendingAssetId": "0x0000000000000000000000000000000000000000",
                            "receivingAssetId": "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
                            "fromAmount": "5000000000000000000",
                            "callData": "0x415565b0000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000008f3cf7ad23cd3cadbd9735aff958023239c6a0630000000000000000000000000000000000000000000000004563918244f400000000000000000000000000000000000000000000000000004066d42c380a491300000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000004a0000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000040000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000004563918244f40000000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000340000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf12700000000000000000000000008f3cf7ad23cd3cadbd9735aff958023239c6a06300000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000002c00000000000000000000000000000000000000000000000004563918244f40000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000012556e69737761705633000000000000000000000000000000000000000000000000000000000000004563918244f400000000000000000000000000000000000000000000000000004066d42c380a4913000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000e592427a0aece92de3edee1f18e0157c058615640000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000002b0d500b1d8e8ef31e21c99d1db9a6444d3adf12700001f48f3cf7ad23cd3cadbd9735aff958023239c6a063000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000000000000000000869584cd00000000000000000000000026c16b6926637cf5eb62c42991b4166add66ff9e0000000000000000000000000000000000000000000000d3adebcfec6458a4f9",
                            "requiresDeposit": true
                        },
                        {
                            "callTo": "0x464eF665Ea203d142F5aa25e12312290fA8917ec",
                            "approveTo": "0x464eF665Ea203d142F5aa25e12312290fA8917ec",
                            "sendingAssetId": "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
                            "receivingAssetId": "0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2",
                            "fromAmount": "4640629752435722515",
                            "callData": [
                                {
                                    "functionName": "upgrade",
                                    "functionParameters": {
                                        "superToken": "0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2",
                                        "account": "0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE",
                                        "amount": "4640629752435722515"
                                    }
                                }
                            ],
                            "requiresDeposit": false
                        }
                    ]
                }
            }
        ]

````
