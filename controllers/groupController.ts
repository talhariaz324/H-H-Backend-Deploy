import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Group from '../models/group';
import User from '../models/user';
import CustomApiErrorHandler from '../utils/CustomApiErrorHandler';

export const createGroup = async (req: Request, res: Response) => {
  const {
    associationName,
    registeredMembers,
    // registrationNumber,
    address,
    country,
    zipCode,
    phoneNumbers,
    email,
    websiteLink,
  } = req.body;

  if (
    !associationName ||
    !registeredMembers ||
    !country ||
    !address ||
    !zipCode
  ) {
    throw new CustomApiErrorHandler(
      'Please fill the required fields',
      StatusCodes.BAD_REQUEST
    );
  }

  //   const groupExists = await Group.findOne({ registrationNumber });
  //   if (groupExists)
  //     throw new CustomApiErrorHandler(
  //       "Group with this registration number already exists",
  //       StatusCodes.BAD_REQUEST
  //     );

  const group = await Group.create({
    associationName,
    registeredMembers,
    // registrationNumber,
    address,
    country,
    zipCode,
    phoneNumbers,
    email,
    websiteLink,
  });

  const token = group.createJWT();

  res.status(StatusCodes.CREATED).json({
    group,
    token,
  });
};

export const getRepresentativeOne = async (req: Request, res: Response) => {
  console.log(req.user);
  const user = await User.findOne({ _id: req.user.id });
  console.log(
    '🚀 ~ file: groupController.ts:62 ~ getRepresentativeOne ~ user:',
    user
  );

  if (!user) {
    throw new CustomApiErrorHandler('User not Found', StatusCodes.BAD_REQUEST);
  }
  res.status(StatusCodes.CREATED).json({
    user,
  });
};

// TODO : middle Name Discussion
export const updateGroupRepresentative = async (
  req: Request,
  res: Response
) => {
  const {
    dateOfBirth,
    placeOfBirth,
    positionOccupied,
    nationality,
    countryOfResidence,
    zipCode,
    phoneNumbers,
    address,
    groupId,
  } = req.body;

  if (!dateOfBirth || !placeOfBirth || !zipCode || !phoneNumbers || !groupId) {
    throw new CustomApiErrorHandler(
      'Please fill the required fields',
      StatusCodes.BAD_REQUEST
    );
  }

  //   console.log(req.user.id)

  const user = await User.findById(req.user.id).select('-password');
  if (!user)
    throw new CustomApiErrorHandler('User not Found', StatusCodes.BAD_REQUEST);

  user.dateOfBirth = dateOfBirth;
  user.placeOfBirth = placeOfBirth;
  user.nationality = nationality;
  user.address = address;
  user.zipCode = zipCode;
  user.phoneNumbers = phoneNumbers;
  user.countryOfResidence = countryOfResidence;
  user.positionOccupied = positionOccupied;
  user.groupId = groupId;
  user.isGroupAdmin = true;
  user.isGroupRespresentative = true;

  await user.save();

  res.status(StatusCodes.CREATED).json({
    user,
  });
};
//  positionOccupied : Discussion
export const createGroupRepresentative = async (
  req: Request,
  res: Response
) => {
  const {
    firstName,
    middleName,
    lastName,
    dateOfBirth,
    placeOfBirth,
    positionOccupied,
    nationality,
    countryOfResidence,
    zipCode,
    email,
    phoneNumbers,
    address,
    isGroupRespresentative,
    groupId,
  } = req.body;
  console.log(req.body);
  if (
    !firstName ||
    !dateOfBirth ||
    !placeOfBirth ||
    !zipCode ||
    // !phoneNumbers ||
    !groupId
  ) {
    throw new CustomApiErrorHandler(
      'Please fill the required fields',
      StatusCodes.BAD_REQUEST
    );
  }

  const userExists = await User.findOne({ email });
  if (userExists)
    throw new CustomApiErrorHandler(
      'User with this email already exists',
      StatusCodes.BAD_REQUEST
    );

  const user = await User.create({
    firstName,
    middleName,
    lastName,
    dateOfBirth,
    placeOfBirth,
    positionOccupied,
    nationality,
    countryOfResidence,
    zipCode,
    email,
    phoneNumbers,
    address,
    isGroupRespresentative,
    groupId,
  });

  res.status(StatusCodes.CREATED).json({
    user,
  });
};

