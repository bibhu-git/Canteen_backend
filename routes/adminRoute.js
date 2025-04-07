import express from 'express';
import { AdminLogin } from '../controller/AdminController.js';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { DuePageData, Register, specificData, userData, userProfile } from '../controller/UserController.js';
import { isAdmin } from '../middleware/RoleMiddleware.js';
import { MealOn, ManageAttendance,getRecord} from '../controller/Attendace.js';
import { getAllMealStatusRequests, updateMealStatusRequest } from '../controller/MealRequestController.js';
import { cashPayment, getAllPaymentRequests, pendingAmount, updatePaymentStatus } from '../controller/PaymentRequest.js';


const adminRouter = express.Router();

adminRouter.post('/login',AdminLogin);
adminRouter.post('/register',authMiddleware,isAdmin,Register);


adminRouter.get('/userInfo',authMiddleware,isAdmin,userData);
adminRouter.get('/due',authMiddleware,isAdmin,DuePageData);
adminRouter.post('/specific',authMiddleware,isAdmin,specificData);

//attendance routes
adminRouter.get('/mealOn',authMiddleware,isAdmin, MealOn);
adminRouter.post('/submitAttendance',authMiddleware,isAdmin, ManageAttendance);
adminRouter.get('/checkAttendance' ,authMiddleware,isAdmin,getRecord);

//meal Requests
adminRouter.get('/meal/all',authMiddleware,isAdmin, getAllMealStatusRequests);
adminRouter.post('/meal/update',authMiddleware,isAdmin,updateMealStatusRequest);

//payment Request
adminRouter.get('/payment/all',authMiddleware,isAdmin,getAllPaymentRequests);
adminRouter.post('/payment/update',authMiddleware,isAdmin,updatePaymentStatus);
adminRouter.get('/payment/pending',authMiddleware, isAdmin,pendingAmount);
adminRouter.post('/payment/cash',authMiddleware,isAdmin,cashPayment);

export default adminRouter;



