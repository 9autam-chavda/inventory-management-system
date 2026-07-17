# 📦 Inventory Management System

A full-stack **Inventory Management System** built using **Spring Boot**, **React**, and **MySQL**. This application helps businesses efficiently manage products, categories, purchases, sales, invoices, and inventory with secure JWT authentication and an interactive dashboard.

---

## 🚀 Features

### 🔐 Authentication
- User Registration
- User Login
- JWT Authentication
- BCrypt Password Encryption
- Protected REST APIs
- Spring Security Integration

### 📊 Dashboard
- Total Products
- Total Categories
- Total Purchases
- Total Sales
- Total Invoices
- Total Stock
- Low Stock Products

### 📦 Product Management
- Add Product
- Update Product
- Delete Product
- View All Products
- Product Details

### 🏷 Category Management
- Add Category
- Edit Category
- Delete Category
- View Categories

### 🛒 Purchase Management
- Record Purchases
- Update Inventory Automatically
- Purchase History

### 💰 Sales Management
- Record Sales
- Reduce Stock Automatically
- Sales History

### 🧾 Invoice Management
- Generate Invoice
- View Invoice History

### 🎨 Frontend
- Responsive UI
- Dashboard Cards
- CRUD Operations
- Axios API Integration
- React Router Navigation
- Bootstrap Styling

---

# 🛠 Tech Stack

## Backend
- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT
- Maven

## Frontend
- React (Vite)
- React Router DOM
- Axios
- Bootstrap
- React Icons

## Database
- MySQL

## Tools
- VS Code
- Postman
- Git
- GitHub

---

# 📂 Project Structure

```
Inventory-Management-System
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   ├── dto
│   ├── security
│   ├── config
│   └── InventoryApplication.java
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── context
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

---

# 🗄 Database

Database Name

```
inventory_db
```

---

# ⚙️ Backend Setup

### Clone Repository

```bash
git clone https://github.com/9autam-chavda/inventory-management-system.git
```

### Go to Backend

```bash
cd backend
```

### Configure Database

Update **application.properties**

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/inventory_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### Run

```bash
mvn spring-boot:run
```

Server starts on

```
http://localhost:8080
```

---

# 💻 Frontend Setup

Go to frontend

```bash
cd frontend
```

Install packages

```bash
npm install
```

Run

```bash
npm run dev
```

Frontend starts on

```
http://localhost:5173
```

---

# 🔑 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /auth/register |
| POST | /auth/login |

---

## Products

| Method | Endpoint |
|---------|----------|
| GET | /products |
| GET | /products/{id} |
| POST | /products |
| PUT | /products/{id} |
| DELETE | /products/{id} |

---

## Categories

| Method | Endpoint |
|---------|----------|
| GET | /categories |
| GET | /categories/{id} |
| POST | /categories |
| PUT | /categories/{id} |
| DELETE | /categories/{id} |

---

## Purchases

| Method | Endpoint |
|---------|----------|
| GET | /purchases |
| POST | /purchases |

---

## Sales

| Method | Endpoint |
|---------|----------|
| GET | /sales |
| POST | /sales |

---

## Dashboard

| Method | Endpoint |
|---------|----------|
| GET | /dashboard |

---

# 🔒 Security

- Spring Security
- JWT Token Authentication
- BCrypt Password Encryption
- Stateless Authentication
- Protected REST APIs

---


# 📈 Future Improvements

- Role-Based Authentication
- Barcode Scanner
- Export Reports to PDF
- Email Notifications
- Search & Filters
- Pagination
- Dark Mode
- Stock Alerts
- Analytics Dashboard

---

# 👨‍💻 Author

**Gautam Chavda**

- GitHub: https://github.com/9autam-chavda

---

# ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

---

## 📄 License

This project is developed for educational and internship purposes.