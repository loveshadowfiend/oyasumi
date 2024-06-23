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
import useChapterSettingsStore from "@/stores/chapterSettingsStore";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { THEMES } from "@/constants/settings/themes";
import { FIT } from "@/constants/settings/fit";
import { SERVERS } from "@/constants/settings/server";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
    isProgressActive: z.boolean(),
    server: z.string(),
    theme: z.string(),
    fit: z.string(),
    containerWidth: z.number(),
});

export function ChapterSettingsForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    const theme = localStorage.getItem("theme") ?? "system";
    const {
        isProgressActive,
        fit,
        containerWidth,
        server,
        toggleIsProgressActive,
        updateFit,
        updateContainerWidth,
        updateServer,
    } = useChapterSettingsStore();
    const { setTheme } = useTheme();

    return (
        <Form {...form}>
            <form className="w-full space-y-6">
                <FormField
                    control={form.control}
                    name="isProgressActive"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-start h-full">
                            <FormLabel>Показывать прогресс чтения</FormLabel>
                            <FormControl>
                                <Switch
                                    className="ml-3 !mt-0"
                                    defaultChecked={isProgressActive}
                                    onClick={() => {
                                        toggleIsProgressActive();
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                            <FormDescription></FormDescription>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="server"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Сервер</FormLabel>
                            <Select
                                onValueChange={(server: string) => {
                                    updateServer(server);
                                }}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={SERVERS.get(server)}
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="data">
                                        Обычный
                                    </SelectItem>
                                    <SelectItem value="dataSaver">
                                        Сжатие
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription></FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                    name="fit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Выравнивание страницы</FormLabel>
                            <Select
                                onValueChange={(fit: string) => {
                                    updateFit(fit);
                                }}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={FIT.get(fit)}
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="width">
                                        По ширине контейнера
                                    </SelectItem>
                                    <SelectItem value="height">
                                        По высоте экрана
                                    </SelectItem>
                                    <SelectItem value="none">
                                        Без выравнивания
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription></FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="containerWidth"
                    render={({ field }) => (
                        <FormItem className={cn({ hidden: fit !== "width" })}>
                            <FormLabel>Ширина контейнера</FormLabel>
                            <Select
                                onValueChange={(containerWidth: string) => {
                                    updateContainerWidth(containerWidth);
                                }}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={containerWidth}
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="50%">50%</SelectItem>
                                    <SelectItem value="75%">75%</SelectItem>
                                    <SelectItem value="100%">100%</SelectItem>
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
