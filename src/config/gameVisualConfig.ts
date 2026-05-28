export const gameVisualConfig = {
  /**
   * Cambiá a true si querés volver a mostrar íconos lineales en las tarjetas de DEFINICIÓN.
   * Las tarjetas de PRINCIPIO siguen usando los PNG cargados en src/assets/principles.
   */
  showDefinitionIcons: false,

  /**
   * Cambiá a false si querés volver al layout fijo parecido a la referencia original.
   */
  randomizeCardLayout: true,

  /**
   * Máximo ángulo de rotación. Debe quedar por debajo de 30 grados.
   */
  maxCardRotationDeg: 28,
} as const;
