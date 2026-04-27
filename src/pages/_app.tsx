import Fotter from "@/Components/Fotter";
import Navbar from "@/Components/Navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";


export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const trackStreak = () => {
      const today = new Date().toDateString();
      const lastLogin = localStorage.getItem("courseraClone_lastLoginDate");
      let rawStreak = localStorage.getItem("courseraClone_userStreak");
      let streak = parseInt(rawStreak || "0", 10);
      if (isNaN(streak)) streak = 0;

      if (lastLogin !== today) {
        if (lastLogin) {
          const lastDate = new Date(lastLogin);
          const currentDate = new Date(today);
          
          // Phase 3 Fix: Use UTC normalization for cross-timezone streak stability
          const utc1 = Date.UTC(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
          const utc2 = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
          const diffDays = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            streak += 1;
          } else if (diffDays > 1) {
            streak = 1;
          }
        } else {
          streak = 1;
        }

        localStorage.setItem("courseraClone_userStreak", streak.toString());
        localStorage.setItem("courseraClone_lastLoginDate", today);
        window.dispatchEvent(new Event("streakUpdated"));
      }
    };

    const restoreReminders = () => {
      let pendingReminders = [];
      try {
        pendingReminders = JSON.parse(localStorage.getItem("courseraClone_activeReminders") || "[]");
      } catch (e) {
        console.error("Failed to parse reminders:", e);
        localStorage.setItem("courseraClone_activeReminders", "[]");
      }
      const now = Date.now();

      if (!Array.isArray(pendingReminders)) pendingReminders = [];
      pendingReminders.forEach((reminder: any) => {
        const timeRemaining = reminder.triggerAt - now;
        
        const fireNotification = () => {
          new Notification("Coursera Reminder", {
            body: `Don't forget to continue: "${reminder.courseTitle}"!`,
            icon: "/favicon.ico",
          });
          const current = JSON.parse(localStorage.getItem("courseraClone_activeReminders") || "[]");
          localStorage.setItem("courseraClone_activeReminders", JSON.stringify(current.filter((r: any) => r.id !== reminder.id)));
        };

        if (timeRemaining <= 0) {
          fireNotification(); // Fire immediately if time was missed
        } else {
          setTimeout(fireNotification, timeRemaining);
        }
      });
    };

    trackStreak();
    if (Notification.permission === "granted") {
      restoreReminders();
    }

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (registration) {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) {
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <Component {...pageProps} />
      <Fotter />
    </div>
  );
}
