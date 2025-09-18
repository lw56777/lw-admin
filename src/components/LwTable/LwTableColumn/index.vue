<script setup lang="ts">
import type { PropType } from 'vue';
import { ElTableColumn as ElColumn, ElInput, ElSelect } from 'element-plus';
import { isString } from '~/utils/tools';
import LwTableColumn from './index.vue';

defineOptions({
  name: 'ElTableColumn',
});

defineProps({
  columns: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});

const componentMap = {
  input: ElInput,
  select: ElSelect,
};

type TComponentType = keyof typeof componentMap | true;

const getComponent = (type: TComponentType) => {
  if (type && !isString(type)) {
    return type;
  }

  return componentMap[type];
};
</script>

<template>
  <ElColumn
    v-for="column in columns"
    :key="column.prop || column.label"
    v-bind="column"
  >
    <!-- 如果有子列 -->
    <LwTableColumn v-if="column.child" :columns="column.child" />

    <!-- 如果没有子列且需要自定义内容 -->
    <template
      v-if="column.type || $slots[column.prop]"
      #default="{ row, $index }"
    >
      <slot :name="column.prop" :row="row" :$index="$index">
        <component
          :is="getComponent(column.type)"
          v-model="row[column.prop]"
          v-bind="column"
        />
      </slot>
    </template>
  </ElColumn>
</template>
