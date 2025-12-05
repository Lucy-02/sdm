import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProcessingService {
  constructor(private prisma: PrismaService) {}

  // Processing service methods (BullMQ, WebSocket) will be implemented here
}
