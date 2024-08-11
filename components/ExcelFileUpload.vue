<template>
  <NSpace justify="center" vertical align="center">
    <h2>파일 올리기</h2>
    
    <NGrid x-gap="20" :cols="2">
      <NGi>
        <UploadComponent
          placeholder="컬럼 기준이 될 엑셀 파일을 올려주세요. (1개)"
          description=".xls,.xlsx,.xlsm,.csv,.xlsb 파일만 업로드 할 수 있습니다."
          @upload="handleUploadStandardFileList"
        />
      </NGi>
      <NGi>
        <UploadComponent
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
import * as XLSX from 'xlsx';
import UploadComponent from '~/components/UploadComponent.vue';

import { useColumnLinker } from "~/composables/use-column-linker"

const { standardColunms, restColunms } = useColumnLinker()

const standardFile = ref<File | null>(null)
const resFileList = ref<File[]>([])
const dataArray = ref<any[]>([]); // 데이터를 저장할 배열

function handleUploadStandardFileList (fileList: File[]) {
  if (fileList.length === 1) standardFile.value = fileList[0]
  else standardFile.value = null
}
function handleUploadFileList (fileList: File[]) {
  resFileList.value = fileList
}

function handleTransButtonClickEvent () {
  if (!standardFile.value) return

  const file = standardFile.value.file

  const result = readFileToArray(file)
  console.log(result, '?ㅇ')
}

function readFileToArray (file: File) {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  let result = null

  reader.onload = async (e: ProgressEvent<FileReader>) => {
    if (e.target?.result) {
      // Parse the file using XLSX
      const data = new Uint8Array(e.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      // Assuming you want to process the first sheet
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: Array<string[]> = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Converts sheet to array of arrays

      console.log('Parsed Data:', jsonData);
      standardColunms.value = jsonData[0].map((item, id) => ({ label: item, id }))
      // You can now use jsonData array for further processing
      
      result = jsonData[0].map((item, id) => ({ label: item, id }))
    }
  };

  return result
}
</script>

<style lang="scss" scoped>
</style>