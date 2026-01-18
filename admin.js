let currentEditingIndex = null;
let currentCorrectAnswer = null;

// Initialize admin page
window.addEventListener('DOMContentLoaded', () => {
    updateLinks();
    loadQuestions();
    updateGameStatus();
    checkGameState();
    
    // Poll for game state changes
    setInterval(checkGameState, 500);
});

function updateLinks() {
    const baseUrl = window.location.origin + window.location.pathname.replace('admin.html', '');
    document.getElementById('contestantLink').value = baseUrl + 'contestant.html';
    document.getElementById('hostLink').value = baseUrl + 'host.html';
}

function copyLink(inputId) {
    const input = document.getElementById(inputId);
    input.select();
    document.execCommand('copy');
    alert('Link copied to clipboard!');
}

function checkGameState() {
    const state = getGameState();
    updateGameStatus();
}

function updateGameStatus() {
    const state = getGameState();
    const statusEl = document.getElementById('gameStatus');
    const statusText = state.status.charAt(0).toUpperCase() + state.status.slice(1);
    statusEl.textContent = `Game Status: ${statusText} | Question: ${state.currentQuestion + 1}/${state.questions.length}`;
}

function startGame() {
    const state = getGameState();
    state.status = 'active';
    state.currentQuestion = 0;
    state.answerRevealed = false;
    state.selectedAnswer = null;
    state.confirmedAnswer = null;
    state.correctAnswer = null;
    clearContestantSelection();
    setGameState(state);
    alert('Game started! Contestants and host can now see the first question.');
}

function resetGame() {
    if (confirm('Are you sure you want to reset the game? This will clear all progress.')) {
        const state = getGameState();
        state.status = 'waiting';
        state.currentQuestion = 0;
        state.answerRevealed = false;
        state.selectedAnswer = null;
        state.confirmedAnswer = null;
        state.correctAnswer = null;
        state.lifelinesUsed = {
            fiftyFifty: false,
            phoneFriend: false,
            askAudience: false
        };
        clearContestantSelection();
        setGameState(state);
        alert('Game reset!');
    }
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
        alert(`Moved to question ${state.currentQuestion + 1}`);
    } else {
        alert('This is the last question!');
    }
}

function loadQuestions() {
    const state = getGameState();
    const questionsList = document.getElementById('questionsList');
    questionsList.innerHTML = '';
    
    state.questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        questionDiv.innerHTML = `
            <h3>Question ${index + 1}</h3>
            <p style="margin: 10px 0;">${q.question}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                <div><strong>A:</strong> ${q.answers.A} ${q.correct === 'A' ? '✓' : ''}</div>
                <div><strong>B:</strong> ${q.answers.B} ${q.correct === 'B' ? '✓' : ''}</div>
                <div><strong>C:</strong> ${q.answers.C} ${q.correct === 'C' ? '✓' : ''}</div>
                <div><strong>D:</strong> ${q.answers.D} ${q.correct === 'D' ? '✓' : ''}</div>
            </div>
            <div class="question-actions">
                <button class="btn" onclick="editQuestion(${index})">Edit</button>
                <button class="btn btn-danger" onclick="deleteQuestion(${index})">Delete</button>
            </div>
        `;
        questionsList.appendChild(questionDiv);
    });
}

function showQuestionEditor() {
    document.getElementById('questionEditor').style.display = 'block';
    currentEditingIndex = null;
    currentCorrectAnswer = null;
    document.getElementById('editQuestionNum').value = '';
    document.getElementById('editQuestionText').value = '';
    document.getElementById('editAnswerA').value = '';
    document.getElementById('editAnswerB').value = '';
    document.getElementById('editAnswerC').value = '';
    document.getElementById('editAnswerD').value = '';
    document.getElementById('currentCorrectAnswer').textContent = 'None';
}

function editQuestion(index) {
    const state = getGameState();
    const q = state.questions[index];
    currentEditingIndex = index;
    currentCorrectAnswer = q.correct;
    
    document.getElementById('questionEditor').style.display = 'block';
    document.getElementById('editQuestionNum').value = index + 1;
    document.getElementById('editQuestionText').value = q.question;
    document.getElementById('editAnswerA').value = q.answers.A;
    document.getElementById('editAnswerB').value = q.answers.B;
    document.getElementById('editAnswerC').value = q.answers.C;
    document.getElementById('editAnswerD').value = q.answers.D;
    document.getElementById('currentCorrectAnswer').textContent = q.correct;
    
    document.getElementById('questionEditor').scrollIntoView({ behavior: 'smooth' });
}

function setCorrectAnswer(letter) {
    currentCorrectAnswer = letter;
    document.getElementById('currentCorrectAnswer').textContent = letter;
}

function saveQuestion() {
    const state = getGameState();
    const questionNum = parseInt(document.getElementById('editQuestionNum').value);
    
    if (!questionNum || questionNum < 1 || questionNum > 15) {
        alert('Please enter a valid question number (1-15)');
        return;
    }
    
    if (!currentCorrectAnswer) {
        alert('Please select the correct answer by clicking the ✓ button');
        return;
    }
    
    const questionData = {
        question: document.getElementById('editQuestionText').value.trim(),
        answers: {
            A: document.getElementById('editAnswerA').value.trim(),
            B: document.getElementById('editAnswerB').value.trim(),
            C: document.getElementById('editAnswerC').value.trim(),
            D: document.getElementById('editAnswerD').value.trim()
        },
        correct: currentCorrectAnswer
    };
    
    if (!questionData.question || !questionData.answers.A || !questionData.answers.B || 
        !questionData.answers.C || !questionData.answers.D) {
        alert('Please fill in all fields');
        return;
    }
    
    const index = questionNum - 1;
    state.questions[index] = questionData;
    setGameState(state);
    
    loadQuestions();
    cancelEdit();
    alert('Question saved!');
}

function deleteQuestion(index) {
    if (confirm('Are you sure you want to delete this question?')) {
        const state = getGameState();
        state.questions[index] = {
            question: '',
            answers: { A: '', B: '', C: '', D: '' },
            correct: 'A'
        };
        setGameState(state);
        loadQuestions();
    }
}

function cancelEdit() {
    document.getElementById('questionEditor').style.display = 'none';
    currentEditingIndex = null;
    currentCorrectAnswer = null;
}

