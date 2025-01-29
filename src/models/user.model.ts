import mongoose from "mongoose";

export interface User {
    name: string;
    surname: string;
    email: string;
    password: string;
    imageURL: string;
    role: "member" | "admin";
}

const userSchema = new mongoose.Schema<User>({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    imageURL: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: ["admin", "member"],
        default: "member",
    },
},
    {timestamps: true},
)


const User = mongoose.model<User>("User", userSchema);

export default User;