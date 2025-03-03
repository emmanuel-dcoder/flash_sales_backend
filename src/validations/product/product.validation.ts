const productValidation = {
  name: {
    notEmpty: true,
    errorMessage: "name cannot be empty",
  },
  amount: {
    notEmpty: true,
    errorMessage: "amount cannot be empty",
  },
  salesStartTime: {
    notEmpty: true,
    errorMessage: "salesStartTime cannot be empty",
  },
  salesEndTime: {
    notEmpty: true,
    errorMessage: "salesEndTime cannot be empty",
  },
}

export default productValidation
