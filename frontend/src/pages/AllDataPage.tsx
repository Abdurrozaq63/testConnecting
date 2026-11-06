import React, { useState } from 'react';
import { useAllClasses } from '../hooks/useAllClasses';
import { classService } from '../services/classService';
import ClassFormPage from './ClassFormPage';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';

export default function AllDataPage() {
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>(
    'list',
  );
  const [selectedClass, setSelectedClass] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [classToDelete, setClassToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const { classesData, loading, error, refetch } = useAllClasses();

  const handleDeleteConfirm = async () => {
    if (!classToDelete) return;

    try {
      setDeleting(true);
      await classService.deleteClass(classToDelete.id);
      setIsDeleteModalOpen(false);
      setClassToDelete(null);
      refetch();
    } catch (err) {
      alert('Gagal menghapus kelas.');
    } finally {
      setDeleting(false);
    }
  };

  if (currentView === 'add') {
    return (
      <ClassFormPage
        onBack={() => {
          setCurrentView('list');
          refetch();
        }}
      />
    );
  }

  if (currentView === 'edit' && selectedClass !== null) {
    return (
      <ClassFormPage
        initialData={selectedClass}
        onBack={() => {
          setCurrentView('list');
          setSelectedClass(null);
          refetch();
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-neutral-500">
        Memuat data kelas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
        Error: {error}
      </div>
    );
  }

  return (
    <section>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">
            Data Kelas, Guru, & Murid
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Daftar lengkap integrasi kelas beserta pengajar dan siswanya.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('add')}
          className="rounded-lg bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-700">
          + Tambah Kelas
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-4 font-semibold w-28 text-center">
                Kelas
              </th>
              <th className="px-6 py-4 font-semibold">Daftar Guru</th>
              <th className="px-6 py-4 font-semibold">Daftar Murid</th>
              <th className="px-6 py-4 font-semibold text-right">Aksi Kelas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {classesData.map((cls) => {
              // Menentukan jumlah baris maksimum antara total guru atau total siswa di kelas ini
              const teachersCount = cls.classTeachers.length;
              const studentsCount = cls.students.length;
              const maxRows = Math.max(teachersCount, studentsCount, 1);

              const rows = Array.from({ length: maxRows });

              return rows.map((_, index) => {
                const teacherObj = cls.classTeachers[index];
                const studentObj = cls.students[index];

                return (
                  <tr
                    key={`${cls.id}-row-${index}`}
                    className="hover:bg-neutral-50">
                    {/* Kolom Nama Kelas (Hanya dirender sekali di baris pertama dengan rowSpan) */}
                    {index === 0 && (
                      <td
                        rowSpan={maxRows}
                        className="px-6 py-4 font-bold text-neutral-900 text-center align-middle bg-neutral-50/50 border-r border-neutral-200">
                        {cls.name}
                      </td>
                    )}

                    {/* Kolom Guru */}
                    <td className="px-6 py-4 text-neutral-700">
                      {teacherObj ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-neutral-900">
                            {teacherObj.teacher.name}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {teacherObj.teacher.email}
                          </span>
                        </div>
                      ) : (
                        <span className="text-neutral-400 italic">-</span>
                      )}
                    </td>

                    {/* Kolom Murid */}
                    <td className="px-6 py-4 text-neutral-700">
                      {studentObj ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-neutral-900">
                            {studentObj.name}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {studentObj.email}
                          </span>
                        </div>
                      ) : (
                        <span className="text-neutral-400 italic">-</span>
                      )}
                    </td>

                    {/* Kolom Aksi Kelas (Hanya dirender sekali di baris pertama dengan rowSpan) */}
                    {index === 0 && (
                      <td
                        rowSpan={maxRows}
                        className="px-6 py-4 text-right align-middle border-l border-neutral-200">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => {
                              setSelectedClass({ id: cls.id, name: cls.name });
                              setCurrentView('edit');
                            }}
                            className="text-blue-600 hover:underline font-medium">
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setClassToDelete({ id: cls.id, name: cls.name });
                              setIsDeleteModalOpen(true);
                            }}
                            className="text-red-600 hover:underline font-medium">
                            Hapus
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        studentName={`Kelas ${classToDelete?.name || ''}`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setClassToDelete(null);
        }}
        loading={deleting}
      />
    </section>
  );
}
