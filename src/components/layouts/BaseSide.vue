<template>
  <el-menu
    :default-active="router.currentRoute.value.fullPath"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <RouterLink to="/">
      <el-menu-item index="/">
        <el-icon><House /></el-icon>
        <template #title> 主页 </template>
      </el-menu-item>
    </RouterLink>
    <RouterLink to="/group">
      <el-menu-item index="/group">
        <el-icon><Menu /></el-icon>
        <template #title> 群组 </template>
      </el-menu-item>
    </RouterLink>
    <RouterLink to="/wallet">
      <el-menu-item index="/wallet">
        <el-icon><Menu /></el-icon>
        <template #title> 钱包 </template>
      </el-menu-item>
    </RouterLink>
    <!-- <RouterLink to="/dish">
      <el-menu-item index="/dish">
        <el-icon><Food /></el-icon>
        <template #title> 点菜 </template>
      </el-menu-item>
    </RouterLink>
    <RouterLink to="/order">
      <el-menu-item index="/order">
        <el-icon><Wallet /></el-icon>
        <template #title> 结账 </template>
      </el-menu-item>
    </RouterLink>
    <RouterLink to="/myorder">
      <el-menu-item index="/myorder">
        <el-icon><List /></el-icon>
        <template #title> 订单 </template>
      </el-menu-item>
    </RouterLink> -->
    <!-- <el-sub-menu index="1">
      <template #title>
        <el-icon><location /></el-icon>
        <span>Navigator One</span>
      </template>
      <el-menu-item-group>
        <template #title><span>Group One</span></template>
        <el-menu-item index="1-1">item one</el-menu-item>
        <el-menu-item index="1-2">item two</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="Group Two">
        <el-menu-item index="1-3">item three</el-menu-item>
      </el-menu-item-group>
      <el-sub-menu index="1-4">
        <template #title><span>item four</span></template>
        <el-menu-item index="1-4-1">item one</el-menu-item>
      </el-sub-menu>
    </el-sub-menu> -->
    <!-- <el-menu-item index="2">
      <el-icon><icon-menu /></el-icon>
      <template #title>Navigator Two</template>
    </el-menu-item>
    <el-menu-item index="3" disabled>
      <el-icon><document /></el-icon>
      <template #title>Navigator Three</template>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon><setting /></el-icon>
      <template #title>Navigator Four</template>
    </el-menu-item> -->
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  Location,
  Document,
  Menu as IconMenu,
  Setting,
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const router = useRouter();

// const isCollapse = ref(true);
const isCollapse = ref(false);
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
a {
  text-decoration: none;
}
</style>
