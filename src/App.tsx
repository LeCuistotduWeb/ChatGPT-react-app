import { ChangeEvent, FormEvent, useState } from "react";
import "./App.css";

function App() {
  const [question, setQestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  //Combien est payé un développeur frontend avec 3ans d'experience au Canada ?

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!question) return null;
    setIsLoading(true);
    const url = process.env.REACT_APP_OPENAI_API_URL || "";
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_GPT_SECRET_KEY}`,
      },
      body: JSON.stringify({
        prompt: question,
        max_tokens: 2000,
        model: "text-davinci-003",
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      setResponse(data?.choices[0]?.text);
      setQestion("");
    })
    .catch(err => setError(err.message))
    .finally(() => setIsLoading(false));
  };
  
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setQestion(event.target.value);
  };

  return (
    <>
      <header>
        <div className="container">
          <div className="headings">
            <h1>ChatGPT</h1>
            <p>
              ChatGPT est une application open source qui fournit une
              technologie conversationnelle par le biais d'un module
              d'intelligence artificielle basé sur GPT-3. Il permet aux
              développeurs de créer des conversations naturelles avec l'IA via
              leurs propres interfaces graphiques et l'utilisation de la
              puissance du modèle GPT-3 d'OpenAI. Elle offre une variété
              d'utilisations pratiques, notamment la création de chatbots pour
              le service client, la création de conversations naturelles pour
              les site web et la construction d'applications conversationnelles
              personnalisées. (PS: cette description est écrite par ChatGPT)
            </p>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="headings">
          <h2>Quelle est ta question ?</h2>
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              type="text"
              onChange={(event) => handleChange(event)}
              placeholder="Quelle est ta question ?"
            />
            <button
              disabled={!question || isLoading ? true : false}
              aria-busy={isLoading}
            >
              Poser la question
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="container">
          <div className="container alert-error">{error}</div>
        </div>
      )}

      {response && (
        <div
          className="container"
          dangerouslySetInnerHTML={{ __html: response }}
        />
      )}
    </>
  );
}

export default App;
