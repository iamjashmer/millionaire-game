// Prize ladder (in dollars)
const PRIZES = [
    100, 200, 300, 500, 1000,          // Easy Round
    5000, 10000, 20000, 40000, 100000, // Medium Round
    250000, 500000, 750000, 900000, 1000000 // Hard Round
];

// Milestone prizes (guaranteed if you reach them)
const MILESTONES = [1000, 100000];

// Question database with increasing difficulty
const QUESTIONS = [
    // Easy (1-5)
    {
        question: "What is the value of 6 × 8?",
        answers: { A: "36", B: "42", C: "48", D: "56" },
        correct: "C"
    },
    {
        question: "Which planet is known as the Red Planet?",
        answers: { A: "Venus", B: "Mars", C: "Jupiter", D: "Mercury" },
        correct: "B"
    },
    {
        question: "What is ½ + ½?",
        answers: { A: "½", B: "1", C: "2", D: "0" },
        correct: "B"
    },
    {
        question: "Who was the first President of the United States?",
        answers: { A: "Abraham Lincoln", B: "George Washington", C: "Thomas Jefferson", D: "John Adams" },
        correct: "B"
    },
    {
        question: "Which gas do plants absorb during photosynthesis?",
        answers: { A: "Oxygen", B: "Nitrogen", C: "Carbon Dioxide", D: "Hydrogen" },
        correct: "C"
    },
    // Medium (6-10)
    {
        question: "What is the prime factorization of 12?",
        answers: { A: "2 × 6", B: "3 × 4", C: "2 × 2 × 3", D: "12 × 1" },
        correct: "C"
    },
    {
        question: "Which part of the cell controls the cell's activities?",
        answers: { A: "Cell membrane", B: "Nucleus", C: "Cytoplasm", D: "Mitochondria" },
        correct: "B"
    },
    {
        question: "If a triangle has angles 60°, 60°, and 60°, what type of triangle is it?",
        answers: { A: "Right", B: "Isosceles", C: "Equilateral", D: "Scalene" },
        correct: "C"
    },
    {
        question: "The Earth rotates on its axis once every —",
        answers: { A: "12 hours", B: "24 hours", C: "30 days", D: "365 days" },
        correct: "B"
    },
    {
        question: "The ancient pyramids of Giza are found in —",
        answers: { A: "Greece", B: "Mexico", C: "Egypt", D: "China" },
        correct: "C"
    },
    // Hard (11-15)
    {
        question: "What is the value of 3⁴?",
        answers: { A: "9", B: "27", C: "81", D: "64" },
        correct: "C"
    },
    {
        question: "Which scientist proposed the three laws of motion?",
        answers: { A: "Galileo Galilei", B: "Albert Einstein", C: "Isaac Newton", D: "Nikola Tesla" },
        correct: "C"
    },
    {
        question: "A number divisible by both 2 and 3 is divisible by —",
        answers: { A: "4", B: "5", C: "6", D: "9" },
        correct: "C"
    },
    {
        question: "What instrument is used to measure atmospheric pressure?",
        answers: { A: "Thermometer", B: "Barometer", C: "Anemometer", D: "Hygrometer" },
        correct: "B"
    },
    {
        question: "The Renaissance began in which country?",
        answers: { A: "France", B: "England", C: "Italy", D: "Spain" },
        correct: "C"
    }
];

// Game state
let currentQuestion = 0;
let selectedAnswer = null;
let lifelinesUsed = {
    fiftyFifty: false,
    phoneFriend: false,
    askAudience: false
};

// Initialize game
function initGame() {
    currentQuestion = 0;
    selectedAnswer = null;
    lifelinesUsed = {
        fiftyFifty: false,
        phoneFriend: false,
        askAudience: false
    };
    
    updatePrizeLadder();
    updateLifelines();
    loadQuestion();
    updatePrizeDisplay();
    document.getElementById('finalAnswerBtn').disabled = true;
    document.getElementById('gameOverModal').classList.remove('show');
    document.getElementById('correctAnswerModal').classList.remove('show');
    
    // Reset all answer buttons
    ['A', 'B', 'C', 'D'].forEach(letter => {
        const btn = document.getElementById(`answer${letter}`);
        btn.disabled = false;
        btn.classList.remove('selected', 'correct', 'incorrect');
    });
}

function updatePrizeLadder() {
    const prizeList = document.getElementById('prizeList');
    prizeList.innerHTML = '';
    
    PRIZES.forEach((prize, index) => {
        const prizeItem = document.createElement('div');
        prizeItem.className = 'prize-item';
        prizeItem.id = `prize-${index}`;
        
        // Highlight the prize for the current question (we're playing for this prize)
        if (index === currentQuestion) {
            prizeItem.classList.add('active');
        } else if (index < currentQuestion) {
            // Prizes we've already won (passed)
            prizeItem.classList.add('passed');
        }
        
        if (MILESTONES.includes(prize)) {
            prizeItem.classList.add('milestone');
        }
        
        prizeItem.textContent = `$${prize.toLocaleString()}`;
        prizeList.appendChild(prizeItem);
    });
}

