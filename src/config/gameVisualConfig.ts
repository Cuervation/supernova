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
   * Mantiene el tablero con la misma composición en mobile/tablet.
   * El stage completo se escala; las cards no pasan a grilla/lista.
   */
  preserveBoardLayoutOnMobile: true,

  /**
   * Debajo de este ancho el tablero pasa de composición desktop de 3 filas
   * a slots compactos de 5 filas x 2 columnas, manteniendo las rotaciones.
   * Los slots dejan aire para evitar solapes mayores al 5%.
   */
  compactBoardBreakpointPx: 1180,

  /**
   * Presupuesto visual máximo de solape tolerado entre tarjetas.
   * El layout usa slots separados para mantenerse por debajo de este valor.
   */
  maxCardOverlapPercent: 5,

  /**
   * Máximo ángulo de rotación. Debe quedar por debajo de 25 grados.
   */
  maxCardRotationDeg: 24,
} as const;
