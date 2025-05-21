# Pesa Cash Deployment Guide

This project consists of two parts:
- Backend: Node.js/TypeScript API (Render)
- Frontend: Next.js application (Vercel)

## Backend Deployment on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the backend service:
   - Name: `pesa-cash-api` (or your preferred name)
   - Region: Choose the closest to your target users
   - Branch: `main` (or your deployment branch)
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Instance Type: Starter (or choose based on your needs)

5. Add the following environment variables:
   ```
   NODE_ENV=production
   PORT=8080
   MONGO_URI=your-mongodb-connection-string
   JWT_SECRET=your-secure-jwt-secret
   
   # M-Pesa Configuration
   MPESA_CONSUMER_KEY=your-mpesa-key
   MPESA_CONSUMER_SECRET=your-mpesa-secret
   MPESA_SHORTCODE=your-shortcode
   MPESA_PASSKEY=your-passkey
   MPESA_ENVIRONMENT=production
   BASE_URL=your-render-deployment-url
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-specific-password
   EMAIL_FROM=your-sender-email
   
   # Admin Configuration
   ADMIN_EMAIL=your-admin-email
   ADMIN_PASSWORD=your-secure-admin-password
   ADMIN_FIRST_NAME=Admin
   ADMIN_LAST_NAME=User
   ```

6. Click "Create Web Service"

## Frontend Deployment on Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework Preset: Next.js (should be auto-detected)
   - Root Directory: `frontend`
   - Build Settings: Keep defaults

5. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-name.onrender.com/api
   MDG=true
   GTR=false
   ```

6. Click "Deploy"

## Post-Deployment Steps

1. After the backend deploys on Render:
   - Copy your backend deployment URL
   - Update the frontend's `NEXT_PUBLIC_API_URL` in Vercel project settings
   - Format: `https://your-backend-name.onrender.com/api`

2. After frontend deploys on Vercel:
   - Test the application by visiting your Vercel URL
   - Login with your admin credentials
   - Change the admin password immediately

## Important Notes

1. Database Setup:
   - Ensure your MongoDB instance is running and accessible
   - Use MongoDB Atlas for production deployment
   - Add your Render deployment IP to MongoDB Atlas IP whitelist

2. Security:
   - Use strong passwords for all credentials
   - Keep your environment variables secure
   - Never commit sensitive information to Git

3. Monitoring:
   - Check Render logs for backend issues
   - Monitor Vercel deployment for frontend status
   - Set up alerts for service disruptions

4. Troubleshooting Common Issues:

   Backend Issues:
   - Check Render logs for errors
   - Verify MongoDB connection
   - Ensure all environment variables are set correctly
   - Check if the port configuration is correct

   Frontend Issues:
   - Verify the API URL is correct in Vercel environment variables
   - Check Vercel build logs for any compilation errors
   - Clear browser cache if seeing outdated content
   - Ensure Next.js build is completing successfully

5. Performance:
   - Monitor backend response times in Render
   - Use Vercel Analytics for frontend performance
   - Consider upgrading Render instance type if needed

6. Maintenance:
   - Regularly update dependencies
   - Monitor security advisories
   - Backup your database regularly
   - Keep environment variables up to date

Remember to always test your deployment in a staging environment first before deploying to production.
