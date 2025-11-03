import { ShellFeature } from '@workspace/shell/shell-feature'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ShellFeature />
  </StrictMode>,
)
