export const fetchAtHome = async (chapterID: string) => {
    const response = await fetch(`/api/at-home/server/${chapterID}`);
    const data = await response.json();

    return data;
};

export const fetchChapter = async (chapterID: string) => {
    const response = await fetch(`/api/chapter/${chapterID}?includes[]=manga`);
    const data = await response.json();

    return data;
};

export const fetchAggregate = async (
    mangaID: string,
    translatedLanguage: string[]
) => {
    const response = await fetch(
        `/api/manga/${mangaID}/aggregate?translatedLanguage[]=${translatedLanguage}`
    );
    const data = await response.json();

    return data;
};
