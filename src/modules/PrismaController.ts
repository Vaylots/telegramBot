import { PrismaClient } from "@prisma/client";
export class PrismaController {
  prisma;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async findUserById(userId: number) {
    await this.prisma.$connect();
    const user = this.prisma.users.findFirst({
      where: {
        userId: userId,
      },
    });
    return user;
  }

  async addUser(username: string | undefined, userId: number) {
    await this.prisma.$connect();
    const user = await this.findUserById(userId);
    if (user) {
      await this.prisma.$disconnect();
      return;
    }
    await this.prisma.users.create({
      data: {
        username: username,
        userId: userId,
      },
    });
    await this.prisma.$disconnect();
  }
}
