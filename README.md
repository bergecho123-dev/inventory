# Inventory Management System (IMS)

A comprehensive, full-stack inventory management system built for the A-MESOB government organization.

## Features

### Frontend
- Modern React-based UI with Tailwind CSS
- Role-based access control (Admin, Store Manager, Employee)
- Responsive design for desktop and mobile
- Real-time inventory management
- Interactive charts and analytics
- Activity logging and reporting
- File upload support for receipts and documents
- Multilingual support (English/Amharic ready)

### Backend
- Express.js REST API with modular architecture
- JWT-based authentication and authorization
- Role-based access control middleware
- Complete CRUD operations for inventory
- Activity logging system
- File upload handling with Multer
- PostgreSQL database with Neon integration
- Domain-Driven Design (DDD) architecture

### Database
- PostgreSQL with Neon serverless
- Three main tables: users, inventory_items, activity_logs
- Optimized indexes for performance
- Support for migrations and seeding

## Project Structure

\`\`\`
ims-app/
├── backend/
│   ├── src/
│   │   ├── domain/          # Business entities and logic
│   │   ├── application/     # Use cases and services
│   │   ├── infrastructure/  # Database and file handling
│   │   ├── interfaces/      # HTTP controllers and routes
│   │   ├── config/          # Configuration files
│   │   └── server.js        # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # React context for state
│   │   ├── services/        # API services
│   │   └── App.jsx          # Main app component
│   └── package.json
├── scripts/
│   ├── 01-init-database.sql # Database schema
│   └── 02-seed-data.sql     # Sample data
└── .env.example             # Environment variables template
\`\`\`

## Getting Started

### Prerequisites
- Node.js 16+
- PostgreSQL database (or Neon account)
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd ims-app
   \`\`\`

2. **Setup Environment Variables**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your database credentials and JWT secret
   \`\`\`

3. **Setup Database**
   \`\`\`bash
   # Run the SQL scripts to create tables and seed data
   psql -U your_user -d your_database -f scripts/01-init-database.sql
   psql -U your_user -d your_database -f scripts/02-seed-data.sql
   \`\`\`

4. **Install Backend Dependencies**
   \`\`\`bash
   cd backend
   npm install
   npm run dev
   \`\`\`

5. **Install Frontend Dependencies**
   \`\`\`bash
   cd frontend
   npm install
   npm run dev
   \`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Inventory
- `GET /api/inventory` - Get all items
- `GET /api/inventory/:id` - Get single item
- `POST /api/inventory` - Create item (admin/store_manager)
- `PUT /api/inventory/:id` - Update item (admin/store_manager)
- `DELETE /api/inventory/:id` - Delete item (admin)
- `GET /api/inventory/low-stock/items` - Get low stock items

### Activity Logs
- `GET /api/activity-logs` - Get all activities
- `GET /api/activity-logs/user/:userId` - Get user activities

## User Roles

- **Admin**: Full access to all features, user management, and system configuration
- **Store Manager**: Can create, edit, and delete inventory items
- **Employee**: Read-only access to inventory

## Deployment

### Using PM2
\`\`\`bash
npm install -g pm2
pm2 start backend/src/server.js --name "ims-backend"
pm2 save
pm2 startup
\`\`\`

### Using Docker
\`\`\`bash
docker build -t ims-backend ./backend
docker run -p 5000:5000 --env-file .env ims-backend
\`\`\`

### Using Nginx
\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:3000;
    }
}
\`\`\`

## Technologies Used

- **Frontend**: React, React Router, Tailwind CSS, Recharts
- **Backend**: Node.js, Express.js, JWT, Bcrypt
- **Database**: PostgreSQL, Neon
- **File Upload**: Multer
- **Authentication**: JWT tokens
- **Architecture**: Domain-Driven Design (DDD)

## License

This project is licensed under the MIT License.

## Support

For issues and support, please contact the development team or open an issue in the repository.
