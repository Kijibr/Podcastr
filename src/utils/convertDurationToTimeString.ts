export function convertDurationToTimeString(duration: number) {
  const hours = Math.floor(duration / 3600); // (60 * 60)
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  1

  const timeString = [hours, minutes, seconds]
    .map(unit => String(unit).padStart(2, '0')) // para cada unidade, terão 2 digitos, caso seja só 1, acrescenta-se 0 na frente
    .join(':');

  return timeString;
}