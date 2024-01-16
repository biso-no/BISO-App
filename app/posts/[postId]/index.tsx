import { Post } from "../../../components/Post";
import { useLocalSearchParams } from "expo-router";
import { Layout } from "@ui-kitten/components";
import React from "react";

export default function PostPage() {
  const { postId } = useLocalSearchParams();

  if (!postId) {
    return null;
  }

  return (
    <Layout style={{ flex: 1 }}>
      <Post postId={postId[0]} />
    </Layout>
  );
}