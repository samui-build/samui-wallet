## ADDED Requirements

### Requirement: Fetch NFT Token Accounts
The Solana client SHALL provide a function to fetch all NFT token accounts owned by a specific address.

#### Scenario: Fetch NFT accounts for owner
- **GIVEN** a valid Solana address
- **WHEN** calling `getNftAccountsForOwner(client, address)`
- **THEN** all token accounts owned by the address are returned
- **AND** only accounts associated with Metaplex Token Metadata Program are included
- **AND** each account includes the mint address and token account address

#### Scenario: No NFT accounts found
- **GIVEN** an address with no NFT token accounts
- **WHEN** calling `getNftAccountsForOwner(client, address)`
- **THEN** an empty array is returned
- **AND** no errors are thrown

#### Scenario: Invalid address
- **GIVEN** an invalid Solana address
- **WHEN** calling `getNftAccountsForOwner(client, address)`
- **THEN** an error is thrown
- **AND** the error message indicates "Invalid address"

### Requirement: Parse NFT Metadata
The Solana client SHALL provide a function to deserialize and parse Metaplex Token Metadata from on-chain accounts.

#### Scenario: Parse valid metadata account
- **GIVEN** a valid metadata account for an NFT
- **WHEN** calling `getNftMetadata(client, mintAddress)`
- **THEN** the metadata is deserialized from on-chain data
- **AND** the returned object includes name, symbol, uri, sellerFeeBasisPoints, and creators
- **AND** all string fields are trimmed of null bytes and whitespace

#### Scenario: Parse metadata with missing URI
- **GIVEN** a metadata account with an empty URI field
- **WHEN** calling `getNftMetadata(client, mintAddress)`
- **THEN** the metadata is returned with uri as empty string
- **AND** no error is thrown

#### Scenario: Metadata account does not exist
- **GIVEN** a mint address with no associated metadata account
- **WHEN** calling `getNftMetadata(client, mintAddress)`
- **THEN** null is returned
- **AND** no error is thrown

#### Scenario: Malformed metadata account
- **GIVEN** a metadata account with invalid data structure
- **WHEN** calling `getNftMetadata(client, mintAddress)`
- **THEN** an error is thrown
- **AND** the error message indicates "Failed to deserialize metadata"
- **AND** the error is logged with the mint address

### Requirement: Fetch Off-Chain NFT Metadata
The Solana client SHALL provide a function to fetch and parse off-chain JSON metadata from a URI.

#### Scenario: Fetch valid JSON metadata
- **GIVEN** a valid HTTPS URI pointing to JSON metadata
- **WHEN** calling `fetchNftJsonMetadata(uri)`
- **THEN** the JSON is fetched via HTTP request
- **AND** the response is parsed as JSON
- **AND** the returned object includes name, description, image, and attributes
- **AND** the request has a 10-second timeout

#### Scenario: Fetch JSON from IPFS URI
- **GIVEN** a URI starting with `ipfs://`
- **WHEN** calling `fetchNftJsonMetadata(uri)`
- **THEN** the URI is converted to an HTTPS gateway URL
- **AND** the gateway URL uses a reliable public gateway (e.g., `https://cloudflare-ipfs.com/ipfs/`)
- **AND** the JSON is fetched from the gateway
- **AND** the metadata is returned

#### Scenario: IPFS gateway fallback
- **GIVEN** an IPFS URI where the primary gateway fails
- **WHEN** calling `fetchNftJsonMetadata(uri)` and the request times out or returns 404
- **THEN** the request is retried with an alternative IPFS gateway
- **AND** up to 2 alternative gateways are tried
- **AND** if all gateways fail, an error is thrown

#### Scenario: Invalid JSON response
- **GIVEN** a URI that returns non-JSON content
- **WHEN** calling `fetchNftJsonMetadata(uri)`
- **THEN** an error is thrown
- **AND** the error message indicates "Invalid JSON"

#### Scenario: HTTP error (404, 500)
- **GIVEN** a URI that returns an HTTP error status
- **WHEN** calling `fetchNftJsonMetadata(uri)`
- **THEN** an error is thrown
- **AND** the error includes the HTTP status code
- **AND** the error message indicates "Failed to fetch metadata"

#### Scenario: Request timeout
- **GIVEN** a URI that takes longer than 10 seconds to respond
- **WHEN** calling `fetchNftJsonMetadata(uri)`
- **THEN** the request is aborted
- **AND** an error is thrown
- **AND** the error message indicates "Request timeout"

### Requirement: NFT Metadata Type Definitions
The Solana client SHALL provide TypeScript type definitions for NFT metadata structures.

#### Scenario: On-chain metadata type
- **GIVEN** the Metaplex Token Metadata Program standard
- **WHEN** defining TypeScript types
- **THEN** an `NftMetadata` type is exported with the following fields:
  - `mint: string` (required)
  - `updateAuthority: string` (required)
  - `name: string` (required)
  - `symbol: string` (required)
  - `uri: string` (required)
  - `sellerFeeBasisPoints: number` (required)
  - `creators: Array<{ address: string; verified: boolean; share: number }>` (optional)

#### Scenario: Off-chain JSON metadata type
- **GIVEN** the Metaplex off-chain metadata standard
- **WHEN** defining TypeScript types
- **THEN** an `NftJsonMetadata` type is exported with the following fields:
  - `name: string` (optional)
  - `description: string` (optional)
  - `image: string` (optional)
  - `animation_url: string` (optional)
  - `external_url: string` (optional)
  - `attributes: Array<{ trait_type: string; value: string | number }>` (optional)
  - `properties: object` (optional)

#### Scenario: Combined NFT data type
- **GIVEN** both on-chain and off-chain metadata
- **WHEN** defining TypeScript types
- **THEN** a `CombinedNftData` type is exported that combines `NftMetadata` and `NftJsonMetadata`
- **AND** the type includes a `tokenAccount: string` field for the token account address

### Requirement: NFT Fetching Error Handling
The Solana client SHALL provide robust error handling for all NFT fetching operations.

#### Scenario: Network connection failure
- **GIVEN** the RPC endpoint is unreachable
- **WHEN** calling any NFT fetching function
- **THEN** an error is thrown
- **AND** the error type is `NetworkError`
- **AND** the error message indicates "Failed to connect to RPC"

#### Scenario: RPC rate limiting
- **GIVEN** the RPC endpoint returns a 429 status
- **WHEN** calling any NFT fetching function
- **THEN** an error is thrown
- **AND** the error type is `RateLimitError`
- **AND** the error includes a `retryAfter` field with suggested wait time

#### Scenario: Account parsing error
- **GIVEN** a token account with unexpected data structure
- **WHEN** parsing the account data
- **THEN** an error is thrown
- **AND** the error type is `ParseError`
- **AND** the error includes the account address for debugging
- **AND** the error is logged with full details

### Requirement: Metaplex Program ID Configuration
The Solana client SHALL use the correct Metaplex Token Metadata Program ID for filtering NFT accounts.

#### Scenario: Use Metaplex Program ID
- **GIVEN** the standard Metaplex Token Metadata Program
- **WHEN** fetching NFT accounts
- **THEN** the program ID `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s` is used
- **AND** only token accounts with metadata from this program are included

#### Scenario: Derive metadata PDA
- **GIVEN** an NFT mint address
- **WHEN** fetching metadata for the mint
- **THEN** the metadata account address is derived using PDA derivation
- **AND** the derivation uses seeds: `["metadata", PROGRAM_ID, mint]`
- **AND** the correct Metaplex program ID is used in derivation
