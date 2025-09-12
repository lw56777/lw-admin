<script setup lang="ts">
import { h, getCurrentInstance, type ComponentInstance } from 'vue';
import { ElTableColumn } from 'element-plus';

const vm = getCurrentInstance();

const changeRef = (exposed: Record<string, any> | null) => {
  vm!.exposed = exposed;
};

defineExpose({} as ComponentInstance<typeof ElTableColumn>);
</script>

<template>
  <component :is="h(ElTableColumn, { ...$attrs, ref: changeRef }, $slots)" />
</template>
