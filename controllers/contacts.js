const {Contact} = require('../models/contact')
const {ctrlWrapper, HttpError } = require('../helpers');

const getAll = async (req, res, next) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10, favorite } = req.query;
    const skip = (page - 1) * limit;
    const result = await Contact.find({ owner }, "", { skip, limit });
    
    let filterFavorite;
    
    if (favorite) {
        filterFavorite= result.filter(item => item.favorite === true)
    }
    if (!favorite) {
        filterFavorite= result.filter(item => item.favorite === false)
    }
    else {
        filterFavorite = result;
    }

    res.status(200).json(favorite ? filterFavorite : result);
};



const getById = async (req, res, next) => {
    const { id } = req.params;
    const result = await Contact.findById(id);
    if (!result) {
        throw HttpError(404, 'Not found');
    }
    res.status(200).json(result);
};

const addContact = async (req, res, next) => {
    const { _id: owner } = req.user;
    const result = await Contact.create({ ...req.body, owner});
            res.status(201).json(result)
};

const updateById = async (req, res, next) => {
        const { contactId } = req.params;
    const result = await Contact.findOneAndUpdate(contactId, req.body, {
            new: true,
        });
        if (!result) {
            HttpError(404, 'Not Found')
        }
        res.status(200).res.json(result)
};

const deleteById = async (req, res, next) => {
    const { contactId } = req.params;
    try {
        const result = await Contact.findByIdAndDelete({_id: contactId});
        if (!result) {
            return next(HttpError(404, 'Contact not found'));
        } 
        res.status(200).json({
            message: "Contact deleted"
        });
    } catch (error) {
        console.log(error);
        next(HttpError(500, 'Internal server error'));
    }
};


const updateFavorite = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
        new: true,
    });
    if (!result) {
        throw HttpError(404, "Not Found")
    }
    res.status(200).json(result)
}

module.exports = {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    addContact: ctrlWrapper(addContact),
    updateById : ctrlWrapper(updateById),
    deleteById: ctrlWrapper(deleteById),
    updateFavorite: ctrlWrapper(updateFavorite),
}