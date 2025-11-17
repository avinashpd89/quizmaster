import { useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

export default function Result() {
  const location = useLocation();

  const {
    score,
    quizStartTime,
    endTime,
    timeTaken,
    questionCount,
    correctAnswers,
    backendResult, // <-- backend validated answers array
    questions,     // <-- question text + options
  } = location.state || {};

  const formattedStartTime = quizStartTime
    ? new Date(quizStartTime).toLocaleTimeString()
    : "N/A";

  const formattedEndTime = endTime
    ? new Date(endTime).toLocaleTimeString()
    : "N/A";

  const formattedTimeTaken = timeTaken
    ? `${Math.floor(timeTaken / 60)} min ${Math.round(timeTaken % 60)} sec`
    : "N/A";

  const optionMap = ["a", "b", "c", "d"];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 px-4 py-10">
        <div className="w-full max-w-3xl mt-10 mx-auto bg-white shadow-xl rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-indigo-600">
            Quiz Result
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Here is a summary of your performance
          </p>

          {/* Summary Cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 bg-indigo-50 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold text-gray-700">Score</h2>
              <p className="text-3xl font-bold text-indigo-600 mt-1">{score}</p>
            </div>

            <div className="p-5 bg-green-50 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold text-gray-700">
                Correct Answers
              </h2>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {correctAnswers} / {questionCount}
              </p>
            </div>

            <div className="p-5 bg-yellow-50 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold text-gray-700">
                Start Time
              </h2>
              <p className="text-xl font-medium text-yellow-600 mt-1">
                {formattedStartTime}
              </p>
            </div>

            <div className="p-5 bg-red-50 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold text-gray-700">End Time</h2>
              <p className="text-xl font-medium text-red-600 mt-1">
                {formattedEndTime}
              </p>
            </div>

            <div className="p-5 bg-blue-50 rounded-xl shadow-sm sm:col-span-2">
              <h2 className="text-lg font-semibold text-gray-700">
                Time Taken
              </h2>
              <p className="text-xl font-medium text-blue-600 mt-1">
                {formattedTimeTaken}
              </p>
            </div>
          </div>

          {/* DETAILED REVIEW */}
          <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-800">
            Detailed Answer Review
          </h2>

          <div className="space-y-6">
            {backendResult?.map((item, index) => {
              const q = questions[index];

              const userAnswer = item.userAnswer;   // "a" | "b" | "c" | "d"
              const correctAnswer = item.correct;   // "a" | "b" | "c" | "d"

              const userIndex = optionMap.indexOf(userAnswer);
              const correctIndex = optionMap.indexOf(correctAnswer);

              return (
                <div key={index} className="p-5 bg-gray-50 rounded-xl shadow">
                  {/* Question */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {index + 1}. {q.question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-2">
                    {q.options.map((option, idx) => {
                      const isCorrect = idx === correctIndex;
                      const isUserSelected = idx === userIndex;

                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border flex items-center gap-3
                            ${
                              isCorrect
                                ? "bg-green-100 border-green-500 text-green-700 font-semibold"
                                : ""
                            }
                            ${
                              isUserSelected && !isCorrect
                                ? "bg-red-100 border-red-500 text-red-700 font-semibold"
                                : ""
                            }
                            ${
                              !isCorrect && !isUserSelected
                                ? "bg-white border-gray-300 text-gray-700"
                                : ""
                            }
                          `}
                        >
                          <span className="font-bold">
                            {optionMap[idx].toUpperCase()}.
                          </span>{" "}
                          {option}
                        </div>
                      );
                    })}
                  </div>

                  {/* Show Correct Answer if wrong */}
                  {userAnswer !== correctAnswer && (
                    <p className="mt-3 text-md">
                      <span className="font-semibold">Correct Answer: </span>
                      <span className="text-green-600 font-bold">
                        {correctAnswer.toUpperCase()}.{" "}
                        {q.options[correctIndex]}
                      </span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Back Button */}
          <div className="mt-8 flex justify-center">
            <a
              href="/"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md text-lg font-semibold"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
