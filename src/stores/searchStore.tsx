import { create } from "zustand";

interface SearchStore {
    fetchSubmit: string;

    updateFetchSubmit: (input: string) => void;
}

const useSearchStore = create<SearchStore>()((set) => ({
    fetchSubmit: "",

    updateFetchSubmit: (input: string) => {
        set({ fetchSubmit: input });
    },
}));

export default useSearchStore;
