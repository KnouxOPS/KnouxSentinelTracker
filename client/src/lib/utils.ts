import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function showToast(message: string) {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'fixed top-24 right-6 glass-strong rounded-xl p-4 z-50 transform translate-x-full transition-transform duration-300';
  toast.innerHTML = `
    <div class="flex items-center space-x-3">
      <i class="fas fa-check-circle text-green-400"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => {
    toast.classList.remove('translate-x-full');
  }, 100);
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.add('translate-x-full');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

export function exportData(data: any, filename: string, format: 'json' | 'csv') {
  let content: string;
  let mimeType: string;
  
  if (format === 'json') {
    content = JSON.stringify(data, null, 2);
    mimeType = 'application/json';
  } else {
    // Convert to CSV
    if (Array.isArray(data)) {
      const headers = Object.keys(data[0] || {});
      const csvRows = [
        headers.join(','),
        ...data.map((row: any) => 
          headers.map(header => `"${row[header] || ''}"`).join(',')
        )
      ];
      content = csvRows.join('\n');
    } else {
      content = JSON.stringify(data);
    }
    mimeType = 'text/csv';
  }
  
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
