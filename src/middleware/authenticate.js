import createHttpError from "http-errors";
import { Session } from "../models/session.js";
import { User } from "../models/user.js";

export const authenticate = async (req, res, next) =>{
    if(!req.cookies.accessToken){
        throw createHttpError(401, "Missing access token");
    }
    const session = await Session.findOne({
        accessToken: req.cookies.accessToken,
    });
    
    if(!session){
        throw createHttpError(401, "Session not found");
    }
     const isRefreshTokenExpired = new Date()>new Date(session.refreshTokenValidUntil);
        if(isRefreshTokenExpired){
            throw createHttpError(401, "Access token expired");
        }
    const user = await User.findById(session.userId);

      if(!user){
        throw createHttpError(401);
    }
    req.user = user;
    next();
};

/*
Middleware аутентифікації
У файлі src/middlewares/authenticate.js створіть middleware authenticate, який:
перевіряє наявність кукі accessToken. Якщо accessToken відсутній — повертає через createHttpError помилку зі статусом 401 і повідомленням 'Missing access token'. Якщо присутній — шукає у базі даних сесію за цим токеном. Якщо така сесія відсутня — повертає через createHttpError помилку зі статусом 401 і повідомленням 'Session not found';
перевіряє, чи не прострочений access-токен. Якщо прострочений — повертає через createHttpError помилку зі статусом 401 і повідомленням 'Access token expired';
шукає користувача, пов’язаного з цією сесією. Якщо такий користувач не знайдено — повертає через createHttpError помилку зі статусом 401 без повідомлення;
у разі успіху додає об’єкт знайденого користувача в req.user і викликає next().
*/ 