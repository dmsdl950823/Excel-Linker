export interface Node {
  id: number
  label: string
  type: NodeType
  connected?: number
}

export type NodeType = 'primary' | 'minor'

export type Row = string[]