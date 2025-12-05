import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed for MongoDB...');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.vendorCategory.deleteMany();
  await prisma.simulationResult.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users (20 users)
  console.log('👤 Creating users...');
  const users: any[] = [];
  for (let i = 1; i <= 20; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        name: `사용자${i}`,
        phone: `010-${String(1000 + i).padStart(4, '0')}-${String(5000 + i).padStart(4, '0')}`,
        password: 'hashed_password_here',
        role: i <= 15 ? 'CUSTOMER' : 'VENDOR',
        emailVerified: i % 3 !== 0,
        isActive: true,
        favoriteVendorIds: [], // 나중에 업데이트
      },
    });
    users.push(user);
  }
  console.log(`✅ Created ${users.length} users`);

  // 2. Create Vendor Categories
  console.log('📁 Creating vendor categories...');
  const categories = await Promise.all([
    prisma.vendorCategory.create({
      data: {
        slug: 'studio',
        name: '스튜디오',
        description: '웨딩 촬영 전문 스튜디오',
        icon: '📸',
        displayOrder: 1,
        isActive: true,
      },
    }),
    prisma.vendorCategory.create({
      data: {
        slug: 'makeup',
        name: '메이크업',
        description: '웨딩 메이크업 및 헤어',
        icon: '💄',
        displayOrder: 2,
        isActive: true,
      },
    }),
    prisma.vendorCategory.create({
      data: {
        slug: 'dress',
        name: '드레스',
        description: '웨딩드레스 및 예복',
        icon: '👗',
        displayOrder: 3,
        isActive: true,
      },
    }),
    prisma.vendorCategory.create({
      data: {
        slug: 'venue',
        name: '예식장',
        description: '웨딩홀 및 예식장',
        icon: '🏛️',
        displayOrder: 4,
        isActive: true,
      },
    }),
    prisma.vendorCategory.create({
      data: {
        slug: 'car',
        name: '웨딩카',
        description: '웨딩 전용 차량',
        icon: '🚗',
        displayOrder: 5,
        isActive: true,
      },
    }),
  ]);
  console.log(`✅ Created ${categories.length} categories`);

  // 3. Create Tags (15 tags)
  console.log('🏷️ Creating tags...');
  const tagData = [
    { name: '야외촬영', slug: 'outdoor', categoryId: categories[0].id },
    { name: '스냅촬영', slug: 'snap', categoryId: categories[0].id },
    { name: '본식촬영', slug: 'ceremony', categoryId: categories[0].id },
    { name: '한복메이크업', slug: 'hanbok-makeup', categoryId: categories[1].id },
    { name: '웨딩메이크업', slug: 'wedding-makeup', categoryId: categories[1].id },
    { name: '에어브러시', slug: 'airbrush', categoryId: categories[1].id },
    { name: '맞춤제작', slug: 'custom-made', categoryId: categories[2].id },
    { name: '임대드레스', slug: 'rental', categoryId: categories[2].id },
    { name: '한복', slug: 'hanbok', categoryId: categories[2].id },
    { name: '채플', slug: 'chapel', categoryId: categories[3].id },
    { name: '야외정원', slug: 'garden', categoryId: categories[3].id },
    { name: '호텔', slug: 'hotel', categoryId: categories[3].id },
    { name: '클래식카', slug: 'classic-car', categoryId: categories[4].id },
    { name: '리무진', slug: 'limousine', categoryId: categories[4].id },
    { name: '벤츠', slug: 'benz', categoryId: categories[4].id },
  ];
  const tags = await Promise.all(
    tagData.map((tag) =>
      prisma.tag.create({
        data: tag,
      })
    )
  );
  console.log(`✅ Created ${tags.length} tags`);

  // 4. Create Vendors with embedded images and tags (20 vendors, 4 per category)
  console.log('🏢 Creating vendors with embedded data...');
  const vendors: any[] = [];
  const vendorOwners = users.filter((u: any) => u.role === 'VENDOR');

  for (let catIdx = 0; catIdx < categories.length; catIdx++) {
    const category = categories[catIdx];
    const categoryTags = tags.filter((t) => t.categoryId === category.id);

    for (let i = 1; i <= 4; i++) {
      const vendorNum = catIdx * 4 + i;

      // 이미지 배열 생성 (임베디드)
      const numImages = 3 + Math.floor(Math.random() * 3);
      const images = [];
      for (let imgIdx = 0; imgIdx < numImages; imgIdx++) {
        images.push({
          url: `https://picsum.photos/seed/vendor-${vendorNum}-${imgIdx}/800/600`,
          type: imgIdx === 0 ? 'THUMBNAIL' : 'PORTFOLIO',
          displayOrder: imgIdx,
          altText: `${category.name} ${vendorNum}호점 사진 ${imgIdx + 1}`,
        });
      }

      // 태그 배열 생성 (임베디드)
      const numTags = Math.min(2 + Math.floor(Math.random() * 3), categoryTags.length);
      const selectedTags = categoryTags.slice(0, numTags).map(tag => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      }));

      const vendor = await prisma.vendor.create({
        data: {
          categoryId: category.id,
          ownerId: vendorOwners[vendorNum % vendorOwners.length]?.id,
          name: `${category.name} ${vendorNum}호점`,
          slug: `${category.slug}-${vendorNum}`,
          description: `${category.name} 전문 업체입니다. 최고의 서비스를 제공합니다.`,
          phone: `02-${String(1000 + vendorNum).padStart(4, '0')}-${String(5000 + vendorNum).padStart(4, '0')}`,
          email: `${category.slug}${i}@example.com`,
          website: `https://${category.slug}${i}.example.com`,
          location: ['서울특별시 강남구', '서울특별시 송파구', '경기도 성남시', '서울특별시 마포구'][i % 4],
          lat: 37.4 + (i * 0.05),
          lng: 127.0 + (i * 0.05),
          priceRange: `${i * 50}만원~${i * 100}만원`,
          priceMin: i * 50,
          priceMax: i * 100,
          businessHours: {
            mon: '09:00-18:00',
            tue: '09:00-18:00',
            wed: '09:00-18:00',
            thu: '09:00-18:00',
            fri: '09:00-18:00',
            sat: '09:00-20:00',
            sun: '10:00-17:00',
          },
          tags: selectedTags, // 임베디드 태그
          images: images, // 임베디드 이미지
          metadata: category.slug === 'studio' ? {
            studioSize: `${100 + i * 50}평`,
            equipments: ['4K카메라', '조명장비', '배경세트'],
          } : category.slug === 'venue' ? {
            capacity: 200 + i * 100,
            parkingSpots: 50 + i * 20,
            hasChapel: i % 2 === 0,
          } : {},
          rating: 4.0 + (i * 0.2),
          reviewCount: i * 10,
          bookingCount: i * 5,
          favoriteCount: i * 8,
          viewCount: i * 100,
          isVerified: i <= 2,
          isActive: true,
          isPremium: i === 1,
        },
      });
      vendors.push(vendor);
    }
  }
  console.log(`✅ Created ${vendors.length} vendors with embedded images and tags`);

  // 5. Create Favorites (User의 favoriteVendorIds 배열 업데이트)
  console.log('❤️ Creating favorites...');
  const customerUsers = users.filter((u: any) => u.role === 'CUSTOMER');
  let favoriteCount = 0;
  for (let i = 0; i < 20; i++) {
    const user = customerUsers[i % customerUsers.length];
    const vendor = vendors[i % vendors.length];

    await prisma.user.update({
      where: { id: user.id },
      data: {
        favoriteVendorIds: {
          push: vendor.id,
        },
      },
    });
    favoriteCount++;
  }
  console.log(`✅ Created ${favoriteCount} favorites`);

  // 6. Create Simulation Results (15 results)
  console.log('🎨 Creating simulation results...');
  const simulations: any[] = [];
  for (let i = 0; i < 15; i++) {
    const statusOptions = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'PROCESSING', 'PENDING'];
    const status = statusOptions[i % 5];

    const simulation = await prisma.simulationResult.create({
      data: {
        userId: customerUsers[i % customerUsers.length].id,
        groomImageUrl: `https://i.pravatar.cc/300?img=${i + 10}`,
        brideImageUrl: `https://i.pravatar.cc/300?img=${i + 30}`,
        outputImageUrl: status === 'COMPLETED'
          ? `https://picsum.photos/seed/wedding-${i}/1200/800`
          : null,
        status: status,
        concept: ['classic', 'modern', 'outdoor', 'vintage'][i % 4],
        metadata: {
          processingTime: status === 'COMPLETED' ? 45000 + i * 1000 : null,
          modelVersion: 'v2.1',
        },
        completedAt: status === 'COMPLETED' ? new Date(Date.now() - i * 86400000) : null,
      },
    });
    simulations.push(simulation);
  }
  console.log(`✅ Created ${simulations.length} simulation results`);

  // 7. Create Bookings (20 bookings)
  console.log('📅 Creating bookings...');
  const bookings: any[] = [];
  for (let i = 0; i < 20; i++) {
    const statusOptions = ['CONFIRMED', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'];
    const status = statusOptions[i % 5];

    const booking = await prisma.booking.create({
      data: {
        vendorId: vendors[i % vendors.length].id,
        userId: customerUsers[i % customerUsers.length].id,
        status: status,
        eventDate: new Date(Date.now() + (i * 7 + 30) * 86400000),
        guestCount: 100 + i * 20,
        budget: 200 + i * 50,
        message: `문의드립니다. ${i + 1}번째 예약입니다.`,
        vendorResponse: status !== 'PENDING' ? `답변드립니다. 감사합니다.` : null,
        metadata: {
          shootingDate: new Date(Date.now() + (i * 7 + 20) * 86400000).toISOString(),
        },
        confirmedAt: (status === 'CONFIRMED' || status === 'COMPLETED')
          ? new Date(Date.now() - i * 86400000)
          : null,
        completedAt: status === 'COMPLETED'
          ? new Date(Date.now() - i * 3600000)
          : null,
      },
    });
    bookings.push(booking);
  }
  console.log(`✅ Created ${bookings.length} bookings`);

  // 8. Create Reviews (15 reviews for completed bookings)
  console.log('⭐ Creating reviews...');
  const completedBookings = bookings.filter((b: any) => b.status === 'COMPLETED');
  const reviews: any[] = [];
  for (let i = 0; i < Math.min(15, completedBookings.length * 2); i++) {
    const booking = completedBookings[i % completedBookings.length];
    const review = await prisma.review.create({
      data: {
        vendorId: booking.vendorId,
        userId: booking.userId,
        bookingId: i < completedBookings.length ? booking.id : null,
        rating: 3 + Math.floor(Math.random() * 3),
        title: `정말 만족스러운 서비스였습니다 ${i + 1}`,
        content: `친절하고 전문적인 서비스에 매우 만족했습니다. 결혼 준비하시는 분들께 강력 추천합니다!`,
        images: [
          `https://picsum.photos/seed/review-${i}-1/400/300`,
          `https://picsum.photos/seed/review-${i}-2/400/300`,
        ],
        isVerified: i % 3 !== 0,
        response: i % 2 === 0 ? `감사합니다. 앞으로도 최선을 다하겠습니다.` : null,
        respondedAt: i % 2 === 0 ? new Date(Date.now() - i * 3600000) : null,
      },
    });
    reviews.push(review);
  }
  console.log(`✅ Created ${reviews.length} reviews`);

  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - Tags: ${tags.length}`);
  console.log(`   - Vendors: ${vendors.length}`);
  console.log(`   - Favorites: ${favoriteCount}`);
  console.log(`   - Simulation Results: ${simulations.length}`);
  console.log(`   - Bookings: ${bookings.length}`);
  console.log(`   - Reviews: ${reviews.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
