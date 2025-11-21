export function DevFeatureErrorUnknownComponent() {
  return (
    // @ts-expect-error deliberately unknown component
    <UnknownComponent />
  )
}
