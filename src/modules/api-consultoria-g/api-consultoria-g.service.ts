import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RequestApiDto } from '../common/dto/common.dto';
import { CommonService } from '../common/common.service';
import { GetUsuariosListadoDto } from '../consulta-api-cg/dto/consulta-api.dto';
import { CatalogoProyectosDto, UsuarioListadoCompletoDto, UsuarioListadoDto } from './dto/api-consultoria-g.dto';

@Injectable()
export class ApiConsultoriaGService {

  constructor(
    private readonly _commonService: CommonService,
  ) { }


  async getUsuariosListado() {
    try {
      const params: RequestApiDto = {

        url: `http://webappcgprod.azurewebsites.net/api/Usuario/Listado`,
        nombreServicio: 'Usuario/Listado',
        params: {}

      }
      const respuesta: UsuarioListadoDto = await this._commonService.requestApi(params);
      return respuesta;

    } catch (error) {
      throw new HttpException(
        error.message ? error.message : "Error en getUsuariosListado",
        HttpStatus.BAD_REQUEST
      );
    }
  }



  async getUsuariosListadoCompleto() {
    try {
      const params: RequestApiDto = {

        url: `http://webappcgprod.azurewebsites.net/api/Usuario/ListadoCompleto`,
        nombreServicio: 'Usuario/ListadoCompleto',
        params: {}

      }
      const listaUsuariosCompleto: UsuarioListadoCompletoDto = await this._commonService.requestApi(params);

      return listaUsuariosCompleto;

    } catch (error) {
      throw new HttpException(
        error.message ? error.message : "Error en getUsuariosListadoCompleto",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async getCatalogoProyectos() {
    try {
      const params: RequestApiDto = {

        url: `http://webappcgprod.azurewebsites.net/api/Catalogo/Proyectos`,
        nombreServicio: 'CatalogoProyectos',
        params: {}

      }
      const catalogoProyectos: CatalogoProyectosDto = await this._commonService.requestApi(params);

      return catalogoProyectos;

    } catch (error) {
      throw new HttpException(
        error.message ? error.message : "Error en getCatalogoProyectos",
        HttpStatus.BAD_REQUEST
      );
    }
  }


}
