<script setup lang="ts">
import {
  h,
  getCurrentInstance,
  type ComponentInstance,
  type PropType,
} from 'vue';
import { ElTable } from 'element-plus';
import {
  buildSlots,
  type TPrecol,
  type ISubcol,
  type TColumns,
  type IColumns,
} from '.';

const props = defineProps({
  columns: {
    type: Array<IColumns>,
    default: () => [],
  },
  precol: {
    // 前置列
    type: Array<TPrecol>,
    default: () => [],
  },
  precolOptions: {
    // 前置列的配置
    type: Object as PropType<TColumns>,
    default: () => {},
  },
  subcol: {
    // 后置列（操作列）
    type: Array<ISubcol>,
    default: () => [],
  },
  subcolOptions: {
    // 操作列的配置
    type: Object as PropType<TColumns>,
    default: () => {},
  },
});

const vm = getCurrentInstance();

const changeRef = (exposed: Record<string, any> | null) => {
  vm!.exposed = exposed;
};

defineExpose({} as ComponentInstance<typeof ElTable>);
</script>

<template>
  <component
    :is="h(ElTable, { ...$attrs, ref: changeRef }, buildSlots(vm, props))"
  />
</template>
