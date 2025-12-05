import { auth } from "./initialise.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("dreamfit-user-details"); // optional: clear stored data
      window.location.href = "../fitness site back/login.html";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  });
}