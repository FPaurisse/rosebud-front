import React, { useState, useEffect } from 'react';
import './ParticipationForm.css';
import axios from 'axios';

function ParticipationForm() {
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/api/v1/questionnaires/1/questions');
      setQuestions(result.data);
    };
    fetchData();
  }, []);

  const submitParticipation = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    axios.post('/api/v1/questionnaires/1/participations', data);
    console.log(data);
  };

  const changeStep = (value) => {
    setStep(step + value);
  };

  return (
    <>
      {questions.length > 0
        && (
        <form
          encType="multipart/formdata"
          onSubmit={submitParticipation}
          className="ParticipationForm"
        >
          <div className={`${step < 1 ? 'step--show' : 'step--hide'}`}>
            <label htmlFor="firstName">
              <input name="firstName" type="text" placeholder="Prénom" />
            </label>
            <label htmlFor="lastname">
              <input name="lastname" type="text" placeholder="Nom" />
            </label>
            <label htmlFor="status">
              <select name="status" defaultValue="">
                <option value="">Statut</option>
                <option value="teacher">Enseignant</option>
                <option value="student">Éléve</option>
                <option value="other">autre</option>
              </select>
            </label>
            <label htmlFor="age">
              <input name="age" type="text" placeholder="Age" />
            </label>
            <label htmlFor="city">
              <input name="city" type="text" placeholder="Ville" />
            </label>
            <label htmlFor="email">
              <input name="email" type="text" placeholder="E-mail" />
            </label>
            <div className="pagination pagination--firststep">
              <button type="button" onClick={() => changeStep(1)}>Participer</button>
            </div>
          </div>
          {
            questions.map((question, index) => (
              <div className={`${step === index + 1 ? 'step--show' : 'step--hide'}`} key={question.id}>
                <h3>{question.title}</h3>
                <label htmlFor={`answer-${index}-image`}>
                  <input name={`answer-${index}-image`} type="file" />
                </label>
                <label htmlFor={`answer-${index}-comment`}>
                  <textarea name={`answer-${index}-comment`} cols="30" rows="10" />
                </label>
                {step < questions.length
                  && (
                    <div className="pagination">
                      <button type="button" onClick={() => changeStep(-1)}>Précédent</button>
                      <button type="button" onClick={() => changeStep(1)}>Suivant</button>
                    </div>
                  )}
              </div>
            ))
          }
          {step === questions.length
            && (
              <div className="pagination pagination--laststep">
                <button type="button" onClick={() => changeStep(-1)}>Précédent</button>
                <button type="submit">Valider ma participation</button>
              </div>
            )}
        </form>
        )}
    </>
  );
}

export default ParticipationForm;
