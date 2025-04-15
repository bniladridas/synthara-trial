# Vercel Deployment Guide for Synthara AI Chat

This guide provides instructions for deploying the Synthara AI Chat application to Vercel.

## Prerequisites

1. A GitHub account with your code pushed to a repository
2. A Vercel account (you can sign up at [vercel.com](https://vercel.com))
3. Your API keys for the chat services (TOGETHER_API_KEY, etc.)

## Deployment Steps

1. Log in to your Vercel account
2. Click "Add New..." and select "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: **Node.js**
   - Root Directory: ./
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   
5. **Environment Variables**:
   Add the following environment variables:
   - `TOGETHER_API_KEY`: Your Together.ai API key
   - `GROQ_API_KEY`: Your Groq API key (if used)
   - `CARTESIA_API_KEY`: Your Cartesia API key (if used)
   - `NODE_ENV`: Set to `production`

6. Click "Deploy"

## Troubleshooting

If you encounter a "500: INTERNAL_SERVER_ERROR" or "FUNCTION_INVOCATION_FAILED" error:

1. Check Vercel logs for specific error messages
2. Verify all environment variables are set correctly
3. Make sure your API keys are valid and not expired
4. Check that your serverless functions are properly configured for the Vercel environment

## Important Notes

- The application uses a custom `vercel.json` file to configure routing and builds
- File system operations (like writing to log files) are not supported in serverless environments
- The Express server is exported as a module for serverless deployment

## Updating Your Deployment

After making changes to your code:

1. Push changes to your GitHub repository
2. Vercel will automatically redeploy your application
3. You can also trigger manual deployments from the Vercel dashboard

## Checking Deployment Status

You can check the status of your deployment in the Vercel dashboard, which provides:
- Build logs
- Function logs
- Deployment history
- Performance metrics
