import express from 'express';
import { adminController } from '../controllers/adminController';
import { adminAuth } from '../middleware/adminAuth';
import { auth } from '../middleware/auth';

const router = express.Router();

// Protect all admin routes with authentication and admin middleware
router.use(auth);
router.use(adminAuth);

// User management routes
router.get('/users', adminController.getUsers);
router.get('/users/:userId', adminController.getUserDetails);
router.patch('/users/:userId/role', adminController.updateUserRole);
router.patch('/users/:userId/status', adminController.updateUserStatus);

// Investment routes
router.get('/investments', adminController.getInvestments);
router.delete('/investments/:investmentId', adminController.deleteInvestment);

export default router;