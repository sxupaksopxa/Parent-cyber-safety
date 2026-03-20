## Architecture Overview

Parent Cyber Safety is a client-side React application deployed via Azure Static Web Apps.

All assessment logic, scoring, and report generation are executed locally in the browser. This privacy-first design eliminates the need for backend services, APIs, or data storage.

### Workflow

Questionnaire → Risk Assessment Engine → Safety Report Generation

### Core Components

- **Questionnaire Module:** Collects structured input about devices, usage patterns, and behaviors  
- **Risk Assessment Engine:** Evaluates inputs and calculates exposure levels  
- **Guidance System:** Maps results to structured recommendations using a JSON-driven content model  
- **Report Generator:** Produces a clear, user-friendly safety report  

### Key Design Principles

- **Privacy-first:** No personal data is stored, processed, or transmitted  
- **Client-side processing:** All logic runs securely in the browser  
- **Separation of concerns:** UI, logic, and content are clearly decoupled  
- **Scalable content system:** JSON-based structure enables easy updates and multi-language support (DE/EN)  
- **Lightweight deployment:** Static hosting with CI/CD via GitHub Actions  

### Technology

- React (Vite) for fast, modern frontend development  
- Tailwind CSS for responsive UI design  
- Azure Static Web Apps for hosting and deployment  