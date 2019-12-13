import React, { useState, useReducer, useEffect } from 'react';
import axios from 'axios';
import Question from './Question/Question';
import Navigation from './Navigation/Navigation';
import { initialState, reducer } from '../answersReducer';


function QuestionsForm({ addAnswers, setQuestionsLength }) {
  const [questions, setQuestions] = useState([]);
  const questionnaireSize = questions.length;
  const [currentPagination, setCurrentPagination] = useState(1);
  const [answer, setAnswer] = useState('');
  const [state, dispatch] = useReducer(reducer, initialState);
  const { answers } = state;

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/api/v1/questionnaires/1/questions');
      setQuestions(result.data);
    };
    fetchData();
  }, []);

  const changeQuestion = (type) => {
    const action = answers.length < currentPagination ? 'ADD_ANSWER' : 'UPDATE_ANSWER';
    if (type === 'next') {
      dispatch({
        type: action,
        id: currentPagination,
        comment: answer,
        question_id: questions[currentPagination - 1].id,
    
      });
      setCurrentPagination(currentPagination + 1);
    } else {
      setCurrentPagination(currentPagination - 1);
    }
    setQuestionsLength(questionnaireSize);
    setAnswer('');
  };

  useEffect(() => {
    addAnswers(answers);
  });

  return (
    <div>
      {currentPagination <= questionnaireSize
        ? (
          <div>
            <Question
              question={questions
                .find((question, index) => index + 1 === currentPagination && question)}
              currentAnswer={setAnswer}
            />
            <Navigation
              allowClick={changeQuestion}
              currentPagination={currentPagination}
              questionnaireSize={questionnaireSize}
            />

          </div>
        )
        : (
          answers.map((item, index) => (
            <div key={item.id}>
              <h3>{questions[index].title}</h3>
              <p>{item.comment}</p>
              <img class='test' src={JSON.parse(localStorage.getItem(`image ${item.id}`))} alt='affiche de film'/>
              <button type="button" onClick={() => setCurrentPagination(index + 1)}>
                edit
              </button>
            </div>
          ))
        )}
    </div>
  );
}

export default QuestionsForm;
