const firebaseConfig = {
  apiKey: "AIzaSyBZi0DJ97nmG9mzjJ4-LjJOmOxPmM96_bw",
  authDomain: "social-media-app-160e0.firebaseapp.com",
  projectId: "social-media-app-160e0",
  storageBucket: "social-media-app-160e0.firebasestorage.app",
  messagingSenderId: "804505954746",
  appId: "1:804505954746:web:229b18c159269cff139583",
  measurementId: "G-86CML3J0D2"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

export { messaging };