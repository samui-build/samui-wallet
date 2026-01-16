## Context

The Samui wallet currently displays tokens (SOL and SPL tokens) but does not show NFTs owned by user accounts. NFTs on Solana follow the Metaplex Token Metadata Program standard, which stores metadata both on-chain and off-chain (via URI to JSON). This change adds NFT listing capability to provide users with visibility into their NFT holdings.

### Stakeholders
- **End Users**: Wallet users who own NFTs and want to view them
- **Developers**: Need reusable NFT data fetching utilities
- **Maintainers**: Must ensure performance with large collections

### Constraints
- Must support Metaplex Token Metadata Program (v1.x standard)
- Should handle large collections (100+ NFTs) without performance degradation
- Must work with existing portfolio architecture (React Query, tab-based navigation)
- Should gracefully handle missing/malformed metadata
- Image loading must not block UI rendering

## Goals / Non-Goals

### Goals
- Display NFTs in an intuitive, visual grid layout
- Fetch and parse Metaplex Token Metadata Program data correctly
- Provide fast loading experience with proper caching
- Support both on-chain and off-chain metadata
- Handle errors gracefully (missing images, failed fetches, malformed data)
- Follow existing code patterns in the portfolio package

### Non-Goals
- NFT transferring/sending (separate feature)
- Compressed NFT (cNFT) support using Bubblegum program
- Marketplace integration or price discovery
- NFT collection management features (folders, favorites)
- Metaplex Core standard support (future enhancement)

## Decisions

### Decision 1: Use Metaplex Token Metadata Program v1.x
**Rationale**: The v1.x standard is the most widely adopted NFT standard on Solana. Most existing NFTs use this format. We will support the legacy Token Metadata Program, which covers the vast majority of NFTs.

**Alternatives Considered**:
- Metaplex Core: Newer standard with better performance, but limited adoption
- Multiple standards: Too complex for initial implementation
- Third-party APIs (Helius, SimpleHash): Adds external dependency and cost

**Trade-off**: We won't support newer standards initially, but this can be added incrementally.

### Decision 2: Fetch NFT Data Client-Side via RPC
**Rationale**: Aligns with existing architecture where all blockchain data is fetched client-side through the Solana RPC. Keeps the wallet decentralized and doesn't require backend infrastructure.

**Alternatives Considered**:
- Backend API with indexer: Faster but requires infrastructure
- Third-party indexing service: Cost and dependency concerns

**Trade-off**: Initial load may be slower for accounts with many NFTs, but we mitigate this with caching and parallel fetching.

### Decision 3: React Query for Caching with 30-Minute Cache Time
**Rationale**: NFT metadata rarely changes, so aggressive caching improves UX. React Query already used throughout the portfolio package. 30 minutes balances freshness with performance.

**Cache Strategy**:
- `cacheTime: 30 minutes` - Keep data in cache for 30 minutes
- `staleTime: 5 minutes` - Consider data fresh for 5 minutes
- `retry: 2` - Retry failed requests twice
- Parallel fetching for multiple NFTs with concurrency limit

**Trade-off**: Users won't see immediate updates if NFT metadata changes off-chain, but this is acceptable for the vast majority of use cases.

### Decision 4: Grid Layout as Default View
**Rationale**: NFTs are inherently visual assets. A grid layout showcases images effectively and is the standard pattern in NFT wallets and marketplaces.

**Layout Details**:
- Responsive grid: 2 columns (mobile), 3 columns (tablet), 4 columns (desktop)
- Square aspect ratio cards with image, name, and collection
- Lazy loading for images
- Click to open detail modal

**Alternative Considered**: List view with larger cards. Rejected because it shows fewer NFTs per screen.

### Decision 5: Lazy Image Loading with Fallback
**Rationale**: NFT images can be large and hosted on various services (IPFS, Arweave, CDNs). Lazy loading prevents blocking the UI while images load. Fallback ensures broken images don't break the layout.

