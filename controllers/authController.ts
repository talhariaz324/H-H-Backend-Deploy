import CustomApiErrorHandler from '../utils/CustomApiErrorHandler';
import { Request, Response } from 'express';
import { UserInput, UserLoginInput } from '../dtos/user';
import User from '../models/user';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail';
import Group from '../models/group';
interface JwtPayload {
  id: string;
}

export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, middleName, email, password } =
    req.body as UserInput;
  console.log(req.body);
  if (!firstName || !lastName || !email || !password) {
    throw new CustomApiErrorHandler(
      'Please fill all the required fields',
      StatusCodes.BAD_REQUEST
    );
    return;
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new CustomApiErrorHandler(
      'User with this email already exists',
      StatusCodes.BAD_REQUEST
    );
    return;
  }
  const user = await User.create({
    firstName,
    lastName,
    middleName,
    email,
    password,
  });

  const token = user.createJWT();

  // const emailToken = user.createJWT()

  try {
    await sendEmail({
      email: user.email,
      subject: 'H & H Verification',
      text: `
        Hello, thanks for registering on Holding Hands Community Network 
        Click on the URL below to verify your account
        ${process.env.USER_URL_DEV}/verify-email/${token}
      `,
      html: `
        <h1>Hello,</h1>
        <p>Thanks for registering on Holding Hands Community Network</p>
        <p>Click on the URL below to verify your account</p>
        <a href="${process.env.USER_URL_DEV}/verify-email/${token}">Verify your account</a>
      `,
    });
    res.status(200).json({
      message: `Thanks for registering. Please check your email to verify your account`,
      token,
    });
  } catch (error) {
    throw new CustomApiErrorHandler('Email Not Sent', StatusCodes.BAD_REQUEST);
  }

  res.status(StatusCodes.CREATED).json({
    user,
    token,
  });
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    console.log(req.params.id);
    const token = req.params.id;
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    const { id } = payload;
    console.log('🚀 ~ file: authController.ts:75 ~ verifyUser ~ id:', id);
    const user = await User.findById(id);
    console.log('//.........');
    if (!user) {
      throw new CustomApiErrorHandler(
        'Verification Failed',
        StatusCodes.BAD_REQUEST
      );
    }
    user.isVerified = true;
    user.save();
    console.log('done');
    res.status(200).json({ message: 'Successfully Verified' });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req: Request, res: Response) => {
  const { password, email } = req.body as UserLoginInput;
  if (!email || !password) {
    throw new CustomApiErrorHandler(
      'Please provide all the values!!',
      StatusCodes.BAD_REQUEST
    );
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new CustomApiErrorHandler(
      'Invalid Credentials',
      StatusCodes.BAD_REQUEST
    );
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new CustomApiErrorHandler(
      'Invalid Credentials',
      StatusCodes.BAD_REQUEST
    );
  }

  if (!user.isVerified) {
    throw new CustomApiErrorHandler(
      'Email is not verified',
      StatusCodes.BAD_REQUEST
    );
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user,
    token,
  });
};

export const checkUserEmail = async (req: Request, res: Response) => {
  console.log(req.body, 'body');
  const user = await User.findOne({ email: req.body.email });
  console.log(
    '🚀 ~ file: authController.ts:143 ~ checkUserEmail ~ user:',
    user
  );

  if (user) {
    throw new CustomApiErrorHandler(
      'Email already exist',
      StatusCodes.BAD_REQUEST
    );
  }

  res.status(StatusCodes.OK).json({
    message: 'Success',
  });
};

