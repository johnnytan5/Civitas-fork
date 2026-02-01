# Civitas Backend

Express.js backend with TypeScript for the Civitas application.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

### Development

Start the development server with hot reload:

```bash
npm run dev
```

The server will start at `http://localhost:3001`

### Build

Compile TypeScript to JavaScript:

```bash
npm run build
```

### Production

Run the compiled application:

```bash
npm start
```

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api` - API welcome message

## Project Structure

```
backend/
├── src/
│   └── index.ts          # Main application file
├── dist/                 # Compiled JavaScript (generated)
├── .env                  # Environment variables (not in git)
├── .env.example          # Example environment variables
├── tsconfig.json         # TypeScript configuration
├── nodemon.json          # Nodemon configuration
└── package.json          # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run type-check` - Check TypeScript types without building
