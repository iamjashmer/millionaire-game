let selectedAnswer = null;
let pollInterval = null;
let lastRevealedQuestion = -1; // Track which question we've shown modal for

// Initialize contestant page
window.addEventListener('DOMContentLoaded', () => {
    startPolling();
});

function startPolling() {
    pollInterval = setInterval(checkGameState, 500);
    checkGameState();
}

function checkGameState() {
    const state = getGameState();
    const selection = getContestantSelection();
    
    if (state.status === 'waiting' || state.status === 'paused') {
        document.getElementById('waitingScreen').style.display = 'block';
        document.getElementById('gameScreen').style.display = 'none';
        closeModal(); // Close any open modals
        return;
    }
    
    if (state.status === 'active') {
        document.getElementById('waitingScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
        
        // Update question display
        if (state.currentQuestion < state.questions.length) {
            const question = state.questions[state.currentQuestion];
            document.getElementById('questionNumber').textContent = state.currentQuestion + 1;
            document.getElementById('questionText').textContent = question.question;
            document.getElementById('textA').textContent = question.answers.A;
            document.getElementById('textB').textContent = question.answers.B;
            document.getElementById('textC').textContent = question.answers.C;
            document.getElementById('textD').textContent = question.answers.D;
            
            // Reset answer buttons when moving to new question
            if (lastRevealedQuestion !== state.currentQuestion && !state.answerRevealed) {
                ['A', 'B', 'C', 'D'].forEach(letter => {
                    const btn = document.getElementById(`answer${letter}`);
                    btn.disabled = false;
                    btn.classList.remove('selected', 'correct', 'incorrect');
                    btn.style.display = '';
                });
                closeModal(); // Close any open modals from previous question
                selectedAnswer = null;
            }
            
            // Show confirmed indicator if answer was confirmed
            if (state.confirmedAnswer && selection && selection.answer === state.confirmedAnswer) {
                document.getElementById('confirmedIndicator').classList.add('show');
            } else {
                document.getElementById('confirmedIndicator').classList.remove('show');
            }
            
            // Disable buttons if answer is revealed
            if (state.answerRevealed) {
                ['A', 'B', 'C', 'D'].forEach(letter => {
                    const btn = document.getElementById(`answer${letter}`);
                    btn.disabled = true;
                    if (letter === question.correct) {
                        btn.classList.add('correct');
                    } else if (state.confirmedAnswer && letter === state.confirmedAnswer && letter !== question.correct) {
                        btn.classList.add('incorrect');
                    }
                });
                
                // Show modal on contestant screen when answer is revealed
                if (lastRevealedQuestion !== state.currentQuestion) {
                    lastRevealedQuestion = state.currentQuestion;
                    showAnswerResultModal(state, question);
                }
            } else {
                // Update selected answer if contestant has one
                if (selection && selection.answer) {
                    selectedAnswer = selection.answer;
                    updateAnswerSelection();
                }
            }
        }
    }
}

function selectAnswer(letter) {
    const state = getGameState();
    
    // Don't allow selection if answer is revealed or already confirmed
    if (state.answerRevealed || state.confirmedAnswer) {
        return;
    }
    
    selectedAnswer = letter;
    updateAnswerSelection();
    
    // Save selection to game state
    setContestantSelection({
        answer: letter,
        questionNum: state.currentQuestion
    });
    
    // Update game state with contestant's selection
    state.selectedAnswer = letter;
    setGameState(state);
}

function updateAnswerSelection() {
    // Remove previous selection
    ['A', 'B', 'C', 'D'].forEach(letter => {
        const btn = document.getElementById(`answer${letter}`);
        btn.classList.remove('selected');
        if (!btn.disabled) {
            btn.classList.add('answer-selected');
        }
    });
    
    // Add current selection
    if (selectedAnswer) {
        const btn = document.getElementById(`answer${selectedAnswer}`);
        btn.classList.add('selected');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            btn.classList.remove('answer-selected');
        }, 500);
    }
}

function showAnswerResultModal(state, question) {
    const isCorrect = state.confirmedAnswer === question.correct;
    const currentPrize = PRIZES[state.currentQuestion] || 0;
    
    if (isCorrect) {
        // Show celebration modal for correct answer
        document.getElementById('prizeWon').textContent = `$${currentPrize.toLocaleString()}`;
        document.getElementById('correctAnswerModal').classList.add('show');
    } else {
        // Show game over modal for incorrect answer
        const guaranteedPrize = getGuaranteedPrize(state.currentQuestion);
        document.getElementById('gameOverTitle').textContent = 'Incorrect Answer';
        document.getElementById('gameOverMessage').textContent = `Sorry, that's not the correct answer.\nThe correct answer was ${question.correct}.`;
        document.getElementById('finalPrize').textContent = `$${guaranteedPrize.toLocaleString()}`;
        document.getElementById('gameOverModal').classList.add('show');
    }
}

function getGuaranteedPrize(currentQuestion) {
    if (currentQuestion === 0) return 0;
    
    let highestMilestone = 0;
    for (let i = 0; i < MILESTONES.length; i++) {
        const milestoneIndex = PRIZES.indexOf(MILESTONES[i]);
        if (currentQuestion > milestoneIndex) {
            highestMilestone = MILESTONES[i];
        }
    }
    return highestMilestone;
}

function closeModal() {
    document.getElementById('correctAnswerModal').classList.remove('show');
    document.getElementById('gameOverModal').classList.remove('show');
}

