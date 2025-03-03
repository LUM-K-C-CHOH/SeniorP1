/**
 * Firebase Config
 * RTHA
 * 
 * Created by Thornton on 02/26/2025
 */
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAcAq56XhA07yPjqJH8PW9ocyQ7dJ1frTw',
  authDomain: 'rtha-f845f.firebaseapp.com',
  databaseURL: 'https://rtha-f845f.firebaseio.com',
  projectId: 'rtha-f845f',
  storageBucket: 'rtha-f845f.appspot.com',
  messagingSenderId: '167408245325',
  appId: '1:167408245325:android:453a2790ad878ba2cf5a04'
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
