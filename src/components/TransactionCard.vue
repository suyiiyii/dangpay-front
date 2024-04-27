<template>
  <el-table
    :data="transactionList"
    style="width: 100%"
    :default-sort="{ prop: 'id', order: 'descending' }"
    height="1100"
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
    <template v-if="isShowReimburse">
      <el-table-column sortable prop="reimburse" label="报销凭证">
        <template #default="scope">
          <!-- 下载按钮 -->
          <el-button
            type="primary"
            @click="downloadReimburse(scope.row.reimburse)"
            size="small"
            :disabled="
              scope.row.reimburse === '' || scope.row.reimburse === 'N/A'
            "
            >下载</el-button
          >
          <!-- 上传按钮 -->
          <el-button
            type="primary"
            @click="uploadReimburse(scope.row.id)"
            size="small"
            :disabled="!(scope.row.reimburse === '')"
            >上传</el-button
          >
        </template>
      </el-table-column>
    </template>
  </el-table>
  <el-dialog title="上传报销凭证" v-model="uploadDialogVisible" width="30%">
    <el-upload
      action="https://jsonplaceholder.typicode.com/posts/"
      name="file"
      :http-request="upload"
      :before-upload="beforeFileUpload"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import useRequest from "~/request";
import { useMyNewStore } from "~/myStore";
import { timeStamp2timeStampString } from "~/tools";
import type { TableColumnCtx } from "element-plus";
const myStore = useMyNewStore();
const request = useRequest();

const props = defineProps<{
  transactionList: { type: Transaction[]; default: () => [] };
  isShowReimburse: { type: boolean; default: false };
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
  reimburse: string;
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

const downloadReimburse = (reimburse: string) => {
  console.log(reimburse);
  window.open(reimburse);
};

const uploadDialogVisible = ref(false);
const uploadReimburse = (id: number) => {
  currentTransactionId.value = id;
  console.log(id);
  uploadDialogVisible.value = true;
};

import { ElMessage } from "element-plus";
import type { UploadProps, UploadRequestOptions } from "element-plus";
const beforeFileUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error("File size can not exceed 10MB!");
    return false;
  }
  return true;
};
const currentTransactionId = ref(0);
const uploadUrl = computed(
  () => `/transaction/${currentTransactionId.value}/reimburse`
);
const upload = (options: UploadRequestOptions) => {
  const formData = new FormData();
  formData.append("file", options.file);
  request.post(uploadUrl.value, formData).then((res) => {
    options.onSuccess(res);
  });
};
</script>
