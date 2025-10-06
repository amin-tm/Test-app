import { useState, useEffect, useRef } from 'react'
import { Play, RotateCw, ClipboardCheck, Gauge, Timer, CircleX, Pause, ClipboardPen, ArrowBigUpDash, Brain, Plus, FlagTriangleRight, LoaderCircle, ArrowRight } from "lucide-react"

function App() {
  const [quote, setQuote] = useState("");
  const [userInput, setUserInput] = useState("");
  const [time, setTime] = useState(60);
  const [mistakes, setMistakes] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLvl2, setIsLvl2] = useState(false);
  const [isFetchedLvl, setIsFetchedLvl] = useState(false);
  const timerRef = useRef(null);

  const fetchQuote = async () => {

    const response = await fetch("https://dummyjson.com/quotes/random");
    const data = await response.json();

    if (data.quote.length > 100 && isLvl2) {
      setQuote("Loading...");
      setQuote(data.quote.toLowerCase());
      setUserInput("");
      setMistakes(0);
      setShowResult(false);
      setIsFetched(true);
      setIsFetchedLvl(true);
    } else if (data.quote.length < 40 && !isLvl2) {
      setQuote("Loading...");
      setQuote(data.quote.toLowerCase());
      setUserInput("");
      setMistakes(0);
      setShowResult(false);
      setIsFetched(true);
      setIsFetchedLvl(true);
    } else {
      fetchQuote()
    }

  };

  const startTest = () => {
    setMistakes(0);
    setTime(60);
    setUserInput("");
    setIsActive(true);
    setShowResult(false);
    setIsDisable(true);
  };

  const stopTest = () => {
    setIsActive(false);
    clearInterval(timerRef.current);
    setShowResult(true);
    setIsDisable(false);

  };

  const refreshQuote = () => {
    setIsFetched((prev) => !prev);
    fetchQuote();

  }

  const refreshQuoteLvl = () => {
    setIsFetchedLvl((prev) => !prev);
    fetchQuote();
    setIsDisable(false);
  }

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            stopTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  useEffect(() => {
    fetchQuote();
  }, []);

  const handleInputChange = (value) => {
    let newMistakes = mistakes;
    const quoteChars = quote.split("");

    value.split("").forEach((char, index) => {
      if (char !== quoteChars[index] && quoteChars[index] !== undefined) {
        newMistakes++;
      }
    });

    setMistakes(newMistakes);
    setUserInput(value);

    if (value === quote) {
      stopTest();
      setIsLvl2(true);
      setIsDisable(true);
    }
  };

  const timeTaken = time !== 0
    ? (60 - time) / 100
    : 1;
  const wpm = ((userInput.length / 5) / timeTaken).toFixed(2);
  const accuracy = userInput.length
    ? Math.round(((userInput.length - mistakes) / userInput.length) * 100)
    : 100;

  return (
    <>
      <div className='mx-auto max-w-sm sm:max-w-5xl md:-w-5xl lg:max-w-5xl xl:max-w-7xl'>
        <div className='mt-10 rounded-xl p-5 shadow-lg mx-auto max-w-xl glass'>
          <h1 className='text-4xl font-black'>TEST TYPE APP</h1>
        </div>

        <div className='grid grid-cols-1 w-full mx-auto xl:grid-cols-3 gap-5'>
          <div className='container col-span-2 mt-10 rounded-xl p-5 shadow-lg mx-auto w-full glass'>
            <div className='text-lg text-left'>
              <span className='text-sm font-light text-center mb-2 text-primary'>Type the text below to test your typing speed.</span>
              <div className="mb-4 text-lg no-copy" onMouseDown={(e) => e.preventDefault()} onCopy={(e) => e.preventDefault()}>
                {quote.split("").map((char, i) => {
                  let color = "";
                  if (i < userInput.length) {
                    color = char === userInput[i] ? "text-green-600" : "text-red-600";
                  }
                  return (
                    <span key={i} className={color}>
                      {char}
                    </span>
                  );
                })}
              </div>
            </div>

            <div>

              <textarea
                rows={13}
                className='border border-gray-300 w-full mt-5 p-3 text-sm focus:outline-none disabled:opacity-30'
                placeholder='Type Here When Test Start ...'
                disabled={!isActive}
                value={userInput}
                onChange={(e) => handleInputChange(e.target.value)}
              >
              </textarea>

              <span className='text-xs text-center mb-5 bg-primary rounded-full p-1 text-text-foreground'>Be careful about the number of mistakes you make.</span>

              <div className='flex items-center p-3 space-x-4 justify-center'>

                {!isActive && (
                  <button className='cosmic-button flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed tranition-all' onClick={startTest} disabled={isDisable}><Play className='h-5 w-5' />Start Test</button>
                )}
                {isActive && (
                  <button className='cosmic-button flex items-center justify-center gap-2' onClick={stopTest}><Pause className='h-5 w-5 tranition-all' />Stop Test</button>
                )}

                <button className='cosmic-button flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed' onClick={refreshQuote} disabled={isDisable || !isFetched}>
                  {!isFetched && (
                    <LoaderCircle className='h-5 w-5' style={!isFetched ? { display: "inline-block", animation: "spin 1s linear infinite" } : {}} />
                  )}
                  {isFetched && (
                    <RotateCw className='h-5 w-5' />
                  )}
                  Refresh Quote
                </button>

                <div onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} className='transition-all transition-colors relative inline-block'>
                  <button className='cosmic-button flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed' disabled={!isLvl2} onClick={refreshQuoteLvl}>
                    {!isFetchedLvl && (
                      <LoaderCircle className='h-5 w-5' style={!isFetchedLvl ? { display: "inline-block", animation: "spin 1s linear infinite" } : {}} />
                    )}
                    {isFetchedLvl && (
                      <ArrowRight className='h-5 w-5' />
                    )}
                    Going to the next stage
                  </button>

                  {showTooltip && (
                    <span className="absolute top-full mt-1 bg-black/30 text-white text-xs right-0/5 px-2 py-1 rounded-lg text-center" style={{ animation: "fade-in 0.5s linear" }}>
                      Complete this step within the allotted time to move on to the next step.
                    </span>
                  )}

                </div>

              </div>

              {isActive && (
                <div className='flex items-center justify-center mt-1'>
                  <div className='space-y-8'>
                    <div className='flex p-3 items-center space-x-4'>
                      <div className='text-xs rounded-lg bg-primary text-primary-foreground p-3 flex items-center justify-center gap-1'>
                        <Timer className='h-4 w-4' />
                        Time: <span>{time}s</span>
                      </div>
                      <div className='text-xs rounded-lg bg-mistakes text-primary-foreground p-3 flex items-center justify-center gap-1'>
                        <CircleX className='h-4 w-4' />
                        Mistakes: <span>{mistakes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          <div className='container mx-auto w-full col-span-1 mt-10 rounded-xl shadow-lg p-5 bg-white/30 backdrop-blur-3xl glass'>

            <h3 className='text-2xl font-bold'>What does this project do?</h3>

            <p className='text-md font-light text-justify mt-5 transition-transform duration-300'>This project is a one-minute typing test application. A random text is fetched online through an API and displayed to the user. The user’s task is to type the exact same text into the input box within the given time limit. While typing, every mistake is tracked in real time and the error count is displayed to the user. At the end of the test, the final results show both the accuracy and the total errors made.</p>

            <h3 className='text-md font-bold mt-2 text-left'>Features that can be improved in the <span className='text-primary'>Future</span>:</h3>

            <div className='flex items-center justify-left mt-5 gap-2'>
              <ClipboardPen className='h-4 w-4 hover:text-primary transition-colors' />
              <p className='text-sm font-light items-center justify-center text-justify'>Adding Persian language & typing test in <span className='font-bold text-primary'>Persian</span>!</p>
            </div>
            <div className='flex items-center justify-left mt-5 gap-2'>
              <ArrowBigUpDash className='h-4 w-4 hover:text-primary transition-colors' />
              <p className='text-sm font-light items-center justify-center text-justify'>Making the app bigger with new <span className='font-bold text-primary'>features</span></p>
            </div>
            <div className='flex items-center justify-left mt-5 gap-2'>
              <FlagTriangleRight className='h-4 w-4 hover:text-primary transition-colors' />
              <p className='text-sm font-light items-center justify-center text-justify'><span className='font-bold text-primary'>Levels</span> feature coming soon...</p>
            </div>
            <div className='flex items-center justify-left mt-5 gap-2'>
              <Brain className='h-4 w-4 hover:text-primary transition-colors' />
              <p className='text-sm font-light items-center justify-center text-justify'>What do <span className='font-bold text-primary'>YOU</span> think?</p>
            </div>
            <div className='flex items-center justify-left mt-5 gap-2'>
              <Plus className='h-4 w-4 hover:text-primary transition-colors' />
              <p className='text-sm font-light items-center justify-center text-justify'>...</p>
            </div>

          </div>

        </div>

        {showResult && (
          <div className='container col-span-2 mx-auto max-w-sm rounded-lg shadow-lg p-8 glass mt-8 transition-all'>
            <div className=' items-center justify-center'>
              <h1 className='text-lg font-bold'>Result</h1>
              <div className='flex items-center justify-center gap-3 mt-5'>
                <ClipboardCheck className='h-5 w-5' />
                <p>Accuracy: {accuracy}</p>
              </div>
              <div className='flex items-center justify-center gap-3 mt-5'>
                <Gauge className='h-5 w-5' />
                <p>Speed: {wpm}</p>
              </div>
            </div>
          </div>

        )}

      </div >
    </>
  )
}

export default App
