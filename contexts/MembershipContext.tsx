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
    membershipIsValid?: string;
    membershipExpiry?: string;
    studentId: string;
}

const MembershipProvider = ({ children }: MembershipContextProviderProps) => {
    const [membershipData, setMembershipData] = useState<MembershipStatusProps>({
        membershipIsValid: '',
        membershipExpiry: '',
        studentId: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const { profile, loading: profileLoading } = useUserProfile();
    const { user } = useAuthentication();

    const verifyMembership = async (studentId: string) => {
        console.log("Called verifyMembership with studentId: ", studentId);
        try {
            const response = await axios.post('https://api.web.biso.no/api/verify-membership', {
                studentId,
            });
            const { data } = response;
            console.log("data", data);
    
            // Check if the data contains studentId, if not, use the parameter studentId
            const membershipInfo = {
                ...data,
                studentId: data.studentId || studentId
            };
    
            // Stringify the data and store it in the secure store
            const membershipDataString = JSON.stringify(membershipInfo);
            await SecureStore.setItemAsync('membershipData', membershipDataString);
    
            // Update the state with the new membership information
            setMembershipData(membershipInfo);
            console.log("membershipData after set:", membershipData);
    
            setIsLoading(false);
        } catch (error) {
            console.log("Error while verifying membership: ", error);
        }
    }
    

    useEffect(() => {
        const init = async () => {
            const storedMembershipData = await SecureStore.getItemAsync('membershipData');
            const storedMembership = storedMembershipData ? JSON.parse(storedMembershipData) : null;
    
            if (profile && profile.studentId) {
                // Compare stored studentId with the current profile's studentId
                if (!storedMembership || profile.studentId !== storedMembership.studentId) {
                    await verifyMembership(profile.studentId);
                } else if (storedMembership) {
                    // Use stored membership data if available
                    setMembershipData(storedMembership);
                }
            } else if (storedMembership) {
                // If user is offline or signed out, use the stored membership data
                setMembershipData(storedMembership);
            } else {
                // Set default or empty state when no data is available
                setMembershipData({ membershipIsValid: '', membershipExpiry: '', studentId: '' });
            }

            // Set isLoading to false when both user profile and membership data are loaded
            setIsLoading(profileLoading);
        };
    
        init();
    }, [profile, profileLoading, user]);
    
    useEffect(() => {
        console.log("Updated membershipData: ", membershipData);
    }, [membershipData]);

    return (
        <MembershipContext.Provider value={{
            membershipIsValid: membershipData.membershipIsValid ? 'true' : 'false',
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