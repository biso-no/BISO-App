import { Calendar, LogOut, ArrowLeft, LogIn } from "lucide-react-native";
import React from "react";
import { useTheme } from "@ui-kitten/components";

export const CalendarIcon = (props) => {
    const theme = useTheme();

    return (
        <Calendar {...props} color={theme["text-basic-color"]} size={30} />
    )
}

export const LogInIcon = (props) => {
    const theme = useTheme();

    return (
        <LogIn {...props} color={theme["text-basic-color"]} size={30} />
    )
}

export const LogOutIcon = (props) => {
    const theme = useTheme();

    return (
        <LogOut {...props} color={theme["text-basic-color"]} size={30} />
    )
}

export const ArrowLeftIcon = (props) => {
    const theme = useTheme();

    return (
        <ArrowLeft {...props} color={theme["text-basic-color"]} size={30} />
    )
}