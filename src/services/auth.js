import crypto from 'crypto'
import {FIFTEEN_MINUTES, ONE_DAY} from "../constants/time.js";
import { Session } from "../models/session.js";

export const createSession = (userId) =>{
    
    const accessToken = crypto.randomBytes(30).toString("base64");
    const refreshToken = crypto.randomBytes(30).toString("base64");

    return Session.create({
        userId,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now()+ FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now()+ ONE_DAY),
    })
};

//Створення Cookies
export const setSessionCookies = (res, session) => {
    res.cookie("accessToken", session.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite:"none",
        maxAge: FIFTEEN_MINUTES,
    });

    res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite:"none",
        maxAge: ONE_DAY,
    });

    res.cookie("sessionId", session._id, {
        httpOnly: true,
        secure: true,
        sameSite:"none",
        maxAge: ONE_DAY,
    });
};

/*У src/services/auth.js реалізуйте дві функції:

createSession(userId) — створює access та refresh токени, створює сесію в базі даних і повертає її;
setSessionCookies(res, session) — додає до відповіді три кукі:
accessToken
refreshToken
sessionId


При встановленні кожної кукі обов’язково використовуйте однакові параметри:

httpOnly: true
secure: true
sameSite: 'none'
maxAge: для accessToken — 15 хв, для refreshToken і sessionId — 1 день. */