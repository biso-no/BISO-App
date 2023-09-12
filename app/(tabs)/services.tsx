import React from 'react';
import { View, StyleSheet } from 'react-native';
import Grid from '../../components/Grid';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeColor, Text } from '../../components/Themed';
import i18n from '../../constants/localization';
import { useRouter } from 'expo-router';
import { Link } from 'expo-router';
import ProgressBar from '../../components/ProgressBar';
import { Layout } from '@ui-kitten/components';
import { User, Vote, Wallet2, Star } from 'lucide-react-native';

const Services: React.FC = () => {
  const iconColor = useThemeColor({}, 'iconColor');
  const primaryColor = useThemeColor({}, 'primary');
  const expenseIcon = <Wallet2 size={40} color={iconColor} />;
  const electionIcon = <Vote size={40} color={iconColor} />;
  const profileIcon = <User size={40} color={iconColor} />;
  const membershipIcon = <Star size={40} color={iconColor} />;
  //Route translations
  const expensesTranslated = i18n.t('expenses');
  const profileTranslated = i18n.t('profile');
  const eventsTranslated = i18n.t('events');


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
      key: 'item1',
      icon: expenseIcon,
      title: expensesTranslated,
      onPress: () => router.push('expenses'),
    },
    {
      key: 'item2',
      icon: electionIcon,
      title: 'Elections',
      onPress: () => router.push('elections'),
    },
    {
      key: 'item3',
      icon: profileIcon,
      title: profileTranslated,
      onPress: () => router.push('profile'),
    },
    {
      key: 'item6',
      icon: expenseIcon,
      title: 'Membership',
      onPress: () => router.push('MembershipScreen'),
    }
  ];

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
