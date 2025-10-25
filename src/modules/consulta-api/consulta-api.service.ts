import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';

@Injectable()
export class ConsultaApiService {

  constructor(
    private readonly httpService: HttpService,

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

      // Devuelve solo el binario (no el AxiosResponse, para evitar referencias circulares)
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
    const rows = XLSX.utils.sheet_to_json(hoja, {
      defval: null, // conserva celdas vacías como null
      raw: false,   // formatea a texto legible (fechas/números)
    });

    return { sheet, count: rows.length, data: rows };
  }

  private previewBodyFromArrayBuffer(ab: ArrayBuffer): string {
    try {
      return Buffer.from(ab).toString('utf8').slice(0, 400);
    } catch {
      return '[binario no imprimible]';
    }
  }

}
