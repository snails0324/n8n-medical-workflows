# n8n Medical Automation Workflows

這個 repository 是獨立的 n8n／Docker 自動化專案，與 herb image recognition 專案分開管理。內容包含 Docker Compose 啟動設定、醫療問診 workflow 的公開版匯出，以及 LINE／Discord 整合流程的設計範例。

## What this project demonstrates

- Docker Compose 部署 n8n 與 PostgreSQL
- LINE／Discord 訊息觸發與回覆
- Ollama LLM、Qdrant 向量資料庫與結構化輸出
- 基本病歷資料收集與當次症狀問診分流
- 醫療安全停止條件與錯誤回覆流程

## Repository layout

```text
.
├── compose.yaml
├── .env.example
├── workflows/
│   ├── current-export.json
│   ├── discord-workflow.json
│   └── line-medical-triage.json
└── scripts/
    └── sanitize-workflows.js
```

## Run locally

```bash
copy .env.example .env   # Windows
# cp .env.example .env  # macOS/Linux
docker compose up -d
```

啟動後開啟 <http://localhost:5678>。匯入 `workflows/` 裡的 JSON 後，請在 n8n 重新建立並綁定自己的 credentials，再依照環境調整 LINE、Discord、Ollama、Qdrant 與 PostgreSQL 設定。

`MEDICAL_CORPUS_DIR` 是唯讀掛載的外部資料路徑；公開 repository 不包含醫療語料、n8n database、執行 log 或 `.env`。

## Public-repository safety

公開 workflow 已移除 credential 物件、內部 workflow metadata、webhook id 與啟用狀態。匯入後必須自行重新綁定 credentials，且預設不會自動啟用 workflow。請不要把 API key、bot token、資料庫密碼或病人資料提交到 GitHub。

## Portfolio scope

這裡展示的是 workflow architecture 與自動化設計；運行所需的 secrets、資料庫與醫療語料屬於本機部署內容，不作為公開作品集的一部分。
