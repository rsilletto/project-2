const models = require('../models');

const { Task } = models;

const makerPage = async (req, res) => res.render('app');

const getTasks = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Task.find(query).select('name time category').lean().exec();

    return res.json({ tasks: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving tasks!' });
  }
};

const makeTasks = async (req, res) => {
  if (!req.body.name || !req.body.time || !req.body.category) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  const taskData = {
    name: req.body.name,
    time: req.body.time,
    category: req.body.category,
    owner: req.session.account._id,
  };

  try {
    const newTask = new Task(taskData);
    await newTask.save();
    // return res.json({ redirect: '/maker' });
    return res.status(201).json({
      name: newTask.name, time: newTask.time, category: newTask.category,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Task already exists!' });
    }
    return res.status(500).json({ error: 'An error occurred making the task!' });
  }
};

const removeTask = async (req, res) => {
  // try {
  //   const remove = await Task.findByIdAndDelete(req.body.id);
  //   return res.json({ tasks: remove });
  // } catch (err) {
  //   console.log(err);
  //   return res.status(500).json({ error: 'Error deleting task!' });
  // }

  const { id } = req.body;

  if (!id){
    return res.status(400).json({ error: "Task ID is required" });
  }

  try {
    const removedTask = await Task.findByIdAndDelete(id);
    if(!removedTask){
      return res.status(404).json({ error: "Task not found!" });
    }
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error occurred while deleting task" });
  }
}

module.exports = {
  makerPage,
  getTasks,
  makeTasks,
  removeTask,
};
