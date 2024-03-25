import { addDoc, collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { db } from '~/lib/firebase';
import { Posts } from '~/type';

const addPost = async (post: Posts) => {
  try {
    const docRef = await addDoc(collection(db, 'post'), post);
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

const getPost = async () => {
  let list: { [key: string]: any }[] = [];
  const postRef = collection(db, 'post');
  const q = query(postRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push({ ...doc.data(), id: doc.id });
  });
  return list;
};

const getPostByuserId = async (userId: string) => {
  let list: { [key: string]: any }[] = [];
  const postRef = collection(db, 'post');
  const q = query(postRef, where('user.uid', '==', userId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push({ ...doc.data(), id: doc.id });
  });
  return list;
};

export { addPost, getPost, getPostByuserId };
