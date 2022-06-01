const mongoose = require("mongoose");

const boardSchema = mongoose.Schema({
    nickname: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

boardSchema.virtual("boardId").get(function () {
    return this._id.toHexString();
  });
  boardSchema.set("toJSON", {
    virtuals: true,
  });

module.exports = mongoose.model("Board", boardSchema);