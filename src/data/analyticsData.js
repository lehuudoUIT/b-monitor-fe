// Mock analytics data for charts

// Weekly violations data for Bar Chart
export const weeklyViolationsData = [
  {
    day: 'Mon',
    violations: 45,
    critical: 12,
    high: 18,
    medium: 10,
    low: 5,
  },
  {
    day: 'Tue',
    violations: 52,
    critical: 15,
    high: 20,
    medium: 12,
    low: 5,
  },
  {
    day: 'Wed',
    violations: 38,
    critical: 8,
    high: 15,
    medium: 10,
    low: 5,
  },
  {
    day: 'Thu',
    violations: 61,
    critical: 18,
    high: 25,
    medium: 13,
    low: 5,
  },
  {
    day: 'Fri',
    violations: 73,
    critical: 22,
    high: 28,
    medium: 18,
    low: 5,
  },
  {
    day: 'Sat',
    violations: 42,
    critical: 10,
    high: 16,
    medium: 11,
    low: 5,
  },
  {
    day: 'Sun',
    violations: 35,
    critical: 7,
    high: 13,
    medium: 10,
    low: 5,
  },
];

// Violation types data for Pie Chart
export const violationTypesData = [
  {
    name: 'Red Light Violation',
    value: 145,
    color: '#ef4444', // Red
    percentage: 35,
  },
  {
    name: 'Wrong Way Driving',
    value: 98,
    color: '#f97316', // Orange
    percentage: 24,
  },
  {
    name: 'Speeding',
    value: 82,
    color: '#eab308', // Yellow
    percentage: 20,
  },
  {
    name: 'Illegal Parking',
    value: 56,
    color: '#a855f7', // Purple
    percentage: 14,
  },
  {
    name: 'Lane Violation',
    value: 32,
    color: '#22d3ee', // Cyan
    percentage: 7,
  },
];

// Hourly violations data for additional insights
export const hourlyViolationsData = [
  { hour: '00:00', violations: 5 },
  { hour: '02:00', violations: 3 },
  { hour: '04:00', violations: 2 },
  { hour: '06:00', violations: 12 },
  { hour: '08:00', violations: 28 },
  { hour: '10:00', violations: 35 },
  { hour: '12:00', violations: 42 },
  { hour: '14:00', violations: 38 },
  { hour: '16:00', violations: 45 },
  { hour: '18:00', violations: 52 },
  { hour: '20:00', violations: 38 },
  { hour: '22:00', violations: 20 },
];

// Camera performance data
export const cameraPerformanceData = [
  {
    cameraId: 'CAM-001',
    name: 'North Gate Camera',
    detections: 145,
    accuracy: 95,
    uptime: 99.8,
  },
  {
    cameraId: 'CAM-002',
    name: 'Central Junction',
    detections: 132,
    accuracy: 93,
    uptime: 98.5,
  },
  {
    cameraId: 'CAM-004',
    name: 'South Plaza Cam',
    detections: 98,
    accuracy: 92,
    uptime: 99.2,
  },
  {
    cameraId: 'CAM-005',
    name: 'West Terminal View',
    detections: 87,
    accuracy: 94,
    uptime: 97.8,
  },
];

// Overall statistics
export const analyticsStats = {
  totalViolations: 413,
  criticalViolations: 92,
  averagePerDay: 59,
  trendPercentage: 12.5,
  mostCommonViolation: 'Red Light Violation',
  peakHour: '18:00',
  mostActiveCamera: 'CAM-001',
};
