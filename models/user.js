const { Schema, model} = require('mongoose');
const {hendleMongooseError} = require('../helpers')
const Joi = require('joi');


const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //eslint-disable-line
const passwordRegexp = /^[A-Za-z]\w{7,14}$/;

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: {
    type: String,
    default: ""
  } 
},
  { versionKey: false, timestamps: true });

userSchema.post("save", hendleMongooseError)

const userJoiSchema = Joi.object({
    password: Joi.string().pattern(passwordRegexp).required(),
    email: Joi.string().pattern(emailRegexp).required(),
    subscription: Joi.string(),
});

const validateSubscription = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const schemas = {
    userJoiSchema,
    validateSubscription,
};

const User = model('user', userSchema)

module.exports = {
    User,
    schemas,
};