import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface VendorQueryDto {
  categoryId?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'rating' | 'reviewCount' | 'priceMin' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// TODO: FATAL - NOT WORKING

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: VendorQueryDto = {}) {
    const {
      categoryId,
      location,
      priceMin,
      priceMax,
      tags,
      page = 1,
      limit = 20,
      sortBy = 'rating',
      sortOrder = 'desc',
    } = query;

    // 필터 조건 구성
    const where: any = {
      isActive: true,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive',
      };
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      where.AND = [];
      if (priceMin !== undefined) {
        where.AND.push({ priceMin: { gte: priceMin } });
      }
      if (priceMax !== undefined) {
        where.AND.push({ priceMax: { lte: priceMax } });
      }
    }

    // MongoDB JSON 필드 태그 필터링 (현재는 전체 조회 후 필터링)
    // TODO: MongoDB aggregation pipeline으로 최적화 가능

    // 페이지네이션
    const skip = (page - 1) * limit;

    // 데이터 조회
    const [allVendors, total] = await Promise.all([
      this.prisma.vendor.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      this.prisma.vendor.count({ where }),
    ]);

    // 태그 필터링 (JSON 필드 기반)
    let vendors = allVendors;
    if (tags && tags.length > 0) {
      vendors = allVendors.filter((vendor) => {
        if (!vendor.tags || !Array.isArray(vendor.tags)) return false;
        const vendorTags = vendor.tags as any[];
        return tags.some((tagSlug) =>
          vendorTags.some((vTag: any) => vTag.slug === tagSlug)
        );
      });
    }

    // images와 tags는 이미 JSON 필드로 포함됨
    return {
      data: vendors,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!vendor) {
      throw new Error('Vendor not found');
    }

    // 조회수 증가
    await this.prisma.vendor.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    // images와 tags는 이미 JSON 필드로 포함됨
    return vendor;
  }

  async findByCategory(categorySlug: string, query: VendorQueryDto = {}) {
    const category = await this.prisma.vendorCategory.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return this.findAll({
      ...query,
      categoryId: category.id,
    });
  }

  async getCategories() {
    return this.prisma.vendorCategory.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
      include: {
        _count: {
          select: {
            vendors: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
    });
  }
}
