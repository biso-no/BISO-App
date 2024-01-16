import { db } from '../config/firebase';
import { query, getDocs, collection, collectionGroup, where, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

//Get all posts from posts collection.
export const getPosts = async () => {
    const posts: any[] = [];
    const q = query(collection(db, 'posts'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        posts.push(doc.data());
    });
    return posts;
}

//Get a specific post by id.
export const getPost = async (postId: string) => {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    return postDoc.data();
}