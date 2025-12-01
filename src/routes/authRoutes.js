import { Router } from 'express';
import { celebrate } from 'celebrate';
import {registerUser, loginUser, logoutUser, refreshUserSession, requestResetEmail, resetPassword} from '../controllers/authController.js'
import { registerUserSchema, loginUserSchema, requestResetEmailSchema, resetPasswordSchema } from '../validations/authValidation.js'


const router = Router();

// Реєстрація користувача
router.post('/auth/register', celebrate(registerUserSchema), registerUser);

//Логін користувача
router.post('/auth/login', celebrate(loginUserSchema), loginUser);

//Логаут користувача
router.post('/auth/logout', logoutUser);

//Оновлення сесії
router.post('/auth/refresh', refreshUserSession);

//Надсилання email для скидання паролю
router.post('/auth/request-reset-email', celebrate(requestResetEmailSchema), requestResetEmail);

// Скидання паролю
router.post('/auth/reset-password', celebrate(resetPasswordSchema), resetPassword);

export default router;


/*Реєстрація користувача
У файлі у src/routes/authRoutes.js реалізуйте маршрут POST /auth/register для реєстрації нового користувача.
Тіло запиту має містити:
email — рядок, email, обов’язкове;
password — рядок, мінімум 8 символів, обов’язкове (на сервері хешується через bcrypt).
Додайте валідацію вхідних даних за допомогою бібліотеки celebrate.

Логін користувача
У файлі у src/routes/authRoutes.js реалізуйте маршрут POST /auth/login для логіну зареєстрованого користувача.
Тіло запиту має містити:
email — рядок, email, обов’язкове
password — рядок, обов’язкове
Додайте валідацію вхідних даних за допомогою бібліотеки celebrate.

Оновлення сесії
У файлі у src/routes/authRoutes.js реалізуйте маршрут POST /auth/refreshдля для оновлення сесії користувача.
Маршрут не приймає тіло запиту, всі необхідні дані (sessionId, refreshToken) беруться з cookies.


Логаут користувача
У файлі src/routes/authRoutes.js реалізуйте маршрут POST /auth/logout для виходу користувача із системи.
Маршрут не приймає тіло запиту, усі необхідні дані (sessionId) беруться з cookies.
 */