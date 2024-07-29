const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    todosAdded: {
        type: Number, 
        default: 0
    },
    todosCompleted: {
        type: Number, 
        default: 0
    },
    habitsAdded: {
        type: Number, 
        default: 0
    },
    habitsCompleted: {
        type: Number, 
        default: 0
    },
    dailiesAdded: {
        type: Number, 
        default: 0
    },
    dailiesCompleted: {
        type: Number, 
        default: 0
    },
    rewardsAdded: {
        type: Number, 
        default: 0
    },
    rewardsCompleted: {
        type: Number, 
        default: 0
    }
});

const History = mongoose.model('History', historySchema);

module.exports = History;