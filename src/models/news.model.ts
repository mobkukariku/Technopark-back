import mongoose from "mongoose";

export interface News {
    title: string;
    content: string;
    imageURL: string;
    tags: string[];
    authorId: mongoose.Types.ObjectId;
}

const newsSchema = new mongoose.Schema<News>({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    imageURL: {
        type: String,
        default: 'https://assets-global.website-files.com/6275222db3d827e224b5c025/6275222db3d827ac5eb5c0cb_product-image__no-photo-p-2600.webp',
    },
    tags: [{
        type: String,
        enum: ['guests', 'events', 'competitions', 'other'],
        required: true,
        default: ['other'],
    }],
    authorId: [{
        type: mongoose.Types.ObjectId,
        required: true,
    }]
},
    {timestamps: true},
)

const News = mongoose.model<News>('News', newsSchema);

export default News;