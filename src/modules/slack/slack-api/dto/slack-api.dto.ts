import { GetConsultaParams } from "src/modules/consulta-api/dto/consulta-api.dto";


export class GetUserInfo {

  userId: string;

}

export class EnviarExcel extends GetConsultaParams {
  user: string;
}