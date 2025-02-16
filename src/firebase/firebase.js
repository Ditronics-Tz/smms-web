import { initializeApp } from "firebase/app";
import { toast } from "react-toastify";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);


let messaging = null; // Prevent calling getMessaging if unsupported
isSupported().then((supported) => {
  if (supported) {
    messaging = getMessaging(firebaseApp);
  } else {
    console.warn("Firebase Messaging is not supported in this browser.");
    // toast.warn("Push Notification is not supported in this browser.")
  }
});


// Get FCM Token
export const requestForToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // const registration = await navigator.serviceWorker.ready; // ✅ Ensure Service Worker is Ready
      const token = await getToken(getMessaging(), {
        vapidKey: process.env.REACT_APP_VAPID_KEY,
        // serviceWorkerRegistration: registration, // ✅ Use SW here
      })
      if (token) {
        // Send the token to your server and update the UI if necessary
        console.log("FCM Token:", token);
        localStorage.setItem("fcm_token", token)
        return token;
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
      }

    }
  } catch (error) {
    console.error("Error getting FCM token", error);
  }
};

// Listen for messages in foreground
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Foreground message received: ", payload);
      resolve(payload);
    });
  });

export default firebaseApp;