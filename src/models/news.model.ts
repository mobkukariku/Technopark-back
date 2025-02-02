import mongoose, {Schema} from "mongoose";
import Date = mongoose.Schema.Types.Date;

export interface News {
    title: String,
    content: String,
    tags: [String],
    imageURL: String,
    authorId: mongoose.Types.ObjectId;
    createdAt: Date;
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
    }],
    createdAt: {
        type: Date,
    }
},
    {timestamps: true},
)

const News = mongoose.model<News>('News', newsSchema);

export default News;