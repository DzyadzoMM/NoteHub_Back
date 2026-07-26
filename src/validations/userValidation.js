import { Joi, Segments } from 'celebrate';

export const updateUserSchema = {
    [Segments.BODY]: Joi.object({
        username: Joi.string().trim().min(2).max(30).optional(),
        email: Joi.string().email().trim().optional(),
        password: Joi.string().min(8).optional(),
    }).min(1),
};