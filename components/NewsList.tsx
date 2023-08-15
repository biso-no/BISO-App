import React from 'react';
import {Image, FlatList, Dimensions } from 'react-native';
import { NewsPost, NewsListProps } from '../types';
import { Layout, Text, useTheme, StyleService } from '@ui-kitten/components';


const screenWidth = Dimensions.get('window').width;

const NewsList: React.FC<NewsListProps> = ({ newsPosts }) => {
  const theme = useTheme();

  // Sort the newsPosts array to display featured posts first
  const sortedNewsPosts = newsPosts.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) {
      return -1;
    } else if (!a.isFeatured && b.isFeatured) {
      return 1;
    } else {
      return 0;
    }
  });

  const renderItem = ({ item }: { item: NewsPost }) => (
    <Layout style={[styles.newsPostContainer, { backgroundColor: theme['color-basic-800'] }]}>
      <Layout style={styles.header}>
        <Image source={{ uri: item.departmentLogo }} style={styles.departmentLogo} />
        <Layout style={styles.departmentInfo}>
          <Text style={[styles.departmentTitle, { color: theme['color-basic-100'] }]}>{item.department}</Text>
          <Text style={styles.postDate}>{item.date}</Text>
        </Layout>
        {item.isFeatured && (
          <Layout style={[styles.featuredContainer, { backgroundColor: theme['color-primary-500'] }]}>
            <Text style={styles.featuredText}>Featured</Text>
          </Layout>
        )}
      </Layout>
      <Layout style={{ height: 200 }}>
      <Image source={{ uri: item.image }} style={styles.postImage} />
      </Layout>
      <Text style={[styles.title, { color: theme['color-basic-100'] }]}>{item.title}</Text>
      <Text style={[styles.subtitle, { color: theme['color-basic-100'] }]}>{item.subtitle}</Text>
    </Layout>
  );

return (
    <FlatList
      data={sortedNewsPosts}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

const styles = StyleService.create({
  newsPostContainer: {
    marginBottom: 15,
    paddingTop: 10,
    paddingBottom: 10,
    width: screenWidth,
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
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  postDate: {
    fontSize: 12,
    color: 'gray',
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



export default NewsList;
