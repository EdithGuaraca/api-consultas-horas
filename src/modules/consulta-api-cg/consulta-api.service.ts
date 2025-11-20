import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { GetConsultaParams, GetUsuariosListadoDto } from './dto/consulta-api.dto';
import { ApiConsultoriaGService } from '../api-consultoria-g/api-consultoria-g.service';


@Injectable()
export class ConsultaApiService {

  constructor(
    private readonly httpService: HttpService,
    private readonly _apiConsultoriaGService: ApiConsultoriaGService,

  ) { }

  async descargarHorasExcel() {
    try {
      const url = `http://webappcgprod.azurewebsites.net/api/GetExcelTareas/T/20251013/20251021/268,557/false`
      const res$ = this.httpService.get<ArrayBuffer>(url, {
        responseType: 'arraybuffer',
        headers: {
          Accept:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
        },
        validateStatus: () => true,
      });

      const res = await lastValueFrom(res$);

      if (res.status < 200 || res.status >= 300) {
        const preview = this.previewBodyFromArrayBuffer(res.data);
        throw new HttpException(`HTTP ${res.status} - ${preview}`, HttpStatus.BAD_REQUEST);
      }

      return Buffer.from(res.data);

    } catch (error) {
      throw new HttpException(
        error.message ? error.message : "Error generando el token",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async consultarHoras(): Promise<{ sheet: string; count: number; data: any[] }> {
    const buffer = await this.descargarHorasExcel();
    const wb = XLSX.read(buffer, { type: 'buffer' });

    const sheet = wb.SheetNames[0];
    if (!sheet) {
      throw new HttpException('El Excel no contiene hojas.', HttpStatus.BAD_REQUEST);
    }

    const hoja = wb.Sheets[sheet];
    const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(hoja, { defval: null, raw: false });

    const dataConId = rows.map((row) => ({
      id: uuidv4(),
      ...row,
    }));


    return { sheet, count: rows.length, data: dataConId };
  }

  private previewBodyFromArrayBuffer(ab: ArrayBuffer): string {
    try {
      return Buffer.from(ab).toString('utf8').slice(0, 400);
    } catch {
      return '[binario no imprimible]';
    }
  }

  async consultarHorasParams(params: GetConsultaParams): Promise<{ sheet: string; count: number; data: any[] }> {
    const buffer = await this.descargarHorasExcelParams(params);
    const wb = XLSX.read(buffer, { type: 'buffer' });

    const sheet = wb.SheetNames[0];
    if (!sheet) {
      throw new HttpException('El Excel no contiene hojas.', HttpStatus.BAD_REQUEST);
    }

    const hoja = wb.Sheets[sheet];
    const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(hoja, { defval: null, raw: false });

    const dataConId = rows.map((row) => {

      const cleanRow = Object.fromEntries(
        Object.entries(row).filter(
          ([key, value]) => key.trim() !== '' && value !== null && value !== undefined
        )
      );

      return {
        ID: uuidv4(),
        ...cleanRow,
      };
    });

    return { sheet, count: rows.length, data: dataConId };
  }


  async descargarHorasExcelParams(params: GetConsultaParams) {
    try {


      const url = `http://webappcgprod.azurewebsites.net/api/GetExcelTareas/${params.idProyecto}/${params.fechaDesde}/${params.fechaHasta}/${params.idUsuario}/${params.horasExtras}`
      const res$ = this.httpService.get<ArrayBuffer>(url, {
        responseType: 'arraybuffer',
        headers: {
          Accept:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
        },
        validateStatus: () => true,
      });

      const res = await lastValueFrom(res$);

      if (res.status < 200 || res.status >= 300) {
        const preview = this.previewBodyFromArrayBuffer(res.data);
        throw new HttpException(`HTTP ${res.status} - ${preview}`, HttpStatus.BAD_REQUEST);
      }
      const resp = Buffer.from(res.data);
      return resp;

    } catch (error) {
      throw new HttpException(
        error.message ? error.message : "Error en descargarHorasExcelParams",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async getUsuariosActivos() {
    try {
      const usuariosListado = await this._apiConsultoriaGService.getUsuariosListado();
      const usuariosListadoCompleto = await this._apiConsultoriaGService.getUsuariosListadoCompleto();
      const listActivos: GetUsuariosListadoDto[] = [];

      for (const i of usuariosListadoCompleto.Dato) {
        usuariosListado.Dato.find(e => {
          if (e.nombreApellido === i.nombre_apellido) {
            const usuario: GetUsuariosListadoDto = {
              id_usuario: i.id_usuario,
              nombre: i.nombre,
              apellido: i.apellido,
              nombre_apellido: i.nombre_apellido,
              mail: i.mail,
              activo: i.activo
            }
            listActivos.push(usuario);
          }
        })


      }

      return listActivos;

    } catch (error) {
      throw new HttpException(
        error.message ? error.message : "Error generando el token",
        HttpStatus.BAD_REQUEST
      );
    }
  }

}

