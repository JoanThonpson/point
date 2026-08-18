export interface Team {
  id: string
  name: string
  description: string
  location: string
  createdAt: string
}

export interface ChecklistItem {
  id: string
  teamId: string
  label: string
  checked: boolean
  checkedAt?: string
}

export interface AppState {
  teams: Team[]
  items: ChecklistItem[]
}

const DEFAULT_STATE: AppState = {
  teams: [
    {
      id: "team-1",
      name: "Equipe Alpha",
      description: "Responsável pela área norte do complexo",
      location: "Setor Norte",
      createdAt: "2026-08-01",
    },
    {
      id: "team-2",
      name: "Equipe Beta",
      description: "Cobertura da área sul e manutenção geral",
      location: "Setor Sul",
      createdAt: "2026-08-03",
    },
    {
      id: "team-3",
      name: "Equipe Gama",
      description: "Inspeção de equipamentos e segurança leste",
      location: "Setor Leste",
      createdAt: "2026-08-05",
    },
  ],
  items: [
    { id: "i-1", teamId: "team-1", label: "Verificação de extintores — Bloco A", checked: true, checkedAt: "2026-08-17 08:32" },
    { id: "i-2", teamId: "team-1", label: "Inspeção de saídas de emergência", checked: true, checkedAt: "2026-08-17 09:10" },
    { id: "i-3", teamId: "team-1", label: "Teste de iluminação de emergência", checked: false },
    { id: "i-4", teamId: "team-1", label: "Checagem de hidrantes — corredor principal", checked: false },
    { id: "i-5", teamId: "team-1", label: "Relatório de vistoria assinado", checked: false },
    { id: "i-6", teamId: "team-2", label: "Verificação de extintores — Bloco B", checked: true, checkedAt: "2026-08-17 07:55" },
    { id: "i-7", teamId: "team-2", label: "Limpeza de drenagem pluvial", checked: true, checkedAt: "2026-08-17 10:20" },
    { id: "i-8", teamId: "team-2", label: "Inspeção de quadro elétrico", checked: true, checkedAt: "2026-08-17 11:05" },
    { id: "i-9", teamId: "team-2", label: "Sinalização de piso verificada", checked: false },
    { id: "i-10", teamId: "team-3", label: "Calibração de equipamentos de medição", checked: false },
    { id: "i-11", teamId: "team-3", label: "Revisão de EPIs disponíveis", checked: true, checkedAt: "2026-08-17 08:00" },
    { id: "i-12", teamId: "team-3", label: "Teste de alarme de incêndio", checked: false },
  ],
}

function load(): AppState {
  try {
    const raw = localStorage.getItem("ops_state")
    if (raw) return JSON.parse(raw) as AppState
  } catch {}
  return DEFAULT_STATE
}

function save(state: AppState) {
  localStorage.setItem("ops_state", JSON.stringify(state))
}

let _state: AppState = load()
const _listeners: Array<() => void> = []

export function getState(): AppState {
  return _state
}

export function subscribe(fn: () => void) {
  _listeners.push(fn)
  return () => {
    const idx = _listeners.indexOf(fn)
    if (idx >= 0) _listeners.splice(idx, 1)
  }
}

function notify() {
  save(_state)
  _listeners.forEach((fn) => fn())
}

export function addTeam(name: string, description: string, location: string) {
  const team: Team = {
    id: `team-${Date.now()}`,
    name,
    description,
    location,
    createdAt: new Date().toISOString().slice(0, 10),
  }
  _state = { ..._state, teams: [..._state.teams, team] }
  notify()
  return team
}

export function removeTeam(id: string) {
  _state = {
    ..._state,
    teams: _state.teams.filter((t) => t.id !== id),
    items: _state.items.filter((i) => i.teamId !== id),
  }
  notify()
}

export function addItem(teamId: string, label: string) {
  const item: ChecklistItem = {
    id: `i-${Date.now()}`,
    teamId,
    label,
    checked: false,
  }
  _state = { ..._state, items: [..._state.items, item] }
  notify()
}

export function removeItem(id: string) {
  _state = { ..._state, items: _state.items.filter((i) => i.id !== id) }
  notify()
}

export function editTeam(id: string, name: string, description: string, location: string) {
  _state = {
    ..._state,
    teams: _state.teams.map((t) => (t.id === id ? { ...t, name, description, location } : t)),
  }
  notify()
}

export function editItem(id: string, label: string) {
  _state = {
    ..._state,
    items: _state.items.map((i) => (i.id === id ? { ...i, label } : i)),
  }
  notify()
}

export function toggleItem(id: string) {
  _state = {
    ..._state,
    items: _state.items.map((i) =>
      i.id === id
        ? {
            ...i,
            checked: !i.checked,
            checkedAt: !i.checked
              ? new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
              : undefined,
          }
        : i
    ),
  }
  notify()
}
