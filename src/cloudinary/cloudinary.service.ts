import { Inject, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';


@Injectable()
export class CloudinaryService {
    constructor(@Inject('CLOUDINARY') private cloudinary) { }

    async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            this.cloudinary.uploader.upload_stream(
                { resource_type: 'auto', fomart: 'pdf' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            ).end(file.buffer);
        });
    }

    async deleteFile(publicId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    }
}
