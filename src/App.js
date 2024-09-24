import React, { useState, useEffect } from "react";

const App = () => {
  const [sumSubRange, setSumSubRange] = useState({ min: 0, max: 10 });
  const [mulDivRange, setMulDivRange] = useState({ min: 1, max: 10 });

  const [number1, setNumber1] = useState(null);
  const [number2, setNumber2] = useState(null);
  const [operator, setOperator] = useState("+");
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLimit, setTimeLimit] = useState(30);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);

  const [operations, setOperations] = useState({
    sum: true,
    subtract: true,
    multiply: true,
    divide: true,
  });

  useEffect(() => {
    let timer;
    if (timeRemaining > 0 && showQuestion) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setShowQuestion(false);
    }
    return () => clearInterval(timer);
  }, [timeRemaining, showQuestion]);

  const generateRandomNumbers = () => {
    const availableOps = [];
    if (operations.sum) availableOps.push("+");
    if (operations.subtract) availableOps.push("-");
    if (operations.multiply) availableOps.push("*");
    if (operations.divide) availableOps.push("/");

    const op = availableOps[Math.floor(Math.random() * availableOps.length)];
    let num1, num2;

    if (op === "+" || op === "-") {
      num1 =
        Math.floor(Math.random() * (sumSubRange.max - sumSubRange.min + 1)) +
        sumSubRange.min;
      num2 =
        Math.floor(Math.random() * (sumSubRange.max - sumSubRange.min + 1)) +
        sumSubRange.min;
    } else {
      num2 =
        Math.floor(Math.random() * (mulDivRange.max - mulDivRange.min + 1)) +
        mulDivRange.min;
      if (op === "/") {
        num1 = num2 * Math.floor(Math.random() * (mulDivRange.max / num2) + 1);
      } else {
        num1 =
          Math.floor(Math.random() * (mulDivRange.max - mulDivRange.min + 1)) +
          mulDivRange.min;
      }
    }

    if (op !== "/" && num1 <= num2) {
      num1 += num2;
    }

    setNumber1(num1);
    setNumber2(num2);
    setOperator(op);
    setResult(calculateResult(num1, num2, op));
    setUserAnswer("");
    setIsCorrect(null);
  };

  const calculateResult = (num1, num2, op) => {
    switch (op) {
      case "+":
        return num1 + num2;
      case "-":
        return num1 - num2;
      case "*":
        return num1 * num2;
      case "/":
        return num1 / num2;
      default:
        return null;
    }
  };

  const checkAnswer = () => {
    if (parseFloat(userAnswer) === parseFloat(result)) {
      setScore(score + 1);
      setIsCorrect(true);
      generateRandomNumbers();
    } else {
      setIsCorrect(false);
    }
    setUserAnswer("");
  };

  const startGame = () => {
    setTimeRemaining(timeLimit);
    setShowQuestion(true);
    generateRandomNumbers();
    setScore(0);
  };

  const handleOperationChange = (e) => {
    const { name, checked } = e.target;
    setOperations((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const endGame = () => {
    setTimeRemaining(0);
    setShowQuestion(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-300 w-2/4 mx-auto ">
      <header className="bg-blue-600 p-4 text-white">
        <h1 className="text-2xl font-bold">Arithmetic Game</h1>
      </header>
      <main className="flex-grow p-4">
        <h2 className="text-xl mb-2">Solve the Arithmetic Problem</h2>

        <div className="mb-4">
          <label className="block mb-2" htmlFor="timeLimit">
            Set Time Limit (seconds):
          </label>
          <input
            type="number"
            id="timeLimit"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Math.max(1, parseInt(e.target.value) || 0))}
            className="border p-2"
            disabled={showQuestion}
          />
        </div>

        <div className="mb-4">
          <h3 className="text-lg mb-2">Select Operations:</h3>
          <label className="inline-flex items-center mr-4">
            <input
              type="checkbox"
              name="sum"
              checked={operations.sum}
              onChange={handleOperationChange}
              className="mr-2"
              disabled={showQuestion}
            />
            Sum
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="checkbox"
              name="subtract"
              checked={operations.subtract}
              onChange={handleOperationChange}
              className="mr-2"
              disabled={showQuestion}
            />
            Subtract
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="checkbox"
              name="multiply"
              checked={operations.multiply}
              onChange={handleOperationChange}
              className="mr-2"
              disabled={showQuestion}
            />
            Multiply
          </label>
          <label className="inline-flex items-center mr-4">
            <input
              type="checkbox"
              name="divide"
              checked={operations.divide}
              onChange={handleOperationChange}
              className="mr-2"
              disabled={showQuestion}
            />
            Divide
          </label>
        </div>

        <div className="mb-4">
          <h3 className="text-lg mb-2">Sum and Subtract Range:</h3>
          <div className="flex space-x-4">
            <div>
              <label className="block mb-1">Min:</label>
              <input
                type="number"
                value={sumSubRange.min}
                onChange={(e) =>
                  setSumSubRange((prev) => ({
                    ...prev,
                    min: parseInt(e.target.value),
                  }))
                }
                className="border p-2"
                disabled={showQuestion}
              />
            </div>
            <div>
              <label className="block mb-1">Max:</label>
              <input
                type="number"
                value={sumSubRange.max}
                onChange={(e) =>
                  setSumSubRange((prev) => ({
                    ...prev,
                    max: parseInt(e.target.value),
                  }))
                }
                className="border p-2"
                disabled={showQuestion}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg mb-2">Multiply and Divide Range:</h3>
          <div className="flex space-x-4">
            <div>
              <label className="block mb-1">Min:</label>
              <input
                type="number"
                value={mulDivRange.min}
                onChange={(e) =>
                  setMulDivRange((prev) => ({
                    ...prev,
                    min: parseInt(e.target.value),
                  }))
                }
                className="border p-2"
                disabled={showQuestion}
              />
            </div>
            <div>
              <label className="block mb-1">Max:</label>
              <input
                type="number"
                value={mulDivRange.max}
                onChange={(e) =>
                  setMulDivRange((prev) => ({
                    ...prev,
                    max: parseInt(e.target.value),
                  }))
                }
                className="border p-2"
                disabled={showQuestion}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg">Score: {score}</h3>
        </div>

        {showQuestion && number1 !== null && number2 !== null && (
          <div className="mb-4">
            <h3 className="text-lg">
              {number1} {operator} {number2} = ?
            </h3>
            <p className="text-sm">Time remaining: {timeRemaining} seconds</p>
          </div>
        )}

        {showQuestion && (
          <div className="flex flex-col mb-4">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  checkAnswer();
                }
              }}
              className="border p-2"
              placeholder="Your answer"
            />

          </div>
        )}

        {isCorrect === false && (
          <div className="text-red-500 mb-2">Incorrect! Try again.</div>
        )}

        {!showQuestion && timeRemaining === 0 && (
          <div className="mb-4">
            <h3 className="text-lg">Time's up!</h3>
          </div>
        )}

        {!showQuestion && (
          <button
            onClick={startGame}
            className="bg-gray-600 text-white p-2 rounded"
          >
            Start Game
          </button>
        )}

        {showQuestion && (
          <button
            onClick={endGame}
            className="bg-red-600 text-white p-2 rounded mt-2"
          >
            End Game
          </button>
        )}
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        &copy; 2024 Arithmetic Game
      </footer>
    </div>
  );
};

export default App;
