import { useState, useEffect } from "react";
import { useSpring, animated, to } from "react-spring";
import { useDrag } from "@use-gesture/react";

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

  const [{ x, y, rot }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rot: 0,
    config: {
      tension: 300,
      friction: 20,
    },
  }));

  const bind = useDrag(({ down, movement: [mx, my] }) => {
    if (down) {
      api.start({
        x: down ? mx : 0,
        y: down ? my : 0,
        rot: down ? mx / 10 : 0,
      });
    } else {
      if (mx > 150) {
        api.start({ x: 500, rot: 30 });
        setTimeout(() => {
          elegirDerecha();
          api.start({ x: 0, y: 0, rot: 0, immediate: true });
        }, 200);
      } else if (mx < -150) {
        api.start({ x: -500, rot: -30 });

        setTimeout(() => {
          elegirIzquierda();
          api.start({ x: 0, y: 0, rot: 0, immediate: true });
        }, 200);
      } else {
        api.start({ x: 0, y: 0, rot: 0 });
      }
    }
  });

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
    return <h1>¡VICTORIA!</h1>;
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
    <div className="pantalla-juego">
      {/* 1. SECCIÓN SUPERIOR: RECURSOS */}
      <div className="hud-recursos">
        <h3>Recursos:</h3>
        <p>
          Religion: {resources.religion} | People: {resources.people} |
          Military: {resources.military} | Treasury: {resources.treasury}
        </p>
      </div>

      {/* 2. SECCIÓN CENTRAL: LA CARTA */}
      <div className="zona-interactiva">
        <h3>Carta Activa:</h3>
        <animated.div
          {...bind()}
          style={{
            userSelect: "none",
            background: "#2a2a2a" /* Color oscuro de celda mental */,
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "280px",
            height: "380px",
            borderRadius: "16px",
            boxShadow: "0px 10px 25px rgba(0,0,0,0.5)",
            padding: "20px",
            cursor: "grab",
            touchAction: "none",
            textAlign: "center",
            transform: to(
              [x, y, rot],
              (x, y, rot) =>
                `translate3d(${x}px, ${y}px, 0px) rotate(${rot}deg)`,
            ),
          }}
        >
          <p style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
            {deck[currentCardIndex].text}
          </p>
        </animated.div>
      </div>

      {/* 3. SECCIÓN INFERIOR: BOTONES */}
      <div className="consola-botones">
        <button onClick={elegirIzquierda}>
          {deck[currentCardIndex].optA.text}
        </button>
        <button onClick={elegirDerecha}>
          {deck[currentCardIndex].optB.text}
        </button>
      </div>
    </div>
  );
}

export default juegoReigns;
