const isFlipped = true;

const sketch1 = (p) => {
  let video;
  let hands;
  let handLandmarks = [];

  p.setup = () => {
    p.createCanvas(640, 480);

    // Web Camera Capture (changed from internal camera)
    video = p.createCapture({
      video: {
        mandatory: {
          minWidth: 640,
          minHeight: 480,
          maxWidth: 640,
          maxHeight: 480,
        },
      },
    });
    video.size(p.width, p.height);
    video.hide();

    hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`,
    });

    hands.setOptions({
      selfieMode: isFlipped,
      maxNumHands: 10, // 手の検出可能数
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
    // 映像の描画 左右反転のフラグ
    p.push();
    if (isFlipped) {
      p.translate(p.width, 0);
      p.scale(-1, 1);
    }
    p.image(video, 0, 0, p.width, p.height);
    p.pop();

    // 手のランドマーク 親指判定
    let thumbsUpCount = 0;
    if (handLandmarks.length > 0) {
      for (let landmarks of handLandmarks) {
        if (landmarks) {
          drawLandmarks(landmarks);
          if (isThumbUp(landmarks)) {
            thumbsUpCount++;
          }
        }
      }
    }

    // 親指 本数表示
    //p.textAlign(p.CENTER, p.CENTER);
    p.textAlign(p.CENTER);
    p.textSize(120);
    p.textFont("Rowdies");
    p.stroke(0);
    p.fill(255, 0, 0);
    p.text(thumbsUpCount, p.width / 2, p.height / 2);
    
    //値のエクスポート
    //if(fingerImport == true){
      fingerNumber = thumbsUpCount;  
    //}
    
  };

  function isThumbUp(landmarks) {
    // 手のひら（人差し指付け根 to 人差し指第一関節）のベクトル
    const palmVector = p.createVector(
      landmarks[6].x - landmarks[5].x,
      landmarks[6].y - landmarks[5].y
    );

    // 親指のベクトル
    const thumbVector = p.createVector(
      landmarks[4].x - landmarks[2].x,
      landmarks[4].y - landmarks[2].y
    );

    // ベクトルの内積　角度計算用
    const angle = p.degrees(
      Math.acos(
        p5.Vector.dot(palmVector, thumbVector) /
          (palmVector.mag() * thumbVector.mag())
      )
    );

    // デバッグ用: コンソールに角度を出力
    //console.log(`Thumb angle: ${angle}`);

    // 親指立て　角度判定
    return angle > 45;
  }

  function drawLandmarks(landmarks) {
    for (let i = 0; i < landmarks.length; i++) {
      if (landmarks[i]) {
        let x = landmarks[i].x * p.width;
        let y = landmarks[i].y * p.height;
        p.fill(0, 255, 0);
        p.noStroke();
        p.ellipse(x, y, 5, 5);
      }
    }
  }

  function onResults(results) {
    handLandmarks = results.multiHandLandmarks || [];
  }
};

// コンテナにスケッチを割り当て
new p5(sketch1, "container1");
