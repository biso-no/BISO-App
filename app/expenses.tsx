import React, { useState, useEffect } from 'react';
import { FlatList, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme, Layout, Spinner, Text, StyleService } from '@ui-kitten/components';
import ReimbursementListItem from '../components/ReimbursementListItem';
import FAB from '../components/FAB';
import { Expense } from '../types';
import { useAuthentication } from '../hooks/useAuthentication';
import { getExpenses } from '../hooks/getExpenses';
import { useRouter } from 'expo-router';

export default function Expenses() {
  const { user } = useAuthentication();
  const [uid, setUid] = useState<string>('');
  const [limit, setLimit] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [page, setPage] = useState(1); // initialize page to 1
const [hasMore, setHasMore] = useState(true); // indicates if there are more items to fetch

  
  const router = useRouter();


  useEffect(() => {
    if (user) {
      setUid(user.uid);
    }
  }, [user]);

  useEffect(() => {
    loadExpenses(); // Load initial expenses
  }, []);

  const loadExpenses = () => {
    getExpenses(uid, limit, expenses[expenses.length - 1])
      .then((newExpenses) => {
        setExpenses((prevExpenses) => [...prevExpenses, ...newExpenses]);

        // if newExpenses length is less than limit, it's likely there are no more items
        if (newExpenses.length < limit) {
          setHasMore(false);
        }
      })
      .finally(() => {
        setIsLoadingMore(false);
      });
};

  const handleLoadMore = () => {
    // only load more if there are more items and it's not currently loading
    if (hasMore && !isLoadingMore) {
      setPage(page + 1);  // increment the page
      setIsLoadingMore(true);
      loadExpenses();
    }
};

  const theme = useTheme();

  const renderItem = ({ item }: { item: Expense }) => (
    <ReimbursementListItem
      item={item}
      onPress={() => router.push({ pathname: '/expenses/', params: { item: item } })}
      isApproved={item.isApproved}
    />
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return <Spinner size='small' />;
  };

  return (
    <Layout style={styles.container}>
      <FlatList
        data={expenses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />
      <FAB
        icon={<Ionicons name="add" size={24} color={theme['color-basic-100']} />}
        onPress={() => router.push('createExpense')}
        style={styles.fab}
      />
    </Layout>
  );
}

const styles = StyleService.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
  },
  listContainer: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  loadingFooter: {
    alignSelf: 'center',
    marginVertical: 10,
    paddingVertical: 10,
  },
  loadingFooterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});
