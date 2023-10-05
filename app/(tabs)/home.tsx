import { StyleSheet } from 'react-native';
import Banner from '../../components/Banner';
import NewsList from '../../components/NewsList';
import { useAuthentication } from '../../hooks/useAuthentication';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import { getWPData } from '../../hooks/getWPData';
import { Layout } from '@ui-kitten/components';
import TermsModal from '../../components/TermsModal';

export default function Home() {
  
  const { user, profile } = useAuthentication();
  const isAuthenticated = user ? true : false;
  const [bannerVisible, setBannerVisible] = useState(true);
  const [news, setNews] = useState([]);
  const [termsModalVisible, setTermsModalVisible] = useState(false);



  //Dummy posts for testing
  const newsPosts = [
    {
      departmentLogo: "https://picsum.photos/200/300",
      title: "Title",
      subtitle: "This is the title of a newsworthy post",
      department: "Department",
      date: "20.01.2023",
      image: "https://picsum.photos/200/300",
    },
    {
      departmentLogo: "https://picsum.photos/200/300",
      title: "Title",
      subtitle: "Subtitle",
      department: "Department",
      date: "22.02.2023",
      image: "https://picsum.photos/200/300",
      isFeatured: true,
    },
    {
      departmentLogo: "https://picsum.photos/200/300",
      title: "Title",
      subtitle: "Subtitle",
      department: "Department",
      date: "18.04.2023",
      image: "https://picsum.photos/200/300",
    }
  ]

 const onLoginPress = () => {
    <Link href={'/login'} />
  }


  //TODO: Filter data from posts to highlight.
  useEffect(() => {
    const fetchData = async () => {
      const news = await getWPData('https://biso.no/wp-json/wp/v2/posts');
      setNews(news);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (profile && !profile.newFeatures) {
      setTermsModalVisible(true);
    }
  }, [profile]);

  return (
    <Layout style={styles.container}>
      {bannerVisible && <Banner onLoginPress={onLoginPress} />}
      <TermsModal visible={termsModalVisible} setVisible={() => setTermsModalVisible(false)} />
        <NewsList newsPosts={newsPosts} onBannerVisibilityChange={setBannerVisible} />
    </Layout>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
