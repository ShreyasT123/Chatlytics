# Real-Time Dashboard & Chat App

This project is a real-time web application built with **Next.js**, **Tailwind CSS**, and **shadcn UI components**. It features:

- **Dashboard:** Displays real-time charts sourced from Firestore.
- **Public Chat:** Open chat where any user can send messages and images. Messages are stored in Firebase, while images are saved in Supabase storage.
- **Private Chat:** Users can create new chat rooms and share a room ID. Only authenticated users can join these rooms to exchange messages and images.
- **Authentication:** The dashboard and chat functionalities are protected under the `/user` route, ensuring that only authenticated users have access.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Real-Time Data:** Uses Firestore to display live charts and data analytics.
- **Public & Private Chat:** Supports both open conversations and private room-based chats.
- **Image Handling:** Images uploaded in chats are stored via Supabase.
- **Protected Routes:** The `/user` route safeguards the dashboard and chat sections, ensuring only authenticated users can access them.

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, shadcn UI
- **Realtime Data & Auth:** Firebase (Firestore & Authentication)
- **Storage:** Supabase for image storage

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/yourproject.git
