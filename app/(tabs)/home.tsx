import { StyleSheet } from 'react-native';
import Banner from '../../components/Banner';
import NewsList from '../../components/NewsList';
import { useAuthentication } from '../../hooks/useAuthentication';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import { getWPData } from '../../hooks/getWPData';
import { Layout } from '@ui-kitten/components';
import TermsModal from '../../components/TermsModal';
import { format } from 'date-fns';

interface NewsPost {
  id: number;
  title: string;
  subtitle: string;
  department: string;
  departmentLogo: string;
  image: string;
  date: string;
}

export default function Home() {
  
  const { user, profile } = useAuthentication();
  const isAuthenticated = user ? true : false;
  const [bannerVisible, setBannerVisible] = useState(!isAuthenticated);
  const [news, setNews] = useState([]);
  const [termsModalVisible, setTermsModalVisible] = useState(false);


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

  const transformedNewsPosts: NewsPost[] = news.map((post: any) => ({
    id: post.id,
    title: post.title.rendered,
    subtitle: '', // Add appropriate value
    department: '', // Add appropriate value
    departmentLogo: '', // Add appropriate value
    image: post.yoast_head_json.schema["@graph"][2].contentUrl, // Assuming this is the correct field
    date: format(new Date(post.date), 'dd.MM.yyyy'),
  }));

  return (
    <Layout style={styles.container}>
      {!isAuthenticated && <Banner onLoginPress={onLoginPress} />}
      <TermsModal visible={termsModalVisible} setVisible={() => setTermsModalVisible(false)} />
      <NewsList newsPosts={transformedNewsPosts} onBannerVisibilityChange={setBannerVisible} />
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
