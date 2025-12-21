// Muted color palette for dishes - balanced between vibrant and pastel
const DISH_COLORS = [
  { bg: 'linear-gradient(135deg, #e07070 0%, #ea9090 100%)', border: '#d45050' },   // Muted Rose
  { bg: 'linear-gradient(135deg, #5ba3d9 0%, #7db8e3 100%)', border: '#4090cc' },   // Muted Sky
  { bg: 'linear-gradient(135deg, #5dba7a 0%, #7fcc96 100%)', border: '#45a562' },   // Muted Mint
  { bg: 'linear-gradient(135deg, #a67ed9 0%, #bb9ae3 100%)', border: '#9060cc' },   // Muted Lavender
  { bg: 'linear-gradient(135deg, #e0a050 0%, #eab878 100%)', border: '#d08830' },   // Muted Peach
  { bg: 'linear-gradient(135deg, #45c9b5 0%, #6dd9c8 100%)', border: '#30b8a2' },   // Muted Aqua
  { bg: 'linear-gradient(135deg, #d970a8 0%, #e390bb 100%)', border: '#cc5095' },   // Muted Pink
  { bg: 'linear-gradient(135deg, #d4c450 0%, #e0d278 100%)', border: '#c4b030' },   // Muted Gold
  { bg: 'linear-gradient(135deg, #6878d9 0%, #8a96e3 100%)', border: '#5060cc' },   // Muted Periwinkle
  { bg: 'linear-gradient(135deg, #7ab85d 0%, #96cc7f 100%)', border: '#62a545' },   // Muted Sage
  { bg: 'linear-gradient(135deg, #e08860 0%, #eaa488 100%)', border: '#d06840' },   // Muted Apricot
  { bg: 'linear-gradient(135deg, #50c4c4 0%, #78d4d4 100%)', border: '#38b0b0' },   // Muted Teal
  { bg: 'linear-gradient(135deg, #c070d9 0%, #d090e3 100%)', border: '#b050cc' },   // Muted Orchid
  { bg: 'linear-gradient(135deg, #d9c860 0%, #e3d888 100%)', border: '#ccb840' },   // Muted Lemon
  { bg: 'linear-gradient(135deg, #5090d9 0%, #78ace3 100%)', border: '#3878cc' },   // Muted Cornflower
  { bg: 'linear-gradient(135deg, #d97088 0%, #e390a0 100%)', border: '#cc5070' },   // Muted Blush
];

// Memoized color assignments
const colorAssignments = new Map<string, typeof DISH_COLORS[0]>();
let colorIndex = 0;

/**
 * Returns a consistent color for a given dish name.
 * Each unique dish name gets assigned a distinct color.
 */
export function getDishColor(dishName: string): { bg: string; border: string } {
  if (!colorAssignments.has(dishName)) {
    colorAssignments.set(dishName, DISH_COLORS[colorIndex % DISH_COLORS.length]);
    colorIndex++;
  }
  return colorAssignments.get(dishName)!;
}

/**
 * Resets color assignments - useful for testing or when schedule changes significantly
 */
export function resetDishColors(): void {
  colorAssignments.clear();
  colorIndex = 0;
}

