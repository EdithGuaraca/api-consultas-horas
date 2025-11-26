import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SlackApiService } from '../slack/slack-api/slack-api.service';
import { ApiConsultoriaGService } from '../api-consultoria-g/api-consultoria-g.service';
import { GetUsuariosListadoDto } from '../consulta-api-cg/dto/consulta-api.dto';
import { GetInfoUserSlackByMailDto, ProyectoByNombreDto, UsuarioByNombreDto } from './dto/process-api.dto';
import { channel } from 'diagnostics_channel';
import { ConsultaApiService } from '../consulta-api-cg/consulta-api.service';
import { normalizar } from '../utils/string-utils';
import { DatoUsuarioListCompletoDto, UsuarioListadoCompletoDto } from '../api-consultoria-g/dto/api-consultoria-g.dto';
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

      const usuariosCuenca = await this._slackApiService.conversationMembers({ channel: `${process.env.CANAL_CUENCA}` });
      const listCanalCuenca: GetInfoUserSlackByMailDto[] = [];

      if (!usuariosCuenca.ok || !usuariosCuenca.members) {
        throw new Error('No se pudieron obtener los miembros del canal Cuenca');
      }

      for (const i of usuariosCuenca.members) {
        const resultado = await this._slackApiService.getInfoByUserId({ userId: i });
        const dataCg = await this._apiConsultoriaGService.getUsuariosListadoCompleto();
        const user = dataCg.Dato.find(e => e.mail === resultado.email);

        const usuarioSlack: GetInfoUserSlackByMailDto = {
          user: i,
          name: resultado.name,
          real_name: resultado.real_name,
          first_name: resultado.first_name,
          last_name: resultado.last_name,
          display_name: resultado.display_name,
          email: resultado.email,
          is_email_confirmed: resultado.is_email_confirmed,
          id_cg: user?.id_usuario ?? 0.0,
        }
        listCanalCuenca.push(usuarioSlack);
      }
      listCanalCuenca.push(
        {
          user: 'UHN63E2J0',
          name: 'imoreno',
          real_name: 'Ismar Moreno',
          first_name: 'Ismar',
          last_name: 'Moreno',
          display_name: 'Ismar Moreno',
          email: 'imoreno@consultoriaglobal.com.ar',
          is_email_confirmed: true,
          id_cg: 325
        },
        {
          user: 'U07H631M1RS',
          name: 'fcacace',
          real_name: 'Federico Cacace',
          first_name: 'Federico',
          last_name: 'Cacace',
          display_name: 'Federico Cacace',
          email: 'fcacace@consultoriaglobal.com.ar',
          is_email_confirmed: true,
          id_cg: 529
        }
      )

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
        // {
        //   user: 'UDE8G465D',
        //   name: 'psaavedra',
        //   real_name: 'Pablo Saavedra',
        //   first_name: 'Pablo',
        //   last_name: 'Saavedra',
        //   display_name: 'Pablo Saavedra',
        //   email: 'psaavedra@consultoriaglobal.com.ar',
        //   is_email_confirmed: true,
        //   id_cg: 249
        // },
        // {
        //   user: 'UF22Q8EQM',
        //   name: 'fwalvarez',
        //   real_name: 'Fredi Alvarez',
        //   first_name: '',
        //   last_name: '',
        //   display_name: 'Fredi Alvarez',
        //   email: 'fwalvarez@consultoriaglobal.com.ar',
        //   is_email_confirmed: true,
        //   id_cg: 250
        // },
        // {
        //   user: 'UF22Q8EQM',
        //   name: 'amolina',
        //   real_name: 'Andres Molina',
        //   first_name: 'Andres',
        //   last_name: 'Molina',
        //   display_name: 'Andres Molina',
        //   email: 'amolina@consultoriaglobal.com.ar',
        //   is_email_confirmed: true,
        //   id_cg: 268
        // },

      ]


      for (const userId of listCanalCuenca) {
        try {
          const hoy = new Date();
          const ayer = new Date(hoy);
          ayer.setDate(hoy.getDate() - 1);

          const yyyy = ayer.getFullYear();
          const mm = String(ayer.getMonth() + 1).padStart(2, '0');
          const dd = String(ayer.getDate()).padStart(2, '0');

          const fechaAyer = `${yyyy}${mm}${dd}`; // formato de parametro 20251118

          const horas = await this._consultaApiService.consultarHorasParams({ fechaDesde: fechaAyer, fechaHasta: fechaAyer, horasExtras: 'false', idProyecto: 'T', idUsuario: userId.id_cg.toString() })
          const recordatorios = [
            `🔴🔴 Hola ${userId.real_name} 👋, notamos que aún no has cargado tus tareas de ayer. Cuando puedas, súbelas para mantener tu registro al día. ⏰🗓️`,
            `🔴🔴 Hola ${userId.real_name} 👋, te recordamos que no registraste tus tareas del día anterior. Por favor, actualízalas para que tu progreso quede completo. ⏰🗓️`,
            `🔴🔴 Hola ${userId.real_name} 👋, aún no cargaste las tareas de ayer. Tómate un momento para añadirlas y seguir al día con tus actividades. ⏰🗓️`,
            `🔴🔴 Hola ${userId.real_name} 👋, parece que las tareas de ayer no fueron ingresadas. Actualízalas cuando tengas un momento. ⏰🗓️`,
            `🔴🔴 Hola ${userId.real_name} 👋, te recordamos que no cargaste tus tareas del día anterior. Por favor, súbelas para evitar retrasos en tu seguimiento. ⏰🗓️`,
            `🔴🔴 Hola ${userId.real_name} 👋, ayer no registraste tareas. Cuando puedas, añádelas para mantener tu planificación actualizada. ⏰🗓️`
          ];
          const indexR = Math.floor(Math.random() * recordatorios.length);

          const felicitaciones = [
            `🟢🟢 Hola ${userId.real_name} 👋, excelente trabajo manteniendo tus tareas al día. ¡Sigue así! 💪✨`,
            `🟢🟢 Hola ${userId.real_name} 👋, revisamos tu registro y estás completamente al día. ¡Muy bien hecho! 🙌📘`,
            `🟢🟢 Hola ${userId.real_name} 👋, felicidades por mantenerte al día con tus tareas. ¡Excelente! ⭐📊`,
            `🟢🟢 Hola ${userId.real_name} 👋, vas muy bien. Gracias por mantener tu registro de tareas al día. ¡Sigue brillando! ✨💼`,
            `🟢🟢 Hola ${userId.real_name} 👋, ¡todo en orden! Gracias por mantener tus tareas al día. 😊📋`,
            `🟢🟢 Hola ${userId.real_name} 👋, ¡lo estás haciendo genial! Gracias por mantener tus tareas actualizadas ✨📘`,
          ];



          if (userId.user) {
            if (horas.count == 0) {

              await this._slackApiService.postMessage({ canal: userId.user, texto: `${recordatorios[indexR]}` });
              console.log(`${recordatorios[indexR]}`)
            } else {
              await this._slackApiService.postMessage({ canal: userId.user, texto: `${felicitaciones[indexR]}` });
              console.log(`${felicitaciones[indexR]}`)
            }
          }
          await this.delay(1000); //1s rate-limit
        } catch (error) {
        }
      }

      return listCanalCuenca;

    } catch (error) {
      console.log(error)
    }
  }
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async postMessageBack() {
    setImmediate(() => {
      this.postMessageByUser()
        .then(() => console.log('Proceso terminado'))
        .catch(err => console.error('Error en proceso', err));
    });

    return {
      status: 'ok',
      message: 'Proceso ejecutándose en background'
    };

  }


  async getUsuarioByNombre(nombre: string) {
    try {
      const listaUsuarios = await this._apiConsultoriaGService.getUsuariosListadoCompleto();

      const usuarios = listaUsuarios.Dato.filter(r => {
        const nombre_apellido = normalizar(r.nombre_apellido);
        return nombre_apellido.includes(normalizar(nombre))
      });
      const listUsersByNombre: UsuarioByNombreDto[] = [];
      usuarios.map(e => {
        listUsersByNombre.push({
          id_usuario: e.id_usuario,
          nombre_apellido: e.nombre_apellido,
          mail: e.mail,
          activo: e.activo
        })
      })
      return listUsersByNombre;

    } catch (error) {
      throw new HttpException(
        error.message ? error.message : "Error en getUsuarioByNombre",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async getProyectosByNombre(nombre: string) {
    try {
      const listaProyectos = await this._apiConsultoriaGService.getCatalogoProyectos();

      const usuarios = listaProyectos.Dato.filter(r => {
        const nombreProyecto = normalizar(r.proyecto);
        return nombreProyecto.includes(normalizar(nombre))
      });
      const listProyectoByNombre: ProyectoByNombreDto[] = [];
      usuarios.map(e => {
        listProyectoByNombre.push({
          id_proyecto: e.id_proyecto,
          nombre: e.proyecto,
          mail: e.mail,
          area: e.area
        })
      })
      return listProyectoByNombre;

    } catch (error) {
      throw new HttpException(`Error en getProyectosByNombre: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

}
