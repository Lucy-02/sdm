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

  // 4. Create Vendors with embedded images and tags (30 vendors, 6 per category)
  console.log('🏢 Creating vendors with embedded data...');
  const vendors: any[] = [];
  const vendorOwners = users.filter((u: any) => u.role === 'VENDOR');

  // 카테고리별 업체 이름 데이터
  const vendorNames: Record<string, string[]> = {
    studio: [
      '라루체 스튜디오', '소울메이트 스튜디오', '아뜰리에드마리',
      '루미에르 포토', '더클래식 스튜디오', '모먼트 스튜디오'
    ],
    makeup: [
      '제니하우스 뷰티', '글로우업 메이크업', '뷰티바이유',
      '셀린 메이크업', '로즈골드 뷰티', '아트메이크업 스튜디오'
    ],
    dress: [
      '라비앙로즈 드레스', '블랑쉬 웨딩', '그레이스 드레스 부티크',
      '소피아 브라이덜', '드림웨딩 드레스', '벨라 쿠튀르'
    ],
    venue: [
      '더채플 앳 청담', '그랜드힐튼 웨딩홀', '파라다이스시티 웨딩',
      '포시즌스 서울', '반얀트리 클럽앤스파', '시그니엘 웨딩'
    ],
    car: [
      '로얄웨딩카', '프리미엄 웨딩카', '클래식카 웨딩렌탈',
      '럭셔리 웨딩카', '엘레강스 웨딩카', 'VIP 웨딩카 서비스'
    ],
  };

  // 카테고리별 설명 데이터
  const vendorDescriptions: Record<string, string[]> = {
    studio: [
      '15년 경력의 전문 포토그래퍼가 당신의 특별한 순간을 담아드립니다. 자연광 스튜디오와 최신 장비를 갖추고 있습니다.',
      '감성적이고 자연스러운 웨딩 촬영을 추구합니다. 야외 로케이션 전문 스튜디오입니다.',
      '프렌치 감성의 아뜰리에 스튜디오에서 영화같은 웨딩 촬영을 경험하세요.',
      '빛을 다루는 전문가들이 만드는 웨딩 포토. 20년 노하우의 조명 기술로 최상의 결과물을 약속합니다.',
      '클래식하고 우아한 웨딩 촬영 전문. 타임리스한 아름다움을 선사합니다.',
      '순간을 영원으로 만드는 특별한 웨딩 스냅 촬영. 젊은 감성의 트렌디한 스튜디오입니다.',
    ],
    makeup: [
      '자연스러운 윤광 메이크업으로 신부의 아름다움을 극대화합니다. 한복/양장 모두 가능합니다.',
      '글로우한 피부 표현 전문. 촬영용 HD메이크업부터 본식 메이크업까지 토탈 서비스 제공합니다.',
      '신부 맞춤형 컬러 컨설팅으로 가장 아름다운 컬러를 찾아드립니다.',
      '셀럽들의 웨딩 메이크업을 담당하는 메이크업 아티스트의 프리미엄 서비스입니다.',
      '로즈골드 톤의 시그니처 메이크업으로 사랑받는 뷰티살롱입니다.',
      '예술적 감각으로 신부를 가장 빛나게 만들어 드립니다.',
    ],
    dress: [
      '프랑스 감성의 로맨틱 드레스 컬렉션. 맞춤 제작 및 프리미엄 임대 서비스를 제공합니다.',
      '순백의 아름다움. 미니멀하고 세련된 디자인의 웨딩드레스 전문샵입니다.',
      '빈티지부터 모던까지, 다양한 스타일의 드레스를 한 곳에서 만나보세요.',
      '뉴욕 스타일의 모던 웨딩드레스. 해외 디자이너 드레스 독점 보유.',
      '신부님의 꿈을 현실로 만들어 드립니다. 1:1 맞춤 상담 제공.',
      '파리 오뜨 꾸뛰르 감성의 하이엔드 웨딩드레스 부티크입니다.',
    ],
    venue: [
      '청담동 프라이빗 채플. 50인 이하 소규모 웨딩에 완벽한 공간입니다.',
      '그랜드 볼룸에서 펼쳐지는 호화로운 호텔 웨딩. 최대 500명 수용 가능.',
      '바다가 보이는 리조트 웨딩. 인천 영종도에서 만나는 특별한 예식.',
      '도심 속 럭셔리 호텔 웨딩. 미쉐린 셰프의 웨딩 코스 요리 제공.',
      '자연 속 힐링 웨딩. 아름다운 정원과 함께하는 야외 예식 전문입니다.',
      '서울에서 가장 높은 곳에서 펼쳐지는 스카이 웨딩. 123층의 황홀한 전망.',
    ],
    car: [
      '롤스로이스, 벤틀리 등 최고급 웨딩카 렌탈. 전문 기사 포함 서비스.',
      'S클래스, 마이바흐 등 프리미엄 세단 전문. 안전하고 편안한 웨딩 이동.',
      '빈티지 클래식카로 특별한 웨딩을 연출하세요. 포토존 렌탈도 가능합니다.',
      '링컨 리무진, 캐딜락 에스컬레이드 등 럭셔리 웨딩카 보유.',
      '우아함과 품격을 더하는 웨딩카 서비스. 장식 및 꽃 데코 무료.',
      'VVIP 전용 보안 서비스 포함 웨딩카. 프라이버시를 최우선으로 합니다.',
    ],
  };

  // 위치 데이터
  const locations = [
    { name: '서울특별시 강남구 청담동', lat: 37.5197, lng: 127.0474 },
    { name: '서울특별시 송파구 잠실동', lat: 37.5145, lng: 127.1058 },
    { name: '서울특별시 서초구 반포동', lat: 37.5048, lng: 127.0047 },
    { name: '서울특별시 마포구 상수동', lat: 37.5477, lng: 126.9230 },
    { name: '경기도 성남시 분당구', lat: 37.3825, lng: 127.1195 },
    { name: '서울특별시 용산구 한남동', lat: 37.5347, lng: 127.0008 },
  ];

  // 가격 범위 데이터 (카테고리별)
  const priceRanges: Record<string, { min: number; max: number }[]> = {
    studio: [
      { min: 100, max: 200 }, { min: 150, max: 300 }, { min: 200, max: 400 },
      { min: 80, max: 150 }, { min: 250, max: 500 }, { min: 120, max: 250 },
    ],
    makeup: [
      { min: 30, max: 60 }, { min: 40, max: 80 }, { min: 50, max: 100 },
      { min: 80, max: 150 }, { min: 35, max: 70 }, { min: 45, max: 90 },
    ],
    dress: [
      { min: 80, max: 200 }, { min: 100, max: 300 }, { min: 150, max: 400 },
      { min: 200, max: 500 }, { min: 60, max: 150 }, { min: 120, max: 280 },
    ],
    venue: [
      { min: 300, max: 600 }, { min: 500, max: 1000 }, { min: 400, max: 800 },
      { min: 600, max: 1200 }, { min: 350, max: 700 }, { min: 800, max: 1500 },
    ],
    car: [
      { min: 30, max: 80 }, { min: 50, max: 120 }, { min: 40, max: 100 },
      { min: 60, max: 150 }, { min: 35, max: 90 }, { min: 80, max: 200 },
    ],
  };

  // 영업 시간 변형
  const businessHoursVariants = [
    { mon: '09:00-18:00', tue: '09:00-18:00', wed: '09:00-18:00', thu: '09:00-18:00', fri: '09:00-18:00', sat: '10:00-18:00', sun: '휴무' },
    { mon: '10:00-19:00', tue: '10:00-19:00', wed: '10:00-19:00', thu: '10:00-19:00', fri: '10:00-19:00', sat: '10:00-20:00', sun: '11:00-17:00' },
    { mon: '09:00-20:00', tue: '09:00-20:00', wed: '09:00-20:00', thu: '09:00-20:00', fri: '09:00-20:00', sat: '09:00-20:00', sun: '10:00-18:00' },
    { mon: '10:00-18:00', tue: '10:00-18:00', wed: '휴무', thu: '10:00-18:00', fri: '10:00-18:00', sat: '10:00-19:00', sun: '10:00-17:00' },
    { mon: '11:00-20:00', tue: '11:00-20:00', wed: '11:00-20:00', thu: '11:00-20:00', fri: '11:00-21:00', sat: '11:00-21:00', sun: '12:00-18:00' },
    { mon: '09:30-18:30', tue: '09:30-18:30', wed: '09:30-18:30', thu: '09:30-18:30', fri: '09:30-18:30', sat: '10:00-17:00', sun: '예약제' },
  ];

  for (let catIdx = 0; catIdx < categories.length; catIdx++) {
    const category = categories[catIdx];
    const categoryTags = tags.filter((t) => t.categoryId === category.id);
    const categoryNames = vendorNames[category.slug] || [];
    const categoryDescriptions = vendorDescriptions[category.slug] || [];
    const categoryPrices = priceRanges[category.slug] || [];

    for (let i = 0; i < 6; i++) {
      const vendorNum = catIdx * 6 + i + 1;
      const locationData = locations[i % locations.length];
      const priceData = categoryPrices[i % categoryPrices.length];

      // 이미지 배열 생성 (임베디드)
      const numImages = 4 + Math.floor(Math.random() * 4); // 4-7장
      const images = [];
      for (let imgIdx = 0; imgIdx < numImages; imgIdx++) {
        images.push({
          url: `https://picsum.photos/seed/vendor-${vendorNum}-${imgIdx}/800/600`,
          type: imgIdx === 0 ? 'THUMBNAIL' : 'PORTFOLIO',
          displayOrder: imgIdx,
          altText: `${categoryNames[i]} 사진 ${imgIdx + 1}`,
        });
      }

      // 태그 배열 생성 (임베디드)
      const numTags = Math.min(2 + Math.floor(Math.random() * 2), categoryTags.length);
      const shuffledTags = [...categoryTags].sort(() => Math.random() - 0.5);
      const selectedTags = shuffledTags.slice(0, numTags).map(tag => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
      }));

      // 카테고리별 메타데이터
      let metadata: any = {};
      switch (category.slug) {
        case 'studio':
          metadata = {
            studioSize: `${80 + i * 30}평`,
            equipments: ['4K카메라', '조명장비', '배경세트', 'RED 카메라', '드론'].slice(0, 3 + (i % 3)),
            parkingAvailable: i % 2 === 0,
            outdoorAvailable: i < 3,
          };
          break;
        case 'makeup':
          metadata = {
            artistCount: 2 + i,
            specialties: ['웨딩메이크업', '한복메이크업', 'HD메이크업', '에어브러시'].slice(0, 2 + (i % 3)),
            travelService: i % 2 === 0,
            hairIncluded: i < 4,
          };
          break;
        case 'dress':
          metadata = {
            dressCount: 100 + i * 50,
            styles: ['클래식', '모던', '빈티지', '프린세스', '머메이드'].slice(0, 2 + (i % 4)),
            customMade: i < 3,
            accessoriesIncluded: i % 2 === 0,
          };
          break;
        case 'venue':
          metadata = {
            capacity: 100 + i * 80,
            parkingSpots: 30 + i * 20,
            hasChapel: i % 2 === 0,
            hasGarden: i < 3,
            cateringIncluded: i > 1,
          };
          break;
        case 'car':
          metadata = {
            carModels: ['롤스로이스 고스트', '벤틀리 플라잉스퍼', 'S클래스', '마이바흐', '링컨 리무진'].slice(0, 2 + (i % 3)),
            driverIncluded: true,
            decorationIncluded: i % 2 === 0,
            hourlyRental: i < 3,
          };
          break;
      }

      // 별점과 리뷰 수 생성 (현실적인 분포)
      const baseRating = 3.8 + Math.random() * 1.2; // 3.8 ~ 5.0
      const rating = Math.round(baseRating * 10) / 10;
      const reviewCount = 10 + Math.floor(Math.random() * 190); // 10 ~ 200
      const bookingCount = Math.floor(reviewCount * (0.3 + Math.random() * 0.4)); // 리뷰의 30~70%
      const favoriteCount = Math.floor(reviewCount * (0.5 + Math.random() * 1.5)); // 리뷰의 50~200%
      const viewCount = reviewCount * (20 + Math.floor(Math.random() * 30)); // 리뷰 * 20~50

      const vendor = await prisma.vendor.create({
        data: {
          categoryId: category.id,
          ownerId: vendorOwners[vendorNum % vendorOwners.length]?.id,
          name: categoryNames[i] || `${category.name} ${vendorNum}호점`,
          slug: `${category.slug}-${vendorNum}`,
          description: categoryDescriptions[i] || `${category.name} 전문 업체입니다. 최고의 서비스를 제공합니다.`,
          phone: `02-${String(1000 + vendorNum).padStart(4, '0')}-${String(5000 + vendorNum).padStart(4, '0')}`,
          email: `contact@${category.slug}${vendorNum}.co.kr`,
          website: `https://www.${category.slug}${vendorNum}.co.kr`,
          location: locationData.name,
          lat: locationData.lat + (Math.random() - 0.5) * 0.01,
          lng: locationData.lng + (Math.random() - 0.5) * 0.01,
          priceRange: `${priceData.min}만원~${priceData.max}만원`,
          priceMin: priceData.min,
          priceMax: priceData.max,
          businessHours: businessHoursVariants[i % businessHoursVariants.length],
          tags: selectedTags,
          images: images,
          metadata: metadata,
          rating: rating,
          reviewCount: reviewCount,
          bookingCount: bookingCount,
          favoriteCount: favoriteCount,
          viewCount: viewCount,
          isVerified: rating >= 4.5 || i < 2, // 높은 평점이거나 상위 업체
          isActive: true,
          isPremium: i === 0 || rating >= 4.8, // 첫번째이거나 높은 평점
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
