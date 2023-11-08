
import i18n from '../../constants/localization';
import { useTheme, Icon, Layout } from '@ui-kitten/components';
import { 
  BottomNavigation, 
  BottomNavigationTab,   
 } from '@ui-kitten/components';
import { Navigator,  
  Slot, 
  usePathname, 
  useRouter,
 } from "expo-router";
 import { useLanguage } from '../../contexts/LanguageContext';

import { useState } from 'react';
import { Home, LayoutGrid, Menu } from 'lucide-react-native';


export default function TabLayout() {

  const theme = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(1);
  const router = useRouter();
  const { language } = useLanguage();

  i18n.locale = language;

  const selectRoute = (index: number) => {
    setSelectedIndex(index);
    router.push(index === 0 ? '/home' : index === 1 ? '/' : '/units');
  };
  const HomeIcon = (props: any) => (
    <Home {...props} color={theme['color-primary-disabled']} />
  )

  const LayoutIcon = (props: any) => (
    <LayoutGrid {...props} color={theme['text-basic-color']} />
  )

  const MenuIcon = (props: any) => (
    <Menu {...props} color={theme['text-basic-color']} />
  )

  return (
    <Navigator>
            <Slot />
      <BottomNavigation
        selectedIndex={selectedIndex}
        onSelect={index => selectRoute(index)}>
        <BottomNavigationTab  icon={HomeIcon} />
        <BottomNavigationTab icon={LayoutIcon} />
        <BottomNavigationTab icon={MenuIcon} />
      </BottomNavigation>
    </Navigator>
  );
}