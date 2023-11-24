import { StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@ui-kitten/components";
import React, { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import { View } from "react-native";
import { Text, Button } from "@ui-kitten/components";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import i18n from "../constants/localization";
import { useMembership } from "../contexts/MembershipContext";

interface AnimatedLogoProps {
    animationStarted: boolean;
}


const AnimatedLogo = ({ animationStarted }: AnimatedLogoProps) => {
    const moveAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    const animationRef = useRef<Animated.CompositeAnimation | null>(null);


    // Rotation animation
    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '30deg'], // Adjust the degrees for the desired spin
    });

    // Movement animation
    useEffect(() => {
        if (animationStarted) {
            animationRef.current = Animated.loop(
                Animated.sequence([
                    Animated.timing(moveAnim, {
                        toValue: { x: 100, y: 0 },
                        duration: 1000,
                        easing: Easing.linear,
                        useNativeDriver: false
                    }),
                    Animated.timing(moveAnim, {
                        toValue: { x: 0, y: 0 },
                        duration: 1000,
                        easing: Easing.linear,
                        useNativeDriver: false
                    }),
                    Animated.timing(rotateAnim, {
                        toValue: 1,
                        duration: 1000,
                        easing: Easing.linear,
                        useNativeDriver: false
                    }),
                    Animated.timing(rotateAnim, {
                        toValue: 0,
                        duration: 1000,
                        easing: Easing.linear,
                        useNativeDriver: false
                    })
                ])
            );
            animationRef.current.start();
        } else {
            animationRef.current?.stop();
        }
    }, [animationStarted]);

    return (
        <Animated.View
            style={[
                styles.logo, 
                { 
                    transform: [
                        { translateX: moveAnim.x },
                        { translateY: moveAnim.y },
                        { rotate: spin }
                    ]
                }
            ]}
        >
            <Image
                source={require('../assets/images/icon.png')}
                style={{ width: 50, height: 50 }}
            />
        </Animated.View>
    );
};


export function MembershipStatusCard() {
    const theme = useTheme();

    const [containerWidth, setContainerWidth] = React.useState(0);
    const [containerHeight, setContainerHeight] = React.useState(0);
    const [animationStarted, setAnimationStarted] = React.useState(false);
    const router = useRouter();

    const { membershipStatus, verifyMembership } = useMembership();

    const imageWidth = 50;
    const imageHeight = 50;

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                // Move to right edge, subtract the full width of the image
                Animated.timing(positionX, {
                    toValue: containerWidth - imageWidth,
                    duration: 2000,
                    useNativeDriver: true
                }),
                // Move to bottom edge, subtract the full height of the image
                Animated.timing(positionY, {
                    toValue: containerHeight - imageHeight,
                    duration: 2000,
                    useNativeDriver: true
                }),
                // Move back to the left edge
                Animated.timing(positionX, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true
                }),
                // Move back to the top edge
                Animated.timing(positionY, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true
                }),
            ]),
        ).start();
    }, [containerWidth, containerHeight]);
    



    const spinValue = React.useRef(new Animated.Value(0)).current;
    const positionX = React.useRef(new Animated.Value(0)).current;
    const positionY = React.useRef(new Animated.Value(0)).current;

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <View 
            style={[
                styles.card, 
                { 
                    backgroundColor: theme["background-basic-color-1"], 
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5
                }
            ]}
        >
            <TouchableOpacity 
                style={[
                    styles.activeMembershipIndicator, 
                    { 
                        backgroundColor: theme["color-primary-disabled"],
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 10
                    }
                ]}
                onPress={() => setAnimationStarted(prevState => !prevState)}
            >
                <AnimatedLogo animationStarted={animationStarted} />
                {!animationStarted && (
                    <Text style={[styles.cardText, { fontSize: 18, fontWeight: 'bold' }]}>{i18n.t('press_to_verify')}</Text>
                )}
            </TouchableOpacity>
            <View style={[styles.cardContent, { padding: 20 }]}>
                <Text style={[styles.cardTitle, { fontSize: 24, fontWeight: 'bold' }]}>{i18n.t('membership_status')}</Text>
                <View style={styles.rowView}>
                    <View>
                        <Text style={styles.cardText}>{i18n.t('lasts_until')}</Text>
                        <Text style={styles.cardText}>31.07.2024</Text>
                    </View>
                    {membershipStatus === 'valid' && (
                    <Button 
                        size="small"
                        appearance="outline"
                        onPress={() => router.push('membership')} 
                        style={styles.cardButton}
                    >
                        {i18n.t('become_a_member')}
                    </Button>
                    )}
                </View>
            </View>
        </View>
    );
}
  
  const styles = StyleSheet.create({
    card: {
      alignItems: "center",
      justifyContent: "center",
      width: "90%",
      borderRadius: 16,
      margin: 15,
    },
    cardContent: {
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
      padding: 20,
      borderRadius: 16,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
    },
    cardText: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 10,
    },
    cardButton: {
        borderRadius: 16,
    },
    rowView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    //TODO: Make this a component
    activeMembershipIndicator: {
        width: '90%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginTop: 10,
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
  });