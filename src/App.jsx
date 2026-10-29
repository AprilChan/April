import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Eye,
  Mail,
  Phone,
  X,
} from "lucide-react";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

let pdfjsPromise;

function loadPdfJs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;
      return pdfjs;
    });
  }
  return pdfjsPromise;
}

const publicFileUrl = (path) => {
  if (import.meta.env.DEV) return `/${path}`;

  const moduleUrl = new URL(import.meta.url);
  moduleUrl.pathname = moduleUrl.pathname.replace(/\/assets\/[^/]+$/, `/${path}`);
  return moduleUrl.href;
};

const projects = [
  {
    id: "xpert-community",
    title: "Xpert 专家社区",
    type: "专家平台 / 0→1设计",
    year: "2025—2026",
    pages: 22,
    file: publicFileUrl("pdfs/xpert-community.pdf"),
    summary:
      "汇聚全球多领域专家，整合专家入驻、认证、任务分发、作业、QA、申诉与结算等核心链路，支撑高质量训练集与评测集生产。",
    note: "专家标注平台全链路体验建设",
  },
  {
    id: "annotation-template",
    title: "标注模板体验优化",
    type: "AI 标注 / 模板体系",
    year: "2025",
    pages: 15,
    file: publicFileUrl("pdfs/annotation-template.pdf"),
    summary:
      "重构 Seed 大模型标注模板体验，抽象任务导航、作答与反馈关系，提升标注动线清晰度、训练效率和数据质量。",
    note: "统一标注任务的核心交互框架",
  },
  {
    id: "refined-annotation-template",
    title: "精标工艺模板优化",
    type: "AI 标注 / 工艺设计",
    year: "2025",
    pages: 27,
    file: publicFileUrl("pdfs/refined-annotation-template.pdf"),
    summary:
      "围绕 Marscode-SFT 与 Marscode-RL 精标任务，统一复杂作答、反馈和质检体验，降低工艺理解与操作成本。",
    note: "覆盖 SFT 与 RL 精标工艺",
  },
  {
    id: "work-experience-sharing",
    title: "工作经验分享",
    type: "B端平台 / 经验复盘",
    year: "2024",
    pages: 16,
    file: publicFileUrl("pdfs/work-experience-sharing.pdf"),
    summary:
      "以火山引擎 NOAH 产商平台为案例，复盘产品管理、解决方案、经营分析与商业化流程的线上化设计方法。",
    note: "从线下流程到标准化平台",
  },
  {
    id: "dynamic-model-invocation",
    title: "模型动态调用通用能力",
    type: "模型能力 / 通用组件",
    year: "2025",
    media: "image",
    file: publicFileUrl("assets/dynamic-model-invocation.jpg"),
    summary:
      "将模型调用抽象为可配置的通用组件，覆盖参数配置、调用结果、历史记录、重新调用与内容采纳等关键交互。",
    note: "复杂模型能力的组件化表达",
  },
  {
    id: "code-sft-quality",
    title: "代码SFT提效提质",
    type: "代码标注 / 效率优化",
    year: "2025",
    media: "image",
    file: publicFileUrl("assets/code-sft-quality.jpg"),
    summary:
      "优化代码 SFT 标注与质检流程，统一填写、对比、预览和质量反馈能力，提升标注效率与结果一致性。",
    note: "标注、质检与预览能力统一",
  },
  {
    id: "maimai-6",
    title: "脉脉 6.0 产品架构升级",
    type: "产品战略 / 体验架构",
    year: "2020",
    pages: 44,
    file: publicFileUrl("pdfs/maimai-6.pdf"),
    summary:
      "围绕“帮助用户连接未来机遇”重构产品认知，以降噪、记忆与延展为主线，重新定义 Tab 关系与全局信息架构。",
    note: "从定位模糊到统一产品心智",
  },
  {
    id: "maimai-5",
    title: "脉脉 5.0 交互升级",
    type: "交互框架 / 设计规范",
    year: "2018",
    pages: 13,
    file: publicFileUrl("pdfs/maimai-5.pdf"),
    summary:
      "统一 App 界面调性与交互语言，建立覆盖全站的设计规范，在业务目标、用户体验与技术成本之间取得平衡。",
    note: "NPS 提升 5 倍，协同效率提升 3 倍",
  },
  {
    id: "nps-research",
    title: "脉脉 NPS 用户研究",
    type: "用户研究 / 数据洞察",
    year: "2020",
    pages: 30,
    file: publicFileUrl("pdfs/nps-research.pdf"),
    summary:
      "基于 36 万份问卷投放与 1005 份完整样本，识别产品价值、用户分层与核心伤害点，反向指导产品迭代。",
    note: "把定性反馈与量化趋势放在一起",
  },
  {
    id: "colleague-circle",
    title: "同事圈产品演进",
    type: "社区产品 / 隐私体验",
    year: "2019",
    pages: 36,
    file: publicFileUrl("pdfs/colleague-circle.pdf"),
    summary:
      "围绕职场同事关系与匿名表达场景，持续探索信息组织、隐私边界和内容消费体验。",
    note: "长期迭代中的社区体验沉淀",
  },
  {
    id: "publishing-evolution",
    title: "内容发布体验演进",
    type: "内容生产 / 系统设计",
    year: "2021",
    pages: 15,
    file: publicFileUrl("pdfs/publishing-evolution.pdf"),
    summary:
      "梳理动态、职言、问答、文章与职位等 13 类发布场景，重组入口、编辑器能力与组件一致性。",
    note: "复杂发布能力的系统化收敛",
  },
  {
    id: "media-publishing",
    title: "图片与视频发布体验",
    type: "体验优化 / 移动端",
    year: "2020",
    pages: 6,
    file: publicFileUrl("pdfs/media-publishing.pdf"),
    summary:
      "基于真实反馈重构选图、预览、排序与视频播放链路，并针对不同网络环境建立清晰的反馈机制。",
    note: "从基础手势到异常状态的完整闭环",
  },
  {
    id: "ncaa-research",
    title: "NCAA 赛事周边体验研究",
    type: "设计研究 / 服务体验",
    year: "2016",
    pages: 35,
    file: publicFileUrl("pdfs/ncaa-research.pdf"),
    summary:
      "与 NCAA 合作，通过现场观察、访谈与共创研究不同赛事中的球迷及商品体验，形成画像、旅程与机会点。",
    note: "Collaborative action research",
  },
  {
    id: "methods-book",
    title: "Collaborative Methods",
    type: "研究方法 / 编辑设计",
    year: "2015",
    pages: 64,
    file: publicFileUrl("pdfs/methods-book.pdf"),
    summary:
      "面向设计研究者的协作方法手册，归纳探索、构想、意义建构与评估四类方法，连接研究过程与决策。",
    note: "64 页人本设计研究工具集",
  },
];

