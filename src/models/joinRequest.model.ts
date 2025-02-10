import mongoose, { Schema, Document } from "mongoose";

export interface JoinRequest {
    name: string;
    surname: string;
    email: string;
    message: string;
    direction: "software" | "hardware";
}

const joinRequestSchema = new Schema<JoinRequest & Document>({
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
            type: ["software", "hardware"],
            required: true,
        }],
    },
    { timestamps: true }
)
const Request = mongoose.model<JoinRequest>("JoinRequest", joinRequestSchema);

export default Request;