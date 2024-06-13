import { create } from "zustand";

interface SearchStore {
    fetchSubmit: string;
    isDialogOpen: boolean;

    updateFetchSubmit: (input: string) => void;
    toggleDialog: () => void;
}

const useSearchStore = create<SearchStore>()((set) => ({
    fetchSubmit: "",
    isDialogOpen: false,

    updateFetchSubmit: (input: string) => {
        set({ fetchSubmit: input });
    },
    toggleDialog: () => {
        set((state) => ({ isDialogOpen: !state.isDialogOpen }));
    },
}));

export default useSearchStore;
