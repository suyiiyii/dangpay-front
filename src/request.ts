import axios from "axios";
import { useMyNewStore } from "./myStore";
import { ElMessage } from "element-plus/es";
function useRequest() {
  const myNewStore = useMyNewStore();
  console.log(myNewStore.base_url);
  const request = axios.create({
    baseURL: myNewStore.base_url,
    timeout: 20000,
    // headers: { "Content-Type": "application/json" },
  });

  request.interceptors.request.use(
    (config) => {
      const token = "Bearer " + localStorage.getItem("token");
      if (localStorage.getItem("token")) {
        config.headers.Authorization = token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  request.interceptors.response.use(
    (response) => {
      // ElMessage.success("操作成功");
      return response;
    },
    (error) => {
      if (error.response.data) {
        ElMessage.error("请求失败：" + error.response.data);
      } else {
        ElMessage.error("网络错误");
      }
      return Promise.reject(error);
    }
  );

  return request;
}

export default useRequest;

//PROBLEM
/**
 * 麻了，这js怎么这么多事
 * 直接export request ，告诉我useMyNewStore在pinia加载之前被运行了
 * 非得要写个函数，等到要使用的时候，在调用创建实例
 * 怎么这么喜欢玩闭包啊
 */
