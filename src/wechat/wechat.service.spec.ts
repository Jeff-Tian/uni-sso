import { literal, QR_SCAN_STATUS, WechatService } from './wechat.service';
import MemoryStorage from '@jeff-tian/memory-storage/src/MemoryStorage';
import QrScanStatus from './QrScanStatus';

describe('wechat.service', () => {
  it('literals', () => {
    expect(literal(QR_SCAN_STATUS.TIMEOUT.toString())).toEqual('TIMEOUT');
  });

  it('timeouts', async () => {
    const wechatService = new WechatService(
      {} as any,
      {} as any,
      new MemoryStorage(),
      new QrScanStatus(),
    );

    await expect(
      wechatService.getQRScanStatus('1234', 1000),
    ).rejects.toThrowError('timeout');
  });
});
