import React, { useState, useEffect } from 'react';
import { teacherService, type ClassItem } from '../services/teacherService';

interface AddTeacherPageProps {
  onBack: () => void;
}

export default function AddTeacherPage({ onBack }: AddTeacherPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);

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
      await teacherService.createTeacher({
        name,
        email,
        phone,
        classTeacher: selectedClasses,
      });
      onBack();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menambahkan guru.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">
            Tambah Guru Baru
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Masukkan informasi guru dan kelas yang diajar.
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
            placeholder="Contoh: Budi Santoso"
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
            placeholder="Contoh: budi@gmail.com"
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
            placeholder="Contoh: 08123456789"
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
            {submitting ? 'Menyimpan...' : 'Simpan Guru'}
          </button>
        </div>
      </form>
    </section>
  );
}
