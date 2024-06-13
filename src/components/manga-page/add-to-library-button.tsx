"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const AddToLibraryButton = () => {
    const { toast } = useToast();

    return (
        <Button
            className="w-full"
            onClick={(e) => {
                e.preventDefault();

                toast({
                    description: "Added to Library!",
                });
            }}
        >
            Add to Library
        </Button>
    );
};
