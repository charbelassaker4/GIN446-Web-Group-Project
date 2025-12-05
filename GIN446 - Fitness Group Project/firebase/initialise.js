import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB-evlPoV7wS5TDmCmnPjyC2fyhmlOBIy8",
  authDomain: "dreamfit-470.firebaseapp.com",
  projectId: "dreamfit-470",
  storageBucket: "dreamfit-470.firebasestorage.app",
  messagingSenderId: "1015097927622",
  appId: "1:1015097927622:web:bb729e9e9d91bfed20b4c7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };