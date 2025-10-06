# FarmChainX Backend

Fresh Spring Boot backend application for FarmChainX Supply Chain Management System with MySQL database.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **User Management**: Registration and login for different user roles (Farmer, Distributor, Retailer, Consumer, Admin)
- **Separate Crop Tables**: Independent tables for farmer_crops, distributor_crops, and retailer_crops
- **Supply Chain Tracking**: Complete traceability from farm to consumer
- **Admin Functionality**: Admins can delete users and all their associated crops
- **MySQL Database**: Robust database storage with JPA/Hibernate

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

## Database Setup

1. Install MySQL Server 8.0+
2. The database `farmchainx` will be created automatically
3. Update the database credentials in `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/farmchainx?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
    username: root
    password: root
```

## Database Schema

The application automatically creates the following tables:

### users
- `id` (Primary Key, Auto Increment)
- `email` (Unique, Not Null)
- `password` (Encrypted, Not Null)
- `role` (FARMER, DISTRIBUTOR, RETAILER, CONSUMER, ADMIN)
- `name`
- `location`
- `farmer_id` (3-digit unique ID for farmers)
- `distributor_id` (3-digit unique ID for distributors)
- `created_at`

### farmer_crops
- `id` (Primary Key, Auto Increment)
- `name`
- `crop_type`
- `harvest_date`
- `expiry_date`
- `soil_type`
- `pesticides_used`
- `image_url`
- `farmer_location`
- `user_id` (Foreign Key to users)
- `created_at`

### distributor_crops
- `id` (Primary Key, Auto Increment)
- `name`
- `crop_type`
- `harvest_date`
- `expiry_date`
- `soil_type`
- `pesticides_used`
- `image_url`
- `farmer_id`
- `farmer_name`
- `farmer_location`
- `distributor_location`
- `received_date`
- `sent_to_retailer`
- `retailer_location`
- `user_id` (Foreign Key to users)
- `created_at`

### retailer_crops
- `id` (Primary Key, Auto Increment)
- `name`
- `crop_type`
- `harvest_date`
- `expiry_date`
- `soil_type`
- `pesticides_used`
- `image_url`
- `farmer_id`
- `farmer_name`
- `farmer_location`
- `distributor_id`
- `distributor_name`
- `distributor_location`
- `retailer_location`
- `received_date`
- `user_id` (Foreign Key to users)
- `created_at`

## Running the Application

1. Ensure MySQL is running
2. Navigate to the backend directory
3. Run the application:

```bash
mvn spring-boot:run
```

Or if Maven is not installed globally:
```bash
./mvnw spring-boot:run
```

The application will start on `http://localhost:8080/api`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Farmer Crop Management
- `GET /api/farmer/crops` - Get farmer's crops
- `POST /api/farmer/crops` - Create new crop
- `PUT /api/farmer/crops/{id}` - Update crop
- `DELETE /api/farmer/crops/{id}` - Delete crop

### Distributor Crop Management
- `GET /api/distributor/crops` - Get distributor's crops
- `POST /api/distributor/crops` - Create new crop
- `PUT /api/distributor/crops/{id}` - Update crop
- `DELETE /api/distributor/crops/{id}` - Delete crop

### Retailer Crop Management
- `GET /api/retailer/crops` - Get retailer's crops
- `POST /api/retailer/crops` - Create new crop
- `PUT /api/retailer/crops/{id}` - Update crop
- `DELETE /api/retailer/crops/{id}` - Delete crop

### Admin Endpoints (Requires ADMIN role)
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/{userId}` - Delete user and all their crops
- `GET /api/admin/stats` - Get system statistics

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Admin User Deletion Feature

Admins can delete any user from the system. When a user is deleted:
1. All their farmer_crops are deleted
2. All their distributor_crops are deleted
3. All their retailer_crops are deleted
4. The user account is deleted

This is a cascading delete operation that ensures data integrity.

## Security

- JWT-based authentication
- Password encryption using BCrypt
- Role-based access control
- CORS configuration for frontend integration (localhost:5173, localhost:3000)
- Stateless session management

## Technology Stack

- Spring Boot 3.2.0
- Spring Security 6
- Spring Data JPA
- MySQL Connector
- JWT (io.jsonwebtoken)
- BCrypt for password encryption

## Building for Production

```bash
mvn clean package
```

This creates a JAR file in the `target` directory.

## Environment Variables

You can override default settings using environment variables:
- `DB_USERNAME` - MySQL username (default: root)
- `DB_PASSWORD` - MySQL password (default: root)
- `JWT_SECRET` - JWT secret key (default provided)

## Development Notes

- The database schema is automatically created/updated on application startup
- Farmer IDs and Distributor IDs are auto-generated as 3-digit unique numbers
- All timestamps are managed automatically
- CORS is enabled for local frontend development
