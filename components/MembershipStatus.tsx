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
import { useUserProfile } from "../hooks";
import { useAuthentication } from "../hooks";
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from "expo-linear-gradient";


function SignInToViewMembershipCard() {

    const router = useRouter();

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
            justifyContent: "center",
            width: "100%",
            padding: 20,
            borderRadius: 16,
        },
        cardText: {
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 10,
        },
        cardButton: {
            borderRadius: 16,
        },
    });

    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <Text style={styles.cardText}>Please sign in to view or purchase a membership.</Text>
                <Button 
                    size="small"
                    appearance="outline"
                    status="basic"
                    onPress={() => router.push('login')} // Replace with your actual navigation function
                    style={styles.cardButton}
                >
                    Sign In
                </Button>
            </View>
        </View>
    );
}

interface AnimatedLogoProps {
    animationStarted: boolean;
}

function SkeletonmembershipIsValidCard() {

    const theme = useTheme();

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
        width: "50%", // Adjust the width as needed
        height: 24, // Adjust the height as needed
        backgroundColor: "#e0e0e0", // You can set a background color for the skeleton
        marginBottom: 10,
      },
      cardText: {
        width: "80%", // Adjust the width as needed
        height: 16, // Adjust the height as needed
        backgroundColor: "#e0e0e0", // You can set a background color for the skeleton
        marginBottom: 10,
      },
      cardButton: {
        width: "40%", // Adjust the width as needed
        height: 40, // Adjust the height as needed
        backgroundColor: "#e0e0e0", // You can set a background color for the skeleton
        borderRadius: 16,
      },
      rowView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
      },
      activeMembershipIndicator: {
        width: '90%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginTop: 10,
        backgroundColor: "#e0e0e0", // You can set a background color for the skeleton
      },
      logo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#e0e0e0", // You can set a background color for the skeleton
      },
    });

    const pulseAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0.5,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    }, []);
  
    return (
        <View style={[styles.card, { backgroundColor: theme["background-basic-color-3"] }]}>
            <Animated.View style={[styles.activeMembershipIndicator, { opacity: pulseAnim }]}>
                <View style={[styles.logo]}></View>
                <Text style={[styles.cardText]}></Text>
            </Animated.View>
            <Animated.View style={[styles.cardContent, { opacity: pulseAnim }]}>
                <Text style={[styles.cardTitle]}></Text>
                <View style={styles.rowView}>
                    <View>
                        <Text style={[styles.cardText]}></Text>
                        <Text style={[styles.cardText]}></Text>
                    </View>
                    <View style={styles.cardButton}></View>
                </View>
            </Animated.View>
        </View>
    );
}
  

  const AnimatedLogo = ({ animationStarted }: AnimatedLogoProps) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;
    const animationLoop = useRef<Animated.CompositeAnimation>();

    useEffect(() => {
        const logoAnimation = Animated.sequence([
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1.2,
                    friction: 2,
                    useNativeDriver: true
                }),
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0.8,
                    duration: 500,
                    useNativeDriver: true
                })
            ]),
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 2,
                    useNativeDriver: true
                }),
                Animated.timing(rotateAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true
                })
            ])
        ]);

        if (animationStarted) {
            animationLoop.current = Animated.loop(logoAnimation);
            animationLoop.current.start();
        } else {
            animationLoop.current?.stop();
        }

        return () => {
            animationLoop.current?.stop();
        };
    }, [animationStarted]);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <Animated.View
            style={[
                styles.logo,
                {
                    transform: [{ scale: scaleAnim }, { rotate: spin }],
                    opacity: opacityAnim
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




export function MembershipIsValidCard() {
    const theme = useTheme();

    const [containerWidth, setContainerWidth] = React.useState(0);
    const [containerHeight, setContainerHeight] = React.useState(0);
    const [animationStarted, setAnimationStarted] = React.useState(false);
    const router = useRouter();

    const { profile, loading } = useUserProfile();
    const { membershipIsValid, membershipExpiry, isLoading: membershipLoading } = useMembership();
    const { user, loading: userLoading } = useAuthentication();

    
    const membershipButtonText = membershipIsValid === "true" ? i18n.t('show_membership') : i18n.t('become_a_member');
    const isMembershipValid = membershipIsValid === "true";

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

    if (membershipLoading) {
        return <SkeletonmembershipIsValidCard />; // Replace with your actual loading component
    }

    // If the user is not authenticated, show the sign in component
    if (!user && !isMembershipValid && !membershipLoading) {
        return <SignInToViewMembershipCard />;
    }


    const membershipRouter = () => {
        if (isMembershipValid && user) {
            router.push('/membership/' + user.uid);
        } else if (!isMembershipValid && profile) {
            router.push('/membership');
        } else {
            router.push('login');
        }
    }


    return (
        <LinearGradient
        colors={[
            theme['color-primary-transparent-200'],
            theme['color-primary-transparent-300'],
            theme['color-primary-transparent-400']
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
    >
        <View 
            style={[
                styles.card, 
            ]}
        >
            {isMembershipValid && (
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
            )}
            <View style={[styles.cardContent, { padding: 20 }]}>
                <Text style={[styles.cardTitle, { fontSize: 24, fontWeight: 'bold' }]}>{i18n.t('membership_status')}</Text>
                <View style={styles.rowView}>
                    <View>
                        <Text style={styles.cardText}>{i18n.t('lasts_until')}</Text>
                        <Text style={styles.cardText}>{membershipExpiry || 'N/A'}</Text>
                    </View>
                    {/*If no membership status is found, or membershipIsValid === "false", show the button to become a member*/}
                    {!isMembershipValid && (
                    <Button 
                        size="small"
                        appearance="outline"
                        status="basic"
                        onPress={membershipRouter}
                        style={styles.cardButton}
                    >
                        {membershipButtonText}
                    </Button>
                    )}
                </View>
            </View>
        </View>
        </LinearGradient>
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
    cardGradient: {
        alignItems: "center",
        justifyContent: "center",
        width: "90%",
        borderRadius: 16,
        margin: 15,
    },
  });

