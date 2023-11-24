import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

interface MembershipContextProviderProps {
    children?: React.ReactNode;
}

interface MembershipContextType {
    membershipStatus: string | null;
    verifyMembership: () => void;
}

const MembershipContext = createContext<MembershipContextType>({
    membershipStatus: null,
    verifyMembership: () => { }
});
const MembershipProvider = ({ children }: MembershipContextProviderProps) => {
    const [membershipStatus, setMembershipStatus] = useState<string | null>(null);

    useEffect(() => {
        // Load the membership status from the secure store when the app starts
        SecureStore.getItemAsync('membershipStatus')
            .then(status => setMembershipStatus(status))
            .catch(error => {
                console.error('Failed to load membership status from secure store:', error);
                setMembershipStatus(null); // Explicitly set to null if there's an error
            });
    }, []);

    const verifyMembership = async () => {
        try {
            const response = await axios.get('https://dummyapi.com/verifyMembership', {
                params: {
                    // your parameters here
                }
            });
    
            if (response.data.membershipIsValid) {
                await SecureStore.setItemAsync('membershipStatus', 'valid');
                setMembershipStatus('valid');
            } else {
                await SecureStore.deleteItemAsync('membershipStatus');
                setMembershipStatus(null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <MembershipContext.Provider value={{ membershipStatus, verifyMembership }}>
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