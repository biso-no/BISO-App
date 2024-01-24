import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StatusBar as RNStatusBar } from 'react-native';
import { LanguageProvider } from '../contexts/LanguageContext';
import i18n from '../constants/localization';
import { logOut } from '../hooks/login';
import { useUserProfile } from '../hooks/useUserProfile';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, StyleService } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeScreen from './welcome';
import { StatusBar } from 'expo-status-bar';
import {  
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
import { useLanguage } from '../contexts/LanguageContext';
import { useAuthentication } from '../hooks';
import { MembershipProvider } from '../contexts/MembershipContext';
import { getTrackingPermissionsAsync, requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { StripeProvider } from '@stripe/stripe-react-native';
import { registerForPushNotificationsAsync } from '../hooks/registerPush';
import * as Notifications from 'expo-notifications';
import { setUserPushToken } from '../hooks/pushtoken';
export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};



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

  const STRIPE_PUBLISHABLE_KEY = ""

const { user } = useAuthentication();

  const [locale, setLocale] = useState<string>(i18n.locale);
const [isFirstTime, setIsFirstTime] = useState<boolean>(false);
const { profile, updateUserProfile } = useUserProfile();
const [isLoading, setIsLoading] = useState(true);
const [expoPushToken, setExpoPushToken] = useState('');
const [notification, setNotification] = useState(false);
const notificationListener = useRef<Notifications.Subscription>();
const responseListener = useRef<Notifications.Subscription>();



const { language } = useLanguage();
i18n.locale = language;



const router = useRouter();

useEffect(() => {
  registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

  notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    setNotification(notification);
  });

  responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    console.log(response);
  });

  if (expoPushToken && user) {
    setUserPushToken(user.uid, expoPushToken);
  }

  return () => {
    Notifications.removeNotificationSubscription(notificationListener.current);
    Notifications.removeNotificationSubscription(responseListener.current);
  };
}, []);

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
    if (locale !== i18n.locale) {
      i18n.locale = locale;
    }
  }, [locale]);


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

  if (path.includes('post/')) {
    path = 'post';
  }
  
  
  const pathLocale = i18n.t(path);

  const renderCalendarButton = () => {
    return (
      <TopNavigationAction
        icon={CalendarIcon}
        onPress={() => router.push('events')}
      />
    )
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
        <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
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
        </StripeProvider>
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