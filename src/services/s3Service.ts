import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../lib/aws";

const getKeyFromUrl = (url: string): string | null => {

    const regex = /https:\/\/[^/]+\/(.+)/;
    const match = url.match(regex);

    if (match && match[1]) {
        return match[1];
    }

    return null;
};

export const deleteImageFromS3 = async (imageURL: string): Promise<void> => {
    const imageKey = getKeyFromUrl(imageURL);

    if (!imageKey) {
        console.error('Не удалось извлечь ключ изображения из URL');
        throw new Error('Не удалось извлечь ключ изображения');
    }

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: imageKey,
    };

    try {
        const command = new DeleteObjectCommand(params);
        await s3.send(command);
        console.log(`Изображение ${imageKey} успешно удалено из S3`);
    } catch (err) {
        console.error('Ошибка при удалении изображения из S3:', err);
        throw err;
    }
};
