const app = () => ({
  options: {},
  name: 'web-shim',
});
const auth = () => ({
  onAuthStateChanged: () => () => {},
  signInWithCredential: async () => ({ user: { uid: 'web' } }),
  signOut: async () => {},
});
export const firebase = { app, auth };
export const initializeApp = app;
export const getAuth = auth;
export const getApp = app;
export default firebase;
