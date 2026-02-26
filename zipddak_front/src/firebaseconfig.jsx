import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyD3XHWSo-j1SaGmDn5sRBHv1AnUewapIVU",
    authDomain: "kosta-2025-764a0.firebaseapp.com",
    projectId: "kosta-2025-764a0",
    storageBucket: "kosta-2025-764a0.firebasestorage.app",
    messagingSenderId: "416280136815",
    appId: "1:416280136815:web:48a43aa9e4e34fc517519a",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseMessaging = firebaseApp.messaging();

export function firebaseReqPermission(setFcmToken, setAlarm) {
    firebaseMessaging
        .requestPermission()
        .then(() => {
            return firebaseMessaging.getToken({
                vapidKey: "BIXPbBivcNvbXX7mnZUXcYE9NCszDfX7AGsXggFbJEIqSmwjnJwCuxLBaPFkvHf0m9h6HW2brlWMHShng0yV5HU",
            });
        })
        .then((token) => {
            console.log(token);
            setFcmToken(token);
        });

    firebaseMessaging.onMessage((payload) => {
        const data = payload.data;
        console.log(data);

        if (data.eventType === "NOTIFICATION") {
            setAlarm(convertFcmToAlarm(data));
        }

        if (data.eventType === "MESSAGE") {
            console.log("메시지 도착");
        }
    });
}

function convertFcmToAlarm(fcm) {
    return {
        notificationIdx: fcm.notificationIdx ? Number(fcm.notificationIdx) : null,
        type: fcm.notificationType,

        title: fcm.title,
        content: fcm.content,

        recvUsername: fcm.recvUsername ?? null,
        sendUsername: fcm.sendUsername ?? null,

        requestIdx: fcm.requestIdx ? Number(fcm.requestIdx) : null,
        estimateIdx: fcm.estimateIdx ? Number(fcm.estimateIdx) : null,
        rentalIdx: fcm.rentalIdx ? Number(fcm.rentalIdx) : null,
        communityIdx: fcm.communityIdx ? Number(fcm.communityIdx) : null,
        reviewIdx: fcm.reviewIdx ? Number(fcm.reviewIdx) : null,
        reviewType: fcm.reviewType ?? null,

        confirm: false,
        createDate: fcm.createdAt ?? new Date().toISOString(),
    };
}

// 서비스 워커 등록: background 설정
export async function registerServiceWorker() {
    try {
        const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        console.log("Service Worker 등록 성공:", registration);
    } catch (err) {
        console.log("Service Worker 등록 실패:", err);
    }
}
