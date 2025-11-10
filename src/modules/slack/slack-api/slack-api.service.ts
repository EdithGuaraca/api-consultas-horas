import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { SessionService } from 'src/modules/db/session/session.service';
import { EnviarExcel, GetUserInfo } from './dto/slack-api.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as XLSX from 'xlsx';
import { GetConsultaParams } from 'src/modules/consulta-api/dto/consulta-api.dto';



@Injectable()
export class SlackApiService {
  private client: WebClient;
  private readonly logger = new Logger(SlackApiService.name);


  constructor(

    private readonly _session: SessionService, private readonly httpService: HttpService) {
    this.client = new WebClient(`${process.env.SLACK_BOT_TOKEN}`);
  }


  private previewBodyFromArrayBuffer(ab: ArrayBuffer): string {
    try {
      return Buffer.from(ab).toString('utf8').slice(0, 400);
    } catch {
      return '[binario no imprimible]';
    }
  }

  async enviarExcelDesdeApi(
    params: EnviarExcel,

  ) {
    const nombreArchivo = 'reporte-horas.xls';
    // 1) descargar el excel (mismo patrón que sí te funcionó)

    const url = `http://webappcgprod.azurewebsites.net/api/GetExcelTareas/${params.idProyecto}/${params.fechaDesde}/${params.fechaHasta}/${params.idUsuario}/${params.horasExtras}`

    const res$ = this.httpService.get<ArrayBuffer>(url, {
      responseType: 'arraybuffer',
      headers: {
        // el WS devuelve .xls
        Accept:
          'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      validateStatus: () => true,
    });

    const res = await firstValueFrom(res$);

    if (res.status < 200 || res.status >= 300) {
      const preview = this.previewBodyFromArrayBuffer(res.data);
      throw new HttpException(
        `HTTP ${res.status} - ${preview}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // 👇 igual que en tu prueba: sin Uint8Array extra
    const buffer = Buffer.from(res.data);

    // 2) asegurar canal real
    let channel_id = params.user;

    if (channel_id.startsWith('U')) {
      const im = await this.client.conversations.open({ users: channel_id });

      if (!im.ok) {
        this.logger.error('No pude abrir el DM:', im);
        throw new Error(
          `No pude abrir el DM con el usuario: ${(im as any).error}`,
        );
      }

      channel_id = (im.channel as any).id; // ahora es D...
    }

    // 3) subir el archivo a Slack
    const uploadRes = await this.client.files.uploadV2({
      channel_id,
      file: buffer,               // 👈 binario tal cual
      filename: nombreArchivo,    // 👈 .xls
      title: ':bar_chart: Reporte de horas',
      initial_comment: 'Aquí está tu reporte en Excel 👇',
    });

    this.logger.log('uploadRes: ' + JSON.stringify(uploadRes, null, 2));

    if (!uploadRes.ok) {
      throw new Error(`Slack no aceptó el archivo: ${uploadRes.error}`);
    }

    // 4) enviar mensajito con link
    const fileWrapper = (uploadRes as any).files?.[0];
    const file = fileWrapper?.files?.[0];

    if (file) {
      await this.client.chat.postMessage({
        channel: channel_id,
        text: '📎 Reporte generado',
        attachments: [
          {
            text: 'Descarga el Excel aquí',
            title: file.name ?? nombreArchivo,
            title_link: file.permalink,
          },
        ],
      });
    } else {
      this.logger.warn(
        'No vino el archivo dentro de uploadRes.files[0].files[0]',
      );
    }
  }


  async sendMessage() {
    return await this.client.chat.postMessage({
      channel: 'U09AM4MQVPB',
      text: 'Registros',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text:
              '```' +
              'tarea   | proyecto  | dia\n' +
              'tarea1  | proyecto  | 1  \n' +
              '```',
          },
        },
      ],
    });

  }

  async getUserInfo(params: GetUserInfo) {

    try {
      const registro = await this._session.findByUser(params.userId);
      const result = await this.client.users.info({ user: registro.user_id });
      return { display_name: result.user?.profile?.display_name, real_name: result.user?.profile?.real_name, email: result.user?.profile?.email }
      console.log(result.user?.profile?.first_name);
    } catch (error) {
      console.log('**Error en desencriptar: ', error, '**');
      throw new HttpException('Error al desencriptar', HttpStatus.BAD_REQUEST);
    }

  }

  async sendMessageWithButtons() {
    try {
      const res = await this.client.chat.postMessage({
        channel: 'U09AM4MQVPB',
        text: 'Aprobación de horas extra',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'María registró *2h extra* ayer. ¿Deseas aprobarlas?',
            },
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: { type: 'plain_text', text: '✅ Aprobar' },
                style: 'primary',
                action_id: 'aprobar_hora_extra',
                value: 'aprobar_2h_Maria_2025-11-09',
              },
              {
                type: 'button',
                text: { type: 'plain_text', text: '❌ Rechazar' },
                style: 'danger',
                action_id: 'rechazar_hora_extra',
                value: 'rechazar_2h_Maria_2025-11-09',
              },
            ],
          },
        ],
      });

      // Slack responde siempre con ok: true/false
      if (!res.ok) {
        this.logger.error(`Slack error: ${res.error}`);
      }

      return res;
    } catch (err: any) {
      this.logger.error('Error enviando mensaje a Slack', err);
      // devolver el mensaje para que lo veas en Postman
      return {
        ok: false,
        message: err.message,
      };
    }
  }
  async processInteraction(payload: any) {
    try {
      const user = payload.user?.username || payload.user?.name || payload.user?.id;
      const action = payload.actions?.[0];
      const actionId = action?.action_id;
      const value = action?.value;
      const responseUrl = payload.response_url;

      this.logger.log(`Acción: ${actionId} por ${user}`);

      let text = '';
      if (actionId === 'aprobar_hora_extra') {
        text = `✅ ${user} aprobó las horas extra (${value}).`;
      } else if (actionId === 'rechazar_hora_extra') {
        text = `❌ ${user} rechazó las horas extra (${value}).`;
      } else {
        text = `🤖 ${user} ejecutó la acción ${actionId}.`;
      }

      // 👇 aquí es la magia: reemplazamos el mensaje original
      if (responseUrl) {
        await this.httpService.axiosRef
          .post(responseUrl, {
            replace_original: true,        // <- quita el mensaje anterior
            text,                          // texto plano (por si Slack no muestra blocks)
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text,
                },
              },
              // 👇 ya NO ponemos el bloque "actions"
            ],
          });
      }
    } catch (err) {
      this.logger.error('Error procesando interacción', err);
    }
  }



  async probarDescargaExcel(): Promise<void> {
    const url =
      'http://webappcgprod.azurewebsites.net/api/GetExcelTareas/T/20251013/20251021/268,557/false';

    const res = await firstValueFrom(
      this.httpService.get<ArrayBuffer>(url, {
        responseType: 'arraybuffer',
        headers: {
          // tu WS ya devuelve .xls aunque le pidas xlsx
          Accept:
            'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
        validateStatus: () => true,
      }),
    );

    if (res.status < 200 || res.status >= 300) {
      const preview = this.previewBodyFromArrayBuffer(res.data);
      throw new HttpException(
        `HTTP ${res.status} - ${preview}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // 👇 esto es el binario tal cual lo da el WS (formato .xls)
    const buffer = Buffer.from(res.data);

    this.logger.log(`status: ${res.status}`);
    this.logger.log(`content-type: ${res.headers['content-type']}`);
    this.logger.log(`size: ${buffer.length}`);

    // 👉 OJO: guardar como .xls, no .xlsx
    const filename = 'reporte-prueba.xls';
    fs.writeFileSync(filename, buffer);
    this.logger.log(`✅ Archivo guardado como ${filename}`);

    // si por alguna razón viniera HTML, lo vemos
    if (
      res.headers['content-type'] &&
      res.headers['content-type'].includes('text/html')
    ) {
      this.logger.warn(
        '⚠️ El servidor devolvió HTML, no Excel:\n' +
        buffer.toString('utf8').slice(0, 300),
      );
    }

    this.logger.log('✅ Descarga terminada.');
  }


}
