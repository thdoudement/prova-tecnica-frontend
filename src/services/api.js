import axios from 'axios';

export const VIACEP_BASE_URL = 'https://viacep.com.br/ws';
export const NOTICIAS_API_URL = `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:3333'}/noticias`;

export function buscarEnderecoPorCep(cepLimpo) {
  return axios.get(`${VIACEP_BASE_URL}/${cepLimpo}/json/`);
}

export function listarNoticias({ pagina = 1, limite = 5, titulo = '', descricao = '' } = {}) {
  return axios.get(NOTICIAS_API_URL, {
    params: {
      page: pagina,
      limit: limite,
      ...(titulo ? { titulo } : {}),
      ...(descricao ? { descricao } : {}),
    },
  });
}

export function criarNoticia(noticia) {
  return axios.post(NOTICIAS_API_URL, noticia);
}

export function atualizarNoticia(id, noticia) {
  return axios.put(`${NOTICIAS_API_URL}/${id}`, noticia);
}

export function deletarNoticia(id) {
  return axios.delete(`${NOTICIAS_API_URL}/${id}`);
}
