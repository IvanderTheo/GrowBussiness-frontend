export const formatTanggalId = (isoString) => {
  if (!isoString) return '-';
  const dateObj = new Date(isoString);
  
  // Menggunakan standar lokalisasi Indonesia (id-ID)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(dateObj);
};