# Who Wants to Be a Millionaire Game

A fully-featured, multi-device web-based "Who Wants to Be a Millionaire" game with admin, contestant, and host modules. Perfect for interactive game shows, events, or educational purposes.

![Who Wants to Be a Millionaire](https://img.shields.io/badge/Status-Ready-brightgreen) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow) ![HTML5](https://img.shields.io/badge/HTML5-Latest-orange) ![CSS3](https://img.shields.io/badge/CSS3-Modern-blue)

## 🎮 Features

### Core Game Features
- **15 Questions** with increasing difficulty (Easy → Medium → Hard)
- **Prize Ladder**: $100 to $1,000,000
- **Milestone Prizes**: Guaranteed $1,000 and $100,000 prizes
- **Three Lifelines**:
  - **50:50**: Removes two wrong answers
  - **Phone a Friend**: Get a hint (80% accuracy)
  - **Ask the Audience**: See audience vote percentages (80% accuracy)
- **Celebration Modals**: Animated celebration for correct answers
- **Game Over Screen**: Shows final winnings

### Multi-Device Architecture
- **Admin Panel**: Manage questions, control game flow
- **Contestant View**: Join on separate device to answer questions
- **Host Control**: Monitor and confirm answers in real-time
- **Real-time Sync**: Game state synchronized across all devices using localStorage

### Question Management
- **Fully Customizable**: Edit all 15 questions via admin panel
- **Easy Editor**: Intuitive question editor with answer validation
- **Visual Preview**: See all questions with correct answers marked

## 📁 Project Structure

```
├── index.html          # Original single-player game (optional)
├── admin.html          # Admin panel for game management
├── contestant.html     # Contestant view (for players)
├── host.html           # Host control panel
├── style.css           # Shared stylesheet
├── script.js           # Original single-player game logic
├── gameState.js        # Shared game state management
├── admin.js            # Admin panel logic
├── contestant.js       # Contestant view logic
└── host.js             # Host control logic
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- All devices should be on the same network (for localStorage sync)

### Installation

1. **Clone or download this repository**
   ```bash
   git clone <your-repo-url>
   cd millionaire-game
   ```

2. **Open the admin panel**
   - Simply open `admin.html` in your web browser
   - No server setup required! Works with `file://` protocol

3. **Set up your game**
   - Customize questions (optional) via the admin panel
   - Copy the Contestant and Host links provided in the admin panel
   - Share links with participants

### Running the Game

1. **Start as Admin**
   - Open `admin.html` in your browser
   - Review/customize questions if needed
   - Click "Start Game"

2. **Contestant Setup**
   - Open the Contestant link on a separate device
   - Contestant will see "Waiting for game to start..." until admin starts the game

3. **Host Setup**
   - Open the Host link on another device/screen
   - Host can monitor contestant's answers in real-time

4. **Gameplay Flow**
   - Contestant selects an answer on their device
   - Host sees the selection and can "Confirm Final Answer"
   - Host clicks "Reveal Answer" to show the correct answer
   - Celebration modal appears on contestant's screen (if correct)
   - Host proceeds to next question (or game over if incorrect)

## 🎯 How to Play

### For Admins
1. Open `admin.html`
2. Edit questions (optional) - click "Edit" on any question
3. Click "Start Game" to begin
4. Use "Next Question" to manually advance if needed
5. Use "Reset Game" to start over

### For Contestants
1. Open the Contestant link (provided by admin)
2. Wait for game to start
3. Read the question carefully
4. Select your answer (A, B, C, or D)
5. Your selection is sent to the host automatically
6. Wait for host to confirm and reveal the answer
7. See celebration modal if correct!

### For Hosts
1. Open the Host link (provided by admin)
2. Monitor the current question
3. Watch for contestant's answer selection
4. Click "Confirm Final Answer" when contestant is ready
5. Click "Reveal Answer" to show the correct answer
6. Use "Reject" to allow contestant to reselect if needed

## 💰 Prize Structure

### Easy Round (Questions 1-5)
- Question 1: $100
- Question 2: $200
- Question 3: $300
- Question 4: $500
- Question 5: **$1,000** (Milestone - Guaranteed!)

### Medium Round (Questions 6-10)
- Question 6: $5,000
- Question 7: $10,000
- Question 8: $20,000
- Question 9: $40,000
- Question 10: **$100,000** (Milestone - Guaranteed!)

### Hard Round (Questions 11-15)
- Question 11: $250,000
- Question 12: $500,000
- Question 13: $750,000
- Question 14: $900,000
- Question 15: **$1,000,000** (Grand Prize!)

## 🛠️ Customization

### Editing Questions

1. Open `admin.html`
2. Scroll to "Questions Management" section
3. Click "Edit" on any question
4. Modify:
   - Question text
   - All four answer options (A, B, C, D)
   - Mark correct answer by clicking the ✓ button
5. Click "Save Question"

### Adding New Questions

1. In admin panel, click "Add New Question"
2. Enter question number (1-15)
3. Fill in question text and all answers
4. Click ✓ on the correct answer
5. Click "Save Question"

### Styling

Edit `style.css` to customize:
- Colors (prize ladder, buttons, backgrounds)
- Fonts and sizes
- Animations and transitions
- Layout and spacing

## 🔧 Technical Details

### State Management
- Uses browser localStorage for state synchronization
- Polling interval: 500ms for real-time updates
- All devices must use the same browser/domain

### Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations
- **JavaScript (ES6+)**: Game logic and state management
- **localStorage API**: Cross-device state sync

## 📱 Multi-Device Setup

### Important Notes
- **Same Browser Required**: All devices must use the same browser type (all Chrome, all Firefox, etc.)
- **Same Network**: For best results, devices should be on the same network
- **localStorage Limitation**: The current implementation uses localStorage which is browser-specific. For true cross-device sync with different browsers, a backend server would be needed.

### Recommended Setup
1. **Admin Device**: Desktop/laptop with `admin.html`
2. **Contestant Device**: Tablet/phone with `contestant.html`
3. **Host Device**: Large screen/monitor with `host.html`

## 🐛 Troubleshooting

### Contestant can't see questions
- Make sure admin clicked "Start Game"
- Check that contestant is on the correct link
- Refresh the contestant page

### Answers not syncing
- Ensure all devices are using the same browser
- Check that localStorage is enabled in browser settings
- Try refreshing all pages

### Modals not appearing
- Check browser console for errors (F12)
- Ensure all CSS/JS files are loaded correctly
- Try clearing browser cache

### Host can't see contestant selection
- Verify contestant actually selected an answer
- Check that both are on the correct links
- Refresh host page

## 📝 Default Questions

The game comes with 15 pre-loaded questions covering:
- Math (basic to advanced)
- Science (biology, physics, chemistry)
- Geography
- History
- General knowledge

All questions can be fully customized via the admin panel.

## 🎨 Features Highlights

- ✅ Beautiful golden theme matching classic Millionaire aesthetic
- ✅ Smooth animations and transitions
- ✅ Responsive design for mobile and desktop
- ✅ Real-time answer synchronization
- ✅ Visual feedback for correct/incorrect answers
- ✅ Prize ladder visualization
- ✅ Lifeline tracking and usage
- ✅ Milestone prize guarantees
- ✅ Celebration animations

## 📄 License

This project is open source and available for educational and personal use.

## 🤝 Contributing

Feel free to fork this project and customize it for your needs! Suggestions and improvements are welcome.

## 📧 Support

If you encounter any issues or have questions:
1. Check the Troubleshooting section above
2. Review browser console for errors (F12 → Console)
3. Ensure all files are in the same directory

## 🎉 Credits

Inspired by the classic TV show "Who Wants to Be a Millionaire"

Built with ❤️ using HTML, CSS, and JavaScript

---

**Enjoy your game! May the odds be ever in your favor! 🎰💰**

