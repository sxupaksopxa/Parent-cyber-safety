# Parent Cyber Safety

Parent Cyber Safety is a privacy-first **frontend application** designed to help parents better understand their children’s digital habits and potential online risks.

The tool guides parents through a short questionnaire and generates a structured safety report with clear, practical recommendations.

The goal is to make digital safety easier to approach — without fear, technical complexity, or blame. The assessment highlights potential exposure areas such as privacy settings, communication risks, device configuration, and online behavior.

The application runs entirely in the browser and does not collect or store personal data.

---

## Key Features

- Interactive questionnaire covering devices, apps, and online behavior  
- Risk scoring engine to evaluate potential exposure areas  
- Personalized safety report with clear, actionable next steps  
- Multi-device assessment (smartphone, tablet, laptop, console, smartwatch)  
- Device-specific recommendations for safer configuration  
- Family-friendly guidance to support conversations about online safety  
- Multi-language support (DE/EN) with consistent UX and tone  

---

## Purpose

This project explores how simple, privacy-first digital tools can support families in building safer online environments and making informed decisions together.

---

## Technology Stack

- **Frontend:** React (Vite), Tailwind CSS  
- **Language:** JavaScript (ES6+)  
- **Architecture:** Component-based UI with JSON-driven content system and multi-language support (DE/EN)  
- **UX Design:** Parent-focused, non-technical guidance system with structured risk assessment logic  
- **State Management:** React hooks (useState, useEffect)  
- **Hosting:** Azure Static Web Apps  
- **CI/CD:** GitHub Actions  
- **Domain & Security:** Custom domain with HTTPS (SSL)  

---

## What This Frontend Does

The web interface:

- Provides a **15-question assessment** for parents  
- Generates a detailed **Safety Report** including:  
  - Risk score  
  - Key risks  
  - Step-by-step recommendations  
  - Device-specific guidance  
  - Online behavior insights  
  - Supportive conversation prompts  
- Uses a calm, supportive tone suitable for families  
- Works seamlessly across desktop, tablet, and mobile devices  

The interface contains **no intrusive tracking**, collects **no personal data**, and is designed with privacy as a core principle.

---

## Architecture Overview

The application is a client-side React application deployed via Azure Static Web Apps.

All assessment logic and risk scoring are executed locally in the browser. This ensures user privacy and eliminates the need for backend services or data storage.

### Workflow

Questionnaire → Risk Assessment Engine → Safety Report Generation

### Key Design Principles

- **Privacy-first:** No personal data is stored or transmitted  
- **Client-side processing:** All calculations run securely in the browser  
- **Scalable content system:** JSON-driven guidance with multi-language support (DE/EN)  
- **Separation of concerns:** UI, logic, and content are cleanly decoupled  

---

## Planned Improvements

- Expand device-specific recommendations  
- Add printable safety reports for parents and caregivers  
- Introduce AI-assisted personalization for context-aware guidance 
- Improve usability by separating longer content into clearer sections or dedicated subpages