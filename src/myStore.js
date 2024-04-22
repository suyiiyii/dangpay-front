import { defineStore } from "pinia";

export const useMyNewStore = defineStore("myNewStore", {
  state: () => {
    return {
        base_url : import.meta.env.VITE_BASE_URL,
    };
  },
  getters: {},
  actions: {},
});
