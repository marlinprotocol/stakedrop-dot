const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const transactions = mongoose.model(
  "transactions",
  new Schema({
    id: ObjectId,
    address: {
      type: String,
      indexed: true,
      required: true,
    },
    section: {
      type: String,
      indexed: true,
      required: true,
    },
    method: {
      type: String,
      indexed: true,
      require: true,
    },
    args: {
      type: Object,
    },
    blockNumber: {
      type: Number,
      indexed: true,
      required: true,
    },
    transactionHash: {
      type: String,
      indexed: true,
      required: true,
    },
  })
);

module.exports = transactions;