export const updateUser = async (req: Request, res: Response) => {
  const {
    middleName,
    dob,
    placeOfBirth,
    nationality,
    countryOfResidence,
    address,
    zipCode,
    homePhoneNumber,
    cellNumber,
    identityCheck,
    identity,
    countryOfIssuance,
    placedIssuance,
    dateOfIssuance,
    expiryDate,
    relationshipOfKin,
    positionOccupied,
    registrationNo,
  } = req.body;

  const phoneNumbers = {
    Home: homePhoneNumber,
    Cell: cellNumber,
  };
  console.log(
    '🚀 ~ file: authController.ts:147 ~ updateUser ~ req.body:',
    req.body
  );
  // if (
  //   dateOfBirth ||
  //   placeOfBirth ||
  //   nationality ||
  //   countryOfResidence ||
  //   address ||
  //   zipCode ||
  //   phoneNumbers ||
  //   nationalIdentity ||
  //   passport ||
  //   driverLisence ||
  //   countryOfIssuance ||
  //   placedIssuance ||
  //   dateOfIssuance ||
  //   expiryDate ||
  //   relationshipOfKin ||
  //   positionOccupied ||
  //   registrationNo
  // )
  //   throw new CustomApiErrorHandler(
  //     'Please fill all the required fields',
  //     StatusCodes.BAD_REQUEST
  //   );

  const user = await User.findById(req.user.id).select('-password');
  if (!user)
    throw new CustomApiErrorHandler('User not Found', StatusCodes.BAD_REQUEST);

  user.middleName = middleName;
  user.dateOfBirth = dob;
  user.placeOfBirth = placeOfBirth;
  user.nationality = nationality;
  user.address = address;
  user.zipCode = zipCode;
  user.phoneNumbers = phoneNumbers;
  user.countryOfResidence = countryOfResidence;
  user.identification.identificationType = identityCheck;
  user.identification.number = identity;
  user.identification.countryOfIssuance = countryOfIssuance;
  user.identification.placedIssuance = placedIssuance;
  user.identification.dateOfIssuance = dateOfIssuance;
  user.identification.expiryDate = expiryDate;
  user.relationshipOfKin = relationshipOfKin;
  user.positionOccupied = positionOccupied;
  user.registrationNo = registrationNo;
  user.isIndividualAdmin = true;

  await user.save();

  res.status(StatusCodes.OK).json({
    user,
  });
};

export const createKin = async (req: Request, res: Response) => {
  const {
    firstName,
    middleName,
    lastName,
    dob,
    placeOfBirth,
    nationality,
    countryOfResidence,
    zipCode,
    email,
    homePhoneNumber,
    cellNumber,
    address,
    relationship,
  } = req.body;
  console.log(
    '🚀 ~ file: authController.ts:257 ~ createKin ~ req.body;:',
    req.body
  );

  const phoneNumbers = {
    Home: homePhoneNumber,
    Cell: cellNumber,
  };

  if (
    !firstName ||
    !lastName ||
    !nationality ||
    !countryOfResidence ||
    !email ||
    !address ||
    !relationship ||
    !zipCode ||
    !homePhoneNumber ||
    !cellNumber
  )
    throw new CustomApiErrorHandler(
      'Please fill all the required fields',
      StatusCodes.BAD_REQUEST
    );

  const user = await User.create({
    firstName,
    middleName,
    lastName,
    dob,
    placeOfBirth,
    nationality,
    countryOfResidence,
    zipCode,
    email,
    phoneNumbers,
    address,
    relationshipOfKin: relationship,
    individualAdminId: req.user.id,
  });
  res.status(StatusCodes.CREATED).json({
    user,
  });
};

export const createIndividualMember = async (req: Request, res: Response) => {
  if (req.user.id || req.user.isAdmin) {
    const {
      firstName,
      middleName,
      lastName,
      nationality,
      countryOfResidence,
      zipCode,
      email,
      homePhoneNumber,
      cellNumber,
      address,
      adminId
    } = req.body;
  
    if (
      !firstName ||
      !lastName ||
      !nationality ||
      !countryOfResidence ||
      !email ||
      !address ||
      !zipCode ||
      !homePhoneNumber ||
      !cellNumber ||
      !adminId
    )
      throw new CustomApiErrorHandler(
        'Please fill all the required fields',
        StatusCodes.BAD_REQUEST
      );
  
    const user = await User.create({
      firstName,
      middleName,
      lastName,
      nationality,
      countryOfResidence,
      zipCode,
      email,
      phoneNumbers: [homePhoneNumber, cellNumber], //Todo phone number not creating
      address,
      individualAdminId: adminId,
    });
    res.status(StatusCodes.CREATED).json({
      user,
    });
    
  }else{
    throw new CustomApiErrorHandler(
      `Not Authorized to Perform this action`,
      401
    );
  }
  
};

