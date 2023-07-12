import dotenv from 'dotenv';
import { Client, Environment } from 'square';
dotenv.config();

const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox,
});

export default squareClient;
