# Coursera Clone - Next-Gen Learning Platform

> A high-performance, feature-rich education platform built with Next.js, designed to provide a seamless learning experience with offline resilience, progress gamification, and intelligent video tracking.

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## Live Demo

**[https://coursera-clone-igug.vercel.app](https://coursera-clone-igug.vercel.app)**

---

## Screenshot

*Visual evidence of the platform's core features and UI consistency.*

<img width="1900" height="813" alt="Homepage" src="audit_01_homepage_navbar.png" />
<img width="1891" height="902" alt="Search & Filtering" src="audit_03_search_tag_development.png" />
<img width="1892" height="897" alt="Streak Tracking" src="audit_04_streak_after_inject.png" />

---

## The Problem

Traditional online learning platforms often struggle with user engagement and resilience in low-connectivity environments. Learners can feel unmotivated without clear progress markers, and technical interruptions can break the flow of study. This project addresses these challenges by integrating gamified streak tracking, celebratory UI feedback, and robust offline capabilities to ensure that learning remains consistent and engaging, regardless of external factors.

---

## Features

* **🔍 Advanced Search & Tag Filtering:** Effortlessly discover courses with real-time search and category-based tag filters.
* **🔥 Learning Streak Tracking:** Gamified daily streaks to keep you motivated and consistent in your learning journey.
* **🎥 Intelligent Video Player:** Remembers your progress and offers "Resume Watching" functionality across sessions.
* **📴 Offline Resilience:** Built to handle intermittent connections, allowing for a seamless navigation experience even when offline.
* **🎓 Course Completion & Confetti:** Celebratory UI feedback and certificate generation upon finishing your learning paths.
* **🔔 Smart Reminders:** Integrated notification system to prompt you for upcoming study sessions.

---

## Tech Stack

### Frontend
* **Framework:** Next.js 15+ (App & Pages Router)
* **Library:** React 19
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Visuals:** Canvas Confetti

### State & Logic
* **Persistence:** LocalStorage API for offline data and progress tracking
* **Gamification:** Custom logic for streak calculation and login tracking
* **Video Integration:** React-YouTube for smart playback management

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js 18+
* npm, yarn, or pnpm

### Setup

1.  Clone the repository:
    ```sh
    git clone https://github.com/SanketLohar/coursera-clone.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd coursera-clone
    ```
3.  Install dependencies:
    ```sh
    npm install
    ```
4.  Run the development server:
    ```sh
    npm run dev
    ```
    The application will start on `http://localhost:3000`.

---

## License

This project is distributed under the MIT License. See `LICENSE` for more information.
