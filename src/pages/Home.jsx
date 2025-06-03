import { useState, useEffect, useCallback } from 'react';
import right from '../assets/right.png';
import incorrect from '../assets/incorrect.png';
import Sky from '../assets/sky.png';
import Bg from '../assets/back.png';
import Question from '../assets/Q.bar1.png';
import Cong from '../assets/Cong.png';
import Start from '../assets/Button.png';

const questionsPool = [
  {
    question: "When is World Environment Day celebrated?Which organization leads World Environment Day globally?",
    options: ["June 2nd every year", "June 4th every year", "June 6th every year", "June 5th every year"],
    correctAnswer: 3
  },
  {
    question: "When is World Environment Day celebrated? Which organization leads World Environment Day globally?",
    options: ["United Nations Environment Programme (UNEP)", "World Health Organization (WHO)", "UNESCO", "World Bank"],
    correctAnswer: 0
  },
  {
    question: "When is World Environment Day celebrated?Which organization leads World Environment Day globally?",
    options: ["1971", "1976", "1979", "1974"],
    correctAnswer: 3
  },
  {
    question: "When is World Environment Day celebrated?Which organization leads World Environment Day globally?",
    options: ["Sweden", "India", "Canada", "USA"],
    correctAnswer: 0
  },
  {
    question: "When is World Environment Day celebrated?Which organization leads World Environment Day globally?",
    options: ["UNESCO", "UNDP", "United Nations Environment Programme (UNEP)", "UNHCR"],
    correctAnswer: 2
  },
  {
    question: "What was the theme for World Environment Day 2024? Which organization leads World Environment Day globally?",
    options: ["Solutions to air pollution", "Solutions to soil pollution", "Solutions to water pollution", "Solutions to plastic pollution"],
    correctAnswer: 3
  },
  {
    question: "What country hosted World Environment Day 2024? Which organization leads World Environment Day globally?",
    options: ["India", "Kenya", "Côte d'Ivoire", "France"],
    correctAnswer: 2
  },
  {
    question: "What is the theme for World Environment Day 2025? Which organization leads World Environment Day globally? ",
    options: ["Restore Our Earth", "Beat Plastic Pollution", "Only One Earth", "Time for Nature"],
    correctAnswer: 1
  },
  {
    question: "What was the theme of World Environment Day in 2010? Which organization leads World Environment Day globally?",
    options: ["Biodiversity Matters", "Our Planet, Our Responsibility", "Many Species. One Planet. One Future.", "Green Cities"],
    correctAnswer: 2
  },
  {
    question: "Which country hosted World Environment Day in 2012? Which organization leads World Environment Day globally?",
    options: ["Brazil", "Mexico", "South Africa", "China"],
    correctAnswer: 0
  }
];


