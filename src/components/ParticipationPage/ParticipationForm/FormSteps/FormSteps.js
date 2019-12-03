import React from 'react';

function FormSteps({ currentQuestion, questionnaireSize, changeStep }) {
  const changeQuestion = (num) => () => {
    changeStep(currentQuestion + num);
  };
  return (
    <div className="FormSteps">
      {currentQuestion > 0 && (
        <button type="button" onClick={changeQuestion(-1)}>
          Précédent
        </button>
      )}
      {currentQuestion < questionnaireSize && (
        <button type="button" onClick={changeQuestion(1)}>
          Suivant
        </button>
      )}
    </div>
  );
}

export default FormSteps;
