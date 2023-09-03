import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import { useTheme, Layout, Text, Divider, Button, Spinner, Modal, Card, List, ListItem, Avatar, StyleService } from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthentication } from '../../../hooks';
//import { getExpense } from '../../../hooks/getExpenses';
import { Expense } from '../../../types';
import { getExpense } from '../../../hooks/getExpenses';


//Path: app\expenses\[id]\index.tsx
export default function ExpenseDetails() {
    const theme = useTheme();
    const router = useRouter();
    const { user } = useAuthentication();
    const { id } = useLocalSearchParams();
    const [expense, setExpense] = useState<Expense | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (!id && !user) {
        //If id is array, then id[0] is the id
        getExpense(user?.uid, id[0]).then((expense) => {
            setExpense(expense);
            setLoading(false);
        }
        );
        }
    }, [id, user]);


    if (loading) {
        



    
    return (
        <Layout style={styles.container}>
          <ScrollView>
            <Card style={styles.card}>
              <View style={styles.header}>
                <Avatar
                  source={{ uri: 'https://example.com/user-avatar.jpg' }} // Use the actual avatar URL
                  size="giant"
                  style={styles.avatar}
                />
                <Text category="h6" style={styles.name}>
                  {`${expense.firstName} ${expense.lastName}`}
                </Text>
              </View>
              <Text category="s1" style={styles.subtitle}>
                {expense.purpose}
              </Text>
              <Text category="s2" style={styles.subtext}>
                {expense.date.toLocaleDateString()}
              </Text>
              <View style={styles.separator} />
              <Text category="s2" style={styles.subtext}>
                {expense.department}
              </Text>
              <Text category="s2" style={styles.subtext}>
                {expense.campus}
              </Text>
              <Text category="s2" style={styles.subtext}>
                {expense.city}, {expense.zip}
              </Text>
              <Text category="s2" style={styles.subtext}>
                {expense.address}
              </Text>
              <Text category="s2" style={styles.subtext}>
                {expense.phone}
              </Text>
              <Text category="s2" style={styles.subtext}>
                {expense.email}
              </Text>
              <View style={styles.separator} />
              <Text category="s2" style={styles.subtext}>
                Bank Account: {expense.bankAccountNumber}
              </Text>
              <View style={styles.separator} />
              <View style={styles.attachmentContainer}>
                <Text category="s2" style={styles.attachmentTitle}>
                  Attachments:
                </Text>
                {expense.attachments.map((attachment, index) => (
                  <View key={index} style={styles.attachmentItem}>
                    <Ionicons name="attach" size={16} style={styles.attachmentIcon} />
                    <Text category="s2" style={styles.attachmentText}>
                      {attachment.description}
                    </Text>
                    <Button appearance="ghost" status="primary" size="tiny">
                      View
                    </Button>
                  </View>
                ))}
              </View>
              <View style={styles.separator} />
              <Text category="s1" style={styles.totalAmount}>
                Total Amount: ${expense.totalAmount.toFixed(2)}
              </Text>
              <View style={styles.separator} />
              <Text category="s1" style={styles.outstanding}>
                Outstanding: ${expense.outstanding.toFixed(2)}
              </Text>
              <View style={styles.separator} />
              <Text category="s2" style={styles.status}>
                Status: {expense.isApproved ? 'Approved' : 'Pending'}
              </Text>
            </Card>
          </ScrollView>
        </Layout>
      );
    };
    
    const styles = StyleService.create({
      container: {
        flex: 1,
      },
      card: {
        margin: 16,
        padding: 16,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
      },
      avatar: {
        marginRight: 16,
      },
      name: {
        fontWeight: 'bold',
      },
      subtitle: {
        marginBottom: 8,
      },
      subtext: {
        marginBottom: 4,
      },
      separator: {
        height: 1,
        backgroundColor: '#E5E5E5',
        marginVertical: 8,
      },
      attachmentContainer: {
        marginBottom: 8,
      },
      attachmentTitle: {
        fontWeight: 'bold',
        marginBottom: 4,
      },
      attachmentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
      },
      attachmentIcon: {
        width: 16,
        height: 16,
        marginRight: 4,
      },
      attachmentText: {
        flex: 1,
      },
      totalAmount: {
        fontWeight: 'bold',
        marginBottom: 4,
      },
      outstanding: {
        fontWeight: 'bold',
        marginBottom: 4,
      },
      status: {
        marginBottom: 4,
      },
    });
    