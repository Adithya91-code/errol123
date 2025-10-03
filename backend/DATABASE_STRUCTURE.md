# FarmChainX Database Structure

## Overview
The system uses MySQL database with 4 separate tables to track crops through the supply chain: Farmer → Distributor → Retailer → Consumer.

## Database Configuration

### Connection Details
- **Database**: MySQL 8.0+
- **URL**: `jdbc:mysql://localhost:3306/farmchainx`
- **Username**: Configured via `DB_USERNAME` environment variable (default: root)
- **Password**: Configured via `DB_PASSWORD` environment variable (default: Adi@2006)

### Configuration File
Location: `backend/src/main/resources/application.yml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/farmchainx?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:Adi@2006}
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
```

## Database Tables

### 1. farmer_crops
Stores crops added by farmers.

**Fields:**
- `id` (Primary Key)
- `name` - Crop name
- `crop_type` - Type of crop
- `harvest_date` - When the crop was harvested
- `expiry_date` - When the crop expires
- `soil_type` - Type of soil used
- `pesticides_used` - Pesticides applied
- `image_url` - Image of the crop
- `user_id` (Foreign Key → users table)
- `farmer_id` - Unique farmer identifier
- `farmer_name` - Name of the farmer
- `farmer_location` - Location of the farm
- `quantity` - Amount of crop
- `quantity_unit` - Unit of measurement (kg, tons, etc.)
- `price_per_unit` - Price per unit
- `status` - Current status (AVAILABLE, SOLD, etc.)
- `created_at`, `updated_at` - Timestamps

**API Endpoints:**
- POST `/api/farmer-crops` - Create new crop
- GET `/api/farmer-crops` - Get all crops
- GET `/api/farmer-crops/my-crops` - Get authenticated user's crops
- GET `/api/farmer-crops/{id}` - Get crop by ID
- GET `/api/farmer-crops/status/{status}` - Get crops by status
- PUT `/api/farmer-crops/{id}` - Update crop
- DELETE `/api/farmer-crops/{id}` - Delete crop

### 2. distributor_crops
Tracks crops received by distributors from farmers.

**Fields:**
- `id` (Primary Key)
- `farmer_crop_id` - Reference to original farmer crop
- `user_id` (Foreign Key → users table)
- `distributor_id` - Unique distributor identifier
- `distributor_name` - Name of distributor
- `distributor_location` - Distributor's location
- `received_date` - When received from farmer
- `received_from_farmer_id` - Farmer's ID
- `received_from_farmer_name` - Farmer's name
- `farmer_location` - Farmer's location
- `quantity` - Amount received
- `quantity_unit` - Unit of measurement
- `price_per_unit` - Purchase/selling price per unit
- `status` - Current status (IN_STOCK, DISTRIBUTED, etc.)
- `created_at`, `updated_at` - Timestamps

**API Endpoints:**
- POST `/api/distributor-crops` - Create distributor crop record
- GET `/api/distributor-crops` - Get all distributor crops
- GET `/api/distributor-crops/my-crops` - Get authenticated user's crops
- GET `/api/distributor-crops/{id}` - Get crop by ID
- GET `/api/distributor-crops/status/{status}` - Get crops by status
- PUT `/api/distributor-crops/{id}` - Update crop
- DELETE `/api/distributor-crops/{id}` - Delete crop

### 3. retailer_crops
Tracks crops received by retailers from distributors.

**Fields:**
- `id` (Primary Key)
- `distributor_crop_id` - Reference to distributor crop
- `user_id` (Foreign Key → users table)
- `retailer_id` - Unique retailer identifier
- `retailer_name` - Name of retailer
- `retailer_location` - Retailer's location
- `received_date` - When received from distributor
- `received_from_distributor_id` - Distributor's ID
- `received_from_distributor_name` - Distributor's name
- `distributor_location` - Distributor's location
- `quantity` - Amount received
- `quantity_unit` - Unit of measurement
- `price_per_unit` - Purchase/selling price per unit
- `status` - Current status (IN_STOCK, SOLD, etc.)
- `created_at`, `updated_at` - Timestamps

**API Endpoints:**
- POST `/api/retailer-crops` - Create retailer crop record
- GET `/api/retailer-crops` - Get all retailer crops
- GET `/api/retailer-crops/my-crops` - Get authenticated user's crops
- GET `/api/retailer-crops/{id}` - Get crop by ID
- GET `/api/retailer-crops/status/{status}` - Get crops by status
- PUT `/api/retailer-crops/{id}` - Update crop
- DELETE `/api/retailer-crops/{id}` - Delete crop

### 4. consumer_purchases
Records crops purchased by consumers from retailers.

**Fields:**
- `id` (Primary Key)
- `retailer_crop_id` - Reference to retailer crop
- `user_id` (Foreign Key → users table)
- `consumer_id` - Unique consumer identifier
- `consumer_name` - Name of consumer
- `consumer_location` - Consumer's location
- `purchase_date` - Date of purchase
- `purchased_from_retailer_id` - Retailer's ID
- `purchased_from_retailer_name` - Retailer's name
- `retailer_location` - Retailer's location
- `quantity` - Amount purchased
- `quantity_unit` - Unit of measurement
- `price_per_unit` - Purchase price per unit
- `total_price` - Total purchase amount
- `payment_status` - Payment status (PENDING, COMPLETED, etc.)
- `created_at`, `updated_at` - Timestamps

**API Endpoints:**
- POST `/api/consumer-purchases` - Create purchase record
- GET `/api/consumer-purchases` - Get all purchases
- GET `/api/consumer-purchases/my-purchases` - Get authenticated user's purchases
- GET `/api/consumer-purchases/{id}` - Get purchase by ID
- GET `/api/consumer-purchases/payment-status/{status}` - Get purchases by payment status
- PUT `/api/consumer-purchases/{id}` - Update purchase
- DELETE `/api/consumer-purchases/{id}` - Delete purchase

## Supply Chain Flow

1. **Farmer** creates a crop entry in `farmer_crops` table
2. **Distributor** receives crop and creates entry in `distributor_crops` (references `farmer_crop_id`)
3. **Retailer** receives crop and creates entry in `retailer_crops` (references `distributor_crop_id`)
4. **Consumer** purchases crop and creates entry in `consumer_purchases` (references `retailer_crop_id`)

This structure maintains full traceability from farm to consumer.

## Running the Application

### Prerequisites
1. MySQL 8.0+ installed and running
2. Java 17+
3. Maven 3.6+

### Steps

1. **Start MySQL Server**
   ```bash
   # Make sure MySQL is running on localhost:3306
   ```

2. **Configure Database Credentials** (Optional)
   Set environment variables or update `application.yml`:
   ```bash
   export DB_USERNAME=your_username
   export DB_PASSWORD=your_password
   ```

3. **Build the Application**
   ```bash
   cd backend
   mvn clean install
   ```

4. **Run the Application**
   ```bash
   mvn spring-boot:run
   ```

5. **Verify**
   The application will:
   - Create the `farmchainx` database if it doesn't exist
   - Create all 4 tables automatically (via Hibernate ddl-auto: update)
   - Start on port 8080
   - Be accessible at `http://localhost:8080/api`

## Authentication

All endpoints require authentication via JWT token. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Notes

- The `ddl-auto: update` setting automatically creates and updates tables based on entity definitions
- All tables include automatic timestamp tracking (created_at, updated_at)
- Foreign key relationships are managed through JPA annotations
- CORS is enabled for all origins (configure appropriately for production)
