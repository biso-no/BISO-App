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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  const selectRoute = (index: number) => {
    setSelectedIndex(index);
    router.push(index === 0 ? '/' : index === 1 ? '/services' : '/units');
  };
  

  return (
    <Navigator>
            <Slot />
      <BottomNavigation
        selectedIndex={selectedIndex}
        onSelect={index => selectRoute(index)}>
        <BottomNavigationTab title='Home'/>
        <BottomNavigationTab title='Services'/>
        <BottomNavigationTab title='Units' />
      </BottomNavigation>
    </Navigator>
  );
}