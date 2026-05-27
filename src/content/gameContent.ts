import type { GameContent } from "../core/game/game-content.types";

export const gameContent: GameContent = {
  gameVersion: "mvp-1",
  totalPairs: 5,
  items: [
    { id: "principle-todo-terreno", type: "principle", text: "TODO TERRENO" },
    {
      id: "definition-todo-terreno",
      type: "definition",
      text: "Porque siempre encontramos la manera de resolver",
    },
    { id: "principle-fan-cliente", type: "principle", text: "FAN CLIENTE" },
    {
      id: "definition-fan-cliente",
      type: "definition",
      text: "Porque escuchamos, entendemos y nos ponemos en su lugar",
    },
    {
      id: "principle-valentia-transforma",
      type: "principle",
      text: "VALENTÍA QUE TRANSFORMA",
    },
    {
      id: "definition-valentia-transforma",
      type: "definition",
      text: "Porque nos animamos a cambiar para crecer",
    },
    {
      id: "principle-inspiramos-huella",
      type: "principle",
      text: "INSPIRAMOS Y DEJAMOS HUELLA",
    },
    {
      id: "definition-inspiramos-huella",
      type: "definition",
      text: "Porque construimos un camino que inspira y hace la diferencia",
    },
    { id: "principle-equipazo", type: "principle", text: "EQUIPAZO" },
    {
      id: "definition-equipazo",
      type: "definition",
      text: "Porque sabemos trabajar juntos para alcanzar nuestros logros",
    },
  ],
  pairs: [
    {
      id: "pair-todo-terreno",
      principleId: "principle-todo-terreno",
      definitionId: "definition-todo-terreno",
      finalTitle: "TODO TERRENO",
      finalDescription: "Porque siempre encontramos la manera de resolver",
    },
    {
      id: "pair-fan-cliente",
      principleId: "principle-fan-cliente",
      definitionId: "definition-fan-cliente",
      finalTitle: "FAN CLIENTE",
      finalDescription: "Porque escuchamos, entendemos y nos ponemos en su lugar",
    },
    {
      id: "pair-valentia-transforma",
      principleId: "principle-valentia-transforma",
      definitionId: "definition-valentia-transforma",
      finalTitle: "VALENTÍA QUE TRANSFORMA",
      finalDescription: "Porque nos animamos a cambiar para crecer",
    },
    {
      id: "pair-inspiramos-huella",
      principleId: "principle-inspiramos-huella",
      definitionId: "definition-inspiramos-huella",
      finalTitle: "INSPIRAMOS Y DEJAMOS HUELLA",
      finalDescription: "Porque construimos un camino que inspira y hace la diferencia",
    },
    {
      id: "pair-equipazo",
      principleId: "principle-equipazo",
      definitionId: "definition-equipazo",
      finalTitle: "EQUIPAZO",
      finalDescription: "Porque sabemos trabajar juntos para alcanzar nuestros logros",
    },
  ],
};
