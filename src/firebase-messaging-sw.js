/*
 * Here is is the code snippet to initialize Firebase Messaging in the Service
 * Worker when your app is not hosted on Firebase Hosting.
 * */
 // [START initialize_firebase_in_sw]
 // Give the service worker access to Firebase Messaging.
 // Note that you can only use Firebase Messaging here, other Firebase libraries
 // are not available in the service worker.
 importScripts('https://www.gstatic.com/firebasejs/5.5.5/firebase-app.js');
 importScripts('https://www.gstatic.com/firebasejs/5.5.5/firebase-messaging.js');
 // Initialize the Firebase app in the service worker by passing in the
 // messagingSenderId.
 firebase.initializeApp({
   'messagingSenderId': 'AAAAvk5Ans8:APA91bHEnM8BlQhVk3nv7CTckLn_PJMoJyjxLqTzP0txjEa9lqnJps0GzDC1HObK7TRvYYHbO3xXenqZQ3CCgEvCK4eIKj7Jb6H15CpmDs_2YobjNscXqmUxkgEn28zuV2wuzR04zypD'
 });
 // Retrieve an instance of Firebase Messaging so that it can handle background
 // messages.
 const messaging = firebase.messaging();
 // [END initialize_firebase_in_sw]


// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]

messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background notification ', payload);
    // Customize notification here
    let notificationTitle = 'Background Message Title';
    let notificationOptions = {
        body: 'Background Message body.',
        icon: '/assets/icons/icon-512x512.png'
    };
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// [END background_handler]
