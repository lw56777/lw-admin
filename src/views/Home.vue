<script setup lang="ts">
import { ref, useTemplateRef, h, computed, type ComputedRef } from 'vue';
import { WarningFilled } from '@element-plus/icons-vue';
import useTable from '~/hooks/useTable';
import { ElSwitch } from 'element-plus';
import type { FormRules } from 'element-plus';
import { useLwForm, type TFormItems } from '~/components/LwForm';
import { useLwDialog } from '~/components/LwDialog';
import DialogContent from '~/components/LwDialog/index.vue';

const { createEdit, createView, createDelete } = useTable();

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Home',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Office',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Home',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Office',
  },
];

const columns = [
  {
    prop: 'name',
    label: 'Name',
    width: '180',
  },
  {
    label: 'Zip',
    prop: 'zip',
    isSlot: true,
  },
  {
    prop: 'date',
    label: 'Date',
    width: '180',
  },

  {
    prop: 'city',
    label: 'City',
    width: '180',
  },
  {
    prop: 'address',
    label: 'Address',
    isSlot: true,
    children: [
      {
        prop: 'city',
        label: 'City',
        width: '180',
      },
      {
        prop: 'date',
        label: 'Date',
        width: '180',
      },
    ],
  },
];

const handleEdit = (row: any) => {
  console.log('handleEdit', row);
};

const handleView = (row: any) => {
  console.log('handleView', row);
};

const handleDelete = (row: any) => {
  console.log('handleDelete', row);
};

const subcol = [
  createEdit(handleEdit),
  createView(handleView),
  createDelete(handleDelete),
];

const onSelectionChange = (selection: any) => {
  console.log('onSelectionChange', selection);
};

const onSearch = () => {
  console.log('onSearch');
};

const onReset = () => {
  console.log('onReset');
};

const onRefresh = () => {
  console.log('onRefresh');
};

const handleDialog = () => {
  const { createConfirm, createCancel } = useLwDialog(
    DialogContent,
    {},
    {
      title: '弹窗标题',
      closeOnClickModal: false,
      footer: () => [
        // 自定义确认按钮名称和属性
        createConfirm({
          name: '保存',
          type: 'success',
          click: () => {
            console.log('我自己处理保存');
          },
        }),
        // 自定义确认按钮名称
        createConfirm('审核'),
        createConfirm({
          name: '重置',
          hide: false,
          click: 'validate',
        }),
        // 默认确认按钮
        createConfirm(),
        createCancel(),
      ],
    },
  );
};
const formData = ref({
  name: '',
  region: '',
  count: '',
  date1: '',
  date2: '',
  delivery: false,
  location: '',
  type: [],
  resource: '',
  desc: '',
});

const rules: FormRules = {
  name: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  region: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'change',
    },
  ],
  count: [
    {
      required: true,
      message: 'Please select Activity count',
      trigger: 'change',
    },
  ],
  date1: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a date',
      trigger: 'change',
    },
  ],
  date2: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a time',
      trigger: 'change',
    },
  ],
  location: [
    {
      required: true,
      message: 'Please select a location',
      trigger: 'change',
    },
  ],
  type: [
    {
      type: 'array',
      required: true,
      message: 'Please select at least one activity type',
      trigger: 'change',
    },
  ],
  resource: [
    {
      required: true,
      message: 'Please select activity resource',
      trigger: 'change',
    },
  ],
  desc: [
    { required: true, message: 'Please input activity form', trigger: 'blur' },
  ],
};

const formItems: ComputedRef<TFormItems> = computed(() => [
  {
    label: '姓名',
    prop: 'name',
    // type: 'input',
    placeholder: '请输入姓名',
    span: 12,
  },
  {
    label: '地区',
    prop: 'region',
    type: 'select',
    hidden: !formData.value.delivery,
    props: {
      placeholder: '请选择地区',
      options: [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou' },
        { label: '深圳', value: 'shenzhen' },
      ],
    },
    span: 12,
  },
  {
    label: '自定义组件',
    prop: 'delivery',
    type: () =>
      h(ElSwitch, {
        modelValue: formData.value.delivery,
        onChange: () => {
          console.log('onChange', formData.value);
        },
      }),
  },
  {
    label: '描述',
    prop: 'desc',
    placeholder: '请输入描述',
  },
]);

const lwFormRef = useTemplateRef('lwFormRef');

const {
  LwForm: LwFormComp,
  validate: validateLwForm,
  resetFields: resetFieldsLwForm,
} = useLwForm({
  modelValue: formData,
  rules,
  items: formItems,
});
</script>
<template>
  <LwSearch @reset="onReset" @refresh="onRefresh" @search="onSearch">
    <el-form-item label="关键词：">
      <el-input placeholder="Search" style="width: 240px" />
    </el-form-item>

    <el-form-item label="类型：">
      <el-select placeholder="Select" style="width: 240px"></el-select>
    </el-form-item>

    <el-form-item label="提交时间：">
      <el-date-picker
        type="datetimerange"
        range-separator="To"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        value-format="YYYY-MM-DD HH:mm:ss"
      />
    </el-form-item>
  </LwSearch>

  <el-card>
    <template #header>
      <el-button @click="handleDialog">弹窗</el-button>
    </template>

    <LwTable
      :data="tableData"
      :columns="columns"
      border
      :precol="['selection', 'index']"
      :subcol="subcol"
      @selectionChange="onSelectionChange"
    >
      <LwTableColumn prop="state" label="State" width="180" />
      <LwTableColumn prop="tag" label="Tag" width="180" />
      <LwTableColumn
        :filters="[
          { text: 'Home', value: 'Home' },
          { text: 'Office', value: 'Office' },
        ]"
        prop="zip"
        label="Zip"
        width="180"
      >
        <template #default="scope">
          <el-input v-model="scope.row.zip" />
        </template>
        <template #filter-icon="scope">123</template>
      </LwTableColumn>

      <LwTableColumn prop="address" label="Address" width="180">
        <template #header="{ column }">
          <span>
            {{ column.label }}
            <el-tooltip
              effect="dark"
              content="会员充值实付金额（不包含手动调整的储值卡金额、台费卡金额）"
              placement="top"
            >
              <el-icon>
                <WarningFilled />
              </el-icon>
            </el-tooltip>
          </span>
        </template>
      </LwTableColumn>
    </LwTable>
  </el-card>

  <LwTable>
    <LwTableColumn prop="address" label="Address" width="180">
      <template #header="{ column }">
        <span>
          {{ column.label }}
          <el-tooltip
            effect="dark"
            content="会员充值实付金额（不包含手动调整的储值卡金额、台费卡金额）"
            placement="top"
          >
            <el-icon>
              <WarningFilled />
            </el-icon>
          </el-tooltip>
        </span>
      </template>
    </LwTableColumn>
  </LwTable>

  <LwForm v-model="formData" :rules="rules" :items="formItems" ref="lwFormRef">
    <template #desc>
      <el-input v-model="formData.desc" type="textarea" />
    </template>
  </LwForm>

  <el-button type="primary" @click="lwFormRef?.validate">校验</el-button>
  <el-button @click="lwFormRef?.resetFields">重置</el-button>

  <el-divider />

  <LwFormComp>
    <template #desc>
      <el-input v-model="formData.desc" type="textarea" />
    </template>
  </LwFormComp>

  <el-button type="primary" @click="validateLwForm">校验</el-button>
  <el-button @click="resetFieldsLwForm">重置</el-button>
</template>

<style scoped lang="scss"></style>
