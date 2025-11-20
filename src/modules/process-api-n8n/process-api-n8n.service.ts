import { Injectable } from '@nestjs/common';
import { SlackApiService } from '../slack/slack-api/slack-api.service';
import { ApiConsultoriaGService } from '../api-consultoria-g/api-consultoria-g.service';
import { GetUsuariosListadoDto } from '../consulta-api-cg/dto/consulta-api.dto';
import { GetInfoUserSlackByMailDto } from './dto/process-api.dto';
import { channel } from 'diagnostics_channel';
import { ConsultaApiService } from '../consulta-api-cg/consulta-api.service';
@Injectable()
export class ProcessApiN8nService {

  constructor(
    private readonly _slackApiService: SlackApiService,
    private readonly _apiConsultoriaGService: ApiConsultoriaGService,
    private readonly _consultaApiService: ConsultaApiService,
  ) { }

  async postMessageByUser() {
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
      const listInfoUserSlack: GetInfoUserSlackByMailDto[] = [];

      // for (const i of listActivos) {
      //   const resultado = await this._slackApiService.lookupByEmail({ email: i.mail });
      //   if (resultado?.ok === true) {
      //     const usuarioSlack: GetInfoUserSlackByMailDto = {
      //       user: resultado.user?.id,
      //       name: resultado.user?.name,
      //       real_name: resultado.user?.real_name,
      //       first_name: resultado.user?.profile?.first_name,
      //       last_name: resultado.user?.profile?.last_name,
      //       display_name: resultado.user?.profile?.display_name,
      //       email: resultado.user?.profile?.email,
      //       is_email_confirmed: resultado.user?.is_email_confirmed,
      //       id_cg: i.id_usuario
      //     }
      //     console.log(resultado);
      //     listInfoUserSlack.push(usuarioSlack);
      //   }
      // }


      const usuariosPrueba = [
        {
          user: 'U09AM4MQVPB',
          name: 'eguaracac',
          real_name: 'Edith Guaraca C',
          first_name: 'Edith',
          last_name: 'Guaraca C',
          display_name: 'EdithGuaracaC',
          email: 'eguaraca@consultoriaglobal.com.ar',
          is_email_confirmed: true,
          id_cg: 557
        },
        {
          user: 'UDE8G465D',
          name: 'psaavedra',
          real_name: 'Pablo Saavedra',
          first_name: 'Pablo',
          last_name: 'Saavedra',
          display_name: 'Pablo Saavedra',
          email: 'psaavedra@consultoriaglobal.com.ar',
          is_email_confirmed: true,
          id_cg: 249
        },
        {
          user: 'UF22Q8EQM',
          name: 'fwalvarez',
          real_name: 'Fredi Alvarez',
          first_name: '',
          last_name: '',
          display_name: 'Fredi Alvarez',
          email: 'fwalvarez@consultoriaglobal.com.ar',
          is_email_confirmed: true,
          id_cg: 250
        },
        {
          user: 'UF22Q8EQM',
          name: 'amolina',
          real_name: 'Andres Molina',
          first_name: 'Andres',
          last_name: 'Molina',
          display_name: 'Andres Molina',
          email: 'amolina@consultoriaglobal.com.ar',
          is_email_confirmed: true,
          id_cg: 268
        },

      ]



      for (const userId of usuariosPrueba) {
        try {
          const hoy = new Date();
          const ayer = new Date(hoy);
          ayer.setDate(hoy.getDate() - 1);

          const yyyy = ayer.getFullYear();
          const mm = String(ayer.getMonth() + 1).padStart(2, '0');
          const dd = String(ayer.getDate()).padStart(2, '0');

          const fechaAyer = `${yyyy}${mm}${dd}`; // ejemplo: 20251118

          const horas = await this._consultaApiService.consultarHorasParams({ fechaDesde: fechaAyer, fechaHasta: fechaAyer, horasExtras: 'false', idProyecto: 'T', idUsuario: userId.id_cg.toString() })
          console.log(`El usuario ${userId.display_name}-${userId.id_cg} tiene ${horas.count} registros de la fecha: ${fechaAyer}`);
          if (horas.count == 0) {
            await this._slackApiService.postMessage({ canal: userId.user, texto: `🔴🔴 Hola ${userId.real_name} 👋, no olvides cargar tus horas. ⏰🗓️` });

          }
          // para evitar rate‐limit
          await this.delay(1000); //1s
        } catch (error) {
        }
      }

      return usuariosPrueba;

    } catch (error) {
      console.log(error)
    }
  }
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
