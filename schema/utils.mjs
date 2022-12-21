export const createDocument = async (Model, data) => {
  try {
    const newDocument = new Model(data);
    const savedDocument = await newDocument.save();
    return savedDocument;
  } catch (error) {
    console.error(error);
    throw new Error(`Error creating ${Model.modelName}`);
  }
};

export const paginate = async (Model, { pageSize, page }) => {
  if (pageSize && page) {
    const startIndex = (page - 1) * pageSize;
    return await Model.find().skip(startIndex).limit(pageSize);
  }
  return await Model.find();
};

export const getDocumentById = async (Model, id) => {
  return await Model.findOne({ id });
};

export const updateDocument = async (Model, id, updatedFields) => {
  try {
    const updatedDocument = await Model.updateOne({ id }, updatedFields);
    if (updatedDocument.nModified === 0) {
      throw new Error(`Document with id ${id} not found`);
    }
    return updatedDocument;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteDocument = async (
  Model,
  id,
  fieldToUpdate,
  relatedModel
) => {
  try {
    const deletedDocument = await Model.findByIdAndDelete(id);
    if (!deletedDocument) {
      throw new Error(`${Model.modelName} with id ${id} not found`);
    }
    await updateRelatedDocuments(
      deletedDocument,
      fieldToUpdate,
      relatedModel,
      Model
    );
    return true;
  } catch (error) {
    throw new Error(error);
  }
};

const updateRelatedDocuments = async (
  deletedDocument,
  fieldToUpdate,
  relatedModel,
  Model
) => {
  deletedDocument[fieldToUpdate].forEach(async (relatedId) => {
    const relatedDocument = await relatedModel.findById(relatedId);
    const documentIndex = relatedDocument[fieldToUpdate].indexOf(
      deletedDocument._id
    );
    relatedDocument[fieldToUpdate].splice(documentIndex, 1);
    try {
      await relatedDocument.save();
    } catch (error) {
      await Model.create(deletedDocument);
      throw new Error(error);
    }
  });
};

export const getRelatedDocuments = async (Model, field, values) => {
  return await Model.find({ [field]: { $in: values } });
};
