// Mock anomalies/violations data
export const mockAnomalies = {
  'CAM-001': [
    {
      id: 'ANO-001',
      timestamp: '2025-12-16T15:23:45',
      type: 'Red Light Violation',
      severity: 'high',
      location: 'Lane 2, North Gate',
      vehicleType: 'Car',
      confidence: 95,
    },
    {
      id: 'ANO-002',
      timestamp: '2025-12-16T15:18:12',
      type: 'Wrong Way Driving',
      severity: 'critical',
      location: 'Lane 1, North Gate',
      vehicleType: 'Motorcycle',
      confidence: 89,
    },
    {
      id: 'ANO-003',
      timestamp: '2025-12-16T15:10:33',
      type: 'Speeding',
      severity: 'medium',
      location: 'Lane 3, North Gate',
      vehicleType: 'Truck',
      confidence: 92,
    },
    {
      id: 'ANO-004',
      timestamp: '2025-12-16T15:05:21',
      type: 'Illegal Parking',
      severity: 'low',
      location: 'Shoulder Area',
      vehicleType: 'Van',
      confidence: 87,
    },
  ],
  'CAM-002': [
    {
      id: 'ANO-005',
      timestamp: '2025-12-16T15:20:15',
      type: 'Red Light Violation',
      severity: 'high',
      location: 'Intersection Main St',
      vehicleType: 'Car',
      confidence: 93,
    },
  ],
  'CAM-004': [
    {
      id: 'ANO-006',
      timestamp: '2025-12-16T15:15:40',
      type: 'Wrong Way Driving',
      severity: 'critical',
      location: 'South Plaza Entry',
      vehicleType: 'Motorcycle',
      confidence: 96,
    },
  ],
};

// Detection boxes for video overlay
export const mockDetectionBoxes = [
  {
    id: 'det-1',
    type: 'vehicle',
    label: 'Car',
    confidence: 0.95,
    bbox: { x: 120, y: 80, width: 180, height: 120 },
    color: '#22d3ee', // cyan
  },
  {
    id: 'det-2',
    type: 'vehicle',
    label: 'Motorcycle',
    confidence: 0.89,
    bbox: { x: 380, y: 140, width: 100, height: 80 },
    color: '#a855f7', // purple
  },
  {
    id: 'det-3',
    type: 'violation',
    label: 'Red Light Violation',
    confidence: 0.95,
    bbox: { x: 120, y: 80, width: 180, height: 120 },
    color: '#ef4444', // red
  },
];