**Implementation**:
- Use native `loading="lazy"` attribute
- Fallback to placeholder image on error
- Show spinner while image loads
- Support IPFS gateway resolution (ipfs:// to https:// gateway)

### Decision 6: No Persistent Storage (Database) for NFTs Initially
**Rationale**: NFT data is fetched from blockchain and cached in memory (React Query). Adding database storage adds complexity without significant benefit for initial release. Users can refetch NFTs quickly from RPC.

**Future Consideration**: If performance becomes an issue, we can add IndexedDB persistence.

## Implementation Details

### NFT Data Flow
1. User switches to NFTs tab → triggers `use-get-nft-accounts` hook
2. Hook calls `get-nft-accounts-for-owner` → fetches token accounts filtered by Metaplex program
3. For each NFT account → calls `get-nft-metadata` to deserialize on-chain metadata
4. For each metadata with URI → calls `fetch-nft-json-metadata` to get off-chain JSON
5. Combine on-chain + off-chain data → return to UI
6. UI renders grid with NFT cards → lazy loads images

### Metaplex Token Metadata Structure
On-chain metadata includes:
- `mint` - NFT token mint address
- `updateAuthority` - Authority that can update metadata
- `name` - NFT name (max 32 bytes)
- `symbol` - Symbol (max 10 bytes)
- `uri` - Link to off-chain JSON metadata (max 200 bytes)
- `sellerFeeBasisPoints` - Royalty percentage
- `creators` - Array of creators with verification status

Off-chain JSON metadata (from URI) includes:
- `name` - Full name
- `description` - Description
- `image` - Image URL
- `attributes` - Array of traits
- `properties` - Additional metadata

### Error Handling Strategy
- **Missing metadata account**: Skip NFT, log warning
- **Malformed on-chain data**: Skip NFT, log error
- **Failed URI fetch (404, timeout)**: Show NFT with placeholder image
- **Invalid JSON structure**: Show NFT with on-chain data only
- **Image load failure**: Show placeholder image
- **Network errors**: Show error state with retry button

### Performance Considerations
- Fetch NFT accounts in single RPC call (batched)
- Fetch metadata for up to 10 NFTs in parallel (avoid overwhelming RPC)
- Cache all fetched data for 30 minutes
- Lazy load images to prevent layout shift
- Virtual scrolling NOT needed initially (most users have <100 NFTs)

## Risks / Trade-offs

### Risk: Slow Initial Load for Large Collections
**Impact**: Users with 100+ NFTs may experience 5-10 second load times.

**Mitigation**:
- Show skeleton loading state immediately
- Fetch and display NFTs in batches (show first 20 quickly)
- Implement progressive loading (load more as user scrolls)
- Cache aggressively to speed up subsequent visits

### Risk: IPFS Gateway Reliability
**Impact**: NFTs using `ipfs://` URIs may fail to load if gateway is down.

**Mitigation**:
- Use reliable public IPFS gateway (e.g., Cloudflare)
- Implement fallback to alternative gateways
- Show placeholder image on failure

### Risk: Malformed or Missing Metadata
**Impact**: Some NFTs may not display correctly if metadata is invalid.

**Mitigation**:
- Validate JSON schema before parsing
- Gracefully handle missing fields
- Show partial information when available
- Log errors for debugging

### Risk: RPC Rate Limiting
**Impact**: Fetching many NFTs may hit RPC rate limits on public endpoints.

**Mitigation**:
- Implement request throttling (max 10 concurrent requests)
- Add retry logic with exponential backoff
- Consider adding RPC endpoint configuration for power users

## Migration Plan

No migration required. This is a new feature that does not affect existing data or functionality.

**Rollout**:
1. Merge feature to main branch
2. Deploy to staging environment
3. Test with various accounts (0 NFTs, few NFTs, many NFTs)
4. Deploy to production
5. Monitor error logs for metadata parsing issues
6. Gather user feedback

**Rollback**: If critical issues arise, remove NFTs tab from routes. No data loss or corruption risk.

## Open Questions

1. **Should we support compressed NFTs (cNFTs) in this initial release?**
   - **Recommendation**: No, defer to future enhancement. Adds significant complexity.

2. **Should we group NFTs by collection?**
   - **Recommendation**: No, show flat grid initially. Grouping can be added later.

3. **Should we support NFT refreshing (manual re-fetch)?**
   - **Recommendation**: Yes, add pull-to-refresh or refresh button to force re-fetch.

4. **Should we show NFT floor prices or valuations?**
   - **Recommendation**: No, requires marketplace API integration. Future enhancement.

5. **Should we support different grid sizes or view modes?**
   - **Recommendation**: Start with fixed grid, add customization if users request it.
