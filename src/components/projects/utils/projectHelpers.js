// src/utils/projectHelpers.js

export const getDynamicStatus = (project) => {
  if (!project) return 'Planning';

  const uiux = Number(project.progress?.uiux || 0);
  const backend = Number(project.progress?.backend || 0);
  const frontend = Number(project.progress?.frontend || 0);

  // 1. Jika semua 100% -> Completed
  if (uiux === 100 && backend === 100 && frontend === 100) {
    return 'Completed';
  }

  // 2. Jika ada progress (tidak 0,0,0) -> In Progress
  if (uiux > 0 || backend > 0 || frontend > 0) {
    return 'In Progress';
  }

  // 3. Jika semua 0 -> Planning
  return 'Planning';
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'Review': return 'bg-purple-50 text-purple-600 border-purple-100';
    case 'Planning': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
    case 'Completed': return 'bg-green-50 text-green-600 border-green-100';
    default: return 'bg-gray-50 text-gray-600 border-gray-100';
  }
};