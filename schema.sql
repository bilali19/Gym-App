-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create workout_sessions table
CREATE TABLE IF NOT EXISTS workout_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    workout_type VARCHAR(100) NOT NULL,
    target_muscles TEXT[] NOT NULL,
    goal VARCHAR(100) NOT NULL,
    total_sets INTEGER NOT NULL DEFAULT 0,
    completed_sets INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create exercises table (for the workout session exercises)
CREATE TABLE IF NOT EXISTS workout_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE,
    exercise_name VARCHAR(255) NOT NULL,
    exercise_type VARCHAR(50) NOT NULL,
    muscles TEXT[] NOT NULL,
    description TEXT,
    unit VARCHAR(20) NOT NULL,
    target_reps INTEGER,
    target_rest INTEGER,
    tempo VARCHAR(20),
    notes TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create exercise_sets table (for tracking individual sets)
CREATE TABLE IF NOT EXISTS exercise_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_exercise_id UUID REFERENCES workout_exercises(id) ON DELETE CASCADE,
    set_number INTEGER NOT NULL,
    target_reps INTEGER,
    actual_reps INTEGER,
    weight DECIMAL(6,2),
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_date ON workout_sessions(date);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_session_id ON workout_exercises(workout_session_id);
CREATE INDEX IF NOT EXISTS idx_exercise_sets_exercise_id ON exercise_sets(workout_exercise_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_workout_sessions_updated_at ON workout_sessions;
CREATE TRIGGER update_workout_sessions_updated_at 
    BEFORE UPDATE ON workout_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
-- Sample users (password is 'password123' for all - hashed with bcrypt)
INSERT INTO users (id, name, email, password_hash) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'John Doe', 'john@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewDZs9c3Oe9q2QyK'),
('550e8400-e29b-41d4-a716-446655440001', 'Jane Smith', 'jane@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewDZs9c3Oe9q2QyK'),
('550e8400-e29b-41d4-a716-446655440002', 'Mike Johnson', 'mike@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewDZs9c3Oe9q2QyK');

-- Sample completed workout sessions
INSERT INTO workout_sessions (id, user_id, date, start_time, end_time, workout_type, target_muscles, goal, total_sets, completed_sets, notes) VALUES 
('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', '2024-12-28', '2024-12-28 09:00:00+00', '2024-12-28 10:15:00+00', 'individual', '{"chest", "triceps"}', 'strength_power', 15, 12, 'Great workout! Felt strong today.'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '2024-12-26', '2024-12-26 18:30:00+00', '2024-12-26 19:45:00+00', 'bro_split', '{"back", "biceps"}', 'growth_hypertrophy', 20, 18, 'Pull day complete. Good pump!'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '2024-12-27', '2024-12-27 07:00:00+00', '2024-12-27 08:00:00+00', 'individual', '{"legs", "glutes"}', 'cardiovascular_endurance', 25, 25, 'Leg day beast mode!'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '2024-12-25', '2024-12-25 16:00:00+00', '2024-12-25 17:30:00+00', 'upper_lower', '{"shoulders", "chest"}', 'strength_power', 20, 16, 'Christmas workout done!');

-- Sample workout exercises
INSERT INTO workout_exercises (id, workout_session_id, exercise_name, exercise_type, muscles, description, unit, target_reps, target_rest, tempo, order_index) VALUES 
-- John's Chest/Triceps workout exercises
('770e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 'barbell_bench_press', 'compound', '{"chest"}', 'Ensure your scapula are retracted when performing the bench press', 'reps', 6, 120, '3 0 2', 0),
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 'tricep_rope_pushdown', 'accessory', '{"triceps"}', 'Keeping your elbows just in-front of your sides, straighten your arms', 'reps', 12, 60, '2 1 1', 1),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440000', 'dumbbell_chest_fly', 'accessory', '{"chest"}', 'Holding a dumbbell in each hand directly above your chest', 'reps', 10, 60, '3 2 1', 2),

-- John's Back/Biceps workout exercises  
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'pullup', 'compound', '{"back"}', 'Start by retracting your scapula down and back', 'reps', 8, 120, '2 0 2', 0),
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440001', 'barbell_bentover_row', 'compound', '{"back"}', 'Hinge at your hips until your torso is angled 45 degrees forward', 'reps', 10, 90, '3 0 2', 1),
('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440001', 'dumbbell_curls', 'compound', '{"biceps"}', 'Curl each dumbbell upwards minimizing shoulder usage', 'reps', 12, 60, '2 1 1', 2),
('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440001', 'cable_rope_face_pulls', 'accessory', '{"shoulders"}', 'Pull the rope towards your forehead with thumbs pointing behind you', 'reps', 15, 45, '1 0 1', 3),

