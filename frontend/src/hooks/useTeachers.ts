import { useState, useEffect } from 'react';
import {
  teacherService,
  type ClassWithTeachers,
} from '../services/teacherService';

export function useTeachers() {
  const [classesData, setClassesData] = useState<ClassWithTeachers[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachersData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teacherService.getTeachersByClass();
      setClassesData(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data guru.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachersData();
  }, []);

  return {
    classesData,
    loading,
    error,
    refetch: fetchTeachersData,
  };
}
