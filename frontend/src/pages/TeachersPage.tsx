import React, { useState } from 'react';
import { useTeachers } from '../hooks/useTeachers';
import { teacherService } from '../services/teacherService';
import AddTeacherPage from './AddTeacherPage';
import EditTeacherPage, { type TeacherDataToEdit } from './EditTeacherPage';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';

export default function TeachersPage() {
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>(
    'list',
  );
  const [selectedTeacher, setSelectedTeacher] =
    useState<TeacherDataToEdit | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [teacherToDelete, setTeacherToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const { classesData, loading, error, refetch } = useTeachers();

  const handleDeleteConfirm = async () => {
    if (!teacherToDelete) return;

    try {
      setDeleting(true);
      await teacherService.deleteTeacher(teacherToDelete.id);
      setIsDeleteModalOpen(false);
      setTeacherToDelete(null);
      refetch();
    } catch (err) {
      alert('Gagal menghapus guru.');
    } finally {
      setDeleting(false);
    }
  };

  if (currentView === 'add') {
    return (
      <AddTeacherPage
        onBack={() => {
          setCurrentView('list');
          refetch();
        }}
      />
    );
  }

  if (currentView === 'edit' && selectedTeacher !== null) {
    return (
      <EditTeacherPage
        teacher={selectedTeacher}
        onBack={() => {
          setCurrentView('list');
          setSelectedTeacher(null);
          refetch();
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-neutral-500">
        Memuat data guru...
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
          <h2 className="text-2xl font-bold text-neutral-900">Data Guru</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Daftar guru dikelompokkan berdasarkan kelas ajar.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('add')}
          className="rounded-lg bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-700">
          + Tambah Guru
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-4 font-semibold w-32 text-center">
                Kelas
              </th>
              <th className="px-6 py-4 font-semibold">Nama Guru</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">No. Telepon</th>
              <th className="px-6 py-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {classesData.map((cls) => {
              const teacherCount = cls.classTeachers.length;
              if (teacherCount === 0) return null;

              // Cari semua ID kelas yang diajar oleh masing-masing guru di kelas ini
              // (Berguna agar saat tombol Edit ditekan, checkbox kelas-kelas lain yang diajar guru tersebut ikut terpilih)
              return cls.classTeachers.map((relation, index) => {
                const teacher = relation.teacher;

                return (
                  <tr
                    key={`${cls.id}-${teacher.id}`}
                    className="hover:bg-neutral-50">
                    {index === 0 && (
                      <td
                        rowSpan={teacherCount}
                        className="px-6 py-4 font-bold text-neutral-900 text-center align-middle bg-neutral-50/50 border-r border-neutral-200">
                        {cls.name}
                      </td>
                    )}
                    <td className="px-6 py-4 text-neutral-900 font-medium">
                      {teacher.name}
                    </td>
                    <td className="px-6 py-4 text-neutral-500">
                      {teacher.email}
                    </td>
                    <td className="px-6 py-4 text-neutral-500">
                      {teacher.phone || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => {
                            // Ambil seluruh ID kelas tempat guru ini mengajar dari seluruh data classesData
                            const teacherClasses = classesData
                              .filter((c) =>
                                c.classTeachers.some(
                                  (ct) => ct.teacherId === teacher.id,
                                ),
                              )
                              .map((c) => c.id);

                            setSelectedTeacher({
                              ...teacher,
                              classTeacher: teacherClasses,
                            });
                            setCurrentView('edit');
                          }}
                          className="text-blue-600 hover:underline font-medium">
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setTeacherToDelete({
                              id: teacher.id,
                              name: teacher.name,
                            });
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:underline font-medium">
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        studentName={teacherToDelete?.name || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setTeacherToDelete(null);
        }}
        loading={deleting}
      />
    </section>
  );
}
