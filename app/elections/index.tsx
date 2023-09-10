import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Text, Layout, Card, Button } from '@ui-kitten/components';
import { useAuthentication } from '../../hooks/useAuthentication';
import { ElectionProps } from '../../types';
import { getElections } from '../../hooks/electionHooks';
import { useRouter } from 'expo-router';
import { getVoterKey } from '../../hooks/electionHooks';
import ElectionModal from '../../components/JoinElectionModal';



interface ElectionsScreenProps {
  elections: ElectionProps[];
}

export default function ElectionsScreen() {

  const [elections, setElections] = useState<ElectionProps[]>([]);
  const [electionModalVisible, setElectionModalVisible] = useState(false);

  const { user } = useAuthentication();

  const router = useRouter();

  useEffect(() => {
    if (user) {
      getElections(user.uid).then((elections) => {
        setElections(elections || []);
      });
    }
  }, [user]);



  const renderItem = ({ item }: { item: ElectionProps }) => (
    <Card style={styles.card} status='basic' onPress={() => router.push('/elections/' + item.id)}>
      <Text category='h5'>{item.title}</Text>
      {/* If you need more details or actions for each election, add them here */}
    </Card>
  );

  return (
    <Layout style={styles.container}>
      <Text category='h1' style={styles.header}>Participated Elections</Text>
      <FlatList
        data={elections}
        renderItem={renderItem}
        keyExtractor={item => item.title}
        style={styles.list}
      />
      {/* Add a button or more components below if needed. */}
      <Button style={styles.button} onPress={() => setElectionModalVisible(true)}>Join Election</Button>
      <ElectionModal
        visible={electionModalVisible}
        setVisible={setElectionModalVisible}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  header: {
    marginVertical: 16,
  },
  list: {
    width: '100%',
  },
  card: {
    marginVertical: 8,
  },
  button: {
    marginTop: 16,
  },
});