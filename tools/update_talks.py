# -*- coding: utf-8 -*-
import re
from pathlib import Path

path = Path("../data/talks.js")
text = path.read_text(encoding="utf-8")

updates = {
    "in-kim-art-direction-ndc-2021": "./reports/打造让人愿意投入热爱的视觉知识产权.html",
    "juyoung-yang-scenario-ndc-2022": "./reports/为什么美少女游戏的女主角会戴着头套抢银行.html",
    "jeonghee-lee-scenario-direction-ndc-2022": "./reports/蔚蓝档案的二维剧情演出是怎样做出来的.html",
    "yongha-kim-romance-igc-2023": "./reports/二维角色收集游戏的浪漫.html",
    "yongha-kim-career-gstar-2021": "./reports/爱好者项目总监的职业回顾.html",
    "juyoung-yang-story-interview-2022": "./reports/为什么玩家没有跳过这段剧情.html",
    "blue-archive-music-roundtable-2023": "./reports/故事画面与音乐如何共同形成蔚蓝档案.html",
    "juyoung-yang-denfaminico-2024": "./reports/角色是人作者是组织虚构也能成为真实.html",
    "jonggyu-lim-directing-interview-2023": "./reports/让分散的创意朝向同一个版本愿景.html",
    "final-chapter-commentary-2023": "./reports/最终篇为何要在运营游戏中拥有一个结局.html",
    "second-developer-talk-2024": "./reports/从宣传片画面反向生成晄轮大祭故事.html",
    "minseo-cha-postmortem-ndc-2026": "./reports/从游戏总监视角复盘蔚蓝档案.html",
    "yongha-kim-authorship-ndc-2026": "./reports/做自己想玩的游戏创作者风格与持续运营.html",
}

pattern = re.compile(r"  \{\n    id: \"([^\"]+)\"[\s\S]*?\n  \},", re.M)
# last item has no comma
pattern_last = re.compile(r"  \{\n    id: \"([^\"]+)\"[\s\S]*?\n  \}\n\];", re.M)


def patch_block(block, talk_id):
    href = updates.get(talk_id)
    if not href:
        return block
    block = block.replace('status: "candidate"', 'status: "report"', 1)
    block = re.sub(r'href: "[^"]+"', f'href: "{href}"', block, count=1)
    return block


def repl(m):
    talk_id = m.group(1)
    return patch_block(m.group(0), talk_id)


text = pattern.sub(repl, text)
text = pattern_last.sub(lambda m: patch_block(m.group(0), m.group(1)), text)
path.write_text(text, encoding="utf-8")
print("report ids", len(updates))
print("candidate left", text.count('status: "candidate"'))
print("report count", text.count('status: "report"'))
