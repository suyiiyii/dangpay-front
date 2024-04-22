import { defineStore } from "pinia";
import useRequest from "~/request";
export const useMyNewStore = defineStore("myNewStore", {
  state: () => {
    return {
      base_url: import.meta.env.VITE_BASE_URL,
    };
  },
  getters: {},
  actions: {
    getUserId() {
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
    }
  },
});
