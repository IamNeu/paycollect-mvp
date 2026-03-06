PayCollect — Payment Request & Collection Engine (MVP Model)
This is a high-fidelity interactive prototype of the PayCollect platform. It serves as a "working model" to demonstrate the user flow, UI/UX design, and core business logic for merchant collections.

Live Demo URL: https://paycollect-mvp.vercel.app/

🚀 Key Features (Interactive Model)
This version focuses on the "Happy Path" of a Merchant using the platform:

Interactive Dashboard: Real-time visualization of collection KPIs (Total Collected, Outstanding, Collection Rate).

Customer Management: Fully functional "Add Customer" flow and Directory listing.

Quick Multi-Entry: A spreadsheet-style interface to create up to 50 payment requests at once for high-volume operations.

Status Management: Demonstration of the lifecycle of a request: CREATED → PARTIALLY PAID → FULLY PAID.

Public Checkout Experience: A mobile-responsive payment page that simulates how a customer sees and pays a bill via a unique link.

Simulated Notifications: Visual confirmation of Email and SMS triggers for automated reminders.

🛠️ Tech Stack & Implementation
Frontend: React.js 

Routing: React Router (handling 23+ screens)

State Management: LocalStorage API (used as a temporary database for the demo)

Styling: Tailwind CSS 

Deployment: Vercel

📂 Project Structure (MVP Screens)
The project is organized into the following core modules:

Auth Module: Login, Password Reset, and Account Onboarding.

Request Engine: Single Request Creator, Multi-Entry Table, and the Request List table.

Checkout Module: The public-facing link where customers complete payments.

Customer Directory: Management of customer profiles and historical transactions.

Settings: Payment Gateway configuration (API Key management).

📝 How to Use the Demo
Login: Use any email/password to enter the Dashboard.

Create: Go to "Multi-Entry" or "Add Customer" to add data to the temporary database.

Collect: From the "Request List," click the Payment Link icon.

Pay: In the new tab, click "Simulate Payment" to see the status automatically update in the Merchant Dashboard.

🚧 Roadmap (Next Phases)
[ ] Phase 2: Integration of Backend APIs and PostgreSQL Database.

[ ] Phase 3: Live SMS/Email Gateway integration (Twilio/SendGrid).

[ ] Phase 4: Real Payment Gateway Webhooks (PayMongo/Xendit).
