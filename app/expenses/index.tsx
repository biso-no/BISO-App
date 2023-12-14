import React, { useState, useEffect } from 'react';
import { FlatList, View, RefreshControl  } from 'react-native';
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
import i18n from '../../constants/localization';
import { useLanguage } from '../../contexts/LanguageContext';
import { Plus, Wallet } from 'lucide-react-native';

export default function Expenses() {
  const { user, loading: authLoading } = useAuthentication();
  const uid = user?.uid;
  const [limit, setLimit] = useState(5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastDoc, setLastDoc] = useState<null | any>(null);

  const [loading, setLoading] = useState(false);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);

  const theme = useTheme();
  const router = useRouter();
  const { language } = useLanguage();
  i18n.locale = language;


  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      await loadExpenses();
      setLoading(false);
      setInitialLoad(false);
    };
  
    if (initialLoad || page === 1) {
      fetchExpenses();
    }
  }, [page, initialLoad]);

  useEffect(() => {
    setFilteredExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    if (page > 1) {
      loadExpenses();
    }
  }, [page]);

  
  const loadExpenses = async () => {
    if (!uid) {
      console.error("UID is undefined");
      return;
    }
  
    try {
      console.log("Loading expenses for page:", page);
  
      const { expenses: newExpenses, lastDocument } = await getExpenses(uid, limit, lastDoc);
  
      setExpenses((prevExpenses) => {
        const combinedExpenses = [...prevExpenses, ...newExpenses];
        const uniqueExpenses = Array.from(new Set(combinedExpenses.map(expense => expense.invoiceNo)))
          .map(invoiceNo => combinedExpenses.find(expense => expense.invoiceNo === invoiceNo))
          .filter((expense): expense is Expense => expense !== undefined);
        return uniqueExpenses;
      });
  
      if (newExpenses.length < limit) {
        setHasMore(false);
      }
  
      setLastDoc(lastDocument);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };


const onRefresh = async () => {
  setLoading(true);
  setIsRefreshing(true);
  setPage(1);
  setLastDoc(null);
  setHasMore(true);
  setExpenses([]);
  await loadExpenses(); // Await the async function
  setIsRefreshing(false);
  setLoading(false);
};

if (authLoading) {
  return <Spinner />; // or your preferred loading component
}

if (!user) {
  router.push('/noaccess');
  return null;
}




const handleLoadMore = () => {
  if (hasMore) {
    setIsLoadingMore(true);
    setPage((prevPage) => prevPage + 1);
  }
};


//Onpress will send the user to /expenses/[id]. Id is invoice id.
const renderItem = ({ item }: { item: Expense }) => (
  <View>
    {item.invoiceNo && ( // Check if invoiceNo is defined
      <ReimbursementListItem
        item={item}
        key={item.invoiceNo}
        onPress={() => router.push('/expenses/' + item.invoiceNo)}
        isApproved={item.isApproved}
      />
    )}
    <Divider />
  </View>
);


const renderFooter = () => {
  if (!isLoadingMore) return null;
  return (
    <Layout style={styles.loadingFooter}>
      <Spinner size='small' />
      <Text style={styles.loadingFooterText}>{i18n.t('loading_more_expenses')}</Text>
    </Layout>
  );
};

const renderEmptyState = () => {
  if (expenses.length === 0 && !isLoadingMore) {
    return (
      <View style={styles.emptyContainer}>
        <Wallet size={48} color={theme['color-basic-500']} />
        <Text style={[styles.emptyText, { color: theme['color-basic-500'] }]}>{i18n.t('no_expenses_found')}</Text>
      </View>
    );
  } else if (expenses.length > 0) {
    // Render the list here
    return (
      <FlatList
        data={expenses}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
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


if (loading && expenses.length === 0) {
  return <Loading />;
}



return (
  <Layout style={[styles.container, { backgroundColor: theme['background-basic-color-3'] }]} level='1'>
    <Layout style={styles.cardsContainer}>
      <ExpenseStatusCard
        title={i18n.t('submitted')}
        count={expenses.length}
        status="submitted"
        style={styles.cardStyle}
      />
    </Layout>
    <View style={{ backgroundColor: theme['background-basic-color-1'], flex: 1, borderRadius: 16 }}>
    <FlatList
  data={filteredExpenses}
  renderItem={renderItem}
  keyExtractor={(item) => item.invoiceNo ? item.invoiceNo.toString() : 'default'}
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
    icon={<Plus size={24} color={theme['color-basic-100']} />}
    onPress={() => router.push('expenses/create')}
    style={[styles.fab, { elevation: 5, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 2 } }]}
  />
  </View>
</Layout>
);
}

const styles = StyleService.create({
container: {
  flex: 1,
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