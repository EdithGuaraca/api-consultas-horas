import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { sliceTextoByCaracter } from './string-utils';


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let mensaje = 'Error interno del servidor';

    if (typeof exceptionResponse === 'string') {
      mensaje = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse.hasOwnProperty('message')
    ) {
      mensaje = exceptionResponse['message'];
    }

    const exceptionValidationPipes: string[] = [];

    if (Array.isArray(exceptionResponse['message'])) {
      exceptionResponse['message'].forEach((error: string) => {
        if (error.includes('should not be empty')) {
          const atributo = sliceTextoByCaracter(error, ' ', 0);
          exceptionValidationPipes.push(`[${atributo} es obligatorio]`);
        }

        if (
          error.includes(
            'must be a number conforming to the specified constraints',
          )
        ) {
          const atributo = sliceTextoByCaracter(error, ' ', 0);
          exceptionValidationPipes.push(`[${atributo} debe ser un número]`);
        }

        if (error.includes('must be a string')) {
          const atributo = sliceTextoByCaracter(error, ' ', 0);
          exceptionValidationPipes.push(`[${atributo} debe ser un texto]`);
        }

        if (error.includes('must be a Date instance')) {
          const atributo = sliceTextoByCaracter(error, ' ', 0);
          exceptionValidationPipes.push(
            `[${atributo} debe tener formato de fecha]`,
          );
        }

        if (error.includes('must be an integer number')) {
          const atributo = sliceTextoByCaracter(error, ' ', 0);
          exceptionValidationPipes.push(
            `[${atributo} debe ser un número entero]`,
          );
        }

        if (error.includes('property filtro should not exist')) {
          const atributo = sliceTextoByCaracter(error, ' ', 1);
          exceptionValidationPipes.push(`[${atributo} no existe]`);
        }

        if (error.includes('must be a boolean value')) {
          const atributo = sliceTextoByCaracter(error, ' ', 0);
          exceptionValidationPipes.push(
            `[${atributo} debe ser un booleano]`,
          );
        }

      });

      if (exceptionValidationPipes.length > 0) {
        mensaje = exceptionValidationPipes.join(', ');
      }


    }

    response.status(status).json({
      codigo: status,
      mensaje,
    });
  }
}
