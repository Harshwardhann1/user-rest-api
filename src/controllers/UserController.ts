import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';

export class UserController {
  /* static getAll = async (req: Request, res: Response) => {
    const userRepository = getRepository(User);
    const users = await userRepository.find();
    res.send(users);
  }; */

  static getAll = async (req: Request, res: Response) => {
    const userRepository = getRepository(User);
    // Get pagination parameters from query string
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    try {
        // Calculate the number of records to skip
        const skip = (page - 1) * pageSize;
        // Get the users with pagination
        const [users, total] = await userRepository.findAndCount({
            skip: skip,
            take: pageSize
        });
        // Return the paginated results
        res.send({
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
            users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ message: 'Error fetching users' });
    }
};

  static create = async (req: Request, res: Response) => {
    const userRepository = getRepository(User);
    const user = userRepository.create(req.body);
    const result = await userRepository.save(user);
    res.send(result);
  };

  static getById = async (req: Request, res: Response) => {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { id: parseInt(req.params.id) },
    });
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  };

  static update = async (req: Request, res: Response) => {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { id: parseInt(req.params.id) },
    });
    if (user) {
      userRepository.merge(user, req.body);
      const result = await userRepository.save(user);
      res.send(result);
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  };

  static delete = async (req: Request, res: Response) => {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { id: parseInt(req.params.id) },
    });
    if (user) {
      await userRepository.remove(user);
      res.send({ message: 'User deleted successfully' });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  };
}
