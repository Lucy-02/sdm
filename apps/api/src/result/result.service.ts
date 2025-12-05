import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResultService {
  constructor(private prisma: PrismaService) {}

  // Result service methods will be implemented here
}
