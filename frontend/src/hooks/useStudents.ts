import { useState, useEffect } from 'react';
import { studentService } from '../services/studentService';
import { type ClassWithStudents } from '../types/student';

export function useStudents() {
  const [classesData, setClassesData] = useState<ClassWithStudents[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getStudentsByClass();
      setClassesData(data);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memuat data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsData();
  }, []);

  return {
    classesData,
    loading,
    error,
    refetch: fetchStudentsData, // Berguna jika ingin refresh data manual
  };
}
