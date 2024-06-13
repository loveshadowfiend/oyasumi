import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ChapterSettingsStore {
    isProgressActive: boolean;

    toggleIsProgressActive: () => void;
}

const useChapterSettingsStore = create<ChapterSettingsStore>()(
    persist(
        (set) => ({
            isProgressActive: true,

            toggleIsProgressActive: () => {
                set((state) => ({ isProgressActive: !state.isProgressActive }));
            },
        }),
        {
            name: "chapter-settings-store",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useChapterSettingsStore;
