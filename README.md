# Pesa Cash Deployment Guide

This project consists of two parts:
- Frontend: Next.js application
- Backend: Node.js/TypeScript API

## Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - Name: `pesa-cash-api`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. Set up the following environment variables in Render dashboard:
   - `NODE_ENV`: production
   - `PORT`: 8080
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your secure JWT secret
   - `MPESA_CONSUMER_KEY`: Your M-Pesa API consumer key
   - `MPESA_CONSUMER_SECRET`: Your M-Pesa API consumer secret
   - `MPESA_SHORTCODE`: Your M-Pesa shortcode
   - `MPESA_PASSKEY`: Your M-Pesa passkey
   - `MPESA_ENVIRONMENT`: production
   - `BASE_URL`: Your Render deployment URL
   - `EMAIL_HOST`: smtp.gmail.com
   - `EMAIL_PORT`: 587
   - `EMAIL_USER`: Your email address
   - `EMAIL_PASS`: Your email app-specific password
   - `EMAIL_FROM`: Your sender email address
   - `ADMIN_EMAIL`: Admin user email
   - `ADMIN_PASSWORD`: Admin user password
   - `ADMIN_FIRST_NAME`: Admin first name
   - `ADMIN_LAST_NAME`: Admin last name

## Frontend Deployment (Vercel)

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Configure environment variables:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL + `/api` (e.g., https://pesa-cash-api.onrender.com/api)
   - `MDG`: true
   - `GTR`: false

4. Deploy settings will be automatically picked up from vercel.json

## Post-Deployment Steps

1. After deploying the backend, get the deployment URL from Render
2. Update the frontend's `NEXT_PUBLIC_API_URL` in Vercel to point to your Render backend URL
3. Ensure all environment variables are properly set in both platforms
4. Test the admin login using the configured admin credentials
5. Update the admin password after first login

## Important Notes

- Always use HTTPS URLs for production deployments
- Keep your environment variables secure and never commit them to version control
- The backend uses port 8080 on Render as per their requirements
- Make sure your MongoDB instance is accessible from your Render deployment
- Configure CORS settings if needed in the backend
- Monitor the deployment logs for any potential issues

## Deployment Files

The repository includes the following deployment configuration files:

- `backend/render.yaml`: Configuration for Render deployment
- `frontend/vercel.json`: Configuration for Vercel deployment
- `frontend/.env.production`: Production environment variables for the frontend

Remember to update these configurations if you need to customize the deployment process further.
