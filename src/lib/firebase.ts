    import { initializeApp, getApps } from "firebase/app";
    import { getAuth, signInAnonymously, signInWithCustomToken } from "firebase/auth";
    import { getFirestore } from "firebase/firestore";

    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    const initialAuthToken = process.env.NEXT_PUBLIC_FIREBASE_INITIAL_AUTH_TOKEN;
    export const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'default-app-id';

    // console.log("Firebase Config:", firebaseConfig);

    // Initialize Firebase
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

    export const auth = getAuth(app);
    export const db = getFirestore(app);

    export const signIn = async () => {
         if (auth.currentUser) return auth.currentUser;
    try {
        if (initialAuthToken) {
      const userCredential = await signInWithCustomToken(auth, initialAuthToken);
      console.log("Signed in with custom token.");
      return userCredential.user;
    } else {
      try {
        const userCredential = await signInAnonymously(auth);
        console.log("Signed in anonymously.");
        return userCredential.user;
      } catch (anonError: any) {
        if (anonError.code === "auth/admin-restricted-operation") {
          console.error("Anonymous sign-in is disabled in your Firebase project. Please enable it in the Firebase console.");
        } else {
          console.error("Anonymous sign-in error:", anonError);
        }
        return null;
      }
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
};
    
