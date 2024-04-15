import { defineStore } from "pinia";

export const useMyNewStore = defineStore("myNewStore", {
  state: () => {
    return {
        // base_url : "https://dangpay.api.99.suyiiyii.top",
        base_url : "http://127.0.0.1:8080",
    };
  },
  getters: {},
  actions: {},
});
