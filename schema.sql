-- --- SCHEMA SQL PARA APLICATIVO LENDEL DINIZ ---

-- Tabela de Perfis de Alunos
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    plan_name TEXT DEFAULT 'Plano Premium - Personal Lendel',
    role TEXT DEFAULT 'student',
    streak_days INTEGER DEFAULT 0,
    access_days_remaining INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Treinos (Lista Geral)
CREATE TABLE IF NOT EXISTS public.workouts (
    id SERIAL PRIMARY KEY,
    letter CHAR(1) NOT NULL UNIQUE,
    title TEXT NOT NULL,
    muscles TEXT NOT NULL,
    duration INTEGER DEFAULT 50, -- em minutos
    last_completed_at TEXT DEFAULT 'Nunca'
);

-- Tabela de Exercícios dos Treinos
CREATE TABLE IF NOT EXISTS public.exercises (
    id SERIAL PRIMARY KEY,
    workout_letter CHAR(1) REFERENCES public.workouts(letter) ON DELETE CASCADE,
    name TEXT NOT NULL,
    muscles TEXT NOT NULL,
    sets_count INTEGER DEFAULT 4,
    order_index INTEGER NOT NULL
);

-- Tabela de Logs de Treino Concluído (Feedback)
CREATE TABLE IF NOT EXISTS public.workout_logs (
    id SERIAL PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    workout_letter CHAR(1) NOT NULL,
    difficulty TEXT NOT NULL,
    energy_rating INTEGER NOT NULL,
    notes TEXT,
    duration_minutes INTEGER DEFAULT 50,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Registro de Dieta e Água
CREATE TABLE IF NOT EXISTS public.diet_logs (
    id SERIAL PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    log_date DATE DEFAULT CURRENT_DATE NOT NULL,
    kcal_consumed INTEGER DEFAULT 0,
    water_glasses INTEGER DEFAULT 0,
    protein_grams INTEGER DEFAULT 0,
    carbs_grams INTEGER DEFAULT 0,
    fat_grams INTEGER DEFAULT 0,
    CONSTRAINT unique_profile_date UNIQUE (profile_id, log_date)
);

-- Tabela de Posts da Comunidade
CREATE TABLE IF NOT EXISTS public.community_posts (
    id SERIAL PRIMARY KEY,
    avatar TEXT NOT NULL,
    name TEXT NOT NULL,
    is_personal BOOLEAN DEFAULT FALSE,
    content TEXT NOT NULL,
    has_image BOOLEAN DEFAULT FALSE,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Agenda de Eventos
CREATE TABLE IF NOT EXISTS public.schedule_events (
    id SERIAL PRIMARY KEY,
    event_date DATE DEFAULT CURRENT_DATE NOT NULL,
    event_time TEXT NOT NULL,
    period CHAR(2) NOT NULL, -- AM ou PM
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    tag TEXT NOT NULL,
    tag_type TEXT NOT NULL -- session ou training
);

-- --- DADOS MOCK INICIAIS ---

-- 1. Inserir Perfis de Teste (Aluno e Professor)
INSERT INTO public.profiles (id, full_name, plan_name, role, streak_days, access_days_remaining)
VALUES 
('d1a04b50-db95-4527-a407-2c663fa49d0e', 'João Silva', 'Plano Premium - Personal Lendel', 'student', 7, 23),
('c1a04b50-db95-4527-a407-2c663fa49d0f', 'Lendel Diniz', 'Treinador / Personal Trainer', 'teacher', 0, 9999)
ON CONFLICT (id) DO NOTHING;

-- 2. Inserir Treinos
INSERT INTO public.workouts (letter, title, muscles, duration, last_completed_at)
VALUES 
('A', 'Peito e Tríceps', 'Peitoral, tríceps, deltoide anterior', 55, 'Ontem'),
('B', 'Costas e Bíceps', 'Dorsal, trapézio, bíceps, antebraço', 50, '3 dias atrás'),
('C', 'Pernas e Glúteos', 'Quadríceps, posterior, glúteo, panturrilha', 60, '5 dias atrás')
ON CONFLICT (letter) DO NOTHING;

-- 3. Inserir Exercícios do Treino A
INSERT INTO public.exercises (workout_letter, name, muscles, sets_count, order_index)
VALUES 
('A', 'Supino Reto', 'Peitoral Maior - Tríceps - Deltoide Anterior', 4, 1),
('A', 'Supino Inclinado', 'Peitoral Superior - Tríceps', 4, 2),
('A', 'Crossover', 'Peitoral - Deltoide Anterior', 3, 3),
('A', 'Flies com Halteres', 'Peitoral Maior', 3, 4),
('A', 'Tríceps Pulley', 'Tríceps', 4, 5),
('A', 'Tríceps Testa', 'Tríceps', 3, 6),
('A', 'Tríceps Corda', 'Tríceps', 3, 7),
('A', 'Mergulho', 'Peitoral - Tríceps', 3, 8)
ON CONFLICT DO NOTHING;

-- 4. Inserir Logs de Dieta Iniciais
INSERT INTO public.diet_logs (profile_id, log_date, kcal_consumed, water_glasses, protein_grams, carbs_grams, fat_grams)
VALUES 
('d1a04b50-db95-4527-a407-2c663fa49d0e', CURRENT_DATE, 1680, 4, 120, 180, 55)
ON CONFLICT (profile_id, log_date) DO NOTHING;

-- 5. Inserir Posts da Comunidade
INSERT INTO public.community_posts (avatar, name, is_personal, content, has_image, likes_count, comments_count)
VALUES 
('LD', 'Lendel Diniz', TRUE, 'Galera, novo desafio da semana! Quem completar 5 treinos ganha destaque no ranking. Bora treinar duro e manter o foco!', FALSE, 12, 4),
('MR', 'Maria Ribeiro', FALSE, 'Completei meu treino de pernas hoje! Agachamento com recorde pessoal (PR) de 80kg! A sensação de dever cumprido é a melhor.', TRUE, 24, 8),
('JS', 'João Silva', FALSE, '7 dias de sequência de treinos e dieta 100%! Obrigado Lendel pela motivação diária.', FALSE, 18, 3)
ON CONFLICT DO NOTHING;

-- 6. Inserir Eventos da Agenda
INSERT INTO public.schedule_events (event_date, event_time, period, title, subtitle, tag, tag_type)
VALUES 
(CURRENT_DATE, '08:00', 'AM', 'Yoga Matinal', 'Com Ana Silva - Sala 2', 'Aula em grupo', 'session'),
(CURRENT_DATE, '10:00', 'AM', 'Treino A - Peito e Tríceps', 'Treino individual', 'Treino', 'training'),
(CURRENT_DATE, '18:00', 'PM', 'Sessão com Personal', 'Com Lendel Diniz - Presencial', 'Sessão personal', 'session'),
(CURRENT_DATE + 1, '08:00', 'AM', 'CrossFit', 'Com Carlos Santos - Sala 1', 'Aula em grupo', 'session')
ON CONFLICT DO NOTHING;
