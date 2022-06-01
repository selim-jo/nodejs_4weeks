const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    boardId: {
        type: String,
    },
    nickname: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

commentSchema.virtual("commentId").get(function() {
    return this._id.toHexString(); }); 
    commentSchema.set("toJSON", { 
        virtuals: true, 
    });

module.exports = mongoose.model("Comment", commentSchema);