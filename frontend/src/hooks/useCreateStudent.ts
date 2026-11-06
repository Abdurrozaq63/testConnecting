import { useState, useEffect } from 'react';
import {
  studentService,
  type ClassItem,
  type CreateStudentPayload,
} from '../services/studentService';

export function useCreateStudent(onSuccess: () => void) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loadingClasses, setLoadingClasses] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Ambil data kelas saat komponen dipasang
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);
        const data = await studentService.getClasses();
        setClasses(data);
      } catch (err: any) {
        setError('Gagal memuat daftar kelas.');
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  const handleSubmit = async (payload: CreateStudentPayload) => {
    try {
      setSubmitting(true);
      setError(null);
      await studentService.createStudent(payload);
      onSuccess(); // Kembali ke halaman daftar murid jika berhasil
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menambahkan murid.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    classes,
    loadingClasses,
    submitting,
    error,
    handleSubmit,
  };
}
