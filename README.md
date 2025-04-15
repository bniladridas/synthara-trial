# Synthara AI Chat

A minimalist interface for LLM conversations

Clean, distraction-free interface designed with simplicity and performance in mind.

## Setup

```bash
npm install
npm start  # Important: Always use npm start, not npx server public
```

Server runs at `http://localhost:3000`

> **Note:** Always use `npm start` to run the server, not `npx server public`. The `npm start` command runs your custom Express server with all the necessary API routes and middleware, while `npx server public` only serves static files and won't handle API requests.

## Verification

When the server is running correctly, you should see logs similar to these:

```json
{"timestamp":"2025-04-15T04:58:00.612Z","level":"INFO","message":"Incoming request","method":"POST","path":"/api/chat","ip":"::1","userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"}
{"timestamp":"2025-04-15T04:58:00.613Z","level":"INFO","message":"Processing chat request","promptLength":2}
{"timestamp":"2025-04-15T04:58:03.226Z","level":"INFO","message":"Chat request completed","duration":"2613ms","tokensUsed":140}
```

These logs confirm that:
- The API endpoint is working correctly
- The Together API key is valid and working
- The server is properly configured

## Structure

```
/
├── server.js     # API routes and server logic
└── public/       # Frontend
    ├── index.html
    ├── app.js
    ├── app-utils.js
    └── styles.css
```

## Dependencies

- **express** — Web server framework
- **axios** — HTTP client for API requests
- **cors** — Cross-origin resource sharing
- **dotenv** — Environment variable management

## Development

```bash
npm run dev
```

Uses nodemon for automatic server restarts during development.

## Troubleshooting

If you encounter a "Server error (404)" message, check:

1. That you're using `npm start` to run the server, not `npx server public`
   - The `npx server public` command won't handle API requests correctly
   - Always use `npm start` to run the full Express server with API routes

2. Your API key in the `.env` file is valid
   - Check that the TOGETHER_API_KEY in your .env file is correct
   - You can verify this by looking for successful API responses in the server logs

3. The `app-utils.js` file exists in the public directory
   - This file is required by app.js and contains essential utility functions
   - If missing, you'll see 404 errors for this file in the server logs

## Deployment on Vercel

### Prerequisites

1. Push your project to a GitHub repository
2. Create an account on [Vercel](https://vercel.com)

### Steps

1. In the Vercel dashboard, click "New Project"
2. Import your GitHub repository
3. Configure the project:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: None (leave empty)
   - Output Directory: public

4. Add Environment Variables:
   - Click "Environment Variables" and add:
     - `TOGETHER_API_KEY`: Your Together API key
     - `NODE_ENV`: production

5. Click "Deploy"

### Verifying Deployment

- After deployment, Vercel will provide you with a URL
- Visit the URL to ensure your app is working correctly
- Check the Function Logs in the Vercel dashboard to see if API requests are being processed

### Troubleshooting Vercel Deployment

If you encounter issues with your Vercel deployment:

1. **API Routes Not Working**:
   - Check that `vercel.json` is in the root directory
   - Verify that environment variables are set correctly
   - Look at Function Logs for specific error messages

2. **CORS Errors**:
   - If you're getting CORS errors, check that your Express CORS middleware is configured correctly
   - You may need to add your Vercel domain to the allowed origins

3. **Environment Variables**:
   - Ensure all required environment variables are set in the Vercel dashboard
   - Remember that local `.env` files are not automatically uploaded to Vercel

## Future Enhancements

- TypeScript integration
- Bundling optimization
- Testing framework
- Code quality tools
