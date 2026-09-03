-- Create enum for debt types
CREATE TYPE public.debt_type AS ENUM ('owed_to_me', 'i_owe');

-- Create debts table
CREATE TABLE IF NOT EXISTS public.debts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type public.debt_type NOT NULL,
    counterpart_name TEXT NOT NULL,
    amount BIGINT NOT NULL CHECK (amount > 0),
    note TEXT,
    due_date DATE,
    settled_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_debts_user_id ON public.debts(user_id);
CREATE INDEX IF NOT EXISTS idx_debts_settled_at ON public.debts(settled_at);
CREATE INDEX IF NOT EXISTS idx_debts_type ON public.debts(type);

-- Trigger for auto updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_debts_updated_at
BEFORE UPDATE ON public.debts
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;

-- Strict RLS Policies (User can only CRUD their own rows)
CREATE POLICY "Users can view their own debts"
    ON public.debts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own debts"
    ON public.debts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own debts"
    ON public.debts FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own debts"
    ON public.debts FOR DELETE
    USING (auth.uid() = user_id);
