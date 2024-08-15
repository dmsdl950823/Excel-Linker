import type { Node } from "@/components/link-columns/link-columns.type"

const standardColunms = ref<Node[]>([])
const restColunms = ref<Node[]>([])

export function useColumnLinker () {
  return {
    standardColunms,
    restColunms
  }
}