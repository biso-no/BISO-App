import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@ui-kitten/components";

interface SkeletonBadgeProps {
  loading: boolean;
}

const SkeletonBadge = ({ loading }: SkeletonBadgeProps) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading</Text>
      </View>
    );
  }

  return null; // Render nothing when not loading
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 30,
        justifyContent: 'center', // Center text vertically
        alignItems: 'center', // Center text horizontally
        overflow: 'hidden', // Add this line
        padding: 10, // Add some padding
        marginHorizontal: 4,
        backgroundColor: '#1976d2',
    },
    text: {
        color: 'white',
        fontSize: 10,
    },
});

export default SkeletonBadge;
