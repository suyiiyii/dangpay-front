<template>
  <el-config-provider namespace="ep">
    <BaseHeader />
    <div class="flex main-container">
      <BaseSide />

      <div style="height: 100%; width: 100%">
        <div class="column">
          <router-view />
        </div>
      </div>
      <!-- <div w="full" py="4">
        <Logos my="4" />
        <HelloWorld msg="Hello Vue 3 + Element Plus + Vite" />
      </div> -->
    </div>
  </el-config-provider>
</template>

<style>
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
}

.main-container {
  height: calc(100vh - var(--ep-menu-item-height) - 3px);
}

.column {
  display: flex;
  flex-direction: column;
  align-items: center;
}


.ep-button {
  /* font-family: Inter, system-ui, Avenir, "Helvetica Neue", Helvetica,
    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial,
    sans-serif  !important; */
  padding: 8px 16px !important;
  /* background-color: aqua !important; */
}
</style>
