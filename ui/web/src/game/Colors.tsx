

export const colorsForIdx = (colorIdx: number, fogged: boolean = false, isActive: boolean = true) => {
  if (fogged) {
    const fog = 'hsla(0, 0%, 10%, 1.0)';
    return {
      fillColor: fog,
      strokeColor: 'hsla(0, 0%, 40%, 1.0)',
      textColor: fog
    };
  } else {
    const alpha = 1.0;
    const textColor = `hsla(0, 100%, 100%, ${alpha})`;
    const fillColor = colorIdx ? `hsla(${colorIdx * 137.508}, 50%, 25%, ${alpha})` : `hsla(0, 0%, 10%, ${alpha})`;
    const strokeColor = isActive ?
      colorIdx ? `hsla(${colorIdx * 137.508}, 100%, 70%, ${alpha})` : `hsla(0, 0%, 70%, ${alpha})`
    : colorIdx ? `hsla(${colorIdx * 137.508}, 90%, 60%, ${alpha})`  : `hsla(0, 0%, 60%, ${alpha})`;

    return { fillColor, strokeColor, textColor };
  }
};