function updateLifelines() {
    document.getElementById('fiftyFifty').disabled = lifelinesUsed.fiftyFifty;
    document.getElementById('phoneFriend').disabled = lifelinesUsed.phoneFriend;
    document.getElementById('askAudience').disabled = lifelinesUsed.askAudience;
}

function updatePrizeDisplay() {
    // Show the prize we're currently playing for
    const currentPrizeAmount = PRIZES[currentQuestion];
    const guaranteedPrizeAmount = getGuaranteedPrize();
    
    document.getElementById('currentPrize').textContent = `$${currentPrizeAmount.toLocaleString()}`;
    document.getElementById('guaranteedPrize').textContent = `$${guaranteedPrizeAmount.toLocaleString()}`;
}

function getGuaranteedPrize() {
    if (currentQuestion === 0) return 0;
    
    // Find the highest milestone we've passed
    let highestMilestone = 0;
    for (let i = 0; i < MILESTONES.length; i++) {
        const milestoneIndex = PRIZES.indexOf(MILESTONES[i]);
        // If we've passed this milestone (currentQuestion > milestoneIndex means we've answered question milestoneIndex + 1 correctly)
        if (currentQuestion > milestoneIndex) {
            highestMilestone = MILESTONES[i];
        }
    }
    return highestMilestone;
}

function loadQuestion() {
    if (currentQuestion >= QUESTIONS.length) {
        winGame();
        return;
    }
    
    const question = QUESTIONS[currentQuestion];
    document.getElementById('questionNumber').textContent = currentQuestion + 1;
    document.getElementById('questionText').textContent = question.question;
    
    document.getElementById('textA').textContent = question.answers.A;
    document.getElementById('textB').textContent = question.answers.B;
    document.getElementById('textC').textContent = question.answers.C;
    document.getElementById('textD').textContent = question.answers.D;
    
    selectedAnswer = null;
    document.getElementById('finalAnswerBtn').disabled = true;
    
    // Reset answer buttons
    ['A', 'B', 'C', 'D'].forEach(letter => {
        const btn = document.getElementById(`answer${letter}`);
        btn.disabled = false;
        btn.classList.remove('selected', 'correct', 'incorrect');
        btn.style.display = '';
    });
    
    document.getElementById('lifelineResult').classList.remove('show');
    updatePrizeLadder();
}

function selectAnswer(letter) {
    if (selectedAnswer === letter) {
        // Deselect if clicking the same answer
        selectedAnswer = null;
        document.getElementById(`answer${letter}`).classList.remove('selected');
        document.getElementById('finalAnswerBtn').disabled = true;
    } else {
        // Remove previous selection
        if (selectedAnswer) {
            document.getElementById(`answer${selectedAnswer}`).classList.remove('selected');
        }
        
        // Select new answer
        selectedAnswer = letter;
        document.getElementById(`answer${letter}`).classList.add('selected');
        document.getElementById('finalAnswerBtn').disabled = false;
    }
}

