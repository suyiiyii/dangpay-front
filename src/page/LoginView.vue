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
    <el-button type="primary" @click="logout">注销登录</el-button>

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
    <h1>用户个人信息</h1>
    <el-form :model="userData">
      <el-form-item label="用户id：">
        <el-input v-model="userData.id"
      /></el-form-item>
      <el-form-item label="用户名：">
        <el-input v-model="userData.username"
      /></el-form-item>
      <!-- <el-form-item label="密码：">
        <el-input v-model="userData.password"
      /></el-form-item> -->
      <el-form-item label="手机号：">
        <el-input v-model="userData.phone"
      /></el-form-item>
      <el-form-item label="头像：">
        <!-- <el-input v-model="userData.iconUrl"/> -->

        <el-upload
          class="avatar-uploader"
          :http-request="upload"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"
            ><Plus
          /></el-icon> </el-upload
      ></el-form-item>

      <el-button type="primary" @click="getUserInfo(userData.id)"
        >获取个人信息</el-button
      >
      <el-button type="primary" @click="updateUserInfo">更新个人信息</el-button>
    </el-form>

    <h1>改密码</h1>
    <el-form class="login-form">
      <el-form-item>
        <el-input
          v-model="oldPassword"
          type="password"
          show-password
          placeholder="请输入旧密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="newPassword"
          type="password"
          show-password
          placeholder="请输入新密码"
        ></el-input>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-button type="primary" style="width: 100%" @click="changePassword"
            >改密码</el-button
          >
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { onMounted, ref } from "vue";
import { useMyNewStore } from "~/myStore";
import useRequest from "~/request";

// import { Plus } from "@element-plus/icons-vue";

import type { UploadProps, UploadRequestOptions } from "element-plus";
const myStore = useMyNewStore();
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

const userData = ref({});

const getUserInfo = (id) => {
  request.get("/user/" + id).then((res) => {
    userData.value = res.data;
    userData.password = "";
  });
};

const updateUserInfo = () => {
  request.patch("/user/" + userData.value.id, userData.value).then((res) => {
    userData.value = res.data;
  });
};

const getUid = () => {
  var token = localStorage.getItem("token");
  if (token == null) {
    return null;
  }
  let strings = token.split("."); //截取token，获取载体
  var userinfo = JSON.parse(
    decodeURIComponent(
      escape(window.atob(strings[1].replace(/-/g, "+").replace(/_/g, "/")))
    )
  ); //解析，需要吧‘_’,'-'进行转换否则会无法解析
  const data = JSON.parse(userinfo.sub);
  return data.uid;
};

const newPassword = ref("");
const oldPassword = ref("");

const changePassword = () => {
  const uid = getUid();
  request.post(`/user/` + uid + `/changePassword`, {
    oldPassword: oldPassword.value,
    newPassword: newPassword.value,
  });
};

onMounted(() => {
  userData.value.id = getUid();
  getUserInfo(userData.value.id);
});
/*
用户信息模板
{
    "id": 2,
    "username": "2e11e732",
    "password": "1ea5edbf2622c0302f336d5bed6726f4",
    "phone": "3219079789398127893",
    "iconUrl": "1111",
    "status": "normal"
}
*/

const uploadUrl = ref(myStore.base_url + "/upload");

const imageUrl = ref("");

import { ElMessage } from "element-plus";
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.type !== "image/jpeg" && rawFile.type !== "image/png") {
    ElMessage.error("Avatar picture must be JPG or PNG format!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 1) {
    ElMessage.error("Avatar picture size can not exceed 1MB!");
    return false;
  }
  return true;
};

const upload = (options: UploadRequestOptions) => {
  const formData = new FormData();
  formData.append("file", options.file);
  request.post(uploadUrl.value, formData).then((res) => {
    imageUrl.value = res.data;
    userData.value.iconUrl = res.data;
    options.onSuccess(res);
  });
};
</script>



<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>