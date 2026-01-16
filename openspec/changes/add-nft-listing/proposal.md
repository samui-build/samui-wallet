# Change: Add NFT Listing to Wallet Portfolio

## Why

Users need the ability to view their NFT collections within the wallet. Currently, the portfolio only displays token balances (SOL and SPL tokens), but NFTs are a critical part of the Solana ecosystem and user assets. Without NFT visibility, users must use external tools or explorers to view their NFT holdings, creating a fragmented experience.

## What Changes

- Add new "NFTs" tab to the portfolio view alongside existing "Tokens" and "Activity" tabs
- Implement NFT data fetching from Solana blockchain using Metaplex standards
- Create UI components for displaying NFT collections in grid and list views
- Add NFT detail modal showing metadata, attributes, and actions
- Support Metaplex Token Metadata Program standard (both legacy and pNFT)
- Display NFT images, names, collections, and basic metadata
- Add loading states and error handling for NFT fetching
- Implement caching strategy for NFT metadata to improve performance

## Impact

### Affected Specs
- `portfolio` - New NFT tab, NFT display components, and NFT-specific data access hooks
- `solana-client` - New functions for fetching NFT data from Metaplex Token Metadata Program

### Affected Code
- `packages/portfolio/src/portfolio-routes.tsx` - Add NFTs tab to tab routes
- `packages/portfolio/src/portfolio-feature-tab-nfts.tsx` - NEW: Main NFT tab component
- `packages/portfolio/src/data-access/use-get-nft-accounts.ts` - NEW: Hook to fetch NFT token accounts
- `packages/portfolio/src/data-access/use-get-nft-metadata.ts` - NEW: Hook to fetch and parse NFT metadata
- `packages/portfolio/src/ui/portfolio-ui-nft-grid.tsx` - NEW: Grid view for NFTs
- `packages/portfolio/src/ui/portfolio-ui-nft-item.tsx` - NEW: Individual NFT card component
- `packages/portfolio/src/ui/portfolio-ui-nft-detail-modal.tsx` - NEW: NFT detail modal
- `packages/portfolio/src/ui/portfolio-ui-nft-grid-skeleton.tsx` - NEW: Loading skeleton for NFT grid
- `packages/solana-client/src/get-nft-accounts-for-owner.ts` - NEW: Fetch NFT token accounts
- `packages/solana-client/src/get-nft-metadata.ts` - NEW: Parse Metaplex metadata
- `packages/solana-client/src/fetch-nft-json-metadata.ts` - NEW: Fetch off-chain JSON metadata
- `packages/i18n/` - Add translation keys for NFT-related UI text

### Database Changes
None required initially. NFT data will be fetched on-demand and cached in React Query.

### Breaking Changes
None. This is an additive feature that does not modify existing functionality.

## User Stories

1. As a wallet user, I want to see all my NFTs in one place so I can easily view my collection
2. As a wallet user, I want to see NFT images and names so I can identify them visually
3. As a wallet user, I want to click on an NFT to see its full metadata and attributes
4. As a wallet user, I want the NFT tab to load quickly even with large collections
5. As a developer, I want to reuse NFT fetching logic across different parts of the application

## Non-Goals (Future Enhancements)

- NFT sending/transferring (separate feature)
- NFT marketplace integration
- NFT collection management (grouping, favoriting)
- NFT verification/authenticity indicators
- Compressed NFT (cNFT) support
- NFT staking or utility integrations
