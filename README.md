# Raitha Sahayak (ರೈತ ಸಹಾಯಕ) - AI-Powered Farmer's Assistant

**Raitha Sahayak** is a cutting-edge web application designed to empower Indian farmers by providing them with accessible, AI-driven tools and information. Built with a focus on the farmers of Karnataka, the app offers multilingual support (English and Kannada) and a suite of features to help make informed decisions, improve crop yield, and enhance livelihoods.

This application is built using Firebase Studio, leveraging modern web technologies to deliver a seamless and intuitive user experience.

## Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [AI Integration with Genkit](#ai-integration-with-genkit)

---

## About The Project

The mission of Raitha Sahayak is to bridge the technological divide for farmers. By harnessing the power of generative AI, the application provides instant, expert-level advice on a variety of agricultural challenges. From diagnosing crop diseases with just a photo to navigating complex government schemes, Raitha Sahayak aims to be an indispensable digital companion for the modern farmer.

---

## Key Features

- **Crop Health Advisor (Doctor Agro)**: Upload a photo of a diseased crop and get an AI-powered diagnosis, treatment plan, and a list of required products and nearby stores.
- **Market Analysis**: Get real-time market insights, including predictive crop values, consumption trends, and effective consumer targeting for any crop in a specific location.
- **Government Scheme Finder**: Discover relevant government schemes based on location, land size, crop type, and subsidy needs, complete with eligibility criteria and application instructions.
- **Damaged Crop Recovery**: Receive advice on salvaging crops damaged by weather or pests, estimate recovery probability, and find alternative buyers for damaged produce.
- **Weather-Based Suggestions**: Get daily and weekly actionable advice tailored to your specific crop based on your local weather forecast, helping you plan activities like watering and pesticide application.
- **Multilingual Support**: Fully functional in both English and Kannada, with seamless language switching to ensure accessibility.
- **User Authentication**: Secure user registration and login functionality powered by Firebase Authentication.
- **Voice-to-Text Input**: Most text input fields support voice-to-text, making the app more accessible for users who may have difficulty typing.
- **Text-to-Speech Output**: AI-generated results can be read aloud, catering to users with varying literacy levels.

---

## Tech Stack

This project is built with a modern, robust, and scalable technology stack:

- **Frontend**: [Next.js](https://nextjs.org/) (with App Router), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **AI & Generative Features**: [Google AI & Genkit](https://firebase.google.com/docs/genkit)
- **Backend & Authentication**: [Firebase](https://firebase.google.com/) (Authentication)

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root of your project and add your Firebase and Google AI API keys. You can get these from your Firebase project settings and Google AI Studio.

    ```env
    # Firebase public API keys
    NEXT_PUBLIC_FIREBASE_API_KEY=AIza...

    # Google AI API Key for Genkit
    GEMINI_API_KEY=AIza...
    ```

### Running the Application

1.  **Run the Genkit development server:**
    Open a new terminal and run the following command to start the Genkit AI flows.
    ```sh
    npm run genkit:dev
    ```

2.  **Run the Next.js development server:**
    In another terminal, run the main application.
    ```sh
    npm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

---

## Project Structure

The codebase is organized to be clean, scalable, and maintainable.

```
/
├── src/
│   ├── app/                    # Next.js App Router (pages and layouts)
│   │   ├── (app)/              # Main application routes with shared layout
│   │   │   ├── [feature]/      # Folder for each feature/module
│   │   │   │   ├── page.tsx
│   │   │   │   └── actions.ts
│   │   │   └── layout.tsx      # Main authenticated layout with sidebar/header
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   ├── globals.css         # Global styles and theme variables
│   │   └── layout.tsx          # Root layout
│   ├── ai/                     # Genkit AI flows and tools
│   │   ├── flows/              # Core AI logic for each feature
│   │   ├── tools/              # Tools that AI flows can use (e.g., APIs)
│   │   └── schemas/            # Zod schemas for AI inputs/outputs
│   ├── components/             # Reusable UI components (ShadCN)
│   ├── hooks/                  # Custom React hooks (e.g., useAuth, useLanguage)
│   ├── lib/                    # Utility functions and library initializations
│   └── public/                 # Static assets
├── package.json
└── tailwind.config.ts
```

---

## AI Integration with Genkit

The application's AI capabilities are powered by **Genkit**, a framework for building production-ready AI applications.

-   **Flows (`src/ai/flows/`)**: Each major AI feature has a corresponding flow. A flow orchestrates calls to language models, tools, and other logic to fulfill a user's request. For example, `weather-suggestion.ts` defines the logic to generate farming advice from weather data.
-   **Tools (`src/ai/tools/`)**: Tools are functions that the AI model can decide to call to retrieve external information or perform an action. For example, `get-weather-forecast.ts` is a tool that fetches weather data, which is then used by the `weatherSuggestionFlow`.
-   **Schemas (`src/ai/schemas/`)**: We use Zod schemas to define the expected input and output structure for our AI prompts. This ensures that the data returned by the AI is strongly typed and predictable.
