import { create } from "zustand";

const useSearchStore = create((set) => ({
    fetchSubmit: "",

    updateFetchSubmit: (input: string) => {
        set({ fetchSubmit: input });
    },
}));

export default useSearchStore;
