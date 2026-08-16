export const colors = {
  bg: '#000000',
  surface: '#0d0d0d',
  card: '#111114',
  border: 'rgba(255,255,255,0.12)',
  borderStrong: 'rgba(255,255,255,0.3)',
  text: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.55)',
  textTertiary: 'rgba(255,255,255,0.35)',
  purple: '#8B5CF6',
  purpleSoft: 'rgba(139,92,246,0.15)',
  orange: '#E8622C',
  red: '#C0392B',
};

export const type = {
  brand: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 3,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  hugeNumber: {
    color: colors.text,
    fontSize: 84,
    fontWeight: '300',
  },
  screenTitle: {
    color: colors.text,
    fontSize: 44,
    fontWeight: '300',
    lineHeight: 46,
  },
};

export default { colors, type };
