import dotenv from 'dotenv';

const loadEnv = () => {
  dotenv.config();

  if (
    !process.env.MONGO_URL ||
    !process.env.JWT_ACCESS_SECRET ||
    !process.env.JWT_REFRESH_SECRET ||
    !process.env.PORT ||
    !process.env.NODE_ENV
  ) {
    console.error('Environment variables missing');
    process.exit(1);
  }
};

loadEnv();

export default loadEnv;
