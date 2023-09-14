/**
 * 所支持的浏览器类型
 */
export type Browser = {
  ie?: string
  firefox?: string
  safari?: string
  opera?: string
  chrome?: string
  edge?: string
  kongq?: string
}
/**
 * 当前年代所支持的浏览器引擎（InternetExplorer， Chrome/Safari，Firefox，Konqueror
 */
export type BrowserEngine = {
  ie?: string
  webkit?: string
  gecko?: string
  khtml?: string
}
export type OS = {
  win?: string
  mac?: string
  x11?: string
}
export type Device = {
  // 台式机
  pc?: string
  // wii 游戏机
  wii?: string
  // ps 游戏机
  ps?: string
}
export type MobileDevice = {
  iphone?: string
  ipad?: string
  nokia?: string
  winphone?: string
  android?: string
}
export type BrowserType = keyof Browser
export type BrowserEngineType = keyof BrowserEngine
export type OSType = keyof OS

/**
 * 浏览器信息
 */
export type BrowserInfo = {
  type: BrowserType
}
import pkg from '../package.json'
// import { createRequire } from 'module' // Bring in the ability to create the 'require' method
// const require = createRequire(import.meta.url) // construct the require method
// const pkg = require('../package.json') // use the require method
console.log('pkg', pkg)
import os from 'os'
console.log('os', os)
/**
 * 通过浏览器检测系统环境信息
 */
class BrowserDetector {
  static _instance: BrowserDetector
  private _navigator: any
  private _browserType: BrowserType = 'ie'
  private _browser: Browser = {}
  private _browserVersion: string = ''
  private _browserEngine: BrowserEngine = {}
  private _browserEngineVersion: string = ''
  /**
   * 操作系统
   */
  private _os: OS = {}
  /** 是否为移动端设备 */
  private _isMobile: boolean = false
  private _mobile: MobileDevice = {}
  private _device: Device = {}

  constructor(navigator: any) {
    this._navigator = navigator
    this._check()
  }

  static getInstance(navigator?: unknown) {
    if (typeof navigator == 'undefined') {
      if (globalThis.navigator) {
        navigator = globalThis.navigator
      }
    }
    if (!BrowserDetector._instance) {
      BrowserDetector._instance = new BrowserDetector(navigator)
    }
    return BrowserDetector._instance
  }

  private _check() {
    const ua = this._navigator?.userAgent ?? ''
    console.log(ua)
    if (/AppleWebKit\/(\S+)/.test(ua)) {
      this._browserEngineVersion = RegExp['$1']
      this._browserEngine.webkit = this._browserEngineVersion
      //it's Chrome or Safari or opera or edge
      if (/OPR\/(\S+)/.test(ua)) {
        this._browserVersion = RegExp['$1']
        this._browser.opera = this._browserVersion
      } else if (/Edge\/(\S+)/.test(ua)) {
        this._browserVersion = RegExp['$1']
        this._browser.edge = this._browserVersion
      } else if (/Chrome\/(\S+)/.test(ua)) {
        this._browserVersion = RegExp['$1']
        this._browser.chrome = this._browserVersion
      } else if (/Version\/(\S+)/.test(ua)) {
        this._browserVersion = RegExp['$1']
        this._browser.safari = this._browserVersion
      } else {
        //approximate version
        var safariVersion = 1
        let webkitVersion = parseFloat(this._browserEngine.webkit ?? '')
        if (webkitVersion < 100) {
          safariVersion = 1
        } else if (webkitVersion < 312) {
          safariVersion = 1.2
        } else if (webkitVersion < 412) {
          safariVersion = 1.3
        } else {
          safariVersion = 2
        }
        this._browserVersion = safariVersion + ''
        this._browser.safari = this._browserVersion
      }
    } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
      this._browserEngineVersion = this._browserVersion = RegExp['$1']
      this._browserEngine.khtml = this._browser.kongq =
        this._browserEngineVersion
    } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
      this._browserEngineVersion = RegExp['$S1']
      this._browserEngine.gecko = this._browserEngineVersion

