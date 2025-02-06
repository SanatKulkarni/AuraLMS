"use client";
import { useState, useEffect } from "react";
import { styled, keyframes } from "@mui/system";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from "@mui/material";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const generateQuestions = async (language) => {
  const data = {
    cpp: {
      questions: [
        {
          text: "What is the first line of a C++ program?",
          options: ["#include <iostream>", "#include <stdio.h>", "import iostream", "using namespace std;"],
          correctAnswer: "#include <iostream>",
          codePart: "#include <iostream>\n",
        },
        {
          text: "Which namespace should we use?",
          options: ["using namespace std;", "namespace std;", "std::namespace;", "import std;"],
          correctAnswer: "using namespace std;",
          codePart: "using namespace std;\n",
        },
        {
          text: "How do we start the main function?",
          options: ["int main() {", "void main() {", "main() {", "public static void main() {"],
          correctAnswer: "int main() {",
          codePart: "int main() {\n",
        },
        {
          text: "How do we print 'Hello, World!' to the console?",
          options: ["cout << 'Hello, World!';", "System.out.println('Hello, World!');", 'cout << "Hello, World!";', "printf('Hello, World!');"],
          correctAnswer: 'cout << "Hello, World!";',
          codePart: '    cout << "Hello, World!" << endl;\n',
        },
        {
          text: "How do we end the main function?",
          options: ["return 0;", "end main;", "exit(0);", "}"],
          correctAnswer: "return 0;",
          codePart: "    return 0;\n}",
        },
      ],
      initialCode: "",
      output: "Hello, World!"
    },
    python: {
      questions: [
        {
          text: "How do you start a Python script?",
          options: ["def main():", "if __name__ == '__main__':", "package main", "function main()"],
          correctAnswer: "if __name__ == '__main__':",
          codePart: "if __name__ == '__main__':\n",
        },
        {
          text: "How do you print 'Hello, World!' in Python?",
          options: ["console.log('Hello, World!')", "print('Hello, World!')", "System.out.println", "printf('Hello, World!')"],
          correctAnswer: "print('Hello, World!')",
          codePart: "    print('Hello, World!')\n",
        },
        {
          text: "How do you define a main function?",
          options: ["def main()", "function main()", "main()", "void main()"],
          correctAnswer: "def main()",
          codePart: "def main():\n",
        },
        {
          text: "How do you call the main function?",
          options: ["main()", "call main()", "main.call()", "run main()"],
          correctAnswer: "main()",
          codePart: "    main()\n",
        }
      ],
      initialCode: "",
      output: "Hello, World!"
    },
    java: {
      questions: [
        {
          text: "What is the main class declaration in Java?",
          options: ["public class Main", "class Main", "public static class Main", "Main class"],
          correctAnswer: "public class Main",
          codePart: "public class Main {\n",
        },
        {
          text: "What is the correct main method signature?",
          options: [
            "public static void main(String[] args)",
            "public void main(String[] args)",
            "static main(String[] args)",
            "public main()"
          ],
          correctAnswer: "public static void main(String[] args)",
          codePart: "    public static void main(String[] args) {\n",
        },
        {
          text: "How do you print in Java?",
          options: ["System.out.print", "console.log", "printf", "print"],
          correctAnswer: "System.out.print",
          codePart: '        System.out.println("Hello, World!");\n',
        },
        {
          text: "How do you close the main method?",
          options: ["}", "end method", "return 0;", "}"],
          correctAnswer: "}",
          codePart: "    }\n",
        },
        {
          text: "How do you close the class?",
          options: ["}", "end class", "exit", "}"],
          correctAnswer: "}",
          codePart: "}\n",
        }
      ],
      initialCode: "",
      output: "Hello, World!"
    }
  };

  return data[language];
};

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "100vh",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)",
}));

