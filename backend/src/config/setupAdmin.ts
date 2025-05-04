import { User } from '../models/User';
import { config } from './index';

export const setupAdminUser = async () => {
  try {
    // Check if admin user exists
    const adminExists = await User.findOne({ email: config.admin.email });

    if (!adminExists) {
      // Create admin user
      const adminUser = new User({
        email: config.admin.email,
        password: config.admin.password,
        firstName: config.admin.firstName,
        lastName: config.admin.lastName,
        role: 'admin',
        isActive: true
      });

      await adminUser.save();
      console.log('Admin user created successfully');
      console.log('Default admin email:', config.admin.email);
      console.log('Default admin password:', config.admin.password);
      console.log('Please change the admin password after first login');
    }
  } catch (error) {
    console.error('Error setting up admin user:', error);
  }
};