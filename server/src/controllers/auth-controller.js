// authController.js
import supabase from "./supabaseClient.js";

// --- REGISTER ---
export const register = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });
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
  res.json({ session: data.session });
};

// --- AUTHENTICATE ---
export const authenticate = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  const { data: user, error } = await supabase.auth.getUser(token);

  if (error || !user) return res.status(403).json({ error: "Invalid token" });

  req.user = user;
  next();
};