const sketch4 = (p) => {
  const isFlipped = true; // 左右反転をさせるかどうかのフラグ、反転をさせるように設定

  let video;
  let hands;
  let handLandmarks = [];

  p.setup = () => {
    p.createCanvas(640, 480);
    video = p.createCapture(p.VIDEO);
    video.size(p.width, p.height);
    video.hide();

    hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`,
    });

    hands.setOptions({
      selfieMode: isFlipped, // 表示反転のオプション
      maxNumHands: 4, // 最大2本の手を検出
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(onResults);

    const camera = new Camera(video.elt, {
      onFrame: async () => {
        await hands.send({ image: video.elt });
      },
      width: 640,
      height: 480,
    });
    camera.start();
  };

  p.draw = () => {
    p.push();

    if (isFlipped) {
      p.translate(p.width, 0);
      p.scale(-1, 1);
    }
    p.image(video, 0, 0, p.width, p.height);
    p.pop();

    if (handLandmarks.length > 0) {
      for (let landmarks of handLandmarks) {
        if (landmarks) { // ランドマークが存在するかを確認
          drawLandmarks(landmarks);
          recognizeHandShape(landmarks);
        }
      }
    }
  };

  function onResults(results) {
    if (results.multiHandLandmarks) {
      handLandmarks = results.multiHandLandmarks;
    } else {
      handLandmarks = []; // データがない場合は空の配列にする
    }
  }

  function drawLandmarks(landmarks) {
    for (let i = 0; i < landmarks.length; i++) {
      if (landmarks[i]) { // 各ランドマークが存在するかを確認
        let x = landmarks[i].x * p.width;
        let y = landmarks[i].y * p.height;
        p.fill(0, 255, 0);
        p.noStroke();
        p.ellipse(x, y, 10, 10);
      }
    }
  }

  function recognizeHandShape(landmarks) {
    let result = "";
    if (isTwo(landmarks)) {
      p.fill(0, 255, 0);
      p.textSize(32);
      result = "2";
    } else {
      p.fill(0, 0, 0);
      p.textSize(32);
      result = "Unknown";
    }
    p.text(result, 10, 40);
    return result;
  }

  function isTwo(landmarks) {
    const UpsideExtended = isFingerExtended(landmarks, 8, 7, 6) &&
      isFingerExtended(landmarks, 12, 11, 10) &&
      !isFingerExtended(landmarks, 16, 15, 14) &&
      !isFingerExtended(landmarks, 20, 19, 18);

    const UpsideDownExtended = isFingerExtended(landmarks, 0, 6, 7, 8) &&
      isFingerExtended(landmarks, 0, 10, 11, 12) &&
      !isFingerExtended(landmarks, 0, 14, 15, 16) &&
      !isFingerExtended(landmarks, 0, 18, 19, 20);

    const LeftExtended = isSideExtended(landmarks, 8, 7, 6) &&
      isSideExtended(landmarks, 12, 11, 10) &&
      !isSideExtended(landmarks, 16, 15, 14) &&
      !isSideExtended(landmarks, 20, 19, 18);

    const RightExtended = isSideExtended(landmarks, 0, 6, 7, 8) &&
      isSideExtended(landmarks, 0, 10, 11, 12) &&
      !isSideExtended(landmarks, 0, 14, 15, 16) &&
      !isSideExtended(landmarks, 0, 18, 19, 20);

    return UpsideExtended || UpsideDownExtended || LeftExtended || RightExtended;
  }

  function isFingerExtended(landmarks, tipIndex, pipIndex, dipIndex) {
    if (!landmarks[tipIndex] || !landmarks[pipIndex] || !landmarks[dipIndex]) {
      return false;
    }

    const tip = landmarks[tipIndex];
    const pip = landmarks[pipIndex];
    const dip = landmarks[dipIndex];

    return (tip.y < pip.y) && (pip.y < dip.y);
  }

  function isSideExtended(landmarks, tipIndex, pipIndex, dipIndex) {
    if (!landmarks[tipIndex] || !landmarks[pipIndex] || !landmarks[dipIndex]) {
      return false;
    }

    const tip = landmarks[tipIndex];
    const pip = landmarks[pipIndex];
    const dip = landmarks[dipIndex];

    return (tip.x < pip.x) && (pip.x < dip.x);
  }
};

new p5(sketch4, "container4");