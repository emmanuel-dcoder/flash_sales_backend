# Flash Sale System

## Base Url

- https://flash-sales-backend.onrender.com

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

## API Endpoints

- `GET /product`: Get product details.
- `POST /purchase`: Purchase a product.
- `GET /leaderboard`: Fetch the leaderboard.
