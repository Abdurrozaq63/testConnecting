import { prisma } from '../../lib/prisma';

//poin 5
export const getAllStudents = async () => {
  return prisma.schoolClass.findMany({
    include: {
      students: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const createStudent = async (data: {
  name: string;
  email: string;
  classId: number;
}) => {
  return prisma.student.create({
    data,
  });
};

type UpdateStudentInput = {
  nama?: string;
  email?: string;
  classId?: number;
};
export const updateStudent = async (id: number, data: UpdateStudentInput) => {
  const { classId, ...studentData } = data;

  return prisma.student.update({
    where: { id },
    data: {
      ...studentData,
      ...(classId && {
        schoolClass: {
          connect: { id: classId },
        },
      }),
    },
  });
};

export const deleteStudent = async (id: number) => {
  return prisma.student.delete({
    where: { id },
  });
};
