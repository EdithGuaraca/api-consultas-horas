//división de texto según un caracter y podemos obtener la parte deseado
export function sliceTextoByCaracter(
  texto: string,
  caracter: string,
  parte: number,
): string {
  const newTexto = texto.split(caracter);
  return newTexto[parte].trim();
}

export function validateCodPersona(codPersona: string): string {
  return codPersona.includes('-')
    ? codPersona
    : `${codPersona.slice(0, 9)}-${codPersona.slice(9 - 10)}`;
}

export function sliceTexto(texto: string, i: number, j: number): string {
  return texto.substring(i, j);
}
export function separarTextoDosPartesPorEspacio(texto: string) {
  const textoSeparado = texto.split(' ', 2);
  return {
    texto1: textoSeparado[0] ? textoSeparado[0] : '',
    texto2: textoSeparado[1] ? textoSeparado[1] : '',
  };
}

export function getIva(texto: string) {
  if (!texto) {
    return null;
  }
  const regex = /\d+/; // Expresión regular para encontrar un número
  const resultado = texto.match(regex);
  return resultado && parseInt(resultado[0], 10);
}


export function normalizar(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}