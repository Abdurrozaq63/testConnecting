import { Request, Response, NextFunction } from 'express';
import * as teacherService from './teacher.service';

export const index = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const teachers = await teacherService.getAllTeachers();

    res.json({ data: teachers });
  } catch (error) {
    next(error);
  }
};

export const indexAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getAll = await teacherService.getAll();

    res.json({ getAll });
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
    const teacher = await teacherService.createTeacher(req.body);

    res.status(201).json({
      message: 'teacher created successfully',
      data: teacher,
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
      return res.status(400).json({ message: 'Invalid teacher ID' });
    }

    const teacher = await teacherService.updateTeacher(id, req.body);
    res.status(201).json({
      message: 'teacher update successfully',
      data: teacher,
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
      return res.status(400).json({ message: 'Invalid teacher ID' });
    }

    const teacher = await teacherService.deleteTeacher(id);
    res.json({
      message: 'teacher deleted successfully',
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};
