<template>
  <div :class="['item', { 'is-closable': props.closable }]">
    <span
      class="item__index"
      @click="handleIndexBlockEvent"
    >
      <span>{{ props.id }}</span>
      <NIcon size="16" :depth="2">
        <CloseIcon />
      </NIcon>
    </span>

    <slot />
  </div>
</template>

<script setup lang="ts">
import type { ColumnCardProps, ColumnCardEmits } from "./column-card.type"
import { Close as CloseIcon } from "@vicons/ionicons5"

const props = defineProps<ColumnCardProps>()
const emits = defineEmits<ColumnCardEmits>()

function handleIndexBlockEvent () {
  emits('click', props.id)
}
</script>

<style scoped lang="scss">
.item {
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 34px;

  &__index {
    border-right: 1px solid #eee;
    flex: 0 0 25px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fafafc;

    > i { display: none; }
  }


  &.is-closable {
    .item__index {
      cursor: pointer;

      &:hover {
        background-color: #eee;

        > i { display: block; }
        > span { display: none; }
      }
    }
  }
}
</style>