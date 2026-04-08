# Insight Loop

A unified platform for collaboration, interaction, and shared activities.

Live Application: https://vibe-hack26.vercel.app/
Authentication: Access is currently supported via Google Sign-In only.

---

## Overview
Insight Loop is a web and mobile-based platform that enables users to discover nearby polls, create interactive activities, and collaborate in real-time. It integrates location-based discovery with live participation to provide a seamless and engaging user experience.


## Features
- Location-based poll discovery to view and join nearby activities  
- Create and manage polls with descriptions, timers, and activity types  
- Real-time participation tracking with visibility of active users  
- Timer-based activities for structured engagement  
- Support for study sessions, games, and group discussions  
- Live interaction within groups  


## System Workflow
1. User opens the application  
2. Nearby polls are displayed based on location  
3. User can create or join a poll  
4. Participants interact in real-time  
5. Poll results and activity progress are tracked  


## Technology Stack
- Frontend: Next.js 16
- Backend: Supabase  
- Database: PostgreSQL  
- Authentication: Google OAuth   
- Realtime Messaging Services: Supabase Realtime  
- Location Services: Google Map API  
- Mobile Application Framework: Capacitor (used to convert the web application(Next.js) into a cross-platform mobile app)  


## Installation

```bash
git clone https://github.com/startwithsahitya/VibeHack26.git
cd VibeHack26
npm install
npm run dev
