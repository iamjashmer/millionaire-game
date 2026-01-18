let pollInterval = null;

// Initialize host page
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
    
    // Update question display
    if (state.currentQuestion < state.questions.length) {
        const question = state.questions[state.currentQuestion];
        document.getElementById('questionNumber').textContent = state.currentQuestion + 1;
        document.getElementById('questionText').textContent = question.question;
        
        // Display answers
        const answersSection = document.getElementById('answersSection');
        answersSection.innerHTML = '';
        
        ['A', 'B', 'C', 'D'].forEach(letter => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.innerHTML = `
                <span class="answer-label">${letter}:</span>
                <span class="answer-text">${question.answers[letter]}</span>
            `;
            
            if (state.answerRevealed) {
                btn.disabled = true;
                if (letter === question.correct) {
                    btn.classList.add('correct');
                } else if (letter === state.confirmedAnswer && letter !== question.correct) {
                    btn.classList.add('incorrect');
                }
            }
            
            answersSection.appendChild(btn);
        });
        
        // Update contestant answer display
        const answerDisplay = document.getElementById('contestantAnswerDisplay');
        const statusEl = document.getElementById('contestantStatus');
        const confirmBtn = document.getElementById('confirmBtn');
        const rejectBtn = document.getElementById('rejectBtn');
        
        if (state.answerRevealed) {
            // Answer has been revealed
            answerDisplay.textContent = `Correct Answer: ${question.correct}`;
            statusEl.className = 'answer-status confirmed';
            statusEl.textContent = 'Answer Revealed';
            confirmBtn.disabled = true;
            rejectBtn.disabled = true;
            document.getElementById('revealBtn').disabled = true;
        } else if (state.confirmedAnswer) {
            // Answer is confirmed, waiting for reveal
            answerDisplay.textContent = `Contestant's Final Answer: ${state.confirmedAnswer}`;
            statusEl.className = 'answer-status confirmed';
            statusEl.textContent = 'Answer Confirmed - Ready to Reveal';
            confirmBtn.disabled = true;
            rejectBtn.disabled = false;
            document.getElementById('revealBtn').disabled = false;
        } else if (selection && selection.answer && selection.questionNum === state.currentQuestion) {
            // Contestant has selected an answer
            answerDisplay.textContent = `Contestant Selected: ${selection.answer}`;
            statusEl.className = 'answer-status selected';
            statusEl.textContent = 'Answer Selected - Awaiting Confirmation';
            confirmBtn.disabled = false;
            rejectBtn.disabled = false;
            document.getElementById('revealBtn').disabled = true;
        } else {
            // Waiting for contestant
            answerDisplay.textContent = 'No answer selected yet';
            statusEl.className = 'answer-status waiting';
            statusEl.textContent = 'Waiting for answer...';
            confirmBtn.disabled = true;
            rejectBtn.disabled = true;
            document.getElementById('revealBtn').disabled = true;
        }
        
        // Update prize information
        const currentPrize = PRIZES[state.currentQuestion] || 0;
        const guaranteedPrize = getGuaranteedPrize(state.currentQuestion);
        document.getElementById('currentPrize').textContent = `$${currentPrize.toLocaleString()}`;
        document.getElementById('guaranteedPrize').textContent = `Guaranteed: $${guaranteedPrize.toLocaleString()}`;
        
        // Update lifelines
        document.getElementById('lifeline5050').textContent = state.lifelinesUsed.fiftyFifty ? 'Used' : 'Available';
        document.getElementById('lifelinePhone').textContent = state.lifelinesUsed.phoneFriend ? 'Used' : 'Available';
        document.getElementById('lifelineAudience').textContent = state.lifelinesUsed.askAudience ? 'Used' : 'Available';
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

function confirmAnswer() {
    const state = getGameState();
    const selection = getContestantSelection();
    
    if (!selection || !selection.answer) {
        alert('No answer selected by contestant');
        return;
    }
    
    if (confirm(`Confirm ${selection.answer} as the final answer?`)) {
        state.confirmedAnswer = selection.answer;
        state.correctAnswer = state.questions[state.currentQuestion].correct;
        setGameState(state);
    }
}

function rejectAnswer() {
    const state = getGameState();
    
    if (state.confirmedAnswer) {
        // If already confirmed, clear confirmation
        state.confirmedAnswer = null;
        state.selectedAnswer = null;
        clearContestantSelection();
        setGameState(state);
        alert('Answer rejected. Contestant can select a new answer.');
    } else {
        // If not confirmed, just clear the selection
        state.selectedAnswer = null;
        clearContestantSelection();
        setGameState(state);
        alert('Selection cleared. Contestant can select again.');
    }
}

// Allow host to reveal answer manually
function revealAnswer() {
    const state = getGameState();
    
    if (!state.confirmedAnswer) {
        return;
    }
    
    if (state.answerRevealed) {
        // Already revealed, move to next question
        const question = state.questions[state.currentQuestion];
        const isCorrect = state.confirmedAnswer === question.correct;
        
        if (isCorrect) {
            nextQuestion();
        } else {
            resetGame();
        }
        return;
    }
    
    // Reveal the answer - modal will appear on contestant screen
    state.answerRevealed = true;
    setGameState(state);
    
    // Auto-advance after revealing (modals shown on contestant screen)
    setTimeout(() => {
        const question = state.questions[state.currentQuestion];
        const isCorrect = state.confirmedAnswer === question.correct;
        
        if (isCorrect) {
            if (state.currentQuestion === state.questions.length - 1) {
                // Game won - will be handled by contestant modal
                setTimeout(() => {
                    resetGame();
                }, 5000);
            } else {
                // Wait for contestant to see celebration, then auto-advance
                setTimeout(() => {
                    nextQuestion();
                }, 5000);
            }
        } else {
            // Game over - will be handled by contestant modal
            setTimeout(() => {
                resetGame();
            }, 5000);
        }
    }, 3000);
}

function nextQuestion() {
    const state = getGameState();
    if (state.currentQuestion < state.questions.length - 1) {
        state.currentQuestion++;
        state.answerRevealed = false;
        state.selectedAnswer = null;
        state.confirmedAnswer = null;
        state.correctAnswer = null;
        clearContestantSelection();
        setGameState(state);
    } else {
        alert('Congratulations! You won $1,000,000!');
        resetGame();
    }
}

function resetGame() {
    const state = getGameState();
    state.status = 'waiting';
    state.currentQuestion = 0;
    state.answerRevealed = false;
    state.selectedAnswer = null;
    state.confirmedAnswer = null;
    state.correctAnswer = null;
    clearContestantSelection();
    setGameState(state);
}


