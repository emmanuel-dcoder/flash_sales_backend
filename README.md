# Flash Sale System

## Base Url

- https://flash-sales-backend.onrender.com

## Documentation Link

- https://documenter.getpostman.com/view/23195379/2sAYdiopcg

## Setup

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up environment variables in `.env`.
4. Start the server: `npm run dev` or `npm start`.

## Environment Variables

- `MONGO_URL`: MongoDB connection string.
- `PORT`: Server port (default: 5000).
- `TOKEN_EXPIRE_IN`: JWT expiry.
- `SECRET_KEY`: JWT secret key.
- `CLOUDINARY_NAME`: Cloudinary account name for image.
- `CLOUDINARY_API_KEY`: Cloudinary account api key.
- `PAYSTACK_SK_KEY`: Paystack account key.
- `PAYSTACK_BASE_URL`: Paystack account base url, use "https://api.paystack.co".
- `GMAIL_APP_KEY`: SMTP gmail password.
- `GMAIL_APP`: SMTP gmail email or username.
- `MAIL_PORT`: SMTP gmail mail port, usually "465".
- `MAIL_HOST`: SMTP gmail mail host, usually "smtp.gmail.com".

# API Endpoints

### User & Auth

- `POST /api/v1/user`: to create or register user (role could seller or buyer).
- `POST /api/v1/user/login`: to login.
- `POST /api/v1/user/forgot-password`: forgot password otp.
- `POST /api/v1/user/reset-password`: for resetting password.
- `PUT /api/v1/user/profile-image`: to upload user profile image.

### Product

- `POST /api/v1/product`: to Create a product.
- `PUT /api/v1/product/fetch`: to fetch all products.
- `PUT /api/v1/product/reset/:d`: to reset or restore product all products.
- `GET /api/v1/product/fetch`: Fetch all products, you can use query params to dynamically get them.
- `GET /api/v1/product/fetch-one/:id`: to fetch single product.

### Payment

#### Note: Once you initiate payment and use the payment url successfully, webhook configuration verify the payment.

- `POST /api/v1/payment`: Create or initiate payment for product.
- `GET /api/v1/payment?status=paid`: Fetch all paid payment.

### Leadership

- `GET /api/v1/leadership`: Fetch User that has made payment for product.
