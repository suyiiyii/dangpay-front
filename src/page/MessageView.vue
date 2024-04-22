<template>
  <section>
    <h1>消息</h1>
    <div style="display: flex; flex-direction: row">
      <div style="height: 400px">
        <el-scrollbar style="height: 100%; width: 100%; overflow-y: auto">
          <el-card
            v-for="friend in friends"
            :key="friend.id"
            class="scrollbar-demo-item"
            @click="changeFriend(friend)"
          >
            <h2>{{ friend.username }}</h2>
          </el-card>

          <el-card>
            <el-input
              v-model="newFriendId"
              placeholder="请输入好友id"
              clearable
            ></el-input>
            <el-button @click="addFriend(newFriendId)">添加好友</el-button>
          </el-card>
        </el-scrollbar>
      </div>
      <!-- 聊天消息对话框 (仿微信)-->
      <div style="flex: 1; height: 400px">
        <el-scrollbar
          ref="scrollContainer"
          style="height: 100%; width: 480px; overflow-y: auto"
        >
          <template v-for="message in messages">
            <div
              :class="
                message.senderId === curentFriend.uid
                  ? 'message-left'
                  : 'message-right'
              "
            >
              <div class="message-bubble">
                {{ message.content }}
                <div class="message-time">{{ message.time }}</div>
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
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import useRequest from "~/request";
const request = useRequest();

const friends = ref([]);

const getFriends = async () => {
  const res = await request.get("/friend");
  friends.value = res.data;
};
onMounted(() => {
  getFriends();
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
  console.log(messages.value);
};

const addFriend = async (newFriendId) => {
  await request.post("/friend", {
    uid: newFriendId,
  });
  await getFriends();
};

const getFriendMessages = async (uid) => {
  return (await request.get(`/friend/${uid}/message`)).data;
};
const getGroupMessages = async (gid) => {
  return (await request.get(`/group/${gid}/message`)).data;
};

const getMessage = async () => {
  if (chatType.value === "friend") {
    messages.value = await getFriendMessages(curentFriend.value.uid);
  } else {
    messages.value = await getGroupMessages(curentFriend.value.uid);
  }
  scroll();
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
    await request.post(`/group/${curentFriend.value.uid}/message`, {
      message: message.value,
    });
  }
  message.value = "";
  await getMessage();
};

const scroll = () => {
  nextTick(() => {
    scrollAnchor.value.scrollIntoView();
  });
};
</script>

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
  padding: 10px;
  border-radius: 10px;
  margin: 10px;
  background-color: #f0f0f0;
}

.message-right {
  text-align: right;
}

.message-left {
  text-align: left;
}
</style>
