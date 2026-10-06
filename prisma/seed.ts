import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  const seedPassword = process.env.SEED_PASSWORD;
  if (!seedPassword && process.env.NODE_ENV === 'production') {
    throw new Error('SEED_PASSWORD must be set before seeding a production database.');
  }
  // A development-only fallback keeps the demo seed usable locally.
  const passwordHash = await bcrypt.hash(seedPassword || 'password123', 10);

  // Create departments
  const departments = await prisma.department.createMany({
    data: [
      {
        name: 'Information Technology (IT) & Cloud Systems',
        code: 'IT',
        description: 'Manages enterprise software infrastructure, cloud databases, billing OSS/BSS, IT operations, and internal web applications.',
        max_apprentices: 25,
        current_apprentices: 18,
        head_name: 'Dr. Getachew Bekele',
        location: 'Ethio Telecom HQ, Bole, Addis Ababa',
        required_skills: JSON.stringify(['React', 'Node.js', 'Cloud', 'DevOps'])
      },
      {
        name: 'Network Infrastructure & 5G Engineering',
        code: 'NET',
        description: 'Manages fiber optic networks, 5G base stations, microwave links, core network elements, and network monitoring systems.',
        max_apprentices: 30,
        current_apprentices: 22,
        head_name: 'Eng. Solomon Tadesse',
        location: 'Network Operations Center, Addis Ababa',
        required_skills: JSON.stringify(['5G', 'Fiber Optics', 'Networking', 'Cisco'])
      },
      {
        name: 'Digital Financial Services (Telebirr)',
        code: 'FIN',
        description: 'Manages mobile money platform, payment gateway integrations, fintech APIs, and digital wallet systems.',
        max_apprentices: 20,
        current_apprentices: 15,
        head_name: 'Wro. Tigist Assefa',
        location: 'Telebirr HQ, Bole, Addis Ababa',
        required_skills: JSON.stringify(['Fintech', 'APIs', 'Security', 'Mobile'])
      },
      {
        name: 'Customer Service & Support',
        code: 'CS',
        description: 'Manages call center operations, customer relationship management, support ticket systems, and service quality monitoring.',
        max_apprentices: 35,
        current_apprentices: 28,
        head_name: 'Ato. Kifle Demissie',
        location: 'Customer Service Center, Bole, Addis Ababa',
        required_skills: JSON.stringify(['CRM', 'Communication', 'Support', 'Analytics'])
      },
      {
        name: 'Enterprise Business Solutions',
        code: 'EBS',
        description: 'Manages corporate client solutions, B2B services, enterprise connectivity, and business process automation.',
        max_apprentices: 15,
        current_apprentices: 12,
        head_name: 'Drs. Almaz Haile',
        location: 'Business Center, Kazanchis, Addis Ababa',
        required_skills: JSON.stringify(['B2B', 'Enterprise', 'Sales', 'Solutions'])
      }
    ]
  });

  console.log(`✅ Created ${departments.count} departments`);

  // Get department IDs
  const deptIT = await prisma.department.findUnique({ where: { code: 'IT' } });
  const deptNET = await prisma.department.findUnique({ where: { code: 'NET' } });

  // Create users
  const users = await prisma.user.createMany({
    data: [
      {
        username: 'admin',
        email: 'admin@ethiotelecom.et',
        full_name: 'Abebe Bikila (Admin)',
        role: 'SYSTEM_ADMIN',
        phone: '+251911223344',
        password_hash: passwordHash,
        is_active: true
      },
      {
        username: 'hrmanager',
        email: 'hr.manager@ethiotelecom.et',
        full_name: 'Bethlehem Tilahun (HR Director)',
        role: 'HR_MANAGER',
        phone: '+251911556677',
        password_hash: passwordHash,
        is_active: true
      },
      {
        username: 'depthead_it',
        email: 'dept.it@ethiotelecom.et',
        full_name: 'Dr. Getachew Bekele',
        role: 'DEPARTMENT_HEAD',
        department_id: deptIT?.id,
        department_name: deptIT?.name,
        phone: '+251911889900',
        password_hash: passwordHash,
        is_active: true
      },
      {
        username: 'depthead_net',
        email: 'dept.network@ethiotelecom.et',
        full_name: 'Eng. Solomon Tadesse',
        role: 'DEPARTMENT_HEAD',
        department_id: deptNET?.id,
        department_name: deptNET?.name,
        phone: '+251912112233',
        password_hash: passwordHash,
        is_active: true
      },
      {
        username: 'mentor_kebede',
        email: 'mentor.kebede@ethiotelecom.et',
        full_name: 'Eng. Kebede Kassahun',
        role: 'MENTOR',
        department_id: deptIT?.id,
        department_name: deptIT?.name,
        phone: '+251913334455',
        password_hash: passwordHash,
        is_active: true
      }
    ]
  });

  console.log(`✅ Created ${users.count} users`);

  // Create screening criteria
  await prisma.screeningCriteriaConfig.create({
    data: {
      min_gpa: 3.0,
      passing_score: 60,
      gpa_weight: 30,
      field_weight: 20,
      university_weight: 15,
      skills_weight: 15,
      recommendation_weight: 10,
      cv_weight: 10
    }
  });

  console.log('✅ Created screening criteria');
  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
