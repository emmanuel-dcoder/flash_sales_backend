const userValidation = {
  fullName: {
    notEmpty: true,
    errorMessage: "fullName cannot be empty",
    trim: true,
  },
  email: {
    notEmpty: true,
    errorMessage: "email cannot be empty",
    isEmail: {
      errorMessage: "Invalid email address",
    },
    trim: true,
  },
  phoneNumber: {
    notEmpty: true,
    errorMessage: "phoneNumber cannot be empty",
    trim: true,
  },
  password: {
    notEmpty: true,
    errorMessage: "password cannot be empty",
    trim: true,
  },
  role: {
    notEmpty: true,
    errorMessage: "role cannot be empty, e.g buyer or seller",
    trim: true,
  },
}

export default userValidation
