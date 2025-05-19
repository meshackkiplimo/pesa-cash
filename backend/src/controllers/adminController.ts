import { Request, Response } from 'express';
import { User } from '../models/User';
import { Investment } from '../models/Investment';

// Helper function to get monthly data
const getMonthlyData = (data: any[], dateField: string, valueField: string) => {
  const monthlyData = data.reduce((acc: { [key: string]: number }, item: any) => {
    const date = new Date(item[dateField]);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    acc[monthYear] = (acc[monthYear] || 0) + (valueField ? item[valueField] : 1);
    return acc;
  }, {});

  // Get last 6 months
  const today = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthYear = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months.push({
      month: monthYear,
      amount: monthlyData[monthYear] || 0
    });
  }
  return months;
};

export const adminController = {
  // Get dashboard statistics
  async getDashboardStats(req: Request, res: Response) {
    try {
      // Get all users
      const users = await User.find();
      const totalUsers = users.length;
      const activeUsers = users.filter(user => user.isActive).length;

      // Get all investments
      const investments = await Investment.find();
      const totalInvestments = investments.length;
      const activeInvestments = investments.filter(inv => inv.status === 'active').length;

      // Calculate totals
      const totalDeposits = investments.reduce((sum, inv) => sum + inv.amount, 0);
      const totalReturns = investments.reduce((sum, inv) => sum + inv.returns, 0);

      // Get monthly data
      const monthlyInvestments = getMonthlyData(investments, 'date', 'amount');
      const monthlyReturns = getMonthlyData(investments, 'date', 'returns');

      // Get user growth (based on user creation dates)
      const userGrowth = getMonthlyData(users, 'createdAt', '');

      res.json({
        totalUsers,
        activeUsers,
        totalInvestments,
        activeInvestments,
        totalDeposits,
        totalReturns,
        monthlyInvestments,
        monthlyReturns,
        userGrowth
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ message: 'Error fetching dashboard statistics' });
    }
  },

  // Get all users
  async getUsers(req: Request, res: Response) {
    try {
      const users = await User.find({}, '-password').lean();
      const investments = await Investment.find().populate('userId');

      const usersWithStats = users.map((user: any) => {
        const userInvestments = investments.filter(
          inv => inv.userId._id?.toString() === user._id.toString()
        );
        const totalInvested = userInvestments.reduce((sum, inv) => sum + inv.amount, 0);
        const totalProfits = userInvestments.reduce((sum, inv) => sum + inv.returns, 0);

        return {
          ...user,
          totalInvested,
          totalProfits
        };
      });

      res.json(usersWithStats);
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
  },

  // Get all investments
  async getInvestments(req: Request, res: Response) {
    try {
      const investments = await Investment.find().populate('userId', 'name email');
      res.json(investments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching investments' });
    }
  },

  // Delete an investment
  async deleteInvestment(req: Request, res: Response) {
    try {
      const { investmentId } = req.params;
      
      const investment = await Investment.findByIdAndDelete(investmentId);

      if (!investment) {
        return res.status(404).json({ message: 'Investment not found' });
      }

      res.json({ message: 'Investment deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting investment' });
    }
  }
};