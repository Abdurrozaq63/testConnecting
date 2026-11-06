import React, { useState, useEffect } from 'react';
import {
  teacherService,
  type ClassItem,
  type TeacherObject,
} from '../services/teacherService';

export interface TeacherDataToEdit extends TeacherObject {
  classTeacher: number[];
}

interface EditTeacherPageProps {
  teacher: TeacherDataToEdit;
  onBack: () => void;
}

export default function EditTeacherPage({
  teacher,
  onBack,
}: EditTeacherPageProps) {
  const [name, setName] = useState(teacher.name);
  const [email, setEmail] = useState(teacher.email);
  const [phone, setPhone] = useState(teacher.phone || '');
  const [selectedClasses, setSelectedClasses] = useState<number[]>(
    teacher.classTeacher,
  );

  const [classesList, setClassesList] = useState<ClassItem[]>([]);
  const [loadingClasses, setLoadingClasses] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);
        const data = await teacherService.getClasses();
        setClassesList(data);
      } catch (err) {
        setError('Gagal memuat daftar kelas.');
      } finally {
        setLoadingClasses(false);
      }
    };
    fetchClasses();
  }, []);

  const handleCheckboxChange = (classId: number) => {
    setSelectedClasses((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClasses.length === 0) {
      setError('Pilih minimal satu kelas untuk guru ini.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await teacherService.updateTeacher(teacher.id, {
        name,
        email,
        phone,
        classTeacher: selectedClasses,
      });
      onBack();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memperbarui data guru.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">
            Edit Data Guru
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Perbarui informasi atau ubah kelas ajar guru.
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
          Kembali
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-700">
            Nama Lengkap
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-900"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-900"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-700">
            No. Telepon
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-900"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-700">
            Pilih Kelas Ajar
          </label>
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-neutral-200 p-3 max-h-40 overflow-y-auto">
            {loadingClasses ? (
              <p className="text-sm text-neutral-400 col-span-2">
                Memuat kelas...
              </p>
            ) : (
              classesList.map((cls) => (
                <label
                  key={cls.id}
                  className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes(cls.id)}
                    onChange={() => handleCheckboxChange(cls.id)}
                    className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
                  />
                  {cls.name}
                </label>
              ))
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg px-5 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
            Batal
          </button>
          <button
            type="submit"
            disabled={submitting || loadingClasses}
            className="rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50">
            {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </section>
  );
}
