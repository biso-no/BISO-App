import React from 'react';
import {Image, FlatList, Dimensions } from 'react-native';
import { Layout, Text, useTheme, StyleService, Card } from '@ui-kitten/components';
import { getPosts } from '../hooks/posts';
import { router } from 'expo-router';
import i18n from '../constants/localization';

interface Post {
  id: number;
    title: string;
    subTitle?: string;
    body: string;
    pinned: boolean;
    image?: string;
    postedAt: string;
  }


const screenWidth = Dimensions.get('window').width;

export function Posts() {
  const theme = useTheme();

    const [loading, setLoading] = React.useState<boolean>(false);
    const [newsPosts, setNewsPosts] = React.useState<Post[]>([]);
    React.useEffect(() => {
        setLoading(true);
        const getPostsAsync = async () => {
          const posts = await getPosts();
          setNewsPosts(posts);
        };
        getPostsAsync();
        setLoading(false);
      }, []);

  // Sort the newsPosts array to display featured posts first
  const sortedNewsPosts = newsPosts.sort((a, b) => {
    if (a.pinned && !b.pinned) {
      return -1;
    } else if (!a.pinned && b.pinned) {
      return 1;
    } else {
      return 0;
    }
  });

  const renderItem = ({ item }: { item: Post }) => (
    <Card style={[styles.newsPostContainer]} onPress={() => router.push('post/' + item.id)}>
      <Layout style={styles.header}>
        <Layout style={styles.departmentInfo}>
          <Text style={[styles.postDate, { color: theme['color-basic-500'] }]}>{item.postedAt}</Text>
        </Layout>
        {item.pinned && (
          <Layout style={[styles.featuredContainer, { backgroundColor: theme['color-primary-500'] }]}>
            <Text style={[styles.featuredText, { color: theme['color-basic-100'] }]}>Pinned</Text>
          </Layout>
        )}
      </Layout>
      <Layout style={{ height: 200 }}>
        {item.image && (
      <Image source={{ uri: item.image }} style={styles.postImage} />
        )}
      </Layout>
      <Text style={[styles.title]}>{item.title}</Text>
      <Text style={[styles.subtitle]}>{item.subTitle}</Text>
    </Card>
  );

  //Skeleton copy of renderItem with colored boxes to show skeleton loading
  const renderSkeleton = () => (
    <Layout style={[styles.newsPostContainer]}>
      <Layout style={styles.header}>
        <Layout style={styles.departmentInfo}>
          <Text style={[styles.postDate, { color: theme['color-basic-500'] }]}>Loading...</Text>
        </Layout>
      </Layout>
      <Layout style={{ height: 200 }}>
        <Layout style={{ backgroundColor: theme['color-basic-500'], height: 200 }} />
      </Layout>
      <Text style={[styles.title]}>Loading...</Text>
      <Text style={[styles.subtitle]}>Loading...</Text>
    </Layout>
  );

  //If loading is false, and there are no newsPosts, show a message
    if (!loading && newsPosts.length === 0) {
        return (
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{i18n.t('noPosts')}</Text>
        </Layout>
        );
    }

return (
    <FlatList
      data={sortedNewsPosts}
      renderItem={loading ? renderSkeleton : renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

const styles = StyleService.create({
  newsPostContainer: {
    flex: 1,
    borderRadius: 15,

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  departmentLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  departmentInfo: {
    marginLeft: 10,
  },
  departmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  featuredContainer: {
    borderRadius: 15,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 'auto',
  },
  featuredText: {
    fontWeight: 'bold',
  },
  postDate: {
    fontSize: 12,
  },
  postImage: {
    width: screenWidth,
    height: 220, // Increased height from 200 to 220
    resizeMode: 'stretch',
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 10,
    marginTop: 25,
  },
  subtitle: {
    fontSize: 14,
    paddingHorizontal: 10,
    marginTop: 3,
  },
});