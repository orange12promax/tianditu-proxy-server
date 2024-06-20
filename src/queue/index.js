const { addTask, getNextTask, updateTask } = require("../database/queue");

async function createQueue(name, params) {
  await addTask(name, params);
}

async function startQueue(name, callback) {
  const res = await getNextTask(name, callback);
  if (res) {
    const { id, param } = res;
    await callback(param);
    await updateTask(id, 1);
    setTimeout(() => {
      startQueue(name, callback);
    }, 1000);
  }
}

module.exports = {
  createQueue,
  startQueue
};
