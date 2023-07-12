import express from 'express';
import {
  createGroup,
  createGroupRepresentative,
  deleteGroupMember,
  // getAllGroups,
  getGroupInfo,
  getGroupMembers,
  getRepresentativeOne,
  updateAccountStatus,
  updateGroupRepresentative,
} from '../controllers/groupController';
import { authenticatedUser } from '../middlewares/auth';
import {
  createGroupSchema,
  createRepresentativeSchema,
  representativeUpdateSchema,
} from '../schema';

const router = express.Router();

router.route('/create').post(createGroupSchema, createGroup);
router
  .route('/create-representative')
  .post(createRepresentativeSchema, createGroupRepresentative);
router
  .route('/update-representative')
  .patch(
    representativeUpdateSchema,
    authenticatedUser,
    updateGroupRepresentative
  );
router
  .route('/one-representative')
  .get(authenticatedUser, getRepresentativeOne);
router.route('/:id').get(authenticatedUser ,getGroupInfo);
router.route('/group-members/:id').get(authenticatedUser, getGroupMembers);
router
  .route('/delete-group-member/:id')
  .delete(authenticatedUser, deleteGroupMember);

//ADMIN ROUTES
// router.route('/allGroups').get(authenticatedUser, getAllGroups);  
router.route('/update-group').patch(authenticatedUser, updateAccountStatus);   

export default router;
