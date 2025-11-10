import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, Res } from '@nestjs/common';
import { SlackApiService } from './slack-api.service';
import { GetUserInfo } from './dto/slack-api.dto';
import { Response } from 'express';


@Controller('slack-api')
export class SlackApiController {
  constructor(private readonly _slackApiService: SlackApiService) { }

  @Get('/getUserInfo')
  async desencriptar(@Query() params: GetUserInfo) {
    return this._slackApiService.getUserInfo(params)
  }

  @Get('/getUserInfo2')
  async desencriptar2(@Query() params: GetUserInfo) {
    return this._slackApiService.sendMessage();
  }


  @Get('/sendBotones')
  async sendBotones() {
    return this._slackApiService.sendMessageWithButtons();
  }
  @Post()
  async handleInteraction(@Body() body: any, @Res() res: Response) {
    try {
      const payload = JSON.parse(body.payload);

      // ✅ Responder inmediatamente con 200 OK a Slack
      res.status(HttpStatus.OK).send();

      // Procesar en segundo plano
      await this._slackApiService.processInteraction(payload);
    } catch (error) {
      console.error('❌ Error en SlackInteractionsController:', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ ok: false, message: error.message });
    }
  }



}
