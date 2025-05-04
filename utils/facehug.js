const sharp = require('sharp');
const canvas = require('canvas');
const faceapi = require('@vladmandic/face-api');
const path = require('path');

const { Canvas, Image, ImageData } = canvas;

// Configure face-api to use node-canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Path to models directory
const MODEL_URL = path.join(__dirname, "../aimodels");

let modelsLoaded = false;

// Load required face-api models
async function loadModels() {
  try {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
    modelsLoaded = true;
    console.log("✅ Face-api models loaded");
  } catch (error) {
    console.error("❌ Error loading face-api models:", error);
    throw error;
  }
}

// Detect a single face and return bounding box info
async function detectFace(buffer) {
  const img = await canvas.loadImage(buffer);
  const detection = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks();

  if (!detection) {
    throw new Error('❌ No face detected in image');
  }

  const { box } = detection.detection;
  return {
    image: img,
    box: {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
    }
  };
}

// Hug two faces: crop, resize, and place side by side
async function hugFaces(buffer1, buffer2) {
  if (!modelsLoaded) await loadModels();

  const face1 = await detectFace(buffer1);
  const face2 = await detectFace(buffer2);

  const face1Crop = await sharp(buffer1)
    .extract({
      left: Math.round(face1.box.x),
      top: Math.round(face1.box.y),
      width: Math.round(face1.box.width),
      height: Math.round(face1.box.height)
    })
    .resize(250, 250)  // Resize faces to match size
    .toBuffer();

  const face2Crop = await sharp(buffer2)
    .extract({
      left: Math.round(face2.box.x),
      top: Math.round(face2.box.y),
      width: Math.round(face2.box.width),
      height: Math.round(face2.box.height)
    })
    .resize(250, 250)  // Resize faces to match size
    .toBuffer();

  // Flip the second face horizontally so they are facing each other
  const face2Flipped = await sharp(face2Crop).flop().toBuffer();

  // Merge the two faces side by side
  const merged = await sharp({
    create: {
      width: 500,  // Total width of the canvas (two faces side by side)
      height: 250,
      channels: 3,
      background: { r: 255, g: 192, b: 203 }  // Light pink background
    }
  })
    .composite([
      { input: face1Crop, top: 0, left: 0 },  // Position first face on the left
      { input: face2Flipped, top: 0, left: 250 }  // Position second face on the right, flipped
    ])
    .jpeg()
    .toBuffer();

  return merged;
}

module.exports = { hugFaces };
