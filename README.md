# Survey Form Application

A complete employee feedback survey system built with Node.js, Express, MongoDB, and EJS templates.

## Features

- Dynamic survey forms with customizable questions
- Admin panel for question management (CRUD operations)
- Response viewing and CSV export
- Admin authentication
- Mobile-friendly design
- Server-side rendering with EJS

## Tech Stack

- **Backend**: Node.js with Express
- **Database**: MongoDB Atlas
- **Frontend**: HTML + CSS + EJS templates
- **Authentication**: Express Session with bcrypt

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

## Installation

1. Clone the repository or download the project files

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a `.env` file in the root directory (copy from `.env.example`):
\`\`\`bash
cp .env.example .env
\`\`\`

4. Update the `.env` file with your MongoDB Atlas connection string:
\`\`\`
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/survey-db?retryWrites=true&w=majority
SESSION_SECRET=your-random-secret-key
PORT=3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
\`\`\`

## Getting Your MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (if you haven't already)
3. Click "Connect" on your cluster
4. Choose "Connect your application"
5. Copy the connection string and replace `<password>` with your database user password
6. Replace `<dbname>` with `survey-db` (or your preferred database name)

## Running the Application

1. Seed the database with default questions:
\`\`\`bash
npm run seed
\`\`\`

2. Start the server:
\`\`\`bash
npm start
\`\`\`

For development with auto-restart:
\`\`\`bash
npm run dev
\`\`\`

3. Open your browser and navigate to:
\`\`\`
http://localhost:3000
\`\`\`

## Default Admin Credentials

- **Username**: admin
- **Password**: admin123

**Important**: Change these credentials after first login!

## Project Structure

\`\`\`
survey-form-application/
├── config/
│   └── database.js          # Database configuration
├── models/
│   ├── Admin.js             # Admin user model
│   ├── Question.js          # Question model
│   └── Response.js          # Survey response model
├── routes/
│   ├── index.js             # Landing page routes
│   ├── survey.js            # Survey form routes
│   ├── admin.js             # Admin panel routes
│   └── responses.js         # Response viewing routes
├── views/
│   ├── partials/
│   │   ├── header.ejs       # Header partial
│   │   └── footer.ejs       # Footer partial
│   ├── index.ejs            # Landing page
│   ├── survey.ejs           # Survey form
│   ├── success.ejs          # Submission success page
│   ├── admin-login.ejs      # Admin login page
│   ├── admin-dashboard.ejs  # Admin dashboard
│   ├── admin-questions.ejs  # Question management
│   ├── responses.ejs        # View responses
│   ├── 404.ejs              # 404 error page
│   └── error.ejs            # Error page
├── public/
│   └── css/
│       └── style.css        # Main stylesheet
├── scripts/
│   └── seed.js              # Database seeding script
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore file
├── package.json             # Project dependencies
├── server.js                # Main application file
└── README.md                # This file
\`\`\`

## Usage

### For Survey Respondents

1. Visit the homepage
2. Click "Take Survey"
3. Fill out the survey form
4. Submit your response

### For Administrators

1. Navigate to `/admin`
2. Login with admin credentials
3. Manage questions from the dashboard
4. View and export responses as CSV

## API Routes

- `GET /` - Landing page
- `GET /survey` - Display survey form
- `POST /survey/submit` - Submit survey response
- `GET /admin` - Admin login page
- `POST /admin/login` - Admin authentication
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/questions` - Manage questions
- `POST /admin/questions/add` - Add new question
- `PUT /admin/questions/edit/:id` - Edit question
- `DELETE /admin/questions/delete/:id` - Delete question
- `GET /responses` - View all responses
- `GET /responses/export` - Export responses as CSV

## Deployment

This application is ready to deploy to platforms like:

- Heroku
- Railway
- Render
- DigitalOcean App Platform

Make sure to set environment variables in your deployment platform.

## License

ISC