const experience = [
  {
    company: "字节跳动",
    role: "产品设计",
    period: "2023年6月—至今",
    description: [
      "主导Xpert专家社区（Seed等字节模型专家标注平台 www.corexpertdata.com）0→1建设，整合Labelelase与掘金专家标注平台。落地优化首页、入驻认证、裂变拉新、任务分发、作业、QA、申诉、提现等全链路核心场景，平台NPS显著提升。",
      "推进专家社区后台AIDP平台功能迭代，沉淀UI规范生成Skill，实现“零设计稿”模式——PRD直接生成符合UI规范的前端页面，设计工作聚焦验收走查，大幅提升产研协同效率。",
      "主导AI数据标注模板体系优化，覆盖Code-SFT、众测+IDE、Code-RL、Search-SFT、Search-Rubrics、Search-众测等核心模板。打破传统板块堆叠模式，抽象提炼“左导航—中作答—右反馈”基础交互框架并推动全量落地，交互动线清晰化，训练效率与标注质量显著提升；同步引入Agent能力，标注模板生产速度显著提升，用户作答体验大幅改善。",
      "负责火山引擎NAOH产品品管理平台0→1建设。协同产品梳理并简化产品管理、经营分析、目标达成、商品商业化等核心流程，实现线下到线上迁移与流程提效；制定平台设计规范与场景组件库，落地整体体验优化，NPS与用户满意度大幅提升。",
      "担任设计POC，快速判断需求优先级并输出交互方向性建议，有效降低跨团队沟通成本；推动团队拥抱AI工具，通过AI提效缓解人力压力；面向产品、运营、设计、前端等角色完成10+次跨团队分享。",
    ],
  },
  {
    company: "脉脉",
    role: "资深交互设计师",
    period: "2017年11月—2023年6月",
    description: [
      "主导脉脉App 5.0、6.0、6.5三大版本交互升级，基于用户行为数据与心理研究，构建App全业务流程交互框架，用户易用性显著提升，NPS提升5倍；制定交互设计原则，搭建全套交互规范与组件库，保障全站体验一致性，研发协同效率提升3倍。",
      "负责脉脉App全站交互设计，从体验视角协同产品推进内容生产与消费、增长、会员、人脉等核心业务的交互优化，数据收益连年超出业务目标。",
      "负责大型促产运营活动交互设计，内容生产总量逐月指数级增长，指定活动交互框架，节约70%开发成本，保障活动快速上线与高效收益。",
      "负责脉脉用户研究体系，参与公司战略制定与验证，通过用户调研与数据分析，将战略目标与用户需求深度结合，转化为简洁易用的体验方案。",
      "主导公司内部OKR、CRM、BI、NoCode等平台的建设与体验优化。",
    ],
  },
  {
    company: "百度",
    role: "交互与视觉设计师",
    period: "2014年8月—2015年8月",
    description: [
      "担任百度知心（教育、医疗）项目Web UI设计负责人，制定UI设计规范，协同技术团队构建标准化UI组件库，前端实现效率提升60%，同时提高了开发准确性与灵活性。",
      "担任百度财富（度小满）App LOGO改版主设计师，改版后上线首周下载量超目标10倍，次周持续指数级增长（LOGO设计获VP高度认可）；同步制定App UI改版设计规范与组件库。",
      "负责百度推广相关活动设计，涵盖3D建模、动效设计、视频剪辑、手绘等多元创作。",
      "担任度秘（小度）项目IP形象主设计师之一。",
    ],
  },
  {
    company: "匙悟科技",
    role: "创业/电商平台",
    period: "2013年7月—2014年8月",
    description: [
      "担任“只为她设计”项目经理，统筹项目范围与人员安排，高效完成市场调研与项目落地。",
      "负责自主设计主打产品的市场推广，涵盖智能床头灯Solar、3D打印首饰、个性化定制产品等。",
      "负责公司品牌宣传推广，成功入驻清华启迪孵化器x-lab。",
    ],
  },
];

