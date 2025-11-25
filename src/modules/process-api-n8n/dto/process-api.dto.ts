export class GetInfoUserSlackByMailDto {
  user?: string;
  name?: string;
  real_name?: string;
  display_name?: string;
  is_email_confirmed?: boolean;
  email?: string;
  first_name?: string;
  last_name?: string;
  id_cg: number;
}


export class GetUsuarioByNombreDto {
  nombre: string;
}

export class UsuarioByNombreDto {
  id_usuario: number;
  nombre_apellido: string;
  mail: string;
  activo: boolean;
}

export class ProyectoByNombreDto {
  id_proyecto: number;
  nombre: string;
  area: string;
  mail: string;
}