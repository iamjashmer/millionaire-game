// Shared Game State Management using localStorage
const GAME_STATE_KEY = 'millionaire_game_state';
const CONTESTANT_SELECTION_KEY = 'millionaire_contestant_selection';

// Default prizes
const PRIZES = [
    100, 200, 300, 500, 1000,          // Easy Round
    5000, 10000, 20000, 40000, 100000, // Medium Round
    250000, 500000, 750000, 900000, 1000000 // Hard Round
];

const MILESTONES = [1000, 100000];

// Default questions (can be customized)
const DEFAULT_QUESTIONS = [
    { question: "What is the value of 6 × 8?", answers: { A: "36", B: "42", C: "48", D: "56" }, correct: "C" },
    { question: "Which planet is known as the Red Planet?", answers: { A: "Venus", B: "Mars", C: "Jupiter", D: "Mercury" }, correct: "B" },
    { question: "What is ½ + ½?", answers: { A: "½", B: "1", C: "2", D: "0" }, correct: "B" },
    { question: "Who was the first President of the United States?", answers: { A: "Abraham Lincoln", B: "George Washington", C: "Thomas Jefferson", D: "John Adams" }, correct: "B" },
    { question: "Which gas do plants absorb during photosynthesis?", answers: { A: "Oxygen", B: "Nitrogen", C: "Carbon Dioxide", D: "Hydrogen" }, correct: "C" },
    { question: "What is the prime factorization of 12?", answers: { A: "2 × 6", B: "3 × 4", C: "2 × 2 × 3", D: "12 × 1" }, correct: "C" },
    { question: "Which part of the cell controls the cell's activities?", answers: { A: "Cell membrane", B: "Nucleus", C: "Cytoplasm", D: "Mitochondria" }, correct: "B" },
    { question: "If a triangle has angles 60°, 60°, and 60°, what type of triangle is it?", answers: { A: "Right", B: "Isosceles", C: "Equilateral", D: "Scalene" }, correct: "C" },
    { question: "The Earth rotates on its axis once every —", answers: { A: "12 hours", B: "24 hours", C: "30 days", D: "365 days" }, correct: "B" },
    { question: "The ancient pyramids of Giza are found in —", answers: { A: "Greece", B: "Mexico", C: "Egypt", D: "China" }, correct: "C" },
    { question: "What is the value of 3⁴?", answers: { A: "9", B: "27", C: "81", D: "64" }, correct: "C" },
    { question: "Which scientist proposed the three laws of motion?", answers: { A: "Galileo Galilei", B: "Albert Einstein", C: "Isaac Newton", D: "Nikola Tesla" }, correct: "C" },
    { question: "A number divisible by both 2 and 3 is divisible by —", answers: { A: "4", B: "5", C: "6", D: "9" }, correct: "C" },
    { question: "What instrument is used to measure atmospheric pressure?", answers: { A: "Thermometer", B: "Barometer", C: "Anemometer", D: "Hygrometer" }, correct: "B" },
    { question: "The Renaissance began in which country?", answers: { A: "France", B: "England", C: "Italy", D: "Spain" }, correct: "C" }
];

// Game State Structure
function getGameState() {
    const state = localStorage.getItem(GAME_STATE_KEY);
    if (state) {
        return JSON.parse(state);
    }
    return {
        status: 'waiting', // waiting, active, paused, finished
        currentQuestion: 0,
        questions: DEFAULT_QUESTIONS,
        lifelinesUsed: {
            fiftyFifty: false,
            phoneFriend: false,
            askAudience: false
        },
        answerRevealed: false,
        correctAnswer: null,
        selectedAnswer: null,
        confirmedAnswer: null,
        lastUpdated: Date.now()
    };
}

function setGameState(state) {
    state.lastUpdated = Date.now();
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
}

function getContestantSelection() {
    const selection = localStorage.getItem(CONTESTANT_SELECTION_KEY);
    return selection ? JSON.parse(selection) : null;
}

function setContestantSelection(selection) {
    localStorage.setItem(CONTESTANT_SELECTION_KEY, JSON.stringify({
        ...selection,
        timestamp: Date.now()
    }));
}

function clearContestantSelection() {
    localStorage.removeItem(CONTESTANT_SELECTION_KEY);
}

// Initialize game state with default questions if not exists
function initializeGameState() {
    const state = getGameState();
    if (!state.questions || state.questions.length === 0) {
        state.questions = DEFAULT_QUESTIONS;
        setGameState(state);
    }
}

// Initialize on load
initializeGameState();

