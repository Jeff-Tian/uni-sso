import nock from 'nock';

const scope = nock('https://api.weixin.qq.com');

export default class WechatNocked {
  static nockGetClientAccessToken(fakeToken: string) {
    scope
      .get(
        /\/cgi\-bin\/token\?grant_type=client_credential&appid=[\w\d]+&secret=[\w\d]+/,
      )
      .reply(200, {
        access_token: fakeToken,
      });
  }

  static nockCreateTempQRTicket(fakeTicket: string) {
    scope
      .post('/cgi-bin/qrcode/create?access_token=fake_token', {
        expire_seconds: 60,
        action_name: 'QR_STR_SCENE',
        action_info: { scene: { scene_str: /[\w\d\-]+/ } },
      })
      .reply(200, {
        ticket: fakeTicket,
        expire_seconds: 60,
        url: 'http://weixin.qq.com/q/024vfekHorfk31RDT21ucR',
      });
  }
}
