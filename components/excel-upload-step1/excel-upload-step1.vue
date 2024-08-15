<template>
  <NSpace justify="center" vertical align="center">
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
    
    <NGrid x-gap="10" :cols="2">
      <NGi>
        <NButton type="primary" size="large" @click="handleTransButtonClickEvent">
          변환하기
        </NButton>
      </NGi>
      <NGi>
        <NButton type="info" size="large">
          컬럼 저장하기
        </NButton>
      </NGi>
    </NGrid>
  </NSpace>
</template>

<script setup lang="ts">
import * as XLSX from "xlsx"
import { useMessage, type UploadFileInfo } from "naive-ui"

import type { Node } from "@/components/link-columns/link-columns.type"

import { useColumnLinker } from "~/composables/use-column-linker"

const message = useMessage()
const { standardColunms, restColunms } = useColumnLinker()

const standardFile = ref<UploadFileInfo | null>(null)
const restFileList = ref<UploadFileInfo[]>([])
const dataArray = ref<any[]>([]); // 데이터를 저장할 배열

function handleUploadStandardFileList (fileList: UploadFileInfo[]) {
  if (fileList.length === 1) standardFile.value = fileList[0]
  else standardFile.value = null
}
function handleUploadFileList (fileList: UploadFileInfo[]) {
  restFileList.value = fileList
}

async function handleTransButtonClickEvent () {
  if (!standardFile.value) {
    message.error('기준 컬럼을 등록해주세요.')
    return
  }
  if (restFileList.value.length === 0) {
    message.error('엑셀파일을 등록해주세요.')
    return
  }

  const standard = (standardFile.value.file) as File
  const rest = (restFileList.value[0].file) as File

  // console.log(file)
  const standardColumnsList = await readFileToArray(standard)
  const restColumnsList = await readFileToArray(rest) // TODO: 0번째 파일만

  // console.log(standardColumnsList, restColumnsList)
  standardColunms.value = standardColumnsList
  restColunms.value = restColumnsList
}

function readFileToArray (file: File): Promise<Node[]> {
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

        // console.log('Parsed Data:', jsonData[0]);
        const result = jsonData[0].map((item, id) => ({ label: item, id }))
        
        resolve(result) 
      }
    }

    reader.onerror = (e) => {
      reject(e)
    }
  })
}
</script>

<style lang="scss" scoped>
</style>