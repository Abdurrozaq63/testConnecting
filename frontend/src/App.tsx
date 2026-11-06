import { useState } from 'react';
import MainLayout from './components/layout/MainLayout';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentsPage from './pages/StudentsPage';
import TeachersPage from './pages/TeachersPage';
import AllDataPage from './pages/AllDataPage';
import { authService } from './services/authService'; // Pastikan path service ini sesuai

// Definisikan tipe halaman yang valid di aplikasi
type PageType = 'login' | 'register' | 'students' | 'teachers' | 'all';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [page, setPage] = useState<PageType>('login');

  const handleLogin = () => {
    // Dipanggil setelah login berhasil di LoginPage
    setIsLoggedIn(true);
    setPage('students');
  };

  const handleLogout = async () => {
    try {
      // Memanggil API logout untuk menghapus HTTP-Only Cookie di backend
      await authService.logout();
    } catch (error) {
      console.error('Gagal melakukan logout:', error);
    } finally {
      setIsLoggedIn(false);
      setPage('login');
    }
  };

  if (!isLoggedIn) {
    return page === 'register' ? (
      <RegisterPage
        onNavigateLogin={() => setPage('login')}
        onRegisterSuccess={() => setPage('login')}
      />
    ) : (
      <LoginPage
        onLogin={handleLogin}
        onNavigateRegister={() => setPage('register')}
      />
    );
  }

  // Objek pemetaan halaman dengan tipe data Record eksplisit
  const pages: Record<
    Exclude<PageType, 'login' | 'register'>,
    React.ReactNode
  > = {
    students: <StudentsPage />,
    teachers: <TeachersPage />,
    all: <AllDataPage />,
  };

  return (
    <MainLayout
      activePage={page}
      onNavigate={(x) => setPage(x as PageType)}
      onLogout={handleLogout}>
      {pages[page as keyof typeof pages]}
    </MainLayout>
  );
}
