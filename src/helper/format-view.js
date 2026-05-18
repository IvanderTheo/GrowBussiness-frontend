export const formatAngka = (angka) => {
  if (!angka || isNaN(angka)) return '0';
  
  // Jika angka kurang dari 1.000, tampilkan angka biasa
  if (angka < 1000) return angka.toString();

  // Menggunakan Intl.NumberFormat dengan opsi notation: 'compact'
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1 // Menampilkan maksimal 1 angka di belakang koma (misal: 10.1k)
  }).format(angka).toLowerCase(); // .toLowerCase() agar huruf 'K' menjadi kecil 'k'
};