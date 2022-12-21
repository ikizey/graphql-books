export const createDocument = async (
  Model,
  data,
  fieldToUpdate,
  relatedModel,
  relatedField
) => {
  try {
    const newDocument = new Model(data);
    const createdDocument = await newDocument.save();
    if (relatedModel && fieldToUpdate && relatedField) {
      await updateRelatedDocumentsOnCreation(
        createdDocument,
        fieldToUpdate,
        relatedModel,
        relatedField,
        Model
      );
    }
    return createdDocument;
  } catch (error) {
    throw new Error(`Error creating ${Model.modelName}`);
  }
};

const updateRelatedDocumentsOnCreation = async (
  createdDocument,
  fieldToUpdate,
  relatedModel,
  relatedField,
  Model
) => {
  createdDocument[fieldToUpdate].forEach(async (relatedId) => {
    const relatedDocument = await relatedModel.findById(relatedId);
    if (relatedDocument) {
      try {
        relatedDocument[relatedField].push(createdDocument._id);
        await relatedDocument.save();
      } catch (error) {
        await Model.deleteOne({ _id: createdDocument._id });
        throw new Error(error);
      }
    }
  });
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
    return await Model.findOneAndUpdate({ id }, updatedFields);
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteDocument = async (
  Model,
  id,
  fieldToUpdate,
  relatedModel,
  relatedField
) => {
  try {
    const deletedDocument = await Model.findByIdAndDelete(id);
    if (!deletedDocument) {
      throw new Error(`${Model.modelName} with id ${id} not found`);
    }
    await updateRelatedDocumentsOnDeletion(
      deletedDocument,
      fieldToUpdate,
      relatedModel,
      relatedField,
      Model
    );
    return true;
  } catch (error) {
    throw new Error(error);
  }
};

const updateRelatedDocumentsOnDeletion = async (
  deletedDocument,
  fieldToUpdate,
  relatedModel,
  relatedField,
  Model
) => {
  deletedDocument[fieldToUpdate].forEach(async (relatedId) => {
    try {
      const relatedDocument = await relatedModel.findById(relatedId);
      const index = relatedDocument[relatedField].indexOf(deletedDocument._id);
      if (index !== -1) {
        relatedDocument[relatedField].splice(index, 1);
      }
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
