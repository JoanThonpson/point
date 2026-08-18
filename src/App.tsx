//import { useState, useEffect, useCallback } from "react"
//import {
//  getState,
//  subscribe,
//  addTeam,
//  removeTeam,
//  editTeam,
//  addItem,
//  removeItem,
//  editItem,
//  toggleItem,
//  type Team,
//  type ChecklistItem,
//} from "./store"


// src/App.tsx
// src/App.tsx

import { useCallback, useEffect, useState } from 'react'
import { getState, subscribe, loadInitialState, removeTeam, editTeam, editItem, toggleItem, removeItem, addItem, addTeam } from './store'
import { ChecklistItem, Team } from './services/supabase'

function useAppState() {
  const [state, setState] = useState(getState())
  
  useEffect(() => {
    // Carrega dados iniciais
    loadInitialState().then(() => {
      setState({ ...getState() })
    })
  }, [])
  
  useEffect(() => {
    return subscribe(() => setState({ ...getState() }))
  }, [])
  
  return state
}

// ── Auth ──────────────────────────────────────────────────────────────────────
const ADMIN_USER = { username: "admin", password: "admin123" }

// ── Icons (inline SVG) ───────────────────────────────────────────────────────
function IconCheck({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconX({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
function IconChevronRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconPlus({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
function IconTrash({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 4h10M6 4V3h4v1M5 4l1 9h4l1-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconMap({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M1 4.5v12l6-3 6 3 6-3v-12l-6 3-6-3-6 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 1.5v12M13 4.5v12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
function IconLock({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function IconUser({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function IconArrowLeft({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconPencil({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconSave({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  return (
    <div className="flex items-center gap-2">
      <div style={{ flex: 1, height: 6, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: pct === 100 ? "#16a34a" : "#1e3a5f",
            borderRadius: 3,
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <span style={{ fontSize: 12, color: "#64748b", minWidth: 40, textAlign: "right" }}>
        {done}/{total}
      </span>
    </div>
  )
}

// ── Header ────────────────────────────────────────────────────────────────────
function Header({
  isAdmin,
  onLogin,
  onLogout,
  onGoAdmin,
  onGoHome,
}: {
  isAdmin: boolean
  onLogin: (u: string, p: string) => boolean
  onLogout: () => void
  onGoAdmin: () => void
  onGoHome: () => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ok = onLogin(username, password)
    if (ok) {
      setShowForm(false)
      setUsername("")
      setPassword("")
      setError("")
    } else {
      setError("Usuário ou senha incorretos.")
    }
  }

  return (
    <header
      style={{
        background: "#0f172a",
        color: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* Logo */}
        <button
          onClick={onGoHome}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#fff",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              background: "#1e3a5f",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <IconMap size={18} />
          </div>
          <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "-0.3px" }}>
            OpsCheck
          </span>
        </button>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isAdmin && (
            <button
              onClick={onGoAdmin}
              style={{
                padding: "7px 14px",
                borderRadius: 7,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.06)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
            >
              Painel Admin
            </button>
          )}
          {isAdmin ? (
            <button
              onClick={onLogout}
              style={{
                padding: "7px 14px",
                borderRadius: 7,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "transparent",
                color: "#94a3b8",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
            >
              <IconX size={14} />
              Sair
            </button>
          ) : (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowForm((v) => !v)}
                style={{
                  padding: "7px 16px",
                  borderRadius: 7,
                  border: "none",
                  background: "#1e3a5f",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#2a4f80")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#1e3a5f")}
              >
                <IconLock size={14} />
                Entrar
              </button>
              {showForm && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 12px)",
                    right: 0,
                    background: "#fff",
                    borderRadius: 12,
                    padding: 20,
                    width: 280,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                    border: "1px solid #e2e8f0",
                    zIndex: 100,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: 700,
                      fontSize: 15,
                      color: "#0f172a",
                      marginBottom: 14,
                    }}
                  >
                    Acesso Administrativo
                  </p>
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div>
                      <label style={{ fontSize: 12, color: "#64748b", fontWeight: 500, display: "block", marginBottom: 4 }}>
                        Usuário
                      </label>
                      <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="admin"
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: 7,
                          border: "1.5px solid #e2e8f0",
                          fontSize: 13,
                          outline: "none",
                          color: "#0f172a",
                          transition: "border 0.15s",
                        }}
                        onFocus={(e) => (e.currentTarget.style.border = "1.5px solid #1e3a5f")}
                        onBlur={(e) => (e.currentTarget.style.border = "1.5px solid #e2e8f0")}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: "#64748b", fontWeight: 500, display: "block", marginBottom: 4 }}>
                        Senha
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: 7,
                          border: "1.5px solid #e2e8f0",
                          fontSize: 13,
                          outline: "none",
                          color: "#0f172a",
                          transition: "border 0.15s",
                        }}
                        onFocus={(e) => (e.currentTarget.style.border = "1.5px solid #1e3a5f")}
                        onBlur={(e) => (e.currentTarget.style.border = "1.5px solid #e2e8f0")}
                      />
                    </div>
                    {error && (
                      <p style={{ fontSize: 12, color: "#dc2626", margin: 0 }}>{error}</p>
                    )}
                    <button
                      type="submit"
                      style={{
                        marginTop: 4,
                        padding: "9px",
                        borderRadius: 7,
                        border: "none",
                        background: "#1e3a5f",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#2a4f80")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#1e3a5f")}
                    >
                      Entrar
                    </button>
                    <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginTop: 2 }}>
                      demo: admin / admin123
                    </p>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isAdmin && (
        <div
          style={{
            background: "#16a34a",
            textAlign: "center",
            padding: "5px 0",
            fontSize: 12,
            fontWeight: 500,
            color: "#fff",
            letterSpacing: "0.3px",
          }}
        >
          <span style={{ display: "inline", verticalAlign: "middle", marginRight: 5 }}>
            <IconUser size={12} />
          </span>
          Logado como administrador — você pode criar equipes, gerenciar checklists e marcar atividades
        </div>
      )}
    </header>
  )
}

// ── Home Page ─────────────────────────────────────────────────────────────────
function HomePage({
  teams,
  items,
  isAdmin,
  onSelectTeam,
}: {
  teams: Team[]
  items: ChecklistItem[]
  isAdmin: boolean
  onSelectTeam: (id: string) => void
}) {
  const getTeamStats = (teamId: string) => {
    const teamItems = items.filter((i) => i.team_id === teamId)
    return { total: teamItems.length, done: teamItems.filter((i) => i.checked).length }
  }

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Hero */}
      <div style={{ marginBottom: 48 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 12px",
            borderRadius: 20,
            background: "#e0f2fe",
            color: "#0369a1",
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 16,
            letterSpacing: "0.4px",
            textTransform: "uppercase",
          }}
        >
          Monitoramento em Tempo Real
        </div>
        <h1
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1.15,
            marginBottom: 12,
            letterSpacing: "-0.5px",
          }}
        >
          Painel de Acompanhamento
          <br />
          <span style={{ color: "#1e3a5f" }}>das Equipes Operacionais</span>
        </h1>
        <p style={{ fontSize: 16, color: "#475569", maxWidth: 560, lineHeight: 1.6 }}>
          Acompanhe em tempo real o progresso de cada equipe. Clique em uma equipe para visualizar o mapa da área e o
          checklist de atividades.
        </p>
      </div>

      {/* Stats bar */}
      {teams.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {[
            { label: "Equipes Ativas", value: teams.length },
            {
              label: "Atividades Concluídas",
              value: items.filter((i) => i.checked).length,
            },
            {
              label: "Atividades Pendentes",
              value: items.filter((i) => !i.checked).length,
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: "20px 24px",
                border: "1px solid #e2e8f0",
              }}
            >
              <p style={{ fontSize: 13, color: "#64748b", fontWeight: 500, marginBottom: 4 }}>{s.label}</p>
              <p
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#0f172a",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Teams grid */}
      {teams.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 24px",
            background: "#fff",
            borderRadius: 16,
            border: "1px dashed #cbd5e1",
          }}
        >
          <p style={{ color: "#94a3b8", fontSize: 15 }}>
            Nenhuma equipe cadastrada ainda.
            {isAdmin && " Acesse o Painel Admin para criar equipes."}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 20,
          }}
        >
          {teams.map((team) => {
            const { total, done } = getTeamStats(team.id)
            const pct = total === 0 ? 0 : Math.round((done / total) * 100)
            const isComplete = total > 0 && done === total

            return (
              <button
                key={team.id}
                onClick={() => onSelectTeam(team.id)}
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: 24,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.08)"
                  e.currentTarget.style.borderColor = "#1e3a5f"
                  e.currentTarget.style.transform = "translateY(-2px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none"
                  e.currentTarget.style.borderColor = "#e2e8f0"
                  e.currentTarget.style.transform = "translateY(0)"
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <h2
                        style={{
                          fontFamily: "Outfit, sans-serif",
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        {team.name}
                      </h2>
                      {isComplete && (
                        <span
                          style={{
                            background: "#dcfce7",
                            color: "#16a34a",
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 20,
                            letterSpacing: "0.3px",
                          }}
                        >
                          CONCLUÍDO
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: "#64748b" }}>{team.location}</p>
                  </div>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: "#f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <IconMap size={20} />
                  </div>
                </div>

                <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{team.description}</p>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Progresso das atividades</span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: pct === 100 ? "#16a34a" : "#1e3a5f",
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                  <ProgressBar done={done} total={total} />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    color: "#1e3a5f",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Ver detalhes e mapa
                  <IconChevronRight size={15} />
                </div>
              </button>
            )
          })}
        </div>
      )}
    </main>
  )
}

// ── Team Detail Page ──────────────────────────────────────────────────────────
function TeamDetailPage({
  team,
  items,
  isAdmin,
  onBack,
}: {
  team: Team
  items: ChecklistItem[]
  isAdmin: boolean
  onBack: () => void
}) {
  const teamItems = items.filter((i) => i.team_id === team.id)
  const done = teamItems.filter((i) => i.checked).length
  const total = teamItems.length

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 80px" }}>
      {/* Breadcrumb */}
      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#64748b",
          fontSize: 14,
          fontWeight: 500,
          marginBottom: 28,
          padding: 0,
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#0f172a")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
      >
        <IconArrowLeft size={18} />
        Voltar para equipes
      </button>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "clamp(24px, 3vw, 36px)",
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: 6,
            letterSpacing: "-0.3px",
          }}
        >
          {team.name}
        </h1>
        <p style={{ color: "#64748b", fontSize: 15 }}>
          {team.location} — {team.description}
        </p>
      </div>

      {/* Mobile swipe hint */}
      <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 14 }}>↔</span> Deslize para ver mapa e checklist
      </p>

      {/* Two column layout: map + checklist — horizontally scrollable on mobile */}
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", marginLeft: -24, marginRight: -24, paddingLeft: 24, paddingRight: 24 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(300px, 1fr) minmax(320px, 400px)",
          gap: 24,
          alignItems: "start",
          minWidth: 660,
          scrollSnapType: "x mandatory",
        }}
      >
        {/* Map */}
        <div
          style={{
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid #e2e8f0",
            background: "#e2e8f0",
            position: "sticky",
            top: 88,
            scrollSnapAlign: "start",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=900&h=600&fit=crop&auto=format"
            alt={`Mapa da área — ${team.name}`}
            style={{ width: "100%", display: "block", aspectRatio: "4/3", objectFit: "cover" }}
          />
          <div
            style={{
              padding: "16px 20px",
              background: "#fff",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
                Mapa da Área
              </p>
              <p style={{ fontSize: 12, color: "#64748b" }}>{team.location}</p>
            </div>
            <div
              style={{
                padding: "4px 12px",
                borderRadius: 20,
                background: done === total && total > 0 ? "#dcfce7" : "#f1f5f9",
                color: done === total && total > 0 ? "#16a34a" : "#64748b",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {done}/{total} concluídos
            </div>
          </div>
        </div>

        {/* Checklist panel */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            scrollSnapAlign: "start",
          }}
        >
          {/* Panel header */}
          <div
            style={{
              padding: "20px 24px 16px",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <h2
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: 18,
                fontWeight: 700,
                color: "#0f172a",
                marginBottom: 12,
              }}
            >
              Checklist de Atividades
            </h2>
            <ProgressBar done={done} total={total} />
          </div>

          {/* Items */}
          <div style={{ padding: "8px 0" }}>
            {teamItems.length === 0 ? (
              <p style={{ padding: "32px 24px", color: "#94a3b8", fontSize: 14, textAlign: "center" }}>
                Nenhuma atividade cadastrada para esta equipe.
              </p>
            ) : (
              teamItems.map((item) => (
                <ChecklistRow key={item.id} item={item} isAdmin={isAdmin} />
              ))
            )}
          </div>

          {/* Legend */}
          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 4,
                  background: "#16a34a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconCheck size={10} />
              </div>
              <span style={{ fontSize: 12, color: "#64748b" }}>Concluído</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 4,
                  border: "2px solid #cbd5e1",
                  background: "#fff",
                }}
              />
              <span style={{ fontSize: 12, color: "#64748b" }}>Pendente</span>
            </div>
            {isAdmin && (
              <span style={{ fontSize: 12, color: "#1e3a5f", fontWeight: 600, marginLeft: "auto" }}>
                Clique para marcar
              </span>
            )}
          </div>
        </div>
      </div>
      </div>
    </main>
  )
}

function ChecklistRow({ item, isAdmin }: { item: ChecklistItem; isAdmin: boolean }) {
  const [hover, setHover] = useState(false)

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "12px 24px",
        background: hover && isAdmin ? "#f8fafc" : "transparent",
        transition: "background 0.15s",
        cursor: isAdmin ? "pointer" : "default",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => isAdmin && toggleItem(item.id)}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          border: item.checked ? "none" : "2px solid #cbd5e1",
          background: item.checked ? "#16a34a" : "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 1,
          transition: "all 0.2s",
          color: "#fff",
        }}
      >
        {item.checked && <IconCheck size={13} />}
      </div>
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontSize: 14,
            color: item.checked ? "#94a3b8" : "#1e293b",
            fontWeight: item.checked ? 400 : 500,
            textDecoration: item.checked ? "line-through" : "none",
            lineHeight: 1.4,
            transition: "color 0.2s",
          }}
        >
          {item.label}
        </p>
        {item.checked && item.checked_at && (
          <p style={{ fontSize: 11, color: "#16a34a", marginTop: 2, fontWeight: 500 }}>
            Concluído em {item.checked_at}
          </p>
        )}
      </div>
    </div>
  )
}

