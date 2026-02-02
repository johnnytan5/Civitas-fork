# Technical Documentation Index

This directory contains technical documentation for external integrations and protocols used in the project.

## Integrations

### Ethereum Name Service (ENS)
-   **[Smart Contracts](ens/ens-smart-contract.md):** Core contract architecture, resolution process, registries, and detailed solidity examples.
-   **[General Docs](ens/ens-docs.md):** High-level overview and guides.

### LI.FI (Cross-Chain Bridging & Swapping)
-   **[API Reference](li.fi/lifi-api.md):** REST API endpoints, authentication, rate limits, and error codes.
-   **[SDK Guide](li.fi/lifi-sdk.md):** Using the LI.FI JS/TS SDK.
-   **[Documentation](li.fi/lifi-docs.md):** General documentation and concepts.

## Usage for AI Agents
These files are referenced by `.cursor/rules/` to provide context during coding tasks.
- For ENS related tasks, the agent will look at `ens/`
- For Bridging/LI.FI tasks, the agent will look at `li.fi/`