-- Jane's Leg workout exercises
('770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440002', 'back_squats', 'compound', '{"quads"}', 'Stand with feet slightly wider than shoulder width', 'reps', 15, 90, '3 0 2', 0),
('770e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440002', 'romanian_deadlifts', 'compound', '{"hamstrings"}', 'Hinge at your hips, slightly sitting back whilst tilting forward', 'reps', 12, 90, '3 2 1', 1),
('770e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440002', 'lunges', 'accessory', '{"quads", "glutes"}', 'Continuously lunge forward, dropping your rear knee to touch the ground', 'reps', 20, 60, '2 1 1', 2),
('770e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440002', 'hip_thrusts', 'compound', '{"glutes"}', 'Thrust your hips forward and tuck your chin', 'reps', 18, 60, '2 2 2', 3),
('770e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440002', 'seated_calf_raises', 'accessory', '{"calves"}', 'Standing with weight loaded, plantar flex your toes', 'reps', 25, 45, '1 0 1', 4);

-- Sample exercise sets with realistic progress
INSERT INTO exercise_sets (workout_exercise_id, set_number, target_reps, actual_reps, weight, completed, completed_at) VALUES 
-- John's Bench Press sets
('770e8400-e29b-41d4-a716-446655440000', 1, 6, 6, 185, true, '2024-12-28 09:05:00+00'),
('770e8400-e29b-41d4-a716-446655440000', 2, 6, 6, 185, true, '2024-12-28 09:08:00+00'),
('770e8400-e29b-41d4-a716-446655440000', 3, 6, 5, 185, true, '2024-12-28 09:11:00+00'),
('770e8400-e29b-41d4-a716-446655440000', 4, 6, 5, 175, true, '2024-12-28 09:14:00+00'),
('770e8400-e29b-41d4-a716-446655440000', 5, 6, 4, 175, false, null),

-- John's Tricep Pushdowns
('770e8400-e29b-41d4-a716-446655440001', 1, 12, 12, 60, true, '2024-12-28 09:20:00+00'),
('770e8400-e29b-41d4-a716-446655440001', 2, 12, 11, 60, true, '2024-12-28 09:22:00+00'),
('770e8400-e29b-41d4-a716-446655440001', 3, 12, 10, 60, true, '2024-12-28 09:24:00+00'),
('770e8400-e29b-41d4-a716-446655440001', 4, 12, 10, 55, true, '2024-12-28 09:26:00+00'),
('770e8400-e29b-41d4-a716-446655440001', 5, 12, 9, 55, false, null),

-- John's Chest Flys
('770e8400-e29b-41d4-a716-446655440002', 1, 10, 10, 30, true, '2024-12-28 09:30:00+00'),
('770e8400-e29b-41d4-a716-446655440002', 2, 10, 9, 30, true, '2024-12-28 09:32:00+00'),
('770e8400-e29b-41d4-a716-446655440002', 3, 10, 8, 25, true, '2024-12-28 09:34:00+00'),
('770e8400-e29b-41d4-a716-446655440002', 4, 10, 8, 25, false, null),
('770e8400-e29b-41d4-a716-446655440002', 5, 10, 7, 25, false, null),

-- Jane's Squats (all completed)
('770e8400-e29b-41d4-a716-446655440007', 1, 15, 15, 95, true, '2024-12-27 07:05:00+00'),
('770e8400-e29b-41d4-a716-446655440007', 2, 15, 15, 95, true, '2024-12-27 07:08:00+00'),
('770e8400-e29b-41d4-a716-446655440007', 3, 15, 14, 95, true, '2024-12-27 07:11:00+00'),
('770e8400-e29b-41d4-a716-446655440007', 4, 15, 13, 95, true, '2024-12-27 07:14:00+00'),
('770e8400-e29b-41d4-a716-446655440007', 5, 15, 12, 85, true, '2024-12-27 07:17:00+00'),

-- Jane's Romanian Deadlifts
('770e8400-e29b-41d4-a716-446655440008', 1, 12, 12, 115, true, '2024-12-27 07:22:00+00'),
('770e8400-e29b-41d4-a716-446655440008', 2, 12, 12, 115, true, '2024-12-27 07:25:00+00'),
('770e8400-e29b-41d4-a716-446655440008', 3, 12, 11, 115, true, '2024-12-27 07:28:00+00'),
('770e8400-e29b-41d4-a716-446655440008', 4, 12, 10, 105, true, '2024-12-27 07:31:00+00'),
('770e8400-e29b-41d4-a716-446655440008', 5, 12, 10, 105, true, '2024-12-27 07:34:00+00');

-- Update completed sets count for workout sessions
UPDATE workout_sessions SET completed_sets = (
    SELECT COUNT(*) 
    FROM exercise_sets es
    JOIN workout_exercises we ON es.workout_exercise_id = we.id
    WHERE we.workout_session_id = workout_sessions.id 
    AND es.completed = true
);

-- Sample notes for some exercises
UPDATE workout_exercises SET notes = 'Form felt solid, could probably increase weight next time' 
WHERE id = '770e8400-e29b-41d4-a716-446655440000';

UPDATE workout_exercises SET notes = 'Great mind-muscle connection today' 
WHERE id = '770e8400-e29b-41d4-a716-446655440001';

UPDATE workout_exercises SET notes = 'Focus on slow negative, feeling the stretch' 
WHERE id = '770e8400-e29b-41d4-a716-446655440002';

-- Test login credentials:
-- Email: john@example.com, Password: password123
-- Email: jane@example.com, Password: password123  
-- Email: mike@example.com, Password: password123