      //determine if it's Firefox
      if (/Firefox\/(\S+)/.test(ua)) {
        this._browserVersion = RegExp['$1']
        this._browser.firefox = this._browserVersion
      }
    } else if (/MSIE ([^;]+)/.test(ua)) {
      this._browserEngineVersion = this._browserVersion = RegExp['$1']
      this._browserEngine.ie = this._browser.ie = this._browserEngineVersion
    }
    // PC端标识
    const platform = this._navigator.platform
    const isWin = platform.indexOf('Win') == 0
    const isMac = platform.indexOf('Mac') == 0
    const isX11 = platform.indexOf('X11') == 0 || platform.indexOf('Linux') == 0
    // 移动端标识
    const iphone = ua.indexOf('iPhone') > -1
    const ipod = ua.indexOf('iPod') > -1
    const ipad = ua.indexOf('iPad') > -1
    const nokiaN = ua.indexOf('NokiaN') > -1

    if (isWin) {
      if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
        if (RegExp['$1'] == 'NT') {
          switch (RegExp['$2']) {
            case '5.0':
              this._os.win = '2000'
              break
            case '5.1':
              this._os.win = 'XP'
              break
            case '6.0':
              this._os.win = 'Vista'
              break
            case '6.1':
              this._os.win = '7'
              break
            default:
              this._os.win = 'NT'
              break
          }
        } else if (RegExp['$1'] == '9x') {
          this._os.win = 'ME'
        } else {
          this._os.win = RegExp['$1']
        }
      }
    }
    // win mobile
    if (this._os.win == 'CE') {
      this._isMobile = true
      this._mobile.winphone = this._os.win
    } else if (this._os.win == 'Ph') {
      if (/Windows Phone OS (\d+.\d+)/.test(ua)) {
        this._isMobile = true
        this._mobile.winphone = RegExp['$1']
      }
    }

    // iOS mobile
    if (isMac) {
      if (ua.indexOf('Mobile') > -1) {
        this._isMobile = true
        if (/CPU (?:iPhone )?OS (\d+_\d+(_\d+)?)/.test(ua)) {
          this._mobile.iphone = RegExp.$1.replace(/_/g, '.')
        } else if (/CPU (?:iPad )?OS (\d+_\d+)/.test(ua)) {
          this._mobile.iphone = RegExp.$1.replace(/_/g, '.')
        } else {
          this._mobile.iphone = 'unknow os'
        }
      }
    }
    // Android mobile
    if (/Android (\d+\.\d+)/.test(ua)) {
      this._isMobile = true
      this._mobile.android = RegExp.$1
    }
    //gaming systems
    if (ua.indexOf('Wii') >= 1) {
      this._device.wii = 'wii'
    }
    if (/playstation/i.test(ua)) {
      this._device.ps = 'ps'
    }
  }
  get navigator() {
    return this._navigator
  }

  get browserType(): BrowserType {
    return this._browserType
  }
  get browser() {
    return this._browser
  }
  get browserEngine() {
    return this._browserEngine
  }
  get device() {
    return this._device
  }
  get mobile() {
    return this._mobile
  }
  get isMobile() {
    return this._isMobile
  }
  /**
   * 获取所有信息
   */
  get infomation() {
    return {
      browser: this.browser,
      mobile: this.mobile,
      device: this.device,
      browserEngine: this.browserEngine,
    }
  }
}

class NodeDetector {
  static _instance: NodeDetector
  constructor(str: any) {
    this._check()
  }
  private _check() {}
  static getInstance(navigator?: unknown) {
    if (typeof navigator == 'undefined') {
      if (globalThis.navigator) {
        navigator = globalThis.navigator
      }
    }
    if (!NodeDetector._instance) {
      NodeDetector._instance = new NodeDetector(navigator)
    }
    return NodeDetector._instance
  }

  get infomation() {
    return {
      browser: '',
      mobile: '',
      device: '',
      browserEngine: '',
    }
  }
}

class Environment {
  public static version = pkg.version
  private static _platform: 'node' | 'deno' | 'browser' | '' = ''
  /**
   * 当前JS运行的平台
   */
  static get platform(): 'node' | 'deno' | 'browser' {
    let _pl = Environment._platform
    if (!_pl) {
      const context = globalThis
      console.log('context', context)
      _pl = 'browser'
      if (context.process && context.process.title === 'node') {
        _pl = 'node'
      } else {
        if (
          typeof context.Deno != 'undefined' &&
          typeof context.Deno.version != 'undefined'
        ) {
          _pl = 'deno'
        }
      }
    }
    console.log('pl===', _pl)
    Environment._platform = _pl
    return Environment._platform
  }
  static get infomation() {
    const context = globalThis
    let info = { browser: {}, browserEngine: {} }
    switch (Environment.platform) {
      case 'browser':
        info = BrowserDetector.getInstance().infomation
        break
      case 'node':
        info = NodeDetector.getInstance().infomation
        break
    }
    return info
  }
  static get browser() {
    return this.infomation.browser
  }

  static get browserEngine() {
    return this.infomation.browserEngine
  }
}
console.log(`version:${Environment.version}`)
export default Environment
