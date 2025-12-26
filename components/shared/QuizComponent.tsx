import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import {
  CircleCheck,
  CircleX,
  Clock,
  ArrowLeft,
  Trophy,
  CircleAlert,
} from 'lucide-react-native';
import { useApp, QuizResult } from '@/context/AppContext';
import { Quiz, Question } from '@/types';

interface QuizComponentProps {
  moduleId: string;
  onComplete: () => void;
  onBack: () => void;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({
  moduleId,
  onComplete,
  onBack,
}) => {
  const { quizzes, currentUser, addQuizResult } = useApp();
  const quiz = quizzes.find((q: Quiz) => q.moduleId === moduleId);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz?.timeLimit ? quiz.timeLimit * 60 : 0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = useCallback(() => {
    if (!quiz) return;
    setIsSubmitted(true);
    setShowResults(true);

    // Calculate score
    let correctCount = 0;
    quiz.questions.forEach((q: Question, index: number) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = (correctCount / quiz.questions.length) * 100;
    const passed = score >= quiz.passingScore;

    if (currentUser) {
      const result: QuizResult = {
        id: Date.now().toString(),
        quizId: quiz.id,
        userId: currentUser.id,
        score,
        passed,
        completedAt: new Date().toISOString(),
        answers: selectedAnswers,
      };
      addQuizResult(result);
    }
  }, [quiz, selectedAnswers, currentUser, addQuizResult]);

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, showResults, handleSubmit]);

  if (!quiz) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <CircleAlert size={48} color="#DC1F2E" />
        <Text className="text-lg font-bold text-gray-800 mt-4">Quiz Not Found</Text>
        <Text className="text-gray-600 text-center mt-2">
          The quiz for this module is currently unavailable.
        </Text>
        <TouchableOpacity
          onPress={onBack}
          className="mt-6 px-6 py-2 bg-gray-100 rounded-lg"
        >
          <Text className="text-gray-700">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (isSubmitted) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    const correctCount = quiz.questions.reduce((acc: number, q: Question, idx: number) => {
      return acc + (selectedAnswers[idx] === q.correctAnswer ? 1 : 0);
    }, 0);
    const score = (correctCount / quiz.questions.length) * 100;
    const passed = score >= quiz.passingScore;

    return (
      <ScrollView className="flex-1 bg-gray-50 p-6">
        <View className="bg-white rounded-2xl shadow-sm p-8 items-center text-center">
          <View className={`w-20 h-20 rounded-full items-center justify-center mb-6 ${
            passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {passed ? (
              <Trophy size={40} color="#16a34a" />
            ) : (
              <CircleX size={40} color="#DC1F2E" />
            )}
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {passed ? 'Congratulations!' : 'Keep Trying!'}
          </Text>
          <Text className="text-gray-600 mb-6 text-center">
            {passed
              ? 'You have successfully passed the quiz.'
              : 'You did not meet the passing score. Review the material and try again.'}
          </Text>

          <View className="flex-row gap-8 mb-8">
            <View className="items-center">
              <Text className="text-3xl font-bold text-gray-900">{Math.round(score)}%</Text>
              <Text className="text-sm text-gray-500">Your Score</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold text-gray-900">{quiz.passingScore}%</Text>
              <Text className="text-sm text-gray-500">Passing Score</Text>
            </View>
          </View>

          <View className="w-full gap-3">
            {passed ? (
              <TouchableOpacity
                onPress={onComplete}
                className="w-full bg-red-600 py-3 rounded-lg items-center"
              >
                <Text className="text-white font-bold">Continue Learning</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setShowResults(false);
                  setIsSubmitted(false);
                  setCurrentQuestion(0);
                  setSelectedAnswers([]);
                  setTimeLeft(quiz.timeLimit ? quiz.timeLimit * 60 : 0);
                }}
                className="w-full bg-red-600 py-3 rounded-lg items-center"
              >
                <Text className="text-white font-bold">Try Again</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={onBack}
              className="w-full py-3 rounded-lg items-center"
            >
              <Text className="text-gray-600 font-medium">Back to Module</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 shadow-sm flex-row justify-between items-center">
        <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="font-bold text-gray-900">Question {currentQuestion + 1}/{quiz.questions.length}</Text>
          <Text className="text-xs text-gray-500">{quiz.title}</Text>
        </View>
        <View className={`flex-row items-center gap-1 px-3 py-1 rounded-full ${
          timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
        }`}>
          <Clock size={14} color={timeLeft < 60 ? '#DC1F2E' : '#4b5563'} />
          <Text className={`text-xs font-medium ${timeLeft < 60 ? 'text-red-600' : 'text-gray-600'}`}>
            {formatTime(timeLeft)}
          </Text>
        </View>
      </View>

      {/* Question Content */}
      <ScrollView className="flex-1 p-6">
        <View className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <Text className="text-lg font-medium text-gray-900 mb-6">
            {quiz.questions[currentQuestion].question}
          </Text>

          <View className="gap-3">
            {quiz.questions[currentQuestion].options.map((option: string, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleAnswerSelect(index)}
                className={`p-4 rounded-lg border-2 flex-row items-center justify-between ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Text className={`flex-1 ${
                  selectedAnswers[currentQuestion] === index ? 'text-red-900 font-medium' : 'text-gray-700'
                }`}>
                  {option}
                </Text>
                {selectedAnswers[currentQuestion] === index && (
                  <CircleCheck size={20} color="#DC1F2E" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <View className="bg-white p-4 border-t border-gray-200 flex-row justify-between">
        <TouchableOpacity
          onPress={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className={`px-6 py-3 rounded-lg ${
            currentQuestion === 0 ? 'opacity-50 bg-gray-100' : 'bg-gray-100'
          }`}
        >
          <Text className="text-gray-700 font-medium">Previous</Text>
        </TouchableOpacity>

        {currentQuestion === quiz.questions.length - 1 ? (
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={selectedAnswers.length < quiz.questions.length}
            className={`px-6 py-3 rounded-lg bg-red-600 ${
              selectedAnswers.length < quiz.questions.length ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-white font-bold">Submit Quiz</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setCurrentQuestion((prev) => Math.min(quiz.questions.length - 1, prev + 1))}
            disabled={selectedAnswers[currentQuestion] === undefined}
            className={`px-6 py-3 rounded-lg bg-red-600 ${
              selectedAnswers[currentQuestion] === undefined ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-white font-bold">Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

