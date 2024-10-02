import { STATUS } from "@/constants/settings/manga";

export const MangaInfo = (props: { manga: any }) => {
    return (
        <>
            <div className="border-b">
                <p>Год</p>
                <p className="capitalize">{props.manga.data.attributes.year}</p>
            </div>
            <div className="border-b">
                <p>Статус</p>
                <p className="capitalize">
                    {STATUS.get(props.manga.data.attributes.status) ??
                        props.manga.data.attributes.status}
                </p>
            </div>
        </>
    );
};
