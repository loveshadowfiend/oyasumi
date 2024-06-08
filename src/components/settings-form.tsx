"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import useSettingsStore from "@/stores/settingsStore";
import { useTheme } from "./theme-provider";

const FormSchema = z.object({
    theme: z.string(),
});

export function SettingsForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    const { theme, updateTheme } = useSettingsStore();
    const { setTheme } = useTheme();

    return (
        <Form {...form}>
            <form className="w-2/3 space-y-6">
                <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Theme</FormLabel>
                            <Select
                                onValueChange={(selectedTheme) => {
                                    localStorage.setItem(
                                        "ui-theme",
                                        selectedTheme
                                    );

                                    updateTheme(selectedTheme);
                                    setTheme(selectedTheme);
                                }}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={
                                                // capitalize
                                                theme.charAt(0).toUpperCase() +
                                                theme.slice(1)
                                            }
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="system">
                                        System
                                    </SelectItem>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription></FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
