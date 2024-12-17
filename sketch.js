const mainSketch = (p) => {
  const isFlipped = true; // 映像の左右反転

  let video;
  let hands;
  let handLandmarks = [];
  let mode = 2; // モードを切り替える変数 (1: sketch1, 2: sketch4)

  p.setup = () => {
    p.createCanvas(640, 480);

    // Webカメラをキャプチャ
    video = p.createCapture(p.VIDEO);
    video.size(p.width, p.height);
    video.hide();

    // Mediapipe Handsの初期化
    hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`,
    });

    hands.setOptions({
      selfieMode: isFlipped,
      maxNumHands: 10,
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
    // ビデオ映像を描画 (左右反転対応)
    p.push();
    if (isFlipped) {
      p.translate(p.width, 0);
      p.scale(-1, 1);
    }
    p.image(video, 0, 0, p.width, p.height);
    p.pop();
    
    //モード切り替え
    if(peaceSignMode){
      mode = 2;
    }else{
      mode = 1;
    }
    
    // モードに応じた処理
    if (mode === 1) {
      sketch1Draw();
    } else if (mode === 2) {
      sketch4Draw();
    }

    // モード表示
    p.fill(255);
    p.textSize(16);
    p.textAlign(p.LEFT, p.TOP);
    p.text(`Mode: ${mode}`, 10, 10);
    
    
  };

  // 描画処理
  function sketch1Draw() {
    let thumbsUpCount = 0;
    for (let landmarks of handLandmarks) {
      if (landmarks) {
        drawLandmarks(landmarks);
        if (isThumbUp(landmarks)) {
          thumbsUpCount++;
        }
      }
    }

    // 親指を立てた数を表示
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(120);
    p.fill(255, 0, 0);
    p.text(thumbsUpCount, p.width / 2, p.height / 2);
    
    //エクスポート
    if(fingerImport){
      fingerNumber = thumbsUpCount;  
    }
    
  }

  function sketch4Draw() {
    for (let landmarks of handLandmarks) {
      if (landmarks) {
        drawLandmarks(landmarks);
        recognizeHandShape(landmarks);
      }
    }
  }

  // Mediapipe Handsの結果処理
  function onResults(results) {
    handLandmarks = results.multiHandLandmarks || [];
  }

  // ランドマークの描画
  function drawLandmarks(landmarks) {
    for (let i = 0; i < landmarks.length; i++) {
      if (landmarks[i]) {
        let x = landmarks[i].x * p.width;
        let y = landmarks[i].y * p.height;
        p.fill(0, 255, 0);
        p.noStroke();
        p.ellipse(x, y, 10, 10);
      }
    }
  }

  // 親指が立っているかの判定
  function isThumbUp(landmarks) {
    const palmVector = p.createVector(
      landmarks[6].x - landmarks[5].x,
      landmarks[6].y - landmarks[5].y
    );
    const thumbVector = p.createVector(
      landmarks[4].x - landmarks[2].x,
      landmarks[4].y - landmarks[2].y
    );
    const angle = p.degrees(
      Math.acos(
        palmVector.dot(thumbVector) / (palmVector.mag() * thumbVector.mag())
      )
    );
    return angle > 45;
  }

  // 指の形状認識
  function recognizeHandShape(landmarks) {
    let result = "";
    //ピースサイン
    if (isTwo(landmarks)) {
      p.fill(0, 255, 0);
      p.textSize(32);
      result = "2";
      //ピースサイン認識後の処理
      //ピースの認識をオンに
      isPeaceRecognized = true;
      //ピースサインモードから指の数の認識に
      peaceSignMode = false;
    }
    else {
      p.fill(0, 0, 0);
      p.textSize(32);
      result = "Unknown";
    }
    p.text(result, 10, 40);
  }

  function isTwo(landmarks) {
    return (
      isFingerExtended(landmarks, 8, 7, 6) &&
      isFingerExtended(landmarks, 12, 11, 10) &&
      !isFingerExtended(landmarks, 16, 15, 14) &&
      !isFingerExtended(landmarks, 20, 19, 18)
    );
  }

  function isFingerExtended(landmarks, tipIndex, pipIndex, dipIndex) {
    if (!landmarks[tipIndex] || !landmarks[pipIndex] || !landmarks[dipIndex]) {
      return false;
    }
    const tip = landmarks[tipIndex];
    const pip = landmarks[pipIndex];
    const dip = landmarks[dipIndex];
    return tip.y < pip.y && pip.y < dip.y;
  }
};

// スケッチをインスタンスモードで実行
new p5(mainSketch, "container1");
