HEADER_START = """<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="{desc}" />
    <meta name="color-scheme" content="light dark" />
    <title>{title}｜游戏开发者讲座档案</title>
    <link rel="stylesheet" href="../assets/styles.css" />
  </head>
  <body>
    <header class="site-header">
      <a class="brand" href="../index.html" aria-label="返回档案首页">
        <span class="brand-mark" aria-hidden="true">
          <span></span><span></span><span></span>
        </span>
        <span>
          <strong>游戏开发者讲座档案</strong>
          <small>Game Developer Talk Archive</small>
        </span>
      </a>
      <nav class="header-actions" aria-label="页面工具">
        <a class="text-link" href="#sources">来源</a>
        <button class="icon-button" id="theme-toggle" type="button" aria-label="切换深色模式">
          <svg class="sun-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"></path>
          </svg>
          <svg class="moon-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"></path>
          </svg>
        </button>
      </nav>
    </header>
    <main class="report-main">
      <header class="report-hero">
        <nav class="breadcrumb" aria-label="面包屑导航">
          <a href="../index.html">档案首页</a>
          <span>/</span>
          <span>《蔚蓝档案》专题</span>
          <span>/</span>
          <span>完整报告</span>
        </nav>
        <p class="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p class="report-deck">{deck}</p>
        <div class="report-meta">
          {meta}
        </div>
      </header>
      <div class="report-layout">
        <aside class="report-toc" aria-label="文章目录">
          <strong>目录</strong>
          <ol>
            {toc}
          </ol>
        </aside>
        <article class="report-content">
"""

FOOTER = """
        </article>
      </div>
    </main>
    <footer class="site-footer">
      <p>游戏开发者讲座档案 · 报告编号 {num}</p>
      <a href="../index.html">返回档案首页 →</a>
    </footer>
    <script src="../assets/app.js"></script>
  </body>
</html>
"""


def meta(*items):
    return "".join(f"<span>{x}</span>" for x in items)


def toc(items):
    return "".join(f'<li><a href="#{k}">{v}</a></li>' for k, v in items)


def write(path, **kwargs):
    html = HEADER_START.format(**kwargs) + kwargs["body"] + FOOTER.format(**kwargs)
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    print("wrote", path)
