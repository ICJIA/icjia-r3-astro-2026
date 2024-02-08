export const useFaqSearchStore = defineStore("FaqSearchStore", {
  state: () => ({
    faqQuery: [],
  }),
  actions: {
    addNewFaqQuery(q) {
      this.faqQuery.push(q);
      // remove duplicates
      this.faqQuery = [...new Set(this.faqQuery)];
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFaqSearchStore, import.meta.hot));
}
