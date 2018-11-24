import $script from 'scriptjs';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const API_KEY = process.env.REACT_APP_API_KEY;
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
const DISCOVERY_DOCS = [
  'https://sheets.googleapis.com/$discovery/rest?version=v4'
];

const session = new Promise(resolve => {
  $script('https://apis.google.com/js/api.js', () => {
    window.gapi.load('client:auth2', () => resolve(window.gapi));
  });
});

const getSession = async () => {
    const gapi = await session;
    await gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      });
      return gapi;
};

export default {
  getSession
};
