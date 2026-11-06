import { Request, Response, NextFunction } from 'express';
import * as classService from './class.service';

export const index = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const classes = await classService.getAllClasses();
    res.json({ data: classes });
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
    const classc = await classService.createClass(req.body);

    res.status(201).json({
      message: 'school class created successfully',
      data: classc,
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

    const classc = await classService.updateClass(id, req.body);

    res.status(201).json({
      message: 'class name update successfully',
      data: classc,
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

    const classc = await classService.deleteClass(id);

    res.json({
      message: 'class deleted successfully',
      data: classc,
    });
  } catch (error) {
    next(error);
  }
};
