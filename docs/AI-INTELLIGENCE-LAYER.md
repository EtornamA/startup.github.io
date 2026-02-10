# FUTR — AI Intelligence Layer

Technical roadmap and spec for turning FUTR from a static planner into an intelligent assistant. Backend moves from **CRUD** to **RAG** (Retrieval-Augmented Generation) + **Action**.

---

## 1. Logic Framework

### A. Smart Parser (Syllabus / Screenshot → Data)

| Step | Description |
|------|-------------|
| **Input** | User uploads image or PDF (syllabus or portal dashboard). |
| **OCR & Vision** | Model extracts raw text and spatial coordinates (tables, layout). |
| **Schema mapping** | AI maps text to `Course_Name`, `Assignment_Title`, `Due_Date`, `Weight`. |
| **Verification** | System returns a **Draft Schedule** for one-click confirmation. |

### B. Time-Blocker (Task → Calendar)

| Step | Description |
|------|-------------|
| **Constraint check** | Identify hard blocks: lectures, sleep, meetings. |
| **Weighting** | Sort assignments by `Priority` and `Estimated_Time`. |
| **Fragmenting** | Break long tasks (e.g. 5h “High”) into sprints (e.g. 60 min). |
| **Placement** | Insert sprints into first available gaps in calendar with buffers. |

---

## 2. Engineering Phases (Master Prompt)

**Project:** FUTR — AI Intelligence Layer  
**Objective:** Move from manual student planner to an AI-automated productivity ecosystem.

### Phase 1: Multimodal Data Ingestion (Vision API)

**Goal:** Remove manual entry for classes and assignments.

- **Implementation:** Use a Vision model (e.g. Gemini 1.5 Pro) to parse uploaded screenshots of syllabi or portal dashboards.
- **Output:** JSON matching current `Task` / `Class` (and `Deadline`) schema.
- **Edge case:** Ambiguous dates (e.g. “Monday”) must be resolved using current date context (year, month).

### Phase 2: Autonomous Time-Blocking Engine

**Goal:** Turn the to-do list into a real schedule.

- **Logic:** Scheduling algorithm that reads `Estimated_Time` from assignments and availability from Calendar.
- **Feature:** “Auto-Schedule” button that fills the calendar with “Deep Work” blocks.
- **Constraint:** 10-minute buffer between back-to-back blocks.

### Phase 3: Performance & Predictive Analytics

**Goal:** “What-if” grade tracking.

- **Data:** `Weight` on assignments (already in schema where applicable).
- **AI:** “Progress Score” on Weekly Recap: likelihood of hitting target grades from current completion and weights.

### Phase 4: UI/UX — Tactile Minimalism

**Goal:** Bento grid and interaction feedback.

- **Classes:** Class cards as “live bento boxes”: next class location, pending task count, “Course Health” (Green / Yellow / Red).
- **Haptics:** Micro-animations (e.g. Framer Motion) for task completion and AI generation (e.g. Recap) to make AI feel tangible.

**Design polish:**

- **Focus Mode:** When active, sidebar subtly dims; Notebook surfaces only materials relevant to the current time-block.
- **Empty state:** Classes page with no classes = **drop zone** for syllabi with CTA: “Drop a Syllabus to Start”.

---

## 3. API Spec: Screenshot-to-JSON (Phase 1)

### Endpoint: Parse syllabus / screenshot

**Purpose:** Accept image or PDF, return structured class + deadlines for draft confirmation.

| Aspect | Detail |
|--------|--------|
| **Method** | `POST` |
| **Path** | `/api/v1/parse-syllabus` or Supabase Edge Function `parse-syllabus` (existing) extended for images. |
| **Auth** | Required (e.g. Bearer / session). |

#### Request

- **Content-Type:** `multipart/form-data` (or `application/json` with base64 image).
- **Body:**
  - `file`: image (PNG, JPEG, WebP) or PDF.
  - Optional: `contextDate` (ISO date string) for resolving “Monday”, “next week”, etc.

#### Response (200)

```json
{
  "success": true,
  "data": {
    "courseName": "Introduction to Algorithms",
    "courseCode": "CS 101",
    "professorName": "Jane Smith",
    "professorEmail": "jane@university.edu",
    "meetingDays": [1, 3, 5],
    "startTime": "09:00",
    "endTime": "09:50",
    "location": "Room 204",
    "semesterStart": "2025-01-13",
    "semesterEnd": "2025-05-02",
    "officeHours": {
      "day": "Wednesday",
      "time": "2-4pm",
      "location": "Office 101"
    },
    "deadlines": [
      {
        "title": "Problem Set 1",
        "type": "assignment",
        "dueDate": "2025-02-15",
        "weight": 10,
        "description": "Ch 1-3"
      }
    ],
    "confidence": {
      "courseName": "high",
      "schedule": "high",
      "deadlines": "medium"
    }
  }
}
```

Schema aligns with `SyllabusExtraction` and `ExtractedDeadline` in `src/types/classes.ts`.  
**Draft flow:** Return this payload → UI shows “Draft Schedule” → user confirms → create class + deadlines (and optionally calendar events).

#### Errors

- **400:** Invalid file type or missing file.
- **422:** Unparseable or low-confidence result; optional `suggestions` for user.
- **500:** Vision/OCR or internal error.

#### Implementation notes

- For **image input:** Use Vision API (e.g. Gemini) with a structured-output or prompt that forces the JSON shape above.
- For **PDF:** Either extract images and run Vision on each page, or use existing text extraction and LLM to map text → same JSON.
- **Idempotency:** Optional `requestId` to avoid duplicate processing on retry.

---

## 4. Data Model Additions (for Phases 2 & 3)

- **Assignments / tasks:** `estimatedTimeMinutes` (for time-blocking), `weight` (for grade prediction).  
  See `Assignment` in `src/types/index.ts` and `DeadlineData` / `ClassTodoData` in `src/types/classes.ts`.
- **Calendar:** Hard blocks (lectures, meetings, sleep) and “available” windows drive the Time-Blocker placement.

---

## 5. File / Code References

| Area | Path |
|------|------|
| Syllabus parsing (existing) | `src/hooks/useSyllabusParser.ts`, Supabase `parse-syllabus` |
| Import flow & draft review | `src/components/classes/ImportSyllabusDialog.tsx` |
| Classes list & empty state | `src/pages/ClassesPage.tsx` |
| Class cards (bento) | `src/components/classes/ClassCard.tsx` |
| Types (assignments, syllabus) | `src/types/index.ts`, `src/types/classes.ts` |
| Recap / analytics | `src/pages/RecapPage.tsx`, recap-related widgets |

Use this doc as the single source of truth for the AI Intelligence Layer; update as implementation evolves.
