import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';


const firebaseConfig = {
  databaseURL: `https://${process.env.REACT_APP_PROJECTID}.firebaseio.com`,
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APP_ID,
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const auth = firebaseApp.auth();
const db = firebaseApp.firestore();
firebase.firestore().settings({ experimentalForceLongPolling: true });

const storage = firebase.storage();

useEffect(() => {
  const unloadCallback = () => {firebase.app().delete()}
  window.addEventListener("beforeunload", unloadCallback);
  return async () => {
    window.removeEventListener("beforeunload", unloadCallback);
  }
}, [])

export {auth, db, storage};