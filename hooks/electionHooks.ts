import { db } from '../config/firebase';
import { ElectionProps } from '../types';
import { query, getDocs, collection, collectionGroup, where, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

const getElections = async (uid: string) => {
    const elections: ElectionProps[] = [];

    // 1. Query all voter entries for this user across all elections
    const q = query(collectionGroup(db, 'voters'), where('userRef', '==', `${uid}`));
    console.log(`Constructed userRef: users/${uid}`);

    try {
    const voterSnapshot = await getDocs(q);
    console.log(voterSnapshot.size);

    // 2. For each voter entry, fetch the actual election
    for (const voterDoc of voterSnapshot.docs) {
        const parentCollection = voterDoc.ref.parent; // This should point to the 'voters' collection
        const electionRef = parentCollection ? parentCollection.parent : null; // This should point to the specific 'election' document

        if (electionRef) {
            const electionDocSnapshot = await getDoc(electionRef);

            if (electionDocSnapshot.exists()) {
                elections.push(electionDocSnapshot.data() as ElectionProps);
            }
        }
    }
    console.log(elections);
    return elections;
    } catch (error) {
        console.log(error);
    }
}

const getCurrentElection = async (electionCode: string) => {
    const electionRef = collection(db, 'elections');
    const q = query(electionRef, where('code', '==', electionCode));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs[0].data() as ElectionProps;
}

const getActivePositions = async (electionId: string) => {
    const positions: any[] = [];
    const q = query(collectionGroup(db, `positions`), where('status', '==', 'true'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        positions.push(doc.data());
    }, []);
    return positions;
}

const getCandidatesForPosition = async (positionId: string) => {
    const candidates: any[] = [];
    const q = query(collectionGroup(db, `candidates`), where('positionId', '==', positionId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        candidates.push(doc.data());
    });
    return candidates;
}
    



const castVote = async (electionId: string, positionId: string, candidateId: string, voterKey: string) => {
    const votesRef = doc(db, `elections/${electionId}/positions/${positionId}/candidates/${candidateId}/votes/${voterKey}`);
    await setDoc(votesRef, { voterKey });
}

const getVoterKey = async (electionId: string, email: string) => {
    const voterRef = doc(db, `elections/${electionId}/voters/${email}`);
    const voterDoc = await getDoc(voterRef);
    if (!voterDoc.exists()) {
        return null;
    }
    return voterDoc.data().voterKey
}


export { getElections, getCurrentElection, getActivePositions, castVote, getVoterKey, getCandidatesForPosition };