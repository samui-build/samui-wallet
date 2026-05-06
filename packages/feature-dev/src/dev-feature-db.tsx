import { Route, Routes } from 'react-router'
import { DevFeatureDbCreate } from './dev-feature-db-create.tsx'
import { DevFeatureDbIndex } from './dev-feature-db-index.tsx'
import { DevFeatureDbList } from './dev-feature-db-list.tsx'
import { DevFeatureDbUpdate } from './dev-feature-db-update.tsx'

export default function DevFeatureDb() {
  return (
    <Routes>
      <Route element={<DevFeatureDbIndex />} index />
      <Route element={<DevFeatureDbCreate />} path=":table/create" />
      <Route element={<DevFeatureDbList />} path=":table" />
      <Route element={<DevFeatureDbUpdate />} path=":table/:itemId" />
    </Routes>
  )
}
