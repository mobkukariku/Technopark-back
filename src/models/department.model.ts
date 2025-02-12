import mongoose, { Schema, Document } from "mongoose";

export interface IDepartment extends Document {
    name: string;
    headId: mongoose.Types.ObjectId;
    members?: mongoose.Types.ObjectId[];
    parentDepartmentId: mongoose.Types.ObjectId | null;
    subDepartments: IDepartment[];
}

const DepartmentSchema = new Schema<IDepartment>({
    name: { type: String, required: true },
    headId: { type: Schema.Types.ObjectId, ref: "Member", default: null },
    parentDepartmentId: { type: Schema.Types.ObjectId, ref: "Department", default: null },
    members: [{ type: Schema.Types.ObjectId, ref: "Member" }],
    subDepartments: [{ type: Schema.Types.ObjectId, ref: "Department" }],
});

DepartmentSchema.pre("save", async function (next) {
    const department = this as IDepartment;

    if (department.parentDepartmentId) {
        let currentParent = await mongoose.model("Department").findById(department.parentDepartmentId);


        while (currentParent) {
            if (currentParent._id.equals(department._id)) {
                return next(new Error("Циклическая зависимость департаментов запрещена"));
            }
            currentParent = await mongoose.model("Department").findById(currentParent.parentDepartment);
        }
    }

    next();
});

export default mongoose.model<IDepartment>("Department", DepartmentSchema);
