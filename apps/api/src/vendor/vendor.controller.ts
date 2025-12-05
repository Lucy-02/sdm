import { Controller, Get, Param, Query } from '@nestjs/common';
import { VendorService, VendorQueryDto } from './vendor.service';

@Controller('vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  // GET /vendors - 전체 업체 목록
  @Get()
  async findAll(@Query() query: any) {
    // Query 파라미터 타입 변환
    const parsedQuery: VendorQueryDto = {
      ...query,
      page: query.page ? parseInt(query.page) : undefined,
      limit: query.limit ? parseInt(query.limit) : undefined,
      priceMin: query.priceMin ? parseInt(query.priceMin) : undefined,
      priceMax: query.priceMax ? parseInt(query.priceMax) : undefined,
      tags: query.tags ? (Array.isArray(query.tags) ? query.tags : [query.tags]) : undefined,
    };
    return this.vendorService.findAll(parsedQuery);
  }

  // GET /vendors/categories - 카테고리 목록
  @Get('categories')
  async getCategories() {
    return this.vendorService.getCategories();
  }

  // GET /vendors/category/:slug - 카테고리별 업체 목록
  @Get('category/:slug')
  async findByCategory(
    @Param('slug') slug: string,
    @Query() query: any,
  ) {
    // Query 파라미터 타입 변환
    const parsedQuery: VendorQueryDto = {
      ...query,
      page: query.page ? parseInt(query.page) : undefined,
      limit: query.limit ? parseInt(query.limit) : undefined,
      priceMin: query.priceMin ? parseInt(query.priceMin) : undefined,
      priceMax: query.priceMax ? parseInt(query.priceMax) : undefined,
      tags: query.tags ? (Array.isArray(query.tags) ? query.tags : [query.tags]) : undefined,
    };
    return this.vendorService.findByCategory(slug, parsedQuery);
  }

  // GET /vendors/:id - 특정 업체 상세
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.vendorService.findOne(id);
  }
}
