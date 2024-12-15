const sketch2 = (p) => {
  let myRec;
  let recognizedNumber = -1;
  let font;
  let voiceStopper = false;
  let vnExport = false;
  let isInCountdown = false;
  let countdown = 3;
  

  p.preload = () => {
    font = p.loadFont("YuseiMagic-Regular.ttf");
  };

  
  p.setup = () => {
    p.createCanvas(800, 250);
    p.background(255, 255, 255);

    // マイクの権限を要求する
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        console.log("マイクアクセスが許可されました");
        // 音声認識を開始
        myRec = new p5.SpeechRec("ja", parseResult);
        myRec.continuous = true;
        myRec.interimResults = true;
        myRec.start();
      })
      .catch((err) => {
        console.error("マイクアクセスが拒否されました:", err);
      });
    
    
    p.textFont(font);
    p.text("話しかけて！数字のみを認識します", 10, 50);
    
  };

  
  p.draw = () => {
    p.background(255, 255, 255);

    p.stroke(0, 200, 255);
    p.strokeWeight(5);
    p.textSize(50);
    p.textAlign(p.LEFT);
    p.textLeading(0);
    p.text("話しかけて！数字のみを認識します", 10, 50);
    p.text("認識された数字: " + voiceNumber, 10, 100);
    
    
    if (voiceStarter == true && recognizedNumber >= 0) {
      voiceStarter = false;
      //声で数が認識された時にのみ指の本数を検出
      fingerImport = true;
      setTimeout(() => {
        voiceStopper = true;
        fingerImport = false;
        voiceRecognitionBool = false;
      }, 1000);
      setTimeout(() => {
        fingerImport = false;
      }, 500);
    }
    
    
    
    p.textSize(20);
    p.text("voiceStarter: " + voiceStarter, 10, 120);
    p.text("voiceStopper: " + voiceStopper, 10, 140);
    p.text("recognizedNumber: " + recognizedNumber, 10, 160);
    p.text("voiceNumber: " + voiceNumber, 10, 180);
    p.text("fingerImport: " + fingerImport, 10, 200);
    p.text("voiceRecognitionBool: " + voiceRecognitionBool, 10,220);
    
  };
  //draw終わり
  

  
  const parseResult = () => {
    if (voiceRecognitionBool == true) {
      let mostrecentword = myRec.resultString;
      let numbers = mostrecentword.match(/\d+/g);
      recognizedNumber = numbers ? numbers.join(", ") : "";
      //console.log("テスト");
      voiceNumber = Number(recognizedNumber);
      console.log("voiceNumber:",voiceNumber);
    }

    if (voiceStopper == true) {
      console.log("voiceStopperがtrueになりました")
      //voiceStarter = false;
      
      setTimeout(() => {
        displayResult = true;
        //voiceNumber = -1;
        recognizedNumber = -1;
        voiceStopper = false;
      },2000);
      

    }
  };
};

new p5(sketch2, "container2");
