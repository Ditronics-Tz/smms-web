import { initializeApp } from "firebase/app";
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

const isNonEmpty = (value) => value !== undefined && value !== null && value !== "";

const coreKeys = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
];

const coreEnvVars = {
  apiKey: "REACT_APP_FIREBASE_API_KEY",
  authDomain: "REACT_APP_FIREBASE_AUTH_DOMAIN",
  projectId: "REACT_APP_FIREBASE_PROJECT_ID",
  storageBucket: "REACT_APP_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "REACT_APP_FIREBASE_MESSAGING_SENDER_ID",
  appId: "REACT_APP_FIREBASE_APP_ID",
};

const missingCoreKeys = coreKeys.filter((key) => !isNonEmpty(firebaseConfig[key]));
const hasVapidKey = isNonEmpty(process.env.REACT_APP_VAPID_KEY);
const isFirebaseEnabled = missingCoreKeys.length === 0 && hasVapidKey;

let firebaseApp = null;
let messaging = null;
let messagingInit = Promise.resolve();
let warned = false;

const warnOnce = (message) => {
  if (!warned) {
    warned = true;
    console.warn(message);
  }
};

if (isFirebaseEnabled) {
  if (!isNonEmpty(firebaseConfig.measurementId)) {
    console.warn("[firebase] REACT_APP_FIREBASE_MEASUREMENT_ID is not set. Google Analytics will be skipped.");
  }
  try {
    firebaseApp = initializeApp(firebaseConfig);
    messagingInit = isSupported().then((supported) => {
      if (supported) {
        try {
          messaging = getMessaging(firebaseApp);
        } catch (error) {
          messaging = null;
          console.warn("[firebase] Failed to initialize Messaging:", error);
        }
      } else {
        console.warn("[firebase] Firebase Messaging is not supported in this browser.");
      }
    });
  } catch (error) {
    console.warn("[firebase] Failed to initialize Firebase:", error);
  }
} else {
  const missing = missingCoreKeys.map((key) => coreEnvVars[key]);
  if (!hasVapidKey) {
    missing.push("REACT_APP_VAPID_KEY");
  }
  warnOnce(
    "[firebase] Push notifications disabled (missing " + missing.join(", ") +
    "). Configuring these vars enables web push; the app otherwise runs without Firebase."
  );
}

// Get FCM Token
export const requestForToken = async () => {
  if (!isFirebaseEnabled) {
    warnOnce("[firebase] Push notifications are disabled; skipping token request.");
    return null;
  }
  await messagingInit;
  if (!messaging) {
    warnOnce("[firebase] Messaging unavailable; skipping token request.");
    return null;
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_VAPID_KEY,
      })
      if (token) {
        // Send the token to your server and update the UI if necessary
        console.log("FCM Token:", token);
        localStorage.setItem("fcm_token", token)
        return token;
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
      }

    }
  } catch (error) {
    console.error("Error getting FCM token", error);
  }
  return null;
};

// Listen for messages in foreground
export const onMessageListener = () =>
  new Promise(async (resolve) => {
    await messagingInit;
    if (!isFirebaseEnabled || !messaging) {
      warnOnce("[firebase] Messaging unavailable; foreground message listener disabled.");
      resolve(undefined);
      return;
    }
    onMessage(messaging, (payload) => {
      console.log("Foreground message received: ", payload);
      resolve(payload);
    });
  });

export { isFirebaseEnabled };

export default firebaseApp;