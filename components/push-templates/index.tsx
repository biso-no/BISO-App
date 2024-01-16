import React from 'react';
import { View, Text, Image } from 'react-native';

const PostTemplate = ({ data }) => (
  <View>
    <Text>{data.title}</Text>
    <Image source={{ uri: data.imageUrl }} />
    <Text>{data.description}</Text>
  </View>
);

const MessageTemplate = ({ data }) => (
  <View>
    <Text>From: {data.sender}</Text>
    <Text>{data.message}</Text>
  </View>
);
