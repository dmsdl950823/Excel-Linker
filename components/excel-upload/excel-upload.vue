<template>
  <NUpload
    multiple
    directory-dnd
    :max="props.max"
    accept=".xls,.xlsx,.xlsm,.csv,.xlsb"
    @update:file-list="handleUploadEvent"
  >
    <NUploadDragger>
      <div style="margin-bottom: 12px">
        <NIcon size="48" :depth="3">
          <ArchiveIcon />
        </NIcon>
      </div>
      <n-text style="font-size: 16px">
        {{ props.placeholder }}
      </n-text>
      <n-p depth="3" style="margin: 8px 0 0 0">
        {{ props.description }}
      </n-p>
    </NUploadDragger>
  </NUpload>
</template>

<script setup lang="ts">
import type { UploadFileInfo } from "naive-ui"
import type { UploadComponentProps, UploadComponentEmits } from "./excel-upload.type"

const props = withDefaults(defineProps<UploadComponentProps>(), {
  placeholder: "파일을 올려주세요.",
  description: "설명을 입력해주세요",
  max: 1
})

const emits = defineEmits<UploadComponentEmits>()

function handleUploadEvent (e: UploadFileInfo[]) {
  emits('upload', e)
}
</script>

<style lang="scss" scoped>

</style>