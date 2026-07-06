import React, { useState, useEffect, useRef } from 'react';
import { 
  HashRouter, Routes, Route, useNavigate, useLocation, Navigate 
} from 'react-router-dom';
import { 
  Dumbbell, Flame, Trophy, Clock, Check, Play, ChevronRight, 
  Calendar as CalendarIcon, Users, User, ChevronLeft, Apple, Droplet, 
  MessageSquare, Star, X, LogOut, Settings, Bell, Shield, HelpCircle, Heart, Plus, Trash2
} from 'lucide-react';
import { supabase } from './supabaseClient';

// --- DATA CONSTANTS ---

const DEFAULT_PROFILE = {
  id: 'd1a04b50-db95-4527-a407-2c663fa49d0e',
  full_name: 'João Silva',
  plan_name: 'Plano Premium - Personal Lendel',
  role: 'student',
  streak_days: 7,
  access_days_remaining: 23
};

const DEFAULT_WORKOUTS = [
  {
    letter: "A",
    title: "Peito e Tríceps",
    muscles: "Peitoral, tríceps, deltoide anterior",
    exercisesCount: 8,
    time: "~55 min",
    lastTime: "Ontem",
    badge: "Hoje",
    badgeColor: "#ff6a4a",
    badgeBg: "rgba(255, 106, 74, 0.12)",
    color: "#ff6a4a",
    preview: [
      { name: "Supino Reto", sets: "4x12" },
      { name: "Supino Inclinado", sets: "4x10" },
      { name: "Crossover", sets: "3x15" }
    ],
    moreCount: 5
  },
  {
    letter: "B",
    title: "Costas e Bíceps",
    muscles: "Dorsal, trapézio, bíceps, antebraço",
    exercisesCount: 7,
    time: "~50 min",
    lastTime: "3 dias atrás",
    badge: "Feito",
    badgeColor: "#00e699",
    badgeBg: "rgba(0, 230, 153, 0.12)",
    color: "#3f8cff",
    preview: [
      { name: "Puxada Frontal", sets: "4x12" },
      { name: "Remada Curvada", sets: "4x10" },
      { name: "Rosca Direta", sets: "3x12" }
    ],
    moreCount: 4
  },
  {
    letter: "C",
    title: "Pernas e Glúteos",
    muscles: "Quadríceps, posterior, glúteo, panturrilha",
    exercisesCount: 9,
    time: "~60 min",
    lastTime: "5 dias atrás",
    badge: "Amanhã",
    badgeColor: "#ffb800",
    badgeBg: "rgba(255, 184, 0, 0.12)",
    color: "#9053ff",
    preview: [
      { name: "Agachamento Livre", sets: "4x12" },
      { name: "Leg Press 45", sets: "4x15" },
      { name: "Cadeira Extensora", sets: "3x15" }
    ],
    moreCount: 6
  }
];

const DEFAULT_DIET = {
  kcal_consumed: 1680,
  kcal_target: 2200,
  water_glasses: 4,
  protein_grams: 120,
  carbs_grams: 180,
  fat_grams: 55
};

const DEFAULT_POSTS = [
  {
    id: 1,
    avatar: "LD",
    name: "Lendel Diniz",
    time: "Há 2 horas",
    is_personal: true,
    content: "Galera, novo desafio da semana! Quem completar 5 treinos ganha destaque no ranking. Bora treinar duro e manter o foco!",
    likes_count: 12,
    comments_count: 4,
    accentAvatar: true
  },
  {
    id: 2,
    avatar: "MR",
    name: "Maria Ribeiro",
    time: "Há 5 horas",
    is_personal: false,
    content: "Completei meu treino de pernas hoje! Agachamento com recorde pessoal (PR) de 80kg! A sensação de dever cumprido é a melhor.",
    hasImage: true,
    likes_count: 24,
    comments_count: 8,
    accentAvatar: false
  },
  {
    id: 3,
    avatar: "JS",
    name: "João Silva",
    time: "Há 8 horas",
    is_personal: false,
    content: "7 dias de sequência de treinos e dieta 100%! Obrigado Lendel pela motivação diária.",
    likes_count: 18,
    comments_count: 3,
    accentAvatar: false
  }
];

const EXERCISES_EXECUTION = [
  { name: "Supino Reto", muscles: "Peitoral Maior - Tríceps - Deltoide Anterior", sets: 4 },
  { name: "Supino Inclinado", muscles: "Peitoral Superior - Tríceps", sets: 4 },
  { name: "Crossover", muscles: "Peitoral - Deltoide Anterior", sets: 3 },
  { name: "Flies com Halteres", muscles: "Peitoral Maior", sets: 3 },
  { name: "Tríceps Pulley", muscles: "Tríceps", sets: 4 },
  { name: "Tríceps Testa", muscles: "Tríceps", sets: 3 },
  { name: "Tríceps Corda", muscles: "Tríceps", sets: 3 },
  { name: "Mergulho", muscles: "Peitoral - Tríceps", sets: 3 }
];

const MEALS_DATA = [
  {
    name: "Café da Manhã",
    time: "07:30",
    kcal: 480,
    colorBg: "var(--app-yellow-soft)",
    colorIcon: "var(--app-yellow)",
    items: [
      { name: "Ovos mexidos", portion: "3 unidades", kcal: 210 },
      { name: "Pão integral", portion: "2 fatias", kcal: 160 },
      { name: "Suco de laranja", portion: "300ml", kcal: 110 }
    ]
  },
  {
    name: "Almoço",
    time: "12:30",
    kcal: 720,
    colorBg: "var(--app-green-soft)",
    colorIcon: "var(--app-green)",
    items: [
      { name: "Frango grelhado", portion: "200g", kcal: 330 },
      { name: "Arroz integral", portion: "150g", kcal: 195 },
      { name: "Salada mista", portion: "1 prato", kcal: 95 },
      { name: "Feijão", portion: "100g", kcal: 100 }
    ]
  },
  {
    name: "Lanche da Tarde",
    time: "16:00",
    kcal: 230,
    colorBg: "var(--app-purple-soft)",
    colorIcon: "var(--app-purple)",
    items: [
      { name: "Whey Protein", portion: "1 scoop", kcal: 120 },
      { name: "Banana", portion: "1 unidade", kcal: 110 }
    ]
  },
  {
    name: "Jantar",
    time: "19:30",
    kcal: 250,
    colorBg: "var(--app-blue-soft)",
    colorIcon: "var(--app-blue)",
    items: [
      { name: "Sopa de legumes", portion: "1 prato", kcal: 150 },
      { name: "Torrada integral", portion: "2 unidades", kcal: 100 }
    ]
  }
];

const CALENDAR_DAYS = [
  { name: "Seg", num: 9, hasEvent: true },
  { name: "Ter", num: 10, hasEvent: false },
  { name: "Qua", num: 11, hasEvent: true },
  { name: "Qui", num: 12, hasEvent: true, active: true },
  { name: "Sex", num: 13, hasEvent: true },
  { name: "Sáb", num: 14, hasEvent: false },
  { name: "Dom", num: 15, hasEvent: false }
];

const SCHEDULE_EVENTS_TODAY = [
  { time: "08:00", period: "AM", title: "Yoga Matinal", subtitle: "Com Ana Silva - Sala 2", tag: "Aula em grupo", tagType: "session" },
  { time: "10:00", period: "AM", title: "Treino A - Peito e Tríceps", subtitle: "Treino individual", tag: "Treino", tagType: "training" },
  { time: "18:00", period: "PM", title: "Sessão com Personal", subtitle: "Com Lendel Diniz - Presencial", tag: "Sessão personal", tagType: "session" }
];

const SCHEDULE_EVENTS_TOMORROW = [
  { time: "08:00", period: "AM", title: "CrossFit", subtitle: "Com Carlos Santos - Sala 1", tag: "Aula em grupo", tagType: "session" }
];

const DEFAULT_STUDENTS = [
  { id: 'd1a04b50-db95-4527-a407-2c663fa49d0e', name: 'João Silva', plan: 'Plano Premium', lastWorkout: 'Hoje', status: 'Ativo', streak: 7 },
  { id: 'd1a04b50-db95-4527-a407-2c663fa49d0d', name: 'Maria Ribeiro', plan: 'Plano Premium', lastWorkout: '3 dias atrás', status: 'Ativo', streak: 12 },
  { id: 'd1a04b50-db95-4527-a407-2c663fa49d0c', name: 'Pedro Costa', plan: 'Plano Básico', lastWorkout: '5 dias atrás', status: 'Inativo', streak: 1 }
];

