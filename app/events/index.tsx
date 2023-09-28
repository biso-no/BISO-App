import React, { useState, useEffect } from 'react';
import { ScrollView, Linking } from 'react-native';
import {
  Layout,
  Text,
  Card,
  Avatar,
  Button,
  List,
} from '@ui-kitten/components';
import { getEvents } from '../../hooks/getEvents';
import { WebView } from 'react-native-webview';
import { useTheme } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isEqual } from 'lodash';

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
  const theme = useTheme();
  const [campuses, setCampuses] = useState<string[]>([]);
  const [prevCampuses, setPrevCampuses] = useState<string[]>([]);

  //Get campus from AsyncStorage
  const getCampuses = async () => {
    try {
      const campuses = await AsyncStorage.getItem('campus');
      if (campuses) {
        setCampuses(JSON.parse(campuses));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCampuses();
  })

//Get the events. The data is returned as an object. In the object there is an array of events. Each items has a venue.venue containing a string. Render all events with the venue == campus
useEffect(() => {
  if (!isEqual(campuses, prevCampuses)) {
    getEvents(campuses).then((data) => {
      setEvents(data);
      setPrevCampuses(campuses);
    });
  }
}, [campuses]);


  const renderItemHeader = (headerProps: any, info: { item: Event }) => (
    <Layout {...headerProps} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Avatar
          style={{ marginRight: 16, width: 40, height: 40, borderRadius: 40 }}
          source={{ uri: 'https://via.placeholder.com/150' }}
        />
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
      style={{ marginVertical: 10, borderRadius: 10, overflow: 'hidden', elevation: 2 }}
      header={headerProps => renderItemHeader(headerProps, info)}
      footer={footerProps => renderItemFooter(footerProps, info)}
    >
      <Layout style={{ padding: 16 }}>
        <WebView
          style={{ height: 200, borderRadius: 10, overflow: 'hidden', backgroundColor: theme['background-basic-color-1'] }}
          source={{
            html: `
              <html>
                <head>
                  <style>
                    /* Set the text color to white */
                    body {
                      color: ${theme['text-basic-color']};
                    }
                  </style>
                </head>
                <body>
                  ${info.item.description}
                </body>
              </html>
            `,
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={false}
        />
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
