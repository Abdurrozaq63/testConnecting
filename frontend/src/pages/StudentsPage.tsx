import React, { useState } from 'react';
import { useStudents } from '../hooks/useStudents';
import AddStudentPage from './AddStudentPage';
import EditStudentPage from './EditStudentPage';
import { type StudentDataToEdit } from '../hooks/useEditStudent';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';
import { studentService } from '../services/studentService';

export default function StudentsPage() {
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>(
    'list',
  );
  //state untuk modal hpus
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [studentToDelete, setStudentToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const [selectedStudent, setSelectedStudent] =
    useState<StudentDataToEdit | null>(null);

  const { classesData, loading, error, refetch } = useStudents();

  // Fungsi untuk mengeksekusi penghapusan murid
  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;

    try {
      setDeleting(true);
      await studentService.deleteStudent(studentToDelete.id);
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
      refetch(); // Refresh data tabel setelah berhasil dihapus
    } catch (err) {
      alert('Gagal menghapus murid.');
    } finally {
      setDeleting(false);
    }
  };

  if (currentView === 'add') {
    return (
      <AddStudentPage
        onBack={() => {
          setCurrentView('list');
          refetch();
        }}
      />
    );
  }

  if (currentView === 'edit' && selectedStudent !== null) {
    return (
      <EditStudentPage
        student={selectedStudent}
        onBack={() => {
          setCurrentView('list');
          setSelectedStudent(null);
          refetch();
        }}
      />
    );
  }
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-neutral-500">
        Memuat data murid...
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
          <h2 className="text-2xl font-bold text-neutral-900">Data Murid</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Daftar murid dikelompokkan berdasarkan kelas.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('add')}
          className="rounded-lg bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-700">
          + Tambah Murid
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-4 font-semibold w-32 text-center">
                Kelas
              </th>
              <th className="px-6 py-4 font-semibold">Nama Murid</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-100">
            {classesData.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-neutral-400">
                  Belum ada data kelas atau murid.
                </td>
              </tr>
            ) : (
              classesData.map((cls) => {
                const studentCount = cls.students.length;

                // Jika kelas belum memiliki murid
                if (studentCount === 0) {
                  return (
                    <tr key={`class-${cls.id}`} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 font-bold text-neutral-900 text-center bg-neutral-50/50 border-r border-neutral-200">
                        {cls.name}
                      </td>
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-neutral-400 italic">
                        Belum ada murid di kelas ini.
                      </td>
                    </tr>
                  );
                }

                // Render setiap murid dalam kelas tersebut
                return cls.students.map((student, index) => (
                  <tr key={student.id} className="hover:bg-neutral-50">
                    {/* Kolom Kelas hanya dirender sekali per kelompok kelas dengan rowSpan */}
                    {index === 0 && (
                      <td
                        rowSpan={studentCount}
                        className="px-6 py-4 font-bold text-neutral-900 text-center align-middle bg-neutral-50/50 border-r border-neutral-200">
                        {cls.name}
                      </td>
                    )}

                    <td className="px-6 py-4 text-neutral-900 font-medium">
                      {student.name}
                    </td>

                    <td className="px-6 py-4 text-neutral-500">
                      {student.email}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => {
                            // Mengirim data student beserta classId-nya langsung lewat state
                            setSelectedStudent({
                              id: student.id,
                              name: student.name,
                              email: student.email,
                              classId: cls.id,
                            });
                            setCurrentView('edit');
                          }}
                          className="text-blue-600 hover:underline font-medium">
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setStudentToDelete({
                              id: student.id,
                              name: student.name,
                            });
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:underline font-medium">
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ));
              })
            )}
          </tbody>
        </table>
      </div>
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        studentName={studentToDelete?.name || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setStudentToDelete(null);
        }}
        loading={deleting}
      />
    </section>
  );
}
