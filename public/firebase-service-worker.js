/* public/firebase-messaging-sw.js */

// If you use the CDN version of Firebase in the SW:
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// Paste your web app's Firebase config (safe to expose public keys here)
firebase.initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

/**
 * 1) Background notifications with "notification" payload
 * Shown automatically by the browser, but you can override here if needed.
 */
messaging.onBackgroundMessage((payload) => {
  // Optional: customize notification shown for "data-only" payloads
  const { title, body, icon, image, click_url } = payload.data || {};
  if (title || body) {
    self.registration.showNotification(title || "Zynvo", {
      body: body || "",
      icon: icon || "/icons/icon-192x192.png",
      image: image, // large image (optional)
      data: { click_url: click_url || "/" },
      actions: [
        { action: "open", title: "Open" },
      ],
      tag: "zynvo", // coalesce duplicates
    });
  }
});

/**
 * 2) Handle notification click (foreground your app or open a URL)
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = event.notification?.data?.click_url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Focus an open tab
      for (const client of clientList) {
        const url = new URL(client.url);
        if (url.pathname === target || target === "/") {
          return client.focus();
        }
      }
      // Or open a new tab
      return clients.openWindow(target);
    })
  );
});
