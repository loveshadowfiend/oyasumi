"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import useSettingsStore from "@/stores/settingsStore";
import { LANGUAGES } from "@/constants/settings/languages";
import { useTheme } from "next-themes";
import { THEMES } from "@/constants/settings/themes";

const FormSchema = z.object({
    theme: z.string(),
    translatedLanguage: z.string(),
});

export function SettingsForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    const theme = localStorage.getItem("theme") ?? "system";
    const { updateTranslatedLanguage } = useSettingsStore();
    const { setTheme } = useTheme();

    return (
        <Form {...form}>
            <form className="w-full space-y-6">
                <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Тема</FormLabel>
                            <Select
                                onValueChange={(selectedTheme: string) => {
                                    setTheme(selectedTheme);
                                }}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={THEMES.get(theme)}
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="system">
                                        Системная
                                    </SelectItem>
                                    <SelectItem value="light">
                                        Светлая
                                    </SelectItem>
                                    <SelectItem value="dark">Темная</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription></FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="translatedLanguage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Язык перевода манги</FormLabel>
                            <Select
                                onValueChange={(selectedLanguage) => {
                                    localStorage.setItem(
                                        "translated-language",
                                        selectedLanguage
                                    );

                                    updateTranslatedLanguage([
                                        selectedLanguage,
                                    ]);
                                }}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={LANGUAGES.get(
                                                localStorage.getItem(
                                                    "translated-language"
                                                ) ?? "en"
                                            )}
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="en">
                                        Английский
                                    </SelectItem>
                                    <SelectItem value="ru">Русский</SelectItem>
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
