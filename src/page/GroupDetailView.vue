<template>
  <div>
    <h1>群组详情</h1>
    <group-card :data="groupFrom" />
    <!-- <p>{{ groupFrom }}</p> -->
    <el-form :model="groupFrom">
      <!-- 表单项：name -->
      <el-form-item label="名称：">
        <el-input v-model="groupFrom.name" :disabled="!amIAdmin"></el-input>
      </el-form-item>

      <!-- 表单项：pepoleCount
      <el-form-item label="人数：">
        <el-input v-model="groupFrom.pepoleCount"></el-input>
      </el-form-item> -->

      <!-- 表单项：enterpriseScale -->
      <el-form-item label="企业规模：">
        <el-input
          v-model="groupFrom.enterpriseScale"
          :disabled="!amIAdmin"
        ></el-input>
      </el-form-item>

      <!-- 表单项：industry -->
      <el-form-item label="行业：">
        <el-input v-model="groupFrom.industry" :disabled="!amIAdmin"></el-input>
      </el-form-item>

      <!-- 表单项：address -->
      <el-form-item label="地址：">
        <el-input v-model="groupFrom.address" :disabled="!amIAdmin"></el-input>
      </el-form-item>

      <!-- 表单项：contact -->
      <el-form-item label="联系方式：">
        <el-input v-model="groupFrom.contact" :disabled="!amIAdmin"></el-input>
      </el-form-item>

      <template v-if="amIAdmin">
        <!-- 按钮：更新信息 -->
        <el-button type="primary" @click="updateGroup">更新信息</el-button>

        <!-- 按钮：不公开群组 -->
        <el-button type="danger" @click="hideGroup(groupFrom.id)"
          >不公开群组</el-button
        >

        <!-- 按钮：公开群组 -->
        <el-button type="danger" @click="unhideGroup(groupFrom.id)"
          >公开群组</el-button
        >
        <!-- 按钮：解散群组 -->
        <el-button type="danger" @click="destroyGroup">解散群组</el-button>
      </template>
      <br />
      <hr />

      <!-- 按钮：退出群组 -->
      <el-button type="danger" @click="leaveGroup">退出群组</el-button>
    </el-form>

    <h1>群组成员</h1>
    <template v-for="member in members">
      <!-- <p>{{ member }}</p> -->
      <UserCard :data="member" />
      <template v-if="amIAdmin">
        <!-- 按钮：移除成员 -->
        <el-button type="danger" @click="removeMember(member.id)"
          >移除成员</el-button
        >
        <!-- 按钮：添加为管理员 -->
        <el-button type="primary" @click="addAdmin(member.id)"
          >添加为管理员</el-button
        >
        <!-- 按钮：分配一个群组子钱包 -->
        <el-button type="primary" @click="createSubWallet(member.id)"
          >分配一个群组子钱包</el-button
        >
        <!-- 按钮：转让群主 -->
        <el-button type="primary" @click="transferCreator(member.id)"
          >转让群主</el-button
        >
      </template>
    </template>
    <template v-if="amIAdmin">
      <h1>邀请用户</h1>
      <el-input v-model="memberId" style="width: 200px"></el-input>
      <el-button type="primary" @click="dialogTableVisible = true"
        >邀请</el-button
      >
      <h1>群组钱包</h1>
      <h2>主钱包</h2>
      <el-button type="primary" @click="createGroupWallet"
        >创建群组钱包</el-button
      >
      <template v-for="wallet in wallets">
        <p>{{ wallet }}</p>
      </template>
      <h2>子钱包</h2>
      <template v-for="subWallet in subWallets">
        <p>{{ subWallet }}</p>
        <el-input v-model="subWallet.amount" style="width: 200px"></el-input>
        <el-button
          type="primary"
          @click="allocateSubWallet(subWallet.id, subWallet.amount)"
          >分配</el-button
        >
      </template>
    </template>
  </div>
  <el-dialog v-model="dialogTableVisible" title="邀请入群" width="400">
    <el-form>
      <el-form-item label="原因">
        <el-input v-model="reason"></el-input>
      </el-form-item>
      <el-button type="primary" @click="addMember()"> 加入 </el-button>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";
