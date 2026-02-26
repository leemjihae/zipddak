// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyD3XHWSo-j1SaGmDn5sRBHv1AnUewapIVU",
  authDomain: "kosta-2025-764a0.firebaseapp.com",
  projectId: "kosta-2025-764a0",
  storageBucket: "kosta-2025-764a0.firebasestorage.app",
  messagingSenderId: "416280136815",
  appId: "1:416280136815:web:48a43aa9e4e34fc517519a",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // 알림 허용할 때만 보냄
  if (
    !(
      (self.Notification && self.Notification.permission === "granted") ||
      (self.Notification && self.Notification.permission === "default")
    )
  )
    return;

  console.log("Background Message", payload);
});
