# SkyBooker - Flight Booking Application

A modern flight booking application built with React, TypeScript, and Ant Design.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd flightbooking_client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add:
```env
VITE_API_URL=http://your-backend-api-url
```

## Running the Application

To start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build for Production

To build the application for production:
```bash
npm run build
```

## Features

- User authentication (login/register)
- Flight search
- Popular destinations
- Special offers
- Responsive design
- ...

## Tech Stack

- React
- TypeScript
- Vite
- Ant Design
- Tailwind CSS
- React Router DOM
- Axios

## Project Structure

```
src/
  ├── hooks/         # Custom hooks
  ├── page/          # Page components
  ├── routes/        # Route configurations
  ├── App.tsx        # Root component
  └── main.tsx       # Entry point
```
