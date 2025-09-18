<script setup lang="ts">
import { computed, type ComponentInstance, type PropType } from 'vue';
import { ElTable, type PaginationProps } from 'element-plus';
import LwTableColumn from './LwTableColumn/index.vue';

const props = defineProps({
  columns: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  pageProps: {
    type: Object as PropType<Partial<PaginationProps>>,
    default: () => ({}),
  },
});

const pageProps = computed(() => {
  return {
    total: 0,
    background: true,
    hideOnSinglePage: true,
    layout: 'total, sizes, prev, pager, next',
    ...props.pageProps,
  };
});

const tableData = defineModel<any[]>('modelValue');

const columns = computed(() => {
  return props.columns
    .filter(column => !column.hidden)
    .map(column => {
      const { props = {}, ...rest } = column;
      return {
        ...rest,
        ...props,
      };
    });
});

defineExpose({} as ComponentInstance<typeof ElTable>);
</script>

<template>
  <div class="lw-table">
    <el-table :data="tableData" v-bind="$attrs">
      <LwTableColumn :columns="columns">
        <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
          <slot :name="name" v-bind="slotData" />
        </template>
      </LwTableColumn>
    </el-table>

    <div class="flex justify-end mt-4">
      <el-pagination v-model="pageProps.currentPage" v-bind="pageProps" />
    </div>
  </div>
</template>
