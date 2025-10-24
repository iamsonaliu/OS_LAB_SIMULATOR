// Format numbers to 2 decimal places
export const formatNumber = (num) => {
  return typeof num === 'number' ? num.toFixed(2) : '0.00';
};

// Parse base64 image
export const parseBase64Image = (base64String) => {
  if (!base64String) return null;
  if (base64String.startsWith('data:image')) {
    return base64String;
  }
  return `data:image/png;base64,${base64String}`;
};

// Validate process input
export const validateProcess = (process) => {
  const { pid, arrival, burst, priority } = process;
  if (!pid || pid < 1) return 'Process ID must be positive';
  if (arrival < 0) return 'Arrival time cannot be negative';
  if (burst < 1) return 'Burst time must be positive';
  if (priority < 0) return 'Priority cannot be negative';
  return null;
};

// Generate random color
export const getRandomColor = (index) => {
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
  ];
  return colors[index % colors.length];
};

// Download JSON
export const downloadJSON = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};