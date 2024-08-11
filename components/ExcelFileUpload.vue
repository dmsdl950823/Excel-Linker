<template>
  <NSpace justify="center" vertical align="center">
    <h2>파일 올리기</h2>
    
    <NGrid x-gap="20" :cols="2">
      <NGi>
        <UploadComponent
          placeholder="컬럼 기준이 될 엑셀 파일을 올려주세요. (1개)"
          description=".xls,.xlsx,.xlsm,.csv,.xlsb 파일만 업로드 할 수 있습니다."
        />
      </NGi>
      <NGi>
        <UploadComponent
          placeholder="엑셀 파일을 올려주세요. (5개)"
          description=".xls,.xlsx,.xlsm,.csv,.xlsb 파일만 업로드 할 수 있습니다."
          :max="5"
        />
      </NGi>
    </NGrid>
    
    <NGrid x-gap="10" :cols="2">
      <NGi>
        <NButton type="primary" size="large">
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
  import UploadComponent from '~/components/UploadComponent.vue';
</script>

<style lang="scss" scoped>
@font-face {
    font-family: '양진체';
    src: url('https://fastly.jsdelivr.net/gh/supernovice-lab/font@0.9/yangjin.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}


h1 {
  color: #333;
  font-family: '양진체';
  font-size: 4vw;
  line-height: 4vw;
  margin-bottom: 40px;
}
</style>