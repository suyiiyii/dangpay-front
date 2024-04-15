<template>
  <div>
    <h2>请登录</h2>
    <!-- 这个 @submit="login(username, password) 好像没什么用 -->
    <el-form class="login-form" @submit="login(username, password)">
      <el-form-item>
        <el-input
          v-model="username"
          type="text"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="password"
          type="password"
          show-password
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-button
            type="primary"
            style="width: 100%"
            :loading="loginLoading"
            @click="login(username, password)"
            >登录</el-button
          >
        </el-col>
      </el-row>
    </el-form>

    <h1>注册</h1>
    <el-form class="login-form">
      <el-form-item>
        <el-input
          v-model="username"
          type="text"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="password"
          type="password"
          show-password
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="phone"
          type="text"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-button
            type="primary"
            style="width: 100%"
            :loading="registerLoading"
            @click="register(username, password, phone)"
            >注册</el-button
          >
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import useRequest from "~/request";
const request = useRequest();
const username = ref("");
const password = ref("");
const phone = ref("");

const login = (username, password) => {
  request
    .post(
      "/user/login",
      {
        grant_type: "password",
        username: username,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then((res) => {
      localStorage.setItem("token", res.data.access_token);
    });
};

const logout = () => {
  localStorage.removeItem("token");
};

const register = (username, password, phone) => {
  request.post("/user/register", {
    username: username,
    password: password,
    phone: phone,
  });
};
</script>
