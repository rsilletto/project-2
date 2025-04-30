const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  time: {
    type: Number,
    min: 0,
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

TaskSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  time: doc.name,
  category: doc.category,
});

const TaskModel = mongoose.model('Task', TaskSchema);
module.exports = TaskModel;
