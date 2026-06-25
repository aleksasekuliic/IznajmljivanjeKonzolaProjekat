import { Badge } from './ui.jsx'
import { statusMeta, stanjeMeta } from '../lib/constants'

export function StatusBadge({ status }) {
  const meta = statusMeta(status)
  return <Badge tone={meta.tone}>{meta.label}</Badge>
}

export function StanjeBadge({ stanje }) {
  const meta = stanjeMeta(stanje)
  return <Badge tone={meta.tone}>{meta.label}</Badge>
}
