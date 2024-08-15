import type { Node, Row } from "@/components/link-columns/link-columns.type"

// 엑셀 컬럼 헤더 데이터 - column header
const primaryColHeaderList = ref<Node[]>([])
const minorColHeaderList = ref<Node[]>([])

// 엑셀 행 데이터 (N행의 데이터 목록 - row)
const primaryRowList = ref<Row[]>([])
const minorRowList = ref<Row[]>([])

// 엑셀 열 데이터 (N열의 셀 모음 - column data)
const primaryColDataList = ref<Row[]>([])
const minorColDataList = ref<Row[]>([])

export function useColumnLinker () {
  return {
    primaryColHeaderList,
    minorColHeaderList,
    primaryRowList,
    minorRowList,
    primaryColDataList,
    minorColDataList
  }
}