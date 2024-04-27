<template>
  <el-descriptions border title="钱包信息">
    <el-descriptions-item label="钱包ID">{{ wallet.id }}</el-descriptions-item>
    <el-descriptions-item label="钱包名称">{{
      wallet.name
    }}</el-descriptions-item>
    <el-descriptions-item label="余额">{{
      wallet.amount
    }}</el-descriptions-item>
    <el-descriptions-item label="冻结金额">{{
      wallet.amountInFrozen
    }}</el-descriptions-item>
    <el-descriptions-item label="所有者类型">{{
      wallet.ownerType
    }}</el-descriptions-item>
    <el-descriptions-item label="所有者ID">{{
      wallet.ownerId
    }}</el-descriptions-item>
    <el-descriptions-item label="是否子钱包">{{
      wallet.isSubWallet
    }}</el-descriptions-item>
    <el-descriptions-item label="父钱包ID">{{
      wallet.fatherWalletId
    }}</el-descriptions-item>
    <el-descriptions-item label="最后更新时间">{{
      timeFormatter(wallet.lastUpdate)
    }}</el-descriptions-item>
    <el-descriptions-item label="状态">{{
      wallet.status
    }}</el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { timeStamp2timeStampString } from "~/tools";

const props = defineProps<{
  wallet: Wallet;
}>(); // 通过 defineProps 定义 props

interface Wallet {
  id: number;
  name: string;
  amount: number;
  amountInFrozen: number;
  ownerType: string;
  ownerId: number;
  isSubWallet: number;
  fatherWalletId: number;
  lastUpdate: number;
  status: string;
}

const timeFormatter = (time: number) => {
  return timeStamp2timeStampString(time*1000);
};
</script>
