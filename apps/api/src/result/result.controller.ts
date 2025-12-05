import { Controller, Get } from '@nestjs/common';
import { ResultService } from './result.service';

@Controller('results')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Get()
  async findAll() {
    return { message: 'Results list endpoint - to be implemented' };
  }
}