// ── Admin Panel ───────────────────────────────────────────────────────────────
function AdminPanel({
  teams,
  items,
  onBack,
}: {
  teams: Team[]
  items: ChecklistItem[]
  onBack: () => void
}) {
  const [activeTab, setActiveTab] = useState<"teams" | "items">("teams")
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id ?? "")

  // New team form
  const [newTeamName, setNewTeamName] = useState("")
  const [newTeamDesc, setNewTeamDesc] = useState("")
  const [newTeamLoc, setNewTeamLoc] = useState("")

  // Editing team
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null)
  const [editTeamName, setEditTeamName] = useState("")
  const [editTeamDesc, setEditTeamDesc] = useState("")
  const [editTeamLoc, setEditTeamLoc] = useState("")

  // New item form
  const [newItemLabel, setNewItemLabel] = useState("")

  // Editing item
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editItemLabel, setEditItemLabel] = useState("")

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTeamName.trim()) return
    const t = addTeam(newTeamName.trim(), newTeamDesc.trim(), newTeamLoc.trim() || "Sem localização")
    setNewTeamName("")
    setNewTeamDesc("")
    setNewTeamLoc("")
    setSelectedTeamId((await t).id)
    setActiveTab("items")
  }

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemLabel.trim() || !selectedTeamId) return
    addItem(selectedTeamId, newItemLabel.trim())
    setNewItemLabel("")
  }

  const selectedTeam = teams.find((t) => t.id === selectedTeamId)
  const teamItems = items.filter((i) => i.team_id === selectedTeamId)

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "9px 12px",
    borderRadius: 8,
    border: "1.5px solid #e2e8f0",
    fontSize: 14,
    outline: "none",
    color: "#0f172a",
    background: "#fff",
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 80px" }}>
      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#64748b",
          fontSize: 14,
          fontWeight: 500,
          marginBottom: 28,
          padding: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#0f172a")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
      >
        <IconArrowLeft size={18} />
        Voltar
      </button>

      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: 32,
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.3px",
            marginBottom: 6,
          }}
        >
          Painel Administrativo
        </h1>
        <p style={{ color: "#64748b", fontSize: 15 }}>Gerencie equipes e checklists de atividades</p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          background: "#f1f5f9",
          padding: 4,
          borderRadius: 10,
          width: "fit-content",
          marginBottom: 28,
        }}
      >
        {(["teams", "items"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 20px",
              borderRadius: 7,
              border: "none",
              background: activeTab === tab ? "#fff" : "transparent",
              color: activeTab === tab ? "#0f172a" : "#64748b",
              fontSize: 14,
              fontWeight: activeTab === tab ? 600 : 500,
              cursor: "pointer",
              boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s",
            }}
          >
            {tab === "teams" ? "Equipes" : "Checklists"}
          </button>
        ))}
      </div>

      {activeTab === "teams" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 24, alignItems: "start" }}>
          {/* Add team form */}
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              border: "1px solid #e2e8f0",
              padding: 24,
            }}
          >
            <h2
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: 17,
                fontWeight: 700,
                color: "#0f172a",
                marginBottom: 20,
              }}
            >
              Nova Equipe
            </h2>
            <form onSubmit={handleAddTeam} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.4px" }}>
                  Nome da Equipe *
                </label>
                <input
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="ex.: Equipe Delta"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.border = "1.5px solid #1e3a5f")}
                  onBlur={(e) => (e.currentTarget.style.border = "1.5px solid #e2e8f0")}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.4px" }}>
                  Localização
                </label>
                <input
                  value={newTeamLoc}
                  onChange={(e) => setNewTeamLoc(e.target.value)}
                  placeholder="ex.: Setor Oeste"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.border = "1.5px solid #1e3a5f")}
                  onBlur={(e) => (e.currentTarget.style.border = "1.5px solid #e2e8f0")}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#64748b", fontWeight: 600, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.4px" }}>
                  Descrição
                </label>
                <input
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                  placeholder="ex.: Responsável pela área oeste"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.border = "1.5px solid #1e3a5f")}
                  onBlur={(e) => (e.currentTarget.style.border = "1.5px solid #e2e8f0")}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: "10px",
                  borderRadius: 8,
                  border: "none",
                  background: "#1e3a5f",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  marginTop: 4,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#2a4f80")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#1e3a5f")}
              >
                <IconPlus size={16} />
                Criar Equipe
              </button>
            </form>
          </div>

          {/* Teams list */}
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              border: "1px solid #e2e8f0",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f1f5f9" }}>
              <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: 17, fontWeight: 700, color: "#0f172a" }}>
                Equipes Cadastradas ({teams.length})
              </h2>
            </div>
            {teams.length === 0 ? (
              <p style={{ padding: "32px 24px", color: "#94a3b8", fontSize: 14 }}>Nenhuma equipe cadastrada ainda.</p>
            ) : (
              <div>
                {teams.map((team) => {
                  const tItems = items.filter((i) => i.team_id === team.id)
                  const tDone = tItems.filter((i) => i.checked).length
                  const isEditing = editingTeamId === team.id
                  return (
                    <div
                      key={team.id}
                      style={{
                        padding: "14px 24px",
                        borderBottom: "1px solid #f8fafc",
                        background: isEditing ? "#f8fafc" : "transparent",
                      }}
                    >
                      {isEditing ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <input
                            value={editTeamName}
                            onChange={(e) => setEditTeamName(e.target.value)}
                            placeholder="Nome da equipe"
                            style={{ ...inputStyle, fontSize: 13 }}
                            onFocus={(e) => (e.currentTarget.style.border = "1.5px solid #1e3a5f")}
                            onBlur={(e) => (e.currentTarget.style.border = "1.5px solid #e2e8f0")}
                            autoFocus
                          />
                          <input
                            value={editTeamLoc}
                            onChange={(e) => setEditTeamLoc(e.target.value)}
                            placeholder="Localização"
                            style={{ ...inputStyle, fontSize: 13 }}
                            onFocus={(e) => (e.currentTarget.style.border = "1.5px solid #1e3a5f")}
                            onBlur={(e) => (e.currentTarget.style.border = "1.5px solid #e2e8f0")}
                          />
                          <input
                            value={editTeamDesc}
                            onChange={(e) => setEditTeamDesc(e.target.value)}
                            placeholder="Descrição"
                            style={{ ...inputStyle, fontSize: 13 }}
                            onFocus={(e) => (e.currentTarget.style.border = "1.5px solid #1e3a5f")}
                            onBlur={(e) => (e.currentTarget.style.border = "1.5px solid #e2e8f0")}
                          />
                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              onClick={() => {
                                if (editTeamName.trim()) {
                                  editTeam(team.id, editTeamName.trim(), editTeamDesc.trim(), editTeamLoc.trim() || "Sem localização")
                                }
                                setEditingTeamId(null)
                              }}
                              style={{
                                padding: "6px 14px",
                                borderRadius: 7,
                                border: "none",
                                background: "#1e3a5f",
                                color: "#fff",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 5,
                              }}
                            >
                              <IconSave size={13} /> Salvar
                            </button>
                            <button
                              onClick={() => setEditingTeamId(null)}
                              style={{
                                padding: "6px 12px",
                                borderRadius: 7,
                                border: "1px solid #e2e8f0",
                                background: "#fff",
                                color: "#64748b",
                                fontSize: 12,
                                cursor: "pointer",
                              }}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 600, fontSize: 14, color: "#0f172a", marginBottom: 2 }}>{team.name}</p>
                            <p style={{ fontSize: 12, color: "#64748b" }}>
                              {team.location} · {tDone}/{tItems.length} atividades
                            </p>
                          </div>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              onClick={() => {
                                setEditingTeamId(team.id)
                                setEditTeamName(team.name)
                                setEditTeamDesc(team.description)
                                setEditTeamLoc(team.location)
                              }}
                              style={{
                                padding: "6px 8px",
                                borderRadius: 7,
                                border: "1px solid #e2e8f0",
                                background: "#f8fafc",
                                color: "#1e3a5f",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                              }}
                              title="Editar equipe"
                            >
                              <IconPencil size={13} />
                            </button>
                            <button
                              onClick={() => { setSelectedTeamId(team.id); setActiveTab("items") }}
                              style={{
                                padding: "6px 12px",
                                borderRadius: 7,
                                border: "1px solid #e2e8f0",
                                background: "#f8fafc",
                                color: "#1e3a5f",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Checklist
                            </button>
                            <button
                              onClick={() => removeTeam(team.id)}
                              style={{
                                padding: "6px 8px",
                                borderRadius: 7,
                                border: "1px solid #fecaca",
                                background: "#fff",
                                color: "#dc2626",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                              }}
                              title="Remover equipe"
                            >
                              <IconTrash size={13} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "items" && (
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24, alignItems: "start" }}>
          {/* Team selector */}
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              border: "1px solid #e2e8f0",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
              <p style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
                Selecionar Equipe
              </p>
            </div>
            {teams.length === 0 ? (
              <p style={{ padding: "20px", fontSize: 13, color: "#94a3b8" }}>Crie uma equipe primeiro.</p>
            ) : (
              teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeamId(team.id)}
                  style={{
                    width: "100%",
                    padding: "13px 20px",
                    border: "none",
                    background: selectedTeamId === team.id ? "#eff6ff" : "transparent",
                    borderLeft: selectedTeamId === team.id ? "3px solid #1e3a5f" : "3px solid transparent",
                    color: selectedTeamId === team.id ? "#1e3a5f" : "#475569",
                    fontSize: 14,
                    fontWeight: selectedTeamId === team.id ? 600 : 400,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                >
                  {team.name}
                </button>
              ))
            )}
          </div>

          {/* Items management */}
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              border: "1px solid #e2e8f0",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
              <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>
                {selectedTeam ? `Checklist — ${selectedTeam.name}` : "Selecione uma equipe"}
              </h2>
              {selectedTeam && (
                <p style={{ fontSize: 13, color: "#64748b" }}>
                  {teamItems.filter((i) => i.checked).length}/{teamItems.length} concluídas
                </p>
              )}
            </div>

            {selectedTeam && (
              <>
                {/* Add item form */}
                <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", background: "#fafafa" }}>
                  <form onSubmit={handleAddItem} style={{ display: "flex", gap: 10 }}>
                    <input
                      value={newItemLabel}
                      onChange={(e) => setNewItemLabel(e.target.value)}
                      placeholder="Nova atividade para esta equipe..."
                      style={{ ...inputStyle, flex: 1 }}
                      onFocus={(e) => (e.currentTarget.style.border = "1.5px solid #1e3a5f")}
                      onBlur={(e) => (e.currentTarget.style.border = "1.5px solid #e2e8f0")}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: "9px 16px",
                        borderRadius: 8,
                        border: "none",
                        background: "#1e3a5f",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        whiteSpace: "nowrap",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#2a4f80")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#1e3a5f")}
                    >
                      <IconPlus size={15} />
                      Adicionar
                    </button>
                  </form>
                </div>

                {/* Items list */}
                <div>
                  {teamItems.length === 0 ? (
                    <p style={{ padding: "32px 24px", color: "#94a3b8", fontSize: 14 }}>
                      Nenhuma atividade cadastrada. Adicione a primeira acima.
                    </p>
                  ) : (
                    teamItems.map((item) => {
                      const isEditingThis = editingItemId === item.id
                      return (
                        <div
                          key={item.id}
                          style={{
                            padding: "10px 24px",
                            borderBottom: "1px solid #f8fafc",
                            background: isEditingThis ? "#f8fafc" : "transparent",
                          }}
                        >
                          {isEditingThis ? (
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              <input
                                value={editItemLabel}
                                onChange={(e) => setEditItemLabel(e.target.value)}
                                style={{ ...inputStyle, flex: 1, fontSize: 13 }}
                                onFocus={(e) => (e.currentTarget.style.border = "1.5px solid #1e3a5f")}
                                onBlur={(e) => (e.currentTarget.style.border = "1.5px solid #e2e8f0")}
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    if (editItemLabel.trim()) editItem(item.id, editItemLabel.trim())
                                    setEditingItemId(null)
                                  }
                                  if (e.key === "Escape") setEditingItemId(null)
                                }}
                              />
                              <button
                                onClick={() => {
                                  if (editItemLabel.trim()) editItem(item.id, editItemLabel.trim())
                                  setEditingItemId(null)
                                }}
                                style={{ padding: "7px 12px", borderRadius: 7, border: "none", background: "#1e3a5f", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                              >
                                <IconSave size={13} /> Salvar
                              </button>
                              <button
                                onClick={() => setEditingItemId(null)}
                                style={{ padding: "7px 10px", borderRadius: 7, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 12, cursor: "pointer" }}
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => toggleItem(item.id)}>
                              <div
                                style={{
                                  width: 22, height: 22, borderRadius: 6,
                                  border: item.checked ? "none" : "2px solid #cbd5e1",
                                  background: item.checked ? "#16a34a" : "#fff",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  flexShrink: 0, color: "#fff", transition: "all 0.2s",
                                }}
                              >
                                {item.checked && <IconCheck size={13} />}
                              </div>
                              <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 14, color: item.checked ? "#94a3b8" : "#1e293b", fontWeight: item.checked ? 400 : 500, textDecoration: item.checked ? "line-through" : "none" }}>
                                  {item.label}
                                </p>
                                {item.checked && item.checked_at && (
                                  <p style={{ fontSize: 11, color: "#16a34a", marginTop: 2 }}>{item.checked_at}</p>
                                )}
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); setEditingItemId(item.id); setEditItemLabel(item.label) }}
                                style={{ padding: "5px 7px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#1e3a5f", cursor: "pointer", display: "flex", alignItems: "center" }}
                                title="Editar atividade"
                              >
                                <IconPencil size={13} />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); removeItem(item.id) }}
                                style={{ padding: "5px 7px", borderRadius: 6, border: "1px solid #fecaca", background: "#fff", color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center" }}
                                title="Remover atividade"
                              >
                                <IconTrash size={13} />
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

// ── Root App ──────────────────────────────────────────────────────────────────
type View = { page: "home" } | { page: "team"; teamId: string } | { page: "admin" }

export default function App() {
  const { teams, items } = useAppState()
  const [isAdmin, setIsAdmin] = useState(false)
  const [view, setView] = useState<View>({ page: "home" })

  const handleLogin = useCallback((u: string, p: string) => {
    if (u === ADMIN_USER.username && p === ADMIN_USER.password) {
      setIsAdmin(true)
      return true
    }
    return false
  }, [])

  const handleLogout = useCallback(() => {
    setIsAdmin(false)
    setView({ page: "home" })
  }, [])

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>
      <Header
        isAdmin={isAdmin}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onGoAdmin={() => setView({ page: "admin" })}
        onGoHome={() => setView({ page: "home" })}
      />

      {view.page === "home" && (
        <HomePage
          teams={teams}
          items={items}
          isAdmin={isAdmin}
          onSelectTeam={(id) => setView({ page: "team", teamId: id })}
        />
      )}

      {view.page === "team" && (() => {
        const team = teams.find((t) => t.id === view.teamId)
        if (!team) return <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Equipe não encontrada.</div>
        return (
          <TeamDetailPage
            team={team}
            items={items}
            isAdmin={isAdmin}
            onBack={() => setView({ page: "home" })}
          />
        )
      })()}

      {view.page === "admin" && isAdmin && (
        <AdminPanel
          teams={teams}
          items={items}
          onBack={() => setView({ page: "home" })}
        />
      )}

      {view.page === "admin" && !isAdmin && (
        <div style={{ padding: "80px 24px", textAlign: "center", color: "#94a3b8" }}>
          Acesso negado. Faça login como administrador.
        </div>
      )}

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid #e2e8f0",
          padding: "24px",
          textAlign: "center",
          fontSize: 13,
          color: "#94a3b8",
          background: "#fff",
        }}
      >
        OpsCheck © 2026 — Sistema de Acompanhamento Operacional
      </footer>
    </div>
  )
}
