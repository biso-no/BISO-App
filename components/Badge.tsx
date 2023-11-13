import { View, StyleSheet } from "react-native";
import { Text } from "@ui-kitten/components";


interface BadgeProps {
    text: string;
    color: string;
}

const Badge = ({ text, color }: BadgeProps) => {
    return (
        <View style={[styles.container, { backgroundColor: color }]}>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 30,
        justifyContent: 'center', // Center text vertically
        alignItems: 'center', // Center text horizontally
        overflow: 'hidden', // Add this line
        padding: 10, // Add some padding
        marginHorizontal: 4,
    },
    text: {
        color: 'white',
        fontSize: 10,
    },
});

export default Badge;