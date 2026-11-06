import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import studentRoutes from './modules/students/student.routes';
import schoolClassRoutes from './modules/classes/class.routes';
import teacherRoutes from './modules/teachers/teacher.routes';
import authRoutes from './modules/auth/auth.routes';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use('/api/students', studentRoutes);
app.use('/api/classes', schoolClassRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/auth', authRoutes);
export default app;
