export class UsuarioListadoCompletoDto {
  Codigo: number;
  Dato: DatoUsuarioListCompletoDto[];
  Msg: string;
  ErroresValidacion: null;
}

export class DatoUsuarioListCompletoDto {
  id_usuario: number;
  nombre: string;
  nombre_apellido: string;
  apellido: string;
  mail: string;
  password: null;
  nombre_usuario: string;
  activo: boolean;
  rol: null;
  id_tipo_documento_identidad: string;
  numero_documento: string;
  CUIL: string;
  fecha_de_nacimiento: string;
  freelance: boolean;
  horas_diarias: number;
  usuario_modificacion: null;
}


export class UsuarioListadoDto {
  Codigo: number;
  Dato: DatoUsuarioListadoDto[];
  Msg: string;
  ErroresValidacion: null;
}

export class DatoUsuarioListadoDto {
  id_usuario: number;
  nombre: string;
  apellido: string;
  nombreApellido: string;
  nombre_usuario: string;
}

export class CatalogoProyectosDto {
  Codigo: number;
  Dato: DatoCatalogoProyectosDto[];
  Msg: string;
  ErroresValidacion: null;
}

export class DatoCatalogoProyectosDto {
  id_proyecto: number;
  proyecto: string;
  area: string;
  descripcion: string;
  id_area: number;
  id_entidad: number;
  cerrado: boolean;
  mail: string;
  usuario_modificacion: null;
}

