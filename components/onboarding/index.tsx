import { ViewPager, Button, Layout } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { OnboardingPage1 } from './page1';
import { OnboardingPage2 } from './page2';
import { OnboardingExpenses } from './page3';
import { OnboardingElections } from './page4';
import { WelcomeScreen } from './summary';


export function Onboarding() {

    const router = useRouter();

    const [step, setStep] = useState(1);
    const [userType, setUserType] = useState<'student' | 'guest'>('student');



    return (
        <View style={styles.container}>
            <ViewPager
                style={styles.viewPager}
                selectedIndex={step - 1}
                swipeEnabled={false}
                onSelect={() => setStep(step + 1)}
            >
                <OnboardingPage1
                    setStep={setStep}
                />
                <OnboardingPage2
                    setStep={setStep}
                    setUserType={setUserType}
                    
                />
                <OnboardingExpenses
                    setStep={setStep}
                    step={step}
                />
                <OnboardingElections
                    setStep={setStep}
                    step={step}
                />
                <WelcomeScreen onFinished={() => router.push('/')} step={step} />
            </ViewPager>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    viewPager: {
        flex: 1
    },
    button: {
        margin: 10
    }
});