const education = [
  {
    school: "美国印第安纳大学",
    major: "体验设计",
    degree: "研究生",
    period: "2015年8月—2017年8月",
    description: [
      "获全额奖学金及助教补贴。",
      "研究方向：用户心理、人机交互、设计领导力。",
      "2016.05 – 2016.08 秒嗨App产品设计实习：构建应用0→1的基础交互框架，三个月内完成两次用户调研，为产品迭代提供大量设计洞察。",
    ],
  },
  {
    school: "北京师范大学",
    major: "艺术设计",
    degree: "本科",
    period: "2009年9月—2013年7月",
    description: [
      "主修园林景观设计、3D建模、平面设计；参与北师大校史展厅设计、奥运会周边项目设计。",
      "2012.01 – 2013.01 作为北师大传媒学院首位公派交换生，赴美国西南俄克拉荷马州立大学视觉传达系交流，1年修完4年专业课程，并在美国举办个人画展。",
      "2013.02 – 2013.06 土人景观设计研究院·设计六所实习：创新CAD+Rhino3D建模土方量计算方法，节约96%计算时间，误差缩小10%；参与哈尔滨大剧院、临沂湿地公园、国家大剧院等项目景观植被设计。",
      "2009.11 – 2012.01 CCTV大型晚会部·舞台美术及活动设计实习：经心理学培训成为自闭症国际志愿者，策划“爱在蓝天下”世界自闭症日大型活动；熟练3D建模与灯光设计，参与智美集团上市晚会、天润传媒十周年庆典等大型活动。",
    ],
  },
];

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

function ProjectCover({ project, eager = false }) {
  const cover =
    project.media === "image"
      ? project.file
      : publicFileUrl(`assets/covers/${project.id}.jpg`);
  return (
    <div
      className="pdf-cover image-cover"
      aria-label={`${project.title} 项目封面预览`}
    >
      <div className="pdf-placeholder">
        <span>正在载入项目</span>
        <strong>{project.title}</strong>
      </div>
      <img
        src={cover}
        alt=""
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "low"}
      />
    </div>
  );
}

