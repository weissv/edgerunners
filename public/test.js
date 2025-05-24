const video = document.getElementById("video");
let emotionsData = {}; // Object to store emotion counts
const summaryInterval = 5000; // Summary interval in milliseconds (e.g., 5 seconds)

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  // Set up interval for emotion summarization
  setInterval(async () => {
    // Detect faces, landmarks, and expressions
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    // Process detections
    detections.forEach((detection) => {
      const expressions = detection.expressions;
      // Increment counts for each detected expression
      for (const [emotion, probability] of Object.entries(expressions)) {
        if (!emotionsData[emotion]) {
          emotionsData[emotion] = 0;
        }
        emotionsData[emotion] += probability;
      }
    });

    // Print or process summary after the interval
    if (video.currentTime % summaryInterval === 0) {
      const summary = calculateSummary(emotionsData);
      console.log("Summary:", summary);
      // Reset emotion data after summarization
      emotionsData = {};
    }
  }, summaryInterval);
});

// Function to calculate summary statistics (e.g., percentages) from emotion data
function calculateSummary(emotionsData) {
  const total = Object.values(emotionsData).reduce((acc, val) => acc + val, 0);
  const summary = {};
  for (const [emotion, count] of Object.entries(emotionsData)) {
    summary[emotion] = (count / total) * 100; // Calculate percentage
  }
  return summary;
}
