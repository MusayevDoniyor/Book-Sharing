const response = require("./response");

const findDocumentById = async (Model, id, res, errorMessage) => {
  const document = await Model.findById(id);

  if (!document) return response(res, 404, errorMessage);

  return document;
};

module.exports = findDocumentById;
