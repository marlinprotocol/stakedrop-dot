const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const validators = mongoose.model(
  "validators",
  new Schema({
    id: ObjectId,
    validatorAddress: {
      type: String,
      index: true,
    },
    era: {
      type: Number,
      index: true,
    },
    validatorStake: {
      type: Number,
    },
    validatorCollectedStake: {
      type: Number,
    },
    pushedToChain: {
      type: Boolean,
      indexed: true,
      default: false,
    },
  })
);

module.exports = validators;
