# Pesa Cash Deployment Guide

This project consists of two parts that will be deployed on Render:
- Backend: Node.js/TypeScript API
- Frontend: Next.js application

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

## Frontend Deployment on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Static Site"
3. Connect your GitHub repository
4. Configure the frontend service:
   - Name: `pesa-cash-frontend` (or your preferred name)
   - Branch: `main` (or your deployment branch)
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `.next`

5. Add the following environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-name.onrender.com/api
   MDG=true
   GTR=false
   ```

6. Click "Create Static Site"

## Post-Deployment Steps

1. After the backend deploys:
   - Copy your backend deployment URL (e.g., https://pesa-cash-api.onrender.com)
   - You'll need this URL for the frontend configuration

2. After frontend deploys:
   - Ensure the `NEXT_PUBLIC_API_URL` points to your backend API URL
   - Test the application by visiting your frontend Render URL
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
   - Monitor your Render logs for both services
   - Check service status regularly
   - Set up alerts for service disruptions

4. Troubleshooting Common Issues:

   Backend Issues:
   - Check Render logs for errors
   - Verify MongoDB connection
   - Ensure all environment variables are set correctly
   - Check if the port configuration is correct

   Frontend Issues:
   - Verify the API URL is correct
   - Check build logs for any compilation errors
   - Clear browser cache if seeing outdated content
   - Ensure Next.js build is completing successfully

5. Performance:
   - Monitor response times
   - Check resource usage in Render dashboard
   - Consider upgrading instance types if needed

6. Maintenance:
   - Regularly update dependencies
   - Monitor security advisories
   - Backup your database regularly
   - Keep environment variables up to date

Remember to always test your deployment in a staging environment first before deploying to production.
