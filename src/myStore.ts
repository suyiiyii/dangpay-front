import { defineStore } from "pinia";
import useRequest from "~/request";
export const useMyNewStore = defineStore("myNewStore", {
  state: () => {
    return {
      base_url: import.meta.env.VITE_BASE_URL,
      usersCache: {} as { [key: number]: any },
      roles: [] as string[],
      getUserInfoLocks: {} as { [key: number]: Promise<any> },
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
      if (this.roles.length > 0) {
        return this.roles;
      }
      const request = useRequest();
      const userId = this.getUserId();
      if (userId == null) {
        return null;
      }
      const response = await request.get(`/user/myRole`);
      const res: string[] = response.data.roles;
      console.log(res);
      this.roles = res;
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
      if (this.getUserInfoLocks[uid]) {
        await this.getUserInfoLocks[uid];
      }
      if (this.usersCache[uid]) {
        return this.usersCache[uid];
      }
      this.getUserInfoLocks[uid] = request.get(`/user/${uid}`);
      const response = await this.getUserInfoLocks[uid];
      this.usersCache[uid] = response.data;
      delete this.getUserInfoLocks[uid];
      return response.data;
    },
    async checkRole(role: string) {
      const roles = await this.getRole();
      if (roles == null) {
        return false;
      }
      return roles.includes(role);
    },
  },
});
