importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js");


const firebaseConfig = {
  apiKey:"AIzaSyCDH2Qxx7-u4t6Fi43bbzurb9HIJIz_GHo",
  authDomain: "smms-project-304ac.firebaseapp.com",
  projectId: "smms-project-304ac",
  storageBucket: "smms-project-304ac.firebasestorage.app",
  messagingSenderId: "379792149949",
  appId: "1:379792149949:web:f259160593a38b266dd6d4",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Create a BroadcastChannel to communicate with the main window
const channel = new BroadcastChannel("notification-channel");

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);

   // Send the background message to the main window via the BroadcastChannel
  channel.postMessage(payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/android-chrome-192x192.png",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
