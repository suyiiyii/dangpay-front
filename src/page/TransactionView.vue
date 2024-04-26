<style scoped>
.app-container {
  padding: 20px;
  margin: 0 auto;
  width: 100%;
  max-width: 1800px;
  min-height: 100vh;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  box-sizing: border-box;
  padding-bottom: 20px;
}
</style>

<template>
  <div class="app-container">
    <h1>全局交易记录</h1>
    <el-table
      :data="transactionList"
      style="width: 100%"
      :default-sort="{ prop: 'id', order: 'descending' }"
    >
      <el-table-column prop="id" label="交易ID"></el-table-column>
      <el-table-column prop="walletId" label="钱包ID"></el-table-column>
      <el-table-column prop="amount" label="金额"></el-table-column>
      <el-table-column prop="type" label="类型"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column prop="relateUserId" label="关联用户ID"></el-table-column>
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
      <el-table-column prop="platform" label="平台"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
    </el-table>

    <template v-for="transaction in transactionList" :key="transaction.id">
      <el-card>
        <p>交易ID: {{ transaction.id }}</p>
        <p>钱包ID: {{ transaction.walletId }}</p>
        <p>金额: {{ transaction.amount }}</p>
        <p>类型: {{ transaction.type }}</p>
        <p>状态: {{ transaction.status }}</p>
        <p>关联用户ID: {{ transaction.relateUserId }}</p>
        <p>创建时间: {{ transaction.createTime }}</p>
        <p>最后更新: {{ transaction.lastUpdate }}</p>
        <p>平台: {{ transaction.platform }}</p>
        <p>描述: {{ transaction.description }}</p>
      </el-card>
    </template>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import useRequest from "~/request";
import { useMyNewStore } from "~/myStore";
import { timeStamp2timeStampString } from "~/tools";
import type { TableColumnCtx } from "element-plus";
const myStore = useMyNewStore();
const request = useRequest();

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
const transactionList = ref([
  {
    id: 0,
    walletId: 0,
    amount: 0,
    type: "string",
    status: "string",
    relateUserId: 0,
    createTime: 0,
    lastUpdate: 100,
    platform: "string",
    description: "string",
  },
]);

const getTransactionList = async () => {
  var page = 1;
  var size = 100;
  const res = await request.get(
    "/transaction?" + "page=" + page + "&size=" + size
  );
  transactionList.value = res.data;
};

onMounted(() => {
    getTransactionList();
});

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
