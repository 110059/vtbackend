//const tf = require('@tensorflow/tfjs');
const tf = require('@tensorflow/tfjs-node'); // does not work on mac m3 pro processor
const mobilenet = require('@tensorflow-models/mobilenet');
const fs = require('fs');

const processImage = async (imagePath) => {
  const imageBuffer = fs.readFileSync(imagePath);
  const tfImage = tf.node.decodeImage(imageBuffer);
  const model = await mobilenet.load();
  const predictions = await model.classify(tfImage);
  tfImage.dispose(); // Free memory
  return predictions;
};

module.exports = { processImage };

