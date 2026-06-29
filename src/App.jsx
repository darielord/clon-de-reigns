import { useState, useEffect, useRef } from "react";
import { useSpring, animated, to } from "react-spring";
import { useDrag } from "@use-gesture/react";

function juegoReigns() {
  const [menu, setMenu] = useState(false);

  const [playerName, setplayerName] = useState("");

  const [transfondo, setTransfondo] = useState("paranoico");

  function iniciarPartida() {
    if (playerName.trim() === "") {
      alert("¡Firma el registro, recluso!");
      return;
    }
    if (transfondo === "paranoico") {
      setResources({
        religion: 30,

        people: 50,

        military: 70,

        treasury: 50,
      });
    }

    if (transfondo === "salvador") {
      setResources({
        religion: 30,

        people: 70,

        military: 70,

        treasury: 25,
      });
    }
    setMenu(true);
  }

  const [deck, setDeck] = useState([]);

  const [loading, setLoading] = useState(true);

  const audioDeslizar = useRef(new Audio("slideCard.mp3"));

  const [resources, setResources] = useState(() => {
    const recursosGuardados = localStorage.getItem("recursos_reigns");
    if (recursosGuardados) {
      return JSON.parse(recursosGuardados);
    } else {
      return {
        religion: 50,

        people: 50,

        military: 50,

        treasury: 50,
      };
    }
  });

  const [currentCardIndex, setCurrentCardIndex] = useState(() => {
    const indiceGuardado = localStorage.getItem("indice_reigns");

    if (indiceGuardado) {
      return Number(indiceGuardado);
    } else {
      return 0;
    }
  });

  useEffect(() => {
    localStorage.setItem("indice_reigns", currentCardIndex);
    localStorage.setItem("recursos_reigns", JSON.stringify(resources));
  }, [resources, currentCardIndex]);

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

  function reiniciarJuego() {
    setCurrentCardIndex(0);
    setResources({
      religion: 50,

      people: 50,

      military: 50,

      treasury: 50,
    });
  }

  if (loading) {
    return <h1>Cargando Base de Datos Mental...</h1>;
  }

  if (esCero) {
    return (
      <div
        className="pantalla-juego"
        style={{ justifyContent: "center", gap: "30px" }}
      >
        <div
          className="hud-recursos"
          style={{ padding: "40px", maxWidth: "600px" }}
        >
          <h1
            style={{ color: "#ff4444", fontSize: "2rem", marginBottom: "15px" }}
          >
            ❌ REINO DERROTADO ❌
          </h1>
          <p style={{ color: "#aaa", fontSize: "1.1rem", lineHeight: "1.6" }}>
            Perdiste el control de los hilos del poder. Uno de tus recursos
            llegó al límite extremo y la balanza se rompió por completo. Tu
            legado ha terminado en las sombras.
          </p>
          <button
            onClick={reiniciarJuego}
            style={{
              marginTop: "30px",
              backgroundColor: "#ff4444",
              color: "#fff",
              border: "none",
              padding: "14px 28px",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#cc3333")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#ff4444")
            }
          >
            Volver a Reinar
          </button>
        </div>
      </div>
    );
  }
  if (esMazo) {
    return (
      <div className="pantalla-juego">
        <div
          className="hud-recursos"
          style={{ padding: "40px", textAlign: "center" }}
        >
          <h2>¡VICTORIA REAL!</h2>
          <p>
            Has mantenido el equilibrio de tu reino y completado tu legado con
            éxito.
          </p>
          <button
            onClick={reiniciarJuego}
            style={{
              marginTop: "20px",
              backgroundColor: "#fff",
              color: "#000",
              padding: "12px 24px",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Iniciar nuevo reinado
          </button>
        </div>
      </div>
    );
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
    audioDeslizar.current.currentTime = 0;
    audioDeslizar.current.play();
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
    audioDeslizar.current.currentTime = 0;
    audioDeslizar.current.play();
    setCurrentCardIndex(currentCardIndex + 1);
  }

  if (menu) {
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
  } else {
    return (
      <div
        className="pantalla-juego"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2>Historial de Ingreso Celda 4</h2>

        {/* Input del Nombre */}
        <input
          type="text"
          placeholder="Escribe tu nombre, recluso..."
          value={playerName}
          onChange={(e) => setplayerName(e.target.value)}
          style={{
            padding: "10px",
            width: "250px",
            borderRadius: "6px",
            border: "1px solid #555",
            background: "#1a1a1a",
            color: "#fff",
          }}
        />

        {/* Selector de Trasfondo */}
        <select
          value={transfondo}
          onChange={(e) => setTransfondo(e.target.value)}
          style={{
            padding: "10px",
            width: "270px",
            borderRadius: "6px",
            border: "1px solid #555",
            background: "#1a1a1a",
            color: "#fff",
          }}
        >
          <option value="paranoico">Historial: Manía Persecutoria</option>
          <option value="salvador">Historial: Complejo de Salvador</option>
        </select>

        {/* Botón de Iniciar */}
        <button
          onClick={iniciarPartida}
          style={{
            marginTop: "10px",
            padding: "12px 24px",
            fontWeight: "bold",
            cursor: "pointer",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#fff",
            color: "#000",
          }}
        >
          Iniciar Reinado Mental
        </button>
      </div>
    );
  }
}

export default juegoReigns;
