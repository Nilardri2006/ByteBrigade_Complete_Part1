# 🚀 Hackathon Team Builder

A web application that helps developers find the perfect teammates for hackathon projects based on technical skills and experience level.

## ✨ Features

### 👤 User Profiles
- Create detailed developer profiles with:
  - Personal information (name, contact email)
  - Professional links (LinkedIn, GitHub)
  - Technical skills (known and desired tech stacks)
  - Experience level (beginner/experienced)

### 👥 Team Builder
- Search for teammates by required technical skills
- Filter by experience level (include/exclude beginners)
- View matching developers with contact information
- Form teams of 2-5 members

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite (Development) → NeonDB/PostgreSQL (Production)
- **ORM**: SQLAlchemy
- **Validation**: Pydantic

### Frontend
- **Framework**: React
- **Routing**: React Router
- **Styling**: Tailwind CSS (optional)

## 📦 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- PostgreSQL (for production)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hackathon-team-builder/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database configuration
   ```

5. **Run the application**
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

## 🗄️ Database Configuration

### Development (SQLite)
The application uses SQLite by default for development. No additional setup is required.

### Production (NeonDB/PostgreSQL)
1. Create a NeonDB account and database
2. Update database connection string in environment variables:
   ```
   DATABASE_URL=postgresql://username:password@hostname/database_name
   ```

## 📡 API Endpoints

### User Management
- `POST /users` - Create a new user profile
- `GET /users/{user_id}` - Get user details
- `GET /users/search?skills=python,javascript` - Search users by skills

### Health Check
- `GET /health` - API status check

## 🚦 Usage

1. **Create Profile**: Navigate to the profile page and fill in your details
2. **Search Teammates**: Use the team builder tool to find developers with specific skills
3. **Contact Matches**: Use provided contact information to reach out to potential teammates

## � Development

### Running Tests
```bash
# Backend tests
pytest

# Frontend tests
npm test
```

### Database Migrations
```bash
# Generate migrations
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head
```

## 🌐 Deployment

### Backend (Render/Fly.io)
```bash
# Build command
pip install -r requirements.txt

# Start command
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Frontend (Vercel/Netlify)
- Connect your repository
- Set build command: `npm run build`
- Set publish directory: `build`

### Database (NeonDB)
- Create production database on NeonDB
- Set connection string as environment variable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or issues, please create an issue in the GitHub repository or contact the development team.

---

**Happy Hacking!** 🎉