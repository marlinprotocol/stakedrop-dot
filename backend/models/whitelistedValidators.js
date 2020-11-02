const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const whiteListedValidator = mongoose.model(
  "whiteListedValidators",
  new Schema({
    id: ObjectId,
    validatorAddress: {
      type: String,
      index: true,
      unique: true,
    },
  })
);

module.exports = whiteListedValidator;
