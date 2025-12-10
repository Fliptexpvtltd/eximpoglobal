import Joi from 'joi';

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    next();
  };
};

// Common validation schemas
export const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('buyer', 'seller').required(),
    companyName: Joi.string().required(),
    fullName: Joi.string().required(),
    phone: Joi.string().optional(),
    country: Joi.string().optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  product: Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    description: Joi.string().optional(),
    price: Joi.number().positive().optional(),
    moq: Joi.number().integer().positive().optional(),
    unit: Joi.string().optional(),
    incoterms: Joi.array().items(Joi.string()).optional(),
    certifications: Joi.array().items(Joi.string()).optional()
  }),

  rfq: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    category: Joi.string().optional(),
    lineItems: Joi.array().items(Joi.object({
      productName: Joi.string().required(),
      quantity: Joi.number().positive().required(),
      unit: Joi.string().required(),
      specifications: Joi.string().optional()
    })).min(1).required(),
    deliveryDate: Joi.date().optional(),
    deliveryLocation: Joi.string().optional(),
    incoterms: Joi.string().optional(),
    paymentTerms: Joi.string().optional()
  })
};
