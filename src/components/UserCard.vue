<template>
  <section v-if="type == 'big'">
    <el-avatar :icon="UserFilled" />
    <div>
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
    </div>
  </section>
  <section v-else>
    <el-avatar :icon="UserFilled" />
    <div>&nbsp; &nbsp;{{ user.username }}</div>
  </section>
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
  type: {
    type: String,
    default: "big",
  },
});

const user = ref({
  id: -1,
  username: "666",
  role: "666",
  phone: "666",
});

onMounted(() => {
  if (porps.data.username != null) {
    user.value.username = porps.data.username;
  } else {
    var uid = null;
    console.log(porps.data);
    if (porps.data.id != undefined || porps.data.id != null) {
      uid = porps.data.id;
    }
    if (porps.data.uid != undefined || porps.data.uid != null) {
      uid = porps.data.uid;
    }
    myStore.getUserInfo(uid).then((res) => {
      user.value = res;
      user.value.role = porps.data.role;
    });
  }
});
</script>

<style scoped>
section {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
}
</style>
