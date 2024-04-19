<template>
  <div>
    <h1>钱包详情</h1>
    <p>{{ wallet }}</p>
    <h1>交易记录</h1>
    <template v-for="transcation in transcations">
      <p>{{ transcation }}</p>
    </template>
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
    <n-qr-code :value="qrcode" v-if="qrcode" size="400" />
    <hr />

    <h1>扫码</h1>
    <main class="reader">
      <p>code from <a href="https://github.com/MuGuiLin/QRCode">MuGuiLin</a></p>

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
    </main>
    <p>{{ scanQrCodeServerResponse }}</p>
  </div>
</template>

<script setup>
import QRCodeVue3 from "qrcode-vue3";
import { onMounted, ref, reactive } from "vue";
import useRequest from "~/request";
import { useRouter } from "vue-router";
import { QrStream, QrCapture } from "vue3-qr-reader";
import { NQrCode } from "naive-ui";
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

const qrcode = ref("");
const amount = ref(10);
const createMoneyReceiveCode = (amount) => {
  request
    .post(`/wallet/${walletId.value}/createReceiveIdentity`, {
      isSpecifiedAmount: true,
      amount: amount,
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
    });
};
</script>
