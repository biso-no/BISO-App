import React, { useState, useEffect } from 'react';
import { FlatList, View, RefreshControl  } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme, Layout, Spinner, Text, StyleService, Divider } from '@ui-kitten/components';
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
const [isRefreshing, setIsRefreshing] = useState(false);
  
  const router = useRouter();


  useEffect(() => {
    if (user) {
      setUid(user.uid);
    }
  }, [user]);

  useEffect(() => {
    loadExpenses(); // Load initial expenses
  }, []);

  const loadExpenses = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      getExpenses(uid, limit, expenses[expenses.length - 1])
        .then((newExpenses) => {
          setExpenses((prevExpenses) => [...prevExpenses, ...newExpenses]);
  
          // if newExpenses length is less than limit, it's likely there are no more items
          if (newExpenses.length < limit) {
            setHasMore(false);
          }
          resolve();
        })
        .catch((error) => {
          console.error("Error loading expenses:", error);
          reject(error);
        })
        .finally(() => {
          setIsLoadingMore(false);
        });
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

const onRefresh = () => {
  setIsRefreshing(true);
  // Reset expenses state
  setExpenses([]);
  loadExpenses().finally(() => setIsRefreshing(false));
};

const theme = useTheme();

const renderItem = ({ item }: { item: Expense }) => (
  <View>
    <ReimbursementListItem
      item={item}
      onPress={() => router.push({ pathname: '/expenses/', params: { item: item } })}
      isApproved={item.isApproved}
    />
    <Divider />
  </View>
);

const renderFooter = () => {
  if (!isLoadingMore) return null;
  return <Spinner size='small' />;
};

const renderEmptyState = () => {
  if (expenses.length === 0 && !isLoadingMore) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="wallet" size={48} color={theme['color-basic-500']} />
        <Text style={styles.emptyText}>No expenses found</Text>
      </View>
    );
  }
  return null;
};

return (
  <Layout style={[styles.container, { backgroundColor: theme['color-basic-1000'] }]} level="1">
    <Text style={styles.title}>Expenses</Text>
    <FlatList
      data={expenses}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={expenses.length === 0 ? styles.emptyListContainer : styles.listContainer}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmptyState}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      }
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
emptyListContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 8,
},
emptyContainer: {
  alignItems: 'center',
  padding: 20,
},
emptyText: {
  fontSize: 16,
  marginTop: 10,
  color: 'text-basic-color',
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
  color: 'text-basic-color',
},
});