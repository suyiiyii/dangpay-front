<template>
  <div>
    <el-button type="primary" @click="createPersonalWallet"
      >创建个人钱包</el-button
    >
    <h1>我的钱包</h1>
    <template v-for="wallet in wallets">
      <!-- <p @click="router.push(`/wallet/${wallet.id}`)">{{ wallet }}</p> -->
      <div>
        <wallet-card :wallet="wallet" />
        <el-button
          type="primary"
          @click="
            router.push({ name: 'WalletDetail', params: { id: wallet.id } })
          "
          >查看详情</el-button
        >
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import useRequest from "~/request";
import { useRouter } from "vue-router";
const router = useRouter();
const request = useRequest();
const wallets = ref([]);

const getMyWallets = () => {
  request.get("/wallet").then((res) => {
    wallets.value = res.data;
  });
};

onMounted(() => {
  getMyWallets();
});

const createPersonalWallet = () => {
  request
    .post("/wallet", {
      type: "createPersonalWallet",
    })
    .then((res) => {
      getMyWallets();
    });
};
</script>