function submitFinalAnswer() {
    if (!selectedAnswer) return;
    
    const question = QUESTIONS[currentQuestion];
    const isCorrect = selectedAnswer === question.correct;
    
    // Disable all buttons
    ['A', 'B', 'C', 'D'].forEach(letter => {
        const btn = document.getElementById(`answer${letter}`);
        btn.disabled = true;
        
        if (letter === question.correct) {
            btn.classList.add('correct');
        } else if (letter === selectedAnswer && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });
    
    setTimeout(() => {
        if (isCorrect) {
            showCorrectAnswerModal();
        } else {
            loseGame();
        }
    }, 2000);
}

function showCorrectAnswerModal() {
    const prizeWon = PRIZES[currentQuestion];
    document.getElementById('prizeWon').textContent = `$${prizeWon.toLocaleString()}`;
    document.getElementById('correctAnswerModal').classList.add('show');
}

function proceedToNextQuestion() {
    document.getElementById('correctAnswerModal').classList.remove('show');
    
    currentQuestion++;
    if (currentQuestion >= QUESTIONS.length) {
        winGame();
    } else {
        loadQuestion();
        updatePrizeDisplay();
    }
}

function useLifeline(lifeline) {
    if (lifelinesUsed[lifeline]) return;
    
    const question = QUESTIONS[currentQuestion];
    const resultDiv = document.getElementById('lifelineResult');
    
    switch (lifeline) {
        case 'fiftyFifty':
            lifelinesUsed.fiftyFifty = true;
            const wrongAnswers = ['A', 'B', 'C', 'D'].filter(letter => 
                letter !== question.correct
            );
            const toRemove = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 2);
            
            toRemove.forEach(letter => {
                document.getElementById(`answer${letter}`).style.display = 'none';
            });
            
            resultDiv.textContent = 'Two wrong answers have been removed!';
            break;
            
        case 'phoneFriend':
            lifelinesUsed.phoneFriend = true;
            const friendConfidence = Math.random();
            let friendAnswer;
            const isCorrect = Math.random() < 0.8; // 80% chance of being correct
            
            if (isCorrect) {
                friendAnswer = question.correct;
                const confidenceLevel = Math.floor(Math.random() * 20) + 75; // 75-95% confidence
                resultDiv.textContent = `Your friend says: "I'm ${confidenceLevel}% sure it's ${friendAnswer}!"`;
            } else {
                // 20% chance - give a wrong answer
                const wrongAnswers = ['A', 'B', 'C', 'D'].filter(letter => letter !== question.correct);
                friendAnswer = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
                const confidenceLevel = Math.floor(Math.random() * 30) + 40; // 40-70% confidence (lower)
                resultDiv.textContent = `Your friend says: "I think it might be ${friendAnswer}, but I'm only ${confidenceLevel}% sure..."`;
            }
            break;
            
        case 'askAudience':
            lifelinesUsed.askAudience = true;
            const correctLetter = question.correct;
            const isAudienceCorrect = Math.random() < 0.8; // 80% chance of being correct
            const audiencePercentages = {};
            
            // Get visible answers (in case 50:50 was used)
            const visibleAnswers = ['A', 'B', 'C', 'D'].filter(letter => 
                document.getElementById(`answer${letter}`).style.display !== 'none'
            );
            
            if (isAudienceCorrect) {
                // 80% chance - correct answer gets high percentage (70-85%)
                audiencePercentages[correctLetter] = Math.floor(Math.random() * 16) + 70;
                let remaining = 100 - audiencePercentages[correctLetter];
                
                // Distribute remaining percentage among wrong answers
                const wrongAnswers = visibleAnswers.filter(letter => letter !== correctLetter);
                wrongAnswers.forEach((letter, index) => {
                    if (index === wrongAnswers.length - 1) {
                        audiencePercentages[letter] = remaining;
                    } else {
                        const percent = Math.floor(Math.random() * remaining);
                        audiencePercentages[letter] = percent;
                        remaining -= percent;
                    }
                });
            } else {
                // 20% chance - wrong answer gets high percentage
                const wrongAnswers = visibleAnswers.filter(letter => letter !== correctLetter);
                const misleadingAnswer = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
                audiencePercentages[misleadingAnswer] = Math.floor(Math.random() * 16) + 70; // 70-85%
                
                let remaining = 100 - audiencePercentages[misleadingAnswer];
                
                // Distribute remaining among other answers (including correct one)
                const otherAnswers = visibleAnswers.filter(letter => letter !== misleadingAnswer);
                otherAnswers.forEach((letter, index) => {
                    if (index === otherAnswers.length - 1) {
                        audiencePercentages[letter] = remaining;
                    } else {
                        const percent = Math.floor(Math.random() * remaining);
                        audiencePercentages[letter] = percent;
                        remaining -= percent;
                    }
                });
            }
            
            let audienceText = 'The audience votes:\n';
            visibleAnswers.forEach(letter => {
                audienceText += `${letter}: ${audiencePercentages[letter]}%  `;
            });
            
            resultDiv.textContent = audienceText;
            break;
    }
    
    resultDiv.classList.add('show');
    updateLifelines();
    
    // Display duration: 50:50 = 5 seconds, Phone/Audience = 12 seconds
    const displayDuration = (lifeline === 'fiftyFifty') ? 5000 : 12000;
    
    setTimeout(() => {
        resultDiv.classList.remove('show');
    }, displayDuration);
}

function quitGame() {
    const currentPrize = currentQuestion > 0 ? PRIZES[currentQuestion - 1] : 0;
    showGameOver('You chose to walk away!', currentPrize, false);
}

function winGame() {
    showGameOver('Congratulations! You are a MILLIONAIRE!', 1000000, true);
}

function loseGame() {
    const guaranteedPrize = getGuaranteedPrize();
    showGameOver('Sorry, that\'s not the correct answer.', guaranteedPrize, false);
}

function showGameOver(message, prize, isWin) {
    document.getElementById('gameOverTitle').textContent = isWin ? 'You Won!' : 'Game Over';
    document.getElementById('gameOverMessage').textContent = message;
    document.getElementById('finalPrize').textContent = `$${prize.toLocaleString()}`;
    document.getElementById('gameOverModal').classList.add('show');
}

function resetGame() {
    initGame();
}

// Start the game when page loads
initGame();

