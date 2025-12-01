import { Schema, model } from 'mongoose';

const userSchema = new Schema(
    {
        username: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: false,
            default: " https://ac.goit.global/fullstack/react/default-avatar.jpg",
        },
    },
    {
      timestamps: true,
      versionKey: false,
    },
);

userSchema.pre('save', function (next){
    if (!this.username){
        this.username = this.email;
    }
    next();
});

userSchema.methods.toJSON = function(){
    const obj = this.toObject();
    delete obj.password;
    return obj;
}

export const User = model("User", userSchema);


/*У файлі src/models/user.js створіть модель User із такими властивостями:
username — рядок, не обов’язкове поле, з параметром trim: true;
email — рядок, унікальне, обов’язкове, з параметром trim: true;
password — рядок, обов’язкове.

Для автоматичного створення полів createdAt та updatedAt, використовуйте параметр timestamps: true при створенні моделі.

Додайте до схеми userSchema метод toJSON, щоб видаляти пароль із об'єкта користувача перед відправкою у відповідь.
Створіть хук pre('save'), щоб за замовчуванням встановлювати username таким самим, як email, при створенні користувача.*/