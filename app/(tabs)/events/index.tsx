import { Layout } from '@ui-kitten/components';
import React, {useRef, useCallback, useMemo, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Linking} from 'react-native';
import {ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar} from 'react-native-calendars';
import { getEvents, Event } from '../../../hooks/getEvents';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@ui-kitten/components';



type SectionsType = {
  [key: string]: { title: string; details: string, url: string }[];
};

const transformEventsToSection = (events: Event[]): { title: string; data: { title: string; details: string, url: string }[] }[] => {
  const sections: SectionsType = {};
  events.forEach(event => {
    const eventDate = event.start_date.split('T')[0]; // Assuming the date is in ISO format
    if (!sections[eventDate]) {
      sections[eventDate] = [];
    }
    sections[eventDate].push({ title: event.title, details: event.description, url: event.url });
  });
  return Object.keys(sections).map(date => ({ title: date, data: sections[date] }));
};

export default function ExpandableCalendarScreen() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [campus, setCampus] = React.useState<string>('');

  const theme = useTheme();

  useEffect(() => {
    const getCampus = async () => {
      const campus = await AsyncStorage.getItem('campus');
      setCampus(campus || '');
    }
    getCampus();
  }
  , []);

  useEffect(() => {
    const getEventsAsync = async () => {
      const events = await getEvents(campus) as Event[];
      setEvents(events);
    }
    getEventsAsync();
  }
  , [campus]);

  const renderEmptyAgenda = () => {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>No Events</Text>
      </View>
    );
  }
  
  // Mark dates that have events
  const markedDates = useMemo(() => {
    const marked: { [key: string]: { marked: boolean } } = {};
    events.forEach(event => {
      const eventDate = event.start_date.split('T')[0]; // Assuming the date is in ISO format
      marked[eventDate] = { marked: true };
    });
    return marked;
  }
  , [events]);

  const ITEMS = useMemo(() => transformEventsToSection(events), [events]);

const currentDate = new Date();


  return (
    <CalendarProvider
    //Current date
      date={currentDate.toISOString().split('T')[0]}
      onDateChanged={() => {}}
      onMonthChange={() => {}}
      showTodayButton
      disabledOpacity={0.6}
      style={{backgroundColor: theme['background-basic-color-3']}}
    >
        <ExpandableCalendar
          firstDay={1}
          markedDates={markedDates}
          hideArrows
          theme={{

            backgroundColor: theme['background-basic-color-3'],
            calendarBackground: theme['background-basic-color-3'],
            textSectionTitleColor: theme['text-basic-color'],
            selectedDayBackgroundColor: theme['color-primary-default'],
            selectedDayTextColor: theme['text-basic-color'],
            todayTextColor: theme['color-primary-default'],
            dayTextColor: theme['text-basic-color'],
            textDisabledColor: theme['text-hint-color'],
            dotColor: theme['color-primary-default'],
            selectedDotColor: theme['text-basic-color'],
            monthTextColor: theme['text-basic-color'],
          }}

        />
        {events.length > 0 ? (
           <AgendaList
        sections={ITEMS}
        extraData={ITEMS}
        markToday
        style={{ borderRadius: 10, backgroundColor: theme['background-basic-color-1']}}
        sectionStyle={{ borderRadius: 10, backgroundColor: theme['background-basic-color-1']}}
        theme={{
          backgroundColor: theme['background-basic-color-1'],
          monthTextColor: theme['text-basic-color'],
          agendaDayNumColor: theme['text-basic-color'],
          agendaDayTextColor: theme['text-basic-color'],
          contentStyle: {backgroundColor: theme['background-basic-color-1']},
          
        }}
        scrollToNextEvent
        renderItem={({ item, section }: { item: { title: string; details: string, url: string }; section: any }) => {
          console.log("Item", item);
          return (
            <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
              <View style={styles.item}>
                <Text style={[styles.itemHourText, { color: theme['text-basic-color'] }]}>{item.title}</Text>
                <Text lineBreakMode='clip' style={styles.itemDurationText}>{item.details}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
        ) : (
          renderEmptyAgenda()
        )}
    </CalendarProvider>
  );
}


const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20
  },
  container: {
    flex: 1,
    backgroundColor: 'gray'
  },
  event: {
    backgroundColor: 'grey'
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    flexDirection: 'column'
  },
  itemHourText: {
    color: 'black'
  },
  itemDurationText: {
    color: 'grey',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4
  },
  expandableCalendar: {
    
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey'
  },
  emptyItemText: {
    color: 'lightgrey',
    fontSize: 14
  }
});