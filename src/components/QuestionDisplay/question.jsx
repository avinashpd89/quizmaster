import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Timer from "../Timer/timer.jsx";

const Question = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [endTime, setEndTime] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const quizStartTime = location.state?.quizStartTime || new Date();
  const pointsPerCorrectAnswer = location.state?.pointsPerCorrectAnswer || 2;
  const pointsPerWrongAnswer = location.state?.pointsPerWrongAnswer || -1;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("/api/questions")
        setQuestions(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleSubmitQuiz = () => {
    const endQuizTime = new Date();
    setEndTime(endQuizTime);

    const timeTaken = (endQuizTime - quizStartTime) / 1000;

    const correctAnswers = questions.filter(
      (q, index) => selectedOptions[index] === q.answer
    ).length;

    const wrongAnswers = questions.length - correctAnswers;
    const totalScore =
      correctAnswers * pointsPerCorrectAnswer +
      wrongAnswers * pointsPerWrongAnswer;

    navigate("/result", {
      state: {
        score: totalScore,
        quizStartTime,
        endTime: endQuizTime,
        timeTaken,
        questionCount: questions.length,
        correctAnswers,
        wrongAnswers,
      },
    });
  };

  const handleOptionChange = (event) => {
    setSelectedOptions({
      ...selectedOptions,
      [currentQuestionIndex]: event.target.value,
    });
  };

  if (loading) return <div className="text-center mt-10 text-lg">Loading questions...</div>;
  if (!questions.length) return <div>No questions available.</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const selectedOption = selectedOptions[currentQuestionIndex] || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-white/20">
        
        {/* Timer */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-white">Quiz Questions</h1>
          <div className="bg-white/20 px-4 py-2 rounded-xl text-white font-semibold">
            <Timer onComplete={handleSubmitQuiz} />
          </div>
        </div>

        {/* Question */}
        <div className="text-white mb-4">
          <h2 className="text-lg font-medium">
            {currentQuestionIndex + 1}. {currentQuestion.question}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition 
                ${
                  selectedOption === option
                    ? "bg-blue-600 text-white border-blue-400"
                    : "bg-white/10 text-gray-200 border-white/20 hover:bg-white/20"
                }`}
            >
              <input
                type="radio"
                name={`option-${currentQuestionIndex}`}
                value={option}
                checked={selectedOption === option}
                onChange={handleOptionChange}
                className="h-5 w-5 accent-blue-500"
              />
              {option}
            </label>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            disabled={currentQuestionIndex === 0}
            className="px-5 py-2 rounded-xl bg-gray-700 text-white disabled:opacity-40 hover:bg-gray-600"
          >
            Previous
          </button>

          <button
            onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
            disabled={currentQuestionIndex === questions.length - 1}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-500"
          >
            Next
          </button>
        </div>

        {/* Submit Button */}
        <button
          className="w-full mt-6 bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-xl shadow-lg"
          onClick={handleSubmitQuiz}
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default Question;
