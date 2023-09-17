import { Calendar, LogOut, ArrowLeft } from "lucide-react-native";
import React from "react";
import { useTheme } from "@ui-kitten/components";

export const CalendarIcon = (props) => {
    const theme = useTheme();

    return (
        <Calendar {...props} color={theme["color-primary-300"]} />
    )
}

export const LogOutIcon = (props) => {
    const theme = useTheme();

    return (
        <LogOut {...props} color={theme["color-primary-300"]} />
    )
}

export const ArrowLeftIcon = (props) => {
    const theme = useTheme();

    return (
        <ArrowLeft {...props} color={theme["color-primary-300"]} />
    )
}