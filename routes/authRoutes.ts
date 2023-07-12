import express from 'express';
import {
  createIndividualMember,
  createKin,
  checkUserEmail,
  login,
  registerUser,
  updateUser,
  verifyUser,
  getIndividualMembers,
  deleteIndividualMember,
  memberDetail,
  getAllUsers,
  getIndividualMembersAdmin,
  updateAccountStatus,
  getAllGroups,
} from '../controllers/authController';
import { authenticatedUser } from '../middlewares/auth';
import {
  initialRegistrationSchema,
  LoginSchema,
  representativeUpdateSchema,
  createKinSchema,
  createMemberSchema,
} from '../schema';

const router = express.Router();

router.route('/register').post(initialRegistrationSchema, registerUser);
router.route('/login').post(LoginSchema, login);
router.route('/verify-email/:id').get(verifyUser);
router.route('/user-emails').post(checkUserEmail);
router.route('/member-detail/:id').get(authenticatedUser, memberDetail);
router
  .route('/update-user/')
  .patch(representativeUpdateSchema, authenticatedUser, updateUser);
router.route('/create-kin').post(authenticatedUser, createKinSchema, createKin);
router
  .route('/create-member')
  .post(authenticatedUser, createMemberSchema, createIndividualMember);

router.route('/invidual-members').get(authenticatedUser, getIndividualMembers);  
router
  .route('/delete-individual-member/:id')
  .delete(authenticatedUser, deleteIndividualMember);

//ADMIN ROUTES
router.route('/allUsers').get(authenticatedUser, getAllUsers); 
router.route('/invidual-members-admin/:id').get(authenticatedUser, getIndividualMembersAdmin); 
router.route('/update-individual-account').patch(authenticatedUser, updateAccountStatus);  
router.route('/allGroups').get(authenticatedUser, getAllGroups); 

export default router;
