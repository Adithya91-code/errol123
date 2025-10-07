# Backend Setup Instructions

## Prerequisites
1. Java 17 or higher installed
2. Maven installed (or use the Maven wrapper included)
3. MySQL 8.0+ installed and running

## Step 1: Configure MySQL
1. Start MySQL server
2. The database `farmchainx` will be created automatically
3. Update password in `backend/src/main/resources/application.yml` if needed:
   ```yaml
   spring:
     datasource:
       password: Adi@2006  # Change this to your MySQL root password
   ```

## Step 2: Clean and Compile Backend
Navigate to the backend directory and run:

```bash
cd backend
mvn clean compile
```

If Maven is not installed globally, use the Maven wrapper:
```bash
cd backend
./mvnw clean compile  # On Linux/Mac
mvnw.cmd clean compile  # On Windows
```

## Step 3: Run the Backend
```bash
mvn spring-boot:run
```

Or with Maven wrapper:
```bash
./mvnw spring-boot:run  # On Linux/Mac
mvnw.cmd spring-boot:run  # On Windows
```

The backend will start on `http://localhost:8080`

## Step 4: Verify Backend is Running
Open a browser and navigate to:
- `http://localhost:8080/api/auth/login` (should return 405 Method Not Allowed - this is expected for GET requests)

## Step 5: Run the Frontend
In a new terminal:
```bash
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## Database Tables Created Automatically
The following tables will be created in MySQL:
- `users` - Stores all user accounts
- `farmer_crops` - Stores crops added by farmers
- `distributor_crops` - Stores crops added by distributors
- `retailer_crops` - Stores crops added by retailers

## API Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/farmer/crops` - Get farmer's crops (requires auth)
- `POST /api/farmer/crops` - Create farmer crop (requires auth)
- `GET /api/distributor/crops` - Get distributor's crops (requires auth)
- `POST /api/distributor/crops` - Create distributor crop (requires auth)
- `GET /api/retailer/crops` - Get retailer's crops (requires auth)
- `POST /api/retailer/crops` - Create retailer crop (requires auth)
- `GET /api/admin/users` - Get all users (requires ADMIN role)
- `DELETE /api/admin/users/{userId}` - Delete user and crops (requires ADMIN role)

## Troubleshooting

### Port 8080 Already in Use
If port 8080 is already in use, update the port in `application.yml`:
```yaml
server:
  port: 8081  # Change to any available port
```

Then update the frontend API URL in `src/lib/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8081/api';
```

### MySQL Connection Error
- Verify MySQL is running
- Check username and password in `application.yml`
- Ensure MySQL is listening on port 3306

### Compilation Errors
Run clean compile:
```bash
mvn clean compile
```

If you still have issues, delete the target folder:
```bash
rm -rf target
mvn clean compile
```
