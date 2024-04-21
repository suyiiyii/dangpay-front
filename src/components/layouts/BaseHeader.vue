<script lang="ts" setup>
import { toggleDark } from "~/composables";

import { ref, onMounted } from "vue";
import axios from "axios";
import useRequest from "~/request";
const request = useRequest();
const platform = ref("dangpay");
const updatePlatform = () => {
  if (localStorage.getItem("platform")) {
    platform.value = localStorage.getItem("platform");
  } else {
    request.get("/health").then((res) => {
      platform.value = res.data.platform;
      localStorage.setItem("platform", platform.value);
    });
  }
};
onMounted(() => {
  updatePlatform();
});
</script>

<template>
  <el-menu class="el-menu-demo" mode="horizontal" default-active="1">
    <el-menu-item index="1">
      <h3>欢迎使用 {{ platform }}</h3>
    </el-menu-item>
    <!-- <el-menu-item index="1">Element Plus</el-menu-item> -->
    <!-- <el-sub-menu index="2">
      <template #title>Workspace</template>
      <el-menu-item index="2-1">item one</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="3" disabled>Info</el-menu-item>
    <el-menu-item index="4">Orders</el-menu-item> -->
    <el-menu-item h="full" @click="toggleDark()">
      <button
        class="border-none w-full bg-transparent cursor-pointer"
        style="height: var(--ep-menu-item-height)"
      >
        <i inline-flex i="dark:ep-moon ep-sunny" />
      </button>
    </el-menu-item>
  </el-menu>
</template>
