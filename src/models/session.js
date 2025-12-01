import { Schema, model } from 'mongoose';

const sessionSchema = new Schema(
    {
       userId:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
       },
       accessToken:{
        type: String,
        required: true,
       },
       refreshToken:{
        type: String,
        required: true,
       },
       accessTokenValidUntil:{
        type: Date,
        required: true,
       },
       refreshTokenValidUntil:{
        type: Date,
        required: true,
       },
    },
    {
      timestamps: true,
      versionKey: false,
    },
);

export const Session = model("Session", sessionSchema);

/*
У файлі src/models/session.js створіть модель Session із такими властивостями:

userId — тип Schema.Types.ObjectId, обов’язкове;
accessToken — рядок, обов’язкове;
refreshToken — рядок, обов’язкове;
accessTokenValidUntil — тип Date, обов’язкове;
refreshTokenValidUntil — тип Date, обов’язкове.
Для автоматичного створення полів createdAt та updatedAt, використовуйте параметр timestamps: true при створенні моделі.
*/