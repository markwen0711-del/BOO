import Cocoa
import WebKit

class AppDelegate: NSObject, NSApplicationDelegate {
    var window: NSWindow!
    var webView: WKWebView!

    func applicationDidFinishLaunching(_ aNotification: Notification) {
        // 設定視窗與大小，讓它置中
        let scn = NSScreen.main?.frame ?? NSRect(x: 0, y: 0, width: 800, height: 600)
        let winSize = NSSize(width: 900, height: 700)
        let rect = NSRect(
            x: scn.width/2 - winSize.width/2,
            y: scn.height/2 - winSize.height/2,
            width: winSize.width,
            height: winSize.height
        )

        // 建立 Mac 原生視窗，隱藏原生標題列的空間，讓它看起來更美觀
        window = NSWindow(contentRect: rect,
                          styleMask: [.titled, .closable, .miniaturizable, .resizable],
                          backing: .buffered,
                          defer: false)
        window.title = "彩色氣球派對 🎈"
        window.makeKeyAndOrderFront(nil)

        // 設定瀏覽器核心，允許存取本地資料夾的 HTML JS CSS 檔案
        let config = WKWebViewConfiguration()
        config.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
        
        webView = WKWebView(frame: window.contentView!.bounds, configuration: config)
        webView.autoresizingMask = [.width, .height]
        window.contentView?.addSubview(webView)

        // 找到 App 內的首頁 index.html 並讀取
        if let path = Bundle.main.path(forResource: "index", ofType: "html") {
            let url = URL(fileURLWithPath: path)
            webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
        } else {
            print("找不到遊戲網頁檔案！")
        }
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }
}

// 啟動 App
let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.run()
