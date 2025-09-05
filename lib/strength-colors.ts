export interface StrengthColor {
  bgClass: string;
  rgb: string;
  opacity: number;
}

export const STRENGTH_COLORS: Record<string, StrengthColor> = {
  'very-strong': {
    bgClass: 'bg-chart-2 text-primary-foreground',
    rgb: 'var(--chart-2)',
    opacity: 0.01
  },
  'strong': {
    bgClass: 'bg-chart-1 text-primary-foreground',
    rgb: 'var(--chart-1)',
    opacity: 0.01
  },
  'medium': {
    bgClass: 'bg-chart-4 text-primary-foreground',
    rgb: 'var(--chart-4)',
    opacity: 0.01
  },
  'weak': {
    bgClass: 'bg-chart-5 text-primary-foreground',
    rgb: 'var(--chart-5)',
    opacity: 0.01
  },
  'very-weak': {
    bgClass: 'bg-destructive text-destructive-foreground',
    rgb: 'var(--destructive)',
    opacity: 0.01
  }
};

export function getStrengthColor(strength: string): string {
  return STRENGTH_COLORS[strength]?.bgClass || 'bg-muted text-muted-foreground';
}

export function getStrengthRGB(strength: string): string {
  return STRENGTH_COLORS[strength]?.rgb || 'rgb(128, 128, 128)';
}

export function getStrengthOpacity(strength: string): number {
  return STRENGTH_COLORS[strength]?.opacity || 0.3;
}

export function getStrengthCSSVar(strength: string): string {
  switch (strength) {
    case 'very-strong': return 'chart-2';
    case 'strong': return 'chart-1';
    case 'medium': return 'chart-4';
    case 'weak': return 'chart-5';
    case 'very-weak': return 'destructive';
    default: return 'muted';
  }
}