export const memberDetail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const member = await User.findById(id);
  if(!member){
    throw new CustomApiErrorHandler(`No members Found against ${id}`, 400);
  }
  const individualAdmin = member?.individualAdminId?.toString();
  if(req.user.id === individualAdmin || req.user.isAdmin){
    res.status(200).json({ member });
  }else{
    throw new CustomApiErrorHandler(
      `Not Authorized to Perform this action`,
      401
    );
  }
  
  
}

// get Individual members
export const getIndividualMembers = async (req: Request, res: Response) => {
  // const { id } = req.params;
  const individualMembers = await User.find({ individualAdminId: req.user.id });
  if (individualMembers.length === 0)
    throw new CustomApiErrorHandler(`No members associated`, 400);
  res.status(200).json({ individualMembers });
};


// delete Individual group;
export const deleteIndividualMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userDeleted = await User.findOne({ _id: id });
  if (req.user.isAdmin) {
    if (!userDeleted) {
      throw new CustomApiErrorHandler(`User not found`, 404);
    }else{
      await userDeleted?.remove();
      res.status(200).json({ msg: 'Member deleted Successfully' });
    } 
  }else if(req.user.id){
    const userId = req.user.id;
  const individualAdmin = await User.findOne({ _id: userId });
  if (!userDeleted || !individualAdmin) {
    throw new CustomApiErrorHandler(`User not found`, 404);
  }
  const adminId = userDeleted?.individualAdminId;
  const individualAdminIdUser = adminId?.toString()
  if (userId === individualAdminIdUser && individualAdmin.isIndividualAdmin) {
    console.log("called1234")
    await userDeleted?.remove();
    res.status(200).json({ msg: 'Member deleted Successfully' });
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

// DET ALL INDIVIDUAL ADMIN -ONLY ADMIN
export const getAllUsers = async (req: Request, res: Response) => {
  if (req.user.isAdmin) {
    const {status} = req.query;
    let {limit}: any = req.query;
    limit = limit ? parseInt(limit) : 1000;
    let allUsers;
    if(status === "active"){
      allUsers = await User.find({accountStatus: "active", isIndividualAdmin: true, isVerified: true}).sort({createdAt: -1}).limit(limit);
      console.log("🚀 ~ file: authController.ts:401 ~ getAllUsers ~ allUsers:", allUsers)
    }else if(status === "pending"){
      console.log('called')
      allUsers = await User.aggregate([
        {
          $match: {
            $and: [
              { isIndividualAdmin: true },
              { $or: [
                { isVerified: false },
                { accountStatus: "pending" }
              ]}
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
      allUsers = await User.find({}).sort({createdAt: -1}).limit(limit);
    }

    if (allUsers) {
      res.status(200).send(allUsers);
    } else {
      res.status(200).send("No Users Found");
    }
  } else {
    throw new CustomApiErrorHandler(
      `Not Authorized to Perform this action`,
      401
    );
  }
    // console.log("🚀 ~ file: authController.ts:432 ~ getAllUsers ~ allUsers:", allUsers)
}

//GET INDIVIDUAL MEMBER -ONLY ADMIN
export const getIndividualMembersAdmin = async (req: Request, res: Response) => {
  if(req.user.isAdmin){
    const { id } = req.params;
    console.log("🚀 ~ file: authController.ts:484 ~ getIndividualMembersAdmin ~ id:", id)
  const individualMembers = await User.find({ individualAdminId: id });
  if (individualMembers.length === 0)
    throw new CustomApiErrorHandler(`No members associated`, 400);
  res.status(200).json({ individualMembers });
  }else{
    throw new CustomApiErrorHandler(
      `Not Authorized to Perform this action`,
      401
    );
  }
};

//UPDATE ACCOUNT STATUS -ONLY ADMIN
export const updateAccountStatus = async (req: Request, res: Response) => {
  if(req.user.isAdmin){
    const { id } = req.query;
    const {status}: any = req.query;
    console.log("🚀 ~ file: authController.ts:502 ~ updateAccountStatus ~ status:", status)
    if (status === undefined) {
      throw new CustomApiErrorHandler('Status is missing', 400);
    }
  const user = await User.findById( id );
  if (!user){
    throw new CustomApiErrorHandler(`No user found`, 400);
  }
  user.accountStatus = status;
  await user.save();
  console.log("🚀 ~ file: authController.ts:506 ~ updateAccountStatus ~ user:", user)
  res.status(StatusCodes.OK).json({
    user,
  });
}
};

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