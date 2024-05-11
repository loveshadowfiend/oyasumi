import { ComponentProps } from "react";
import Image from "next/image";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export const MangaCard = ({ children, ...props }: ComponentProps<"div">) => {
    return (
        <Card>
            <CardContent className="flex flex-col justify-center items-center">
                {children}
            </CardContent>
        </Card>
    );
};
