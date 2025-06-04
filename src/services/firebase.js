import firestore from '@react-native-firebase/firestore';

const ARTICLE_COLLECTION = 'Article';

export const createArticleFirebase = async (data) => {
  const articlesRef = firestore().collection(ARTICLE_COLLECTION);
  await articlesRef.add({
    ...data,
    totalLikes: data.totalLikes || 0,
    totalShares: data.totalShares || 0,
    isBookmarked: false,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

export const getAllArticlesFirebase = async () => {
  const snapshot = await firestore()
    .collection(ARTICLE_COLLECTION)
    .orderBy('createdAt', 'desc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getArticleByIdFirebase = async (id) => {
  const doc = await firestore().collection(ARTICLE_COLLECTION).doc(id).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

export const updateArticleFirebase = async (id, data) => {
  await firestore().collection(ARTICLE_COLLECTION).doc(id).update({
    ...data,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
};

export const deleteArticleFirebase = async (id) => {
  await firestore().collection(ARTICLE_COLLECTION).doc(id).delete();
};

export const getBookmarkedArticlesFirebase = async () => {
  const snapshot = await firestore()
    .collection(ARTICLE_COLLECTION)
    .where('isBookmarked', '==', true)
    .orderBy('createdAt', 'desc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};