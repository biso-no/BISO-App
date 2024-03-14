import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Grid from '../../components/Grid';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, useTheme } from '@ui-kitten/components';
import i18n from '../../constants/localization';
import { useRouter } from 'expo-router';
import { Layout } from '@ui-kitten/components';
import { User, Vote, Wallet2, Star, ShoppingCart, ExternalLink, Mail } from 'lucide-react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { checkForAppUpdates } from '../../hooks/checkForAppUpdates';
import { VersionNotification } from '../../components/VersionNotification';
import Constants from "expo-constants"
import { useAuthentication, useUserProfile } from '../../hooks';
import { MembershipIsValidCard } from '../../components/MembershipStatus';
import { Notice, NoticeData } from '../../components/Notice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNotice } from '../../hooks/notice';
import { Features } from '../../types';


const Services: React.FC = () => {
  const theme = useTheme();
  const iconColor = "#fff"
  const expenseIcon = <Wallet2 size={60} color={iconColor} />;
  const electionIcon = <Vote size={60} color={iconColor}  />;
  const profileIcon = <User size={60} color={iconColor} />;
  const shopIcon = <ShoppingCart size={60} color={iconColor} />;
  const externalLinkIcon = <ExternalLink size={60} color={iconColor}/>;
  const mailIcon = <Mail size={60} color={iconColor} />;
  const membershipIcon = <Star size={60} color={theme['color-primary-disabled']} />;
  const [latestVersion, setLatestVersion] = useState<boolean>(true);
  const { user } = useAuthentication();
  const { profile } = useUserProfile();
  const [notices, setNotices] = useState<NoticeData[]>([]);
  //Route translations

  const { language } = useLanguage();

  i18n.locale = language;

  const expensesEnabled = profile?.features?.includes(Features.expenses) || false;
  const electionsEnabled = profile?.features?.includes(Features.elections) || false;

  useEffect(() => {

    const getNotices = async () => {
      const notices = await getNotice();
      const noticesJson = notices.map(notice => ({ id: notice.id, message: notice.message }));
      setNotices(noticesJson);
    };
    getNotices();
  }
    , []);

  

    const dismissNotice = async (notice: NoticeData) => {
      const dismissedNotices = await AsyncStorage.getItem('dismissedNotices');
      let dismissedNoticesArray = [];
      if (dismissedNotices) {
        dismissedNoticesArray = JSON.parse(dismissedNotices);
      }
      dismissedNoticesArray.push(notice.id);
      await AsyncStorage.setItem('dismissedNotices', JSON.stringify(dismissedNoticesArray));
      setNotices(notices.filter(n => n.id !== notice.id));
    }

    



  const router = useRouter();

  const items = [
    {
      key: 'item1',
      icon: expenseIcon,
      backgroundColor: theme['color-primary-500'],
      title: i18n.t('expenses'),
      onPress: () => router.push('expenses'),
    },
    {
      key: 'item2',
      icon: electionIcon,
      backgroundColor: theme['color-primary-500'],
      title: i18n.t('elections'),
      onPress: () => router.push('elections'),
    },
    {
      key: 'item3',
      icon: profileIcon,
      backgroundColor: theme['color-primary-500'],
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
      key: 'item4',
      icon: shopIcon,
      backgroundColor: theme['color-primary-500'],
      title: i18n.t('webshop'),
      onPress: () => router.push('https://biso.no/nettbutikk/'),
      isExternalLink: true,
    },
    {
      key: 'item5',
      icon: mailIcon,
      backgroundColor: theme['color-primary-500'],
      title: i18n.t('posts'),
      onPress: () => router.push('post'),
    }
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
    <ScrollView>
    <Layout style={[styles.container, { backgroundColor: theme['background-basic-color-1'] }]}>
      {/* Other components */}
      {!latestVersion && <VersionNotification visible={!latestVersion} setVisible={setLatestVersion} />}
      <MembershipIsValidCard />
      <Text style={{ textAlign: 'left', fontSize: 20, fontWeight: '700', marginTop: 10, marginBottom: 10, marginLeft: 25, }}>{i18n.t('services')}</Text>
      <Grid items={items} />
      
      
      {/* Notices */}
      <View style={styles.noticeContainer}>
        {notices.map((notice: NoticeData) => (
          <Notice key={notice.id} id={notice.id} message={notice.message} onClose={() => dismissNotice(notice)} />
        ))}
      </View>
    </Layout>
    </ScrollView>
  );
  
  
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noticeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100, // Ensure this is above other components
  },
});

export default Services;
