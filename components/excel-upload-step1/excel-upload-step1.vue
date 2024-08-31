<template>
  <NSpace justify="center" vertical align="center" class="excel-upload-step1">
    <h1>EXCEL LINKER</h1>

    <h2>파일 올리기</h2>
    
    <NGrid x-gap="20" :cols="2">
      <NGi>
        <ExcelUpload
          placeholder="컬럼 기준이 될 엑셀 파일을 올려주세요. (1개)"
          description=".xls,.xlsx,.xlsm,.csv,.xlsb 파일만 업로드 할 수 있습니다."
          @upload="handleUploadStandardFileList"
        />
      </NGi>
      <NGi>
        <ExcelUpload
          placeholder="엑셀 파일을 올려주세요. (5개)"
          description=".xls,.xlsx,.xlsm,.csv,.xlsb 파일만 업로드 할 수 있습니다."
          @upload="handleUploadFileList"
          :max="5"
        />
      </NGi>
    </NGrid>
    
    <NButton type="primary" size="large" @click="handleTransButtonClickEvent">
      변환하기
    </NButton>   
  </NSpace>
</template>

<script setup lang="ts">
import * as XLSX from "xlsx"
import { useMessage, type UploadFileInfo } from "naive-ui"

import type { FileDivisionType } from "./excel-upload-step1.type"
import type { Node, NodeType, Row } from "@/components/link-columns/link-columns.type"

import { useExcelLinker } from "~/composables/use-excel-linker"
import { useColumnLinker } from "~/composables/use-column-linker"

const message = useMessage()
const { primaryColHeaderList, minorColHeaderList, primaryRowList, minorRowList, primaryColDataList, minorColDataList } = useColumnLinker()
const { setCurrentStep } = useExcelLinker()

const primaryFile = ref<UploadFileInfo | null>(null)
const minorFileList = ref<UploadFileInfo[]>([])

const dataArray = ref<any[]>([]); // 데이터를 저장할 배열

function handleUploadStandardFileList (fileList: UploadFileInfo[]) {
  if (fileList.length === 1) primaryFile.value = fileList[0]
  else primaryFile.value = null
}
function handleUploadFileList (fileList: UploadFileInfo[]) {
  minorFileList.value = fileList
}

async function handleTransButtonClickEvent () {
  if (!primaryFile.value) {
    message.error('기준 컬럼을 등록해주세요.')
    return
  }
  if (minorFileList.value.length === 0) {
    message.error('엑셀파일을 등록해주세요.')
    return
  }

  const standard = (primaryFile.value.file) as File
  const rest = (minorFileList.value[0].file) as File

  // console.log(file)
  try {
    const { header: primaryHeaderList, data: primaryDataList } = await readFileToArray(standard, 'primary')
    const { header: minorHeaderList, data: minorDataList } = await readFileToArray(rest, 'minor') // TODO: 0번째 파일만
  
    // console.log(primaryHeaderList, minorHeaderList)

    primaryColHeaderList.value = primaryHeaderList
    minorColHeaderList.value = minorHeaderList

    primaryRowList.value = primaryDataList
    minorRowList.value = minorDataList
    
    // primaryColDataList.value = setRowToColData(primaryDataList)
    minorColDataList.value = setRowToColData(minorDataList, minorHeaderList.length)

    setCurrentStep(2)
  } catch (error) {
    message.error('파일을 변환하던 도중 문제가 발생했습니다.')
  }
}

function readFileToArray (file: File, type: NodeType): Promise<FileDivisionType> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        // Parse the file using XLSX
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Assuming you want to process the first sheet
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: Array<string[]> = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Converts sheet to array of arrays

        // console.log('Parsed Data:', jsonData);
        const columnList = jsonData[0].map((item, id) => ({ label: item, id, type }))
        const dataList = jsonData.slice(1) // 컬럼명 이후의 데이터는 모두 가져옴
        
        resolve({
          header: columnList,
          data: dataList
        })
      }
    }

    reader.onerror = (e) => {
      reject(e)
    }
  })
}

/**
 * row 한줄의 데이터를 index 형태로 col 데이터로 변환
 * (2중 배열 뒤집기)
 */
function setRowToColData (rowList: Row[], colLen: number): string[][] {
  const result = Array.from({ length: colLen }, () => [])
  // console.log(data, colLen, result)

  const switchList = rowList[0].map((_, colIndex) => rowList.map(row => row[colIndex]));
  return switchList
}
</script>

<style lang="scss" scoped>
  @import "excel-upload-step1";
</style>