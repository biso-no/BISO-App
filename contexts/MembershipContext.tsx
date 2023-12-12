import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useUserProfile } from '../hooks';
import { useAuthentication } from '../hooks';

interface MembershipContextProviderProps {
    children?: React.ReactNode;
}

interface MembershipContextType {
    membershipIsValid: string | null;
    membershipExpiry: string | null;
    studentId: string;
    isLoading: boolean;
}

const MembershipContext = createContext<MembershipContextType>({
    membershipIsValid: null,
    membershipExpiry: null,
    studentId: '',
    isLoading: true,
});

interface MembershipStatusProps {
    membershipStatus?: string;
    membershipExpiry?: string;
    studentId: string;
}

const MembershipProvider = ({ children }: MembershipContextProviderProps) => {
    const [membershipData, setMembershipData] = useState<MembershipStatusProps>({
        membershipStatus: '',
        membershipExpiry: '',
        studentId: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const { profile } = useUserProfile();
    const { user } = useAuthentication();

    const verifyMembership = async (studentId: string) => {
        console.log("Called verifyMembership with studentId: ", studentId)
        try {
        const response = await axios.post('https://api.web.biso.no/api/verify-membership', {
            studentId,
        });
        const { data } = response;
        console.log("data", data)
        //Stringify the data and store it in the secure store
        const membershipDataString = JSON.stringify(data);
        await SecureStore.setItemAsync('membershipData', membershipDataString);
        setMembershipData(data);
        console.log("membershipData after set:", membershipData)
        setIsLoading(false);
        } catch (error) {
        console.log("Error while verifying membership: ", error);
        }
    }

    useEffect(() => {
        const init = async () => {
            const storedMembershipData = await SecureStore.getItemAsync('membershipData');
            const storedMembership = storedMembershipData ? JSON.parse(storedMembershipData) : null;
    
            if (profile && user) {
                const { studentId } = profile;
    
                // Compare stored studentId with the current profile's studentId
                if (studentId && (!storedMembership || studentId !== storedMembership.studentId)) {
                    await verifyMembership(studentId); // pass studentId from profile
                } else {
                    // If they match, set the membership data from the stored value
                    setMembershipData(storedMembership || {});
                    setIsLoading(false);
                }
            }
        };
    
        init();
    }, [profile, user]); // Add profile and user as dependencies
    
    useEffect(() => {
        console.log("Updated membershipData: ", membershipData);
    }, [membershipData]);

    return (
        <MembershipContext.Provider value={{
            membershipIsValid: membershipData.membershipStatus || null,
            membershipExpiry: membershipData.membershipExpiry || null,
            studentId: membershipData.studentId || '',
            isLoading,
        }}>
            {children}
        </MembershipContext.Provider>
    )
}

const useMembership = () => useContext(MembershipContext);

export { MembershipProvider, useMembership };