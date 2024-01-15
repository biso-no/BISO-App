import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Grid from '../../components/Grid';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@ui-kitten/components';
import i18n from '../../constants/localization';
import { useRouter } from 'expo-router';
import { Layout } from '@ui-kitten/components';
import { User, Vote, Wallet2, Star, ShoppingCart } from 'lucide-react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { checkForAppUpdates } from '../../hooks/checkForAppUpdates';
import { VersionNotification } from '../../components/VersionNotification';
import Constants from "expo-constants"
import { useAuthentication } from '../../hooks';
import { MembershipIsValidCard } from '../../components/MembershipStatus';

const Services: React.FC = () => {
  const theme = useTheme();
  const iconColor = theme['text-basic-color'];
  const expenseIcon = <Wallet2 size={40} color={iconColor} />;
  const electionIcon = <Vote size={40} color={iconColor} />;
  const profileIcon = <User size={40} color={iconColor} />;
  const shopIcon = <ShoppingCart size={40} color={iconColor} />;
  const membershipIcon = <Star size={40} color={theme['color-primary-disabled']} />;
  const [latestVersion, setLatestVersion] = useState<boolean>(true);
  const { user } = useAuthentication();

  //Route translations

  const { language } = useLanguage();

  i18n.locale = language;


  const router = useRouter();

  const items = [
    {
      key: 'item2',
      icon: electionIcon,
      title: i18n.t('elections'),
      onPress: () => router.push('elections'),
    },
    {
      key: 'item3',
      icon: profileIcon,
      title: i18n.t('profile'),
      onPress: () => {
        if (user) {
          router.push('profile');
        } else {
          router.push('login');
        }
      }
    },
    {
      key: 'item6',
      icon: membershipIcon,
      title: i18n.t('membership'),
      onPress: () => router.push('membership'),
      disabled: true
    },
    {
      key: 'item1',
      icon: expenseIcon,
      title: i18n.t('expenses'),
      onPress: () => router.push('expenses'),
    },
    {
      key: 'item4',
      icon: shopIcon,
      title: i18n.t('webshop'),
      onPress: () => router.push('https://biso.no/nettbutikk/'),
    },
  ];

  useEffect(() => {
    const getLatestVersion = async () => {
      const currentVersion = Constants.expoConfig?.version;
      if (currentVersion) {
        const latestVersion = await checkForAppUpdates(currentVersion);
        setLatestVersion(latestVersion);
      }
    };
    getLatestVersion();
  }, []);
  


  return (
    <Layout style={[styles.container, { backgroundColor: theme['background-basic-color-3'] }]}>
          <VersionNotification
            visible={!latestVersion}
            setVisible={setLatestVersion}
          />
        <MembershipIsValidCard />
      <Grid items={items} />
    </Layout>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Services;
