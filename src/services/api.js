// src/services/api.js
import axios from 'axios';

// GANTI DENGAN URL ENDPOINT MOCKAPI ANDA YANG BENAR
const API_BASE_URL = 'https://683f40231cd60dca33dec8a6.mockapi.io/api'; // <--- GANTI INI!
const RESOURCE_NAME = '/Article'; // Nama resource Anda di MockAPI

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fungsi untuk mengambil semua artikel
export const getAllArticles = async () => {
  try {
    const response = await apiClient.get(RESOURCE_NAME);
    return response.data; // Mengembalikan array artikel
  } catch (error) {
    console.error('Error fetching all articles:', error.response || error.message);
    throw error; // Melempar error agar bisa ditangani di komponen
  }
};

// Fungsi untuk mengambil satu artikel berdasarkan ID
export const getArticleById = async (articleId) => {
  try {
    const response = await apiClient.get(`${RESOURCE_NAME}/${articleId}`);
    return response.data; // Mengembalikan objek artikel tunggal
  } catch (error) {
    console.error(`Error fetching article with ID ${articleId}:`, error.response || error.message);
    throw error;
  }
};

// Fungsi untuk membuat artikel baru (POST)
export const createArticle = async (articleData) => {
  // articleData adalah objek berisi: { title, content, category, totalShares (opsional) }
  // createdAt akan diisi otomatis oleh MockAPI jika dikonfigurasi, atau bisa diisi di sini.
  // totalLikes dan totalShares bisa diisi default 0.
  const payload = {
    ...articleData,
    createdAt: new Date().toISOString(),
    totalLikes: articleData.totalLikes || 0,
    totalShares: articleData.totalShares || 0,
    isBookmarked: false, // Default status bookmark saat artikel baru dibuat
  };
  try {
    const response = await apiClient.post(RESOURCE_NAME, payload);
    return response.data; // Mengembalikan artikel yang baru dibuat (termasuk ID dari server)
  } catch (error) {
    console.error('Error creating article:', error.response || error.message);
    throw error;
  }
};

// Fungsi untuk memperbarui artikel (PUT), misalnya untuk bookmark atau edit
export const updateArticle = async (articleId, updatedData) => {
  // updatedData adalah objek berisi field yang ingin diubah,
  // contoh: { isBookmarked: true } atau { title: "Judul Baru", content: "Konten baru" }
  try {
    const response = await apiClient.put(`${RESOURCE_NAME}/${articleId}`, updatedData);
    return response.data; // Mengembalikan artikel yang sudah diupdate
  } catch (error) {
    console.error(`Error updating article with ID ${articleId}:`, error.response || error.message);
    throw error;
  }
};

// Fungsi untuk menghapus artikel (DELETE) - Opsional, jika diperlukan
export const deleteArticle = async (articleId) => {
  try {
    const response = await apiClient.delete(`${RESOURCE_NAME}/${articleId}`);
    return response.data; // Biasanya mengembalikan objek kosong atau data artikel yang dihapus
  } catch (error) {
    console.error(`Error deleting article with ID ${articleId}:`, error.response || error.message);
    throw error;
  }
};

// Fungsi untuk mengambil artikel yang di-bookmark
// MockAPI mendukung filter sederhana: GET /Article?isBookmarked=true
export const getBookmarkedArticles = async () => {
  try {
    const response = await apiClient.get(`${RESOURCE_NAME}?isBookmarked=true`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bookmarked articles:', error.response || error.message);
    throw error;
  }
};


// Kita tetap mengekspor instance apiClient jika ada kebutuhan panggilan custom
// Namun, lebih baik menggunakan fungsi-fungsi yang sudah didefinisikan di atas.
export { apiClient };