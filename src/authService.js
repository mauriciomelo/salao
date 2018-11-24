import googleApi from './googleApi';

const isSignedIn = async () => {
  const gapi = await googleApi.getSession();
  return gapi.auth2.getAuthInstance().isSignedIn.get();
};
const listen = async cb => {
  const gapi = await googleApi.getSession();
  gapi.auth2.getAuthInstance().isSignedIn.listen(cb);
};

const signIn = async () => {
  const gapi = await googleApi.getSession();
  gapi.auth2.getAuthInstance().signIn();
};

const signOut = async () => {
  const gapi = await googleApi.getSession();
  gapi.auth2.getAuthInstance().signOut();
};

export default {
  isSignedIn,
  listen,
  signIn,
  signOut
};
