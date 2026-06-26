import { useState } from "react";

export const crisisDeck = [
  {
    id: 1,
    text: "dilema",
    optA: "dilemaizq",
    optB: "dilemader",
  },
  {
    id: 2,
    text: "dilema",
    optA: "dilemaizq",
    optB: "dilemader",
  },
  {
    id: 3,
    text: "dilema",
    optA: "dilemaizq",
    optB: "dilemader",
  },
];

function juegoReigns() {
  const [resources, setResources] = useState({
    religion: 50,
    people: 50,
    military: 50,
    treasury: 50,
  });

  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  return (
    <div style={{ border: "1px solid black", padding: "20px" }}>
      <h3>Recursos:</h3>
      <p>
        Religion: {resources.religion} | People: {resources.people} | Military:
        {resources.military}| Treasury:{resources.treasury}
      </p>
      <h3> Carta Activa: </h3>
      <p>{crisisDeck[currentCardIndex].text}</p>
    </div>
  );
}

export default juegoReigns;