function PdfReaderPage({
  documentProxy,
  pageNumber,
  pageCount,
  renderWidth,
  scrollRoot,
  title,
}) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [pageRatio, setPageRatio] = useState("16 / 9");
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!frameRef.current || !scrollRoot.current) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (!entry.isIntersecting) setReady(false);
      },
      {
        root: scrollRoot.current,
        rootMargin: "1000px 0px",
      },
    );
    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, [scrollRoot]);

  useEffect(() => {
    if (!visible || !renderWidth || !canvasRef.current) return undefined;
    let cancelled = false;
    let page;
    let renderTask;
    setReady(false);
    setFailed(false);

    async function renderPage() {
      try {
        page = await documentProxy.getPage(pageNumber);
        if (cancelled) return;
        const base = page.getViewport({ scale: 1 });
        const width = Math.min(renderWidth, 1100);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({ scale: (width / base.width) * dpr });
        const canvas = canvasRef.current;
        setPageRatio(`${base.width} / ${base.height}`);
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width / dpr}px`;
        canvas.style.height = `${viewport.height / dpr}px`;
        renderTask = page.render({
          canvasContext: canvas.getContext("2d", { alpha: false }),
          viewport,
        });
        await renderTask.promise;
        if (!cancelled) setReady(true);
      } catch (error) {
        if (error?.name !== "RenderingCancelledException" && !cancelled) {
          setFailed(true);
        }
      }
    }

    renderPage();
    return () => {
      cancelled = true;
      renderTask?.cancel();
      page?.cleanup();
      if (canvasRef.current) {
        canvasRef.current.width = 0;
        canvasRef.current.height = 0;
      }
    };
  }, [documentProxy, pageNumber, renderWidth, visible]);

  return (
    <figure
      className={`pdf-reader-page ${ready ? "is-ready" : ""}`}
      ref={frameRef}
      style={{ "--pdf-page-ratio": pageRatio }}
    >
      {!ready && (
        <span className="pdf-reader-page-status">
          {failed ? `第 ${pageNumber} 页加载失败` : `${pageNumber} / ${pageCount}`}
        </span>
      )}
      <canvas ref={canvasRef} aria-label={`${title} 第 ${pageNumber} 页`} />
    </figure>
  );
}

function PdfReader({ project, onClose }) {
  const stageRef = useRef(null);
  const pagesRef = useRef(null);
  const [documentProxy, setDocumentProxy] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [renderWidth, setRenderWidth] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (!pagesRef.current) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      setRenderWidth(Math.max(0, entry.contentRect.width));
    });
    observer.observe(pagesRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (project.media === "image") {
      setDocumentProxy(null);
      setPageCount(0);
      setFailed(false);
      return undefined;
    }

    let cancelled = false;
    let loadedDocument;
    let loadingTask;
    setDocumentProxy(null);
    setPageCount(0);
    setFailed(false);

    loadPdfJs()
      .then((pdfjs) => {
        if (cancelled) return null;
        loadingTask = pdfjs.getDocument(project.file);
        return loadingTask.promise;
      })
      .then((pdf) => {
        if (!pdf) return;
        loadedDocument = pdf;
        if (cancelled) return;
        setDocumentProxy(pdf);
        setPageCount(pdf.numPages);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      loadingTask?.destroy();
      loadedDocument?.destroy();
      setDocumentProxy(null);
    };
  }, [project.file, project.media]);

  return createPortal(
    <div
      className="pdf-reader-backdrop"
      role="presentation"
      onPointerDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="pdf-reader"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pdf-reader-title"
      >
        <header className="pdf-reader-toolbar">
          <div>
            <span>Project viewer</span>
            <strong id="pdf-reader-title">{project.title}</strong>
          </div>
          <div className="pdf-reader-controls">
            <span>{project.media === "image" ? "长图" : `${pageCount || "—"} 页`}</span>
            <button type="button" aria-label="关闭项目" title="关闭" onClick={onClose}>
              <X size={19} />
            </button>
          </div>
        </header>
        <div
          className="pdf-reader-stage"
          ref={stageRef}
          role="region"
          aria-label={`${project.title} 连续阅读`}
          tabIndex={0}
          onContextMenu={(event) => event.preventDefault()}
        >
          {project.media === "image" ? (
            <div className="image-reader-content">
              <img src={project.file} alt={`${project.title} 完整项目长图`} />
            </div>
          ) : (
            <>
              {!documentProxy && (
                <p className="pdf-reader-status">
                  {failed ? "项目加载失败" : "正在载入项目"}
                </p>
              )}
              <div className="pdf-reader-pages" ref={pagesRef}>
                {documentProxy &&
                  Array.from({ length: pageCount }, (_, index) => (
                    <PdfReaderPage
                      documentProxy={documentProxy}
                      key={index + 1}
                      pageNumber={index + 1}
                      pageCount={pageCount}
                      renderWidth={renderWidth}
                      scrollRoot={stageRef}
                      title={project.title}
                    />
                  ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>,
    document.body,
  );
}

function Header({ tab, onTabChange }) {
  return (
    <header className="site-header">
      <a className="monogram" href="#projects" onClick={() => onTabChange("projects")}>
        CLJ
      </a>
      <nav className="tab-nav" aria-label="作品集主导航">
        {[
          ["projects", "项目", "01"],
          ["resume", "简历", "02"],
        ].map(([id, label, index]) => (
          <button
            type="button"
            key={id}
            className={tab === id ? "is-active" : ""}
            aria-selected={tab === id}
            onClick={() => onTabChange(id)}
          >
            <span>{label}</span>
            <sup>{index}</sup>
          </button>
        ))}
      </nav>
      <a
        className="icon-link"
        href="mailto:chenlinjunzi@gmail.com"
        aria-label="发送邮件给陈林君"
        title="联系我"
      >
        <Mail size={17} strokeWidth={1.8} />
      </a>
    </header>
  );
}

function ProjectsView() {
  const [active, setActive] = useState(0);
  const [viewerProject, setViewerProject] = useState(null);
  const isMobile = useMediaQuery("(max-width: 759px)");
  const heroRef = useRef(null);
  const current = projects[active];

  function handlePointerMove(event) {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    heroRef.current.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    heroRef.current.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  return (
    <main className="view projects-view" id="projects">
      <section
        className="hero"
        ref={heroRef}
        onPointerMove={handlePointerMove}
        aria-labelledby="portfolio-title"
      >
        <div className="hero-grid">
          <p className="hero-kicker">Product Experience Designer · Beijing</p>
          <p className="hero-index">Portfolio / 2026</p>
          <div className="hero-orbit" aria-hidden="true">
            <div className="orbit-ring" />
            <div className="orbit-card orbit-card-back" />
            <div className="orbit-card orbit-card-mid" />
            <div className="orbit-card orbit-card-front">
              <ProjectCover project={projects[0]} eager />
            </div>
          </div>
          <h1 id="portfolio-title">
            <span>陈林君</span>
            <span className="hero-latin">
              <span>LINJUN</span>
              <span>CHEN</span>
            </span>
          </h1>
          <p className="hero-intro">
            把复杂业务转化为
            <br />
            易读、易懂、易用的产品体验。
          </p>
          <div className="hero-scroll">
            <ArrowDownRight size={18} />
            <span>浏览精选项目</span>
          </div>
        </div>
      </section>

      <section className="project-archive" aria-labelledby="project-heading">
        <div className="section-heading">
          <p>Selected work</p>
          <h2 id="project-heading">项目索引</h2>
          <span>{projects.length} projects</span>
        </div>

        <div className="archive-layout">
          <div className="project-list">
            {projects.map((project, index) => (
              <article
                className={`project-row ${active === index ? "is-active" : ""}`}
                key={project.id}
                onPointerEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
              >
                <button
                  className="project-open"
                  type="button"
                  aria-label={`站内浏览：${project.title}`}
                  onClick={() => setViewerProject(project)}
                >
                  <span className="project-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="project-main">
                    <p>{project.type}</p>
                    <h3>{project.title}</h3>
                    <span className="project-summary">{project.summary}</span>
                    {isMobile && (
                      <ProjectCover project={project} eager={index === 0} />
                    )}
                    <span className="project-note">{project.note}</span>
                  </div>
                  <div className="project-meta">
                    <span>{project.year}</span>
                    <span>
                      {project.media === "image" ? "Long image" : `${project.pages} pages`}
                    </span>
                    <Eye size={19} strokeWidth={1.6} />
                  </div>
                </button>
              </article>
            ))}
          </div>

          {!isMobile && (
            <aside className="project-preview" aria-live="polite">
              <div className="preview-meta">
                <span>
                  {String(active + 1).padStart(2, "0")} / {projects.length}
                </span>
                <span>{current.type}</span>
              </div>
              <button
                className="preview-open"
                type="button"
                aria-label={`站内浏览：${current.title}`}
                onClick={() => setViewerProject(current)}
              >
                <ProjectCover
                  key={current.file}
                  project={current}
                  eager
                />
                <span className="preview-action">
                  站内浏览 <Eye size={17} />
                </span>
              </button>
            </aside>
          )}
        </div>
      </section>
      {viewerProject && (
        <PdfReader project={viewerProject} onClose={() => setViewerProject(null)} />
      )}
    </main>
  );
}

function ResumeView() {
  return (
    <main className="view resume-view" id="resume">
      <section className="resume-hero" aria-labelledby="resume-title">
        <div className="resume-heading">
          <p className="hero-kicker">Resume / 2026</p>
          <h1 id="resume-title">产品体验设计师</h1>
        </div>
        <figure className="resume-portrait">
          <img
            src={publicFileUrl("assets/linjun-chen.jpg")}
            alt="陈林君个人头像"
            width="1200"
            height="1200"
          />
        </figure>
        <div className="resume-profile">
          <div className="resume-name">
            <span>陈林君</span>
            <p>Linjun Chen · Product Experience Designer</p>
          </div>
          <p className="resume-summary">
            <span>
              率先跑通了AI辅助设计全流程：需求分析→竞品调研→PRD与原型→前端技术方案→可上线界面Demo，沉淀多套UI规范生成Skill，实现PRD直出符合规范的前端页面，设计效率显著提升。
            </span>
            <span>
              深耕用户研究与数据驱动设计，独立完成用户调研、行为分析、机会挖掘并推动落地优化方案。
            </span>
            <span>
              3年B端产品设计、6年C端UX设计经验，擅长将复杂业务逻辑转化为易读、易懂、易用的产品界面。
            </span>
          </p>
          <div className="resume-actions">
            <a
              className="download-button"
              href={publicFileUrl("pdfs/resume.pdf")}
              download
            >
              <Download size={18} />
              下载完整简历
            </a>
            <a className="resume-contact" href="mailto:chenlinjunzi@gmail.com">
              <Mail size={18} />
              chenlinjunzi@gmail.com
            </a>
            <a className="resume-contact resume-phone" href="tel:13146118584">
              <Phone size={18} />
              131 4611 8584
            </a>
          </div>
        </div>
      </section>

      <section className="resume-section" aria-labelledby="experience-title">
        <div className="resume-section-title">
          <p>Experience</p>
          <h2 id="experience-title">工作经历</h2>
        </div>
        <div className="timeline">
          {experience.map((item) => (
            <article className="timeline-item" key={item.company}>
              <header className="timeline-heading">
                <h3>{item.company}</h3>
                <span aria-hidden="true">|</span>
                <p>{item.role}</p>
                <time>{item.period}</time>
              </header>
              <div className="timeline-detail">
                <ol>
                  {item.description.map((description) => (
                    <li key={description}>{description}</li>
                  ))}
                </ol>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="education" aria-labelledby="education-title">
        <div>
          <p>Education</p>
          <h2 id="education-title">教育经历</h2>
        </div>
        <div className="education-list">
          {education.map((item) => (
            <article key={item.school}>
              <header className="education-heading">
                <h3>{item.school}</h3>
                <span aria-hidden="true">|</span>
                <p>{item.major}</p>
                <span aria-hidden="true">|</span>
                <p>{item.degree}</p>
                <time>{item.period}</time>
              </header>
              <ul>
                {item.description.map((description) => (
                  <li key={description}>{description}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Footer({ onResume }) {
  return (
    <footer className="site-footer">
      <p>Let's make complex things clear.</p>
      <a href="mailto:chenlinjunzi@gmail.com">
        chenlinjunzi@gmail.com <ArrowUpRight size={18} />
      </a>
      <div>
        <span>© {new Date().getFullYear()} Linjun Chen</span>
        <button type="button" onClick={onResume}>
          查看简历
        </button>
      </div>
    </footer>
  );
}

export default function App() {
  const [tab, setTab] = useState(() =>
    window.location.hash === "#resume" ? "resume" : "projects",
  );

  useEffect(() => {
    const onHashChange = () =>
      setTab(window.location.hash === "#resume" ? "resume" : "projects");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function changeTab(next) {
    setTab(next);
    window.history.replaceState(null, "", `#${next}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className={`app tab-${tab}`}>
      <Header tab={tab} onTabChange={changeTab} />
      <div className="view-shell" key={tab}>
        {tab === "projects" ? <ProjectsView /> : <ResumeView />}
      </div>
      <Footer onResume={() => changeTab("resume")} />
    </div>
  );
}
