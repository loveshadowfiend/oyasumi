"use client";

import useSearchStore, { searchStore } from "@/stores/searchStore";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const Search = () => {
    const router = useRouter();
    const [input, setInput] = useState("");
    const { fetchSubmit, updateFetchSubmit } = useSearchStore();

    useEffect(() => {
        if (!fetchSubmit) return;

        router.push(`/search/${fetchSubmit}`);
    }, [fetchSubmit, router]);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (!input.length) return;

                updateFetchSubmit(input);
            }}
        >
            <Input
                className="w-[300px]"
                placeholder="search"
                onChange={(e) => {
                    setInput(e.target.value);
                }}
            />
        </form>
    );
};
