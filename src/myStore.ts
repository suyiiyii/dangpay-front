import { defineStore } from "pinia";
import useRequest from "~/request";
export const useMyNewStore = defineStore("myNewStore", {
  state: () => {
    return {
      base_url: import.meta.env.VITE_BASE_URL,
      usersCache: {} as { [key: number]: any },
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
    },
    async getRole() {
      const request = useRequest();
      const userId = this.getUserId();
      if (userId == null) {
        return null;
      }
      const response = await request.get(`/user/myRole`);
      const res: string[] = response.data.roles;
      console.log(res);
      return res;
    },
    async amIAdmin() {
      const roles = await this.getRole();
      if (roles == null) {
        return false;
      }
      // 判断roles 里面 有没有 admin 或 superadmin
      return roles.includes("admin") || roles.includes("superadmin");
    },
    async getUserInfo(uid: number) {
      const request = useRequest();
      if (this.usersCache[uid]) {
        return this.usersCache[uid];
      }
      const response = await request.get(`/user/${uid}`);
      this.usersCache[uid] = response.data;
      return response.data;
    },
  },
});
