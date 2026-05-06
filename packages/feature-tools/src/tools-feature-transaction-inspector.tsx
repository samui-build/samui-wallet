import { ExplorerUiLinkAddress } from '@workspace/feature-explorer/ui/explorer-ui-link-address'
import { ExplorerUiLinkSignature } from '@workspace/feature-explorer/ui/explorer-ui-link-signature'
import type {
  TransactionInspectorAccountReference,
  TransactionInspectorResult,
} from '@workspace/solana-client/parse-transaction-inspector-input'
import { useParseTransactionInspectorInput } from '@workspace/solana-client-react/use-parse-transaction-inspector-input'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'
import { Textarea } from '@workspace/ui/components/textarea'
import { UiCard } from '@workspace/ui/components/ui-card'
import type { ReactNode } from 'react'
import { useState } from 'react'

const EXPLORER_BASE_PATH = '/explorer'

export default function ToolsFeatureTransactionInspector() {
  const [input, setInput] = useState('')
  const { data, error, isLoading } = useParseTransactionInspectorInput(input)

  return (
    <UiCard
      action={
        input ? (
          <Button onClick={() => setInput('')} type="button" variant="outline">
            Clear
          </Button>
        ) : null
      }
      backButtonTo="/tools"
      contentProps={{ className: 'space-y-4' }}
      title="Transaction Inspector"
    >
      <Textarea
        className="min-h-36 font-mono text-xs md:text-sm"
        onChange={(event) => setInput(event.target.value)}
        placeholder="Paste a base58 or base64 encoded transaction or transaction message"
        value={input}
      />
      {isLoading ? <p className="text-muted-foreground text-sm">Parsing transaction...</p> : null}
      {error ? <p className="text-destructive text-sm">{error.message}</p> : null}
      {data ? <TransactionInspectorResultView result={data} /> : null}
    </UiCard>
  )
}

function TransactionInspectorResultView({ result }: { result: TransactionInspectorResult }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-2 rounded-md border p-3 text-sm md:grid-cols-2">
        <InspectorField label="Encoding" value={result.encoding} />
        <InspectorField
          label="Fee payer"
          value={
            result.feePayer ? (
              <ExplorerUiLinkAddress address={result.feePayer} basePath={EXPLORER_BASE_PATH} className="text-xs" />
            ) : (
              'Unknown'
            )
          }
        />
        <InspectorField label="Message bytes" value={result.rawMessage.length.toString()} />
        <InspectorField label="Signatures" value={result.signatures.length.toString()} />
        <InspectorField label="Source bytes" value={result.sourceBytesLength.toString()} />
        <InspectorField label="Version" value={result.version.toString()} />
      </div>
      <SignatureTable result={result} />
      <AccountTable result={result} />
      <InstructionTable result={result} />
    </div>
  )
}

function AccountTable({ result }: { result: TransactionInspectorResult }) {
  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Account</TableHead>
            <TableHead className="w-[96px] text-right">Index</TableHead>
            <TableHead className="w-[140px] text-right">Source</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.accountReferences.map((accountReference, index) => (
            <TableRow className="hover:bg-transparent" key={accountReference.key}>
              <TableCell>
                <AccountReferenceValue accountReference={accountReference} />
              </TableCell>
              <TableCell className="w-[96px] text-right">{index}</TableCell>
              <TableCell className="w-[140px] text-right capitalize">{accountReference.source}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function AccountReferenceValue({ accountReference }: { accountReference: TransactionInspectorAccountReference }) {
  if (accountReference.address) {
    return (
      <ExplorerUiLinkAddress address={accountReference.address} basePath={EXPLORER_BASE_PATH} className="text-xs" />
    )
  }

  if (!accountReference.lookupTableAddress || accountReference.lookupTableIndex === undefined) {
    return <span className="text-muted-foreground text-xs">Unknown</span>
  }

  return (
    <div className="space-y-1">
      <ExplorerUiLinkAddress
        address={accountReference.lookupTableAddress}
        basePath={EXPLORER_BASE_PATH}
        className="text-xs"
      />
      <div className="text-muted-foreground text-xs">Lookup index #{accountReference.lookupTableIndex}</div>
    </div>
  )
}

function InspectorField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-muted-foreground text-xs">{label}</div>
      <div className="break-all font-mono">{value}</div>
    </div>
  )
}

function InstructionTable({ result }: { result: TransactionInspectorResult }) {
  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Program</TableHead>
            <TableHead>Accounts</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.instructions.map((instruction, index) => {
            return (
              <TableRow className="hover:bg-transparent" key={`${instruction.programAddressIndex}-${index}`}>
                <TableCell>
                  {instruction.programAccountReference ? (
                    <AccountReferenceValue accountReference={instruction.programAccountReference} />
                  ) : (
                    `Account #${instruction.programAddressIndex}`
                  )}
                </TableCell>
                <TableCell className="space-y-1 align-top">
                  {instruction.accountIndices.length ? (
                    instruction.accountIndices.map((accountIndex, itemIndex) => {
                      const accountReference = instruction.accountReferences[itemIndex]

                      return (
                        <div className="flex flex-wrap items-center gap-2" key={`${accountIndex}-${itemIndex}`}>
                          <Badge variant="outline">#{accountIndex}</Badge>
                          {accountReference ? (
                            <AccountReferenceValue accountReference={accountReference} />
                          ) : (
                            <span className="text-muted-foreground text-xs">Unknown</span>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell className="max-w-64 break-all font-mono text-xs">
                  {instruction.dataBase58 || 'Empty'}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

function SignatureTable({ result }: { result: TransactionInspectorResult }) {
  if (!result.signatures.length) {
    return null
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Signer</TableHead>
            <TableHead>Signature</TableHead>
            <TableHead className="w-[120px] text-right">Validity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.signatures.map(({ address, signature, verified }) => (
            <TableRow className="hover:bg-transparent" key={address}>
              <TableCell>
                <ExplorerUiLinkAddress address={address} basePath={EXPLORER_BASE_PATH} className="text-xs" />
              </TableCell>
              <TableCell>
                {signature ? (
                  <ExplorerUiLinkSignature basePath={EXPLORER_BASE_PATH} className="text-xs" signature={signature} />
                ) : (
                  'Missing'
                )}
              </TableCell>
              <TableCell className="w-[120px] text-right">
                <SignatureValidityBadge verified={verified} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function SignatureValidityBadge({ verified }: { verified: boolean | undefined }) {
  if (verified === undefined) {
    return <Badge variant="outline">N/A</Badge>
  }

  return <Badge variant={verified ? 'success' : 'destructive'}>{verified ? 'Valid' : 'Invalid'}</Badge>
}
