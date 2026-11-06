import { useState, useEffect } from 'react';
import { classService, type ClassAllItem } from '../services/classService';

export function useAllClasses() {
  const [classesData, setClassesData] = useState<ClassAllItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClassesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await classService.getAllClassesData();
      setClassesData(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data kelas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassesData();
  }, []);

  return {
    classesData,
    loading,
    error,
    refetch: fetchClassesData,
  };
}
