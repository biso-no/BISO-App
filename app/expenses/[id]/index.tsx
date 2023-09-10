import React, { useState, useEffect } from 'react';
import { Layout, Text, Divider, Button, Spinner, Modal, Card, List, ListItem, Avatar, StyleService } from '@ui-kitten/components';
import { fetchExpense } from '../../../hooks/getExpenses';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthentication, useUserProfile } from '../../../hooks';
import { Image } from 'expo-image';

interface Attachment {
  id?: string;
  description: string;
  amount: string;
  date: string;
  file: string;
}

interface Expense {
  id: string;
  docid?: string;
  invoiceNo?: string;
  address: string;
  attachments: Attachment[];
  bankAccountNumber: string;
  campus: string;
  city: string;
  date: Date;
  department: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  outstanding: number;
  zip: string;
  prepayment: boolean;
  prepaymentAmount?: string;
  purpose: string;
  totalAmount: number;
  uid: string;
  isApproved: boolean;
  lastDocument?: string;
}

const ExpenseDetailsScreen = () => {
  const { id } = useLocalSearchParams()
  const { user } = useAuthentication();
  const uid = user?.uid;
  const [expense, setExpense] = useState<Expense | null>(null);
  const [attachmentImage, setAttachmentImage] = useState<string | null>(null);
  const [attachmentImageModalVisible, setAttachmentImageModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (uid && id) {
      fetchExpense(uid, id).then((fetchedExpense) => {
        setExpense(fetchedExpense as Expense);
      });
    }
  }, [uid, id]);



  const toggleAttachmentImageModal = () => {
    setAttachmentImageModalVisible(!attachmentImageModalVisible);
  };

  const AttachmentImageModal = () => (
    <Modal
      visible={attachmentImageModalVisible}
      backdropStyle={styles.backdrop}
      onBackdropPress={toggleAttachmentImageModal}
    >
      <Card disabled={true}>
        <Image
          style={{ width: 300, height: 500 }}
          source={attachmentImage}
        />
      </Card>
    </Modal>
  );

  return (
    <Layout style={{ flex: 1, padding: 16 }}>
      <Card>
        <Text category="h6">Expense ID: {id as string}</Text>

        <Divider style={{ marginVertical: 16 }} />

        <Text category="s1">Purpose:</Text>
        <Text>{expense?.purpose}</Text>
        <Divider style={{ marginVertical: 16 }} />
        <Text category="s1">Campus:</Text>
        <Text>{expense?.campus}</Text>
        <Divider style={{ marginVertical: 5 }} />
        <Text category="s1">Department:</Text>
        <Text>{expense?.department}</Text>
        <Divider style={{ marginVertical: 16 }} />
        <Text category="s1">Attachments:</Text>
        <List
          style={{ maxHeight: 300 }}
          data={expense?.attachments}
          renderItem={({ item }) => (
            <ListItem
              title={item.attachmentDescription}
              description={item.amount}
              accessoryLeft={() => <Avatar source={{ uri: item.image }} />}
              onPress={() => {
                setAttachmentImage(item.image);
                toggleAttachmentImageModal();
              }}
            />
          )}
        />
        <AttachmentImageModal />
        <Divider style={{ marginVertical: 16 }} />  

      </Card>
    </Layout>
  );
}

const styles = StyleService.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});


export default ExpenseDetailsScreen;