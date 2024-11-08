// Fungsi untuk menyimpan nilai ke cookies
export const setCookie = (name: string, value: any) => {
    document.cookie = `${name}=${value}; path=/;`;
};

export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') {
    // Jika di server-side, kembalikan null atau nilai default lainnya
    return null;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export const logout = () => {
  // Hapus token dari localStorage
  localStorage.removeItem('opd');
  localStorage.removeItem('user');
  localStorage.removeItem('tahun');

  // Hapus semua cookie yang terkait
  document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
  document.cookie = 'tahun=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
  document.cookie = 'opd=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';

  // Redirect ke halaman login
  window.location.href = '/login';
};

export const getUser = () => {
  const get_user = getCookie("user");
  if(get_user){
    return {
      user: JSON.parse(get_user)
    };
  }
}

export const getOpdTahun = () => {
  const get_tahun = getCookie("tahun");
  const get_opd = getCookie("opd");

  if (get_tahun && get_opd) {
    return {
      tahun: JSON.parse(get_tahun),
      opd: JSON.parse(get_opd)
    };
  }

  if (get_tahun) {
    return { tahun: JSON.parse(get_tahun), opd: null };
  }

  if (get_opd) {
    return { tahun: null, opd: JSON.parse(get_opd) };
  }

  return { tahun: null, opd: null };
};