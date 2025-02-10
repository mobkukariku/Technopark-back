import mongoose from "mongoose";

export interface Project {
    title: string;
    description: string;
    imageURLs: string[];
    direction: "software" | "hardware";
    authorId: string;
}

export const ProjectSchema = new mongoose.Schema<Project>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageURLs: [{
        type: Array,
        required: true,
    }],
    direction: {
        type: String,
        required: true,
    }
    },
    {timestamps: true,}
)

const Project = mongoose.model<Project>('Project', ProjectSchema);

export default Project;