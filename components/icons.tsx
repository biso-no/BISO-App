import { Calendar, LogOut, ArrowLeft, LogIn, ChevronDown, ChevronUp, BadgeX, Minus, User, Lock } from "lucide-react-native";
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

export const ChevronDownIcon = (props) => {
    const theme = useTheme();

    return (
        <ChevronDown {...props} color={theme["text-basic-color"]} size={30} />
    )
}

export const ChevronUpIcon = (props) => {
    const theme = useTheme();

    return (
        <ChevronUp {...props} color={theme["text-basic-color"]} size={30} />
    )
}

export const CloseIcon = (props) => {
    const theme = useTheme();

    return (
        <Minus {...props} color={theme["text-basic-color"]} size={30} />
    )
}

export const UserIcon = (props) => {
    const theme = useTheme();

    return (
        <User {...props} color={theme["text-basic-color"]} size={20} />
    )
}

export const LockIcon = (props) => {
    const theme = useTheme();

    return (
        <Lock {...props} color={theme["text-basic-color"]} size={20} />
    )
}