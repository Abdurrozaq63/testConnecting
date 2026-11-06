export interface Student {
  id: number;
  name: string;
  email: string;
  classId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClassWithStudents {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  students: Student[];
}

export interface StudentApiResponse {
  data: ClassWithStudents[];
}
