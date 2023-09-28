import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, SafeAreaView, useColorScheme } from 'react-native';
import i18n from '../../constants/localization';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Icon, Layout } from '@ui-kitten/components';
import { 
  BottomNavigation, 
  BottomNavigationTab,   
  TopNavigation,
  TopNavigationAction, } from '@ui-kitten/components';
import { Navigator,  
  Slot, 
  usePathname, 
  useRouter,
 } from "expo-router";
 import { useLanguage } from '../../contexts/LanguageContext';


import Colors from '../../constants/Colors';
import { useState } from 'react';
import { Home, LayoutGrid, GraduationCap } from 'lucide-react-native';
/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {

  const theme = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(1);
  const router = useRouter();
  const pathname = usePathname();
  const { language } = useLanguage();

  i18n.locale = language;

  const selectRoute = (index: number) => {
    setSelectedIndex(index);
    router.push(index === 0 ? '/home' : index === 1 ? '/' : '/units');
  };
  

  return (
    <Navigator>
            <Slot />
      <BottomNavigation
        selectedIndex={selectedIndex}
        onSelect={index => selectRoute(index)}>
        <BottomNavigationTab title={i18n.t('home')} disabled={true} />
        <BottomNavigationTab title={i18n.t('services')} />
        <BottomNavigationTab title={i18n.t('units')} />
      </BottomNavigation>
    </Navigator>
  );
}