<template>
  <el-table
    :data="transactionList"
    style="width: 100%"
    :default-sort="{ prop: 'id', order: 'descending' }"
  >
    <el-table-column sortable prop="id" label="交易ID"></el-table-column>
    <el-table-column sortable prop="walletId" label="钱包ID"></el-table-column>
    <el-table-column sortable prop="amount" label="金额"></el-table-column>
    <el-table-column sortable prop="type" label="类型"></el-table-column>
    <el-table-column sortable prop="status" label="状态"></el-table-column>
    <el-table-column
      sortable
      prop="relateUserId"
      label="关联用户ID"
    ></el-table-column>
    <el-table-column
      prop="createTime"
      label="创建时间"
      :formatter="createTimeFormatter"
    ></el-table-column>
    <el-table-column
      prop="lastUpdate"
      label="最后更新"
      :formatter="updateTimeFormatter"
    ></el-table-column>
    <el-table-column sortable prop="platform" label="平台"></el-table-column>
    <el-table-column sortable prop="description" label="描述"></el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import useRequest from "~/request";
import { useMyNewStore } from "~/myStore";
import { timeStamp2timeStampString } from "~/tools";
import type { TableColumnCtx } from "element-plus";
const myStore = useMyNewStore();
const request = useRequest();

const props = defineProps<{
  transactionList: Transaction[];
}>();

interface Transaction {
  id: number;
  walletId: number;
  amount: number;
  type: string;
  status: string;
  relateUserId: number;
  createTime: number;
  lastUpdate: number;
  platform: string;
  description: string;
}

const createTimeFormatter = (
  row: Transaction,
  column: TableColumnCtx<Transaction>
) => {
  return timeStamp2timeStampString(1000 * row.createTime);
};
const updateTimeFormatter = (
  row: Transaction,
  column: TableColumnCtx<Transaction>
) => {
  return timeStamp2timeStampString(1000 * row.lastUpdate);
};
</script>
