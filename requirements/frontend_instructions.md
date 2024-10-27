# Project overview

-Use this guide to modify and add pages the oisy wallet application frontend, which is a Internet Computer Protocol application which allows a user to self custody crypto on the Ethereum or Bitcoin blockchains. Use my designs as a guide for how the front end should look and stick to the theme established in the current implimentation.

+ 1. The frontend is built with Svelte and TypeScript

+ 2. Main application code is organized under src/frontend/src/

+ 3. Modular structure with separate sections for different cryptocurrencies (btc, eth, icp)

+ 4. Route handling using SvelteKit's file-based routing system

+ 5. Static assets are properly organized under the static directory

+ 6. Configuration files at the root level for various tools (TypeScript, Vite, Tailwind, etc.)
# Feature requirements

- 1. Take an mobile first design approach. This application should appear nicely as a PWA on a browser or mobile browser.

- 2. First home page is a list of accounts. Looks like Apple Wallet, where each card is a separate account.

- 3. There are 4 types of accounts. A Checking, Savings, Investment, and Social. There is an empty card with a plus button, that allows someone to open a new account.

- 4. The bottom has a bar with 4 options: Home, Send/Receive, Social, and Profile.

- 5. The Home button comes back to this home page with all the accounts.

- 6. pay/receive will be a page with a couple options like Pay or Receive as bubble buttons. A list of contacts below that (sorted by favorites first, then recent or most frequent contacts first)

- 7. The Social button opens up a page that connects to Warpcast (or other social apps). It contains basic functionality to see messages and respond or post something.

- 8. The Profile button opens up a page with my personal info. Here I have my basic PII info first, then I have NFTs, badges, POAPs, and things related to decentralized identity. Think about the best way to organize this. We have both PII information, and then badges which show various credentials, connected websites and apps, and apps which I am sharing credentials with.

- 9. The Home page has a 'settings' on the top right corner, which opens a page to manage security, 2FA, other web3 related features. One setting to include is a 'set preferred networks' and 'set preferred currency' option which allows user to select which Ethereum network is used to host the accounts, and which currency to display the information (like dollars)

- 10. When I click on an account, I have a page showing the type of account, balance information, Actions ribbon for things like send, receive, deposit, withdraw, view statements. Then I have upcoming and recent transactions listed below. Each account type might have different special options. A Savings account has the 'Stake' option. Investment account has 'DeFi' option.


# Relevant docs

requirements/oisy mobile screenshot.png
requirements/images_of_frontend_designs.pdf
# Oisy Wallet Project Structure

```
oisy-wallet/
├── licenses/
├── node_modules/
├── out/
├── requirements/
│   └── frontend_instructions.md
├── scripts/
├── src/
│   ├── backend/
│   ├── cycles_ledger_client/
│   ├── declarations/
│   └── frontend/
│       └── src/
│           ├── btc/
│           │   ├── components/
│           │   │   ├── core/
│           │   │   ├── receive/
│           │   │   ├── send/
│           │   │   ├── tokens/
│           │   │   └── transactions/
│           │   ├── constants/
│           │   ├── derived/
│           │   ├── schedulers/
│           │   ├── services/
│           │   ├── stores/
│           │   ├── types/
│           │   ├── utils/
│           │   └── workers/
│           ├── eth/
│           │   ├── assets/
│           │   ├── components/
│           │   │   ├── core/
│           │   │   ├── fee/
│           │   │   ├── receive/
│           │   │   ├── send/
│           │   │   ├── tokens/
│           │   │   ├── transactions/
│           │   │   └── wallet-connect/
│           │   ├── constants/
│           │   ├── derived/
│           │   ├── providers/
│           │   ├── rest/
│           │   ├── services/
│           │   ├── stores/
│           │   ├── types/
│           │   └── utils/
│           ├── icp/
│           │   ├── api/
│           │   ├── assets/
│           │   ├── components/
│           │   ├── constants/
│           │   ├── derived/
│           │   ├── schedulers/
│           │   ├── services/
│           │   ├── stores/
│           │   ├── types/
│           │   ├── utils/
│           │   └── workers/
│           ├── icp-eth/
│           │   ├── api/
│           │   ├── assets/
│           │   ├── components/
│           │   ├── config/
│           │   ├── derived/
│           │   ├── services/
│           │   ├── stores/
│           │   ├── types/
│           │   └── utils/
│           ├── lib/
│           │   ├── actors/
│           │   ├── api/
│           │   ├── assets/
│           │   ├── canisters/
│           │   ├── components/
│           │   ├── config/
│           │   ├── constants/
│           │   ├── derived/
│           │   ├── enums/
│           │   ├── i18n/
│           │   ├── rest/
│           │   ├── schedulers/
│           │   ├── services/
│           │   ├── stores/
│           │   ├── styles/
│           │   ├── types/
│           │   ├── utils/
│           │   └── workers/
│           ├── routes/
│           │   ├── (app)/
│           │   ├── (public)/
│           │   ├── (sign)/
│           │   ├── sitemap.xml/
│           │   ├── +layout.svelte
│           │   └── +layout.ts
│           ├── tests/
│           │   ├── btc/
│           │   ├── eth/
│           │   ├── icp/
│           │   ├── lib/
│           │   ├── mocks/
│           │   ├── utils/
│           │   └── tsconfig.json
│           ├── static/
│           │   ├── .well-known/
│           │   ├── favicons/
│           │   ├── fonts/
│           │   ├── icons/
│           │   ├── images/
│           │   ├── .ic-assets.json
│           │   ├── favicon.ico
│           │   ├── manifest.webmanifest
│           │   └── robots.txt
│           ├── app.d.ts
│           ├── app.html
│           └── global.d.ts
├── target/
├── .env.example
├── .gitignore
├── Cargo.toml
├── dfx.json
├── package.json
├── svelte.config.js
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

This ASCII tree structure represents the complete organization of the Oisy Wallet project. Key architectural points:

1. Modular Architecture:

   - Separate modules for different cryptocurrencies (btc, eth, icp, icp-eth)
   - Each crypto module follows a consistent structure with components, services, stores, etc.

2. Component Organization:

   - Core components
   - Transaction-specific components (send/receive)
   - Token management
   - Wallet connectivity features

3. Shared Infrastructure:

   - Common utilities and components in `lib/`
   - Shared types, services, and stores
   - Internationalization support
   - Asset management

4. Testing Structure:

   - Separate test directories for each module
   - Mock data and utilities for testing
   - Dedicated test configuration

5. Route Organization:
   - Public routes
   - App-specific routes
   - Authentication routes (sign)
   - Layout management
