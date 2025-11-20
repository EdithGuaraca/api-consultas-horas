import { GetConsultaParams } from "src/modules/consulta-api-cg/dto/consulta-api.dto";


export class GetUserInfo {

  userId: string;

}

export class EnviarExcel extends GetConsultaParams {
  user: string;
  thread: string;
}

export class PostMessageDto {
  canal: string;
  texto: string;

}

export class ConversationOpenDto {
  users: string;
}

export class LookupByEmailDto {
  email: string;
}



export class ConversationMembersDto {
  channel: string;
}
