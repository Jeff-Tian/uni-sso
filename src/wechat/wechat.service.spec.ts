import { literal, QR_SCAN_STATUS, WechatService } from './wechat.service';
import MemoryStorage from '@jeff-tian/memory-storage/src/MemoryStorage';

describe('wechat.service', () => {
  it('literals', () => {
    expect(literal(QR_SCAN_STATUS.ERROR.toString())).toEqual('ERROR');
  });

  it('timeouts', async () => {
    const wechatService = new WechatService(
      {} as any,
      {} as any,
      new MemoryStorage(),
    );

    await expect(
      wechatService.getQRScanStatus('1234', 1000),
    ).rejects.toThrowError('timeout');
  });
});
