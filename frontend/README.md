# Sericlo - Eco-friendly Textile Waste Reduction Platform

Sericlo is a comprehensive platform focused on textile waste reduction through recycling, preloved marketplace, donation, and AI-powered redesign solutions.

## Features

- **Recycling Clothes**: Transform old clothes into new materials for sustainable fashion
- **Preloved Marketplace**: Buy and sell quality second-hand clothing
- **Clothing Donations**: Donate unused clothes to those in need
- **AI-powered Redesign**: Use AI to redesign old clothes into new fashion items

## Tech Stack

### Frontend

- Next.js - React framework
- TypeScript - Type-safe JavaScript
- Tailwind CSS - Utility-first CSS framework
- Framer Motion - Animation library
- React Icons - Icon components

### Backend

- Node.js with Express - API server
- TypeScript - Type-safe JavaScript
- PostgreSQL - Relational database
- Sequelize - ORM for database interactions
- JWT - Authentication
- OpenAI - AI capabilities

### Deployment

- Docker & Docker Compose - Containerization
- Environment Variables - Configuration

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL (if running locally without Docker)
- OpenAI API Key (for AI redesign feature)

### Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/sericlo.git
   cd sericlo
   ```

2. Set up environment variables:

   ```bash
   # For frontend
   cp .env.local.example .env.local

   # For backend
   cp backend/.env.example backend/.env
   ```

   Edit both files with your specific configuration values.

3. Using Docker (Recommended):

   ```bash
   docker-compose up -d
   ```

   This will start the frontend, backend, PostgreSQL database, and pgAdmin services.

4. Without Docker (Development):

   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install
   cd ..

   # Start frontend
   npm run dev

   # Start backend in another terminal
   cd backend
   npm run dev
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001
   - pgAdmin (if using Docker): http://localhost:8080

## Project Structure

```
sericlo/
├── public/               # Static files
├── src/                  # Frontend code
│   ├── app/              # Next.js app router files
│   ├── components/       # React components
│   └── lib/              # Utility and helper functions
├── backend/              # Backend code
│   ├── src/              # Source files
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   └── index.ts      # Entry point
│   ├── uploads/          # Uploaded files
│   └── .env              # Backend environment variables
├── .env.local            # Frontend environment variables
├── docker-compose.yml    # Docker Compose configuration
└── README.md             # Project documentation
```

## API Endpoints

### Products API

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Donations API

- `GET /api/donations` - Get all donations
- `GET /api/donations/:id` - Get a specific donation
- `POST /api/donations` - Create a new donation
- `PATCH /api/donations/:id/status` - Update donation status
- `DELETE /api/donations/:id` - Delete a donation

### AI Redesign API

- `POST /api/ai/redesign` - Generate redesign ideas (requires image upload)
- `GET /api/ai/history` - Get redesign history

### User Authentication API

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change user password

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- OpenAI for providing AI capabilities
- All the open-source libraries used in this project
