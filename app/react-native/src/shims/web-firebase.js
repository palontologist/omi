const onAuthStateChanged = (cb) => {
  // No persistence on web shim; report signed-out immediately.
  cb(null);
  return () => {};
};
const app = () => ({
  options: {},
  name: 'web-shim',
});
const auth = () => ({
  onAuthStateChanged,
  signInWithCredential: async () => ({ user: { uid: 'web', getIdToken: async () => 'web-token' } }),
  signOut: async () => {},
  currentUser: null,
});
export const firebase = { app, auth };
export const initializeApp = app;
export const getAuth = auth;
export const getApp = app;
export default firebase;
