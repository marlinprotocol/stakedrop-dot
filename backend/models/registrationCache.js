const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const params = mongoose.model(
  "registrations",
  new Schema({
    id: ObjectId,
    stakingAddress: {
      type: String,
      index: true,
    },
    ethereumAddress: {
      type: String,
      index: true,
    },
    depositDetails: {
      type: Object,
      required: true,
    },
  })
);

module.exports = params;
