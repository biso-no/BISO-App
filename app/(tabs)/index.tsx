import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Grid from '../../components/Grid';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@ui-kitten/components';
import i18n from '../../constants/localization';
import { useRouter } from 'expo-router';
import { Link } from 'expo-router';
import ProgressBar from '../../components/ProgressBar';
import { Layout } from '@ui-kitten/components';
import { User, Vote, Wallet2, Star } from 'lucide-react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { checkForAppUpdates } from '../../hooks/checkForAppUpdates';
import { VersionNotification } from '../../components/VersionNotification';
import Constants from "expo-constants"
import { useAuthentication } from '../../hooks';

const Services: React.FC = () => {
  const theme = useTheme();
  const iconColor = theme['text-basic-color'];
  const primaryColor = theme['color-primary-100'];
  const expenseIcon = <Wallet2 size={40} color={iconColor} />;
  const electionIcon = <Vote size={40} color={iconColor} />;
  const profileIcon = <User size={40} color={iconColor} />;
  const membershipIcon = <Star size={40} color={theme['color-primary-disabled']} />;
  const [latestVersion, setLatestVersion] = useState<boolean>(true);
  const { user } = useAuthentication();

  //Route translations

  const { language } = useLanguage();

  i18n.locale = language;


  //Bruker velger campus i sin profil, og data her vil etterhvert bli hentet fra backend utifra brukerens campus
  const [progressBarData, setProgressBarData] = React.useState([
    {
      label: 'D-blokka',
      value: 100,
      maxValue: 100,
    },
    {
      label: 'E-blokka',
      value: 50,
      maxValue: 100,
    },
    {
      label: 'F-blokka',
      value: 0,
      maxValue: 100,
    },
  ]);


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
  ];

  useEffect(() => {
    const getLatestVersion = async () => {
      const currentVersion = Constants.expoConfig?.version;
      if (currentVersion) {
        console.log(currentVersion);
        const latestVersion = await checkForAppUpdates(currentVersion);
        console.log(latestVersion);
        setLatestVersion(latestVersion);
      }
    };
    getLatestVersion();
  }, []);
  


  return (
    <Layout style={styles.container}>
       {/*}
      <ProgressBar data={progressBarData} 
      style=
      {{ 
        width: '95%', 
        padding: 10, 
        borderRadius: 10, 
        margin: 10 }} 
      header={i18n.t('seats_available')}
      valueLabel={i18n.t('seats_available')} />
      {*/}
          <VersionNotification
            visible={!latestVersion}
            setVisible={setLatestVersion}
          />
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
