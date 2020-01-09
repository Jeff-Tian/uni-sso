import { trustedHosts } from './main';
import R from 'ramda';

describe('trusted hosts', () => {
  it('trusts', () => {
    expect(
      R.any((reg: RegExp) => reg.test('https://sso.jiwai.win/auth/login'))(
        trustedHosts,
      ),
    ).toBeTruthy();
  });
});
