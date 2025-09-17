<script setup lang="ts">
import { useTemplateRef, computed } from 'vue';
import type { PropType } from 'vue';
import { ElInput, ElSelect } from 'element-plus';
import type { FormInstance, FormRules, FormItemProps } from 'element-plus';
import { isString } from '~/utils/tools';
import type { TFormItems } from '.';

const props = defineProps({
  rules: {
    type: Object as PropType<FormRules>,
    default: () => {},
  },
  items: {
    type: Array as PropType<TFormItems>,
    default: () => [],
  },
});

const formData = defineModel<any>('modelValue');
const formInstance = useTemplateRef<FormInstance>('formRef');

const componentMap = {
  input: ElInput,
  select: ElSelect,
};

type TComponentType = keyof typeof componentMap;

const getComponent = (type: TComponentType) => {
  if (type && !isString(type)) {
    return type;
  }

  return componentMap[type || 'input'];
};

const items = computed(() => {
  return props.items
    .filter(item => !item.hidden)
    .map(item => {
      const { props = {}, ...rest } = item;
      return {
        ...rest,
        ...props,
      };
    });
});

defineExpose({
  validate: () => formInstance.value?.validate(),
  resetFields: () => formInstance.value?.resetFields(),
});
</script>

<template>
  <el-form :model="formData" :rules="rules" ref="formRef">
    <el-row :gutter="16">
      <el-col v-for="item in items" :key="item.prop" v-bind="item">
        <el-form-item v-bind="item">
          <slot :name="item.prop">
            <component
              :is="getComponent(item.type)"
              v-model="formData[item.prop]"
              v-bind="item"
            />
          </slot>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<style scoped lang="scss"></style>
