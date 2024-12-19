# AI-Powered Resume Builder

A modern web application that helps users create professional resumes with AI assistance.

## Features

- User authentication and authorization
- AI-powered resume content suggestions
- Multiple resume templates
- Admin dashboard with analytics
- Real-time resume editing
- PDF export functionality

## Tech Stack

- Frontend: React.js with Material-UI
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT
- AI Integration: OpenAI API

## Prerequisites

- Node.js >= 14.0.0
- npm >= 6.0.0
- MongoDB Atlas account
- OpenAI API key

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5002
OPENAI_API_KEY=your_openai_api_key
```

### Frontend (.env.production)
```
REACT_APP_API_URL=your_production_api_url
REACT_APP_NODE_ENV=production
```

## Deployment Instructions

### Local Development
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd backend && npm install
   ```
3. Set up environment variables
4. Run the development servers:
   ```bash
   # Frontend
   npm start
   
   # Backend
   cd backend && npm start
   ```

### Production Deployment

#### Option 1: Heroku Deployment
1. Create a Heroku account
2. Install Heroku CLI
3. Login to Heroku:
   ```bash
   heroku login
   ```
4. Create a new Heroku app:
   ```bash
   heroku create your-app-name
   ```
5. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set OPENAI_API_KEY=your_openai_api_key
   heroku config:set NODE_ENV=production
   ```
6. Deploy:
   ```bash
   git push heroku main
   ```

#### Option 2: Vercel + Render Deployment
1. Frontend (Vercel):
   - Fork this repository
   - Sign up for Vercel
   - Import your repository
   - Set environment variables
   - Deploy

2. Backend (Render):
   - Sign up for Render
   - Create a new Web Service
   - Connect your repository
   - Set environment variables
   - Deploy

## License

MIT License

## Contact

For support or queries, please open an issue in the repository.
