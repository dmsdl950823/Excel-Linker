<template>
  <NMessageProvider>
    <div class="excel-linker-home">
      <ExcelUploadStep1 v-if="currentStep === 1"/>
      <ExcelUploadStep2 v-if="currentStep === 2"/>
    </div>
  </NMessageProvider>
</template>

<script setup lang="ts">
import { useExcelLinker } from "~/composables/use-excel-linker"
const { currentStep } = useExcelLinker()
</script>

<style scoped lang="scss">
  @import "excel-linker-home";
</style>