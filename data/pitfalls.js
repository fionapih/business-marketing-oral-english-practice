/**
 * 术语易错避坑提示库
 * key = card id，value = { title, points:[], tip }
 * 已校验：所有 key 均对应 corpus.js 中真实存在的 term 卡 id。
 */
const TERM_PITFALLS = {
  "m1s1-terms-1": {
    "title": "Agenda vs Schedule",
    "points": [
      "Agenda = 本次会议要讨论的议题清单，聚焦『会上做什么』",
      "Schedule = 更广义的时间表 / 日程安排，包含多个会议或任务的时间点"
    ],
    "tip": "开会前发邮件用 'Here is the agenda'，别把本次会议议程说成 'schedule of this meeting'。"
  },
  "m1s1-terms-2": {
    "title": "Meeting minutes vs Meeting notes",
    "points": [
      "Meeting minutes = 正式会议记录，通常需记录决议、行动项并归档",
      "Meeting notes = 个人或随意的会议笔记，不一定正式"
    ],
    "tip": "给老板发正式纪要用 'meeting minutes'，不要说 'meeting record'。"
  },
  "m1s1-terms-3": {
    "title": "Action items vs General tasks",
    "points": [
      "Action items = 会议明确产出的待办事项，通常带负责人和截止日期",
      "General tasks = 泛指任何任务，不一定来自会议"
    ],
    "tip": "会后邮件里写 'Here are the action items'，而不是只写 'to-do list'。"
  },
  "m1s1-terms-4": {
    "title": "Progress report vs Status report",
    "points": [
      "Progress report = 强调『进展』，完成了多少、走到哪一步",
      "Status report = 强调『当前状态』，可包含风险、阻塞、资源情况"
    ],
    "tip": "周报标题常用 'Weekly Status Update'，汇报进展可用 'progress so far'。"
  },
  "m1s1-terms-5": {
    "title": "Team collaboration vs Teamwork",
    "points": [
      "Team collaboration = 强调跨职能、跨角色的协作过程",
      "Teamwork = 更偏向团队精神、互相支持的氛围"
    ],
    "tip": "外企邮件常说 'cross-functional collaboration'，比 'teamwork' 更正式、更具体。"
  },
  "m1s1-terms-6": {
    "title": "Deadline vs Due date",
    "points": [
      "Deadline = 最终截止时间，逾期即违约 / 延期",
      "Due date = 交付期限，相对柔性的到期日"
    ],
    "tip": "催进度时说 'We are approaching the deadline' 比 'due date' 更有紧迫感。"
  },
  "m1s1-terms-7": {
    "title": "Deliverables vs Outputs",
    "points": [
      "Deliverables = 项目 / 合同中约定要交付的具体成果，可衡量",
      "Outputs = 泛指产出物，不一定有交付义务"
    ],
    "tip": "和客户签需求时明确 'key deliverables'，别只说 'what we will produce'。"
  },
  "m1s1-terms-8": {
    "title": "Follow up vs Follow through",
    "points": [
      "Follow up = 后续跟进、提醒或补充信息",
      "Follow through = 把事情执行到底、落实到底"
    ],
    "tip": "会后 'I will follow up with you' 是跟进；确保落地要说 'I will follow through on this'。"
  },
  "m1s1-terms-9": {
    "title": "Discussion points vs Action points",
    "points": [
      "Discussion points = 会上需要讨论、未决的议题",
      "Action points = 已确定要执行的事项"
    ],
    "tip": "先列 'discussion points'，会后转成 'action points'，顺序别反。"
  },
  "m1s1-terms-10": {
    "title": "Consensus vs Agreement",
    "points": [
      "Consensus = 大家经过讨论达成的共识，强调过程一致",
      "Agreement = 双方或多方达成的协议 / 同意"
    ],
    "tip": "会上说 'Let's reach a consensus' 表示达成一致，不是简单投票。"
  },
  "m1s1-terms-11": {
    "title": "Obstacles vs Bottlenecks",
    "points": [
      "Obstacles = 阻碍进展的任何障碍",
      "Bottlenecks = 流程中最狭窄、最拖慢速度的环节"
    ],
    "tip": "资源不足是 obstacle，审批排队是 bottleneck，别混用。"
  },
  "m1s1-terms-12": {
    "title": "Next steps vs Action plan",
    "points": [
      "Next steps = 下一步计划 / 方向，偏宏观，会上常用",
      "Action plan = 具体行动方案，含责任人、时间、资源"
    ],
    "tip": "会议结尾可用 'Next steps'，邮件里要落实到 'action plan' 或 'action items'。"
  },
  "m1s1-terms-13": {
    "title": "Stakeholders vs Shareholders",
    "points": [
      "Stakeholders = 所有利益相关方（员工、客户、供应商、管理层）",
      "Shareholders = 股东，仅指持有股份的人"
    ],
    "tip": "项目影响评估要说 'stakeholder impact'，别误说成 'shareholder impact'。"
  },
  "m1s1-terms-14": {
    "title": "Meeting objectives vs Meeting goals",
    "points": [
      "Meeting objectives = 具体、可衡量的会议目标",
      "Meeting goals = 更宏观、长期的目标"
    ],
    "tip": "议程里写 'objectives' 更专业，如 'By the end, we will decide X'。"
  },
  "m1s1-terms-15": {
    "title": "Resource allocation vs Resource distribution",
    "points": [
      "Resource allocation = 根据优先级和需求分配资源",
      "Resource distribution = 把资源分发给各方，侧重『分发』动作"
    ],
    "tip": "预算和人力分配用 'resource allocation'，不只是 'give resources'。"
  },
  "m1s1-terms-16": {
    "title": "Status update vs Progress update",
    "points": [
      "Status update = 当前整体状态汇报（健康度、风险、阻塞）",
      "Progress update = 强调完成了什么、完成了多少"
    ],
    "tip": "例会常用 'quick status update'，别只报告进度，忘了风险。"
  },
  "m1s1-terms-17": {
    "title": "Feedback vs Comment",
    "points": [
      "Feedback = 建设性的反馈意见，用于改进",
      "Comment = 一般性评论，可正可负"
    ],
    "tip": "向同事要 'feedback' 更专业，说 'Any comments?' 在正式场合显得随意。"
  },
  "m1s1-terms-18": {
    "title": "Key issues vs Key points",
    "points": [
      "Key issues = 关键问题 / 风险，通常需要解决",
      "Key points = 要点、重点，不一定有问题"
    ],
    "tip": "风险讨论用 'key issues'，总结发言用 'key points'。"
  },
  "m1s1-terms-19": {
    "title": "Schedule vs Timeline",
    "points": [
      "Schedule = 具体时间安排表",
      "Timeline = 时间线，展示事件顺序和里程碑"
    ],
    "tip": "会议排期用 'schedule a meeting'，项目阶段用 'project timeline'。"
  },
  "m1s1-terms-20": {
    "title": "Summary vs Conclusion",
    "points": [
      "Summary = 对内容的简要概括",
      "Conclusion = 基于讨论得出的结论"
    ],
    "tip": "会议纪要开头写 'Summary'，结尾写 'Conclusion'，不要互换。"
  },
  "m1s1-terms-21": {
    "title": "Task assignment vs Work assignment",
    "points": [
      "Task assignment = 具体任务的分配，带明确责任人",
      "Work assignment = broader 的工作安排"
    ],
    "tip": "项目会上说 'task assignment'，明确谁负责哪项具体任务。"
  },
  "m1s1-terms-22": {
    "title": "Follow through vs Follow up",
    "points": [
      "Follow through = 把事情从头到尾执行到位",
      "Follow up = 跟进、提醒、补充"
    ],
    "tip": "'Follow up' 是联系，'Follow through' 是交付结果，两者要搭配用。"
  },
  "m1s1-terms-23": {
    "title": "Responsibility matrix vs RACI",
    "points": [
      "Responsibility matrix = 责任分配矩阵",
      "RACI = 一种具体责任矩阵（Responsible / Accountable / Consulted / Informed）"
    ],
    "tip": "外企常用 'RACI matrix'，比泛泛的 responsibility matrix 更具体。"
  },
  "m1s1-terms-24": {
    "title": "Contingency plan vs Backup plan",
    "points": [
      "Contingency plan = 针对特定风险的应急预案",
      "Backup plan = 备用方案，更通用"
    ],
    "tip": "项目风险管理说 'contingency plan'，日常替代方案说 'backup plan'。"
  },
  "m6s4-terms-2": {
    "title": "Deadline vs Due date",
    "points": [
      "Deadline = 最终截止时间，逾期即违约 / 延期",
      "Due date = 交付期限，相对柔性的到期日"
    ],
    "tip": "催进度时说 'We are approaching the deadline' 比 'due date' 更有紧迫感。"
  },
  "m3s4-terms-1": {
    "title": "Follow up vs Follow through",
    "points": [
      "Follow up = 后续跟进、提醒或补充信息",
      "Follow through = 把事情执行到底、落实到底"
    ],
    "tip": "'Follow up' 是联系，'Follow through' 是交付结果，两者要搭配用。"
  },
  "m6s2-terms-3": {
    "title": "Follow up vs Follow through",
    "points": [
      "Follow up = 后续跟进、提醒或补充信息",
      "Follow through = 把事情执行到底、落实到底"
    ],
    "tip": "'Follow up' 是联系，'Follow through' 是交付结果，两者要搭配用。"
  },
  "m6s2-terms-1": {
    "title": "Stakeholders vs Shareholders",
    "points": [
      "Stakeholders = 所有利益相关方（员工、客户、供应商、管理层）",
      "Shareholders = 股东，仅指持有股份的人"
    ],
    "tip": "项目影响评估要说 'stakeholder impact'，别误说成 'shareholder impact'。"
  },
  "m1s4-terms-6": {
    "title": "Feedback vs Comment",
    "points": [
      "Feedback = 建设性的反馈意见，用于改进",
      "Comment = 一般性评论，可正可负"
    ],
    "tip": "向同事要 'feedback' 更专业，说 'Any comments?' 在正式场合显得随意。"
  },
  "m2s1-terms-20": {
    "title": "Feedback vs Comment",
    "points": [
      "Feedback = 建设性的反馈意见，用于改进",
      "Comment = 一般性评论，可正可负"
    ],
    "tip": "向同事要 'feedback' 更专业，说 'Any comments?' 在正式场合显得随意。"
  },
  "m3s3-terms-1": {
    "title": "Feedback vs Comment",
    "points": [
      "Feedback = 建设性的反馈意见，用于改进",
      "Comment = 一般性评论，可正可负"
    ],
    "tip": "向同事要 'feedback' 更专业，说 'Any comments?' 在正式场合显得随意。"
  },
  "m5s2-terms-1": {
    "title": "Feedback vs Comment",
    "points": [
      "Feedback = 建设性的反馈意见，用于改进",
      "Comment = 一般性评论，可正可负"
    ],
    "tip": "向同事要 'feedback' 更专业，说 'Any comments?' 在正式场合显得随意。"
  },
  "m2s1-terms-3": {
    "title": "Schedule vs Timeline",
    "points": [
      "Schedule = 具体时间安排表",
      "Timeline = 时间线，展示事件顺序和里程碑"
    ],
    "tip": "会议排期用 'schedule a meeting'，项目阶段用 'project timeline'。"
  },
  "m5s1-terms-13": {
    "title": "Brand awareness vs Brand image",
    "points": [
      "Brand awareness = 受众『知不知道』你的品牌",
      "Brand image = 受众对品牌的『印象与评价』"
    ],
    "tip": "做调研时区分 'awareness'（知名度）和 'image'（形象），别混用。"
  },
  "m3s1-terms-1": {
    "title": "Brand awareness vs Brand image",
    "points": [
      "Brand awareness = 受众『知不知道』你的品牌",
      "Brand image = 受众对品牌的『印象与评价』"
    ],
    "tip": "做调研时区分 'awareness'（知名度）和 'image'（形象），别混用。"
  },
  "m6s1-terms-6": {
    "title": "Target audience vs Target market",
    "points": [
      "Target audience = 传播沟通的对象（谁会看到 / 听到）",
      "Target market = 销售瞄准的市场细分"
    ],
    "tip": "做内容说 'audience'，做市场定位说 'market'。"
  },
  "m8s3-terms-10": {
    "title": "Target audience vs Target market",
    "points": [
      "Target audience = 传播沟通的对象（谁会看到 / 听到）",
      "Target market = 销售瞄准的市场细分"
    ],
    "tip": "做内容说 'audience'，做市场定位说 'market'。"
  },
  "m3s1-terms-5": {
    "title": "Churn vs Retention",
    "points": [
      "Churn = 流失率（客户离开的比例）",
      "Retention = 留存率（客户留下的比例），二者互为倒数视角"
    ],
    "tip": "降 churn 和提 retention 是同一件事的两面，汇报时别算重。"
  },
  "m3s1-terms-7": {
    "title": "Localization vs Translation",
    "points": [
      "Localization = 本地化，含文化、单位、合规的适配",
      "Translation = 仅语言翻译"
    ],
    "tip": "出海项目要说 'localization'，纯翻译用 'translation'。"
  },
  "m4s1-terms-4": {
    "title": "Survey vs Interview",
    "points": [
      "Survey = 结构化问卷，适合大样本量化",
      "Interview = 深度访谈，适合挖动机与细节"
    ],
    "tip": "做定量用 'survey'，做定性洞察用 'interview'。"
  },
  "m3s3-terms-2": {
    "title": "Survey vs Interview",
    "points": [
      "Survey = 结构化问卷，适合大样本量化",
      "Interview = 深度访谈，适合挖动机与细节"
    ],
    "tip": "做定量用 'survey'，做定性洞察用 'interview'。"
  },
  "m8s2-terms-5": {
    "title": "Survey vs Interview",
    "points": [
      "Survey = 结构化问卷，适合大样本量化",
      "Interview = 深度访谈，适合挖动机与细节"
    ],
    "tip": "做定量用 'survey'，做定性洞察用 'interview'。"
  },
  "m3s1-terms-8": {
    "title": "Engagement vs Reach",
    "points": [
      "Engagement = 互动（点赞 / 评论 / 转发等深度参与）",
      "Reach = 触达人数（看到的人），不一定互动"
    ],
    "tip": "看内容效果别只看 'reach'，'engagement' 更能反映真实兴趣。"
  },
  "m6s1-terms-16": {
    "title": "Engagement vs Reach",
    "points": [
      "Engagement = 互动（点赞 / 评论 / 转发等深度参与）",
      "Reach = 触达人数（看到的人），不一定互动"
    ],
    "tip": "看内容效果别只看 'reach'，'engagement' 更能反映真实兴趣。"
  },
  "m11s3-terms-9": {
    "title": "Net profit vs Gross profit",
    "points": [
      "Net profit = 净利（扣除所有成本费用后）",
      "Gross profit = 毛利（收入减直接成本）"
    ],
    "tip": "财报里 'gross' 是毛利，'net' 是净利，差了一堆运营费用。"
  },
  "m3s2-terms-23": {
    "title": "Negotiation vs Bargaining",
    "points": [
      "Negotiation = 协商，目标是双赢 / 达成共识",
      "Bargaining = 偏讨价还价的零和博弈"
    ],
    "tip": "商务合作多用 'negotiation'（协商共赢），少用 'bargaining' 显得对立。"
  },
  "m1s4-terms-2": {
    "title": "Objective vs Goal",
    "points": [
      "Objective = 具体、可衡量的目标",
      "Goal = 更宏观、长期的方向"
    ],
    "tip": "写计划时 'objective' 更具体可衡量，'goal' 偏方向性。"
  },
};

if (typeof window !== 'undefined') window.TERM_PITFALLS = TERM_PITFALLS;
