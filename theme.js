import { StyleSheet } from 'react-native';

const DARK = {
  bg: '#000000', surface: '#0d0d0d', card: '#111114',
  border: 'rgba(255,255,255,0.12)', borderStrong: 'rgba(255,255,255,0.3)',
  text: '#ffffff', textSecondary: 'rgba(255,255,255,0.55)', textTertiary: 'rgba(255,255,255,0.35)',
  orange: '#E8622C', red: '#C0392B',
};
const LIGHT = {
  bg: '#F7F7F9', surface: '#FFFFFF', card: '#ECECF1',
  border: 'rgba(17,17,20,0.12)', borderStrong: 'rgba(17,17,20,0.28)',
  text: '#111114', textSecondary: 'rgba(17,17,20,0.62)', textTertiary: 'rgba(17,17,20,0.42)',
  orange: '#C94E20', red: '#B42318',
};

// Canonical accent sampled from the approved Figma file. Keeping this as the
// single theme token lets existing screens inherit the redesign without
// duplicating visual rules or touching their application logic.
const BASE_ACCENT = '#D6B42C';
let settings = { theme: 'Dark', accent: BASE_ACCENT, density: 'Comfortable' };

const hexToRgba = (hex, alpha) => {
  const value = String(hex).replace('#', '');
  const normalized = value.length === 3 ? value.split('').map((char) => char + char).join('') : value;
  const number = Number.parseInt(normalized, 16);
  return `rgba(${(number >> 16) & 255},${(number >> 8) & 255},${number & 255},${alpha})`;
};

const palette = () => {
  const base = settings.theme === 'Light' ? LIGHT : DARK;
  return { ...base, purple: settings.accent, purpleSoft: hexToRgba(settings.accent, 0.15) };
};

export const setThemeSettings = (next = {}) => { settings = { ...settings, ...next }; };
export const colors = new Proxy({}, { get: (_, key) => palette()[key] });

const semanticColor = (value) => {
  if (typeof value !== 'string') return value;
  const current = palette();
  const semanticKey = Object.keys(DARK).find((key) => DARK[key].toLowerCase() === value.toLowerCase());
  if (semanticKey) return current[semanticKey];
  if (value.toLowerCase() === BASE_ACCENT.toLowerCase()) return current.purple;
  if (value === 'rgba(139,92,246,0.15)') return current.purpleSoft;
  if (/^#(?:fff|ffffff)$/i.test(value)) return current.text;
  if (/^#(?:000|000000|050505|070707|080808)$/i.test(value)) return current.bg;
  if (/^#(?:0d0d0d|101014|111114)$/i.test(value)) return current.card;
  const whiteAlpha = value.match(/^rgba\(255,\s*255,\s*255,\s*([\d.]+)\)$/i);
  if (whiteAlpha && settings.theme === 'Light') return `rgba(17,17,20,${whiteAlpha[1]})`;
  const accentAlpha = value.match(/^rgba\(139,\s*92,\s*246,\s*([\d.]+)\)$/i);
  if (accentAlpha) return hexToRgba(current.purple, Number(accentAlpha[1]));
  const figmaAccentAlpha = value.match(/^rgba\(212,\s*175,\s*55,\s*([\d.]+)\)$/i);
  if (figmaAccentAlpha) return hexToRgba(current.purple, Number(figmaAccentAlpha[1]));
  return value;
};

const DENSITY_PROPERTIES = /^(padding|paddingTop|paddingBottom|paddingLeft|paddingRight|paddingHorizontal|paddingVertical|margin|marginTop|marginBottom|marginLeft|marginRight|marginHorizontal|marginVertical|gap|rowGap|columnGap|minHeight)$/;
const fontForWeight = (weight) => {
  const numeric = Number.parseInt(String(weight || '400'), 10);
  if (numeric >= 800) return 'Manrope_800ExtraBold';
  if (numeric >= 700) return 'Manrope_700Bold';
  if (numeric >= 600) return 'Manrope_600SemiBold';
  if (numeric >= 500) return 'Manrope_500Medium';
  if (numeric <= 300) return 'Manrope_300Light';
  return 'Manrope_400Regular';
};
const transformStyle = (style) => {
  if (!style || typeof style !== 'object' || Array.isArray(style)) return style;
  const compact = settings.density === 'Compact';
  const transformed = Object.fromEntries(Object.entries(style).map(([key, value]) => {
    if (typeof value === 'string') return [key, semanticColor(value)];
    if (compact && typeof value === 'number' && DENSITY_PROPERTIES.test(key)) return [key, Math.round(value * 0.78 * 10) / 10];
    return [key, value];
  }));
  const textStyle = ['fontSize', 'fontWeight', 'letterSpacing', 'lineHeight', 'textAlign', 'textTransform'].some((key) => key in style);
  if (textStyle && !style.fontFamily) transformed.fontFamily = fontForWeight(style.fontWeight);
  return transformed;
};

const themedCreate = (definitions) => new Proxy(definitions, { get: (target, key) => transformStyle(target[key]) });
StyleSheet.create = themedCreate;

const typeDefinitions = {
  brand: { color: DARK.text, fontSize: 15, fontWeight: '600', letterSpacing: 3 },
  label: { color: DARK.textSecondary, fontSize: 11, fontWeight: '600', letterSpacing: 1.5 },
  hugeNumber: { color: DARK.text, fontSize: 84, fontWeight: '300' },
  screenTitle: { color: DARK.text, fontSize: 44, fontWeight: '300', lineHeight: 46 },
};
export const type = new Proxy(typeDefinitions, { get: (target, key) => transformStyle(target[key]) });

export default { colors, type, setThemeSettings };
