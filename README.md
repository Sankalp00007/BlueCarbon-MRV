<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1VPKahcJ0J-m5j3roDV7WUzqnZY3kZzeV

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

   🌿 Blue Carbon MRV System

A full-stack digital platform for verifying mangrove & seagrass restoration using AI image analysis, geo-tagging, multi-role verification, and a transparent carbon credit registry.

🚀 Overview

Coastal ecosystems such as mangroves and seagrass are powerful blue carbon sinks, storing up to 10× more carbon than terrestrial forests. However, restoration efforts in India and other regions lack a transparent, community-accessible monitoring and verification system.

This project solves that gap by building an end-to-end MRV (Monitoring, Reporting, Verification) platform that:

Collects geo-tagged restoration evidence

Uses AI (Gemini API) for vegetation verification

Enables NGO + Government approval workflows

Maintains a tamper-proof registry

Converts verified data into tokenized carbon credits

Allows corporates to view & purchase credits

Provides income opportunities for coastal communities

Built for hackathons, academic evaluation, and real-world pilot testing.

🧠 Key Features
🌱 Fisherman / Community User

Upload mangrove & seagrass images

Automatic GPS + timestamp detection

Track AI verification & NGO/Admin approval

View estimated carbon contribution & earnings (mock)

🧑‍💼 NGO Verifier

View pending submissions

See AI vegetation detection score

Map preview for geo-validation

Approve / reject with comments

Override AI (with justification)

🏛 Admin (Government / Authority)

System-wide analytics dashboard

Final approval & audit trail

Manage NGOs and permissions

Monitor carbon credit issuance

Export CSV/PDF reports (mock)

🏢 Corporate Buyer

Browse verified carbon credit projects

Filter by region, mangrove/seagrass

Purchase credits (mock)

Download ESG impact summary

🤖 AI & Tech Features

Image verification via Gemini API

Multi-language support

Google Maps integration

Immutable credit registry simulation

Secure JWT authentication

Cloud-based storage for images

🔧 Tech Stack
Layer	Technologies
Frontend:	React.js, Typescript.js, HTML CSS Js
Backend: Node.js
Database:	PostgreSQL , Supabase
AI Layer:	Gemini API (Vision + Text)
Maps:	Google Maps API

🚧 Challenges Faced

Ensuring AI accuracy for diverse vegetation images

Handling GPS validation in low-signal coastal areas

Designing multi-role workflows

Creating believable carbon credit simulation

Time constraints and rapid prototyping

🌍 Future Enhancements

Real blockchain deployment (Polygon)

Custom AI model trained on mangrove/seagrass datasets

Drone & satellite NDVI integration

Mobile offline-first app for field workers

Real payment gateway for credit purchases

Community-powered restoration leaderboard

✨ Why This Project Matters

Empowers fishermen & coastal communities

Supports climate action and India’s Net Zero goals

Makes carbon credits trustworthy and traceable

Bridges technology, sustainability, and real impact
