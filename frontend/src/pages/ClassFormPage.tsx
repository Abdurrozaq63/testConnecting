import React, { useState } from 'react';
import { classService } from '../services/classService';

interface ClassFormPageProps {
  initialData?: { id: number; name: string } | null;
  onBack: () => void;
}

export default function ClassFormPage({
  initialData,
  onBack,
}: ClassFormPageProps) {
  const [name, setName] = useState<string>(initialData?.name || '');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      if (isEdit && initialData) {
        await classService.updateClass(initialData.id, name);
      } else {
        await classService.createClass(name);
      }

      onBack();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan data kelas.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">
            {isEdit ? 'Edit Kelas' : 'Tambah Kelas Baru'}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            {isEdit ? 'Perbarui nama kelas.' : 'Masukkan nama kelas baru.'}
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
            Nama Kelas
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: 10A"
            required
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-900"
          />
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
            disabled={submitting}
            className="rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50">
            {submitting ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </section>
  );
}
