/**
 * 实战演练题库（场景级）
 * 每个核心场景一个数组，每题包含：
 *   id        唯一 id（建议 m{月}s{场景}-p{序号}）
 *   prompt    给用户的提问 / 任务
 *   context   中文情境说明（帮用户理解该说什么）
 *   hint      作答提示（句式 / 关键词）
 *   sampleEn  范例回答（英文，可朗读）
 *   sampleZh  范例回答（中文）
 *
 * 说明：规则引擎会基于用户作答做语法批改；范例用于对照学习。
 * 实战演练作为场景的第四个学习模式（与术语库/句型模板/情景对话并列）。
 * m1 为人工撰写；m2-m12 由脚本基于各场景真实语料与子场景标签生成。
 */
const PRACTICE_QUESTIONS = {
  "m10s1": [
    {
      "id": "m10s1-p1",
      "prompt": "在『文化禁忌』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『文化禁忌』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『文化禁忌』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "We recommend avoiding green-dominated designs due to specific cultural associations.",
      "sampleZh": "因特定文化关联，建议避免以绿色为主的设计。"
    },
    {
      "id": "m10s1-p2",
      "prompt": "在『合规差异』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『合规差异』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『合规差异』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Could you advise on the packaging color scheme for the Middle East market？",
      "sampleZh": "能建议中东市场的包装配色方案吗？"
    }
  ],
  "m10s2": [
    {
      "id": "m10s2-p1",
      "prompt": "在『合规差异』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『合规差异』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『合规差异』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "We're considering localized influencer partnerships. Any regulatory restrictions in your region？",
      "sampleZh": "我们计划开展本地网红合作，贵地区有法规限制吗？"
    },
    {
      "id": "m10s2-p2",
      "prompt": "在『物流支付』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『物流支付』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『物流支付』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "That aligns with our TikTok campaign performance data. Should we reallocate YouTube budgets？",
      "sampleZh": "这与我们TikTok活动数据一致，需要重新分配 YouTube 预算吗？"
    }
  ],
  "m10s3": [
    {
      "id": "m10s3-p1",
      "prompt": "在『考核制度』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『考核制度』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『考核制度』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "We'll conduct the product training next Monday. Could you confirm attendance？",
      "sampleZh": "产品培训定于下周一，请确认参与人数。"
    },
    {
      "id": "m10s3-p2",
      "prompt": "在『赋能支持』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『赋能支持』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『赋能支持』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Currently 8 agents are available. Will the materials be provided in advance？",
      "sampleZh": "目前8位代理商可参加。资料会提前发放吗？"
    }
  ],
  "m10s4": [
    {
      "id": "m10s4-p1",
      "prompt": "在『供应商沟通』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『供应商沟通』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『供应商沟通』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "We need to focus on sponsorship acquisition to secure funding for the event.",
      "sampleZh": "我"
    },
    {
      "id": "m10s4-p2",
      "prompt": "在『动线设计』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『动线设计』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『动线设计』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "The revised version will be ready by 2pm. Do you need digital signage specs？",
      "sampleZh": "修改版将在 2点前完成，需要电子指示牌规格吗？"
    }
  ],
  "m11s1": [
    {
      "id": "m11s1-p1",
      "prompt": "在『超支解释』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『超支解释』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『超支解释』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Let's compare our current financial performance with the previous quarter's results.",
      "sampleZh": "让我们将当前的财务表现与上季度的结果进行比较。"
    },
    {
      "id": "m11s1-p2",
      "prompt": "在『优先级』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『优先级』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『优先级』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "We should reassess our financial projections to account for recent market changes.",
      "sampleZh": "我们应该重新评估我们的财务预测，以考虑近期的市场变化。"
    }
  ],
  "m11s2": [
    {
      "id": "m11s2-p1",
      "prompt": "在『超支解释』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『超支解释』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『超支解释』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "\"We need to consider both direct costs, like materials, and indirect benefits, such 83/ 2 as brand enhancement.\"",
      "sampleZh": "FM.：“成本效益分析将帮助我们确定该项目的可行性。”"
    },
    {
      "id": "m11s2-p2",
      "prompt": "在『优先级』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『优先级』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『优先级』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Budget reconciliation is necessary to ensure that our financial records are accurate.",
      "sampleZh": "预算调节对于确保我们的财务记录准确是必要的。"
    }
  ],
  "m11s3": [
    {
      "id": "m11s3-p1",
      "prompt": "在『归因说明』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『归因说明』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『归因说明』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Let's begin with the campaign ROl calculation. Our analysis shows 320% ROl in Q2.",
      "sampleZh": "我们从第二季度 ROI分析开始，数据显示投资回报率为320%"
    },
    {
      "id": "m11s3-p2",
      "prompt": "在『敏感度分析』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『敏感度分析』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『敏感度分析』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Our attribution model shows email marketing drives 38% conversions.",
      "sampleZh": "归因模型显示邮件营销贡献 38%转化"
    }
  ],
  "m11s4": [
    {
      "id": "m11s4-p1",
      "prompt": "在『破冰主持』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『破冰主持』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『破冰主持』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "lt's important that we rely on each other's strengths to succeed in this challenge.",
      "sampleZh": "在这个挑战中，我们依靠彼此的优势才能成功。"
    },
    {
      "id": "m11s4-p2",
      "prompt": "在『复盘总结』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『复盘总结』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『复盘总结』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Let's take a few minutes to reflect on how well we worked together as a team.",
      "sampleZh": "让我们花几分钟时间来反思我们作为团队的合作情况。"
    }
  ],
  "m12s1": [
    {
      "id": "m12s1-p1",
      "prompt": "在『知识讲解』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『知识讲解』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『知识讲解』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Youill have the opportunity to practice these skills in a hands-on environment.\"_",
      "sampleZh": "你将有机会在实践环境中练习这些技能。"
    },
    {
      "id": "m12s1-p2",
      "prompt": "在『案例演练』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『案例演练』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『案例演练』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "This training is designed to help you achieve professional growth in your field.",
      "sampleZh": "这次培训旨在帮助你在专业领域实现职业发展。"
    }
  ],
  "m12s2": [
    {
      "id": "m12s2-p1",
      "prompt": "在『案例分享』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『案例分享』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『案例分享』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Cultural alignment is critical for ensuring long-term success in the organization.\"-",
      "sampleZh": "文化契合对确保组织的长期成功至关重要。"
    },
    {
      "id": "m12s2-p2",
      "prompt": "在『一把手参与』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『一把手参与』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『一把手参与』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Creating a culture of transparency will help build trust within the organization.",
      "sampleZh": "创建透明文化将有助于在组织内部建立信任。"
    }
  ],
  "m12s3": [
    {
      "id": "m12s3-p1",
      "prompt": "在『STAR 法则』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『STAR 法则』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『STAR 法则』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "I admire your global supply-chain practice and want to contribute my market-entry experience.",
      "sampleZh": "我钦佩你们的全球供应链实践，并希望贡献我的市场进入经验。"
    },
    {
      "id": "m12s3-p2",
      "prompt": "在『常见问答』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『常见问答』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『常见问答』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Sure. I'm a marketing specialist with five years of experience in cross-border campaigns.",
      "sampleZh": "当然。我是一名营销专员，在跨境营销活动方面有五年经验。"
    }
  ],
  "m12s4": [
    {
      "id": "m12s4-p1",
      "prompt": "在『思路建议』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『思路建议』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『思路建议』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "I hope to grow into a team-lead role and deepen my expertise in global marketing.",
      "sampleZh": "我希望成长为团队负责人，并深化我在全球营销方面的专业能力。"
    },
    {
      "id": "m12s4-p2",
      "prompt": "在『高分回答』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『高分回答』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『高分回答』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "I listen first, find common ground, and propose a data-backed compromise.",
      "sampleZh": "我先倾听，寻找共同点，然后提出有数据支撑的折中方案。"
    }
  ],
  "m1s1": [
    {
      "id": "m1s1-p1",
      "prompt": "请用英文在每日例会上同步你昨天完成的工作进展。",
      "context": "例会上，主管让大家简短同步进度。你可以说：完成了什么、结果如何、下一步是什么。",
      "hint": "用过去时描述已完成的事（finished / completed / wrapped up / shared），再用将来时说下一步。",
      "sampleEn": "Yesterday I finished the weekly report and shared it with the team. Today I will follow up on the client's feedback.",
      "sampleZh": "昨天我完成了周报并和团队同步了。今天我会跟进客户的反馈。"
    },
    {
      "id": "m1s1-p2",
      "prompt": "会议中你想礼貌地打断同事，补充一个要点，请说一句英文。",
      "context": "同事正在发言，你有一个重要补充，需要得体地插话。",
      "hint": "用 \"Sorry to interrupt, but...\" 或 \"If I may add...\" 开头最得体。",
      "sampleEn": "Sorry to interrupt, but I'd like to add one point about the timeline.",
      "sampleZh": "抱歉打断一下，但我想补充一点关于时间线的内容。"
    }
  ],
  "m1s2": [
    {
      "id": "m1s2-p1",
      "prompt": "作为项目负责人，请用英文介绍本项目的目标和关键里程碑。",
      "context": "项目启动会，需要让大家对齐目标与节奏。",
      "hint": "先说目标（goal / aim），再说里程碑（milestone），可用 by + 时间。",
      "sampleEn": "Our goal is to launch the new feature by the end of Q1. The key milestones are the design review in week 2 and the beta release in week 6.",
      "sampleZh": "我们的目标是在第一季度末上线新功能。关键里程碑是第 2 周的设计评审和第 6 周的 Beta 发布。"
    },
    {
      "id": "m1s2-p2",
      "prompt": "请向团队说明你在项目中的角色和分工。",
      "context": "启动会上每个人介绍自己的职责。",
      "hint": "用 \"I am responsible for...\" 或 \"My role is to...\" 说明你负责什么。",
      "sampleEn": "I am responsible for the marketing plan and the launch campaign. I will work closely with the design team.",
      "sampleZh": "我负责营销方案和发布活动。我会和设计团队紧密配合。"
    }
  ],
  "m1s3": [
    {
      "id": "m1s3-p1",
      "prompt": "你需要向另一个部门协商资源支持，请写一段英文请求。",
      "context": "你想请其他部门派一位同事协助你做数据。",
      "hint": "礼貌请求用 \"Could you...\" / \"Would it be possible to...\"，并说明价值。",
      "sampleEn": "Could your team provide one analyst to help us with the data analysis next week? It would really speed up the project.",
      "sampleZh": "你们团队下周能否派一位分析师协助我们做数据分析？这会大大加快项目进度。"
    },
    {
      "id": "m1s3-p2",
      "prompt": "当跨部门意见不一致时，请用英文表达你的异议并提议折中方案。",
      "context": "两部门对方案有分歧，你需要既表达立场又推动共识。",
      "hint": "先认可对方 \"I see your point\"，再提 \"How about we...\" 折中。",
      "sampleEn": "I see your point, but the timeline is too tight. How about we start with a smaller pilot and expand later?",
      "sampleZh": "我理解你的想法，但时间太紧了。不如我们先做个小范围试点，之后再扩展？"
    }
  ],
  "m1s4": [
    {
      "id": "m1s4-p1",
      "prompt": "在绩效面谈中，请用英文做一段简短的自我评价。",
      "context": "一对一绩效评估，先说自己这半年的成长与交付。",
      "hint": "用 \"I think I have improved in...\" 客观说成长，再给一个事实支撑。",
      "sampleEn": "I think I have improved my communication with cross-functional teams. I delivered all my projects on time this half year.",
      "sampleZh": "我觉得自己在跨团队沟通上有进步。这半年我所有的项目都按时交付了。"
    },
    {
      "id": "m1s4-p2",
      "prompt": "请向主管提出你接下来的发展诉求或想提升的能力。",
      "context": "绩效面谈末尾，谈个人发展与下一阶段目标。",
      "hint": "用 \"I would like to...\" / \"I hope to improve my...\" 表达诉求。",
      "sampleEn": "I would like to improve my presentation skills, and I hope to lead a small project next quarter.",
      "sampleZh": "我想提升演讲能力，也希望下个季度能牵头一个小项目。"
    }
  ],
  "m2s1": [
    {
      "id": "m2s1-p1",
      "prompt": "在『进展与亮点』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『进展与亮点』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『进展与亮点』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "We've received positive feedback from stakeholders regarding the progress so far.",
      "sampleZh": "我们从利益相关者那里收到了关于当前进展的积极反馈。"
    },
    {
      "id": "m2s1-p2",
      "prompt": "在『求助与资源』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『求助与资源』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『求助与资源』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "We need to escalate this issue to senior management if it's not resolved soon.",
      "sampleZh": "如果这个问题不尽快解决，我们需要向高级管理层汇报。"
    }
  ],
  "m2s2": [
    {
      "id": "m2s2-p1",
      "prompt": "在『方案与价值论证』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『方案与价值论证』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『方案与价值论证』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "We can integrate carbon footprint visualization in Scene 3. Does that align with their ESG goals？",
      "sampleZh": "可在第三场景加入碳足迹可视化，是否符合其 ESG目标？"
    },
    {
      "id": "m2s2-p2",
      "prompt": "在『答疑与答辩』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『答疑与答辩』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『答疑与答辩』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "That would require cloud migration and CDN optimization. Let's discuss cost implications.",
      "sampleZh": "这需要云端迁移和 CDN优化，讨论下成本影响"
    }
  ],
  "m2s3": [
    {
      "id": "m2s3-p1",
      "prompt": "在『观点铺陈与论据』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『观点铺陈与论据』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『观点铺陈与论据』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "The role of leadership in fostering a culture of innovation cannot be overstated.",
      "sampleZh": "领导力在促进创新文化中的作用不可忽视。"
    },
    {
      "id": "m2s3-p2",
      "prompt": "在『金句与记忆点』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『金句与记忆点』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『金句与记忆点』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "lt's an honor to be here today to share insights on the future of our industry.",
      "sampleZh": "今天很荣幸在这里与大家分享我们行业的未来趋势。"
    }
  ],
  "m2s4": [
    {
      "id": "m2s4-p1",
      "prompt": "在『行为面试提问』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『行为面试提问』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『行为面试提问』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "How do you ensure alignment between your vision and the team's execution？\"-",
      "sampleZh": "您如何确保您的愿景与团队执行的一致性？"
    },
    {
      "id": "m2s4-p2",
      "prompt": "在『候选人答疑』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『候选人答疑』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『候选人答疑』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "What steps do you take to ensure cultural fit when making hiring decisions？",
      "sampleZh": "在做出招聘决定时，您采取哪些步骤确保文化契合度？"
    }
  ],
  "m3s1": [
    {
      "id": "m3s1-p1",
      "prompt": "在『开放式提问』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『开放式提问』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『开放式提问』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "We categorize clients based on purchase frequency and average order value.",
      "sampleZh": "我们按购买频率和平均订单金额分级客户。"
    },
    {
      "id": "m3s1-p2",
      "prompt": "在『需求复述确认』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『需求复述确认』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『需求复述确认』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "We aim to increase brand awareness by 30% in Q3 through digital channels.",
      "sampleZh": "我们计划通过数字渠道在第三季度将品牌知名度提升30%。"
    }
  ],
  "m3s2": [
    {
      "id": "m3s2-p1",
      "prompt": "在『需求与底线』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『需求与底线』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『需求与底线』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "For custom orders, we allow 10% MOQ reduction with 3 additional SKUs. Shall l draft an updated PI？",
      "sampleZh": "定制订单可增加3个SKU 并减少10%起订量。需要更新形式发票吗？"
    },
    {
      "id": "m3s2-p2",
      "prompt": "在『条款与让步』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『条款与让步』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『条款与让步』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "We need to sign a non-disclosure agreement before sharing sensitive information.",
      "sampleZh": "在共享敏感信息之前，我们需要签署一份保密协议。"
    }
  ],
  "m3s3": [
    {
      "id": "m3s3-p1",
      "prompt": "在『题目与量表』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『题目与量表』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『题目与量表』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Thank you for participating in our survey design discussion. Shall we start by confirming the evaluation dimensions？",
      "sampleZh": "感谢参与问卷设计讨论，我们先确认评估维度好吗？"
    },
    {
      "id": "m3s3-p2",
      "prompt": "在『结果解读』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『结果解读』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『结果解读』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Your draft missed 3 required compliance questions. When can we get the updated version？",
      "sampleZh": "贵方初稿遗漏3个合规性问题，何时能提供更新版？"
    }
  ],
  "m3s4": [
    {
      "id": "m3s4-p1",
      "prompt": "在『问题与责任界定』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『问题与责任界定』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『问题与责任界定』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "This is your dedicated account manager speaking. I understand you're dissatisfied with our onsite technicians.",
      "sampleZh": "我是您的专属客户经理，了解到您对现场技术员不满。"
    },
    {
      "id": "m3s4-p2",
      "prompt": "在『时效与跟进』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『时效与跟进』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『时效与跟进』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Verified the anomalies. We'll dispatch replacement units within 48 hours with prepaid return labels.",
      "sampleZh": "已确认异常，我们将48 小时内发出替换品并附退回标签。"
    }
  ],
  "m4s1": [
    {
      "id": "m4s1-p1",
      "prompt": "在『样本与数据』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『样本与数据』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『样本与数据』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Run robustness checks with alternative estimation methods. Also, compare with last quarter's elasticity data.",
      "sampleZh": "用不同估算方法做稳健性检验，并与上季度弹性数据对比。"
    },
    {
      "id": "m4s1-p2",
      "prompt": "在『结论与呈现』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『结论与呈现』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『结论与呈现』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Good point. I'll modify the filtering questions in Section B. How about the product usage frequency scale？",
      "sampleZh": "建议合理，我将修改B部分的筛选题。产品使用频率量表用5级制如何？"
    }
  ],
  "m4s2": [
    {
      "id": "m4s2-p1",
      "prompt": "在『SWOT 讨论』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『SWOT 讨论』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『SWOT 讨论』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Cross-functional collaboration will be essential to implementing this strategy.",
      "sampleZh": "跨职能合作对实施该战略至关重要。"
    },
    {
      "id": "m4s2-p2",
      "prompt": "在『资源与排期』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『资源与排期』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『资源与排期』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Let's identify key milestones for tracking our progress throughoutthe year.",
      "sampleZh": "让我们确定全年跟踪进展的关键里程碑。"
    }
  ],
  "m4s3": [
    {
      "id": "m4s3-p1",
      "prompt": "在『可行性辩论』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『可行性辩论』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『可行性辩论』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Our innovation strategy should align with the specific needs of this new market.",
      "sampleZh": "我们的创新战略应与这个新市场的特定需求保持一致。"
    },
    {
      "id": "m4s3-p2",
      "prompt": "在『试点与验证』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『试点与验证』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『试点与验证』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "How do we ensure our growth strategy aligns with long-term business objectives？",
      "sampleZh": "我们如何确保我们的增长战略与长期业务目标一致？"
    }
  ],
  "m4s4": [
    {
      "id": "m4s4-p1",
      "prompt": "在『定位与取舍』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『定位与取舍』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『定位与取舍』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Let's review the market entry timeline. Where are we on competitor analysis？",
      "sampleZh": "我们回顾下市场进入时间表。竞争对手分析进展如何？"
    },
    {
      "id": "m4s4-p2",
      "prompt": "在『渠道与伙伴』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『渠道与伙伴』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『渠道与伙伴』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "We've identified top 3 players, but need deeper pricing strategy insights.",
      "sampleZh": "已确认前三竞品，但需更深入的定价策略分析。"
    }
  ],
  "m5s1": [
    {
      "id": "m5s1-p1",
      "prompt": "在『资产评估』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『资产评估』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『资产评估』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "The emotional resonance scores show 80% confidence level for \"innovative\" attributes.",
      "sampleZh": "\"创新\"属性的情感共鸣分数置信度为80%。"
    },
    {
      "id": "m5s1-p2",
      "prompt": "在『声量与传播』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『声量与传播』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『声量与传播』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Interbrand methodology implementation is 80% complete, awaiting final IRR validation.",
      "sampleZh": "英特品牌方法论执行已完成80％，等待最终内部收益率验证。"
    }
  ],
  "m5s2": [
    {
      "id": "m5s2-p1",
      "prompt": "在『法规与标识』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『法规与标识』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『法规与标识』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Let's start with the primary packaging layout. What's your take on the logo placement？",
      "sampleZh": "我们从主包装版面开始讨论。你对Logo 位置怎么看？"
    },
    {
      "id": "m5s2-p2",
      "prompt": "在『差异化卖点』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『差异化卖点』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『差异化卖点』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Suggest keeping the core logo traditional while experimenting with secondary elements.",
      "sampleZh": "建议保持核心Logo 传统，在次要元素上创新。"
    }
  ],
  "m5s3": [
    {
      "id": "m5s3-p1",
      "prompt": "在『媒体沟通』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『媒体沟通』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『媒体沟通』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "The convention center is confirmed for March 15th. AV setup details need approval by Friday.",
      "sampleZh": "会展中心已定在3月15日，视听设备方案需周五前审批。"
    },
    {
      "id": "m5s3-p2",
      "prompt": "在『预热造势』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『预热造势』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『预热造势』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Pre-launch marketing is essential for generating interest before the official release.",
      "sampleZh": "发布前营销对于在正式发布前产生兴趣至关重要。〝"
    }
  ],
  "m5s4": [
    {
      "id": "m5s4-p1",
      "prompt": "在『成长期策略』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『成长期策略』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『成长期策略』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Competitive analysis will help us identify opportunities and threats in the market.",
      "sampleZh": "竞争分析将帮助我们识别市场中的机会和威胁。"
    },
    {
      "id": "m5s4-p2",
      "prompt": "在『衰退期策略』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『衰退期策略』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『衰退期策略』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "End-of-life （EOL） management is crucial for minimizing risks and maximizing value.",
      "sampleZh": "产品终止管理对于最小化风险和最大化价值至关重要。"
    }
  ],
  "m6s1": [
    {
      "id": "m6s1-p1",
      "prompt": "在『排期沟通』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『排期沟通』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『排期沟通』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "\"Which metrics should we focus on？\" MP. \"We should track click-through rates, conversion rates, and social media interactions.\"",
      "sampleZh": "MP.\"广告互动指标将帮助我们了解活动的表现情况。“"
    },
    {
      "id": "m6s1-p2",
      "prompt": "在『创意评审』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『创意评审』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『创意评审』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Our media strategy should include a mix of digital, print, and broadcast outlets.",
      "sampleZh": "我们的媒体策略应包括数字、印刷和广播渠道的组合。"
    }
  ],
  "m6s2": [
    {
      "id": "m6s2-p1",
      "prompt": "在『内容日历』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『内容日历』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『内容日历』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Proposing bi-weekly industry expert AMAs. Need your approval for influencer budget.",
      "sampleZh": "建议双周行业专家问答，需要您批准 KOL预算"
    },
    {
      "id": "m6s2-p2",
      "prompt": "在『选题评审』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『选题评审』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『选题评审』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Attaching granular metrics in the shared drive. Note the cliff at 7-minute mark.",
      "sampleZh": "已上传详细数据到共享盘，注意7分钟处的断崖下跌"
    }
  ],
  "m6s3": [
    {
      "id": "m6s3-p1",
      "prompt": "在『脚本结构』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『脚本结构』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『脚本结构』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Let's start with the core message. What emotional trigger are we targeting？",
      "sampleZh": "我们从核心信息开始。这次要触发什么情感共鸣？"
    },
    {
      "id": "m6s3-p2",
      "prompt": "在『分镜评审』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『分镜评审』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『分镜评审』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "l can source user-generated content from our hashtag challenge.",
      "sampleZh": "可以从标签挑战赛获取用户生成内容。"
    }
  ],
  "m6s4": [
    {
      "id": "m6s4-p1",
      "prompt": "在『合规审校』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『合规审校』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『合规审校』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "The content calendar conflicts with the product launch date.",
      "sampleZh": "内容排期与产品发布日期冲突。"
    },
    {
      "id": "m6s4-p2",
      "prompt": "在『A/B 测试』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『A/B 测试』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『A/B 测试』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Let' s schedule an A/B test for the two headline versions.",
      "sampleZh": "建议为两个标题版本安排A/B测试。"
    }
  ],
  "m7s1": [
    {
      "id": "m7s1-p1",
      "prompt": "在『素材迭代』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『素材迭代』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『素材迭代』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Increasing website traffic should be a key objective of our digital marketing efforts.",
      "sampleZh": "增加网站流量应是我们数字营销工作的关键目标。"
    },
    {
      "id": "m7s1-p2",
      "prompt": "在『人群优化』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『人群优化』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『人群优化』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Let me pull demographic breakdowns first. Which age group showed the steepest decline？",
      "sampleZh": "我先拉取人口统计细分数据，哪个年龄段跌幅最大？"
    }
  ],
  "m7s2": [
    {
      "id": "m7s2-p1",
      "prompt": "在『打开率优化』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『打开率优化』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『打开率优化』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Targeted content increases relevance by 40% according to our A/B tests.",
      "sampleZh": "根据A/B测试数据，定向内容可使相关性提升40%。"
    },
    {
      "id": "m7s2-p2",
      "prompt": "在『触发时机』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『触发时机』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『触发时机』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "We recommend segmenting your audience based on purchase history.",
      "sampleZh": "我们建议根据购买历史进行客户细分。"
    }
  ],
  "m7s3": [
    {
      "id": "m7s3-p1",
      "prompt": "在『发布规范』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『发布规范』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『发布规范』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Measuring social media ROl will help us understand the effectiveness of our efforts.",
      "sampleZh": "衡量社交媒体投资回报率将帮助我们了解我们工作的有效性。"
    },
    {
      "id": "m7s3-p2",
      "prompt": "在『危机预案』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『危机预案』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『危机预案』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "We need to develop a comprehensive social media strategy for the new campaign.",
      "sampleZh": "我们需要为新活动制定一个全面的社交媒体策略。"
    }
  ],
  "m7s4": [
    {
      "id": "m7s4-p1",
      "prompt": "在『报价谈判』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『报价谈判』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『报价谈判』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "This campaign requires posting identical content on both Instagram and Xiaohongshu.",
      "sampleZh": "本次活动需在 Instagram 和小红书发布相同内容。"
    },
    {
      "id": "m7s4-p2",
      "prompt": "在『合同风险』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『合同风险』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『合同风险』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Our standard rate for this package is $8,000. Would that fit your budget？",
      "sampleZh": "该套餐标准报价 8,000美元。是否符合贵方预算？"
    }
  ],
  "m8s1": [
    {
      "id": "m8s1-p1",
      "prompt": "在『威胁研判』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『威胁研判』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『威胁研判』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "We should develop a competitor profiling strategy to keep track of their activities.",
      "sampleZh": "我们应该制定竞争对手剖析策略，以跟踪他们的活动。"
    },
    {
      "id": "m8s1-p2",
      "prompt": "在『价格对标』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『价格对标』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『价格对标』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Understanding the entry barriers in our industry is crucal for strategic planning.\"-",
      "sampleZh": "了解我们行业的进入壁垒对于战略规划至关重要。"
    }
  ],
  "m8s2": [
    {
      "id": "m8s2-p1",
      "prompt": "在『促销跟随』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『促销跟随』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『促销跟随』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Prepare battle cards showing our value proposition. ！：Suggest highlighting lifetime technical support.",
      "sampleZh": "准备展示我们价值主张的应对卡片建议强调终生技术支持服务"
    },
    {
      "id": "m8s2-p2",
      "prompt": "在『竞品监测』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『竞品监测』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『竞品监测』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "The Australian branch reported new bundle deals from Competitor Y.",
      "sampleZh": "澳洲分部报告竞品Y推出了新捆绑套餐"
    }
  ],
  "m8s3": [
    {
      "id": "m8s3-p1",
      "prompt": "在『画像描述』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『画像描述』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『画像描述』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Our survey shows 25-34 cohort accounts for 45% purchases. Suggest making this primary segment.",
      "sampleZh": "调研显示 25-34岁群体占45%购买量，建议列为核心细分"
    },
    {
      "id": "m8s3-p2",
      "prompt": "在『价值分层』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『价值分层』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『价值分层』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Transaction frequency segmentation identifies dormant accounts. Reactivation strategy？",
      "sampleZh": "交易频率细分识别出沉睡账户，激活策略？"
    }
  ],
  "m8s4": [
    {
      "id": "m8s4-p1",
      "prompt": "在『经销政策』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『经销政策』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『经销政策』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "We're deploying mobile stock check devices next week. Meanwhile, prioritize manual override codes 221-226.",
      "sampleZh": "下周部署移动盘库设备，期间优先使用221-226人工覆盖代码。"
    },
    {
      "id": "m8s4-p2",
      "prompt": "在『伙伴赋能』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『伙伴赋能』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『伙伴赋能』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "We noticed a 15% drop in sell-through rate last quarter. Could you share your channel performance data？",
      "sampleZh": "我们发现上季度售罄率下降15%，能否分享渠道绩效数据？"
    }
  ],
  "m9s1": [
    {
      "id": "m9s1-p1",
      "prompt": "在『口径统一』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『口径统一』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『口径统一』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Let's conduct a quick risk assessment to understand the scope of the problem.",
      "sampleZh": "让我们快速进行风险评估，了解问题的范围。"
    },
    {
      "id": "m9s1-p2",
      "prompt": "在『升级决策』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『升级决策』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『升级决策』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "We'll need a detailed plan for crisis resolution within the next few hours.",
      "sampleZh": "我们需要在接下来的几小时内制定详细的危机解决计划。"
    }
  ],
  "m9s2": [
    {
      "id": "m9s2-p1",
      "prompt": "在『媒体应答』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『媒体应答』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『媒体应答』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "We need to evaluate the effectiveness of our crisis management efforts after the",
      "sampleZh": "是否有效。"
    },
    {
      "id": "m9s2-p2",
      "prompt": "在『舆情研判』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『舆情研判』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『舆情研判』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "We must focus on reputation management to minimize the impact of this crisis.",
      "sampleZh": "我们必须专注于声誉管理，以将这次危机的影响降至最低。"
    }
  ],
  "m9s3": [
    {
      "id": "m9s3-p1",
      "prompt": "在『响应时效』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『响应时效』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『响应时效』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "Your statement mentioned \"operational adjustments\". Could you elaborate？",
      "sampleZh": "贵司声明提到”运营调整\"，能否具体说明？"
    },
    {
      "id": "m9s3-p2",
      "prompt": "在『平台应对』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『平台应对』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『平台应对』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "We're optimizing regional warehouse networks to enhance efficiency.",
      "sampleZh": "我们正在优化区域仓配网络以提升效率。"
    }
  ],
  "m9s4": [
    {
      "id": "m9s4-p1",
      "prompt": "在『影响评估』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『影响评估』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『影响评估』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "What are the potential legal risks if we fail to comply with the new regulations？",
      "sampleZh": "如果我们未能遵守新法规，可能面临哪些法律风险？"
    },
    {
      "id": "m9s4-p2",
      "prompt": "在『跨境合规』这一环节，请用英文完成一段得体的商务表达（开口说一句或写一句都可以）。",
      "context": "场景聚焦『跨境合规』。先想清楚你要达成的目的，再用简洁的英文把要点说清楚——不必追求长句，准确和自然更重要。",
      "hint": "可参考本场景的真实例句来仿写，重点是把『跨境合规』的核心动作（如请求、说明、协商、安抚等）表达到位。",
      "sampleEn": "We need to align our corporate strategy with the evolving regulatory landscape.",
      "sampleZh": "我们需要将公司战略与不断变化的监管环境保持一致。"
    }
  ]
};

if (typeof window !== 'undefined') window.PRACTICE_QUESTIONS = PRACTICE_QUESTIONS;
