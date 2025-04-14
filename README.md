# Llama Chat Interface

![Interface Image](./png/interface.png)

## Overview

Llama Chat is a minimalist chat interface designed to interact with the Llama-3.3-70B AI model, providing an easy-to-use platform for communication.

## Project Structure

- **server.js**: Main server file powering the application using Express.js.
- **public/**: Contains static assets such as CSS and JavaScript files for UI.
- **poster/**: Holds resources for the poster design feature of the application.
- **showcase/**: Contains HTML and associated resources for showcasing features such as cloud-native demos.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/bniladridas/llama-chat-interface.git
   cd llama-chat-interface
   ```

2. **Install dependencies:**

   Use npm to install the required packages:

   ```bash
   npm install
   ```

## Usage

### Running the Application

To start the application, use the following command:

```bash
npm start
```

This will launch the server on port specified by `PORT` in your environment variables or default to `3000`.

For development with auto-reloading:

```bash
npm run dev
```

### Available Routes

- **Main Application**: [http://localhost:3000/](http://localhost:3000/)

- **Poster Design Page**: [http://localhost:3000/poster](http://localhost:3000/poster)

- **Showcase Page**: [http://localhost:3000/showcase](http://localhost:3000/showcase)

- **Cloud Native Showcase**: [http://localhost:3000/showcase/cloud-native](http://localhost:3000/showcase/cloud-native)

- **API Endpoint for Chat**: [http://localhost:3000/api/chat](http://localhost:3000/api/chat) (POST)

## Environment Variables

The application requires the following environment variables to properly interface with external services:

- `TOGETHER_API_KEY`: Your API key for Together.ai

## Dependencies

Some of the key dependencies include:

- **Express**: Web framework for Node.js
- **Axios**: Promise-based HTTP client
- **Cors**: Middleware for enabling CORS
- **Dotenv**: Module to load environment variables

## Development Dependencies

- **Nodemon**: Utility for automatically restarting the server during development

## License

This project is licensed under the ISC License.

## Author

Llama Chat Team at Synthara.

## Future Updates

Further updates of the project will be managed and hosted at the Synthara company repository on GitHub: [https://github.com/synthara-company](https://github.com/synthara-company).
