## ADDED Requirements

### Requirement: NFT Portfolio Display
The portfolio SHALL provide a dedicated NFT tab that displays all NFTs owned by the active account in a visual grid layout.

#### Scenario: User views NFT tab
- **GIVEN** the user has an active account with NFTs
- **WHEN** the user navigates to the NFTs tab
- **THEN** all NFTs owned by the account are displayed in a responsive grid
- **AND** each NFT shows its image, name, and collection name
- **AND** the grid uses 2 columns on mobile, 3 on tablet, 4 on desktop

#### Scenario: User views NFT tab with no NFTs
- **GIVEN** the user has an active account with no NFTs
- **WHEN** the user navigates to the NFTs tab
- **THEN** an empty state message is displayed
- **AND** the message says "No NFTs found in this account"

#### Scenario: User switches accounts
- **GIVEN** the user is viewing the NFTs tab
- **WHEN** the user switches to a different active account
- **THEN** the NFT grid updates to show the new account's NFTs
- **AND** a loading state is shown during the fetch

### Requirement: NFT Data Fetching
The portfolio SHALL fetch NFT data from the Solana blockchain using the Metaplex Token Metadata Program standard.

#### Scenario: Fetch NFTs for active account
- **GIVEN** the user has an active account
- **WHEN** the NFTs tab is loaded
- **THEN** the system fetches all token accounts owned by the account
- **AND** filters for accounts associated with the Metaplex Token Metadata Program
- **AND** fetches on-chain metadata for each NFT
- **AND** fetches off-chain JSON metadata from the URI

#### Scenario: Parallel metadata fetching
- **GIVEN** an account has multiple NFTs
- **WHEN** fetching NFT metadata
- **THEN** up to 10 NFT metadata requests are made in parallel
- **AND** each request has a 10-second timeout
- **AND** failed requests are retried up to 2 times

### Requirement: NFT Caching Strategy
The portfolio SHALL cache NFT data to improve performance and reduce RPC requests.

#### Scenario: Cache NFT data
- **GIVEN** NFT data has been fetched for an account
- **WHEN** the data is stored in cache
- **THEN** the cache time is set to 30 minutes
- **AND** the stale time is set to 5 minutes
- **AND** cached data is used for subsequent requests within the cache period

#### Scenario: Refetch stale data
- **GIVEN** NFT data in cache is older than 5 minutes
- **WHEN** the user navigates to the NFTs tab
- **THEN** the cached data is displayed immediately
- **AND** a background refetch is triggered
- **AND** the UI updates when fresh data is available

### Requirement: NFT Detail View
The portfolio SHALL provide a detailed view modal for individual NFTs showing complete metadata and attributes.

#### Scenario: User opens NFT detail modal
- **GIVEN** the user is viewing the NFT grid
- **WHEN** the user clicks on an NFT card
- **THEN** a modal opens displaying the NFT's full details
- **AND** the modal shows the large image, name, description, and collection
- **AND** the modal shows all attributes as key-value pairs
- **AND** the modal shows the mint address with copy button

#### Scenario: User closes NFT detail modal
- **GIVEN** the user has an NFT detail modal open
- **WHEN** the user clicks outside the modal or presses ESC
- **THEN** the modal closes
- **AND** the user returns to the NFT grid view

### Requirement: NFT Image Handling
The portfolio SHALL handle NFT images efficiently with lazy loading and error handling.

#### Scenario: Lazy load NFT images
- **GIVEN** the NFT grid is rendered
- **WHEN** NFT cards are displayed
- **THEN** images are loaded lazily using native browser lazy loading
- **AND** a loading spinner is shown while images load
- **AND** images only load when they are near the viewport

#### Scenario: Handle image load failure
- **GIVEN** an NFT has an invalid or unreachable image URL
- **WHEN** the image fails to load
- **THEN** a placeholder image is displayed instead
- **AND** the NFT name and metadata are still shown
- **AND** an error is logged for debugging

#### Scenario: IPFS gateway resolution
- **GIVEN** an NFT has a metadata URI with `ipfs://` protocol
- **WHEN** fetching the metadata
- **THEN** the URI is converted to an HTTPS gateway URL
- **AND** a reliable public gateway is used (e.g., Cloudflare IPFS)
- **AND** if the fetch fails, an alternative gateway is tried

### Requirement: NFT Loading States
The portfolio SHALL provide clear loading states while fetching NFT data.

#### Scenario: Initial NFT load
- **GIVEN** the user navigates to the NFTs tab for the first time
- **WHEN** NFT data is being fetched
- **THEN** a skeleton loading grid is displayed with 6-12 placeholder cards
- **AND** the skeleton cards have the same dimensions as actual NFT cards
- **AND** a subtle animation indicates loading

#### Scenario: Background refetch
- **GIVEN** cached NFT data is being refetched
- **WHEN** the refetch is in progress
- **THEN** the existing NFT grid remains visible
- **AND** a subtle loading indicator shows at the top of the page

### Requirement: NFT Error Handling
The portfolio SHALL handle errors gracefully when fetching or displaying NFT data.

#### Scenario: Network error during fetch
- **GIVEN** the user is on the NFTs tab
- **WHEN** a network error occurs during NFT fetching
- **THEN** an error message is displayed
- **AND** the message says "Failed to load NFTs"
- **AND** a "Retry" button is provided
- **AND** clicking "Retry" attempts to refetch the data

#### Scenario: Malformed metadata
- **GIVEN** an NFT has malformed on-chain or off-chain metadata
- **WHEN** parsing the metadata
- **THEN** the error is logged
- **AND** the NFT is skipped from display
- **AND** other valid NFTs are still displayed

#### Scenario: RPC rate limiting
- **GIVEN** multiple NFT metadata requests are being made
- **WHEN** the RPC endpoint returns a rate limit error
- **THEN** subsequent requests are throttled with exponential backoff
- **AND** failed requests are retried after the backoff period
- **AND** a warning message is shown to the user if all retries fail

### Requirement: NFT Tab Integration
The portfolio SHALL integrate the NFT tab into the existing tab navigation system.

#### Scenario: NFT tab in navigation
- **GIVEN** the user is on the portfolio page
- **WHEN** viewing the tab navigation
- **THEN** three tabs are visible: "Tokens", "NFTs", and "Activity"
- **AND** the NFTs tab is positioned between Tokens and Activity
- **AND** clicking the NFTs tab navigates to the NFTs view

#### Scenario: Active tab indication
- **GIVEN** the user is on the NFTs tab
- **WHEN** viewing the tab navigation
- **THEN** the NFTs tab is visually indicated as active
- **AND** the tab styling matches the existing active tab style

### Requirement: NFT Internationalization
The portfolio SHALL support internationalization for all NFT-related UI text.

#### Scenario: NFT tab label translation
- **GIVEN** the user has selected a language
- **WHEN** viewing the portfolio tabs
- **THEN** the NFTs tab label is displayed in the selected language
- **AND** the translation key is `portfolio.labelNfts`

#### Scenario: NFT UI text translation
- **GIVEN** the user is viewing NFT-related UI
- **WHEN** error messages, empty states, or labels are shown
- **THEN** all text is displayed in the user's selected language
- **AND** translation keys follow the pattern `portfolio.nft*`
