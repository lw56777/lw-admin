<script setup lang="ts">
import { getCurrentInstance } from 'vue';
import { Search, Refresh, RefreshLeft } from '@element-plus/icons-vue';
import { isFunction } from '~/utils/tools';
import type { TProps, TEmitsAttrs, TEmits } from '.';

const vm = getCurrentInstance();
const attrs = vm?.attrs as Record<string, any>;

const getAttrs = (item: any): TEmitsAttrs | false => {
  const key = Object.keys(item)[0];
  const value = item[key];
  const attrs = {
    onClick: value,
  };

  switch (Object.keys(item)[0]) {
    case 'onSearch':
      return {
        type: 'primary',
        icon: Search,
        name: '搜索',
        ...attrs,
      };

    case 'onReset':
      return {
        type: 'info',
        icon: RefreshLeft,
        plain: true,
        name: '重置',
        ...attrs,
      };

    case 'onRefresh':
      return {
        icon: Refresh,
        name: '刷新',
        ...attrs,
      };

    default:
      return false;
  }
};

// 确保emits按照固定顺序：搜索、重置、刷新
const emitOrder = ['onSearch', 'onReset', 'onRefresh'];
const emits = emitOrder.reduce((pre, cur) => {
  if (isFunction(attrs[cur])) {
    const emitAttrs = getAttrs({ [cur]: attrs[cur] });
    if (emitAttrs) {
      pre.push(emitAttrs);
    }
  }

  return pre;
}, [] as any[]);

defineEmits({} as TEmits);
defineExpose({} as TProps);
</script>

<template>
  <el-card>
    <div class="lw-search flex flex-wrap items-center justify-start gap-4">
      <div class="conditions flex flex-wrap gap-4">
        <slot></slot>
      </div>

      <div class="actions flex-1 flex justify-end">
        <slot name="actions" />

        <template v-for="(item, index) of emits" :key="index">
          <el-button v-if="item" v-bind="item">
            {{ item.name }}
          </el-button>
        </template>
      </div>
    </div>
  </el-card>
</template>
