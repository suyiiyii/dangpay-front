<style scoped>
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
.message-bubble {
  display: inline-block;
  max-width: 80%;
  word-wrap: break-word;
  word-break: break-all;
  padding: 10px;
  border-radius: 10px;
  margin: 5px;
  background-color: #f0f0f0;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.15);
  flex-shrink: 1;
}

.message-right {
  text-align: right;
  display: flex;
  flex-direction: row-reverse;
  align-items: flex-start;
}

.message-left {
  text-align: left;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.my-message {
  background-color: #89d961;
}

.other-message {
  background-color: #f0f0f0;
}
.message-time {
  font-size: 12px;
  color: #999;
  margin-left: 10px;
  margin-right: 10px;
}
</style>

<template>
  <section>
    <h1>消息</h1>
    <div style="display: flex; flex-direction: row; height: 50vh">
      <div
        style="
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
          min-width: 100px;
          max-width: 300px;
        "
      >
        <el-scrollbar style="height: 100%; min-width: 100%; overflow-y: auto">
          <el-switch
            v-model="isGroup"
            size="large"
            active-text="群组"
            inactive-text="个人"
          />
          <template v-if="!isGroup">
            <!-- <el-card
              v-for="friend in friends"
              :key="friend.id"
              class="scrollbar-demo-item"
              @click="changeFriend(friend)"
            >
              <h2>{{ friend.username }}</h2>
            </el-card> -->
            <template v-for="friend in friends">
              <div @click="changeFriend(friend)">
                <UserCard :data="friend" type="small" />
              </div>
            </template>

            <el-input
              v-model="newFriendId"
              placeholder="请输入好友id"
              clearable
            ></el-input>
            <el-button @click="appllicantAddFriend(newFriendId)"
              >添加好友</el-button
            >
          </template>
          <template v-else>
            <el-card
              v-for="group in groups"
              :key="group.id"
              class="scrollbar-demo-item"
              @click="changeGroup(group)"
            >
              <h2>{{ group.name }}</h2>
            </el-card>
          </template>
        </el-scrollbar>
      </div>
      <!-- 聊天消息对话框 (仿微信)-->
      <div>
        <el-scrollbar
          ref="scrollContainer"
          style="
            height: 100%;
            overflow-y: auto;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
            min-width: 200px;
            max-width: 680px;
            width: 50vw;
          "
        >
          <template v-for="message in messages">
            <div
              :class="
                message.senderId === userId ? 'message-right' : 'message-left'
              "
            >
              <div>
                <UserCard
                  :uid="message.senderId"
                  type="onlyLogo"
                  v-if="message.senderId !== userId"
                />
              </div>
              <div>
                <UserCard
                  :uid="message.senderId"
                  type="onlyLogo"
                  v-if="message.senderId === userId"
                />
              </div>
              <div>
                <div
                  class="username"
                  style="
                    margin-left: 10px;
                    margin-right: 10px;
                    margin-top: 10px;
                  "
                >
                  <UserCard :uid="message.senderId" type="onlyname" />
                </div>
                <div
                  class="message-bubble"
                  :class="
                    message.senderId === userId ? 'my-message' : 'other-message'
                  "
                  @click="clickMsg(message)"
                >
                  {{ message.content }}
                </div>
                <div class="message-time">
                  {{ timeStr(message.createTime) }}
                </div>
              </div>
            </div>
          </template>
          <div ref="scrollAnchor"></div>
        </el-scrollbar>
        <el-input
          v-model="message"
          placeholder="请输入消息"
          style="width: 100%"
          type="textarea"
        ></el-input>
        <el-button @click="sendMessage">发送</el-button>
      </div>
    </div>
  </section>
  <el-dialog v-model="dialogTableVisible" title="审批请求" width="400">
    <el-form>
      <p>{{ currentMsg.content }}</p>
      <el-form-item label="是否同意">
        <el-switch
          v-model="approveRequest.isApprove"
          active-text="同意"
          inactive-text="拒绝"
        ></el-switch>
      </el-form-item>
      <el-form-item label="原因">
        <el-input v-model="approveRequest.reason"></el-input>
      </el-form-item>
      <el-button type="primary" @click="sentApproval()"> 发送 </el-button>
    </el-form>
  </el-dialog>
  <el-dialog v-model="applicantDialogVisible" title="申请好友" width="400">
    <el-form>
      <el-form-item label="原因">
        <el-input v-model="reason"></el-input>
      </el-form-item>
      <el-button type="primary" @click="addFriend(newFriendId)">
        加入
      </el-button>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import useRequest from "~/request";
import { useMyNewStore } from "~/myStore";
import { timeStamp2timeStampString } from "~/tools";

const request = useRequest();
const myStore = useMyNewStore();
const userId = myStore.getUserId();
const friends = ref([]);
const isGroup = ref(false);

console.log(myStore.getRole());

const getFriends = async () => {
  const res = await request.get("/friend");
  friends.value = res.data;
};

const groups = ref([]);

const getGroups = async () => {
  const res = await request.get("/group/my");
  groups.value = res.data;
};

onMounted(() => {
  getFriends();
  getGroups();
});
const curentFriend = ref(null);
const chatType = ref("friend");
const messages = ref([]);
/*
{
  "id": 1,
  "senderId": 12,
  "receiverId": 13,
  "groupId": 0,
  "type": "text",
  "content": "fjsodif",
  "callback": null,
  "status": "normal",
  "createTime": 1713778958
}
*/
const message = ref("");
const scrollAnchor = ref(null);

const newFriendId = ref("");

const changeFriend = (friend) => {
  curentFriend.value = friend;
  chatType.value = "friend";
  getMessage();
  clearInterval(intervalId.value);
  intervalId.value = setInterval(getMessage, 3000);
};

const timeStr = (stamp) => {
  return timeStamp2timeStampString(Number(stamp) * 1000);
};
// 一个失败的方案，模板中无法使用async函数，因为模板是声明式的，无法使用await
// const id2name = async (id) => {
//   const res = await myStore.getUserInfo(id);
//   console.log(res);
//   return res.username;
// };

const currentGroupId = ref(null);
const changeGroup = (group) => {
  const groupId = group.id;
  currentGroupId.value = groupId;
  chatType.value = "group";
  getMessage();
  clearInterval(intervalId.value);
  intervalId.value = setInterval(getMessage, 3000);
};
const applicantDialogVisible = ref(false);

const reason = ref("");
const appllicantAddFriend = (newFriendId1) => {
  applicantDialogVisible.value = true;
  newFriendId.value = newFriendId1;
};

const addFriend = async (newFriendId) => {
  await request.post(
    "/friend",
    {
      uid: Number(newFriendId),
    },
    {
      headers: {
        "X-Reason": reason.value || "无",
      },
    }
  );
  await getFriends();
};

const getFriendMessages = async (uid) => {
  return (await request.get(`/friend/${uid}/message`)).data;
};
const getGroupMessages = async (gid) => {
  return (await request.get(`/group/${gid}/message`)).data;
};

const getMessage = async () => {
  const oldMessages = messages.value;
  if (chatType.value === "friend") {
    messages.value = await getFriendMessages(curentFriend.value.uid);
  } else {
    messages.value = await getGroupMessages(currentGroupId.value);
  }
  if (oldMessages.length !== messages.value.length) {
    scroll();
  }
  console.log(messages.value);
};
const sendMessage = async () => {
  if (message.value === "") {
    ElMessage.warning("消息不能为空");
    return;
  }
  if (chatType.value === "friend") {
    await request.post(`/friend/${curentFriend.value.uid}/message`, {
      message: message.value,
    });
  } else {
    await request.post(`/group/${currentGroupId.value}/message`, {
      message: message.value,
    });
  }
  message.value = "";
  await getMessage();
  scroll();
};

const scroll = () => {
  nextTick(() => {
    scrollAnchor.value.scrollIntoView();
  });
};

const intervalId = ref(null);
onMounted(() => {});
onUnmounted(() => {
  clearInterval(intervalId.value);
});

const dialogTableVisible = ref(false);
const currentMsg = ref(null);
const clickMsg = (msg) => {
  console.log(msg);
  if (msg.callback === null || msg.callback === "") {
    return;
  }
  if (msg.status !== "normal") {
    ElMessage.warning("消息已处理，状态：" + msg.status);
    return;
  }
  currentMsg.value = msg;
  dialogTableVisible.value = true;
};
const approveRequest = ref({
  isApprove: false,
  reason: "",
});
const sentApproval = async () => {
  await request.post(currentMsg.value.callback, approveRequest.value);
  await getMessage();
};
</script>
