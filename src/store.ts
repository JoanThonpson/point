// src/store.ts
import { supabase, type Team, type ChecklistItem } from './services/supabase'

export type AppState = {
  teams: Team[]
  items: ChecklistItem[]
}

const _listeners: Array<() => void> = []

// Carrega dados iniciais do Supabase
let _state: AppState = { teams: [], items: [] }
let isLoading = true

export async function loadInitialState(): Promise<AppState> {
  if (isLoading) {
    await loadState()
  }
  return _state
}

async function loadState() {
  try {
    // Busca equipes
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('*')
      .order('name')

    if (teamsError) throw teamsError

    // Busca itens
    const { data: items, error: itemsError } = await supabase
      .from('checklist_items')
      .select('*')
      .order('label')

    if (itemsError) throw itemsError

    _state = {
      teams: teams || [],
      items: items || []
    }
    isLoading = false
    return _state
  } catch (error) {
    console.error('Error loading data from Supabase:', error)
    isLoading = false
    return _state
  }
}

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
  _listeners.forEach((fn) => fn())
}

// ── CRUD Operations ──────────────────────────────────────────────

export async function addTeam(name: string, description: string, location: string): Promise<Team> {
  const id = `team-${Date.now()}`
  const newTeam: Team = {
    id,
    name,
    description,
    location,
    created_at: new Date().toISOString()
  }

  const { error } = await supabase
    .from('teams')
    .insert([newTeam])

  if (error) throw error

  _state = {
    ..._state,
    teams: [..._state.teams, newTeam]
  }
  notify()
  return newTeam
}

export async function removeTeam(id: string): Promise<void> {
  // Remove itens relacionados primeiro (cascade)
  const { error: itemsError } = await supabase
    .from('checklist_items')
    .delete()
    .eq('team_id', id)

  if (itemsError) throw itemsError

  // Remove a equipe
  const { error: teamError } = await supabase
    .from('teams')
    .delete()
    .eq('id', id)

  if (teamError) throw teamError

  _state = {
    ..._state,
    teams: _state.teams.filter(t => t.id !== id),
    items: _state.items.filter(i => i.team_id !== id)
  }
  notify()
}

export async function editTeam(id: string, name: string, description: string, location: string): Promise<void> {
  const { error } = await supabase
    .from('teams')
    .update({ name, description, location })
    .eq('id', id)

  if (error) throw error

  _state = {
    ..._state,
    teams: _state.teams.map(t => t.id === id ? { ...t, name, description, location } : t)
  }
  notify()
}

export async function addItem(teamId: string, label: string): Promise<ChecklistItem> {
  const id = `i-${Date.now()}`
  const newItem: ChecklistItem = {
    id,
    team_id: teamId,
    label,
    checked: false,
    checked_at: null
  }

  const { error } = await supabase
    .from('checklist_items')
    .insert([newItem])

  if (error) throw error

  _state = {
    ..._state,
    items: [..._state.items, newItem]
  }
  notify()
  return newItem
}

export async function removeItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('checklist_items')
    .delete()
    .eq('id', id)

  if (error) throw error

  _state = {
    ..._state,
    items: _state.items.filter(i => i.id !== id)
  }
  notify()
}

export async function editItem(id: string, label: string): Promise<void> {
  const { error } = await supabase
    .from('checklist_items')
    .update({ label })
    .eq('id', id)

  if (error) throw error

  _state = {
    ..._state,
    items: _state.items.map(i => i.id === id ? { ...i, label } : i)
  }
  notify()
}

export async function toggleItem(id: string): Promise<void> {
  const item = _state.items.find(i => i.id === id)
  if (!item) return

  const newChecked = !item.checked
  const newCheckedAt = newChecked ? new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : null

  const { error } = await supabase
    .from('checklist_items')
    .update({ 
      checked: newChecked,
      checked_at: newCheckedAt
    })
    .eq('id', id)

  if (error) throw error

  _state = {
    ..._state,
    items: _state.items.map(i => 
      i.id === id 
        ? { ...i, checked: newChecked, checked_at: newCheckedAt }
        : i
    )
  }
  notify()
}