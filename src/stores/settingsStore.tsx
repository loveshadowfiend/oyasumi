import { Theme } from "@/components/providers/theme-provider";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SettingsStore {
    theme: Theme;
    translatedLanguage: string[];

    updateTheme: (theme: Theme) => void;
    updateTranslatedLanguage: (language: string[]) => void;
}

const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            theme: "system",
            translatedLanguage: ["en"],

            updateTheme: (theme: Theme) => {
                set({ theme: theme });
            },
            updateTranslatedLanguage: (language: string[]) => {
                set({ translatedLanguage: language });
            },
        }),
        {
            name: "settings-store",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useSettingsStore;
