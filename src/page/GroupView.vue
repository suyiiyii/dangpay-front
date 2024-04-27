<template>
  <h1>群组列表</h1>
  <template v-for="group in groups">
    <p
      @click="
        amIAdmin
          ? router.push({ name: 'GroupDetail', params: { id: group.id } })
          : null
      "
    >
      <group-card :data="group" />
      <!-- {{ group }} -->
    </p>
    <!-- 加入群组按钮 -->
    <el-button type="primary" @click="clickJoinGroup(group.id)"
      >加入群组 {{ group.id }}</el-button
    >
    <template v-if="amIAdmin">
      <!-- ban群组按钮 -->
      <el-button type="danger" @click="banGroup(group.id)">ban群组</el-button>
      <!-- unban群组按钮 -->
      <el-button type="danger" @click="currentGroupId=group.id,unbanGroup(group.id)"
        >unban群组</el-button
      >
    </template>

    <hr />
  </template>
  <h1>创建群组</h1>

  <el-form :model="groupFrom">
    <!-- 表单项：name -->
    <el-form-item label="名称：">
      <el-input v-model="groupFrom.name"></el-input>
    </el-form-item>

    <!-- 表单项：pepoleCount
      <el-form-item label="人数：">
        <el-input v-model="groupFrom.pepoleCount"></el-input>
      </el-form-item> -->

    <!-- 表单项：enterpriseScale -->
    <el-form-item label="企业规模：">
      <el-input v-model="groupFrom.enterpriseScale"></el-input>
    </el-form-item>

    <!-- 表单项：industry -->
    <el-form-item label="行业：">
      <el-input v-model="groupFrom.industry"></el-input>
    </el-form-item>

    <!-- 表单项：address -->
    <el-form-item label="地址：">
      <el-input v-model="groupFrom.address"></el-input>
    </el-form-item>

    <!-- 表单项：contact -->
    <el-form-item label="联系方式：">
      <el-input v-model="groupFrom.contact"></el-input>
    </el-form-item>

    <!-- 按钮：更新信息 -->
    <el-button type="primary" @click="CreateGroupDialog = true"
      >创建群组</el-button
    >
  </el-form>

  <h1>我的群组</h1>
  <template v-for="group in myGroups">
    <p @click="router.push({ name: 'GroupDetail', params: { id: group.id } })">
      <group-card :data="group" />
      <!-- {{ group }} -->
    </p>
    <template
      v-if="group.status === 'ban' && checkRole('GroupCreator/g' + group.id)"
    >
      <el-button
        type="danger"
        @click="(ubanGroupDialog = true), (currentGroupId = group.id)"
        >申请解封群组</el-button
      >
    </template>
  </template>
  <el-dialog v-model="dialogTableVisible" title="申请入群" width="400">
    <el-form>
      <el-form-item label="原因">
        <el-input v-model="reason"></el-input>
      </el-form-item>
      <el-button type="primary" @click="joinGroup(currentGroupId)">
        加入
      </el-button>
    </el-form>
  </el-dialog>
  <el-dialog v-model="CreateGroupDialog" title="申请创建群组" width="400">
    <el-form>
      <el-form-item label="原因">
        <el-input v-model="reason"></el-input>
      </el-form-item>
      <el-button type="primary" @click="createGroup()"> 申请创建 </el-button>
    </el-form>
  </el-dialog>
  <el-dialog v-model="ubanGroupDialog" title="申请解封群组" width="400">
    <el-form>
      <el-form-item label="原因">
        <el-input v-model="reason"></el-input>
      </el-form-item>
      <el-button type="primary" @click="unbanGroup(currentGroupId)">
        申请
      </el-button>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";
import useRequest from "~/request";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useMyNewStore } from "~/myStore";
const myStore = useMyNewStore();
const router = useRouter();
const request = useRequest();
const groups = ref([]);
const myGroups = ref([]);

const getGroups = () => {
  request.get("/group").then((res) => {
    groups.value = res.data;
  });
};

const groupFrom = ref({
  name: "",
  pepoleCount: "",
  enterpriseScale: "",
  industry: "",
  address: "",
  contact: "",
});

const createGroup = () => {
  request
    .post("/group", groupFrom.value, {
      headers: {
        "X-Reason": reason.value || "无",
      },
    })
    .then((res) => {
      ElMessage.success("申请成功");
    });
};

const getMyGroups = () => {
  request.get("/group/my").then((res) => {
    myGroups.value = res.data;
  });
};

const dialogTableVisible = ref(false);
const currentGroupId = ref("");
const reason = ref("");
const clickJoinGroup = (groupId) => {
  dialogTableVisible.value = true;
  currentGroupId.value = groupId;
};
const joinGroup = (groupId) => {
  request
    .post(
      "/group/" + groupId + "/join/",
      {},
      {
        headers: {
          "X-Reason": reason.value || "无",
        },
      }
    )
    .then((res) => {
      ElMessage.success("申请成功");
      getMyGroups();
    });
};

const CreateGroupDialog = ref(false);

const banGroup = (groupId) => {
  request.post("/group/" + groupId + "/ban/").then((res) => {
    ElMessage.success("ban成功");
    getGroups();
  });
};

const ubanGroupDialog = ref(false);
const unbanGroup = () => {
  if (amIAdmin.value) {
    request.post("/group/" + currentGroupId.value + "/unban/").then((res) => {
      ElMessage.success("unban成功");
      getGroups();
    });
  } else {
    request
      .post(
        "/group/" + currentGroupId.value + "/unban/",
        {},
        {
          headers: {
            "X-Reason": reason.value || "无",
          },
        }
      )
      .then((res) => {
        ElMessage.success("unban成功");
        getGroups();
      });
  }
};

const amIAdmin = ref(false);

onMounted(() => {
  getGroups();
  getMyGroups();
  myStore.amIAdmin().then((res) => {
    amIAdmin.value = res;
  });
});

const checkRole = (role) => {
  return myStore.checkRole(role);
};
</script>

<style scoped></style>
