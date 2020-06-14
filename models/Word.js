const mongoose = require('mongoose')

const WordSchema = mongoose.Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    word:{
        type: String,
        required: true
    },
    nativeLan:{
        type: String,
        required: true
    },
    foreignLan:{
        type: String,
        required: true
    },
    explanation:{
        type: String,
        required: true
    },
    example:{
        type: String,
        required: true
    },
    wasFalse:{
        type: Boolean,
        required: false
    },
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('word', WordSchema)