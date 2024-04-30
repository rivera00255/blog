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
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { fileInfo } from 'suneditor/src/lib/core';
import { db, storage } from '~/lib/firebase';
import { Comments, Posts } from '~/type';

const addPost = async (post: Posts) => {
  try {
    const docRef = await addDoc(collection(db, 'post'), post);
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

const getPost = async ({ page, keyword }: { page?: number; keyword?: string[] }) => {
  if (!page) page = 1;
  const perPage = 2;
  let list: Partial<Posts>[] = [];
  const postRef = collection(db, 'post');
  const q = query(postRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  if (!keyword) {
    querySnapshot.forEach((doc) => {
      list.push({ ...doc.data(), id: doc.id });
    });
  } else {
    querySnapshot.forEach((doc) => {
      keyword.some((word) => doc.data().title.includes(word)) && list.push({ ...doc.data(), id: doc.id });
    });
  }
  const totalElements = list.length;
  const totalPages = Math.ceil(totalElements / perPage);
  if (page <= 1) {
    if (totalElements <= perPage) list;
    list = list.slice(0, page * perPage);
  } else {
    list = list.slice((page - 1) * perPage, page * perPage);
  }
  return { posts: list, totalElements, totalPages };
};

// const getPosts = async ({ page }: { page?: number }) => {
//   if (!page) page = 1;
//   const perPage = 10;
//   let list: Partial<Posts>[] = [];
//   const postRef = collection(db, 'post');
//   const q = query(postRef, orderBy('createdAt', 'desc'));
//   const querySnapshot = await getDocs(q);
//   const totalElements = querySnapshot.size;
//   const totalPages = Math.ceil(totalElements / perPage);
//   querySnapshot.forEach((doc) => {
//     list.push({ ...doc.data(), id: doc.id });
//   });
//   if (page <= 1) {
//     if (totalElements <= perPage) list;
//     list = list.slice(0, page * perPage);
//   } else {
//     list = list.slice((page - 1) * perPage, page * perPage);
//   }
//   return { posts: list, totalElements, totalPages };
// };

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
  let list: Partial<Posts>[] = [];
  const postRef = collection(db, 'post');
  const q = query(postRef, where('user.uid', '==', userId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push({ ...doc.data(), id: doc.id });
  });
  return list;
};

const saveImage = async ({ image, userId }: { image: { file: File; name: string }; userId: string }) => {
  const imageRef = ref(storage, `${userId}/${image.name}`);
  const response = await uploadBytes(imageRef, image.file);
  const url = await getDownloadURL(response.ref);
  return url;
};

const deleteImage = async ({ image, userId }: { image: fileInfo; userId: string }) => {
  try {
    const desertRef = ref(storage, `${userId}/${image.name}`);
    await deleteObject(desertRef);
    console.log('delete complete.');
  } catch (e) {
    console.log(e);
  }
};

const addComment = async (comment: Comments) => {
  try {
    const docRef = await addDoc(collection(db, 'comment'), comment);
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

const getComment = async ({ postId, page }: { postId: string; page?: number }) => {
  if (!page) page = 1;
  const perPage = 2;
  let list: Partial<Comments>[] = [];
  const commentRef = collection(db, 'comment');
  const q = query(commentRef, where('postId', '==', postId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push({ ...doc.data(), id: doc.id });
  });
  const totalElements = list.length;
  const totalPages = Math.ceil(totalElements / perPage);
  if (page <= 1) {
    if (totalElements <= perPage) list;
    list = list.slice(0, page * perPage);
  } else {
    list = list.slice((page - 1) * perPage, page * perPage);
  }
  return { comments: list, totalElements, totalPages };
};

const updateComment = async ({ id, userId, text }: { id: string; userId: string; text: string }) => {
  const commentRef = doc(db, 'comment', id);
  const docSnapshot = await getDoc(commentRef);
  if (docSnapshot.exists()) {
    const prev = { ...docSnapshot.data(), id } as Comments;
    const date = new Date();
    if (prev.user.uid !== userId) return;
    await updateDoc(commentRef, {
      text,
      updatedAt: date,
    });
  } else {
    console.log('No such comment!');
  }
  return;
};

const deleteComment = async ({ id, userId }: { id: string; userId: string }) => {
  const commentRef = doc(db, 'comment', id);
  const docSnapshot = await getDoc(commentRef);
  if (docSnapshot.exists()) {
    const post = { ...docSnapshot.data(), id } as Posts;
    if (post.user.uid !== userId) return;
    await deleteDoc(commentRef);
  }
  return;
};

export {
  addPost,
  getPost,
  getPostById,
  updatePost,
  deletePost,
  saveImage,
  deleteImage,
  addComment,
  getComment,
  updateComment,
  deleteComment,
};
