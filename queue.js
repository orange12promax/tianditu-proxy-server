const dotenv = require("dotenv");
dotenv.config();
const Queue = require("bee-queue");
const { fetchBuffer } = require("./src/utils/request");

const layer = "vec";
const z = 14;
const x = 13602;
const y = 6652;
const count = 5;
function getRange(center, count) {
  const min = center - count;
  const max = center + count;
  const result = [];
  for (let i = min; i <= max; i++) {
    result.push(i);
  }
  return result;
}
const xRange = getRange(x, count);
const yRange = getRange(y, count);
const testTasks = [];

const tileQueue = new Queue("tiles", {
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT)
  }
});

function requestTile({ z, x, y, layer }) {
  const url = `http://localhost:13000/m/${layer}/${z}/${x}/${y}`;
  return fetchBuffer(url);
}

tileQueue.process(async (job) => {
  console.log(`Processing job ${job.id}`);
  const buffer = await requestTile(job.data);
  console.log(buffer);
  console.log(`Finished job ${job.id}`);
  return 0;
});

for (let x of xRange) {
  for (let y of yRange) {
    tileQueue
      .createJob({ z, x, y, layer })
      .save()
      .then((job) => {
        console.log(`Added job ${job.id}`);
      })
      .catch((err) => {
        console.error(`Failed to add job ${i}: ${err}`);
      });
  }
}
