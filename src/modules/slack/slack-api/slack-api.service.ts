import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { SessionService } from 'src/modules/db/session/session.service';
import { GetUserInfo } from './dto/slack-api.dto';
import { HttpService } from '@nestjs/axios';


@Injectable()
export class SlackApiService {
  private client: WebClient;
  private readonly logger = new Logger(SlackApiService.name);


  constructor(

    private readonly _session: SessionService, private readonly httpService: HttpService) {
    this.client = new WebClient(`${process.env.SLACK_BOT_TOKEN}`);
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
      return { nombreUsuario: result.user?.profile?.display_name }
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

  async processInteraction(payload: any): Promise<void> {
    try {
      const user = payload.user?.username || payload.user?.name;
      const action = payload.actions?.[0];
      const actionId = action?.action_id;
      const value = action?.value;
      const responseUrl = payload.response_url;

      this.logger.log(`🎯 Acción: ${actionId}`);
      this.logger.log(`👤 Usuario: ${user}`);
      this.logger.log(`📦 Valor: ${value}`);

      // Determinar texto de respuesta según acción
      let text = '';
      if (actionId === 'aprobar_hora_extra') {
        text = `✅ ${user} aprobó las horas extra (${value}).`;
      } else if (actionId === 'rechazar_hora_extra') {
        text = `❌ ${user} rechazó las horas extra (${value}).`;
      } else {
        text = `🤖 ${user} ejecutó la acción ${actionId}.`;
      }

      // Enviar mensaje a Slack (response_url)
      if (responseUrl) {
        await this.httpService.axiosRef
          .post(responseUrl, {
            text,
            replace_original: false, // false = agrega nuevo mensaje, true = reemplaza el original
          });
      }

      this.logger.log('✅ Interacción procesada correctamente.');
    } catch (error) {
      this.logger.error('⚠️ Error procesando interacción de Slack:', error);
    }
  }


}
