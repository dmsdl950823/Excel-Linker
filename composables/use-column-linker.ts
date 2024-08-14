export interface Node {
  id: number
  label: string
  connected?: number
}

const standardColunms = ref<Node[]>([])
const restColunms = ref<Node[]>([])

export function useColumnLinker () {
  return {
    standardColunms,
    restColunms
  }
}