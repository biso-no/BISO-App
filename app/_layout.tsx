import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Link, SplashScreen, Stack } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, SafeAreaView, useColorScheme, StatusBar, View } from 'react-native';
import { LanguageProvider } from '../contexts/LanguageContext';
import i18n from '../constants/localization';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { logOut } from '../hooks/login';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useUserProfile } from '../hooks/useUserProfile';
import { UserProfile } from '../types';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Button, StyleService } from '@ui-kitten/components';
import { default as theme } from '../constants/theme.json';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeScreen from './welcome';
import Constants from "expo-constants"
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Navigator,  
  Slot, 
  usePathname, 
  useRouter,
 } from "expo-router";
import { 
  BottomNavigation, 
  BottomNavigationTab,   
  TopNavigation,
  TopNavigationAction, } from '@ui-kitten/components';
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const latestVersion = '1.0.0';


async function registerForPushNotificationsAsync(profile: UserProfile, updateUserProfile: { (updatedFields: Partial<UserProfile>): Promise<void>; (arg0: { pushToken: string; }): void; }) {
  let token;

  if (Device.isDevice) {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        console.log(status);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync());
      console.log(token.data);

      if (!profile.pushToken || profile.pushToken !== token.data) {
        updateUserProfile({ pushToken: token.data });
      }

    } catch (error) {
      console.error(error);
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (!token) {
    return;
  }
  return token.data;
}



/**
 * Renders the root layout component.
 *
 * @return {JSX.Element} The rendered root layout component.
 */
export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  
  

  return (
    <>
      {!loaded && <SplashScreen />}
      {loaded && <RootLayoutNav />}
    </>
  );
}

/**
 * RootLayoutNav component renders the root layout and navigation for the app.
 *
 * @return {JSX.Element} The rendered RootLayoutNav component.
 */
function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>('');
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const [locale, setLocale] = useState<string>(i18n.locale);
const [initialRoute, setInitialRoute] = useState<string | undefined>(undefined);
const [isFirstTime, setIsFirstTime] = useState<boolean>(false);
const { profile, updateUserProfile } = useUserProfile();
const [isNewVersionAvailable, setIsNewVersionAvailable] = useState(false);
useEffect(() => {
  // Check if a new version is available when the app loads
  checkForNewVersion();
}, []);

const checkForNewVersion = () => {
  // Compare the current app version (from Constants) with the latest version
  if (Constants.manifest?.version !== latestVersion) {
    setIsNewVersionAvailable(true);
  }
};
const router = useRouter();


  useEffect(() => {
    registerForPushNotificationsAsync(profile, updateUserProfile).then(token => setExpoPushToken(token));
    console.log(expoPushToken);

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
    
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    
      // Handle the targetRoute from the notification data
      const targetRoute = response.notification.request.content.data.targetRoute;
      const targetParams = response.notification.request.content.data.targetParams;
     if (targetRoute)
      setTimeout(() => {
        if (targetParams)
        router.push({ pathname: targetRoute, params: targetParams });
        else
        router.push(targetRoute);
      }, 0o1);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current!);
      if (responseListener.current !== undefined) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  useEffect(() => {
    if (locale !== i18n.locale) {
      i18n.locale = locale;
    }
  }, [locale]);

  useEffect(() => {
    if (profile && expoPushToken) {
      if (!profile.pushToken) {
        updateUserProfile({ pushToken: expoPushToken });
      } else if (profile.pushToken !== expoPushToken) {
        updateUserProfile({ pushToken: expoPushToken });
      }
    }
  }, [profile, expoPushToken]);

  const checkIfFirstTime = async () => {
    try {
      const value = await AsyncStorage.getItem('firstTime');
      console.log(value)

      if (value === null) {
        setIsFirstTime(true);
        await AsyncStorage.setItem('firstTime', 'true');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfFirstTime();
  }, []);
  

  if (!profile || isFirstTime) {
    return (
      <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
        <LanguageProvider language={locale} setLanguage={setLocale}>
          <WelcomeScreen setIsFirstTime={setIsFirstTime} existingUser={!!profile} />
        </LanguageProvider>
      </ApplicationProvider>
    );
  }

  const pathname = usePathname();

  let path = pathname.replace('/', '');
  if (path === '') {
    path = 'home';
  }

  //If path is /expenses/1 or 2 or 3, set path to /expenses
  if (path.includes('expenses')) {
    path = 'expenses';
  }
  
  
  const pathLocale = i18n.t(path);


const CalendarIcon = (props: any) => (
  <Ionicons name="calendar" size={30} color={theme['color-basic-100']} />
);

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const screensToHideHeader = ['login', 'register', 'camera'];

  return (
    <ApplicationProvider {...eva} theme={{ ...eva.dark}}>
      <LanguageProvider language={locale} setLanguage={setLocale}>
        <SafeAreaProvider>
        <View style={[styles.transparentView, { backgroundColor: 'black' }]} />
        {
          !screensToHideHeader.includes(path) && (
          <TopNavigation 
            alignment='center'
            title={pathLocale}
            accessoryLeft={() => (
              
              <TopNavigationAction
                  //Top left, router.back(), only when not on home, services or units
                  icon={path !== 'home' && path !== 'services' && path !== 'units' ? () => <Ionicons name="arrow-back" size={30} color={theme['color-basic-100']} /> : () => <></>}
                  onPress={() => {
                    if (path !== 'home' && path !== 'services' && path !== 'units') {
                      router.back();
                    }
                  }}
              />
            )}
            accessoryRight={() => (
              <TopNavigationAction
                icon={
                  //If path is home, services or units, show calendar icon. If path is profile, show log out icon. Otherwise, show nothing
                  path === 'home' || path === 'services' || path === 'units' ? () => <CalendarIcon /> : path === 'profile' ? () => <Ionicons name="log-out" size={30} color={theme['color-basic-100']} /> : () => <></>
                }
                onPress={() => {
                  if (path === 'profile') {
                    logOut();
                  }
                  else if (path === 'home' || path === 'services' || path === 'units') {
                    router.push('events');
                }
                }
                }
              />
            )}
          />
          )
        }
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                animationDuration: 150,
              }}
            >
              <Stack.Screen 
              name="(tabs)" 
              options={{ 
                headerShown: false,
                animation: 'slide_from_right',
                 }} />
              <Stack.Screen
                name="login"
                options={{
                  title: i18n.t('login'),
                  headerShown: false,
                  presentation: 'fullScreenModal',
                }}
              />
              <Stack.Screen
                name="register"
                options={{
                  title: i18n.t('signUp'),
                  headerShown: false,
                  presentation: 'fullScreenModal',
                }}
              />
              <Stack.Screen
                name="profile"
                options={{
                  title: i18n.t('profile'),
                  headerShown: false,
                  presentation: 'fullScreenModal',
                }}
              />
            </Stack>
            </SafeAreaProvider>
      </LanguageProvider>
    </ApplicationProvider>
  );
  
}

const styles = StyleService.create({
  transparentView: {
    height: StatusBar.currentHeight,
  }
});