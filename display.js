//何も言っていない時：-1にして反応しないように
window.voiceNumber = -1;
window.fingerNumber = 0;
//voiceStarter:trueの間に音声で0以上の数を認識すると、1秒後に音声認識がオフ
window.voiceStarter = false;

window.voiceImport = false;
window.fingerImport = false;
//voiceRecognitionBool:trueの間、音声認識のif文がオン
window.voiceRecognitionBool = false;
window.displayResult = false;

window.elapsedTime = 0;
window.currentCommand = 0;
let inRoutine = false;
let startTime;


let peaceSignBool = false;
let signRecognitionBool = false;
let countdownBool3 = false;
let countdownBool2 = false;
let countdownBool1 = false;
let countdownNumber = 3;

let displayErrorBool = false;
let displayResultBool = false;
let displayCorrectBool = false;
let displayUncorrectBool = false;


const sketch3= (p) => {
  
  let isResultSoundPlayed = false;
  let didReadNumber = false;
  
  
  p.preload = () => {
    sound_seikai = p.loadSound('sound_folder/seikai.mp3');
  };
  
  p.setup = () => {
    // 全画面のキャンバスを作成
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    p.createCanvas(canvasWidth, canvasHeight);
    
    // ウィンドウリサイズ時のイベントリスナー
    window.addEventListener('resize', () => {
      p.resizeCanvas(window.innerWidth, window.innerHeight);
    });
    
    document.addEventListener("keydown", (event) => {
      if(event.key ==='s' && inRoutine == false){
        inRoutine = true;
        startTime = p.millis();
        console.log(startTime);
      }
    });
  };

  p.draw = () => {
    p.background(255,255,255);
    p.stroke(0, 200, 255);
    p.strokeWeight(5);
    
    // 動的なテキストサイズ
    const baseFontSize = p.width * 0.04;
    p.textSize(baseFontSize);
    p.textAlign(p.CENTER, p.CENTER);
    
 
    
    if(inRoutine == true){
      elapsedTime = p.millis() - startTime;
      //%の後の数：currentCommandの最後の数+1
      currentCommand = Math.floor((elapsedTime / 1000) % 13);
    }else{
      currentCommand = 0;
    }
    
    
    //何も無い時と検知してすぐの時：currentcommandは0
    if (currentCommand === 0) {
      p.text("ピースサインで音声認識をスタートします", p.width/2, p.height * 0.5);
      if(peaceSignBool == false){
        speakPeace();
        peaceSignBool = true;
      }
    }
    
    //サインを検知
    else if(currentCommand === 1){
      p.text("サインを検知しました！！", p.width/2, p.height * 0.5);
      if(signRecognitionBool == false){
        speakSignRecognition();
        signRecognitionBool = true;
      }
    }
    else if(currentCommand === 2){
      
    }
    
    //カウントダウン
    else if(currentCommand === 3){
      p.text("3", p.width/2, p.height * 0.5);
      if(countdownBool3 == false){
        speakCountdown();
        countdownBool3 = true;
        countdownNumber --;
      }
    }
    else if(currentCommand === 4){
      p.text("2", p.width/2, p.height * 0.5);
      if(countdownBool2 == false){
        speakCountdown();
        countdownBool2 = true;
        countdownNumber --;
      }
    }
    else if(currentCommand === 5){
      p.text("1", p.width/2, p.height * 0.5);
      if(countdownBool1 == false){
        speakCountdown();
        countdownBool1 = true;
        countdownNumber --;
      }
    }
    
    //カウントダウン終わり、声と指の検出をオン
    else if(currentCommand === 6){
      p.text("(数字を言って！)", p.width/2, p.height * 0.5);
      //voiceStarterをtrueにし、voiceRecognition.jsへ
      voiceStarter = true;
      voiceRecognitionBool = true;
    }
    
    else if(currentCommand === 7){
      
    }
    
    //一定時間以内に何もなくてもオフ（検出もオフのトリガーにする）
    //結果を読み上げ（一応音声認識した数字も読み上げ）
    else if(currentCommand === 8){
      voiceStarter = false;
      voiceRecognitionBool = false;
      //認識した数を表示
      if(voiceNumber < 0){
        displayErrorBool = true;
      }else{
        displayResultBool = true;
      }
      
      //数字の読み上げ
      if(didReadNumber == false){
        if(voiceNumber < 0){
          speakRecognitionError();
        }else{
          speakVoiceNumber();
          setTimeout(() => {
            speakFingerNumber();
          },1000);
        }
        didReadNumber = true;
      }
      
    }
    
    else if(currentCommand === 9){
    }
    else if(currentCommand === 10){
    }
    
    //正解判定
    else if(currentCommand === 11){
      if(voiceNumber < 0){
        //負の時：何もしない
      }else{
        displayResultBool = false;
        if(voiceNumber == fingerNumber){
          displayCorrectBool = true;
          if(isResultSoundPlayed == false){
            sound_seikai.play();
            isResultSoundPlayed = true;
          }
        }else{
          displayUncorrectBool = true;
        }
      }

    }
    //元に戻る(currentcommand = 0にする)
    else if(currentCommand === 12){
      currentCommand = 0;
      inRoutine = false;
      didReadNumber = false;
      isResultSoundPlayed = false;
      voiceNumber = -1;
      countdownNumber = 3;
      countdownBool3 = false;
      countdownBool2 = false;
      countdownBool1 = false;
      signRecognitionBool = false;
      displayErrorBool = false;
      displayCorrectBool = false;
      displayUncorrectBool = false;
    }
    
    
    
    if(displayErrorBool){
      displayError();
    }
    if(displayResultBool){
      displayResult();
    }
    if(displayCorrectBool){
      displayCorrect();
    }
    if(displayUncorrectBool){
      displayUncorrect();
    }
    
  };
  //draw終わり
  
  
  
  
  
  //読み上げ
  const speakPeace = () => {
    let utterance = new SpeechSynthesisUtterance("ピースサインで音声認識をスタートします");
    utterance.lang = "ja-JP"; // 日本語で読み上げ
    speechSynthesis.speak(utterance);
  };
  
  const speakSignRecognition = () => {
    let utterance = new SpeechSynthesisUtterance("サインを検知しました");
    utterance.lang = "ja-JP"; // 日本語で読み上げ
    speechSynthesis.speak(utterance);
  };
  
  const speakCountdown = () => {
    let utterance = new SpeechSynthesisUtterance(countdownNumber);
    utterance.lang = "ja-JP"; // 日本語で読み上げ
    speechSynthesis.speak(utterance);
  };
  
  const speakVoiceNumber = () => {
    let utterance = new SpeechSynthesisUtterance("音声認識した数　" + voiceNumber);
    utterance.lang = "ja-JP"; // 日本語で読み上げ
    speechSynthesis.speak(utterance);
  };
  
  const speakFingerNumber = () => {
    let utterance = new SpeechSynthesisUtterance("指の数　" + fingerNumber);
    utterance.lang = "ja-JP"; // 日本語で読み上げ
    speechSynthesis.speak(utterance);
  };
  
  const speakRecognitionError = () => {
    let utterance = new SpeechSynthesisUtterance("音声が認識できませんでした");
    utterance.lang = "ja-JP"; // 日本語で読み上げ
    speechSynthesis.speak(utterance);
  };
  
  
  //結果の表示
  const displayError = () => {
    p.textAlign(p.CENTER, p.CENTER);
    p.text("音声認識した数: 認識できませんでした", p.width/2, p.height * 0.7);
  }
  const displayResult = () =>{
    const centerX = p.width / 2;
    
    // 縦線を引く
    p.stroke(200);
    p.strokeWeight(2);
    p.line(centerX, 0, centerX, p.height);
    
    // テキストサイズを画面サイズに合わせて調整
    p.textSize(p.width * 0.03);
    
    // 音声認識した数 - 左側1/4の位置
    p.noStroke();
    p.fill(0);
    p.textAlign(p.CENTER);
    p.text("音声認識した数: " + voiceNumber, centerX / 2, p.height * 0.8);
    
    // 認識した指の数 - 右側1/4の位置
    p.text("認識した指の数: " + fingerNumber, centerX * 1.5, p.height * 0.8);
  }

  const displayCorrect = () => {
    p.textAlign(p.CENTER, p.CENTER);
    p.text("正解!!", p.width/2, p.height * 0.7);
  }

  const displayUncorrect = () => {
    p.textAlign(p.CENTER, p.CENTER);
    p.text("不正解", p.width/2, p.height * 0.7);
  }
  
};

new p5(sketch3, "container3");