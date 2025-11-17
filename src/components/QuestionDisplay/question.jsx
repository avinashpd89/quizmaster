import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Timer from "../Timer/timer.jsx";
import axios from "axios";

const Question = (quizQuestion) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submittedAnswers, setSubmittedAnswer] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // GET FROM PREVIOUS PAGE
  const quizStartTime = location.state?.quizStartTime || new Date();
  const { quizId, userId } = quizQuestion;

  const pointsPerCorrectAnswer = location.state?.pointsPerCorrectAnswer || 2;
  const pointsPerWrongAnswer = location.state?.pointsPerWrongAnswer || -1;

  const optionMap = ["a", "b", "c", "d"];

  useEffect(() => {
    setQuestions(quizQuestion?.quizQuestion || []);

    const initial = {};
    (quizQuestion?.quizQuestion || []).forEach((_, i) => {
      initial[i + 1] = "";
    });
    setSubmittedAnswer(initial);

    setLoading(false);
  }, [quizQuestion]);

  // Save selected option
  const handleOptionChange = (optionIndex) => {
    setSubmittedAnswer({
      ...submittedAnswers,
      [currentQuestionIndex + 1]: optionMap[optionIndex],
    });
  };

  // MAIN SUBMISSION FUNCTION
  const handleSubmitQuiz = async () => {
    const endTime = new Date();
    const timeTaken = (endTime - quizStartTime) / 1000;

    try {
      const response = await axios.post("/api/v1/validate_question", {
        userId,
        quizId,
        submittedAnswers,
      });

      const backendResult = response.data.data;
      // Array of: {questionNumber, isCorrect, userAnswer, correct}

      let correct = 0;
      let wrong = 0;

      backendResult.forEach((item) => {
        if (item.isCorrect) correct++;
        else wrong++;
      });

      const totalScore =
        correct * pointsPerCorrectAnswer + wrong * pointsPerWrongAnswer;

      // Pass backend result to Result.jsx
      navigate("/result", {
        state: {
          score: totalScore,
          quizStartTime,
          endTime,
          timeTaken,
          questionCount: backendResult.length,
          correctAnswers: correct,
          wrongAnswers: wrong,
          backendResult, 
          questions, 
        },
      });
    } catch (err) {
      console.error("Error submitting quiz:", err);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-lg">Loading questions...</div>
    );

  if (!questions.length) return <div>No questions available.</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const selectedOption = submittedAnswers[currentQuestionIndex + 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-white/20">
        {/* Header */}
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
          {currentQuestion.options.map((option, idx) => (
            <label
              key={idx}
              className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition 
                ${
                  selectedOption === optionMap[idx]
                    ? "bg-blue-600 text-white border-blue-400"
                    : "bg-white/10 text-gray-200 border-white/20 hover:bg-white/20"
                }`}>
              <input
                type="radio"
                name={`option-${currentQuestionIndex}`}
                checked={selectedOption === optionMap[idx]}
                onChange={() => handleOptionChange(idx)}
                className="h-5 w-5 accent-blue-500"
              />
              {`${optionMap[idx]}. ${option}`}
            </label>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            disabled={currentQuestionIndex === 0}
            className="px-5 py-2 rounded-xl bg-gray-700 text-white disabled:opacity-40 hover:bg-gray-600">
            Previous
          </button>

          <button
            onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
            disabled={currentQuestionIndex === questions.length - 1}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-500">
            Next
          </button>
        </div>

        {/* Submit */}
        <div className="flex justify-center">
          <button
            className="mt-6 bg-green-600 hover:bg-green-500 text-white font-medium py-3 px-6 rounded-xl shadow-lg"
            onClick={handleSubmitQuiz}>
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Question;
