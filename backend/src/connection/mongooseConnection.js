const mongoose = require("mongoose")

const connectToDB = async (url) => {
    return await mongoose.connect(url);
}

module.exports = connectToDB;