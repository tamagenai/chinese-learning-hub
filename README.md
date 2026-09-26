# 🇨🇳 中国語学習アプリ ポータル (Chinese Learning Hub)

先生が作成された複数の中国語学習Webアプリを1つに集約し、学生が迷わずアクセスできるように整理したポータルWebアプリです。大学生・学習者に親しみやすい**爽やかで明るいスカイブルー＆シアン（Sky Blue & Cyan）**のデザインを採用しています。

---

## 🌟 登録アプリ一覧 (全7件)

1. **🇨🇳 中国語名前チェッカー**
   * **URL**: `https://script.google.com/macros/s/AKfycbyOIG9DZtD_z-8CrB800megG-7g_cXJgDwbghtpZURWPX2MZnDJwi30vKHDfAxCRDA/exec`
   * **対象**: 入門〜全レベル（ツール・発音）
   * **概要**: 日本人の名前や漢字の中国語読み（ピンイン・声調）を瞬時に確認。自己紹介の準備に最適。

2. **✍️ 文法 4択クイズ (YUFA)**
   * **URL**: `https://tamagenai.github.io/YUFA/`
   * **対象**: 初級〜中級（文法・クイズ）
   * **概要**: 4択クイズ形式で基礎文法や語彙をサクサク実践・復習。

3. **🧩 BANBAN3種 (棒棒！中国語シリーズ)**
   * **URL**: `https://tamagenai.github.io/BANBAN/`
   * **対象**: 初級〜中級（総合トレーニング）
   * **概要**: 「棒棒！中国語」学習アプリ集（PWA対応）。多角的に総合力を鍛える学習シリーズ。

4. **🐼 自由説中文 (Speak Freely!)**
   * **URL**: `https://tamagenai.github.io/ZiyouShuoshuo/`
   * **対象**: 初級〜上級（スピーキング・会話）
   * **概要**: 音声認識を活用し、自由に中国語を話して発音・流暢さを鍛えるスピーキング特化アプリ。

5. **👨‍🏫 教員用 中国語名簿App**
   * **URL**: `https://script.google.com/macros/s/AKfycbzeE1gazRvBvgEDT-Y9up9yx-GW4q36gHemRA1ex09KNuzdlrG6A-C0tyJ0izbAFoYf/exec`
   * **対象**: 教員・管理者（教員用・名簿）
   * **概要**: 学生の氏名・中国語表記・ピンイン・声調を一括管理。出欠確認や授業時の指名、発音指導に活用可能。

6. **🎲 教員用 発表者指名App** ★NEW!
   * **URL**: `https://script.google.com/macros/s/AKfycbwP7gDsHTunD9CRHjjdHavrF2bzdr6_9Tt_WQOhX03sNDFGiklKd_bIDF_aoifWlPk/exec`
   * **対象**: 教員・管理者（教員用・指名）
   * **概要**: 授業中の発表者を公平・ランダムに指名し、「記録」と「設定」シートへ発表履歴や回数を自動反映。

7. **🌿 九種体質測定App**
   * **URL**: `https://script.google.com/macros/s/AKfycbwwj8x65kRnhHKgbOJMSKOss2BNrJBDzvlvY95XR8Tcsyn1NnZZ2todHrlp_PqzWw/exec`
   * **対象**: 全対象（ツール・管理 / 中医学・健康支援）
   * **概要**: 中医学（中国伝統医学）に基づく9つの体質タイプを自己診断。レーダーチャート分析、AIによる養生アドバイス、食材の性質（温・寒・平）検索など充実の健康管理・食養生アプリ。

---

## ✨ 主な機能

* **爽やかで明るいスカイブルー配色**: 清潔感と親しみやすさのある明るいブルーグラデーション。
* **ワンクリック共有**: 各カードの「共有」ボタンで学生用のリンクをワンタップコピー。
* **アプリ内プレビュー**: 「プレビュー」ボタンでポータル画面を離れずに直接アプリを試用可能。
* **リアルタイム検索 & 絞り込み**: キーワード検索、カテゴリタブ、レベル別フィルター、タグ絞り込みに対応。
* **おすすめ学習順**: Step 1（名前）→ Step 2（文法）→ Step 3（総合）→ Step 4（発話）の学習ロードマップを表示。
* **拡張性**: `apps-data.js` にオブジェクトを追加するだけで新しいアプリを即時追加可能。

---

## 📁 ファイル構成

```
chinese-learning-hub/
├── index.html       # ポータル画面本体
├── apps-data.js     # アプリデータ設定ファイル（ここを編集してアプリを追加・修正）
├── main.js          # 検索・フィルター・モーダル・コピー機能のロジック
├── style.css        # スカイブルー＆シアンの爽やかスタイル
└── README.md        # 本マニュアル
```
