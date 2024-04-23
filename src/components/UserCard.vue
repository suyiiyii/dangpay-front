<template>
  <section v-if="type == 'big'">
    <el-avatar :src="user.avatar" />
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
  <section v-if="type == 'small'">
    <el-avatar :src="user.avatar" />
    <div>&nbsp; &nbsp;{{ user.username }}</div>
  </section>

  <template v-if="type == 'onlyLogo'">
    <el-avatar :src="user.avatar" />
  </template>
  <template v-if="type == 'onlyname'">
    {{ user.username }}
  </template>
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
  uid: {
    type: Number,
    default: null,
  },
});

const user = ref({
  id: -1,
  username: "666",
  role: "666",
  phone: "666",
  avatar: "6",
});

onMounted(() => {
  var uid = null;
  if (porps.uid != undefined || porps.uid != null) {
    uid = porps.uid;
  } else {
    if (porps.data.id != undefined || porps.data.id != null) {
      uid = porps.data.id;
    }
    if (porps.data.uid != undefined || porps.data.uid != null) {
      uid = porps.data.uid;
    }
  }

  myStore.getUserInfo(uid).then((res) => {
    console.log(res);
    user.value.username = res.username;
    user.value.role = porps.data.role;
    user.value.phone = res.phone;
    user.value.avatar = res.iconUrl;
    if (porps.data.username != null) {
      user.value.username = porps.data.username;
    }
    if (user.value.avatar === null) {
      user.value.avatar =
        "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";
    }
    console.log(user.value);
  });
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
