import { AuthService } from '../services/authService.js';
import { DemoDataService } from '../services/demoDataService.js';
import { sendSuccess } from '../utils/responseHandler.js';

export const updateProfile = async (req, res, next) => {
  try {
    const updated = await AuthService.updateProfile(req.user.id, req.body);
    return sendSuccess(res, 200, 'Profile updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

export const seedDemoData = async (req, res, next) => {
  try {
    const result = await DemoDataService.seedUserDemoData(req.user.id);
    return sendSuccess(res, 201, 'Sample teenager data created!', result);
  } catch (error) {
    next(error);
  }
};
