import React, { useState, useEffect } from 'react';
import { ScrollView, Linking } from 'react-native';
import {
  Layout,
  Text,
  Card,
  Avatar,
  Button,
  IconRegistry,
  ApplicationProvider,
  List,
  ListItem,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import { getEvents } from '../hooks/getEvents';

type Event = {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  url: string;
  venue: {
    venue: string;
    id: number;
  };
  organizer: {
    organizer: string;
  }[];
};

export default function EventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getEvents();
      setEvents(result.events || []);
    };
    fetchData();
  }, []);

  const renderItemHeader = (headerProps: any, info: { item: Event }) => (
    <Layout {...headerProps}>
      <Text category='h6'>{info.item.title}</Text>
    </Layout>
  );

  const renderItemFooter = (footerProps: any, info: { item: Event }) => (
    <Layout {...footerProps} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text category='s1'>{info.item.venue.venue}</Text>
      <Button size='tiny' onPress={() => Linking.openURL(info.item.url)}>Learn More</Button>
    </Layout>
  );

  const renderEventItem = (info: { item: Event }) => (
    <Card
      style={{ marginVertical: 8 }}
      header={headerProps => renderItemHeader(headerProps, info)}
      footer={footerProps => renderItemFooter(footerProps, info)}>
      <Layout style={{ flexDirection: 'row' }}>
        <Avatar style={{ margin: 8 }} shape='square' source={{ uri: 'https://via.placeholder.com/150' }} />
        <Text style={{ flex: 1 }} category='p1'>
          {info.item.description}
        </Text>
      </Layout>
    </Card>
  );

  return (
          <Layout style={{ flex: 1, padding: 16 }}>
            <ScrollView style={{ backgroundColor: 'transparent' }}>
            <List
            style={{ flex: 1, backgroundColor: 'transparent' }}
              data={events}
              renderItem={renderEventItem}
            />
            </ScrollView>
          </Layout>
  );
}
