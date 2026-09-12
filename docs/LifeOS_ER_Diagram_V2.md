### 文档 3：LifeOS_ER_Diagram_V2.md (数据库 ER 图)

_核心变更：化繁为简，重构为以 `TIME_ENTRIES` (时间日志) 和 `SHARED_RECORDS` (分享记录) 为核心的表结构。完美支持计划与实际比对。_

````markdown
# LifeOS V2 — 数据库 ER 图 (核心实体)

## 1. 核心设计说明

- **Intent vs Reality 分离**：`CALENDAR_EVENTS` 代表计划（例如：下午2点开会），`TIME_ENTRIES` 代表现实（例如：下午2:15才开始，3:00结束）。两者通过 `event_id` 关联。
- **社交分享层**：新增 `SHARED_RECORDS` 表，记录每次生成的分享快照及其隐私设置，用于公共 URL 的访问和数据统计。
- **正在运行的计时器**：不直接高频写库，仅记录 `start_time` 且 `end_time` 为 NULL，配合 Redis 缓存在客户端实时计算跳秒。

## 2. Mermaid ER 图

```mermaid
erDiagram
    USERS ||--o{ PROJECTS : manages
    USERS ||--o{ TASKS : owns
    USERS ||--o{ CALENDAR_EVENTS : schedules
    USERS ||--o{ TIME_ENTRIES : logs
    USERS ||--o{ TAGS : defines
    USERS ||--o{ SHARED_RECORDS : generates

    PROJECTS ||--o{ TASKS : contains
    TASKS ||--o{ TIME_ENTRIES : tracks
    TASKS ||--o{ TAG_ASSIGNMENTS : has

    CALENDAR_EVENTS ||--o{ TIME_ENTRIES : "actual time vs planned"
    TIME_ENTRIES ||--o{ TAG_ASSIGNMENTS : has

    SHARED_RECORDS }|--|| USERS : "belongs to"

    USERS {
        uuid user_id PK
        string email UK
        string display_name
        string timezone
        boolean is_public_profile_enabled
        timestamp created_at
    }

    PROJECTS {
        uuid project_id PK
        uuid user_id FK
        string name
        string color
        boolean is_archived
    }

    TASKS {
        uuid task_id PK
        uuid user_id FK
        uuid project_id FK "nullable"
        string title
        string status "todo, in_progress, done"
        int estimated_minutes
        timestamp due_date
    }

    CALENDAR_EVENTS {
        uuid event_id PK
        uuid user_id FK
        string title
        timestamp planned_start
        timestamp planned_end
        string external_event_id "sync with Google/Apple"
        uuid linked_task_id FK "nullable"
    }

    %% 核心时间引擎表 (Reality)
    TIME_ENTRIES {
        uuid entry_id PK
        uuid user_id FK
        uuid task_id FK "nullable"
        uuid event_id FK "nullable (links to Calendar)"
        timestamp start_time
        timestamp end_time "NULL means timer is running"
        int duration_seconds "calculated on stop"
        string entry_type "pomodoro, stopwatch, manual"
    }

    TAGS {
        uuid tag_id PK
        uuid user_id FK
        string name
        string color
    }

    TAG_ASSIGNMENTS {
        uuid assignment_id PK
        uuid tag_id FK
        string owner_type "TASK or TIME_ENTRY"
        uuid owner_id
    }

    %% 核心分享/病毒式增长表 (Viral Loop)
    SHARED_RECORDS {
        uuid share_id PK
        uuid user_id FK
        string share_slug UK "e.g. public short link"
        string share_type "daily_card, weekly_summary, project_journey"
        jsonb snapshot_data "frozen data for rendering"
        boolean hide_sensitive_names "privacy toggle"
        int view_count
        timestamp expires_at "nullable"
        timestamp created_at
    }
```
````

```
flowchart TB
    subgraph ClientLayer ["核心客户端 (React + Tauri + Expo)"]
        direction LR
        LocalDB[(SQLite 本地库)]
        UI["UI 层 (Zustand 状态)"]
        UI <-->|极速读写| LocalDB
    end

    subgraph SyncAndAuth ["BaaS 基础设施 (Serverless)"]
        Clerk["Clerk Auth\n(身份认证)"]
        PowerSync["PowerSync 桥接层\n(监听 Neon WAL)"]
        PartyKit["PartyKit / Pusher\n(WebSocket 计时器心跳)"]
    end

    subgraph DataLayer ["数据与分享 (云端)"]
        Neon[(Neon Serverless Postgres)]
        NextJS["Next.js /share\n(Vercel Edge)"]
        Satori["Satori\n(海报生成)"]
    end

    %% 认证与本地数据库同步
    UI -->|获取 Token| Clerk
    LocalDB <-->|断网恢复 / 增量同步| PowerSync
    PowerSync <-->|逻辑复制流 (Replication)| Neon

    %% 毫秒级时钟同步
    UI <-->|开始/停止 计时信号| PartyKit

    %% 分享页面工作流 (SEO端)
    NextJS -->|直连查询只读数据| Neon
    NextJS -->|动态生成图片| Satori
```
