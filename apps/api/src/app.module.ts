import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { UploadModule } from './upload/upload.module';
import { ProcessingModule } from './processing/processing.module';
import { VendorModule } from './vendor/vendor.module';
import { ResultModule } from './result/result.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    StorageModule,
    UploadModule,
    ProcessingModule,
    VendorModule,
    ResultModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
