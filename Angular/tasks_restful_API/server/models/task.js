const mongoose = require('mongoose');
const {Schema} = mongoose;

//schema
const taskSchema = new Schema ({
    title: {
        type: String,
        required: [true, "Please give your task a title"],
        trim: true,
    },
    description: {
        type: String,
        default: "",
        required: [true, 'Task description is required'],
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
        required: true,
    },
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});
const Task = mongoose.model('Task', taskSchema);

module.exports = mongoose.model('Task', taskSchema);
