<template>
  <div class="saved-template">
    <h1>저장된 템플릿</h1>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@font-face {
    font-family: '양진체';
    src: url('https://fastly.jsdelivr.net/gh/supernovice-lab/font@0.9/yangjin.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

.saved-template {
  border: 1px solid red;

  h1 {
    border: 1px solid blue;
    color: #333;
    font-family: '양진체';
    font-size: 4vw;
  }
}
</style>
