import mongoose, { Schema, Document } from "mongoose";
import Department from "./department.model";


export interface IMember extends Document {
    studentId?: string;
    name: string;
    surname: string;
    email: string;
    position: string;
    phoneNumber: string;
    telegram: string;
    linkedinURL?: string;
    githubURL?: string;
    isHead: boolean;
    departmentId?: mongoose.Types.ObjectId;
}

const MemberSchema = new Schema<IMember>(
    {
        studentId: { type: String, trim: true },
        name: { type: String, required: true, trim: true },
        surname: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        position: { type: String, required: true },
        phoneNumber: { type: String, required: true, minlength: 10, maxlength: 15, trim: true },
        telegram: { type: String, trim: true },
        linkedinURL: { type: String, trim: true },
        githubURL: { type: String, trim: true },
        departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department"},
        isHead: { type: Boolean, default: false }
    },
);

MemberSchema.pre("save", async function (next) {
    const member = this as IMember;

    const existingDepartment = await Department.findOne({ headId: member._id });

    if (existingDepartment && member.departmentId) {
        return next(new Error("Этот человек уже является главой другого департамента и не может быть подчинённым"));
    }

    next();
});

export default mongoose.model<IMember>("Member", MemberSchema);