import useRequest from "~/request";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import GroupCard from "~/components/GroupCard.vue";
import { useMyNewStore } from "~/myStore";
import UserCard from "~/components/UserCard.vue";
const myStore = useMyNewStore();
const router = useRouter();
const { params } = router.currentRoute.value;
const request = useRequest();
const groupId = params.id;
const groupFrom = ref({});
const getGroup = () => {
  request.get("/group/" + groupId).then((res) => {
    groupFrom.value = res.data;
  });
};
const members = ref([]);
const getGroupMembers = () => {
  request.get("/group/" + groupId + "/members").then((res) => {
    members.value = res.data;
  });
};

const updateGroup = () => {
  request.patch("/group/" + groupId, groupFrom.value).then((res) => {
    ElMessage.success("更新成功");
  });
};

const leaveGroup = () => {
  request.post("/group/" + groupId + "/leave").then((res) => {
    ElMessage.success("退出成功");
    router.push({ name: "Group" });
  });
};

const hideGroup = () => {
  request.post("/group/" + groupId + "/hide").then((res) => {
    ElMessage.success("隐藏成功");
  });
};

const unhideGroup = () => {
  request.post("/group/" + groupId + "/unhide").then((res) => {
    ElMessage.success("公开成功");
  });
};

const removeMember = (memberId) => {
  request
    .post("/group/" + groupId + "/kick", {
      uid: memberId,
    })
    .then((res) => {
      ElMessage.success("移除成功");
      getGroupMembers();
    });
};

const addAdmin = (memberId) => {
  request
    .post("/group/" + groupId + "/addAdmin", {
      uid: memberId,
    })
    .then((res) => {
      ElMessage.success("添加成功");
      getGroupMembers();
    });
};

const memberId = ref("");

const reason = ref("");
const dialogTableVisible = ref(false);
const addMember = () => {
  request
    .post(
      "/group/" + groupId + "/invite",
      {
        uid: memberId.value,
      },
      {
        headers: {
          "X-Reason": reason.value || "无",
        },
      }
    )
    .then((res) => {
      ElMessage.success("邀请成功");
      // getGroupMembers();
    });
};
onMounted(() => {
  getGroup();
  getGroupMembers();
});

const wallets = ref([]);
const subWallets = ref([]);

const getWallets = () => {
  request.get("/group/" + groupId + "/wallet").then((res) => {
    wallets.value = res.data;
  });
};

const getSubWallets = () => {
  request.get("/group/" + groupId + "/subWallet").then((res) => {
    subWallets.value = res.data;
  });
};

const amIAdmin = ref(false);
const amICreator = ref(false);
onMounted(() => {
  myStore.getRole().then((res) => {
    const adminRole = "GroupAdmin/g" + groupId;
    const creatorRole = "GroupCreator/g" + groupId;

    amIAdmin.value = res.includes(adminRole);
    amICreator.value = res.includes(creatorRole);
    console.log("amIAdmin", amIAdmin.value);
    console.log("amICreator", amICreator.value);
    if (amIAdmin.value || amICreator.value) {
      // getGroupMembers();
      getWallets();
      getSubWallets();
    }
  });
});

const createGroupWallet = () => {
  request.post("/group/" + groupId + "/wallet").then((res) => {
    getWallets();
  });
};

const createSubWallet = (uid) => {
  request
    .post("/group/" + groupId + "/subWallet", {
      uid: uid,
    })
    .then((res) => {
      getSubWallets();
    });
};

const allocateSubWallet = (subWalletId, amount) => {
  request
    .post("/group/" + groupId + "/allocate", {
      id: subWalletId,
      amount: parseInt(amount),
    })
    .then((res) => {
      getSubWallets();
    });
};

const transferCreator = (uid) => {
  request
    .post("/group/" + groupId + "/transferCreator", {
      uid: uid,
    })
    .then((res) => {
      ElMessage.success("转让成功");
    });
};

const destroyGroup = () => {
  request.delete("/group/" + groupId).then((res) => {
    ElMessage.success("解散成功");
    router.push({ name: "Group" });
  });
};
</script>
