Coursera Clone – Full Stack Learning Platform

A production-ready Coursera-inspired learning platform built with modern web technologies, featuring real-time interactivity, offline capabilities, and advanced user engagement systems.

Live Demo

https://coursera-clone-igug.vercel.app

Project Overview

This project replicates a modern online learning experience with a strong focus on:

Real-time UI interactions
Offline-first capabilities
User engagement systems
Persistent state management

The platform is designed with production-level engineering practices, ensuring reliability, scalability, and smooth UX.

Features
Real-time Search and Filtering: Instantly filter courses based on title, description, and tags without page reload.
Tag-based Categorization: Easily browse courses using categories such as Programming, Design, and Marketing.
Course Completion Confetti: Visual feedback with animation and motivational message upon completing a course.
Offline Mode Support: Download course content (text and images) and access it without an internet connection.
Offline Indicator: Clearly marks courses that are available offline.
Streak Tracking System: Tracks daily learning activity with automatic increment and reset logic.
Reward Badges: Displays milestones such as 3-day, 7-day, and 30-day streak achievements.
Reminder Notification System: Allows users to set reminders with persistent storage and browser notification support.
Auto-Resume Video Playback: Saves video progress and allows users to resume from the last watched timestamp.
Resilient State Management: Handles corrupted local data gracefully without crashing.

Motivational message:

“Great Job! You’ve completed this course!”

Enhances user engagement

3. Offline Mode (PWA)
Download courses (text + images)
Works without internet connection
Service Worker-based caching
“Available Offline” indicator for downloaded courses

4. Streak Tracking System
Tracks daily learning activity
Streak increment & reset logic
Badge rewards (3, 7, 30 days)
Timezone-safe implementation (UTC-based)

5. Reminder Notification System
Set reminders (1 hour / tomorrow)
Persistent reminders (survive refresh)
Browser notifications support
Graceful handling of permission denial

6. Auto-Resume Video Playback
Saves video progress automatically
Resume from last watched timestamp
“Resume Watching” overlay for quick access

Tech Stack
Frontend
Next.js
React.js
Tailwind CSS
State & Storage
LocalStorage
IndexedDB (via Service Worker caching)
PWA & Offline
Service Worker
Cache API
UX Enhancements
canvas-confetti
Toast notifications
Testing & Validation
Puppeteer (browser automation)
Zero-bluff audit strategy (real interaction testing)
Testing & Verification

This project was rigorously tested using a Zero-Bluff Certification Approach:

Real browser interaction (no assumptions)
2x refresh persistence validation
Offline simulation testing
Edge-case handling (corrupted data, permissions)
Production deployment audit (Vercel)
Performance & Reliability
Optimized images using Next.js
Stable UI across refresh cycles
No critical runtime errors
Offline fallback UI implemented
Resilient state handling (no crashes on corrupted data)

Deployment

Deployed on Vercel with production optimizations.

npm run build
npm start
Key Engineering Highlights
Fixed Tailwind production purge issue (case sensitivity)
Implemented Service Worker asset prefetching
Built persistent reminder system
Designed timezone-safe streak logic
Ensured offline-first UX architecture
Future Improvements
Backend integration (authentication + database)
Video streaming optimization
Push notifications (server-based)
Course progress analytics
Conclusion

This project demonstrates end-to-end frontend engineering skills, combining:

Real-world UX design
State persistence
Offline-first architecture
Production debugging & optimization
Author

Sanket Lohar
Full Stack Developer