// get group info;
export const getGroupInfo = async (req: Request, res: Response) => {
  if(req.user.id || req.user.isAdmin){
    const { id } = req.params;
    const group = await Group.findOne({ _id: id });
    if (!group)
      throw new CustomApiErrorHandler(
        `No group associated with this id ${id}`,
        400
      );
    res.status(200).json(group);
  }else{
    throw new CustomApiErrorHandler(
      `Not Authorized to Perform this action`,
      401
    );
  }
  
};

// get group members

export const getGroupMembers = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (req.user.id || req.user.isAdmin) {
    const groupUsers = await User.find({ groupId: id });
  if (groupUsers.length === 0)
    throw new CustomApiErrorHandler(
      `No members associated with this group`,
      400
    );
  res.status(200).json({ groupUsers });
  } else {
    throw new CustomApiErrorHandler(
      `Not Authorized to Perform this action`,
      401
    );  
  }
  
};

export const deleteGroupMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userDeleted = await User.findOne({ _id: id });
  if (req.user.isAdmin) {
    if (!userDeleted) {
      throw new CustomApiErrorHandler(`User not found`, 404);
    }else{
      await userDeleted?.remove();
      res.status(200).json({ msg: 'Member deleted Successfully' });
    } 
  } else if(req.user.id){
    const adminUser = await User.findOne({ _id: userId });
  if (!userDeleted || !adminUser) {
    throw new CustomApiErrorHandler(`User not found`, 404);
  }
  const groupIdUser = userDeleted?.groupId;
  const groupIdAdmin = adminUser?.groupId;
  if (groupIdAdmin === groupIdUser && adminUser?.isGroupAdmin) {
    await userDeleted?.remove();
    res
      .status(StatusCodes.NO_CONTENT)
      .json({ msg: 'Deleted successfully' });
  } else
    throw new CustomApiErrorHandler(
      `Not Authorized to Perform this action`,
      401
    );
  }else{
    throw new CustomApiErrorHandler(
      `Not Authorized to Perform this action`,
      401
    );
  }
  
};

//ADMIN ROUTES

export const getAllGroups = async (req: Request, res: Response) => {
  if (req.user.isAdmin) {
    console.log("called")
    const {status} = req.query;
    let {limit}: any = req.query;
    limit = limit ? parseInt(limit) : 1000;
    let allGroups;
    if(status === "active"){
      allGroups = await Group.find({accountStatus: "active"}).sort({createdAt: -1}).limit(limit);
      console.log("🚀 ~ file: authController.ts:401 ~ getallGroups ~ allGroups:", allGroups)
    }else if(status === "pending"){
      console.log('called')
      allGroups = await Group.aggregate([
        {
          $match: {
            $and: [
              { accountStatus: "pending" }
            ],
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
        {
          $limit: limit
        }
      ]);
    }else{
      allGroups = await Group.find({}).sort({createdAt: -1}).limit(limit);
    }

    if (allGroups) {
      res.status(200).send(allGroups);
    } else {
      res.status(200).send("No Group Found");
    }
  } else {
    throw new CustomApiErrorHandler(
      `Not Authorized to Perform this action`,
      401
    );
  }
    // console.log("🚀 ~ file: authController.ts:432 ~ getallGroups ~ allGroups:", allGroups)
}

//UPDATE ACCOUNT STATUS -ONLY ADMIN
export const updateAccountStatus = async (req: Request, res: Response) => {
  if(req.user.isAdmin){
    const { id } = req.query;
    const {status}: any = req.query;
    console.log("🚀 ~ file: authController.ts:502 ~ updateAccountStatus ~ status:", status)
    if (status === undefined) {
      throw new CustomApiErrorHandler('Status is missing', 400);
    }
  const group = await Group.findById( id );
  // console.log("🚀 ~ file: authController.ts:506 ~ updateAccountStatus ~ user:", group)
  if (!group){
    throw new CustomApiErrorHandler(`No user found`, 400);
  }
  group.accountStatus = status
  await group.save()
  res.status(StatusCodes.OK).json({
    group,
  });
}
};
