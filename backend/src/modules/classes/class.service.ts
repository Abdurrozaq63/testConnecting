import { prisma } from '../../lib/prisma';

export const getAllClasses = async () => {
  return prisma.schoolClass.findMany();
};

export const createClass = async (data: { name: string }) => {
  return prisma.schoolClass.create({
    data,
  });
};

export const updateClass = async (id: number, data: { name: string }) => {
  return prisma.schoolClass.update({
    where: { id },
    data,
  });
};

export const deleteClass = async (id: number) => {
  return prisma.schoolClass.delete({
    where: { id },
  });
};
