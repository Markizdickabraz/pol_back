const { isValidObjectId } = require("mongoose");
const { HttpError } = require('../helpers');

const isValidId = (req, res, next) => {
    const { contactId } = req.params;
    console.log(req.params);
    if (!isValidObjectId(contactId)) {
        next(HttpError(400, `${contactId} is not a valid id`));
    } else {
        next();
    }
};

module.exports = isValidId;