import { View, StyleSheet } from "react-native";
import { Text } from "@ui-kitten/components";


interface BadgeProps {
    text: string;
    color: string;
}

const Badge = ({ text, color }: BadgeProps) => {
    return (
        <View style={[styles.container, { backgroundColor: color}]}>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        minWidth: 50, 
        height: 20,
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderRadius: 16,
    },
    text: {
        color: 'white',
        fontSize: 10,
    },
});

export default Badge;