const LanguageSelector = styled(FormControl)(({ theme }) => ({
  position: 'absolute',
  top: 20,
  right: 20,
  minWidth: 120,
  '& .MuiSelect-select': {
    backgroundColor: '#000',
    color: 'white',
    fontFamily: '"Consolas", monospace',
    borderRadius: '4px',
    padding: '8px 16px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#2196f3 !important',
  },
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

const ProgressBar = styled(Box)(({ theme }) => ({
  height: 6,
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  borderRadius: 3,
  margin: theme.spacing(3, 0),
  overflow: "hidden",
}));

const ProgressFill = styled(Box)(({ theme }) => ({
  height: "100%",
  background: "linear-gradient(90deg, #00bcd4 0%, #2196f3 100%)",
  transition: "width 0.3s ease",
}));

const AnimatedCard = styled(Card)(({ theme }) => ({
  animation: `${fadeIn} 0.3s ease-out`,
  background: "rgba(255, 255, 255, 0.95)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

const SuccessPulse = styled(Box)(({ theme }) => ({
  animation: `${pulse} 1s ease infinite`,
  color: "#4caf50",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const ErrorPulse = styled(Box)(({ theme }) => ({
  animation: `${pulse} 1s ease infinite`,
  color: "#f44336",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export default function CodingLearningPage() {
  const [language, setLanguage] = useState('cpp');
  const [languageData, setLanguageData] = useState({
    questions: [],
    initialCode: '',
    output: ''
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [code, setCode] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const data = await generateQuestions(language);
      setLanguageData(data);
      setCode(data.initialCode);
      setCurrentQuestionIndex(0);
      setIsCompleted(false);
      setIsCorrect(null);
    };
    fetchQuestions();
  }, [language]);

  const handleAnswer = (selectedAnswer) => {
    if (!languageData.questions.length) return;
    const currentQuestion = languageData.questions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setIsCorrect(true);
      setCode((prevCode) => prevCode + currentQuestion.codePart);
      if (currentQuestionIndex === languageData.questions.length - 1) {
        setIsCompleted(true);
      } else {
        setTimeout(() => {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setIsCorrect(null);
        }, 1000);
      }
    } else {
      setIsCorrect(false);
      setTimeout(() => setIsCorrect(null), 1000);
    }
  };

  const progress = ((currentQuestionIndex + 1) / languageData.questions.length) * 100;

  return (
    <StyledBox>
      <LanguageSelector variant="outlined">
        <InputLabel id="language-select-label" sx={{ color: 'white' }}>Language</InputLabel>
        <Select
          labelId="language-select-label"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          label="Language"
        >
          <MenuItem value="cpp">C++</MenuItem>
          <MenuItem value="python">Python</MenuItem>
          <MenuItem value="java">Java</MenuItem>
        </Select>
      </LanguageSelector>

      <Box width="50%" p={4} maxWidth={800}>
        <Typography variant="h3" fontWeight="bold" mb={2} color="white" sx={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}>
          Master {language.toUpperCase()} Basics
          <Box component="span" sx={{ color: '#00bcd4', ml: 1 }}>
            {language === 'cpp' && '++'}
            {language === 'python' && '🐍'}
            {language === 'java' && '☕'}
          </Box>
        </Typography>
        
        {!isCompleted && languageData.questions.length > 0 ? (
          <AnimatedCard variant="outlined">
            <CardContent>
              <ProgressBar>
                <ProgressFill sx={{ width: `${progress}%` }} />
              </ProgressBar>
              
              <Typography variant="h5" fontWeight="bold" mb={3} color="text.primary">
                {languageData.questions[currentQuestionIndex].text}
              </Typography>

              <ButtonGroup>
                {languageData.questions[currentQuestionIndex].options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    variant="contained"
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      background: '#000',
                      color: 'white',
                      fontFamily: '"Consolas", monospace',
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: '#1a1a1a',
                        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
                        transform: 'translateY(-2px)'
                      },
                      '&:disabled': {
                        background: '#333',
                        opacity: 0.7,
                      },
                    }}
                    disabled={isCorrect !== null}
                  >
                    {option}
                  </Button>
                ))}
              </ButtonGroup>

              {isCorrect !== null && (
                <Box mt={2} display="flex" justifyContent="center">
                  {isCorrect ? (
                    <SuccessPulse>
                      <CheckCircleIcon fontSize="large" />
                      <Typography variant="h6" fontWeight="bold">
                        Well Done!
                      </Typography>
                    </SuccessPulse>
                  ) : (
                    <ErrorPulse>
                      <CancelIcon fontSize="large" />
                      <Typography variant="h6" fontWeight="bold">
                        Try Again
                      </Typography>
                    </ErrorPulse>
                  )}
                </Box>
              )}
            </CardContent>
          </AnimatedCard>
        ) : (
          <AnimatedCard variant="outlined">
            <CardContent>
              <Box textAlign="center" py={4}>
                <SuccessPulse sx={{ justifyContent: 'center', mb: 2 }}>
                  <CheckCircleIcon sx={{ fontSize: 64 }} />
                </SuccessPulse>
                <Typography variant="h3" fontWeight="bold" mb={2} color="success.main">
                  Congratulations!
                </Typography>
                <Typography variant="h6" color="text.secondary" mb={4}>
                  You've mastered the basics of {language.toUpperCase()} programming!
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(45deg, #00bcd4 30%, #00acc1 90%)',
                    boxShadow: '0 4px 8px rgba(0, 188, 212, 0.3)',
                    borderRadius: 3,
                    px: 6,
                    py: 1.5,
                  }}
                  onClick={() => setLanguage(language)}
                >
                  Try Another Language
                </Button>
              </Box>
            </CardContent>
          </AnimatedCard>
        )}
      </Box>

      <Box width="50%" p={4} height="100vh" sx={{ overflow: 'hidden' }}>
        <Box
          sx={{
            height: '100%',
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.3)',
          }}
        >
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{
              height: '100%',
              margin: 0,
              padding: '2rem',
              fontSize: '1.1rem',
              borderRadius: 0,
            }}
            showLineNumbers
          >
            {code}
          </SyntaxHighlighter>
          
          {isCompleted && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 40,
                right: 40,
                bgcolor: '#004d40',
                color: '#00e676',
                px: 3,
                py: 1,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Output: <Box component="span" sx={{ color: 'white' }}>{languageData.output}</Box>
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </StyledBox>
  );
}