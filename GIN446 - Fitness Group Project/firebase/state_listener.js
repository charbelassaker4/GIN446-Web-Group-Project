import { auth } from "./initialise.js";
import { onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  const isAuthPage = path.includes("login") || path.includes("signup");

  if (!user && !isAuthPage) {
    window.location.href = "../fitness site back/login.html";
  } else if (user && isAuthPage) {
    window.location.href = "../fitness site front/index.html";
  }
});