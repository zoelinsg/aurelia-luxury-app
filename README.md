# AURELIA

A luxury fashion multi-page web application featuring a premium editorial-inspired frontend and a FastAPI backend. 

*Built during the Google Build with AI workshop using Antigravity.*

## 1. Project Overview
AURELIA is designed as a minimal viable product (MVP) for a high-end luxury fashion house. It combines modern, sleek visual aesthetics with a fast, lightweight backend architecture. The application is containerized and deployed on Google Cloud Run.

## 2. Features
- **Editorial Design System**: High-contrast, premium dark-mode aesthetic with smooth scroll animations and glassmorphism UI components.
- **Dynamic Product Catalog**: Features a curated list of 6 luxury product items loaded dynamically via a backend API endpoint.
- **Client-Side Cart**: Persistent shopping cart functionality utilizing `localStorage` and a slide-out cart drawer.
- **Simulated Checkout**: Simulated/mock payment processing flow to demonstrate the user journey.
- **Concierge Chat**: Keyword-based concierge chat for basic user assistance and material inquiries.
- **Contact Form**: Functional frontend-to-backend communication for concierge requests.

## 3. Tech Stack
- **Backend**: Python, FastAPI, Uvicorn
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Templating**: Jinja2
- **Deployment**: Docker, Google Cloud Run

## 4. Project Structure
```text
.
├── Dockerfile           # Cloud Run container configuration
├── main.py              # FastAPI application entry point & routes
├── requirements.txt     # Python dependencies
├── static/              
│   ├── style.css        # Premium styling and design tokens
│   ├── script.js        # Cart logic, animations, and API interactions
│   └── images/          # Local static image assets
└── templates/           
    ├── index.html       # Collection / Homepage
    ├── about.html       # Maison / Heritage page
    ├── contact.html     # Concierge contact page
    └── checkout.html    # Cart checkout flow
```

## 5. Local Development Setup

### Prerequisites
- Python 3.11+
- pip

### Installation
1. Clone the repository:
   ```bash
   git clone <YOUR-REPO-URL>
   cd aurelia
   ```
2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the development server:
   ```bash
   python main.py
   ```
   *Alternatively, run with uvicorn directly:*
   ```bash
   uvicorn main:app --reload
   ```
4. Open `http://127.0.0.1:8000` in your browser.

## 6. Deployment to Google Cloud Run

This project is configured for deployment to Google Cloud Run using the included `Dockerfile`.

1. Ensure you have the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) installed and authenticated.
2. Run the following commands from the project root:
   ```bash
   gcloud config set project geekbuai2601
   gcloud config set run/region asia-east1
   gcloud run deploy aurelia-luxury-app --source . --allow-unauthenticated
   ```

## 7. Live Demo
View the live application here: **[Live Demo](https://aurelia-luxury-app-682146797685.asia-east1.run.app)**

## 8. What I Learned
During this project and the Google Build with AI workshop, I focused on:
- Architecting a lightweight FastAPI backend to serve HTML templates and JSON APIs simultaneously.
- Managing client-side state using Vanilla JavaScript and `localStorage` without relying on heavy frameworks.
- Translating high-end editorial design principles into CSS using modern grid layouts, CSS variables, and intersection observers for scroll animations.
- Containerizing a Python web application using Docker.
- Troubleshooting and successfully deploying applications to Google Cloud Run.

## 9. Demo
[▶ Watch Demo on YouTube](https://youtu.be/HjNA6Keu0JU)

[![Demo Video](https://img.youtube.com/vi/HjNA6Keu0JU/0.jpg)](https://youtu.be/HjNA6Keu0JU)

