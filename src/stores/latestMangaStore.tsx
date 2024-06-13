import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LatestMangaStore {
    latestMangas: manga[];

    updateLatestMangas: (
        mangaID: string,
        pathname: string,
        mangaTitle: string,
        coverURL: string
    ) => void;
    updateLatestPage: (mangaID: string, pathname: string) => void;
}

type manga = {
    mangaID: string;
    pathname: string;
    mangaTitle: string;
    coverURL: string;
};

const useLatestMangaStore = create<LatestMangaStore>()(
    persist(
        (set, get) => ({
            latestMangas: [
                {
                    mangaID: "",
                    pathname: "",
                    mangaTitle: "",
                    coverURL: "",
                },
            ],

            updateLatestMangas: (
                mangaID: string,
                pathname: string,
                mangaTitle: string,
                coverURL: string
            ) => {
                let _latestMangas = get().latestMangas;

                let isExists = false;
                _latestMangas.map((manga) => {
                    if (manga.mangaID === mangaID) {
                        isExists = true;

                        manga.mangaID = mangaID;
                        manga.pathname = pathname;
                        manga.mangaTitle = mangaTitle;
                        manga.coverURL = coverURL;
                    }

                    return manga;
                });

                if (!isExists) {
                    const newManga = {
                        mangaID: mangaID,
                        pathname: pathname,
                        mangaTitle: mangaTitle,
                        coverURL: coverURL,
                    };

                    _latestMangas.push(newManga);
                }

                set({ latestMangas: _latestMangas });
            },

            updateLatestPage: (mangaID: string, pathname: string) => {
                let _latestMangas = get().latestMangas;

                _latestMangas.map((manga) => {
                    if (manga.mangaID === mangaID) {
                        manga.pathname = pathname;
                    }

                    return manga;
                });

                set({ latestMangas: _latestMangas });
            },
        }),
        {
            name: "latest-manga-store",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useLatestMangaStore;
