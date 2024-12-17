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
    p.createCanvas(800, 300);
    p.background(255, 255, 255);
    
    // マイクの権限を要求する
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        console.log("マイクアクセスが許可されました");
        
        // 音声認識を開始
        myRec = new p5.SpeechRec("ja", parseResult);
        myRec.continuous = true;
        myRec.interimResults = false; // 最終結果のみを使用
        myRec.start();
        
        console.log("音声認識が開始されました");
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
 
    // デバッグ情報
    p.textSize(20);
    p.text("voiceStarter: " + voiceStarter, 10, 120);
    p.text("voiceStopper: " + voiceStopper, 10, 140);
    p.text("recognizedNumber: " + recognizedNumber, 10, 160);
    p.text("voiceNumber: " + voiceNumber, 10, 180);
    p.text("fingerImport: " + fingerImport, 10, 200);
    p.text("voiceRecognitionBool: " + voiceRecognitionBool, 10, 220);
    p.text("fingerNumber: " + fingerNumber, 10, 240);
 
    // 音声認識のトリガー条件を明確化
    if (voiceStarter && recognizedNumber >= 0) {
      console.log("音声認識トリガー条件が満たされました");
      voiceStarter = false;
      fingerImport = true;
      
      setTimeout(() => {
        voiceStopper = true;
        fingerImport = false;
        voiceRecognitionBool = false;
      }, 1000);
      
      setTimeout(() => {
        fingerImport = false;
      }, 800);
    }
  };
 
  const parseResult = () => {
    console.log("parseResult呼び出し");
    console.log("voiceRecognitionBool:", voiceRecognitionBool);
    
    if (voiceRecognitionBool) {
      let mostrecentword = myRec.resultString;
      console.log("認識された文字列:", mostrecentword);
      
      // 数字のみを抽出
      let numbers = mostrecentword.match(/\d+/g);
      
      if (numbers) {
        recognizedNumber = Number(numbers[0]); // 最初に見つかった数字を使用
        voiceNumber = recognizedNumber;
        
        console.log("認識された数字:", voiceNumber);
      } else {
        console.log("数字が認識されませんでした");
        voiceNumber = -1;
        recognizedNumber = -1;
      }
    }
 
    if (voiceStopper) {
      console.log("voiceStopperがtrueになりました");
      
      setTimeout(() => {
        displayResult = true;
        recognizedNumber = -1;
        voiceStopper = false;
      }, 2000);
    }
  };
 };
 
 new p5(sketch2, "container2");