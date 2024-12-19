const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');

// Validate MongoDB ObjectId
exports.validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ErrorResponse('Invalid ID format', 400));
  }
  next();
};