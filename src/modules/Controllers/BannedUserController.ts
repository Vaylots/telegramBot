import { PrismaClient } from "@prisma/client";
export class BannedUserController {
  prisma;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async findUserById(userId: number) {
    await this.prisma.$connect();
    const user = this.prisma.bannedUsers.findFirst({
      where: {
        userId: userId,
      },
    });
    return user;
  }
  async banUser(userId: number) {
    await this.prisma.$connect();
    const user = await this.findUserById(userId);
    if (user == null) {
      await this.prisma.bannedUsers.create({
        data: {
          userId: userId,
        },
      });
    } else {
      await this.prisma.$disconnect();
      return;
    }
    await this.prisma.$disconnect();
  }

  async unBanUser(userId: number) {
    await this.prisma.$connect();
    const user = await this.findUserById(userId);

    if (user == null) return;
    else {
      await this.prisma.bannedUsers.delete({
        where: {
          id: user.id,
        },
      });
    }
  }
}
