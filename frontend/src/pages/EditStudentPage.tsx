import React from 'react';
import {
  useEditStudent,
  type StudentDataToEdit,
} from '../hooks/useEditStudent';

interface EditStudentPageProps {
  student: StudentDataToEdit;
  onBack: () => void;
}

export default function EditStudentPage({
  student,
  onBack,
}: EditStudentPageProps) {
  const {
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
  } = useEditStudent(student, onBack);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (classId === '') return;

    handleSubmit({
      name,
      email,
      classId: Number(classId),
    });
  };

  return (
    <section className="max-w-xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">
            Edit Data Murid
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Perbarui informasi atau ubah kelas murid.
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
        onSubmit={onSubmit}
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
            Kelas
          </label>
          <select
            value={classId}
            onChange={(e) =>
              setClassId(e.target.value ? Number(e.target.value) : '')
            }
            required
            disabled={loadingClasses}
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-900 bg-white disabled:bg-neutral-50">
            <option value="">
              {loadingClasses ? 'Memuat kelas...' : 'Pilih Kelas'}
            </option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
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
