<template>
  <div>
    <el-button type="primary" @click="createPersonalWallet"
      >创建个人钱包</el-button
    >
    <h1>我的钱包</h1>
    <template v-for="wallet in wallets">
      <p>{{ wallet }}</p>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import useRequest from "~/request";
import { useRouter } from "vue-router";
const router = useRouter();
const request = useRequest();
const wallets = ref([
  {
    id: 2,
    amount: 0,
    amountInFrozen: 0,
    ownerType: "user",
    ownerId: 1,
    isSubWallet: 0,
    fatherWalletId: 0,
    lastUpdate: 1713438277,
  },
]);

const getMyWallets = () => {
  request.get("/wallet").then((res) => {
    wallets.value = res.data;
  });
};

onMounted(() => {
  getMyWallets();
});

const createPersonalWallet = () => {
  request.post("/wallet", {
    type: "createPersonalWallet",
  });
  getMyWallets();
};
</script>
