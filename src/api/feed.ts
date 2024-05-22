export const fetchFeed = async (
    mangaID: string,
    orderChapter: string,
    offset: number,
    translatedLanguage: string[],
    limit: number
) => {
    const response = await fetch(
        `https://api.mangadex.org/manga/${mangaID}/feed?order[chapter]=${orderChapter}&offset=${offset}&translatedLanguage[]=${translatedLanguage}&limit=${limit}`
    );
    const data = await response.json();

    return data;
};
