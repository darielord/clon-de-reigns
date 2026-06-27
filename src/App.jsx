import { useState, useEffect } from "react";

function juegoReigns() {
  const [deck, setDeck] = useState([]);

  const [loading, setLoading] = useState(true);

  const [resources, setResources] = useState({
    religion: 50,

    people: 50,

    military: 50,

    treasury: 50,
  });

  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    async function cargarDatos() {
      const respuesta = await fetch("/cards.json");

      const datos = await respuesta.json();

      setDeck(datos);
      setLoading(false);
    }
    cargarDatos();
  }, []);

  const esCero =
    resources.religion === 0 ||
    resources.religion === 100 ||
    resources.people === 0 ||
    resources.people === 100 ||
    resources.military === 0 ||
    resources.military === 100 ||
    resources.treasury === 0 ||
    resources.treasury === 100;

  const esMazo = currentCardIndex === deck.length;

  if (loading) {
    return <h1>Cargando Base de Datos Mental...</h1>;
  }

  if (esCero) {
    return <h1>Game Over: Perdiste el control de tu reino.</h1>;
  }

  if (esMazo) {
    return <h1>Victoria</h1>;
  }

  function elegirIzquierda() {
    const card = deck[currentCardIndex];
    const effect = card.optA.effect;

    setResources({
      religion: resources.religion + effect.religion,
      people: resources.people + effect.people,
      military: resources.military + effect.military,
      treasury: resources.treasury + effect.treasury,
    });
    setCurrentCardIndex(currentCardIndex + 1);
  }
  function elegirDerecha() {
    const card = deck[currentCardIndex];
    const effect = card.optB.effect;

    setResources({
      religion: resources.religion + effect.religion,
      people: resources.people + effect.people,
      military: resources.military + effect.military,
      treasury: resources.treasury + effect.treasury,
    });
    setCurrentCardIndex(currentCardIndex + 1);
  }

  return (
    <div style={{ border: "1px solid black", padding: "20px" }}>
      <h3>Recursos:</h3>

      <p>
        Religion: {resources.religion} | People: {resources.people} | Military:
        {resources.military}| Treasury:{resources.treasury}
      </p>

      <h3> Carta Activa: </h3>

      <p>{deck[currentCardIndex].text}</p>

      <button onClick={elegirIzquierda}>
        {deck[currentCardIndex].optA.text}{" "}
      </button>

      <button onClick={elegirDerecha}>
        {deck[currentCardIndex].optB.text}{" "}
      </button>
    </div>
  );
}

export default juegoReigns;
