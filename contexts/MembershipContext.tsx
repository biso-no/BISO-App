import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useUserProfile } from '../hooks';

interface MembershipContextProviderProps {
    children?: React.ReactNode;
}

interface MembershipContextType {
    membershipStatus: string | null;
    membershipExpiry: string | null;
    verifyMembership: () => void;
}

const MembershipContext = createContext<MembershipContextType>({
    membershipStatus: null,
    membershipExpiry: null,
    verifyMembership: () => { }
});

const MembershipProvider = ({ children }: MembershipContextProviderProps) => {
    const [membershipStatus, setMembershipStatus] = useState<string | null>(null);
    const [membershipExpiry, setMembershipExpiry] = useState<string | null>(null);

    const { profile, loading } = useUserProfile();
    console.log("Student ID: " + profile?.studentId)
    const studentId = profile?.studentId;

    useEffect(() => {
        // Load the membership status and expiry from the secure store
        SecureStore.getItemAsync('membershipStatus')
            .then(status => setMembershipStatus(status))
            .catch(error => console.error('Failed to load membership status:', error));
        SecureStore.getItemAsync('membershipExpiry')
            .then(expiry => setMembershipExpiry(expiry))
            .catch(error => console.error('Failed to load membership expiry:', error));

            if (!loading) {
        // Verify membership on initial render
        verifyMembership();
            }
    }, [loading]);

    const verifyMembership = async () => {
        // If the user is not a member or the membership is expired, then make a request to the server
        if (membershipStatus !== 'valid' || (membershipExpiry && new Date(membershipExpiry) < new Date())) {
            const body = { "studentId": studentId };
    
            try {
                const response = await axios.post('https://api.web.biso.no/api/verify-membership', body);
        
                if (response.data.membershipIsValid) {
                    await SecureStore.setItemAsync('membershipStatus', 'valid');
                    await SecureStore.setItemAsync('membershipExpiry', response.data.membershipExpiry);
                    setMembershipStatus('valid');
                    setMembershipExpiry(response.data.membershipExpiry);
                } else {
                    await SecureStore.deleteItemAsync('membershipStatus');
                    await SecureStore.deleteItemAsync('membershipExpiry');
                    setMembershipStatus(null);
                    setMembershipExpiry(null);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <MembershipContext.Provider value={{ membershipStatus, membershipExpiry, verifyMembership }}>
            {children}
        </MembershipContext.Provider>
    );
};

function useMembership() {
    const context = useContext(MembershipContext);

    if (!context) {
        throw new Error('useMembership must be used within a MembershipProvider');
    }

    return context;
}

export { MembershipContext, MembershipProvider, useMembership };