const DEFAULT_FEEDBACK_LOGS = [
  { student: 'João Silva', workout: 'Treino A', difficulty: 'Regular', energy: 4, notes: 'Fadigou bastante os braços no supino reto.', date: 'Hoje' },
  { student: 'Maria Ribeiro', workout: 'Treino C', difficulty: 'Difícil', energy: 5, notes: 'Treino de pernas foi puxado mas completei.', date: 'Ontem' },
  { student: 'Pedro Costa', workout: 'Treino B', difficulty: 'Fácil', energy: 3, notes: 'Tudo tranquilo, treinei rápido hoje.', date: '5 dias atrás' }
];

// --- STANDALONE PAGE COMPONENTS ---

function LoginView({ onLogin }) {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleQuickLogin = (userType) => {
    if (userType === 'student') {
      onLogin({
        id: 'd1a04b50-db95-4527-a407-2c663fa49d0e',
        full_name: 'João Silva',
        plan_name: 'Plano Premium - Personal Lendel',
        role: 'student',
        streak_days: 7,
        access_days_remaining: 23
      });
    } else {
      onLogin({
        id: 'c1a04b50-db95-4527-a407-2c663fa49d0f',
        full_name: 'Lendel Diniz',
        plan_name: 'Treinador / Personal Trainer',
        role: 'teacher',
        streak_days: 0,
        access_days_remaining: 9999
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.includes('lendel') || role === 'teacher') {
      handleQuickLogin('teacher');
    } else {
      handleQuickLogin('student');
    }
  };

  return (
    <div className="relative w-full min-h-[100dvh] login-bg">
      <div className="login-header">
        <h1 className="michroma-title">LENDEL DINIZ</h1>
        <p>Acesse sua conta para gerenciar seus treinos</p>
      </div>

      <div className="premium-card" style={{ width: '100%' }}>
        <div className="role-selector">
          <button 
            type="button"
            className={`role-pill ${role === 'student' ? 'active' : ''}`}
            onClick={() => setRole('student')}
          >
            Sou Aluno
          </button>
          <button 
            type="button"
            className={`role-pill ${role === 'teacher' ? 'active' : ''}`}
            onClick={() => setRole('teacher')}
          >
            Sou Professor
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-mail</label>
            <input 
              type="email" 
              placeholder="exemplo@lendel.com"
              className="premium-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label>Senha</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="premium-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Entrar
          </button>
        </form>

        <div className="quick-login-divider">Ou acesse rápido de teste</div>

        <button 
          className="quick-login-btn"
          onClick={() => handleQuickLogin('student')}
        >
          <User size={16} /> João Silva (Aluno)
        </button>
        <button 
          className="quick-login-btn"
          onClick={() => handleQuickLogin('teacher')}
        >
          <Dumbbell size={16} /> Lendel Diniz (Professor)
        </button>
      </div>
    </div>
  );
}

function HomeView({ profile, diet }) {
  const navigate = useNavigate();
  const days = [
    { label: "Seg", done: true },
    { label: "Ter", done: true },
    { label: "Qua", done: true },
    { label: "Qui", today: true },
    { label: "Sex", done: false },
    { label: "Sab", done: false },
    { label: "Dom", done: false }
  ];

  const quickAccess = [
    { icon: CalendarIcon, title: "Agenda", sub: "Próxima: Amanhã 8h", path: "/agenda" },
    { icon: Users, title: "Comunidade", sub: "Ver publicações", path: "/comunidade" },
    { icon: Trophy, title: "Evolução", sub: "Ver gráficos", path: "/perfil" },
    { icon: Apple, title: "Dieta", sub: "Plano de hoje", path: "/dieta" }
  ];

  return (
    <div style={{ paddingBottom: 24, paddingTop: 16 }}>
      {/* Welcome */}
      <div className="px-5 pb-5">
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>Bem-vindo de volta,</p>
        <p style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)" }}>
          {profile.full_name.split(' ')[0]} <span style={{ color: "var(--app-accent)" }}>{profile.full_name.split(' ')[1] || ""}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 px-5 mb-6">
        {[
          { icon: Flame, label: "Calorias", value: `${diet.kcal_consumed} kcal`, sub: "+12% vs semana", color: "var(--app-accent)", bg: "var(--app-accent-soft)", subColor: "var(--app-green)" },
          { icon: Trophy, label: "Sequência", value: `${profile.streak_days} dias`, sub: "Recorde pessoal!", color: "var(--app-green)", bg: "var(--app-green-soft)", subColor: "var(--app-green)" },
          { icon: Dumbbell, label: "Aulas", value: "3/5", sub: "2 restantes", color: "var(--app-blue)", bg: "var(--app-blue-soft)", subColor: "var(--text-secondary)" },
          { icon: Clock, label: "Tempo total", value: "4h 20m", sub: "Esta semana", color: "var(--app-yellow)", bg: "var(--app-yellow-soft)", subColor: "var(--text-secondary)" }
        ].map((stat, i) => (
          <div key={i} className="premium-card">
            <div 
              className="flex items-center justify-center mb-3"
              style={{ width: 38, height: 38, borderRadius: 12, background: stat.bg }}
            >
              <stat.icon size={18} strokeWidth={2.4} style={{ color: stat.color }} />
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--text-muted)", marginBottom: 4 }}>{stat.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 2 }}>{stat.value}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: stat.subColor }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Weekly Goal Progress */}
      <div className="px-5 mb-6">
        <div className="premium-card">
          <div className="flex justify-between items-center mb-1">
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Meta Semanal</span>
            <span 
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--app-accent)",
                background: "var(--app-accent-soft)",
                padding: "4px 10px",
                borderRadius: 20
              }}
            >
              60%
            </span>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 14 }}>3 de 5 treinos completados</p>
          
          <div style={{ width: "100%", height: 6, background: "var(--app-accent-soft)", borderRadius: 100, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ width: "60%", height: "100%", background: "var(--app-accent)", borderRadius: 100 }} />
          </div>

          <div className="flex justify-between">
            {days.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>{day.label}</span>
                <div 
                  className="flex items-center justify-center"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: day.done ? "none" : day.today ? "2px solid var(--app-accent)" : "2px solid var(--app-border)",
                    background: day.done ? "var(--app-accent)" : day.today ? "var(--app-accent-soft)" : "transparent"
                  }}
                >
                  {day.done && <Check size={14} strokeWidth={3} color="#fff" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Start Workout Banner */}
      <div className="px-5 mb-6">
        <div 
          className="relative overflow-hidden cursor-pointer"
          style={{
            borderRadius: 24,
            padding: 22,
            background: "linear-gradient(135deg, var(--app-accent) 0%, #ff4b2b 100%)",
            boxShadow: "0 8px 30px rgba(255, 106, 74, 0.35)"
          }}
          onClick={() => navigate('/execucao')}
        >
          <div className="absolute -top-1/2 -right-[30%]" style={{ width: 200, height: 200, background: "rgba(255,255,255,0.08)", borderRadius: "50%" }} />
          <div className="absolute -bottom-[40%] -left-[20%]" style={{ width: 160, height: 160, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="pulse-indicator" />
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "rgba(255,255,255,0.85)" }}>Treino de Hoje</span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Treino A - Peito e Tríceps</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 18 }}>8 exercícios - ~55 min</p>
            
            <div className="flex items-center gap-4 mb-4" style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
              <span className="flex items-center gap-1.5"><Dumbbell size={14} /> 8 exerc.</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> 55 min</span>
              <span className="flex items-center gap-1.5"><Flame size={14} /> ~420 kcal</span>
            </div>

            <button 
              className="flex items-center gap-2 cursor-pointer border-none"
              style={{
                width: "100%",
                justifyContent: "center",
                background: "rgba(255,255,255,0.22)",
                backdropFilter: "blur(12px)",
                padding: "12px 20px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)"
              }}
            >
              <Play size={16} fill="#fff" stroke="none" /> Iniciar Treino
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="px-5 mb-4">
        <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)", marginBottom: 14 }}>Acesso Rápido</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickAccess.map((access, i) => (
            <div 
              key={i}
              className="premium-card flex flex-col gap-2 cursor-pointer"
              onClick={() => navigate(access.path)}
            >
              <div 
                className="flex items-center justify-center"
                style={{ width: 40, height: 40, borderRadius: 12, background: "var(--app-accent-soft)" }}
              >
                <access.icon size={20} style={{ color: "var(--app-accent)" }} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>{access.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{access.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TreinosView({ workouts, setActiveExerciseIndex, setCheckedSets }) {
  const navigate = useNavigate();
  const filters = ["Todos", "Treino A", "Treino B", "Treino C"];
  const [selectedFilter, setSelectedFilter] = useState("Todos");

  const filteredWorkouts = selectedFilter === "Todos" 
    ? workouts 
    : workouts.filter(w => `Treino ${w.letter}` === selectedFilter);

  return (
    <div style={{ paddingBottom: 24, paddingTop: 16 }}>
      <div className="px-5 pb-5">
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>Meus Treinos</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Seus treinos personalizados</p>
      </div>

      <div className="flex gap-2 px-5 mb-5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className="cursor-pointer border-none whitespace-nowrap"
            style={{
              padding: "10px 20px",
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 700,
              background: selectedFilter === filter ? "var(--app-accent)" : "var(--bg-card)",
              color: selectedFilter === filter ? "#fff" : "var(--text-secondary)",
              border: selectedFilter === filter ? "none" : "1px solid var(--app-border)"
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="px-5 flex flex-col gap-3">
        {filteredWorkouts.map((workout) => (
          <div 
            key={workout.letter}
            className="premium-card cursor-pointer"
            onClick={() => {
              setActiveExerciseIndex(0);
              setCheckedSets({});
              navigate('/execucao');
            }}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3.5">
                <div 
                  className="flex items-center justify-center"
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    background: "var(--app-accent-soft)",
                    fontSize: 18,
                    fontWeight: 800,
                    color: "var(--app-accent)"
                  }}
                >
                  {workout.letter}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{workout.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{workout.muscles}</div>
                </div>
              </div>
              
              <span 
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 20,
                  background: workout.badgeBg || "var(--app-accent-soft)",
                  color: workout.badgeColor || "var(--app-accent)"
                }}
              >
                {workout.badge || "Padrão"}
              </span>
            </div>

            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
              {workout.exercisesCount} exercícios - {workout.time} - Última vez: {workout.lastTime}
            </div>

            <div className="flex flex-col gap-2.5 mb-3">
              {workout.preview.map((prev, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span 
                    className="flex items-center justify-center"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background: "var(--app-accent-soft)",
                      fontSize: 11,
                      fontWeight: 800,
                      color: "var(--app-accent)"
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--text-primary)", flex: 1 }}>{prev.name}</span>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{prev.sets}</span>
                </div>
              ))}
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--app-accent)" }}>
              +{workout.moreCount} exercícios
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DietaView({ diet, waterGlasses, handleUpdateWater, activeMealIndex, setActiveMealIndex }) {
  return (
    <div style={{ paddingBottom: 24, paddingTop: 16 }}>
      <div className="flex justify-between items-center px-5 pb-5">
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>Dieta</h1>
        <button 
          className="flex items-center justify-center cursor-pointer border-none"
          style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bg-card)", border: "1px solid var(--app-border)" }}
        >
          <Settings size={18} style={{ color: "var(--text-secondary)" }} />
        </button>
      </div>

      {/* Calories Card */}
      <div className="premium-card mx-5 mb-4 flex justify-between items-center">
        <div>
          <h4 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, color: "var(--text-primary)", marginBottom: 2 }}>
            {diet.kcal_consumed} <span style={{ color: "var(--text-muted)", fontWeight: 500, fontSize: 16 }}>/ {diet.kcal_target}</span>
          </h4>
          <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>Calorias consumidas hoje</p>
        </div>
        <div className="flex flex-col items-end">
          <span style={{ fontSize: 22, fontWeight: 800, color: "var(--app-green)" }}>{diet.kcal_target - diet.kcal_consumed}</span>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>restantes</span>
        </div>
      </div>

      {/* Circle Macros */}
      <div className="flex justify-center gap-5 mb-6 py-4">
        {[
          { label: "Proteína", value: diet.protein_grams, target: "160", color: "var(--app-accent)", progress: (diet.protein_grams / 160) * 100 },
          { label: "Carbos", value: diet.carbs_grams, target: "220", color: "var(--app-blue)", progress: (diet.carbs_grams / 220) * 100 },
          { label: "Gorduras", value: diet.fat_grams, target: "75", color: "var(--app-yellow)", progress: (diet.fat_grams / 75) * 100 }
        ].map((macro, i) => {
          const radius = 30;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (Math.min(100, macro.progress) / 100) * circumference;

          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
                <svg viewBox="0 0 72 72" className="absolute inset-0" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="36" cy="36" r={radius} fill="none" strokeWidth="5" stroke="rgba(255,255,255,0.06)" />
                  <circle 
                    cx="36" cy="36" r={radius} 
                    fill="none" strokeWidth="5" 
                    stroke={macro.color} 
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="relative z-10 flex items-baseline">
                  <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)" }}>{macro.value}</span>
                  <span style={{ fontSize: 8, fontWeight: 600, color: "var(--text-muted)" }}>g</span>
                </div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)" }}>{macro.label}</span>
            </div>
          );
        })}
      </div>

      {/* Water Log */}
      <div className="premium-card mx-5 mb-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Droplet size={18} style={{ color: "var(--app-blue)" }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>Água</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--app-blue)" }}>
            {(waterGlasses * 0.375).toFixed(2)}L / 3.0L
          </span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i}
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: 34,
                height: 34,
                minWidth: 34,
                borderRadius: 10,
                background: i < waterGlasses ? "var(--app-blue-soft)" : "var(--bg-elevated)",
                border: i < waterGlasses ? "1px solid rgba(91,156,246,0.3)" : "1px solid var(--app-border)",
                transition: "all 0.2s"
              }}
              onClick={() => handleUpdateWater(i + 1)}
            >
              <Droplet size={14} style={{ color: i < waterGlasses ? "var(--app-blue)" : "var(--text-muted)" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Meals Collapsible List */}
      <div className="px-5">
        <h3 style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3, color: "var(--text-primary)", marginBottom: 14 }}>Refeições de Hoje</h3>
        {MEALS_DATA.map((meal, i) => {
          const isOpen = activeMealIndex === i;
          return (
            <div 
              key={i}
              className="mb-3"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--app-border)",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "var(--card-shadow)"
              }}
            >
              <div 
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setActiveMealIndex(isOpen ? -1 : i)}
              >
                <div className="flex items-center gap-3.5">
                  <div 
                    className="flex items-center justify-center"
                    style={{ width: 42, height: 42, borderRadius: 12, background: meal.colorBg }}
                  >
                    <Apple size={18} style={{ color: meal.colorIcon }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2, letterSpacing: -0.2 }}>{meal.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{meal.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-secondary)" }}>
                    {meal.kcal} <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-muted)" }}>kcal</span>
                  </span>
                  <ChevronRight 
                    size={16} 
                    style={{ 
                      color: "var(--text-muted)", 
                      transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 0.2s" 
                    }} 
                  />
                </div>
              </div>

              {isOpen && meal.items.map((item, m) => (
                <div 
                  key={m}
                  className="flex justify-between items-center px-4 py-3"
                  style={{ borderTop: "1px solid var(--app-border)" }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.portion}</div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)" }}>{item.kcal} kcal</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ComunidadeView({ posts, likedPosts, handleToggleLike }) {
  return (
    <div style={{ paddingBottom: 24, paddingTop: 16 }}>
      <div className="flex justify-between items-center px-5 pb-5">
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>Comunidade</h1>
        <button 
          className="flex items-center justify-center cursor-pointer border-none"
          style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--app-accent-soft)" }}
        >
          <MessageSquare size={18} style={{ color: "var(--app-accent)" }} />
        </button>
      </div>

      <div className="px-5">
        {posts.map((post, i) => {
          const hasLiked = likedPosts[i];
          return (
            <div key={post.id || i} className="premium-card mb-3">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="flex items-center justify-center"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: post.is_personal || post.accentAvatar ? "var(--app-accent-soft)" : "var(--bg-elevated)",
                    fontSize: 14,
                    fontWeight: 800,
                    color: post.is_personal || post.accentAvatar ? "var(--app-accent)" : "var(--text-secondary)"
                  }}
                >
                  {post.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.2, color: "var(--text-primary)" }}>{post.name}</span>
                    {post.is_personal && <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, padding: "2px 6px", borderRadius: 6, background: "var(--app-accent-soft)", color: "var(--app-accent)" }}>Personal</span>}
                  </div>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{post.time || "Recentemente"}</span>
                </div>
              </div>

              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 14 }}>{post.content}</p>
              
              {post.has_image && (
                <div 
                  className="flex items-center justify-center mb-3.5"
                  style={{ width: "100%", aspectRatio: "16/9", background: "linear-gradient(135deg, var(--bg-elevated), var(--bg-card))", borderRadius: 12, border: "1px solid var(--app-border)" }}
                >
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Foto do treino</span>
                </div>
              )}

              <div className="flex gap-5">
                <button 
                  onClick={() => handleToggleLike(i, post.id)}
                  className="feed-action-btn" 
                  style={{ color: hasLiked ? "var(--app-accent)" : "var(--text-secondary)" }}
                >
                  <Heart size={18} fill={hasLiked ? "var(--app-accent)" : "none"} style={{ color: hasLiked ? "var(--app-accent)" : "var(--text-muted)" }} /> 
                  {post.likes_count}
                </button>
                <button className="feed-action-btn">
                  <MessageSquare size={18} style={{ color: "var(--text-muted)" }} /> {post.comments_count || 0}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PerfilView({ profile, uiTheme, setUiTheme, onLogout }) {
  const navigate = useNavigate();
  const personalData = [
    { label: "Minha Evolução", desc: "Gráficos de peso, medidas" },
    { label: "Fotos Comparativas", desc: "Antes e depois" },
    { label: "Avaliação Física", desc: "Última: 01/02/2026" },
    { icon: CalendarIcon, label: "Agenda", desc: "Calendário de sessões", path: "/agenda" }
  ];

  const configItems = [
    { icon: Bell, label: "Notificações" },
    { icon: Settings, label: "Aparência", toggle: true },
    { icon: Shield, label: "Privacidade" },
    { icon: HelpCircle, label: "Ajuda e Suporte" }
  ];

  return (
    <div style={{ paddingBottom: 24, paddingTop: 16 }}>
      <div className="flex justify-between items-center px-5 pb-5">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center cursor-pointer border-none"
            style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bg-card)", border: "1px solid var(--app-border)" }}
          >
            <ChevronLeft size={18} style={{ color: "var(--text-secondary)" }} />
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>Meu Perfil</h1>
        </div>
      </div>

      <div className="flex flex-col items-center px-5 pb-6">
        <div 
          className="flex items-center justify-center mb-3"
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--app-accent), #ff4b2b)",
            fontSize: 28,
            fontWeight: 800,
            color: "#fff",
            boxShadow: "0 8px 24px var(--app-accent-glow)"
          }}
        >
          {profile.full_name.split(' ').map(n=>n[0]).join('')}
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>{profile.full_name}</h2>
        <p style={{ fontSize: 13, color: "var(--app-accent)", fontWeight: 700, marginBottom: 4 }}>{profile.plan_name}</p>
        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Aluno desde Mar 2025</p>
      </div>

      {profile.role !== 'teacher' && (
        <>
          <div className="premium-card mx-5 mb-5 grid grid-cols-3" style={{ padding: "16px 0" }}>
            {[
              { label: "Treinos", value: "47" },
              { label: "Sequência", value: profile.streak_days },
              { label: "Calorias", value: "12.4k" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span style={{ fontSize: 22, fontWeight: 800, color: "var(--app-accent)", marginBottom: 4 }}>{stat.value}</span>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--text-muted)" }}>{stat.label}</span>
              </div>
            ))}
          </div>

          <div 
            className="premium-card mx-5 mb-6 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(255,106,74,0.15), rgba(255,106,74,0.05))",
              border: "1px solid rgba(255,106,74,0.15)"
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>Tempo de Acesso</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--app-accent)" }}>{profile.access_days_remaining} dias</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 10 }}>Expira em {profile.access_days_remaining} dias - Renovação: 05/04/2026</p>
            <div style={{ width: "100%", height: 6, background: "rgba(255,106,74,0.15)", borderRadius: 100, overflow: "hidden" }}>
              <div style={{ width: "77%", height: "100%", background: "var(--app-accent)", borderRadius: 100 }} />
            </div>
          </div>

          <div className="px-5 mb-5">
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>Dados e Saúde</h3>
            <div className="premium-card" style={{ padding: 0, overflow: "hidden" }}>
              {personalData.map((data, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-3.5 cursor-pointer"
                  style={{
                    padding: "14px 16px",
                    borderTop: i > 0 ? "1px solid var(--app-border)" : "none"
                  }}
                  onClick={() => data.path && navigate(data.path)}
                >
                  <div 
                    className="flex items-center justify-center"
                    style={{ width: 36, height: 36, borderRadius: 10, background: "var(--app-accent-soft)" }}
                  >
                    <Dumbbell size={18} style={{ color: "var(--app-accent)" }} />
                  </div>
                  <div className="flex-1">
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{data.label}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{data.desc}</div>
                  </div>
                  <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Configurations list */}
      <div className="px-5 mb-6">
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>Configurações</h3>
        <div className="premium-card" style={{ padding: 0, overflow: "hidden" }}>
          {configItems.map((config, i) => (
            <div 
              key={i}
              className="flex items-center gap-3.5 cursor-pointer"
              style={{
                padding: "14px 16px",
                borderTop: i > 0 ? "1px solid var(--app-border)" : "none"
              }}
              onClick={() => {
                if (config.toggle) {
                  setUiTheme(uiTheme === 'dark-theme' ? 'light-theme' : 'dark-theme');
                }
              }}
            >
              <div 
                className="flex items-center justify-center"
                style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg-elevated)" }}
              >
                <config.icon size={18} style={{ color: "var(--text-secondary)" }} />
              </div>
              <span className="flex-1" style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{config.label}</span>
              {config.toggle ? (
                <div 
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    background: uiTheme === 'light-theme' ? 'var(--app-accent)' : 'var(--bg-elevated)',
                    padding: 2,
                    cursor: "pointer",
                    transition: "background 0.2s"
                  }}
                >
                  <div 
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "#fff",
                      transform: uiTheme === 'light-theme' ? "translateX(20px)" : "translateX(0)",
                      transition: "transform 0.2s"
                    }}
                  />
                </div>
              ) : (
                <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Exit Button */}
      <div className="px-5 mb-4">
        <button className="btn-secondary" style={{ color: "var(--app-red)", borderColor: "rgba(239,68,68,0.2)" }} onClick={onLogout}>
          <LogOut size={18} /> Sair da Conta
        </button>
      </div>
    </div>
  );
}

