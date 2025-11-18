import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create default packages
  const packages = [
    // Instagram Packages
    { name: 'Instagram Starter', platform: 'Instagram', quantity: 1000, price: 50000, description: 'Pemula cocok untuk mencoba' },
    { name: 'Instagram Professional', platform: 'Instagram', quantity: 5000, price: 200000, description: 'Untuk influencer pemula' },
    { name: 'Instagram Business', platform: 'Instagram', quantity: 10000, price: 350000, description: 'Untuk bisnis dan profesional' },
    { name: 'Instagram Master', platform: 'Instagram', quantity: 25000, price: 750000, description: 'Paket premium untuk master' },
    
    // TikTok Packages
    { name: 'TikTok Basic', platform: 'TikTok', quantity: 1000, price: 45000, description: 'Pemula TikTok' },
    { name: 'TikTok Popular', platform: 'TikTok', quantity: 5000, price: 180000, description: 'Menuju popularitas' },
    { name: 'TikTok Viral', platform: 'TikTok', quantity: 10000, price: 300000, description: 'Paket viral TikTok' },
    { name: 'TikTok Sensation', platform: 'TikTok', quantity: 25000, price: 650000, description: 'Menjadi sensasi TikTok' },
    
    // YouTube Packages
    { name: 'YouTube Starter', platform: 'YouTube', quantity: 500, price: 75000, description: 'Subscriber YouTube pemula' },
    { name: 'YouTube Creator', platform: 'YouTube', quantity: 2000, price: 250000, description: 'Untuk content creator' },
    { name: 'YouTube Influencer', platform: 'YouTube', quantity: 5000, price: 500000, description: 'Paket influencer YouTube' },
    { name: 'YouTube Master', platform: 'YouTube', quantity: 10000, price: 900000, description: 'Master YouTube creator' },
    
    // Twitter Packages
    { name: 'Twitter Basic', platform: 'Twitter', quantity: 1000, price: 40000, description: 'Followers Twitter dasar' },
    { name: 'Twitter Trending', platform: 'Twitter', quantity: 5000, price: 150000, description: 'Agar trending di Twitter' },
    { name: 'Twitter Viral', platform: 'Twitter', quantity: 10000, price: 250000, description: 'Paket viral Twitter' },
    { name: 'Twitter Elite', platform: 'Twitter', quantity: 25000, price: 550000, description: 'Elite Twitter user' },
    
    // Facebook Packages
    { name: 'Facebook Starter', platform: 'Facebook', quantity: 1000, price: 35000, description: 'Facebook page starter' },
    { name: 'Facebook Business', platform: 'Facebook', quantity: 5000, price: 120000, description: 'Untuk halaman bisnis' },
    { name: 'Facebook Popular', platform: 'Facebook', quantity: 10000, price: 200000, description: 'Halaman Facebook populer' },
    { name: 'Facebook Enterprise', platform: 'Facebook', quantity: 25000, price: 450000, description: 'Enterprise Facebook page' },
  ];

  for (const pkg of packages) {
    const existingPackage = await prisma.package.findFirst({
      where: {
        name: pkg.name,
        platform: pkg.platform,
        quantity: pkg.quantity
      }
    });

    if (!existingPackage) {
      await prisma.package.create({
        data: pkg
      });
    }
  }

  console.log('Default packages created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });