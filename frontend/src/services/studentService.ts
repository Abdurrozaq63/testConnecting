import axios from 'axios';
import { type ClassWithStudents } from '../types/student';

const API_URL = import.meta.env.VITE_API_URL;

export interface ClassItem {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentPayload {
  name: string;
  email: string;
  classId: number;
}

export interface StudentPayload {
  name: string;
  email: string;
  classId: number;
}

export interface StudentItem extends StudentPayload {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export const studentService = {
  // Mengambil seluruh data kelas beserta murid di dalamnya
  getStudentsByClass: async (): Promise<ClassWithStudents[]> => {
    try {
      const response = await axios.get<{ data: ClassWithStudents[] }>(
        `${API_URL}/students`,
      );
      return response.data.data;
    } catch (error) {
      console.error('Gagal mengambil data students:', error);
      throw error;
    }
  },

  // Mengambil daftar kelas untuk dropdown
  getClasses: async (): Promise<ClassItem[]> => {
    const response = await axios.get<{ data: ClassItem[] }>(
      `${API_URL}/classes`,
    );
    return response.data.data;
  },

  // Mengirim data murid baru
  createStudent: async (payload: CreateStudentPayload) => {
    const response = await axios.post(`${API_URL}/students`, payload);
    return response.data;
  },

  updateStudent: async (id: number, payload: StudentPayload) => {
    const response = await axios.put(`${API_URL}/students/${id}`, payload);
    return response.data;
  },

  deleteStudent: async (id: number) => {
    const response = await axios.delete(`${API_URL}/students/${id}`);
    return response.data;
  },
};
