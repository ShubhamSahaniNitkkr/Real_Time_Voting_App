const mongoose = require("mongoose");

const db =
  "mongodb+srv://shubhamsahaninitkkr:SHubham7631936181@contactkeeper-2osnv.mongodb.net/test?retryWrites=true&w=majority";

const mongoDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    console.log("mongodb connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = mongoDB;
