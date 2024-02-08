export const useSearchStore = defineStore("SearchStore", {
  state: () => ({
    query: [],
  }),
  actions: {
    addNewQuery(q) {
      this.query.push(q);
      // remove duplicates
      this.query = [...new Set(this.query)];
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSearchStore, import.meta.hot));
}
