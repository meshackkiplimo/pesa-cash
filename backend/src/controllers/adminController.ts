import { Request, Response } from 'express';
import { User } from '../models/User';

export const adminController = {
  // Get all users
  async getUsers(req: Request, res: Response) {
    try {
      const users = await User.find({}, '-password');
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users' });
    }
  },

  // Update user role
  async updateUserRole(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true, select: '-password' }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user role' });
    }
  },

  // Update user status
  async updateUserStatus(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;

      if (typeof isActive !== 'boolean') {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { isActive },
        { new: true, select: '-password' }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user status' });
    }
  },

  // Get user details
  async getUserDetails(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId, '-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user details' });
    }
  }
};