<template>
  <el-avatar :icon="UserFilled" />
  <el-descriptions title="用户信息" :border="false">
    <el-descriptions-item label="用户名">{{
      user.username
    }}</el-descriptions-item>
    <el-descriptions-item label="用户角色">{{
      user.role
    }}</el-descriptions-item>
    <el-descriptions-item label="用户电话">{{
      user.phone
    }}</el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { defineProps } from "vue";
import { useMyNewStore } from "~/myStore";
import { UserFilled } from "@element-plus/icons-vue";
const myStore = useMyNewStore();
const porps = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});

const user = ref({
  id: -1,
  username: "666",
  role: "666",
  phone: "666",
});

const getUserInfo = (id: number) => {
  myStore.getUserInfo(id).then((res) => {
    console.log(res);
  });
};

onMounted(() => {
  myStore.getUserInfo(porps.data.id).then((res) => {
    user.value = res;
    user.value.role = porps.data.role
  });
});
</script>
