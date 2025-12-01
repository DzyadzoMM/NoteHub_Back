import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import { errors } from "celebrate";
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 3030;

app.use(logger);
//app.use(express.json());
//POST
app.use(express.json({
  type: ['application/json', 'application/vnd.api+json'],
}));
app.use(cors());
app.use(cookieParser());

//Test-error
/*app.get('/test-error', () => {
  throw new Error('Simulated server error');
});*/

//підключаємо групу маршрутів користувачів
app.use(authRoutes);
//підключаємо групу маршрутів нотаток
app.use(notesRoutes);
//підключаємо групу маршрутів user
app.use(userRoutes);
// 404 — якщо маршрут не знайдено
app.use(notFoundHandler);

// error 'celebrate'
app.use(errors());

// Error — якщо під час запиту виникла помилка
app.use(errorHandler);

// підключення до MongoDB 
await connectMongoDB();

app.listen(PORT, ()=>{
    console.log(`Server is running at port ${PORT}`);
})