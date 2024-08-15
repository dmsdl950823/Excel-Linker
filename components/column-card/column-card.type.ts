export interface ColumnCardProps {
  id: number
  closable?: boolean
}

export interface ColumnCardEmits {
  (e: 'click', id: number): void
}