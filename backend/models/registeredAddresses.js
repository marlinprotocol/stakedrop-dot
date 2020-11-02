const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const registeredAddresses = mongoose.model(
  "registeredAddresses",
  new Schema({
    id: ObjectId,
    address: {
      type: String,
      index: true,
      unique: true,
    },
    ethereumAddress: {
      type: String,
      index: true,
      unique: true,
    },
  })
);

module.exports = registeredAddresses;
