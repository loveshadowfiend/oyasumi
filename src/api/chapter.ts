export const fetchAtHome = async (chapterID: string) => {
    const response = await fetch(
        `https://api.mangadex.org/at-home/server/${chapterID}`
    );
    const data = await response.json();

    return data;
};

export const fetchChapter = async (chapterID: string) => {
    const response = await fetch(
        `https://api.mangadex.org/chapter/${chapterID}?includes[]=manga`
    );
    const data = await response.json();

    return data;
};

export const fetchAggregate = async (
    mangaID: string,
    translatedLanguage: string[]
) => {
    const response = await fetch(
        `https://api.mangadex.org/manga/${mangaID}/aggregate?translatedLanguage[]=${translatedLanguage}`
    );
    const data = await response.json();

    return data;
};
