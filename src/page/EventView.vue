<template>
  <h1>审计日志</h1>
  <el-pagination
    background
    layout="prev,pager,next"
    :page-count="10"
    @current-change="pageChange"
  />
  <el-table :data="logs" style="width: 100%" height="100hv">
    <el-table-column prop="id" label="ID"></el-table-column>
    <el-table-column prop="uid" label="用户ID"></el-table-column>
    <el-table-column prop="method" label="方法"></el-table-column>
    <el-table-column prop="permission" label="权限"></el-table-column>
    <el-table-column prop="ip" label="IP"></el-table-column>
    <el-table-column prop="ua" label="UA"></el-table-column>
    <el-table-column
      prop="createTime"
      label="创建时间"
      :formatter="createTimeFormatter"
    ></el-table-column>
    <el-table-column prop="status" label="状态"></el-table-column>
  </el-table>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useMyNewStore } from "~/myStore";
import { timeStamp2timeStampString } from "~/tools";
import type { TableColumnCtx } from "element-plus";
import useRequest from "~/request";
const request = useRequest();
const myStore = useMyNewStore();
const page = ref(1);
const size = ref(100);
interface Log {
  id: number;
  uid: number;
  method: string;
  permission: string;
  ip: string;
  ua: string;
  createTime: number;
  status: string;
}
const createTimeFormatter = (row: Log, column: TableColumnCtx<Log>) => {
  return timeStamp2timeStampString(1000 * row.createTime);
};
const logs = ref<Log[]>([
  {
    id: 2623,
    uid: 14,
    method:
      "top.suyiiyii.service.TransactionService/createMoneyReceiveIdentity",
    permission: "TransactionServiceCreateMoneyReceiveIdentity/w120010",
    ip: "192.168.68.176",
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    createTime: 1714128127,
    status: "success",
  },
]);

const getEvents = (page: number, size: number) => {
  request.get("/event?" + "page=" + page + "&size=" + size).then((res) => {
    logs.value = res.data;
  });
};
onMounted(() => {
  getEvents(page.value, size.value);
});

const pageChange = (newPage: number) => {
  getEvents(newPage, size.value);
};
</script>
