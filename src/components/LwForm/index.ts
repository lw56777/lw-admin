import { h, reactive, ref } from 'vue';
import type { Component, ComputedRef, VNode } from 'vue';
import type { FormRules, FormItemProps } from 'element-plus';
import LwForm from './index.vue';

interface IFormItem extends Partial<Omit<FormItemProps, 'label' | 'prop'>> {
  type?: string | (() => VNode) | Component;
  hidden?: boolean;
  span?: number;
  props?: any;
}

export type TFormItems = IFormItem[];

type FuncComponentProps = {
  modelValue: any;
  rules: FormRules;
  items: TFormItems | ComputedRef<TFormItems>;
};

export const useLwForm = (props: FuncComponentProps) => {
  const formRef = ref();
  const Component = (_: any, { slots }: any) => {
    return h(LwForm, { ...reactive(props), ref: formRef }, slots);
  };

  return {
    LwForm: Component,
    validate: () => formRef.value?.validate(),
    resetFields: () => formRef.value?.resetFields(),
  };
};
