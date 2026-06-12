import {Injectable} from '@angular/core';
import browserSupportConfig from './browser-support.config.json';

type SupportedBrowserName = 'chrome' | 'edge' | 'firefox' | 'safari';

interface BrowserSupportConfig {
  angularMajor: number;
  baselineDate: string;
  source: string;
  browsers: Record<SupportedBrowserName, BrowserSupportEntry>;
}

interface BrowserSupportEntry {
  label: string;
  minimumVersion: string;
}

export interface DetectedBrowser {
  name: SupportedBrowserName;
  label: string;
  version: string;
}

export interface SupportedBrowser {
  label: string;
  minimumVersion: string;
}

export interface BrowserSupportCheckResult {
  supported: boolean;
  detectedBrowser?: DetectedBrowser;
  minimumVersion?: string;
  supportedBrowsers: SupportedBrowser[];
}

const CONFIG: BrowserSupportConfig = browserSupportConfig;
const VERSION_GROUP_INDEX = 1;

/**
 * Service for detecting and validating browser support.
 * Provides methods to check if the current browser or a given user agent
 * meets the minimum version requirements defined in the configuration.
 */
@Injectable({
  providedIn: 'root'
})
export class BrowserVersionService {
  /**
   * Checks if the current browser is supported.
   * Returns supported=true if navigator is unavailable (SSR environment).
   * @returns The browser support check result
   */
  checkCurrentBrowser(): BrowserSupportCheckResult {
    if (typeof navigator === 'undefined') {
      return {
        supported: true,
        supportedBrowsers: this.getSupportedBrowsers()
      };
    }

    return this.checkUserAgent(navigator.userAgent);
  }

  /**
   * Checks if a browser identified by the given user agent string is supported.
   * @param userAgent The user agent string to check
   * @returns The browser support check result
   */
  checkUserAgent(userAgent: string): BrowserSupportCheckResult {
    const detectedBrowser = this.detectBrowser(userAgent);
    const supportedBrowsers = this.getSupportedBrowsers();

    if (!detectedBrowser) {
      return {
        supported: false,
        supportedBrowsers
      };
    }

    const browserConfig = CONFIG.browsers[detectedBrowser.name];

    return {
      supported: !this.isVersionLowerThan(detectedBrowser.version, browserConfig.minimumVersion),
      detectedBrowser,
      minimumVersion: browserConfig.minimumVersion,
      supportedBrowsers
    };
  }

  private detectBrowser(userAgent: string): DetectedBrowser | undefined {
    const edgeMatch = /Edg\/([\d.]+)/.exec(userAgent);

    if (edgeMatch) {
      return {
        name: 'edge',
        label: CONFIG.browsers.edge.label,
        version: edgeMatch[VERSION_GROUP_INDEX]
      };
    }

    const firefoxMatch = /(?:Firefox|FxiOS)\/([\d.]+)/.exec(userAgent);

    if (firefoxMatch) {
      return {
        name: 'firefox',
        label: CONFIG.browsers.firefox.label,
        version: firefoxMatch[VERSION_GROUP_INDEX]
      };
    }

    const chromeMatch = /(?:Chrome|CriOS|Chromium)\/([\d.]+)/.exec(userAgent);

    if (chromeMatch && !userAgent.includes('OPR/')) {
      return {
        name: 'chrome',
        label: CONFIG.browsers.chrome.label,
        version: chromeMatch[VERSION_GROUP_INDEX]
      };
    }

    const safariBrowser = this.detectSafari(userAgent);

    if (safariBrowser) {
      return safariBrowser;
    }

    return undefined;
  }

  private detectSafari(userAgent: string): DetectedBrowser | undefined {
    const safariVersionMatch = /Version\/([\d.]+)/.exec(userAgent);

    if (!safariVersionMatch || !userAgent.includes('Safari/') || this.isChromiumBasedBrowser(userAgent)) {
      return undefined;
    }

    return {
      name: 'safari',
      label: CONFIG.browsers.safari.label,
      version: safariVersionMatch[VERSION_GROUP_INDEX]
    };
  }

  private isChromiumBasedBrowser(userAgent: string): boolean {
    return (
      userAgent.includes('Chrome/') ||
      userAgent.includes('CriOS/') ||
      userAgent.includes('Chromium/') ||
      userAgent.includes('Edg/') ||
      userAgent.includes('OPR/')
    );
  }

  private isVersionLowerThan(currentVersion: string, minimumVersion: string): boolean {
    const currentParts = this.toVersionParts(currentVersion);
    const minimumParts = this.toVersionParts(minimumVersion);
    const maxLength = Math.max(currentParts.length, minimumParts.length);

    for (let index = 0; index < maxLength; index++) {
      const currentPart = currentParts[index] ?? 0;
      const minimumPart = minimumParts[index] ?? 0;

      if (currentPart === minimumPart) {
        continue;
      }

      return currentPart < minimumPart;
    }

    return false;
  }

  private toVersionParts(version: string): number[] {
    return version.split('.').map((part) => {
      const parsedPart = Number.parseInt(part, 10);

      return Number.isNaN(parsedPart) ? 0 : parsedPart;
    });
  }

  private getSupportedBrowsers(): SupportedBrowser[] {
    return Object.values(CONFIG.browsers).map((browser) => ({
      label: browser.label,
      minimumVersion: browser.minimumVersion
    }));
  }
}
