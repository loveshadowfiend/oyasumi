export const fetchFeed = async (
    mangaID: string,
    orderChapter: string,
    offset: number,
    translatedLanguage: string[],
    limit: number
) => {
    const response = await fetch(
        `/api/manga/${mangaID}/feed?order[chapter]=${orderChapter}&offset=${offset}&translatedLanguage[]=${translatedLanguage}&limit=${limit}&includeEmptyPages=0`
    );
    const data = await response.json();

    return data;
};
