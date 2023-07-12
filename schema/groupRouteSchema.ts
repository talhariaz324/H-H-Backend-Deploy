import { body } from 'express-validator';

const createGroupSchema = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
    .isLowercase(),
  body('associationName')
    .isLength({ min: 1 })
    .withMessage('Please enter a first name'),
  body('registeredMembers')
    .isLength({ min: 1 })
    .withMessage('Please enter a last name'),
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
];

// const driverIdValidator = param('did',"Please enter a valid driver id.").isLength({min: 24}).isHexadecimal();

const createRepresentativeSchema = [
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
  body('positionOccupied')
    .isLength({ min: 1 })
    .withMessage('Please enter Occupied Position'),
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
  // body('dateOfBirth').isDate().withMessage('Invalid date of birth.').isBefore(new Date()).withMessage('Date of birth cannot be in the future.').isLength({min: 1}).withMessage("Please enter date of birth"),
];

const representativeUpdateSchema = [
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
  body('positionOccupied')
    .isLength({ min: 1 })
    .withMessage('Please enter Occupied Position'),
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
  // body('dateOfBirth').isDate().withMessage('Invalid date of birth.').isBefore(new Date()).withMessage('Date of birth cannot be in the future.').isLength({min: 1}).withMessage("Please enter date of birth"),
];
export {
  createGroupSchema,
  representativeUpdateSchema,
  createRepresentativeSchema,
};
