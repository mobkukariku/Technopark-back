import mongoose from "mongoose";

export interface JoinRequest {
    name: string;
    surname: string;
    email: string;
    message: string;
    direction: "software" | "hardware";
}

const joinRequestSchema = new mongoose.Schema<JoinRequest>({
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
        message: {
            type: String,
            required: true,
        },
        direction: [{
            type: ["admin", "member"],
            required: true,
        }],
    },
    { timestamps: true }
)