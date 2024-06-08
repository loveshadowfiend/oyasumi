import { create } from "zustand";

const useSettingsStore = create((set) => ({
    theme: localStorage.getItem("ui-theme") ?? "system",

    updateTheme: (selectedTheme: string) => {
        set({ theme: selectedTheme });
    },
}));

export default useSettingsStore;
