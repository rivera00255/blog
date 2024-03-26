import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
  updateDoc,
  where,
} from 'firebase/firestore';
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

const getPost = async ({ page }: { page?: number }) => {
  if (!page) page = 1;
  const perPage = 2;
  let list: Partial<Posts>[] = [];
  const postRef = collection(db, 'post');
  const q = query(postRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  const totalElements = querySnapshot.size;
  const totalPages = Math.ceil(totalElements / perPage);
  querySnapshot.forEach((doc) => {
    list.push({ ...doc.data(), id: doc.id });
  });
  if (page <= 1) {
    if (totalElements <= perPage) list;
    list = list.slice(0, page * perPage);
  } else {
    list = list.slice((page - 1) * perPage, page * perPage);
  }

  return { posts: list, totalElements, totalPages };
};

const getPostById = async (id: string) => {
  // let post: Partial<Posts> = {};
  // const postRef = collection(db, 'post');
  // const querySnapshot = await getDocs(postRef);
  // querySnapshot.forEach((doc) => {
  //   if (doc.id === id) return (post = { ...doc.data(), id: doc.id });
  // });
  // return post;
  const postRef = doc(db, 'post', id);
  const docSnapshot = await getDoc(postRef);
  if (docSnapshot.exists()) {
    return { ...docSnapshot.data(), id } as Posts;
  } else {
    console.log('No such document!');
    return;
  }
};

const updatePost = async ({
  post,
  userId,
}: {
  post: { title: string; content: string; id: string };
  userId: string;
}) => {
  const id = String(post.id);
  const postRef = doc(db, 'post', id);
  const docSnapshot = await getDoc(postRef);
  if (docSnapshot.exists()) {
    const prev = { ...docSnapshot.data(), id } as Posts;
    if (prev.user.uid !== userId) return;
    await updateDoc(postRef, {
      title: post.title,
      content: post.content,
    });
  } else {
    console.log('No such document!');
  }
  return;
};

const deletePost = async ({ id, userId }: { id: string; userId: string }) => {
  const postRef = doc(db, 'post', id);
  const docSnapshot = await getDoc(postRef);
  if (docSnapshot.exists()) {
    const post = { ...docSnapshot.data(), id } as Posts;
    if (post.user.uid !== userId) return;
    await deleteDoc(postRef);
  }
  return;
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

export { addPost, getPost, getPostById, updatePost, deletePost };
