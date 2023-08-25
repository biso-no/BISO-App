// Purpose: Displays the details of a specific expense
//The following details abouut the expense are highlighted:
// 1. Date
// 2. Invoice No
// 3. Event name (if any)
// 4. Purpose
// 5. Amount
// 6. Status
// 7. Receipts (Must find a good way to display this in case of multiple receipts)
//UI kitten components used:
// 1. Layout
// 2. Text
// 3. Divider
// 4. Icon
// 5. Button
// 6. Spinner
// 8. Card
// 9. List
// 10. ListItem
// 11. Avatar

import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import { useTheme, Layout, Text, Divider, Icon, Button, Spinner, Modal, Card, List, ListItem, Avatar, StyleService } from '@ui-kitten/components';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthentication } from '../../../hooks';
//import { getExpense } from '../../../hooks/getExpenses';
import { Expense } from '../../../types';

const getExpense = (uid: string, id: string): Promise<Expense> => {
    //Dummy data
    return new Promise((resolve, reject) => {
        resolve({
            id: '1',
            date: new Date(),
            invoiceNo: 'INV-001',
            address: 'Address 1',
            bankAccountNumber: '1234567890',
            campus: 'Campus 1',
            city: 'City 1',
            department: 'Department 1',
            email: 'markus@biso.no',
            firstName: 'Markus',
            lastName: 'Biso',
            phone: '12345678',
            prepayment: false,
            totalAmount: 1000,
            uid: '1',
            zip: '1234',
            prepaymentAmount: '500',
            purpose: 'Event 1',
            outstanding: 1000,
            isApproved: false,
            attachments: [
                {
                    description: 'Receipt 1',
                    file: 'https://www.google.com',
                    amount: '500',
                    date: '2021-05-01'
                },
                {
                    description: 'Receipt 2',
                    file: 'https://www.google.com',
                    amount: '500',
                    date: '2021-05-01'
                },
            ],
        });
    });
}



//Path: app\expenses\[id]\index.tsx
export default function ExpenseDetails() {
    const theme = useTheme();
    const router = useRouter();
    const { user } = useAuthentication();
    const { id } = useLocalSearchParams();
    
    const [expense, setExpense] = useState<Expense | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false);  

    useEffect(() => {
        if (user && id) {
            getExpense(user.uid, id as string)
                .then((expense) => {
                    setExpense(expense);
                })
                .catch((error) => {
                    console.error("Error loading expense:", error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }
    , [user, id]);

    const handleOpenReceipt = (url: string) => {
        Linking.openURL(url);
    }

    const renderItemAccessory = (props: any) => (
        <Button size='tiny' onPress={() => handleOpenReceipt(props.url)}>
            Open
        </Button>
    );
        
    const renderItemIcon = (props: any) => (
        <Icon {...props} name='attach-outline'/>
    );

    const renderItem = ({ item, index }: any) => (
        <ListItem
            title={`${item.name}`}
            accessoryLeft={renderItemIcon}
            accessoryRight={() => renderItemAccessory(item)}
        />
    );

    const renderFooter = () => {
        if (!loading) return null;
        return <Spinner size='small' />;
    }

    return (
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {isLoading ? (
                <Spinner />
            ) : (
                <ScrollView>
                    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text category='h6'>Date</Text>
                            <Text>{expense?.campus}</Text>
                        </Layout>
                        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text category='h6'>Invoice No</Text>
                            <Text>{expense?.invoiceNo}</Text>
                        </Layout>
                        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text category='h6'>Purpose</Text>
                            <Text>{expense?.purpose}</Text>
                        </Layout>
                        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text category='h6'>Amount</Text>
                            <Text>{expense?.outstanding}</Text>
                        </Layout>
                        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text category='h6'>Status</Text>
                            <Text>{expense?.isApproved ? 'Approved' : 'Pending'}</Text>
                        </Layout>
                        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text category='h6'>Receipts</Text>
                            <List
                                style={{ width: '100%' }}
                                data={expense?.attachments}
                                renderItem={renderItem}
                                ListFooterComponent={renderFooter}
                            />
                        </Layout>
                    </Layout>
                </ScrollView>
            )}
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
    },
});

