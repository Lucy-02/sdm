import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('brideImage,groomImage', 2, {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async upload(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length !== 2) {
      throw new BadRequestException(
        'Both bride and groom images are required',
      );
    }

    return await this.uploadService.handleImageUpload(files);
  }
}
