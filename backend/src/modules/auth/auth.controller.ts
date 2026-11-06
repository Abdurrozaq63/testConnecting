import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authService } from './auth.service';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_negara_123';

export const authController = {
  // REGISTER
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ message: 'Semua kolom wajib diisi.' });
        return;
      }

      // Cek apakah email sudah terdaftar menggunakan service
      const existingUser = await authService.findUserByEmail(email);
      if (existingUser) {
        res.status(400).json({ message: 'Email sudah digunakan.' });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Simpan user via service
      const newUser = await authService.createUser({
        name,
        email,
        password: hashedPassword,
      });

      const { password: _, ...userWithoutPassword } = newUser;

      res.status(201).json({
        message: 'Registrasi berhasil',
        data: userWithoutPassword,
      });
    } catch (error) {
      console.error('Register Error:', error);
      res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
  },

  // LOGIN
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: 'Email dan password wajib diisi.' });
        return;
      }

      // Cari user via service
      const user = await authService.findUserByEmail(email);
      if (!user) {
        res.status(401).json({ message: 'Email atau password salah.' });
        return;
      }

      // Bandingkan password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Email atau password salah.' });
        return;
      }

      // Buat token JWT yang berisi ID user
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1d' }, // Token berlaku 1 hari
      );

      // Set HTTP-Only Cookie
      res.cookie('auth_token', token, {
        httpOnly: true, // Tidak bisa diakses oleh JavaScript (aman dari serangan XSS)
        secure: process.env.NODE_ENV === 'production', // Wajib true di HTTPS (Production)
        sameSite: 'lax', // Perlindungan terhadap serangan CSRF
        maxAge: 24 * 60 * 60 * 1000, // 1 hari dalam milidetik
      });

      const { password: _, ...userWithoutPassword } = user;

      res.status(200).json({
        message: 'Login berhasil',
        data: userWithoutPassword,
      });
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
  },

  // LOGOUT
  logout: async (req: Request, res: Response): Promise<void> => {
    // Hapus cookie auth_token
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.status(200).json({ message: 'Logout berhasil' });
  },
};
