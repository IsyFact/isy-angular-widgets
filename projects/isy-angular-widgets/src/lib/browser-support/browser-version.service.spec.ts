import {TestBed} from '@angular/core/testing';
import {BrowserVersionService, SupportedBrowser} from './browser-version.service';

interface BrowserVersionServiceTestAccess {
  isVersionLowerThan(currentVersion: string, minimumVersion: string): boolean;
}

describe('Unit tests: BrowserVersionService', () => {
  let service: BrowserVersionService;

  const getSupportedBrowser = (label: string): SupportedBrowser => {
    const result = service.checkUserAgent('UnknownBrowser/1.0');
    const supportedBrowser = result.supportedBrowsers.find((browser) => browser.label === label);

    if (!supportedBrowser) {
      throw new Error(`Supported browser "${label}" was not found.`);
    }

    return supportedBrowser;
  };

  const getServiceAccess = (): BrowserVersionServiceTestAccess => service as unknown as BrowserVersionServiceTestAccess;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrowserVersionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return supported when navigator is not available', () => {
    const navigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');

    try {
      Object.defineProperty(globalThis, 'navigator', {
        configurable: true,
        value: undefined
      });

      const result = service.checkCurrentBrowser();

      expect(result.supported).toBeTrue();
      expect(result.detectedBrowser).toBeUndefined();
      expect(result.supportedBrowsers.length).toBeGreaterThan(0);
    } finally {
      if (navigatorDescriptor) {
        Object.defineProperty(globalThis, 'navigator', navigatorDescriptor);
      }
    }
  });

  it('should detect Chrome as unsupported when the version is too old', () => {
    const result = service.checkUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' + 'Chrome/1.0 Safari/537.36'
    );

    expect(result.supported).toBeFalse();
    expect(result.detectedBrowser?.name).toEqual('chrome');
    expect(result.detectedBrowser?.label).toEqual('Google Chrome');
    expect(result.detectedBrowser?.version).toEqual('1.0');
  });

  it('should detect Chrome as supported when the version is equal to the configured minimum version', () => {
    const chrome = getSupportedBrowser('Google Chrome');

    const result = service.checkUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
        `Chrome/${chrome.minimumVersion}.0 Safari/537.36`
    );

    expect(result.supported).toBeTrue();
    expect(result.detectedBrowser?.name).toEqual('chrome');
    expect(result.detectedBrowser?.label).toEqual('Google Chrome');
    expect(result.minimumVersion).toEqual(chrome.minimumVersion);
  });

  it('should treat empty version parts as zero', () => {
    const chrome = getSupportedBrowser('Google Chrome');

    const result = service.checkUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' + `Chrome/${chrome.minimumVersion}. Safari/537.36`
    );

    expect(result.supported).toBeTrue();
    expect(result.detectedBrowser?.name).toEqual('chrome');
    expect(result.detectedBrowser?.version).toEqual(`${chrome.minimumVersion}.`);
  });

  it('should treat missing current version parts as zero', () => {
    const serviceAccess = getServiceAccess();

    expect(serviceAccess.isVersionLowerThan('120', '120.1')).toBeTrue();
  });

  it('should detect Edge before Chrome', () => {
    const result = service.checkUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' + 'Chrome/120.0 Safari/537.36 Edg/120.0'
    );

    expect(result.detectedBrowser?.name).toEqual('edge');
    expect(result.detectedBrowser?.label).toEqual('Microsoft Edge');
    expect(result.detectedBrowser?.version).toEqual('120.0');
  });

  it('should detect Firefox', () => {
    const result = service.checkUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0'
    );

    expect(result.detectedBrowser?.name).toEqual('firefox');
    expect(result.detectedBrowser?.label).toEqual('Mozilla Firefox');
    expect(result.detectedBrowser?.version).toEqual('120.0');
  });

  it('should detect Safari', () => {
    const result = service.checkUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 ' + 'Version/17.0 Safari/605.1.15'
    );

    expect(result.detectedBrowser?.name).toEqual('safari');
    expect(result.detectedBrowser?.label).toEqual('Apple Safari');
    expect(result.detectedBrowser?.version).toEqual('17.0');
  });

  it('should not detect Safari when the Safari version token is missing', () => {
    const result = service.checkUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15'
    );

    expect(result.supported).toBeFalse();
    expect(result.detectedBrowser).toBeUndefined();
  });

  it('should not detect Safari when the Safari token is missing', () => {
    const result = service.checkUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.0'
    );

    expect(result.supported).toBeFalse();
    expect(result.detectedBrowser).toBeUndefined();
  });

  it('should not detect Safari when the user agent is Chromium based', () => {
    const result = service.checkUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Version/17.0 Safari/537.36 OPR/100.0'
    );

    expect(result.supported).toBeFalse();
    expect(result.detectedBrowser).toBeUndefined();
  });

  it('should not detect Opera as Chrome', () => {
    const result = service.checkUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' + 'Chrome/120.0 Safari/537.36 OPR/100.0'
    );

    expect(result.supported).toBeFalse();
    expect(result.detectedBrowser).toBeUndefined();
  });

  it('should mark unknown browsers as unsupported', () => {
    const result = service.checkUserAgent('UnknownBrowser/1.0');

    expect(result.supported).toBeFalse();
    expect(result.detectedBrowser).toBeUndefined();
  });

  it('should return the list of supported browsers', () => {
    const result = service.checkUserAgent('UnknownBrowser/1.0');

    expect(result.supportedBrowsers.length).toBeGreaterThan(0);
    expect(result.supportedBrowsers).toContain(
      jasmine.objectContaining({
        label: 'Google Chrome'
      })
    );
    expect(result.supportedBrowsers).toContain(
      jasmine.objectContaining({
        label: 'Microsoft Edge'
      })
    );
    expect(result.supportedBrowsers).toContain(
      jasmine.objectContaining({
        label: 'Mozilla Firefox'
      })
    );
    expect(result.supportedBrowsers).toContain(
      jasmine.objectContaining({
        label: 'Apple Safari'
      })
    );
  });
});
