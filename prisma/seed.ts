import { PrismaClient } from "../generated/prisma";
import * as argon from "argon2";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return await argon.hash(password);
}

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data
  //await prisma.user.deleteMany();
  console.log("🧹 Cleared existing users");

  // Create mock users
  const mockUsers = [
    {
      name: "Alice Cadete",
      email: "alice.cadete@rocketcorp.com",
      password: await hashPassword("password123"),
    },
    {
      name: "Arthur Lins",
      email: "arthur.lins@rocketcorp.com",
      password: await hashPassword("password123"),
    },
    {
      name: "Erico Chen",
      email: "erico.chen@rocketcorp.com",
      password: await hashPassword("password123"),
    },
    {
      name: "Luan Bezerra",
      email: "luan.bezerra@rocketcorp.com",
      password: await hashPassword("password123"),
    },
    {
      name: "José Mário",
      email: "jose.mario@rocketcorp.com",
      password: await hashPassword("password123"),
    },
    {
      name: "Raylandson Cesário",
      email: "raylandson.cesario@rocketcorp.com",
      password: await hashPassword("password123"),
    },
    {
      name: "John Doe",
      email: "john.doe@example.com",
      password: await hashPassword("demo123"),
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      password: await hashPassword("demo123"),
    },
    {
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      password: await hashPassword("demo123"),
    },
    {
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      password: await hashPassword("demo123"),
    },
    {
      name: "Admin User",
      email: "admin@rocketcorp.com",
      password: await hashPassword("admin123"),
    },
    {
      name: "Test User",
      email: "test@rocketcorp.com",
      password: await hashPassword("test123"),
    },
  ];

  // Insert users
  for (const userData of mockUsers) {
    const user = await prisma.user.create({
      data: userData,
    });
    console.log(`👤 Created user: ${user.name} (${user.email})`);
  }

  console.log(`✅ Seeding completed! Created ${mockUsers.length} users.`);

  // Display summary
  const totalUsers = await prisma.user.count();
  console.log(`📊 Total users in database: ${totalUsers}`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
