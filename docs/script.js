const drawCharactersInCircle = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let angle = 0;
    const radius = 150;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const allCharacters = words.join('');

    allCharacters.split('').forEach(char => {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        ctx.textAlign = 'center';
        ctx.fillText(char, radius, 0);
        ctx.restore();
        angle += (2 * Math.PI) / allCharacters.length;
    });
}

submitButton.addEventListener('click', () => {
    const newWord = inputWord.value.trim();
    if (newWord && isValidWord(newWord)) {
        words.push(newWord);
        drawCharactersInCircle();
        score++;
        scoreDisplay.textContent = score;
        inputWord.value = '';

        if (words.length > 1 && words[0][0] === words[words.length - 1][words[words.length - 1].length - 1]) {
            score += 10;
            scoreDisplay.textContent = score;
            alert('完全な円が完成しました！ボーナスポイント！');
        }
    } else {
        alert('無効な言葉です。前の言葉の終わりの文字から始まる言葉を入力してください。');
    }
});

startTimer();
