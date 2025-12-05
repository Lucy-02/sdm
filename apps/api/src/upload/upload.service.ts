import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) {}

  // Upload service methods will be implemented here
  async handleImageUpload(files: Express.Multer.File[]) {
    const [brideImage, groomImage] = files;

    // Here you can implement the logic to handle the uploaded images
    // For example, you might want to save them to a cloud storage or process them

    return {
      brideImageUrl: brideImage.path,
      groomImageUrl: groomImage.path,
    };
  }
}