export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [showingCorrectAnswer, setShowingCorrectAnswer] = useState(false);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [showResult, setShowResult] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [started, setStarted] = useState(false);
  // Select 10 random questions when game starts
  const startGame = useCallback(() => {
    const shuffled = [...questionsPool].sort(() => 0.5 - Math.random());
    setQuizQuestions(shuffled.slice(0, 10));
    setGameStarted(true);
    setStartTime(new Date());
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setTimeLeft(10);
  }, []);

  useEffect(() => {
    const preventDefault = (e) => e.touches.length > 1 && e.preventDefault();
    const disableZoom = () => {
      document.addEventListener('touchmove', preventDefault, { passive: false });
      const meta = document.querySelector('meta[name="viewport"]');
      if (meta) meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      return () => document.removeEventListener('touchmove', preventDefault);
    };
    disableZoom();

    const preventZoom = (e) => (e.ctrlKey || e.metaKey) && e.preventDefault();
    const preventGesture = (e) => e.preventDefault();
    window.addEventListener('wheel', preventZoom, { passive: false });
    window.addEventListener('gesturestart', preventGesture);
    window.addEventListener('gesturechange', preventGesture);
    window.addEventListener('gestureend', preventGesture);

    const handleContextMenu = (e) => e.preventDefault();
    const handleSelectStart = (e) => e.detail > 1 && e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('mousedown', handleSelectStart);

    return () => {
      window.removeEventListener('wheel', preventZoom);
      window.removeEventListener('gesturestart', preventGesture);
      window.removeEventListener('gesturechange', preventGesture);
      window.removeEventListener('gestureend', preventGesture);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('mousedown', handleSelectStart);
    };
  }, []);

  useEffect(() => {
    if (started) {
      resetInactivityTimer();
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      events.forEach(event => window.addEventListener(event, resetInactivityTimer));

      const handleKeyDown = (e) => {
        if (e.ctrlKey && e.key === 'e') {
          e.preventDefault();
          downloadVotes();
        }
        if (e.ctrlKey && e.key === 'r') {
          e.preventDefault();
          resetVotes();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(inactivityTimer.current);
        events.forEach(event => window.removeEventListener(event, resetInactivityTimer));
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [started]);
  useEffect(() => {
    const requestFullscreen = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      }
    };

    // Attempt fullscreen on user interaction (most browsers require this)
    const handleFirstInteraction = () => {
      requestFullscreen();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    // Also try on load (may not work without user interaction)
    requestFullscreen();

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);
useEffect(() => {
  if (gameStarted && !showResult) {
    setTimeLeft(10);
    setQuestionStartTime(new Date());
  }
}, [currentQuestionIndex, gameStarted, showResult]);
 useEffect(() => {
  if (!gameStarted || currentQuestionIndex >= quizQuestions.length || showResult) return;

  const timer = setTimeout(() => {
    if (timeLeft > 0 && !showingCorrectAnswer) {
      setTimeLeft(timeLeft - 1);
    } else if (timeLeft === 0 && !showingCorrectAnswer) {
      // Time's up, show correct answer
      handleNextQuestion();
    }
  }, 2000);

  return () => clearTimeout(timer);
}, [timeLeft, gameStarted, currentQuestionIndex, quizQuestions.length, showResult, showingCorrectAnswer]);

  // Reset timer when question changes
  useEffect(() => {
    if (gameStarted && !showResult) {
      setTimeLeft(10);
    }
  }, [currentQuestionIndex, gameStarted, showResult]);

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };

const handleNextQuestion = () => {
  const correctIndex = quizQuestions[currentQuestionIndex]?.correctAnswer;
  setCorrectAnswerIndex(correctIndex);
  setShowingCorrectAnswer(true);

  // Show wrong answer immediately if selected
  if (selectedAnswer !== null && selectedAnswer !== correctIndex) {
    // The styling will handle the red color through the styles.wrongOption
  }
  

  setTimeout(() => {
    setShowingCorrectAnswer(false);
    setCorrectAnswerIndex(null);

    const answeredCorrectly = selectedAnswer === correctIndex;
    if (answeredCorrectly) {
      let points = 100;
      if (questionStartTime) {
        const timeTaken = Math.floor((new Date() - questionStartTime) / 1000);
        const timeLeftForBonus = Math.max(0, 10 - timeTaken);
        const timeBonus = Math.floor((timeLeftForBonus / 10) * 50);
        points += timeBonus;
      }
      setScore(prevScore => prevScore + points);
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setEndTime(new Date());
      setShowResult(true);
    }
  }, 3000);
};

  const calculateTimeTaken = () => {
    if (!startTime || !endTime) return "0 seconds";
    const seconds = Math.floor((endTime - startTime) / 1000);
    return `${seconds} seconds`;
  };

  const resetGame = () => {
    setGameStarted(false);
    setShowResult(false);
    setSelectedAnswer(null);
  };

if (!gameStarted) {
  return (
    <div style={styles.container}>
      <img 
        src={Bg} 
        alt="Start Quiz" 
        style={styles.startImage}
        loading="lazy" 
      />
      {/* <p style={styles.clickToStart} onClick={startGame}>Let's Play</p> */}
      <img style={styles.clickToStart}   onClick={startGame} src={Start} loading="lazy" />
    </div>
  );
}

  if (showResult) {
    return (
      <div style={styles.container}>
        <div style={styles.resultPopup}>
          <img src={Cong} style={{marginTop:'20px'}} loading="lazy" />
          <p style={styles.resultText}>Your score: {score} out of {quizQuestions.length * 150}</p>
          <p style={styles.resultText}>Time taken: {calculateTimeTaken()}</p>
          <button 
            style={styles.submitButton}
            onClick={resetGame}
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  if (quizQuestions.length === 0) {
    return (
      <div style={styles.container}>
        <p>Loading questions...</p>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <div style={styles.container}>
      <div style={styles.quizContainer}>
        <div style={styles.header}>
          <div style={styles.questionCounter}>
            Question {currentQuestionIndex + 1}/{quizQuestions.length}
          </div>
          <div style={styles.score}>
            Score: {score}
          </div>
          <div style={styles.timer}>
            Time left: {timeLeft}s
          </div>
        </div>

        <h2 style={styles.question}>
        <span style={styles.questionText}>{currentQuestion.question}</span>
      </h2>

  <div style={styles.optionsContainer}>
  {currentQuestion.options.map((option, index) => (
    <div 
      key={index}
      style={{
        ...styles.option,
        ...(selectedAnswer === index ? styles.selectedOption : {}),
        ...((showingCorrectAnswer || timeLeft === 0) && 
            index === currentQuestion.correctAnswer ? styles.correctOption : {}),
        ...((showingCorrectAnswer || timeLeft === 0) && 
            selectedAnswer === index && 
            selectedAnswer !== currentQuestion.correctAnswer ? styles.wrongOption : {})
      }}
      onClick={() => !showingCorrectAnswer && timeLeft > 0 && handleAnswerSelect(index)}
    >
      {option}
      {(showingCorrectAnswer || timeLeft === 0) && 
       index === currentQuestion.correctAnswer && (
        // <span style={{ marginLeft: '10px' }}>✅</span>
        <img src={right} style={{ marginLeft: '10px',width:'35px',height:'35px',verticalAlign:'middle' }}/>
      )}
      {(showingCorrectAnswer || timeLeft === 0) && 
       selectedAnswer === index && 
       selectedAnswer !== currentQuestion.correctAnswer && (
        <img src={incorrect} style={{ marginLeft: '10px',width:'35px',height:'35px',verticalAlign:'middle' }}/>
      )}
    </div>
  ))}
</div>
<button
  style={{
    ...styles.nextButton,
    ...(selectedAnswer === null && !showingCorrectAnswer ? styles.disabledButton : {}),
    ...(showingCorrectAnswer ? { visibility: 'hidden' } : {})
  }}
  onClick={handleNextQuestion}
  disabled={selectedAnswer === null || showingCorrectAnswer}
>
  {currentQuestionIndex < quizQuestions.length - 1 ? 'Next' : 'Submit'}
</button>

      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: 0, // Remove padding to allow full screen image
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: 'relative', // Added for positioning the button
    overflow: 'hidden', // Prevent scrolling
  },
    wrongOption: {
    backgroundColor: '#FF2D55',
    color: 'white',
    borderColor: '#FF2D55',
    boxShadow: '0 4px 8px rgba(255, 45, 85, 0.3)',
  },
  startImage: {
  width: '100vw',
  height: '100vh',
  zIndex: 1,
  cursor: 'pointer',
},
  clickToStart: {
    position: 'absolute',
    bottom: '20%',
    right: '20%',
    // background: 'linear-gradient(to right, #85cb27, #325511)',
    cursor: 'pointer',
    minWidth:'100px',
    maxWidth:'200px',
    textAlign:'center',
    fontSize: '1.2rem',
    fontWeight: '600',
    zIndex: 2,
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#43a047',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.25)',
    },
    //  '@media (max-width: 1024px)': {
    //   fontSize: '3rem',
    //   marginRight:'30px',
    // },
    // '@media (max-width: 768px)': {
    //   fontSize: '2.5rem',
    //   marginRight:'30px',
    // },
    // '@media (max-width: 480px)': {
    //   fontSize: '2rem',
    //      marginRight:'30px',
    // }
  },
  quizContainer: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: '100%',
    backgroundImage: `url(${Sky})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    boxSizing: 'border-box',
    // '@media (max-width: 768px)': {
    //   padding: '30px',
    //   minHeight: '450px',
    // },
    // '@media (max-width: 480px)': {
    //   padding: '20px',
    //   minHeight: '400px',
    // },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    fontSize: '1.1rem',
    color: '#7f8c8d',
    paddingBottom: '15px',
    borderBottom: '1px solid #ecf0f1',
    // '@media (max-width: 480px)': {
    //   flexDirection: 'column',
    //   gap: '10px',
    //   alignItems: 'center',
    // },
  },
  question: {
  fontSize: '1.5rem',
  backgroundImage: `url(${Question})`,
  height: '200px',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  borderRadius: '5px',
  color: '#2c3e50',
  fontWeight: 'bold',
  padding: '4px', 
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  marginBottom: '10px',
  margin:' 0 auto',
  minWidth:'950px',
  maxWidth:'1200px',
  lineHeight: '1.4',
  overflow: 'hidden', 
  wordWrap: 'break-word',
  textShadow: '1px 1px 2px white', 
},questionText: {
  marginTop: '-40px', // only applies to text
  lineHeight: '1.4',
  minWidth:'790px',
  maxWidth:'820px',
  fontSize: 'inherit',
  color: 'inherit',
  textAlign: 'center',
},
  optionsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '40px',
    // '@media (max-width: 768px)': {
    //   gridTemplateColumns: '1fr',
    //   gap: '15px',
    // },
  },
  option: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '1.1rem',
    // '@media (max-width: 480px)': {
    //   padding: '15px',
    //   fontSize: '1rem',
    // },
    ':hover': {
      backgroundColor: '#e8f5e9',
      borderColor: '#c8e6c9',
      transform: 'translateY(-2px)',
    },
  },
  selectedOption: {
    backgroundColor: '#2DF044',
    color: 'white',
    borderColor: '#2DF044',
    boxShadow: '0 4px 8px rgba(76, 175, 80, 0.3)',
  },
  correctOption: {
    backgroundColor: '#2DF044',
    color: 'white',
    borderColor: '#2DF044',
    boxShadow: '0 4px 8px rgba(76, 175, 80, 0.3)',
  },
  nextButton: {
    padding: '15px 30px',
    backgroundColor: '#34C759',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    alignSelf: 'flex-end',
    // '@media (max-width: 480px)': {
    //   padding: '12px 25px',
    //   fontSize: '1rem',
    // },
    ':hover': {
      backgroundColor: '#43a047',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
    cursor: 'not-allowed',
    ':hover': {
      backgroundColor: '#bdc3c7',
      transform: 'none',
      boxShadow: 'none',
    },
  },
  resultPopup: {
     backgroundColor: 'white',
  backgroundImage: `url(${Sky})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  height: '100vh',
  width: '100vw',
  display: 'block',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  overflow: 'hidden',
    // '@media (max-width: 768px)': {
    //   padding: '40px',
    // },
    // '@media (max-width: 480px)': {
    //   padding: '30px 20px',
    // },
  },
  resultTitle: {
    color: '#2c3e50',
    marginBottom: '30px',
    fontSize: '2rem',
    fontWeight: '600',
    // '@media (max-width: 768px)': {
    //   fontSize: '1.8rem',
    // },
    // '@media (max-width: 480px)': {
    //   fontSize: '1.5rem',
    // },
  },
  resultText: {
    fontSize: '1.3rem',
    marginBottom: '25px',
    color: 'black',
    lineHeight: '1.6',
    // '@media (max-width: 480px)': {
    //   fontSize: '1.1rem',
    // },
  },
  submitButton: {
    padding: '15px 40px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '600',
    marginTop: '30px',
    transition: 'all 0.2s ease',
    // '@media (max-width: 480px)': {
    //   padding: '12px 30px',
    //   fontSize: '1rem',
    // },
    // ':hover': {
    //   backgroundColor: '#43a047',
    //   transform: 'translateY(-2px)',
    //   boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    // },
  },
  timer: {
    color: '#e74c3c',
    fontWeight: '600',
  },
  score: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  questionCounter: {
    fontWeight: '600',
  },
}; 