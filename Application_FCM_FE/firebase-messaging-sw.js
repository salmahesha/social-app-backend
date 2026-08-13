importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBZi0DJ97nmG9mzjJ4-LjJOmOxPmM96_bw",
  authDomain: "social-media-app-160e0.firebaseapp.com",
  projectId: "social-media-app-160e0",
  storageBucket: "social-media-app-160e0.firebasestorage.app",
  messagingSenderId: "804505954746",
  appId: "1:804505954746:web:229b18c159269cff139583",
  measurementId: "G-86CML3J0D2"
});

const messaging = firebase.messaging();

// ✅ Background Notifications
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message:", payload);

  self.registration.showNotification(
    payload.data?.title || "New Notification",
    {
      body: payload.data?.body || "You have a message",
      icon: "/firebase-logo.png"
    }
  );
});