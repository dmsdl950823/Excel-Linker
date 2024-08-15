import type { Node } from "../link-columns/link-columns.type"

export interface ColumnCardProps {
  id: number
  type?: 'block' | 'button'
  color?: 'grey' | 'blue' | 'green'
  closable?: boolean
  isActive?: boolean
}

export interface ColumnCardEmits {
  (e: 'close', id: number): void
  (e: 'click'): void
}