import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useUserProfile } from '../hooks';
import { useAuthentication } from '../hooks';

interface MembershipContextProviderProps {
    children?: React.ReactNode;
}

interface MembershipContextType {
    membershipStatus: string | null;
    membershipExpiry: string | null;
    verifyMembership: () => void;
    isLoading: boolean;
}

const MembershipContext = createContext<MembershipContextType>({
    membershipStatus: null,
    membershipExpiry: null,
    verifyMembership: () => { },
    isLoading: true,
});

const MembershipProvider = ({ children }: MembershipContextProviderProps) => {
    const [membershipStatus, setMembershipStatus] = useState<string | null>(null);
    const [membershipExpiry, setMembershipExpiry] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { profile, loading } = useUserProfile();
    const { user } = useAuthentication();

    console.log("Student ID: " + profile?.studentId)
    const studentId = profile?.studentId;

    useEffect(() => {
        setIsLoading(loading);
        const fetchStoredMembership = async () => {
            const storedStatus = await SecureStore.getItemAsync('membershipStatus');
            const storedExpiry = await SecureStore.getItemAsync('membershipExpiry');
            setMembershipStatus(storedStatus);
            setMembershipExpiry(storedExpiry);
        };
    
        if (!loading && user && studentId) {
            verifyMembership();
        } else {
            // Fetch membership from secure store when no user is present
            fetchStoredMembership();
        }
        setIsLoading(false);
    }, [loading, user, studentId]);
    

    const verifyMembership = async () => {
        // Fetch studentId from secure store
        const storedStudentId = await SecureStore.getItemAsync('studentId');
    
        // If the user is not a member or the membership is expired, or the studentId does not match, then make a request to the server
        if (membershipStatus !== 'valid' || (membershipExpiry && new Date(membershipExpiry) < new Date()) || (storedStudentId !== studentId)) {
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
        <MembershipContext.Provider value={{ membershipStatus, membershipExpiry, verifyMembership, isLoading }}>
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

