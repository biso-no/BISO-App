import { Card, Text, Layout } from "@ui-kitten/components";
import { FlatList, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { getPost } from "../hooks/posts";


export function Post({ postId }: { postId: string }) {
  const [post, setPost] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const getPostAsync = async () => {
      const post = await getPost(postId);
      setPost(post);
    };
    getPostAsync();
  }, [postId]);

  if (isLoading) {
    return (
      <Layout style={styles.container}>
        <Card style={styles.card}>
          <View style={styles.skeletonHeader} />
          <View style={styles.skeletonBody} />
        </Card>
      </Layout>
    );
  }

  return (
    <Layout style={styles.container}>
      <Card style={styles.card}>
        <Text category="h6">{post.title}</Text>
        <Text>{post.body}</Text>
      </Card>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    margin: 10,
    padding: 10,
  },
  skeletonHeader: {
    height: 20,
    backgroundColor: "#e1e1e1",
    marginBottom: 10,
    width: "70%",
  },
  skeletonBody: {
    height: 60,
    backgroundColor: "#e1e1e1",
    width: "100%",
  },
});