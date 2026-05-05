import { VALID_ROLES } from "../constants";

export function normalizeRole(role) {
  return String(role || "").trim().toUpperCase();
}

export function isValidRole(role) {
  return VALID_ROLES.includes(normalizeRole(role));
}

export function roleLabel(role) {
  return normalizeRole(role) === "DIRETOR" ? "Diretor" : "Conselheiro";
}

export function passwordStrength(password) {
  let score = 0;

  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  const labels = ["Digite uma senha", "Muito fraca", "Fraca", "Boa", "Forte"];
  return {
    score,
    label: labels[score] || labels[0],
    percent: `${(score / 4) * 100}%`
  };
}
