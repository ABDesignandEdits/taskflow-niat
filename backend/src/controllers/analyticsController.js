import { AnalyticsService } from '../services/analyticsService.js';
import { sendSuccess } from '../utils/responseHandler.js';

export const getOverview = async (req, res, next) => {
  try {
    const overview = await AnalyticsService.getDashboardOverview(req.user.id);
    return sendSuccess(res, 200, 'Dashboard overview calculated successfully.', overview);
  } catch (error) {
    next(error);
  }
};