import { Expose, Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Length,
  Matches,
} from "class-validator";



export class GetConsultaParams {
  @IsNotEmpty()
  @Matches(/^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/, {
    message: 'fechaDesde debe tener el formato yyyymmdd, ejm: 20250101',
  })
  fechaDesde: string;

  @IsNotEmpty()
  @Matches(/^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/, {
    message: 'fechaHasta debe tener el formato yyyymmdd, ejm: 20250101',
  })
  fechaHasta: string;

  @Transform(({ value }) => value ?? 'T')
  @IsNotEmpty()
  @Matches(/^(T|\d+(,\d+)*)$/, {
    message: 'idUsuario debe ser "T" o una lista de IDs numéricos separados por coma',
  })
  idUsuario: string;


  @Transform(({ value }) => value ?? 'T')
  @IsNotEmpty()
  @Matches(/^(T|\d+(,\d+)*)$/, {
    message: 'idProyecto debe ser "T" o una lista de IDs numéricos separados por coma',
  })
  idProyecto: string;


  @IsNotEmpty()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean({ message: 'horasExtras debe ser true o false' })
  horasExtras: string;
}
