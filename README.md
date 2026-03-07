# 💸 Expense Tracker

A full stack **Personal Finance Management Web Application** built with Django REST Framework and React.js. Track your daily expenses, set monthly budgets, and visualize your spending patterns through interactive charts.

---

## 🚀 Live Demo

> Register a new account and start tracking your expenses!

---

## 📸 Screenshots

| Login Page | Dashboard |
|-----------|-----------|
| Clean login with JWT auth | Analytics with pie & bar charts |

| Expenses Page | Budgets Page |
|--------------|-------------|
| Add, edit, delete expenses | Budget alerts with progress bars |

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register, login & logout
- 💸 **Expense Management** — Add, edit, delete expenses by category
- 💰 **Budget Tracking** — Set monthly budgets per category
- 📊 **Smart Budget Alerts** — Color coded progress bars:
  - 🟢 Green → Safe (0–75%)
  - 🟡 Orange → Warning (75–90%)
  - 🔴 Red → Danger (90–100%)
  - 🚨 Dark Red → Exceeded (100%+)
- 📈 **Analytics Dashboard** — Pie chart & 6 month bar chart
- 👥 **Multi-user Support** — Each user sees only their own data
- 🔄 **Auto Token Refresh** — Axios interceptor handles expired tokens

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Python 3.11+ | Programming language |
| Django 4.x | Web framework |
| Django REST Framework | REST API toolkit |
| SimpleJWT | JWT authentication |
| django-cors-headers | CORS handling |
| MySQL | Database |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React.js | UI framework |
| React Router | Client side routing |
| Axios | API communication |
| Recharts | Data visualization |

---

## 📁 Project Structure

```
expense-tracker/
├── Backend/
│   └── Expense-tracker/
│       ├── wallet/          ← Django settings & URLs
│       ├── accounts/        ← Register & Login APIs
│       ├── expenses/        ← Expense & Category APIs
│       ├── budgets/         ← Budget & Check APIs
│       ├── analytics/       ← Charts & Summary APIs
│       └── manage.py
│
└── frontend/
    └── wallet_frontend/
        ├── src/
        │   ├── api/
        │   │   └── axios.js      ← Axios config + interceptors
        │   ├── pages/
        │   │   ├── Login.jsx
        │   │   ├── Register.jsx
        │   │   ├── Dashboard.jsx
        │   │   ├── Expenses.jsx
        │   │   └── Budgets.jsx
        │   ├── components/
        │   │   └── Navbar.jsx
        │   └── App.jsx
        └── package.json
```

---

## 🔗 API Endpoints

### Authentication
```
POST   /api/accounts/register/     → Register new user
POST   /api/accounts/login/        → Login & get JWT tokens
POST   /api/accounts/token/refresh/ → Refresh access token
```

### Expenses
```
GET    /api/expenses/categories/   → List all categories
POST   /api/expenses/categories/   → Create category
DELETE /api/expenses/categories/1/ → Delete category
GET    /api/expenses/              → List all expenses
POST   /api/expenses/              → Add new expense
GET    /api/expenses/1/            → Get single expense
PUT    /api/expenses/1/            → Update expense
DELETE /api/expenses/1/            → Delete expense
```

### Budgets
```
GET    /api/budgets/               → List all budgets
POST   /api/budgets/               → Create budget
PUT    /api/budgets/1/             → Update budget
DELETE /api/budgets/1/             → Delete budget
GET    /api/budgets/check/         → Check budget status
```

### Analytics
```
GET    /api/analytics/monthly-summary/  → Total spent this month
GET    /api/analytics/category-wise/    → Spending by category
GET    /api/analytics/monthly-trend/    → Last 6 months trend
```

---

## ⚙️ Setup & Installation

### Prerequisites
```
✅ Python 3.11+
✅ Node.js & npm
✅ MySQL
✅ Git
```

### 1️⃣ Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/expense-tracker.git
cd expense-tracker
```

### 2️⃣ Database Setup
Open MySQL and run:
```sql
CREATE DATABASE expense_tracker;
```

### 3️⃣ Backend Setup
```bash
cd Backend/Expense-tracker

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers mysqlclient

# Update database password in wallet/settings.py
DATABASES = {
    'default': {
        'PASSWORD': 'your_mysql_password',  ← change this
    }
}

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start Django server
python manage.py runserver
```

Django running at → `http://127.0.0.1:8000`

### 4️⃣ Frontend Setup
```bash
cd frontend/wallet_frontend

# Install dependencies
npm install

# Start React server
npm run dev
```

React running at → `http://localhost:5173`

---

## 🚀 Running the Project

Open **2 terminals** every time:

**Terminal 1 — Django Backend:**
```bash
cd Backend/Expense-tracker
venv\Scripts\activate
python manage.py runserver
```

**Terminal 2 — React Frontend:**
```bash
cd frontend/wallet_frontend
npm run dev
```

Open browser → `http://localhost:5173`

---

## 🗄️ Database Models

```
accounts_user
    ↓ (ForeignKey)
expenses_category
    ↓ (ForeignKey)
expenses_expense
budgets_budget (unique_together: user + category + month + year)
```

---

## 🔒 Security Features

- JWT tokens with 1 day expiry (access) & 7 day expiry (refresh)
- Every API filters by `request.user` — users only see their own data
- Axios response interceptor auto-clears expired tokens
- Password hashing using Django's built-in `create_user`

---

## 🧠 Key Concepts Used

| Concept | Implementation |
|---------|---------------|
| REST API | Django REST Framework |
| JWT Auth | SimpleJWT access + refresh tokens |
| CORS | django-cors-headers |
| Protected Routes | React PrivateRoute component |
| State Management | React useState + useEffect hooks |
| API Communication | Axios with request/response interceptors |
| Data Visualization | Recharts PieChart + BarChart |
| Token Storage | localStorage |

---

## 🐛 Known Issues & Solutions

| Issue | Solution |
|-------|---------|
| 401 on login | Clear localStorage — old expired token conflict |
| CORS error | Make sure Django server is running |
| MySQL connection error | Check password in settings.py |
| npm start not working | Use `npm run dev` (Vite project) |

---

## 📚 What I Learned

- Building REST APIs with Django REST Framework
- JWT authentication flow (access + refresh tokens)
- React hooks (useState, useEffect, useNavigate, useLocation)
- Axios interceptors for automatic token handling
- Database design with ForeignKey relationships
- Connecting React frontend to Django backend
- CORS configuration for cross-origin requests
- Multi-user data isolation

---

## 🔮 Future Improvements

- [ ] Email notifications when budget is exceeded
- [ ] Export expenses to PDF/Excel
- [ ] Mobile responsive design
- [ ] Deploy to AWS/Railway
- [ ] Unit tests for all API endpoints
- [ ] HttpOnly Cookies for more secure token storage

---

## 👨‍💻 Author

**Rishab**
- GitHub: [@Rishab-Sakale](https://github.com/Rishab-Sakale)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

⭐ If you found this project helpful, please give it a star!
