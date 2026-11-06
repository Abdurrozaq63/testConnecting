import { Request, Response, NextFunction } from 'express';
import * as studentService from './student.service';

export const index = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const students = await studentService.getAllStudents();

    res.json({ data: students });
  } catch (error) {
    next(error);
  }
};

export const store = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const student = await studentService.createStudent(req.body);

    res.status(201).json({
      message: 'student created successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }

    const student = await studentService.updateStudent(id, req.body);

    res.status(201).json({
      message: 'Student update successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

export const deleted = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }

    const student = await studentService.deleteStudent(id);

    res.json({
      message: 'student deleted successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};
