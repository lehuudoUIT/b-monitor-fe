// Mock camera data
export const mockCameras = [
  {
    id: 'CAM-001',
    name: 'North Gate Camera',
    location: 'Highway 1A - North Entrance',
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    status: 'online',
  },
  {
    id: 'CAM-002',
    name: 'Central Junction',
    location: 'Downtown Intersection - Main St',
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&sat=-100&brightness=0.8',
    status: 'online',
  },
  {
    id: 'CAM-003',
    name: 'East Bridge Monitor',
    location: 'City Bridge - Eastern Side',
    thumbnail: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=400&h=300&fit=crop',
    status: 'offline',
  },
  {
    id: 'CAM-004',
    name: 'South Plaza Cam',
    location: 'Shopping District - South Plaza',
    thumbnail: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=400&h=300&fit=crop',
    status: 'online',
  },
  {
    id: 'CAM-005',
    name: 'West Terminal View',
    location: 'Bus Terminal - West Wing',
    thumbnail: 'https://images.unsplash.com/photo-1508020963102-c6c723be5764?w=400&h=300&fit=crop',
    status: 'online',
  },
  {
    id: 'CAM-006',
    name: 'Airport Highway',
    location: 'Airport Express Route - Exit 12',
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&hue=200',
    status: 'online',
  },
  {
    id: 'CAM-007',
    name: 'Park Avenue Monitor',
    location: 'Central Park - Main Avenue',
    thumbnail: 'https://images.unsplash.com/photo-1508020963102-c6c723be5764?w=400&h=300&fit=crop&sat=-50',
    status: 'offline',
  },
  {
    id: 'CAM-008',
    name: 'Harbor View Station',
    location: 'Harbor District - Waterfront',
    thumbnail: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=400&h=300&fit=crop&brightness=0.9',
    status: 'online',
  },
];

// Stats for dashboard summary
export const dashboardStats = {
  totalCameras: 8,
  onlineCameras: 6,
  offlineCameras: 2,
  alerts: 3,
};
