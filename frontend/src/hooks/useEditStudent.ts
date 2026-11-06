import { useState, useEffect } from 'react';
import {
  studentService,
  type ClassItem,
  type StudentPayload,
} from '../services/studentService';

export interface StudentDataToEdit extends StudentPayload {
  id: number;
}

export function useEditStudent(
  initialStudent: StudentDataToEdit,
  onSuccess: () => void,
) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [name, setName] = useState<string>(initialStudent.name);
  const [email, setEmail] = useState<string>(initialStudent.email);
  const [classId, setClassId] = useState<number | ''>(initialStudent.classId);

  const [loadingClasses, setLoadingClasses] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Hanya ambil daftar kelas untuk dropdown
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

  const handleSubmit = async (payload: StudentPayload) => {
    try {
      setSubmitting(true);
      setError(null);
      await studentService.updateStudent(initialStudent.id, payload);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memperbarui data murid.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    classes,
    name,
    setName,
    email,
    setEmail,
    classId,
    setClassId,
    loadingClasses,
    submitting,
    error,
    handleSubmit,
  };
}
