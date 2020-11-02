const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const totalStake = mongoose.model(
  "totalStakes",
  new Schema({
    id: ObjectId,
    value: {
      type: Number,
      default: 0,
    },
    era: {
      type: Number,
      indexed: true,
      unique: true,
    },
    pushedToChain: {
      type: Boolean,
      indexed: true,
      default: false,
    },
  })
);

module.exports = totalStake;
