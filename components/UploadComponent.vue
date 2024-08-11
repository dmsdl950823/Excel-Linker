<template>
  <NUpload
    multiple
    directory-dnd
    :max="props.max"
    accept=".xls,.xlsx,.xlsm,.csv,.xlsb"
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
interface UploadComponentProps {
  placeholder?: string
  description?: string
  max?: number
}

const props = withDefaults(defineProps<UploadComponentProps>(), {
  placeholder: "파일을 올려주세요.",
  description: "설명을 입력해주세요",
  max: 1
})
</script>

<style lang="scss" scoped>

</style>