import { StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@ui-kitten/components";
import React, { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import { View } from "react-native";
import { Text, Button } from "@ui-kitten/components";
import { Dimensions } from 'react-native';
import { Image } from "expo-image";

interface AnimatedLogoProps {
    animationStarted: boolean;
    setAnimationStarted: (animationStarted: boolean) => void;
}

const BackgroundAnimatedLogo = ({ animationStarted, setAnimationStarted }: AnimatedLogoProps) => {
    const moveAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '30deg'],
    });

    useEffect(() => {
        if (animationStarted) {
            animationRef.current = Animated.loop(
                Animated.sequence([
                    Animated.timing(moveAnim, {
                        toValue: { x: 200, y: 0 }, // Increase the movement
                        duration: 2000, // Increase the duration
                        easing: Easing.linear,
                        useNativeDriver: false
                    }),
                    Animated.timing(moveAnim, {
                        toValue: { x: 0, y: 0 },
                        duration: 2000, // Increase the duration
                        easing: Easing.linear,
                        useNativeDriver: false
                    }),
                    Animated.timing(rotateAnim, {
                        toValue: 1,
                        duration: 2000, // Increase the duration
                        easing: Easing.linear,
                        useNativeDriver: false
                    }),
                    Animated.timing(rotateAnim, {
                        toValue: 0,
                        duration: 2000, // Increase the duration
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
                    ],
                    opacity: 0.2 // Make the logo almost invisible
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

const AnimatedLogo = ({ animationStarted, setAnimationStarted }: AnimatedLogoProps) => {
    const moveAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    const animationRef = useRef<Animated.CompositeAnimation | null>(null);


    // Rotation animation
    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '30deg'], // Adjust the degrees for the desired spin
    });


    const startAnimation = () => {
        setAnimationStarted(true);
    };

    

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
        style={[styles.card, { backgroundColor: theme["background-basic-color-1"] }]}
      >
            <TouchableOpacity 
                style={[styles.activeMembershipIndicator, { backgroundColor: theme["color-primary-200"] }]}
                onPress={() => setAnimationStarted(prevState => !prevState)}
            >
                <AnimatedLogo animationStarted={animationStarted} setAnimationStarted={setAnimationStarted} />
                {!animationStarted && (
                <Text style={styles.cardText}>Press to verify</Text>
                )}
            </TouchableOpacity>
        <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>Membership Status</Text>
          <View style={styles.rowView}>
            <View>
                <Text style={styles.cardText}>Lasts until</Text>
            <Text style={styles.cardText}>31.07.2024</Text>
            </View>
            <Button style={styles.cardButton}>Become a Member</Button>
          </View>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    card: {
      alignItems: "center",
      justifyContent: "center",
      width: "85%",
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