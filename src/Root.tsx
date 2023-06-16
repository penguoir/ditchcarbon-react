import { Link } from '@mui/material'

export default function Root() {
  return (
    <div id="root">
        <Link underline='none' href="/scope-1">Scope 1</Link>
        <br />
        <Link underline='none' href="/scope-2">Scope 2</Link>
    </div>
  )
}
