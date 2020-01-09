import R from 'ramda';
import { trustedHosts } from './trusted-hosts';

describe('trusted hosts', () => {
  it('trusts', () => {
    expect(
      R.any((reg: RegExp) => reg.test('https://sso.jiwai.win/auth/login'))(
        trustedHosts,
      ),
    ).toBeTruthy();
  });
});
