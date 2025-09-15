<script setup lang="ts">
import { WarningFilled } from '@element-plus/icons-vue';
import useTable from '~/hooks/useTable';

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
</template>

<style scoped lang="scss"></style>
