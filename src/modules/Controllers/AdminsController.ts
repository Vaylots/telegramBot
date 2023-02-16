import { PrismaClient } from "@prisma/client";
export class AdminController {
  prisma;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async findUserById(userId: number) {
    await this.prisma.$connect();
    const admin = this.prisma.admins.findFirst({
      where: {
        userId: userId,
      },
    });
    return admin;
  }
}
