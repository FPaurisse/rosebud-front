import React, { useState, useEffect } from 'react';
import './HomePage.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const limit = 3;

function HomePage() {
  const [linkToParticipate, setLinkToParticipate] = useState(false);
  const [randomImages, setRandomImages] = useState([]);
  const [answersCounter, setAnswersCounter] = useState(0);
  const [participantsCounter, setParticipantsCounter] = useState(0);
  const [questionnairesCounter, setQuestionnairesCounter] = useState(0);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [querySearch, setQuerySearch] = useState('');
  // prèc, next questionnaire
  const [offset, setOffset] = useState(0);
  const [prevZero, setPrevZero] = useState(false);
  const [nextZero, setNextZero] = useState(false);

  useEffect(() => {
    const fetchRandomImages = async () => {
      const result = await axios.get('/api/v1/questionnaires/answers?limit=5');
      setRandomImages(result.data);
    };
    fetchRandomImages();

    const fetchAnswersCounter = async () => {
      const result = await axios.get('/api/v1/answersCounter');
      setAnswersCounter(result.data);
    };
    fetchAnswersCounter();
    const fetchParticipantsCounter = async () => {
      const result = await axios.get('/api/v1/participantsCounter');
      setParticipantsCounter(result.data);
    };
    fetchParticipantsCounter();
    const fetchQuestionnairesCounter = async () => {
      const result = await axios.get('/api/v1/questionnairesCounter');
      setQuestionnairesCounter(result.data);
    };
    fetchQuestionnairesCounter();
    const fetchQuestionnaires = async () => {
      const result = await axios.get(`/api/v1/questionnaires?offset=${offset}&limit=${limit}&query=${querySearch}`);
      setQuestionnaires(result.data);
    };
    fetchQuestionnaires();
    if (offset === 0) {
      setPrevZero(true);
    } else {
      setPrevZero(false);
    }

    if ((questionnaires.length % limit === 1) || (offset + limit === questionnairesCounter)) {
      setNextZero(true);
    } else {
      setNextZero(false);
    }

    console.log(offset);
  }, [offset, querySearch, questionnaires.length, questionnairesCounter]);

  const changeLinkResults = () => {
    setLinkToParticipate(!linkToParticipate);
  };

  const textTruncate = (str, length, ending) => {
    let lengthText = length;
    if (lengthText !== null) {
      lengthText = 80;
    }
    let endingText = ending;
    if (endingText !== null) {
      endingText = '...';
    }
    if (str.length > lengthText) {
      return str.substring(0, lengthText - endingText.length) + endingText;
    }
    return str;
  };

  return (
    <div className="HomePage">

      <div className="random__images__wrapper">
        {randomImages.map((image, index) => (
          <img key={image.id} className={`random__image image__${index + 1}`} src={image.image_url} alt="random home" />
        ))}
        <div className="random__images__button__wrapper">
          <Link to="/questionnaire/1" className="random__images__button">
            <i className="random__images__button__icon fa fa-eye" />
            <p className="random__images__button__content">Consulter</p>
          </Link>
        </div>
      </div>

      <section className="home__counters">
        <div className="home__counters__title">
          {questionnairesCounter}
          <span className="home__counters__length">{questionnairesCounter > 1 ? 'questionnaires' : 'questionnaire'}</span>
        </div>
        <div className="home__counters__title">
          {participantsCounter}
          <span className="home__counters__length">{participantsCounter > 1 ? 'participants' : 'participant'}</span>
        </div>
        <div className="home__counters__title">
          {answersCounter}
          <span className="home__counters__length">{answersCounter > 1 ? 'images' : 'image'}</span>
        </div>
      </section>

      <section className="about__us">
        <div className="about__us__wrapper">
          <h2 className="about__us__title">
            <i className="about__us__icon fa fa-info" />
            À propos de Rosebud
          </h2>
          <p className="about__us__content">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Exercitationem
            {' '}
            <strong>debitis</strong>
            {' '}
            commodi magnam soluta! In debitis, officiis, a nam
            {' '}
            <strong>repellat</strong>
            {' '}
            tenetur ex, vero dignissimos ad doloribus reiciendis? Eum eius qui vitae!
          </p>
        </div>
      </section>

      <section className="home__search">
        <div className="home__search__input__wrapper">
          <input type="text" value={querySearch || ''} placeholder="Rechercher..." className="home__search__input" onChange={(e) => setQuerySearch(e.target.value)} />
        </div>
        {questionnaires.length > 0 ? (
          <div className="search__results">
            <div className="search__results__buttons">
              <button type="button" className={`search__results__button ${!linkToParticipate && 'search__results__button--active'}`} onClick={changeLinkResults}>Consulter</button>
              <button type="button" className={`search__results__button ${linkToParticipate && 'search__results__button--active'}`} onClick={changeLinkResults}>Participer</button>
            </div>
            <div className="search__results__wrapper">
              {questionnaires && questionnaires.map((questionnaire) => (
                <Link to={`${linkToParticipate ? `/questionnaire/${questionnaire.id}/participer/` : `/questionnaire/${questionnaire.id}`}`} className="search__results__item" key={questionnaire.id}>
                  <div className="search__results__item__infos">
                    <h3 className="search__results__item__title">{questionnaire.title}</h3>
                    <p className="search__results__item__content">
                      {linkToParticipate
                        ? textTruncate(questionnaire.description_participate)
                        : textTruncate(questionnaire.description_consult)}
                    </p>
                  </div>
                  <div className="search__results__access">
                    {!linkToParticipate
                      ? <i className="fa fa-eye" />
                      : <i className="fa fa-arrow-right" />}
                  </div>
                </Link>
              ))}
            </div>
            <div className="search__results__pagination">
              <div className="button__wrapper">
                <button disabled={prevZero && 'disabled'} className="button__page__prev" type="button" onClick={() => setOffset(offset - limit)}>
                  {' '}
                  <i className="button__steps__icon fa fa-caret-left" />
                </button>
                <button disabled={nextZero && 'disabled'} className="button__page__next" type="button" onClick={() => setOffset(offset + limit)}>
                  <i className="button__steps__icon fa fa-caret-right" />
                </button>
              </div>
            </div>
          </div>
        ) : <p>Aucun questionnaire trouvé.</p>}
      </section>

    </div>
  );
}

export default HomePage;
