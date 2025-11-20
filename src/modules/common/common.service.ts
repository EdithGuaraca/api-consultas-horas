import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RequestApiDto } from './dto/common.dto';


@Injectable()
export class CommonService {
  constructor(private readonly httpService: HttpService) { }

  async requestApi(gParams: RequestApiDto) {
    try {
      const params = gParams.params;

      const info: any = await this.httpService.axiosRef
        .get(gParams.url, {
          params,
          timeout: 15000,
        })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(
            err?.message + ": " + JSON.stringify(err?.response?.data)
          );
        });
      return info;
    } catch (error) {
      console.log(`Error en requestApi ${gParams.nombreServicio}: `, error);
      throw new HttpException(
        `Error en requestApi ${gParams.nombreServicio} ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }


}
