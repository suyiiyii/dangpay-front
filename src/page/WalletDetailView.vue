<template>
  <div>
    <h1>钱包详情</h1>
    <p>{{ wallet }}</p>
    <h1>交易记录</h1>
    <template v-for="transcation in transcations">
      <p>{{ transcation }}</p>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import useRequest from "~/request";
import { useRouter } from "vue-router";
const router = useRouter();
const request = useRequest();
const walletId = ref(router.currentRoute.value.params.id);

const wallet = ref({});
const getWalletDetail = () => {
  request.get(`/wallet/${walletId.value}`).then((res) => {
    wallet.value = res.data;
  });
};

const transcations = ref([]);
const getTranscations = () => {
  request.get(`/wallet/${walletId.value}/transactions`).then((res) => {
    transcations.value = res.data;
  });
};
onMounted(() => {
  getWalletDetail();
  getTranscations();
});
</script>
