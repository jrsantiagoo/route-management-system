import supabase from "../lib/supabase-client.js";
import prisma from "../lib/prisma.js";

// --- REGISTER ---
export const register = async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) return res.status(400).json({ error: error.message });

    await prisma.manager.create({
        data: {
            id_: data.user.id,
            email,
            firstname,
            lastname,
            middleInitial,
        },
    });

    res.json({ user: data.user });
};

// --- LOGIN ---
export const login = async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) return res.status(400).json({ error: error.message });

    // Session with access + refresh tokens
    const { session } = data;

    const manager = await prisma.manager.findUnique({
        where: { id_: data.user.id },
    });

    // Token Handling
    res.json({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_in: session.expires_in,
        user: session.user,
        profile: manager,
    });
};

// --- REFRESH TOKEN ---
export const refreshToken = async (req, res) => {
    const { refresh_token } = req.body;

    const { data, error } = await supabase.auth.refreshSession({
        refresh_token,
    });

    if (error) return res.status(400).json({ error: error.message });

    // Token Handling
    res.json({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in,
        user: data.session.user,
    });
};

// --- LOGOUT ---
export const logout = async (req, res) => {
    const { error } = await supabase.auth.signOut();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Logged out successfully" });
};
