import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LatestMangaStore {
    mangaID: string;
    link: string;

    mangaTitle: string;
    coverURL: string;

    updateLatestPage: (link: string) => void;

    updateCoverURL: (url: string) => void;
    updateMangaTitle: (title: string) => void;
}

const useLatestMangaStore = create<LatestMangaStore>()(
    persist(
        (set) => ({
            mangaID: "",
            link: "",

            mangaTitle: "",
            coverURL: "",

            updateLatestPage: (pathname: string) => {
                set({ link: pathname });
            },

            updateCoverURL: (url: string) => {
                set({ coverURL: url });
            },
            updateMangaTitle: (title: string) => {
                set({ mangaTitle: title });
            },
        }),
        {
            name: "latest-manga-store",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useLatestMangaStore;
