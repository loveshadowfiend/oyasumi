import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ChapterSettingsStore {
    isProgressActive: boolean;
    fit: string;
    containerWidth: string;
    server: string;

    toggleIsProgressActive: () => void;
    updateFit: (fit: string) => void;
    updateContainerWidth: (containerWidth: string) => void;
    updateServer: (server: string) => void;
}

const useChapterSettingsStore = create<ChapterSettingsStore>()(
    persist(
        (set) => ({
            isProgressActive: true,
            fit: "height",
            containerWidth: "75%",
            server: "dataSaver",

            toggleIsProgressActive: () => {
                set((state) => ({ isProgressActive: !state.isProgressActive }));
            },
            updateFit: (fit: string) => {
                set({ fit: fit });
            },
            updateContainerWidth: (containerWidth: string) => {
                set({ containerWidth: containerWidth });
            },
            updateServer: (server: string) => {
                set({ server: server });
            },
        }),
        {
            name: "chapter-settings-store",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useChapterSettingsStore;
