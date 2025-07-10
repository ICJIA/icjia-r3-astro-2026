export const useCounter = () => useState<number>("counter", () => 0);
export const useColor = () => useState<string>("color", () => "pink");
export const useNavToggle = () => useState<boolean>("nav", () => false);
export const useSimpleCounter = (val: number) =>
  useState<number>("test", () => val);
export const useTranslateToggle = () =>
  useState<boolean>("translate", () => false);

// Search state management (replaces Pinia stores)
export const useSearchQueries = () => useState<string[]>("searchQueries", () => []);
export const useFaqSearchQueries = () => useState<string[]>("faqSearchQueries", () => []);

// Search actions
export const useSearchActions = () => {
  const queries = useSearchQueries();

  const addNewQuery = (query: string) => {
    if (query && query.trim()) {
      queries.value.push(query.trim());
      // Remove duplicates
      queries.value = [...new Set(queries.value)];
    }
  };

  const clearQueries = () => {
    queries.value = [];
  };

  return {
    queries: readonly(queries),
    addNewQuery,
    clearQueries
  };
};

// FAQ search actions
export const useFaqSearchActions = () => {
  const faqQueries = useFaqSearchQueries();

  const addNewFaqQuery = (query: string) => {
    if (query && query.trim()) {
      faqQueries.value.push(query.trim());
      // Remove duplicates
      faqQueries.value = [...new Set(faqQueries.value)];
    }
  };

  const clearFaqQueries = () => {
    faqQueries.value = [];
  };

  return {
    faqQueries: readonly(faqQueries),
    addNewFaqQuery,
    clearFaqQueries
  };
};
