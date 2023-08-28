import React, { useState, useEffect } from 'react';
import { FlatList, View, RefreshControl  } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme, Layout, Spinner, Text, StyleService, Divider } from '@ui-kitten/components';
import ReimbursementListItem from '../../components/ReimbursementListItem';
import FAB from '../../components/FAB';
import { Expense } from '../../types';
import { useAuthentication } from '../../hooks/useAuthentication';
import { getExpenses } from '../../hooks/getExpenses';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import ExpenseStatusCard from '../../components/ExpenseStatusCard';
import Loading from '../../components/Loading';

export default function Expenses() {
  const { user } = useAuthentication();
  const uid = user?.uid;
  const [limit, setLimit] = useState(5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastDoc, setLastDoc] = useState<null | any>(null);
  const [drafts, setDrafts] = useState<Expense[]>([]);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Submitted' | 'Drafts'>('All'); // Initialize filterStatus to 'All'
  const [loading, setLoading] = useState(false);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);

  const theme = useTheme();
  const router = useRouter();


  useEffect(() => {
    console.log("UseEffect triggered for page:", page);
    loadExpenses();
}, [page]);

useEffect(() => {
  setFilteredExpenses(expenses);
}, [expenses]);


const loadExpenses = async () => {
  setLoading(true);

  try {
    console.log("Loading expenses for page:", page);

    if (!uid) return;

    const fetchedData = await getExpenses(uid, limit, lastDoc);

    const newExpenses = fetchedData.expenses;

    if (newExpenses.length < limit) {
      setHasMore(false); // If less than the limit, assume no more data
    }

    setExpenses((prevExpenses) => {
      const updatedExpenses = [...prevExpenses, ...newExpenses];
      return updatedExpenses;
    });

    setLastDoc(fetchedData.lastDocument); // Set the last document
  } catch (error) {
    console.error("Error fetching expenses:", error);
  } finally {
    setIsLoadingMore(false);
    setIsRefreshing(false);
    setLoading(false);
  }
};

useEffect(() => {
  // Update filteredExpenses based on the filterStatus
  if (filterStatus === 'Submitted') {
    setFilteredExpenses(expenses.filter(item => item.isApproved));
  } else if (filterStatus === 'Drafts') {
    setFilteredExpenses(drafts);
  } else {
    setFilteredExpenses(expenses);
  }
}, [filterStatus, expenses, drafts]);

const onRefresh = () => {
  setIsRefreshing(true);
  setPage(1);
  setHasMore(true);
  setLastDoc(null); // Reset the lastDoc state
  setExpenses([]);
  loadExpenses().finally(() => setIsRefreshing(false));
};




const handleLoadMore = () => {
  if (hasMore) {
    setIsLoadingMore(true);
    setPage((prevPage) => prevPage + 1);
  }
};




const getDrafts = async () => {
  const drafts = await SecureStore.getItemAsync('expenseDetails');
  console.log('Drafts:' + drafts)
  if (drafts) {
    setDrafts(JSON.parse(drafts));
  }
};

useEffect(() => {
  getDrafts();
}, []);

const handleGetDrafts = () => {
  setFilteredExpenses(drafts);
};


//Onpress will send the user to /expenses/[id]. Id is invoice id.
const renderItem = ({ item }: { item: Expense }) => (
  <View>
    <ReimbursementListItem
      item={item}
      key={item.invoiceNo}
      onPress={() => router.push({ pathname: '/expenses/', params: { id: item.invoiceNo } })}
      isApproved={item.isApproved}
    />
    <Divider />
  </View>
);

const renderFooter = () => {
  if (!isLoadingMore) return null;
  return (
    <Layout style={styles.loadingFooter}>
      <Spinner size='small' />
      <Text style={styles.loadingFooterText}>Loading more...</Text>
    </Layout>
  );
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

const renderLoadMoreButton = () => {
  if (hasMore && !isLoadingMore) {
    return (
      <Layout style={styles.loadMoreButtonContainer}>
        <Text onPress={handleLoadMore} style={styles.loadMoreButtonText}>Load More</Text>
      </Layout>
    );
  }
  return null;
};


if (loading) {
  return <Loading />;
}



return (
  <Layout style={[styles.container]} level="1">
    <Layout style={styles.cardsContainer}>
      <ExpenseStatusCard
        title="Submitted"
        count={expenses.filter(item => item.isApproved).length}
        status="submitted"
        onPress={() => setFilterStatus('Submitted')}
        style={styles.cardStyle}
      />
      <ExpenseStatusCard
        title="Draft"
        count={drafts.length}
        status="draft"
        onPress={() => setFilterStatus('Drafts')}
        style={styles.cardStyle}
      />
    </Layout>
  <FlatList
    data={filteredExpenses}
    renderItem={renderItem}
    keyExtractor={(item) => item.date.toString()}
    contentContainerStyle={filteredExpenses.length === 0 ? styles.emptyListContainer : styles.listContainer}
    onEndReached={handleLoadMore}
    onEndReachedThreshold={0.1}
    ListEmptyComponent={renderEmptyState}
    refreshControl={
      <RefreshControl
        refreshing={isRefreshing}
        onRefresh={onRefresh}
      />
    }
    ListFooterComponent={() => (
      <>
        {renderFooter()}
        {renderLoadMoreButton()}
      </>
    )}
  />
  <FAB
    icon={<Ionicons name="add" size={24} color={theme['color-basic-100']} />}
    onPress={() => router.push('expenses/create')}
    style={[styles.fab, { elevation: 5, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 2 } }]}
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
cardStyle: {
  width: '50%', // Give 30% width to each card, the rest 10% is for margins
  margin: '1%', // Adjust this margin according to your preference
},
cardsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: 'transparent', // Set this to transparent so the cards take the background color of the container
  marginBottom: 20,
  alignItems: 'center', // this will ensure the cards are vertically centered in the container
},
loadMoreButtonContainer: {
  alignItems: 'center',
  padding: 16,
},
loadMoreButtonText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: 'text-basic-color',
},
});