import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ChapterStore {
    mangaID: string;
    mangaTitle: string;
    chapterNumber: string;

    nextChapterLink: string;
    previousChapterLink: string;

    latestLink: string;

    updateChapter: (id: string, title: string, number: string) => void;

    updateNextLink: (next: string) => void;
    updatePreviousLink: (prev: string) => void;
}

const useChapterStore = create<ChapterStore>()(
    devtools((set) => ({
        mangaID: "",
        mangaTitle: "",
        chapterNumber: "",

        nextChapterLink: "",
        previousChapterLink: "",

        latestLink: "",

        updateChapter: (id: string, title: string, number: string) => {
            set({ mangaID: id, mangaTitle: title, chapterNumber: number });
        },

        updateNextLink: (next: string) => {
            set({ nextChapterLink: next });
        },
        updatePreviousLink: (prev: string) => {
            set({ previousChapterLink: prev });
        },
    }))
);

export default useChapterStore;
