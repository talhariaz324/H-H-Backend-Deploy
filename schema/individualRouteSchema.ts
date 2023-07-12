import { body } from 'express-validator';

export const initialRegistrationSchema = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
    .isLowercase(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, and one number or special character'
    ),
  body('firstName')
    .isLength({ min: 1 })
    .withMessage('Please enter a first name'),
  body('lastName').isLength({ min: 1 }).withMessage('Please enter a last name'),
];

export const LoginSchema = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .normalizeEmail()
    .isLowercase(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Please enter a valid password.'),
];

// const hostIdValidator = param('hid',"Please enter a valid host id.").isLength({min: 24}).isHexadecimal();

export const individualUpdateSchema = [
  body('phoneNumber')
    .optional()
    .isLength({ min: 10 })
    .withMessage('Please enter a valid phone number'),
  body('address.line1')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Please enter an address'),
  body('address.city')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Please enter a city'),
  body('address.region')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Please enter a region'),
  body('zipCode')
    .optional()
    .isLength({ min: 5 })
    .withMessage('Please enter a valid zip code')
    .matches(/^\d{5}(?:[-\s]\d{4})?$/)
    .withMessage('Please enter a valid zip code'),
  body('phoneNumbers')
    .isLength({ min: 10 })
    .withMessage('Please enter a valid phone number'),
];
export const createKinSchema = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
    .isLowercase(),
  body('firstName')
    .isLength({ min: 1 })
    .withMessage('Please enter a first name'),
  body('lastName').isLength({ min: 1 }).withMessage('Please enter a last name'),
  body('phoneNumbers')
    .isLength({ min: 10 })
    .withMessage('Please enter a valid phone number'),
  body('address.line1')
    .isLength({ min: 1 })
    .withMessage('Please enter an address'),
  body('address.city').isLength({ min: 1 }).withMessage('Please enter a city'),
  body('address.region')
    .isLength({ min: 1 })
    .withMessage('Please enter a region'),
  body('zipCode')
    .isLength({ min: 5 })
    .withMessage('Please enter a valid zip code')
    .matches(/^\d{5}(?:[-\s]\d{4})?$/)
    .withMessage('Please enter a valid zip code'),
  body('relationshipOfKin')
    .isLength({ min: 1 })
    .withMessage('Please enter relationship with kin'),
  body('nationality')
    .isAlpha()
    .withMessage('Country name should only contain letters.')
    .isLength({ min: 1 })
    .withMessage('Please enter nationality'),
  body('countryOfResidence')
    .isAlpha()
    .withMessage('Country name should only contain letters.')
    .isLength({ min: 1 })
    .withMessage('Please enter country of residense'),
];

export const createMemberSchema = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
    .isLowercase(),
  body('firstName')
    .isLength({ min: 1 })
    .withMessage('Please enter a first name'),
  body('lastName').isLength({ min: 1 }).withMessage('Please enter a last name'),
  body('phoneNumbers')
    .isLength({ min: 10 })
    .withMessage('Please enter a valid phone number'),
  body('address.line1')
    .isLength({ min: 1 })
    .withMessage('Please enter an address'),
  body('address.city').isLength({ min: 1 }).withMessage('Please enter a city'),
  body('address.region')
    .isLength({ min: 1 })
    .withMessage('Please enter a region'),
  body('zipCode')
    .isLength({ min: 5 })
    .withMessage('Please enter a valid zip code')
    .matches(/^\d{5}(?:[-\s]\d{4})?$/)
    .withMessage('Please enter a valid zip code'),
  body('nationality')
    .isAlpha()
    .withMessage('Country name should only contain letters.')
    .isLength({ min: 1 })
    .withMessage('Please enter nationality'),
  body('countryOfResidence')
    .isAlpha()
    .withMessage('Country name should only contain letters.')
    .isLength({ min: 1 })
    .withMessage('Please enter country of residense'),
];

// const passwordValidator = body('password').optional().isLength({min: 8}).withMessage("Password must be at least 8 characters long").matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/).withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number or special character");

// export {
//   initialRegistrationSchema,
//   LoginSchema,
//   individualUpdateSchema,
//   createKinSchema,
//   createMemberSchema,
// };


