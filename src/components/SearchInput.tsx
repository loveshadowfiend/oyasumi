"use client";

import useSearchStore, { searchStore } from "@/stores/searchStore";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export const SearchInput = () => {
    const router = useRouter();
    const { fetchSubmit, updateFetchSubmit } = useSearchStore();
    const inputRef = useRef(null);

    useEffect(() => {
        if (!fetchSubmit) return;

        router.push(`/search/${fetchSubmit}`);
    }, [fetchSubmit, router]);

    return (
        <form
            className="hidden md:block"
            onSubmit={(e) => {
                e.preventDefault();

                updateFetchSubmit(inputRef.current.value);
                inputRef.current.value = "";
            }}
        >
            <Input className="w-[300px]" placeholder="search" ref={inputRef} />
        </form>
    );
};
