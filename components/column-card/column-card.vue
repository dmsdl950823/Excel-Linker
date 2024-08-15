<template>
  <div :class="[
    'item',
    `is-${props.type}`,
    `is-${props.color}`,
    { 'is-closable': props.closable },
    { 'is-active': props.isActive }
  ]">
    <span
      class="item__index"
      @click="handleIndexBlockEvent"
    >
      <span>{{ props.id }}</span>
      <NIcon size="16" :depth="2">
        <CloseIcon />
      </NIcon>
    </span>

    <div
      class="item__body"
      @click="handleBodyClickEvent"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ColumnCardProps, ColumnCardEmits } from "./column-card.type"
import { Close as CloseIcon } from "@vicons/ionicons5"

const props = withDefaults(defineProps<ColumnCardProps>(), {
  type: 'block',
  color: 'grey',
  isCloseable: false,
  isActive: false
})
const emits = defineEmits<ColumnCardEmits>()

function handleIndexBlockEvent () {
  emits('close', props.id)
}

function handleBodyClickEvent () {
  emits('click')
}
</script>

<style lang="scss" scoped>
  @import "column-card";
</style>