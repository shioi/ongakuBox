const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const musicSchema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
    }, { timestamps: true });

const Music = mongoose.model('Music', musicSchema);
module.exports = Music;
