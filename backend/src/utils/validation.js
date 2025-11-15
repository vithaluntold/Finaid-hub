const Joi = require('joi');

// Input validation schemas
const schemas = {
  login: Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),
  
  resetPassword: Joi.object({
    email: Joi.string().email().required()
  }),

  updatePassword: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
    new_password: Joi.string().min(6).required(),
    new_password_confirmation: Joi.string().min(6).required()
  }),

  createUser: Joi.object({
    first_name: Joi.string().min(2).max(50).required(),
    last_name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    user_type: Joi.string().valid('admin', 'accounting_firm_owner', 'accountant').required(),
    department: Joi.string().optional()
  }),

  updateUser: Joi.object({
    first_name: Joi.string().min(2).max(50).optional(),
    last_name: Joi.string().min(2).max(50).optional(),
    email: Joi.string().email().optional(),
    user_type: Joi.string().valid('admin', 'accounting_firm_owner', 'accountant').optional(),
    status: Joi.string().valid('active', 'inactive', 'suspended').optional(),
    department: Joi.string().optional()
  }),

  createClient: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional(),
    company_id: Joi.string().optional(),
    profile_id: Joi.string().optional(),
    assigned_accountant: Joi.string().optional()
  }),

  updateClient: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    company_id: Joi.string().optional(),
    profile_id: Joi.string().optional(),
    assigned_accountant: Joi.string().optional()
  }),

  createProfile: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).max(500).required(),
    category: Joi.string().required(),
    features: Joi.array().items(Joi.string()).required(),
    status: Joi.string().valid('active', 'inactive').optional().default('active')
  }),

  createLicense: Joi.object({
    finaid_profile_id: Joi.string().required(),
    owner_id: Joi.string().required(),
    expires_at: Joi.date().optional()
  }),

  sendEmail: Joi.object({
    to: Joi.string().email().required(),
    subject: Joi.string().min(1).max(200).required(),
    message: Joi.string().min(1).max(5000).required()
  })
};

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

module.exports = {
  schemas,
  validate
};