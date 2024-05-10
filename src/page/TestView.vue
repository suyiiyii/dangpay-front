<template>
  <h2>向第三方平台付款</h2>
  <el-input
    style="width: 200px"
    v-model="amount"
    type="number"
    placeholder="请输入付款金额"
  ></el-input>
  <el-input
    style="width: 200px; margin-top: 10px"
    v-model="amount"
    type="number"
    placeholder="请输入收款人id"
  ></el-input>
  <el-button
    type="primary"
    @click="createMoneyReceiveCode(amount)"
    style="margin-top: 10px"
    >付款</el-button
  >
</template>
