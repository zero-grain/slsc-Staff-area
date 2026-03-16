// 單一資料來源：
// 新增專區、修改側欄、更新連結時，優先調整這份檔案即可。
(function () {
  const nav = [
    { id: "index", href: "index.html", label: "首頁", note: "常用入口" },
    { id: "staff_area", href: "staff_area.html", label: "總覽表", note: "全部資源彙整" },
    { id: "gp01", href: "gp01.html", label: "職務代理表", note: "行管處職務" },
    { id: "gp02", href: "gp02.html", label: "總務專區", note: "採購與修繕" },
    { id: "gp04", href: "gp04.html", label: "人資專區", note: "制度與保險" },
    { id: "gp05", href: "gp05.html", label: "職災給付流程", note: "申請表單" },
    { id: "gp06", href: "gp06.html", label: "財務專區", note: "建置中" },
    { id: "gp07", href: "gp07.html", label: "公文系統", note: "登入與教學" },
    { id: "gp08", href: "gp08.html", label: "教育訓練", note: "課程與積分" },
    { id: "gp09", href: "gp09.html", label: "新人訓練", note: "新人必看" },
    { id: "gp10", href: "gp10.html", label: "權益制度", note: "相關制度" },
    { id: "gp11", href: "gp11.html", label: "官網更新", note: "申請與教學" },
    { id: "gp12", href: "gp12.html", label: "文件共享", note: "共用資料夾" },
    { id: "gp13", href: "gp13.html", label: "處行政專區", note: "備檔與彙整" },
    { id: "gp14", href: "gp14.html", label: "督導專區", note: "建置中" }
  ];

  const jobTableHtml = `
    <div class="data-table-wrap">
      <table class="data-table">
        <caption>行管處職務、代理一覽表</caption>
        <tbody>
          <tr>
            <th>處室</th>
            <th>成員職稱</th>
            <th>主責職務</th>
            <th>職務代理人</th>
          </tr>
          <tr><td rowspan="11">人資室</td><td>陳處長</td><td>人資室各項業務督責</td><td></td></tr>
          <tr><td rowspan="3">邱先生</td><td>工作規則、法令諮詢、勞動檢查諮詢</td><td rowspan="3">高小姐</td></tr>
          <tr><td>人事行政：團屋、專區、居家</td></tr>
          <tr><td>職業安全衛生</td></tr>
          <tr><td rowspan="2">曹小姐</td><td>一等一假勤、104 系統計薪作業</td><td rowspan="2">高小姐</td></tr>
          <tr><td>人事行政：非團屋專區居家單位</td></tr>
          <tr><td rowspan="5">高小姐</td><td>人事行政：團屋、專區、居家</td><td rowspan="2">邱先生</td></tr>
          <tr><td>在職證明、離職證明</td></tr>
          <tr><td>育嬰留停作業</td><td rowspan="3">曹小姐</td></tr>
          <tr><td>職災保險申請</td></tr>
          <tr><td>缺工獎勵、安穩僱用</td></tr>
          <tr><td rowspan="7">總務室、空間規劃與新設專案</td><td rowspan="7">鍾小姐</td><td>全會財產管理</td><td rowspan="7">周泰興</td></tr>
          <tr><td>採購核決及指派、維修核決指派</td></tr>
          <tr><td>一般採購、文件管理（各項契約）</td></tr>
          <tr><td>統一採購（服務）</td></tr>
          <tr><td>專案採購（新設專案、制服申請分發）</td></tr>
          <tr><td>統一採購（物品）、物資運送</td></tr>
          <tr><td>既有服務空間暨新設專案空間之規劃與工程採購</td></tr>
          <tr><td rowspan="5">資訊相關業務</td><td rowspan="5">周泰興</td><td>各處公文分、收、發及問題排解</td><td rowspan="5"></td></tr>
          <tr><td>標準化文件及契約電子歸檔至一等一檔案系統</td></tr>
          <tr><td>資訊設備維護與採購</td></tr>
          <tr><td>全會官網維護</td></tr>
          <tr><td>資訊相關問題排解</td></tr>
          <tr><td rowspan="4">會務</td><td rowspan="4">陳先生</td><td>財團法人士林靈糧堂</td><td rowspan="4"></td></tr>
          <tr><td>社團法人士林靈糧堂協會</td></tr>
          <tr><td>財團法人新竹市社福基金會</td></tr>
          <tr><td>設立資料保管、例行大會辦理、行政會務執行</td></tr>
          <tr><td rowspan="2">公關室</td><td rowspan="2">陳先生</td><td>團體參訪、邀請授課、媒體通告</td><td rowspan="2"></td></tr>
          <tr><td>捐款服務、實物捐贈、資源募集、企業合作、公益勸募</td></tr>
          <tr><td>新竹市香山來居園社會福利園區</td><td>陳先生</td><td>專案管理、興建規劃、興辦計畫、籌設計畫、資源募集、主管機關及關鍵資源協調窗口。</td><td></td></tr>
        </tbody>
      </table>
    </div>
  `;

  const pages = {
    index: {
      type: "home",
      title: "員工專區",
      subtitle: "整合內部常用入口、作業說明與資源頁面，讓總務、人資、訓練與文件可以從同一個地方快速進入。",
      intro: "側欄與資源清單都由同一份資料控制。之後新增專區或新增連結，不需要再逐頁補上所有 navigation link。",
      actions: [
        { label: "查看總覽表", href: "staff_area.html", primary: true },
        { label: "查看職務代理表", href: "gp01.html" }
      ],
      featured: ["gp02", "gp04", "gp05", "gp07", "gp08", "gp09", "gp11", "gp12"]
    },
    staff_area: {
      type: "overview",
      title: "員工專區總覽",
      subtitle: "這頁會自動彙整各專區的連結、補充說明與常見問題。內容來自同一份設定資料，可直接作為維護總表。",
      intro: "若新增一個專區或一個資源，只要更新 site-data.js，側欄與這張總表會一起更新。",
      actions: [
        { label: "回首頁", href: "index.html", primary: true },
        { label: "查看職務代理表", href: "gp01.html" }
      ],
      extraHtml: jobTableHtml
    },
    gp01: {
      type: "html",
      title: "行管處職務、代理一覽表",
      subtitle: "整理各處室成員主責職務與代理資訊，便於遇到請假、交接與窗口查詢時快速確認。",
      intro: "如有異動，建議同步更新這份表格內容與對應管理資料。",
      html: jobTableHtml
    },
    gp02: {
      type: "links",
      title: "總務相關專區",
      subtitle: "採購、修繕、物資與總務常用入口。",
      intro: "總務常用資源整理如下。",
      links: [
        { title: "一般採購", href: "http://118.163.5.133:3080/UOF/", tag: "系統" },
        { title: "大宗採購", href: "https://drive.google.com/drive/folders/1F97IAlVtUCHcZPdInMGsSiHBOjNo9qul", tag: "雲端資料夾" },
        { title: "修繕申請", href: "http://210.63.206.187/UOF/", tag: "系統" },
        { title: "物品交流平台", href: "https://drive.google.com/drive/folders/1vsgCqkpCRODnOAE7mJoGlf7whRIBTasX", tag: "共享資源" },
        { title: "廠商資訊參考", href: "https://drive.google.com/drive/folders/1M6LHPYhpYQa3jtVhMFqb7_uIPJcBQAv2", tag: "參考資料" },
        { title: "協會通訊錄", href: "https://docs.google.com/spreadsheets/d/1cGgXPo1-hxjPLmd8JxkNnai28EzzQ1u_9hzdSE7R2HU/edit?gid=840472620#gid=840472620", tag: "試算表" },
        { title: "總倉短袖制服庫存紀錄表", href: "https://docs.google.com/spreadsheets/d/1hiEUULCzyiHv1oJNZtRBGywziqQ8zXbJ/edit#gid=639614196", tag: "試算表" }
      ],
      faq: [
        { title: "總務常見問題", href: "https://slsc.org.tw/%E7%B8%BD%E5%8B%99%E5%B8%B8%E8%A6%8B%E5%95%8F%E9%A1%8C/" }
      ]
    },
    gp03: {
      type: "links",
      title: "處行政業務專區",
      subtitle: "行政業務相關的內部資料入口。",
      intro: "內容較少時，仍沿用同一套卡片版型，方便後續擴充。",
      links: [
        { title: "處行政業務專區", href: "https://drive.google.com/drive/folders/1IR2kZHWp78AEM_DLwyDOLd5k5W-uIEVk", tag: "雲端資料夾" }
      ]
    },
    gp04: {
      type: "links",
      title: "人資相關專區",
      subtitle: "人資系統、保險與相關作業說明。",
      intro: "人資常用系統與制度文件。",
      links: [
        { title: "104 人資系統", href: "http://118.163.5.133:2080/ehrms/", tag: "系統" },
        { title: "114 年度團體保險內容摘要說明", href: "https://drive.google.com/file/d/1zXDLB-dIVRNrJtyutyCCNjI-JEESLSlk/view", tag: "PDF / 雲端" },
        { title: "解憂信箱使用方法", href: "https://slsc.org.tw/wp-content/uploads/2023/04/%E8%A7%A3%E6%86%82%E4%BF%A1%E7%AE%B1%E4%BD%BF%E7%94%A8%E6%96%B9%E5%BC%8F0201.pdf", tag: "PDF" },
        { title: "113 年度長照機構專業責任保險內容說明", href: "https://drive.google.com/file/d/1xZuCPuXPOugSvBMT4s8G5VWmDZfI2TTD/view?usp=drive_link", tag: "說明文件" }
      ]
    },
    gp05: {
      type: "links",
      title: "申請職災醫療給付流程",
      subtitle: "職災醫療與工資補償相關表單。",
      intro: "申請前可先參考下方補充說明。",
      links: [
        { title: "職業災害醫療給付門診住院醫療費用補償", href: "https://drive.google.com/drive/folders/1jItRaVUL8UE_kw7zpGtMHKC2FTfEoi9a", tag: "圖片" },
        { title: "普統-職災傷病給付無法工作期間工資補償", href: "https://slsc.org.tw/wp-content/uploads/2023/05/%E6%99%AE%E9%80%9A-%E8%81%B7%E7%81%BD%E5%82%B7%E7%97%85%E7%B5%A6%E4%BB%98%E7%84%A1%E6%B3%95%E5%B7%A5%E4%BD%9C%E6%9C%9F%E9%96%93%E5%B7%A5%E8%B3%87%E8%A3%9C%E5%84%9F.xlsx", tag: "Excel" }
      ],
      notes: [
        "一等一雲端辦公室內的請假與人資系統資料，常會與職災申請流程交互使用。",
        "建議申請前先確認表單版本是否為最新，並與人資窗口核對。"
      ]
    },
    gp06: {
      type: "links",
      title: "財務相關專區",
      subtitle: "目前尚未放入具體連結，可直接在資料檔補上。",
      intro: "這頁已先保留版型，之後加上資料即可自動顯示。",
      links: []
    },
    gp07: {
      type: "links",
      title: "公文系統相關專區",
      subtitle: "公文系統登入與操作教學。",
      intro: "常用入口如下。",
      links: [
        { title: "公文系統", href: "https://member.gsscloud.com/cas/login?service=https%3A%2F%2Fod.vitalyun.com%2Fsignin-cas%3Fstate%3DBLP8RYBTpjMS2R4KKJy46qjAJJw8iNyjELGP_ntGaclPumfBSN7q38jIH69vh-BWfn72SnLmngAva8pf7FgUFEA87wf2APc0DC8KToExyVGa2uuWy10OJV3ADnqAc1RSGk-Viiq2d7_nzS6PFp4OrMNa1Mlg-6X5ExDu6N7aCBV-Npn5csy4Yyq0IyTstSVZKQXrNSKkI5YutSQaiDE2nA", tag: "系統" },
        { title: "公文系統教學說明", href: "https://zero-grain.github.io/static-site", tag: "教學" }
      ]
    },
    gp08: {
      type: "links",
      title: "教育訓練相關專區",
      subtitle: "課程公告、積分查詢與歷年訓練資料。",
      intro: "教育訓練相關入口如下。",
      links: [
        { title: "教育訓練公佈欄", href: "https://sites.google.com/slsc.org.tw/training/%E9%A6%96%E9%A0%81", tag: "網站" },
        { title: "衛福部長照積分查詢網", href: "https://ltcpap.mohw.gov.tw/molc/eg999/index", tag: "查詢" },
        { title: "歷年年度教育訓練相關資料（陸續建置中）", href: "https://drive.google.com/drive/folders/1_Oc2wTfu-BpL57bgfbb7YZYoB7EsM6xw?usp=sharing", tag: "資料夾" }
      ]
    },
    gp09: {
      type: "links",
      title: "新人訓練相關專區",
      subtitle: "新人教育訓練與 UOF 入門說明。",
      intro: "新人報到後常用的教學資源。",
      links: [
        { title: "新人教育訓練 classroom 簡易操作", href: "https://drive.google.com/file/d/16C26HCb1ExJmPMQqizc-0dDQG9dHWTaq/view?usp=sharing", tag: "教學" },
        { title: "一等一 UOF 系統登入說明", href: "https://drive.google.com/file/d/1DJfo4t5-OpJiWFy2Sd47yZNQoyKerYop/view?usp=drive_link", tag: "教學" },
        { title: "一等一 UOF 請假、加班操作說明", href: "https://drive.google.com/file/d/1-rhZ7e8057xCQrPzf_HLd5Axye8zS0FH/view?usp=drive_link", tag: "教學" }
      ]
    },
    gp10: {
      type: "links",
      title: "訂定工作人員權益相關制度",
      subtitle: "評鑑與行管相關制度文件。",
      intro: "制度與文件管理資源。",
      links: [
        { title: "評鑑行管相關資料於文件管理", href: "https://www.slsc.org.tw/wp-content/uploads/2023/07/%E8%A9%95%E9%91%91%E8%A1%8C%E7%AE%A1%E7%9B%B8%E9%97%9C%E8%B3%87%E6%96%9920230713.pdf", tag: "PDF" }
      ]
    },
    gp11: {
      type: "links",
      title: "官網更新相關申請",
      subtitle: "官網更新申請入口與教學影片。",
      intro: "如需更新官網內容，可先看教學再送件。",
      links: [
        { title: "官網更新相關申請", href: "http://118.163.5.133:3080/UOF", tag: "系統" },
        { title: "官網更新相關申請教學影片", href: "https://www.youtube.com/watch?v=aPfNuwuOP_Y", tag: "影片" }
      ]
    },
    gp12: {
      type: "links",
      title: "文件共享區",
      subtitle: "會議紀錄與共享資料。",
      intro: "共用文件入口。",
      links: [
        { title: "主管會議記錄", href: "https://drive.google.com/drive/folders/0AK69YpViU9BvUk9PVA", tag: "資料夾" }
      ]
    },
    gp13: {
      type: "links",
      title: "處行政整合專區",
      subtitle: "整合原 gp03 與 gp13 的行政業務、備檔與跨專區資料。",
      intro: "後續處行政相關內容請統一維護在這一頁。",
      links: [
        { title: "處行政-行管處備檔總表", href: "https://docs.google.com/spreadsheets/d/1XIaU0YqRbV4aVEvbhMHn-Dnp5QCVzOhGCOOvRbbxJbo/edit?gid=1912351746#gid=1912351746", tag: "試算表" },
        { title: "處行政業務專區", href: "https://drive.google.com/drive/folders/1IR2kZHWp78AEM_DLwyDOLd5k5W-uIEVk", tag: "資料夾" },
        { title: "教育訓練業務", href: "https://drive.google.com/drive/folders/1rEt5v-K68-GL1gDz1F03GdOub8Jqyfld?usp=sharing", tag: "資料夾" }
      ]
    },
    gp14: {
      type: "links",
      title: "督導專區",
      subtitle: "目前保留為後續新增內容使用。",
      intro: "之後只要在資料檔加入 links，就會自動顯示。",
      links: []
    }
  };

  window.SITE_DATA = { nav, pages };
})();
