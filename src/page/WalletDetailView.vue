<template>
  <div>
    <h1>钱包详情</h1>
    <!-- <p>{{ wallet }}</p> -->
    <wallet-card :wallet="wallet" />
    <template v-if="wallet.ownerId === uid">
      <h1>收款</h1>

      <el-input
        style="width: 200px"
        v-model="amount"
        type="number"
        placeholder="请输入收款金额"
      ></el-input>
      <el-button type="primary" @click="createMoneyReceiveCode(amount)"
        >生成收款码</el-button
      >
      <!-- <QRCodeVue3 :value="qrcode" :key="qrcode" /> -->
      <br />
      <n-qr-code :value="qrcode" v-if="qrcode" size="200" />
      <p>二维码信息：{{ qrcode }}</p>
      <hr />

      <h1>扫码</h1>
      <main class="reader">
        <p>
          code from <a href="https://github.com/MuGuiLin/QRCode">MuGuiLin</a>
        </p>

        <button class="sweep" @click="stream = true">扫一扫</button>

        <button class="sweep">
          <qr-capture :capture="capture" @decode="onDecode"></qr-capture
          >从相册选择
        </button>

        <qr-stream
          class="stream"
          v-show="stream"
          :torch="torch"
          :camera="camera"
          @onInit="onInit"
          @decode="onDecode"
        >
          <p v-show="error">{{ error }}</p>
          <button @click="torch = !torch">
            {{ torch ? "关闭闪光灯" : "开启闪光灯" }}
          </button>
          <button @click="switchCamera">
            {{ "rear" == camera ? "前置摄像头" : "后置摄像头" }}
          </button>
        </qr-stream>

        <h3>二维码识别结果</h3>
        <textarea
          class="result"
          v-model="result"
          placeholder="二维码识别结果！"
        ></textarea>
        <!-- 手动提交扫码信息给后端按钮 -->
        <el-button @click="uploadQrCode(result)">手动提交扫码信息</el-button>
      </main>
      <p>{{ scanQrCodeServerResponse }}</p>
      <el-dialog v-model="dialogVisible" title="确认支付" width="500">
        <!-- <p>{{ scanQrCodeServerResponse }}</p> -->
        <p>支付码：{{ scanQrCodeServerResponse.code }}</p>
        <p>第三方平台：{{ scanQrCodeServerResponse.platform }}</p>
        <p>支付金额：{{ scanQrCodeServerResponse.specifiedAmount }}</p>
        <p>支付信息：{{ scanQrCodeServerResponse.message }}</p>
        <el-input
          v-model="password"
          type="password"
          placeholder="请输入支付密码"
        ></el-input>
        <el-button type="primary" @click="confirmPay">确认</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
        <!-- { "code": "/GryBWBhGrFJLcLvq6pKcBK9RFTK+ii667VK1+NK+M2qAJQ7EqqpDIMb5kVcZUyR", "message": "向 dangpay 平台的 30005 转账 101 元", "platform": "dangpay", "isAmountSpecified": true, "specifiedAmount": 101, "expiredAt": 1713672506, "requestId": "f2788bee-4075-4cf9-a492-669fdcd833f6", "amountSpecified": true } -->
      </el-dialog>
    </template>
    <h1>交易记录</h1>
    <!-- <template v-for="transcation in transcations">
      <p>{{ transcation }}</p>
    </template> -->
    <transaction-card :transactionList="transcations" :isShowReimburse="true" />
  </div>
</template>

<script setup>
import QRCodeVue3 from "qrcode-vue3";
import { onMounted, ref, reactive } from "vue";
import useRequest from "~/request";
import { useRouter } from "vue-router";
import { QrStream, QrCapture } from "vue3-qr-reader";
import { NQrCode } from "naive-ui";
import { ElMessage } from "element-plus/es";
import { useMyNewStore } from "~/myStore";
const router = useRouter();
const request = useRequest();
const walletId = ref(router.currentRoute.value.params.id);
const myStore = useMyNewStore();

