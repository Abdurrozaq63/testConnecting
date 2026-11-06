import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface StudentItem {
  id: number;
  name: string;
  email: string;
  classId: number;
}

export interface TeacherObject {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface ClassTeacherRelation {
  teacherId: number;
  classId: number;
  teacher: TeacherObject;
}

export interface ClassAllItem {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  students: StudentItem[];
  classTeachers: ClassTeacherRelation[];
}

export const classService = {
  // Mengambil seluruh data kelas beserta siswa dan gurunya
  getAllClassesData: async (): Promise<ClassAllItem[]> => {
    const response = await axios.get<{ getAll: ClassAllItem[] }>(
      `${API_URL}/teachers/all`,
    );
    return response.data.getAll;
  },

  // Menambah kelas baru
  createClass: async (name: string) => {
    const response = await axios.post(`${API_URL}/classes`, { name });
    return response.data;
  },

  // Memperbarui nama kelas
  updateClass: async (id: number, name: string) => {
    const response = await axios.put(`${API_URL}/classes/${id}`, { name });
    return response.data;
  },

  // Menghapus kelas
  deleteClass: async (id: number) => {
    const response = await axios.delete(`${API_URL}/classes/${id}`);
    return response.data;
  },
};
