export const formatUntukInputDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  
  const tahun = date.getFullYear();
  // Tambahkan angka 0 di depan jika bulan/hari < 10 agar formatnya konsisten 2 digit
  const bulan = String(date.getMonth() + 1).padStart(2, '0'); 
  const hari = String(date.getDate()).padStart(2, '0');
  
  return `${tahun}-${bulan}-${hari}`; // Menghasilkan: YYYY-MM-DD
};