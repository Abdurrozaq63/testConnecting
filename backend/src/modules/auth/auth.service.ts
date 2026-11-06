import { Prisma } from '@prisma/client';

import { prisma } from '../../lib/prisma';

export const authService = {
  findUserByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  createUser: async (data: Prisma.UserCreateInput) => {
    return prisma.user.create({
      data,
    });
  },
};