function ExecucaoView({ 
  activeExerciseIndex, setActiveExerciseIndex, checkedSets, toggleSetCheck,
  timerSeconds, timerRunning, handleStartTimer, handleSkipTimer, formatTimer
}) {
  const navigate = useNavigate();
  const exercise = EXERCISES_EXECUTION[activeExerciseIndex];
  
  return (
    <div style={{ paddingBottom: 24 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-3 pb-4">
        <button 
          onClick={() => navigate('/treinos')}
          className="flex items-center justify-center cursor-pointer border-none"
          style={{ width: 40, height: 40, borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--app-border)" }}
        >
          <ChevronLeft size={18} style={{ color: "var(--text-primary)" }} />
        </button>
        <div className="text-center">
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Treino A</h2>
          <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>Peito e Tríceps</p>
        </div>
        <button 
          className="flex items-center justify-center cursor-pointer border-none"
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "var(--app-accent-soft)",
            border: "1px solid rgba(255,106,74,0.2)"
          }}
        >
          <Clock size={18} style={{ color: "var(--app-accent)" }} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2.5 px-5 pb-4">
        <span style={{ fontSize: 12, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
          {activeExerciseIndex + 1} de {EXERCISES_EXECUTION.length}
        </span>
        <div style={{ flex: 1, height: 4, background: "var(--bg-elevated)", borderRadius: 100, overflow: "hidden" }}>
          <div 
            style={{
              height: "100%",
              width: `${((activeExerciseIndex + 1) / EXERCISES_EXECUTION.length) * 100}%`,
              background: "var(--app-accent)",
              borderRadius: 100,
              transition: "width 0.4s"
            }}
          />
        </div>
        <span 
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--app-accent)",
            background: "var(--app-accent-soft)",
            padding: "4px 10px",
            borderRadius: 20
          }}
        >
          {activeExerciseIndex + 1}/{EXERCISES_EXECUTION.length}
        </span>
      </div>

      {/* Video Demonstration */}
      <div 
        className="mx-5 mb-5 flex flex-col items-center justify-center gap-2.5 relative overflow-hidden"
        style={{ height: 200, background: "var(--bg-card)", border: "1px solid var(--app-border)", borderRadius: 20 }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, var(--app-accent-soft), transparent)" }} />
        <div 
          className="flex items-center justify-center relative z-10"
          style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--app-accent)", boxShadow: "0 4px 20px var(--app-accent-glow)", cursor: "pointer" }}
          onClick={() => alert("Vídeo demonstrativo carregando...")}
        >
          <Play size={24} fill="#fff" stroke="none" style={{ marginLeft: 3 }} />
        </div>
        <span className="relative z-10" style={{ fontSize: 12, color: "var(--text-muted)" }}>Vídeo demonstrativo</span>
      </div>

      {/* Exercise metadata */}
      <div className="text-center px-5 pb-4">
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>{exercise.name}</h2>
        <span style={{ fontSize: 13, color: "var(--app-accent)", fontWeight: 600 }}>{exercise.muscles}</span>
      </div>

      {/* Sets list */}
      <div className="px-5 mb-5">
        <div 
          className="grid gap-2 mb-2 px-3.5"
          style={{ gridTemplateColumns: "50px 1fr 1fr 50px", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}
        >
          <span>Série</span>
          <span>Carga (kg)</span>
          <span>Reps</span>
          <span className="text-center">OK</span>
        </div>

        {Array.from({ length: exercise.sets }).map((_, setIndex) => {
          const setNum = setIndex + 1;
          const setKey = `${activeExerciseIndex}-${setNum}`;
          const isDone = checkedSets[setKey];

          return (
            <div 
              key={setNum}
              className="grid items-center gap-2 mb-1.5"
              style={{
                gridTemplateColumns: "50px 1fr 1fr 50px",
                padding: "12px 14px",
                background: "var(--bg-card)",
                border: "1px solid var(--app-border)",
                borderRadius: 12
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 800, color: "var(--app-accent)" }}>{setNum}</span>
              <input 
                type="text"
                placeholder="--"
                defaultValue={setNum < 3 ? (60 + (setIndex * 10)) : ""}
                className="text-center"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--app-border)",
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  width: "100%",
                  outline: "none"
                }}
              />
              <input 
                type="text"
                placeholder="--"
                defaultValue={setIndex < 2 ? "12" : setIndex === 2 ? "10" : "8"}
                className="text-center"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--app-border)",
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  width: "100%",
                  outline: "none"
                }}
              />
              <div 
                className="flex items-center justify-center cursor-pointer mx-auto"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: isDone ? "none" : "2px solid var(--app-border)",
                  background: isDone ? "var(--app-green)" : "transparent",
                  transition: "all 0.2s"
                }}
                onClick={() => toggleSetCheck(setKey)}
              >
                <Check size={16} strokeWidth={3.2} style={{ color: isDone ? "#fff" : "transparent" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Rest Timer */}
      <div className="premium-card mx-5 mb-5 text-center">
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--text-secondary)", marginBottom: 6 }}>Descanso</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: "var(--app-accent)", fontVariantNumeric: "tabular-nums" }}>{formatTimer(timerSeconds)}</div>
        <div className="flex gap-3 justify-center mt-3">
          <button 
            onClick={handleStartTimer}
            className="cursor-pointer border-none"
            style={{ padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, background: "var(--app-accent)", color: "#fff" }}
          >
            {timerRunning ? "Pausar" : "Iniciar"}
          </button>
          <button 
            onClick={handleSkipTimer}
            className="cursor-pointer"
            style={{ padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--app-border)" }}
          >
            Pular
          </button>
        </div>
      </div>

      {/* Footer navigators */}
      <div className="flex gap-2.5 px-5 pb-4">
        <button 
          onClick={() => setActiveExerciseIndex(i => Math.max(0, i - 1))}
          className="flex-1 flex items-center justify-center gap-1.5 cursor-pointer"
          style={{ padding: 14, borderRadius: 12, fontSize: 14, fontWeight: 700, background: "var(--bg-card)", border: "1px solid var(--app-border)", color: "var(--text-secondary)" }}
          disabled={activeExerciseIndex === 0}
        >
          <ChevronLeft size={16} /> Anterior
        </button>
        <button 
          onClick={() => {
            if (activeExerciseIndex < EXERCISES_EXECUTION.length - 1) {
              setActiveExerciseIndex(i => i + 1);
            } else {
              navigate('/feedback');
            }
          }}
          className="flex-1 flex items-center justify-center gap-1.5 cursor-pointer border-none"
          style={{ padding: 14, borderRadius: 12, fontSize: 14, fontWeight: 700, background: "var(--app-accent)", color: "#fff" }}
        >
          {activeExerciseIndex < EXERCISES_EXECUTION.length - 1 ? "Próximo" : "Finalizar"} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function AgendaView() {
  const navigate = useNavigate();

  return (
    <div style={{ paddingBottom: 24, paddingTop: 16 }}>
      <div className="flex items-center gap-3 px-5 pb-5">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center justify-center cursor-pointer border-none"
          style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bg-card)", border: "1px solid var(--app-border)" }}
        >
          <ChevronLeft size={18} style={{ color: "var(--text-secondary)" }} />
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>Agenda</h1>
      </div>

      <div className="px-5">
        <div className="flex justify-between items-center mb-4">
          <span style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)" }}>Março 2026</span>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-5">
          {CALENDAR_DAYS.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 py-2.5 cursor-pointer" style={{ borderRadius: 14 }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--text-muted)" }}>{day.name}</span>
              <div 
                className="flex items-center justify-center"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  fontSize: 14,
                  fontWeight: 700,
                  background: day.active ? "var(--app-accent)" : "transparent",
                  color: day.active ? "#fff" : "var(--text-secondary)",
                  border: day.hasEvent && !day.active ? "2px solid rgba(255,106,74,0.25)" : "none"
                }}
              >
                {day.num}
              </div>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--app-accent)", opacity: day.hasEvent ? 1 : 0 }} />
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 14 }}>Hoje, 12 de Março</h3>
        {SCHEDULE_EVENTS_TODAY.map((event, index) => (
          <div key={index} className="premium-card mb-3">
            <div className="flex gap-3.5">
              <div className="flex flex-col items-center" style={{ minWidth: 48 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{event.time}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)" }}>{event.period}</span>
                {index < SCHEDULE_EVENTS_TODAY.length - 1 && (
                  <div style={{ width: 2, height: 24, background: event.tagType === "training" ? "rgba(255,106,74,0.25)" : "var(--app-border)", borderRadius: 2, marginTop: 6 }} />
                )}
              </div>
              <div className="flex-1">
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3, color: "var(--text-primary)" }}>{event.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>{event.subtitle}</div>
                <span 
                  style={{
                    background: event.tagType === 'training' ? 'var(--app-accent-soft)' : 'var(--app-blue-soft)',
                    color: event.tagType === 'training' ? 'var(--app-accent)' : 'var(--app-blue)',
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    padding: "4px 10px",
                    borderRadius: 20,
                    display: "inline-block"
                  }}
                >
                  {event.tag}
                </span>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mt-4 mb-3">
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Amanhã</h3>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--app-accent)", cursor: "pointer" }} onClick={() => alert("Ver semana...")}>Ver semana</span>
        </div>

        {SCHEDULE_EVENTS_TOMORROW.map((event, index) => (
          <div key={index} className="premium-card mb-3">
            <div className="flex gap-3.5 text-left">
              <div className="flex flex-col items-center" style={{ minWidth: 48 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{event.time}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)" }}>{event.period}</span>
              </div>
              <div className="flex-1">
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3, color: "var(--text-primary)" }}>{event.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>{event.subtitle}</div>
                <span 
                  style={{
                    background: 'var(--app-blue-soft)',
                    color: 'var(--app-blue)',
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    padding: "4px 10px",
                    borderRadius: 20,
                    display: "inline-block"
                  }}
                >
                  {event.tag}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeedbackView({ 
  feedbackDiff, setFeedbackDiff, 
  feedbackEnergy, setFeedbackEnergy, 
  feedbackText, setFeedbackText, 
  handleSubmitWorkoutFeedback 
}) {
  const navigate = useNavigate();
  const difficulties = ["Muito Fácil", "Fácil", "Regular", "Difícil", "Muito Difícil"];

  return (
    <div style={{ paddingBottom: 24, paddingTop: 16 }}>
      <div className="flex justify-between items-center px-5 pb-5">
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>Como foi o treino?</h1>
        <button 
          onClick={() => navigate('/')}
          className="flex items-center justify-center cursor-pointer border-none"
          style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bg-card)", border: "1px solid var(--app-border)" }}
        >
          <X size={18} style={{ color: "var(--text-secondary)" }} />
        </button>
      </div>

      <div className="px-5">
        <div 
          className="premium-card mb-5 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255,106,74,0.12), rgba(255,106,74,0.04))",
            border: "1px solid rgba(255,106,74,0.15)"
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Check size={18} style={{ color: "var(--app-green)" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--app-green)" }}>Treino Concluído!</span>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>Treino A - Peito e Tríceps</h3>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <Clock size={14} style={{ color: "var(--text-secondary)" }} />
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>52 min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Dumbbell size={14} style={{ color: "var(--text-secondary)" }} />
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>8/8 exerc.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame size={14} style={{ color: "var(--text-secondary)" }} />
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>~420 kcal</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>Dificuldade do Treino</h3>
          <div className="flex gap-2">
            {difficulties.map((diff, index) => (
              <button
                key={index}
                onClick={() => setFeedbackDiff(index)}
                className="flex-1 cursor-pointer border-none"
                style={{
                  padding: "10px 4px",
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 700,
                  textAlign: "center",
                  background: feedbackDiff === index ? "var(--app-accent)" : "var(--bg-card)",
                  color: feedbackDiff === index ? "#fff" : "var(--text-secondary)",
                  border: feedbackDiff === index ? "none" : "1px solid var(--app-border)",
                  transition: "all 0.2s"
                }}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>Disposição / Energia</h3>
          <div className="flex gap-3 justify-center">
            {Array.from({ length: 5 }).map((_, index) => {
              const starVal = index + 1;
              const active = feedbackEnergy >= starVal;
              return (
                <button 
                  key={index}
                  onClick={() => setFeedbackEnergy(starVal)}
                  className="flex flex-col items-center gap-2 cursor-pointer border-none bg-transparent"
                >
                  <div 
                    className="flex items-center justify-center"
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 14,
                      background: active ? "var(--app-accent)" : "var(--bg-card)",
                      border: active ? "none" : "1px solid var(--app-border)",
                      transition: "all 0.2s"
                    }}
                  >
                    <Star size={24} fill={active ? "#fff" : "none"} style={{ color: active ? "#fff" : "var(--text-secondary)" }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>Observações</h3>
          <div className="relative">
            <textarea 
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value.slice(0, 500))}
              placeholder="Observações para o personal..."
              rows={4}
              style={{
                width: "100%",
                background: "var(--bg-card)",
                border: "1px solid var(--app-border)",
                borderRadius: 14,
                padding: 16,
                fontSize: 14,
                color: "var(--text-primary)",
                resize: "none",
                outline: "none",
                fontFamily: "inherit"
              }}
            />
            <span className="absolute bottom-3 right-4" style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {feedbackText.length}/500
            </span>
          </div>
        </div>

        <button onClick={handleSubmitWorkoutFeedback} className="btn-primary mb-2">
          Enviar Feedback
        </button>
        <p className="text-center" style={{ fontSize: 12, color: "var(--text-muted)" }}>Seu personal receberá este feedback</p>
      </div>
    </div>
  );
}

// --- TEACHER VIEWPORT COMPONENTS ---

function TeacherHomeView({ profile, onPublishPost, students, feedbackLogs, onSelectStudent }) {
  const [newPostContent, setNewPostContent] = useState("");

  const handlePublish = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    onPublishPost(newPostContent);
    setNewPostContent("");
    alert("Postagem publicada no mural da comunidade!");
  };

  return (
    <div style={{ paddingBottom: 24, paddingTop: 16 }}>
      {/* Welcome */}
      <div className="px-5 pb-5">
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 2 }}>Painel do Treinador,</p>
        <p style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>
          Prof. <span style={{ color: "var(--app-accent)" }}>Lendel Diniz</span>
        </p>
      </div>

      {/* Teacher Stats Grid */}
      <div className="grid grid-cols-2 gap-3 px-5 mb-6">
        {[
          { label: "Alunos Ativos", value: `${students.length}`, color: "var(--app-accent)", bg: "var(--app-accent-soft)" },
          { label: "Sessões Agendadas", value: "8", color: "var(--app-blue)", bg: "var(--app-blue-soft)" },
          { label: "Feedbacks Novos", value: `${feedbackLogs.length}`, color: "var(--app-green)", bg: "var(--app-green-soft)" },
          { label: "Aulas Realizadas", value: "14", color: "var(--app-yellow)", bg: "var(--app-yellow-soft)" }
        ].map((stat, i) => (
          <div key={i} className="premium-card">
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--text-muted)", marginBottom: 4 }}>{stat.label}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: stat.color, marginBottom: 2 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Community Post Creator */}
      <div className="px-5 mb-6">
        <div className="premium-card">
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>Comunicado para a Comunidade</h3>
          <form onSubmit={handlePublish}>
            <textarea
              placeholder="Digite um aviso, desafio ou dica de saúde..."
              rows={3}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              style={{
                width: "100%",
                background: "var(--bg-elevated)",
                border: "1px solid var(--app-border)",
                borderRadius: 12,
                padding: 12,
                fontSize: 13,
                color: "var(--text-primary)",
                resize: "none",
                outline: "none",
                marginBottom: 12,
                fontFamily: "inherit"
              }}
              required
            />
            <button type="submit" className="btn-primary" style={{ width: "auto", padding: "10px 24px" }}>
              Publicar
            </button>
          </form>
        </div>
      </div>

      {/* Students List */}
      <div className="px-5 mb-6">
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>Meus Alunos</h3>
        <div className="flex flex-col gap-2.5">
          {students.map((student) => (
            <div key={student.id} className="premium-card flex justify-between items-center">
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{student.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                  {student.plan} • Sequência: {student.streak} dias
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                  Último treino: {student.lastWorkout}
                </div>
              </div>
              <button
                className="cursor-pointer border-none flex items-center justify-center gap-1"
                onClick={() => onSelectStudent(student)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 10,
                  background: "var(--app-accent-soft)",
                  color: "var(--app-accent)",
                  fontSize: 12,
                  fontWeight: 700
                }}
              >
                Treinos <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Feedbacks Log */}
      <div className="px-5">
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>Logs de Treino Recentes</h3>
        <div className="flex flex-col gap-2.5">
          {feedbackLogs.map((log, index) => (
            <div key={index} className="premium-card">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{log.student}</span>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", marginLeft: 6 }}>{log.workout}</span>
                </div>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{log.date}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span 
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 10,
                    background: log.difficulty === 'Difícil' || log.difficulty === 'Muito Difícil' ? 'rgba(239,68,68,0.1)' : 'var(--app-accent-soft)',
                    color: log.difficulty === 'Difícil' || log.difficulty === 'Muito Difícil' ? 'var(--app-red)' : 'var(--app-accent)'
                  }}
                >
                  {log.difficulty}
                </span>
                <span className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, sIdx) => (
                    <Star 
                      key={sIdx} 
                      size={11} 
                      fill={sIdx < log.energy ? "var(--app-yellow)" : "none"} 
                      style={{ color: sIdx < log.energy ? "var(--app-yellow)" : "var(--text-muted)" }} 
                    />
                  ))}
                </span>
              </div>
              {log.notes && (
                <p style={{ fontSize: 12, color: "var(--text-secondary)", background: "var(--bg-elevated)", padding: 8, borderRadius: 8, marginTop: 4 }}>
                  "{log.notes}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EditWorkoutView({ student, onBack }) {
  const [workouts, setWorkouts] = useState(DEFAULT_WORKOUTS);
  const [activeWorkoutTab, setActiveWorkoutTab] = useState('A');
  const [newExName, setNewExName] = useState("");
  const [newExMuscles, setNewExMuscles] = useState("");
  const [newExSets, setNewExSets] = useState(4);

  // Load from local storage if edited before
  useEffect(() => {
    const key = student.id === 'd1a04b50-db95-4527-a407-2c663fa49d0e' ? 'gym_workouts' : `workouts_${student.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setWorkouts(JSON.parse(saved));
    } else {
      setWorkouts(DEFAULT_WORKOUTS);
    }
  }, [student]);

  const handleAddExercise = (e) => {
    e.preventDefault();
    if (!newExName.trim() || !newExMuscles.trim()) return;

    const updated = workouts.map(workout => {
      if (workout.letter === activeWorkoutTab) {
        return {
          ...workout,
          exercisesCount: workout.exercisesCount + 1,
          preview: [
            ...workout.preview,
            { name: newExName, sets: `${newExSets}x12` }
          ]
        };
      }
      return workout;
    });

    setWorkouts(updated);
    const key = student.id === 'd1a04b50-db95-4527-a407-2c663fa49d0e' ? 'gym_workouts' : `workouts_${student.id}`;
    localStorage.setItem(key, JSON.stringify(updated));
    setNewExName("");
    setNewExMuscles("");
    setNewExSets(4);
    alert("Exercício adicionado com sucesso!");
  };

  const handleDeleteExercise = (exIdx) => {
    const updated = workouts.map(workout => {
      if (workout.letter === activeWorkoutTab) {
        return {
          ...workout,
          exercisesCount: Math.max(0, workout.exercisesCount - 1),
          preview: workout.preview.filter((_, idx) => idx !== exIdx)
        };
      }
      return workout;
    });
    setWorkouts(updated);
    const key = student.id === 'd1a04b50-db95-4527-a407-2c663fa49d0e' ? 'gym_workouts' : `workouts_${student.id}`;
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const activeWorkout = workouts.find(w => w.letter === activeWorkoutTab) || workouts[0];

  return (
    <div style={{ paddingBottom: 24, paddingTop: 16 }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pb-5">
        <button 
          onClick={onBack}
          className="flex items-center justify-center cursor-pointer border-none"
          style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bg-card)", border: "1px solid var(--app-border)" }}
        >
          <ChevronLeft size={18} style={{ color: "var(--text-secondary)" }} />
        </button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)" }}>Ficha de Treino</h1>
          <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>Editando treinos de {student.name}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-5 mb-5">
        {['A', 'B', 'C'].map(tab => (
          <button
            key={tab}
            className="flex-1 cursor-pointer border-none"
            onClick={() => setActiveWorkoutTab(tab)}
            style={{
              padding: "12px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
              background: activeWorkoutTab === tab ? "var(--app-accent)" : "var(--bg-card)",
              color: activeWorkoutTab === tab ? "#fff" : "var(--text-secondary)",
              border: activeWorkoutTab === tab ? "none" : "1px solid var(--app-border)"
            }}
          >
            Treino {tab}
          </button>
        ))}
      </div>

      {/* Workout details card */}
      <div className="premium-card mx-5 mb-6">
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{activeWorkout.title}</h3>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 12 }}>Foco: {activeWorkout.muscles}</p>
        
        <h4 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 10 }}>Exercícios Atuais ({activeWorkout.preview.length})</h4>
        
        <div className="flex flex-col gap-2.5">
          {activeWorkout.preview.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--text-muted)", padding: "12px 0" }}>Nenhum exercício cadastrado.</p>
          ) : (
            activeWorkout.preview.map((ex, idx) => (
              <div 
                key={idx}
                className="flex justify-between items-center p-3"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--app-border)", borderRadius: 10 }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{ex.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{ex.sets}</div>
                </div>
                <button
                  className="cursor-pointer border-none flex items-center justify-center"
                  onClick={() => handleDeleteExercise(idx)}
                  style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(239,68,68,0.1)", color: "var(--app-red)" }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add exercise form */}
      <div className="premium-card mx-5">
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>Adicionar Exercício ao Treino {activeWorkoutTab}</h3>
        <form onSubmit={handleAddExercise} className="flex flex-col gap-3.5">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: 11 }}>Nome do Exercício</label>
            <input 
              type="text" 
              placeholder="Ex: Pulldown frontal"
              className="premium-input" 
              value={newExName}
              onChange={(e) => setNewExName(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: 11 }}>Músculo Alvo / Instruções</label>
            <input 
              type="text" 
              placeholder="Ex: Dorsal, redondo maior"
              className="premium-input" 
              value={newExMuscles}
              onChange={(e) => setNewExMuscles(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: 11 }}>Número de Séries ({newExSets})</label>
            <input 
              type="range" 
              min="2" max="6" 
              className="slider-input"
              value={newExSets}
              onChange={(e) => setNewExSets(parseInt(e.target.value))}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: 6 }}>
            <Plus size={16} /> Adicionar Exercício
          </button>
        </form>
      </div>
    </div>
  );
}

// --- MAIN LAYOUT SHELL CONTENT ---

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- AUTHENTICATION STATE ---
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('gym_user');
    return saved ? JSON.parse(saved) : null;
  });

  // --- STATE VARIABLES ---
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [workouts, setWorkouts] = useState(DEFAULT_WORKOUTS);
  const [diet, setDiet] = useState(DEFAULT_DIET);
  const [posts, setPosts] = useState(DEFAULT_POSTS);
  const [likedPosts, setLikedPosts] = useState({});
  const [uiTheme, setUiTheme] = useState('dark-theme');
  const [waterGlasses, setWaterGlasses] = useState(4);
  const [activeMealIndex, setActiveMealIndex] = useState(-1);
  
  // Exercise states
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [checkedSets, setCheckedSets] = useState({});
  const [timerSeconds, setTimerSeconds] = useState(90);
  const [timerRunning, setTimerRunning] = useState(false);

  // Feedback states
  const [feedbackDiff, setFeedbackDiff] = useState(2); // Regular
  const [feedbackEnergy, setFeedbackEnergy] = useState(4); // 4 stars
  const [feedbackText, setFeedbackText] = useState("");

  // Teacher states
  const [students, setStudents] = useState(DEFAULT_STUDENTS);
  const [feedbackLogs, setFeedbackLogs] = useState(DEFAULT_FEEDBACK_LOGS);
  const [editingStudent, setEditingStudent] = useState(null);

  const isSupabaseEnabled = supabase !== null;

  // Handle Login / Logout Actions
  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('gym_user', JSON.stringify(user));
    if (user.role === 'teacher') {
      navigate('/professor');
    } else {
      setProfile(user);
      navigate('/');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('gym_user');
    navigate('/login');
  };

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!currentUser && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [currentUser, location.pathname, navigate]);

  // --- SYNC DATA WITH DATABASE OR LOCALSTORAGE ---
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'student') return;

    async function initData() {
      if (isSupabaseEnabled) {
        try {
          // 1. Fetch Profile
          const { data: profData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();

          if (profData) {
            setProfile(profData);
          }

          // 2. Fetch Workouts
          const { data: wData } = await supabase.from('workouts').select('*').order('letter', { ascending: true });
          if (wData && wData.length > 0) {
            const mappedWorkouts = DEFAULT_WORKOUTS.map(dw => {
              const dbw = wData.find(x => x.letter === dw.letter);
              return dbw ? {
                ...dw,
                title: dbw.title,
                muscles: dbw.muscles,
                duration: dbw.duration,
                lastTime: dbw.last_completed_at
              } : dw;
            });
            setWorkouts(mappedWorkouts);
          }

          // 3. Fetch Diet Log
          const todayStr = new Date().toISOString().split('T')[0];
          const { data: dLog } = await supabase
            .from('diet_logs')
            .select('*')
            .eq('profile_id', currentUser.id)
            .eq('log_date', todayStr)
            .single();

          if (dLog) {
            setDiet({
              kcal_consumed: dLog.kcal_consumed,
              kcal_target: 2200,
              water_glasses: dLog.water_glasses,
              protein_grams: dLog.protein_grams,
              carbs_grams: dLog.carbs_grams,
              fat_grams: dLog.fat_grams
            });
            setWaterGlasses(dLog.water_glasses);
          } else {
            // Create default log
            await supabase.from('diet_logs').insert({
              profile_id: currentUser.id,
              log_date: todayStr,
              kcal_consumed: DEFAULT_DIET.kcal_consumed,
              water_glasses: DEFAULT_DIET.water_glasses,
              protein_grams: DEFAULT_DIET.protein_grams,
              carbs_grams: DEFAULT_DIET.carbs_grams,
              fat_grams: DEFAULT_DIET.fat_grams
            });
          }

          // 4. Fetch Community Posts
          const { data: pData } = await supabase.from('community_posts').select('*').order('created_at', { ascending: false });
          if (pData && pData.length > 0) {
            setPosts(pData);
          }
        } catch (e) {
          console.error('Falha de conexão com Supabase. Fallback local.', e);
          loadLocalFallback();
        }
      } else {
        loadLocalFallback();
      }
    }

    initData();
  }, [currentUser, isSupabaseEnabled]);

  const loadLocalFallback = () => {
    const localProfile = localStorage.getItem('gym_profile');
    const localDiet = localStorage.getItem('gym_diet');
    const localWorkouts = localStorage.getItem('gym_workouts');

    if (localProfile) setProfile(JSON.parse(localProfile));
    if (localDiet) {
      const parsedDiet = JSON.parse(localDiet);
      setDiet(parsedDiet);
      setWaterGlasses(parsedDiet.water_glasses);
    }
    if (localWorkouts) setWorkouts(JSON.parse(localWorkouts));
  };

  // Sync UI class theme
  useEffect(() => {
    document.body.className = uiTheme;
  }, [uiTheme]);

  const handleUpdateWater = async (newGlasses) => {
    setWaterGlasses(newGlasses);
    const updatedDiet = { ...diet, water_glasses: newGlasses };
    setDiet(updatedDiet);

    if (isSupabaseEnabled) {
      const todayStr = new Date().toISOString().split('T')[0];
      await supabase
        .from('diet_logs')
        .update({ water_glasses: newGlasses })
        .eq('profile_id', profile.id)
        .eq('log_date', todayStr);
    } else {
      localStorage.setItem('gym_diet', JSON.stringify(updatedDiet));
    }
  };

  const handleToggleLike = async (postIndex, postId) => {
    const hasLiked = likedPosts[postIndex];
    setLikedPosts(prev => ({ ...prev, [postIndex]: !prev[postIndex] }));

    const updatedPosts = posts.map((post, idx) => {
      if (idx === postIndex) {
        return {
          ...post,
          likes_count: post.likes_count + (hasLiked ? -1 : 1)
        };
      }
      return post;
    });
    setPosts(updatedPosts);

    if (isSupabaseEnabled && postId) {
      await supabase
        .from('community_posts')
        .update({ likes_count: updatedPosts[postIndex].likes_count })
        .eq('id', postId);
    }
  };

  const handleSubmitWorkoutFeedback = async () => {
    const difficultyName = ["Muito Fácil", "Fácil", "Regular", "Difícil", "Muito Difícil"][feedbackDiff];
    
    // Create feedback log object
    const newLog = {
      student: profile.full_name,
      workout: 'Treino A',
      difficulty: difficultyName,
      energy: feedbackEnergy,
      notes: feedbackText,
      date: 'Hoje'
    };
    
    // Add to logs state
    setFeedbackLogs(prev => [newLog, ...prev]);

    // Update students list workout status
    setStudents(prev => prev.map(student => {
      if (student.id === profile.id) {
        return {
          ...student,
          lastWorkout: 'Hoje',
          streak: student.streak + 1
        };
      }
      return student;
    }));

    if (isSupabaseEnabled) {
      await supabase.from('workout_logs').insert({
        profile_id: profile.id,
        workout_letter: 'A',
        difficulty: difficultyName,
        energy_rating: feedbackEnergy,
        notes: feedbackText,
        duration_minutes: 52
      });

      await supabase
        .from('workouts')
        .update({ last_completed_at: 'Hoje' })
        .eq('letter', 'A');

      const newStreak = profile.streak_days + 1;
      await supabase
        .from('profiles')
        .update({ streak_days: newStreak })
        .eq('id', profile.id);

      setProfile(prev => ({ ...prev, streak_days: newStreak }));
    } else {
      const newStreak = profile.streak_days + 1;
      const updatedProfile = { ...profile, streak_days: newStreak };
      setProfile(updatedProfile);
      localStorage.setItem('gym_profile', JSON.stringify(updatedProfile));

      const updatedWorkouts = workouts.map(w => w.letter === 'A' ? { ...w, lastTime: 'Hoje' } : w);
      setWorkouts(updatedWorkouts);
      localStorage.setItem('gym_workouts', JSON.stringify(updatedWorkouts));
    }

    alert("Feedback enviado com sucesso! Bom descanso.");
    setFeedbackText("");
    navigate('/');
  };

  // Publish post from teacher dashboard
  const handlePublishPost = async (content) => {
    const newPost = {
      avatar: "LD",
      name: "Lendel Diniz",
      is_personal: true,
      content: content,
      likes_count: 0,
      comments_count: 0
    };

    setPosts(prev => [newPost, ...prev]);

    if (isSupabaseEnabled) {
      await supabase.from('community_posts').insert({
        avatar: newPost.avatar,
        name: newPost.name,
        is_personal: true,
        content: newPost.content,
        likes_count: 0,
        comments_count: 0
      });
    }
  };

  const handleStartTimer = () => {
    setTimerRunning(!timerRunning);
  };

  const handleSkipTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(90);
  };

  const toggleSetCheck = (setKey) => {
    setCheckedSets(prev => ({
      ...prev,
      [setKey]: !prev[setKey]
    }));
  };

  const formatTimer = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  // Sync Rest timer
  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => {
          if (s <= 1) {
            clearInterval(interval);
            setTimerRunning(false);
            return 90;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  const showNavbar = !['/execucao', '/agenda', '/feedback', '/perfil'].includes(location.pathname) && !editingStudent;
  const isTeacher = currentUser.role === 'teacher';

  return (
    <div className="app-container">
      {/* Top Header */}
      {showNavbar && (
        <div className="app-header">
          <span 
            className="michroma-title"
            style={{
              fontSize: 13,
              color: "var(--app-accent)",
              letterSpacing: 1.5,
              cursor: "pointer",
              fontWeight: 800
            }}
            onClick={() => navigate(isTeacher ? '/professor' : '/')}
          >
            LENDEL DINIZ
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => navigate('/perfil')}
              className="flex items-center justify-center cursor-pointer border-none"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "var(--bg-card)",
                border: "1px solid var(--app-border)"
              }}
            >
              <User size={18} style={{ color: "var(--text-secondary)" }} />
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center cursor-pointer border-none"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "var(--bg-card)",
                border: "1px solid var(--app-border)"
              }}
              title="Sair da Conta"
            >
              <LogOut size={18} style={{ color: "var(--app-red)" }} />
            </button>
          </div>
        </div>
      )}

      {/* Main viewport */}
      <div 
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{ paddingBottom: showNavbar ? 84 : 24, scrollbarWidth: "none" }}
      >
        {isTeacher ? (
          editingStudent ? (
            <EditWorkoutView 
              student={editingStudent} 
              onBack={() => setEditingStudent(null)} 
            />
          ) : (
            <Routes>
              <Route 
                path="/professor" 
                element={
                  <TeacherHomeView 
                    profile={currentUser}
                    onPublishPost={handlePublishPost}
                    students={students}
                    feedbackLogs={feedbackLogs}
                    onSelectStudent={(student) => setEditingStudent(student)}
                  />
                } 
              />
              <Route path="/comunidade" element={<ComunidadeView posts={posts} likedPosts={likedPosts} handleToggleLike={handleToggleLike} />} />
              <Route path="/perfil" element={<PerfilView profile={currentUser} uiTheme={uiTheme} setUiTheme={setUiTheme} onLogout={handleLogout} />} />
              <Route path="*" element={<Navigate to="/professor" replace />} />
            </Routes>
          )
        ) : (
          <Routes>
            <Route path="/" element={<HomeView profile={profile} diet={diet} />} />
            <Route path="/treinos" element={<TreinosView workouts={workouts} setActiveExerciseIndex={setActiveExerciseIndex} setCheckedSets={setCheckedSets} />} />
            <Route path="/dieta" element={<DietaView diet={diet} waterGlasses={waterGlasses} handleUpdateWater={handleUpdateWater} activeMealIndex={activeMealIndex} setActiveMealIndex={setActiveMealIndex} />} />
            <Route path="/comunidade" element={<ComunidadeView posts={posts} likedPosts={likedPosts} handleToggleLike={handleToggleLike} />} />
            <Route path="/perfil" element={<PerfilView profile={profile} uiTheme={uiTheme} setUiTheme={setUiTheme} onLogout={handleLogout} />} />
            <Route 
              path="/execucao" 
              element={
                <ExecucaoView 
                  activeExerciseIndex={activeExerciseIndex} 
                  setActiveExerciseIndex={setActiveExerciseIndex} 
                  checkedSets={checkedSets} 
                  toggleSetCheck={toggleSetCheck} 
                  timerSeconds={timerSeconds}
                  timerRunning={timerRunning}
                  handleStartTimer={handleStartTimer}
                  handleSkipTimer={handleSkipTimer}
                  formatTimer={formatTimer}
                />
              } 
            />
            <Route path="/agenda" element={<AgendaView />} />
            <Route 
              path="/feedback" 
              element={
                <FeedbackView 
                  feedbackDiff={feedbackDiff} 
                  setFeedbackDiff={setFeedbackDiff} 
                  feedbackEnergy={feedbackEnergy} 
                  setFeedbackEnergy={setFeedbackEnergy} 
                  feedbackText={feedbackText} 
                  setFeedbackText={setFeedbackText} 
                  handleSubmitWorkoutFeedback={handleSubmitWorkoutFeedback} 
                />
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </div>

      {/* Tab Menu Bar */}
      {showNavbar && (
        <div className="app-navbar">
          {isTeacher ? (
            [
              { id: '/professor', label: 'Painel', icon: Heart },
              { id: '/comunidade', label: 'Comunidade', icon: Users }
            ].map(tab => {
              const isActive = location.pathname === tab.id;
              return (
                <button 
                  key={tab.id}
                  onClick={() => navigate(tab.id)}
                  className={`tab-menu-item ${isActive ? 'active' : ''}`}
                >
                  <tab.icon 
                    size={22} 
                    strokeWidth={ isActive ? 2.5 : 1.8 }
                  />
                  <span 
                    style={{
                      fontSize: 10,
                      fontWeight: isActive ? 700 : 600,
                      letterSpacing: 0.2
                    }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })
          ) : (
            [
              { id: '/', label: 'Início', icon: Heart },
              { id: '/treinos', label: 'Treinos', icon: Dumbbell },
              { id: '/dieta', label: 'Dieta', icon: Apple },
              { id: '/comunidade', label: 'Comunidade', icon: Users }
            ].map(tab => {
              const isActive = location.pathname === tab.id;
              return (
                <button 
                  key={tab.id}
                  onClick={() => navigate(tab.id)}
                  className={`tab-menu-item ${isActive ? 'active' : ''}`}
                >
                  <tab.icon 
                    size={22} 
                    strokeWidth={ isActive ? 2.5 : 1.8 }
                  />
                  <span 
                    style={{
                      fontSize: 10,
                      fontWeight: isActive ? 700 : 600,
                      letterSpacing: 0.2
                    }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

// --- APP ROOT (ROUTER WRAPPER) ---
function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;
