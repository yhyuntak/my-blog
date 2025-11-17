import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // 1. Admin 사용자 생성
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      name: '관리자',
      email: 'admin@example.com',
      role: 'admin',
    },
  });

  console.log('✅ Admin user created:', {
    id: admin.id,
    username: admin.username,
    name: admin.name,
    role: admin.role,
  });

  // 2. 기본 카테고리 생성 (최상위 3개)
  const categories = [
    { name: '기술', slug: 'tech', order: 1 },
    { name: '일상', slug: 'life', order: 2 },
    { name: '프로젝트', slug: 'project', order: 3 },
  ];

  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: {
        name: categoryData.name,
        slug: categoryData.slug,
        order: categoryData.order,
        depth: 0,
        parentId: null,
      },
    });

    console.log(`✅ Category created: ${category.name} (${category.slug})`);
  }

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
