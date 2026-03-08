# Parent Cyber Safety

Parent Cyber Safety is a privacy-first **frontend application** designed to help parents better understand their children’s digital habits and potential online risks. The tool guides parents through a short questionnaire and generates a structured safety report with practical recommendations.

The goal is to make digital safety easier to approach without fear or technical complexity. The assessment highlights potential exposure areas such as privacy settings, communication risks, device configuration, and online behavior.

The application runs entirely in the browser and does not collect personal data.

Key features include:
- Interactive questionnaire covering devices, apps, and online behavior
- Risk scoring engine that evaluates potential exposure areas
- Personalized safety report with practical next steps
- Multi-device assessment (phone, tablet, laptop, console, smartwatch)
- Device-specific recommendations for safer configuration
- Family-friendly guidance for discussing online safety with children
- This project explores how simple digital tools can support families in building safer online environments.

---

## Technology Stack

- **React** (Vite)
- **Tailwind** CSS
- **JavaScript** (ES6+)
- **Azure** Static Web Apps
- **GitHub** Actions CI/CD
- **Custom domain** with HTTPS

---

## What This Frontend Does

The web interface:

- Shows a **15-question assessment** for parents   
- Displays a detailed **Safety Report** including:  
  - Risk score  
  - Key risks  
  - Step-by-step recommendations  
  - Device-specific advice  
  - Online behaviour guidance  
  - Gentle conversation tips  
- Uses a calm, supportive tone suitable for families  
- Works on desktop, tablets, and mobile devices  

The interface contains **no intrusive tracking**, collects **no personal names**, and is designed with privacy in mind.

---

## Architecture Overview

The application is a client-side React application deployed via Azure Static Web Apps.
The assessment logic and risk scoring engine run locally in the browser to ensure privacy and eliminate the need for backend storage.

Workflow:
Questionnaire → Risk assessment engine → Safety report generation

This architecture ensures:
- no personal data storage
- fast response time
- privacy-friendly design

---

## Planned Improvements

- Multi-language support
- More device-specific recommendations
- Printable safety report for parents and caregivers
- AI-assisted personalization for context-aware guidance

---