import React, { useState, useEffect } from 'react';
import { Layout, Text, Divider, Button, Spinner, Modal, Card, List, ListItem, Avatar, StyleService } from '@ui-kitten/components';
import { fetchExpense } from '../../../hooks/getExpenses';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthentication, useUserProfile } from '../../../hooks';
import { Image } from 'expo-image';

interface Membership {
  userId: string;
  membershipId: string;
  lasts_until: string;
}

const fetchMembership = async (uid: string, id: string) => {
  //Return a dummy membership for now
  return {
    userId: uid,
    membershipId: id,
    lasts_until: "2021-12-31"
  } as Membership;
}

const MembershipStatusScreen = () => {
  const { id } = useLocalSearchParams()
  const { user } = useAuthentication();
  const uid = user?.uid;
  const [membership, setMemberShip] = useState<Membership | null>(null);
  const { profile } = useUserProfile();

  useEffect(() => {
    if (uid && id) {
      const idStr = Array.isArray(id) ? id[0] : id;
      fetchMembership(uid, idStr).then((membership) => {
        setMemberShip(membership);
      });
    }
  }, [uid, id]);



  return (
    <Layout style={{ flex: 1, padding: 16 }}>
      <Card>
        <Text category='h5'>Membership Status</Text>
        <Divider />
        <Text category='h6'>Student ID</Text>
        <Text>{profile?.studentId}</Text>
        <Divider />
        <Text category='h6'>Lasts Until</Text>
        <Text>{membership?.lasts_until}</Text>
        <Divider />
      </Card>
    </Layout>
  );
}

const styles = StyleService.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default MembershipStatusScreen;