const uid = myStore.getUserId();

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

const qrcode = ref("");
const amount = ref(10);
const createMoneyReceiveCode = (amount) => {
  request
    .post(`/wallet/${walletId.value}/createReceiveIdentity`, {
      isAmountSpecified: true,
      amount: Number(amount),
      description: "test",
    })
    .then((res) => {
      qrcode.value = res.data;
      console.log(res.data);
    });
};

const error = ref(""); // 扫一扫错误信息
const result = ref(""); // 二维码识别结果
const stream = ref(false); // 显示扫一扫相机
const torch = ref(false); // 是否开启闪光灯
const camera = ref("rear"); // rear（后置摄像头[默认]） | front（前置摄像头）
const capture = ref(false); // environment（后置摄像头[默认]） | user（前置摄像头） | false（相册[图片库]）

// const audio = new Audio(tone);

// 扫一扫初始化【注：不要连续多次扫描同一个二维码！！！】
const onInit = async (promise) => {
  try {
    await promise;
  } catch (error) {
    if (error.name === "NotAllowedError") {
      error.value = "错误：您需要授予相机访问权限！";
    } else if (error.name === "NotFoundError") {
      error.value = "错误：此设备上没有摄像头！";
    } else if (error.name === "NotSupportedError") {
      error.value = "错误：需要安全上下文（HTTPS，本地主机）！";
    } else if (error.name === "NotReadableError") {
      error.value = "错误：相机是否已经在使用？";
    } else if (error.name === "OverconstrainedError") {
      error.value = "错误：安装的摄像头不合适！";
    } else if (error.name === "StreamApiNotSupportedError") {
      error.value = "错误：此浏览器不支持 Stream API！";
    } else if (error.name === "InsecureContextError") {
      error.value =
        "错误：仅在安全上下文中允许访问相机。使用 HTTPS 或 localhost 而不是 HTTP！";
    } else {
      error.value = `错误：相机错误（${error.name}）！`;
    }
  }
};

// 识别结果回调
const onDecode = (res) => {
  // audio.play();
  setTimeout(() => {
    result.value = res;
    stream.value = false;
    uploadQrCode(res);
  }, 600);
};

// 切换前后置摄像头
const switchCamera = () => {
  switch (camera.value) {
    case "front":
      camera.value = "rear";
      break;
    case "rear":
      camera.value = "front";
      break;
  }
};

// 改变扫一扫选框
const stroke = ["red", "green", "blue"];
const paintBoundingBox = (detectedCodes, ctx) => {
  const strokeStyle = stroke[parseInt(Math.random() * 3)];
  for (const detectedCode of detectedCodes) {
    const {
      boundingBox: { x, y, width, height },
    } = detectedCode;
    ctx.lineWidth = 2; // 选框宽度
    ctx.strokeStyle = strokeStyle; // 选框颜色
    ctx.strokeRect(x, y, width, height);
  }
};

// 错误回调
const onError = (res) => {
  result.value = res;
  stream.value = false;
};
const scanQrCodeServerResponse = ref({});
const uploadQrCode = (data) => {
  request
    .post("/wallet/" + walletId.value + "/scanQRCode", {
      callbackUrl: data,
    })
    .then((res) => {
      scanQrCodeServerResponse.value = res.data;
      console.log(res);
      dialogVisible.value = true;
    });
};

const dialogVisible = ref(false);
const password = ref("");

const confirmPay = () => {
  const password1 = password.value;
  password.value = "";
  request
    .post("/wallet/" + walletId.value + "/pay", {
      code: scanQrCodeServerResponse.value.code,
      password: password1,
      requestId: scanQrCodeServerResponse.value.requestId,
    })
    .then((res) => {
      console.log(res);
      // dialogVisible.value = false;
      ElMessage.success("支付成功");
    })
    .catch((err) => {
      // dialogVisible.value = false;
      // ElMessage.error(err.response.data);
    });
};
</script>
