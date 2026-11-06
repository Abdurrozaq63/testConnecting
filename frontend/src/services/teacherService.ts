import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface TeacherObject {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassTeacherRelation {
  teacherId: number;
  classId: number;
  teacher: TeacherObject;
}

export interface ClassWithTeachers {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  classTeachers: ClassTeacherRelation[];
}

export interface ClassItem {
  id: number;
  name: string;
}

export interface TeacherPayload {
  name: string;
  email: string;
  phone?: string;
  classTeacher: number[]; // Array ID kelas yang diajar
}

export const teacherService = {
  // Mengambil daftar kelas beserta guru di dalamnya
  getTeachersByClass: async (): Promise<ClassWithTeachers[]> => {
    const response = await axios.get<{ data: ClassWithTeachers[] }>(
      `${API_URL}/teachers`,
    );
    return response.data.data;
  },

  // Mengambil daftar seluruh kelas untuk pilihan form
  getClasses: async (): Promise<ClassItem[]> => {
    const response = await axios.get<{ data: ClassItem[] }>(
      `${API_URL}/classes`,
    );
    return response.data.data;
  },

  // Menambah guru baru
  createTeacher: async (payload: TeacherPayload) => {
    const response = await axios.post(`${API_URL}/teachers`, payload);
    return response.data;
  },

  // Memperbarui data guru
  updateTeacher: async (id: number, payload: TeacherPayload) => {
    const response = await axios.put(`${API_URL}/teachers/${id}`, payload);
    return response.data;
  },

  // Menghapus guru
  deleteTeacher: async (id: number) => {
    const response = await axios.delete(`${API_URL}/teachers/${id}`);
    return response.data;
  },
};
