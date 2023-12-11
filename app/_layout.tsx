import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Link, Stack } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, SafeAreaView, useColorScheme, StatusBar as RNStatusBar, View, Alert } from 'react-native';
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
import { ApplicationProvider, Layout, Button, StyleService, Spinner, Divider, Tooltip } from '@ui-kitten/components';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeScreen from './welcome';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Navigator,  
  Slot, 
  usePathname, 
  useRouter,
 } from "expo-router";
import { 
  BottomNavigation, 
  BottomNavigationTab,   
  TopNavigation,
  TopNavigationAction, 
  useTheme } from '@ui-kitten/components';
  import * as SplashScreen from 'expo-splash-screen';
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';
import { ThemeContext } from '../contexts/ThemeContext';
import { CalendarIcon, LogOutIcon, ArrowLeftIcon, LogInIcon } from '../components/icons';
import Loading from '../components/Loading';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuthentication } from '../hooks';
import { MembershipProvider } from '../contexts/MembershipContext';
import { getTrackingPermissionsAsync, requestTrackingPermissionsAsync } from 'expo-tracking-transparency';


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
  const [theme, setTheme] = useState('dark');
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const getTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
        if (storedTheme) {
          setTheme(storedTheme);
        }
      } catch (err) {
        console.error('Error fetching theme:', err);
      } finally {
        setIsThemeLoaded(true);
      }
    };

    getTheme();
  }, []);

  if (!loaded || !isThemeLoaded) {
    return null; // or you can return a placeholder/loading screen here
  }
  

  return <RootLayoutNav theme={theme} setTheme={setTheme} />;
}


function RootLayoutNav({ theme, setTheme }: { theme: string, setTheme: React.Dispatch<React.SetStateAction<string>> }) {

const { user } = useAuthentication();

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

const [isLoading, setIsLoading] = useState(true);

const { language } = useLanguage();
i18n.locale = language;

const [toolTipVisible, setToolTipVisible] = useState(false);
const themeColors = useTheme();
const router = useRouter();

useEffect(() => {
  (async () => {
    const { status: existingStatus } = await getTrackingPermissionsAsync();
    if (existingStatus !== 'granted') {
      const { status } = await requestTrackingPermissionsAsync();
      if (status === 'granted') {
        console.log('Tracking permission granted');
      }
    }
  })();
}, []);





const toggleTheme = () => {
  const nextTheme = theme === 'light' ? 'dark' : 'light';
  setTheme(nextTheme);
};

//Get theme from async storage
useEffect(() => {
  const getTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem('theme');
      if (storedTheme) {
        setTheme(storedTheme);
      }
    } catch (error) {
      console.error('Error fetching theme:', error);
    } finally {
      // Set loading to false once the theme is fetched
      setIsLoading(false);
    }
  };
  getTheme();
}, []);



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

  /*
  const checkIfFirstTime = async () => {
    try {
      const value = await AsyncStorage.getItem('firstTime');
      console.log(value)

      if (value === null || value === undefined) {
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
*/

  const selectLanguage = (locale: string) => {
    //Save to asyncstorage
    AsyncStorage.setItem('locale', locale);
    setLocale(locale);
    i18n.locale = locale;
  };

  useEffect (() => {
    const getLocale = async () => {
      try {
        const storedLocale = await AsyncStorage.getItem('locale');
        if (storedLocale) {
          setLocale(storedLocale);
        }
      } catch (error) {
        console.error('Error fetching locale:', error);
      }
    };
    getLocale();
  }, []);
  

  if (!profile || isFirstTime) {
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <ApplicationProvider {...eva} theme={eva[theme as keyof typeof eva]}>
        <LanguageProvider language={locale} setLanguage={setLocale}>
          <WelcomeScreen setIsFirstTime={setIsFirstTime} existingUser={!!profile} />
        </LanguageProvider>
      </ApplicationProvider>
      </ThemeContext.Provider>
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

  if (path.includes('membership')) {
    path = 'membership';
  }
  
  
  const pathLocale = i18n.t(path);

  const renderCalendarButton = () => {
    return (
      <TopNavigationAction
        icon={CalendarIcon}
        onPress={() => setToolTipVisible(true)}
      />
    )
  };


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

//Must hardcode the background Colors for the iOS status bar as we cannot yet access theme variables.
//For light theme, the background color is white, for dark theme, it is "#222B45".
const backgroundColor = theme === 'dark' ? '#151A30' : '#EDF1F7';

const screensToHideHeader = ['login', 'register', 'camera', 'expenses', 'elections'];
const containerStyle = {backgroundColor: backgroundColor };

return (
  <ThemeContext.Provider value={{ theme, toggleTheme }}>
<ApplicationProvider {...eva} theme={eva[theme as keyof typeof eva]}>
      <LanguageProvider language={locale} setLanguage={selectLanguage}>
        <MembershipProvider>
        <SafeAreaView style={containerStyle}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} backgroundColor={backgroundColor} />
          <Layout style={styles.transparentView} />
          {
            !screensToHideHeader.includes(path) && (
          <TopNavigation 
            alignment='center'
            title={pathLocale}
            style={{backgroundColor: backgroundColor }}
            accessoryLeft={() => (
              
              <TopNavigationAction
                  //Top left, router.back(), only when not on home, services or units
                  icon={path !== 'home' && path !== 'services' && path !== 'units' ? () => <ArrowLeftIcon /> : () => <></>}
                  onPress={() => {
                    if (path !== 'home' && path !== 'services' && path !== 'units') {
                      router.back();
                    }
                  }}
              />
            )}
            accessoryRight={() => (
              <>
              {renderCalendarButton()}
              {!user && (
              <TopNavigationAction
              icon={() => <LogInIcon />}
              onPress={() => router.push('login')}
              />
              )}
              {path === 'profile' && user && (
              <TopNavigationAction
              icon={() => <LogOutIcon />}
              onPress={logOut}
              />
              )}
              </>
            )}
          />
          )
        }
          </SafeAreaView>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_bottom',
              animationDuration: 150,
            }}
          >
            <Stack.Screen 
              name="(tabs)" 
              options={{ 
                headerShown: false,
                animation: 'slide_from_bottom',
              }} 
            />
          </Stack>
          </MembershipProvider>
      </LanguageProvider>
    </ApplicationProvider>
  </ThemeContext.Provider>
);

  
}

const styles = StyleService.create({
  transparentView: {
    height: RNStatusBar.currentHeight,
  }
});