import { prisma } from '../../lib/prisma';

//point 6
export const getAllTeachers = async () => {
  return prisma.schoolClass.findMany({
    include: {
      classTeachers: {
        include: { teacher: true },
      },
    },
  });
};

//point 7
export const getAll = async () => {
  return prisma.schoolClass.findMany({
    include: {
      students: true,
      classTeachers: {
        include: { teacher: true },
      },
    },
  });
};

export const createTeacher = async (data: {
  name: string;
  email: string;
  phone?: string;
  classTeacher: number[];
}) => {
  return prisma.teacher.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      classTeachers: {
        create: data.classTeacher.map((classId) => ({
          schoolClass: {
            connect: {
              id: classId,
            },
          },
        })),
      },
    },
    include: {
      classTeachers: {
        include: {
          schoolClass: true,
        },
      },
    },
  });
};

export const updateTeacher = async (
  id: number,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    classTeacher?: number[];
  },
) => {
  const { classTeacher, ...teacherData } = data;

  return prisma.teacher.update({
    where: { id },
    data: {
      ...teacherData,
      ...(classTeacher !== undefined && {
        classTeachers: {
          deleteMany: {},
          create: classTeacher.map((classId) => ({
            schoolClass: {
              connect: { id: classId },
            },
          })),
        },
      }),
    },
    include: {
      classTeachers: {
        include: {
          schoolClass: true,
        },
      },
    },
  });
};

export const deleteTeacher = async (id: number) => {
  return prisma.teacher.delete({
    where: { id },
  });
};
