import { useCallback, useEffect, useState } from 'react';
import {
  atualizarNoticia,
  criarNoticia,
  deletarNoticia,
  listarNoticias,
} from '../services/api.js';

const formInicial = { titulo: '', descricao: '' };

export default function CrudNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [form, setForm] = useState(formInicial);
  const [editandoId, setEditandoId] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [filtroTitulo, setFiltroTitulo] = useState('');
  const [filtroDescricao, setFiltroDescricao] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const carregarNoticias = useCallback(async () => {
    setLoading(true);
    setErro('');

    try {
      const { data } = await listarNoticias({
        pagina,
        limite: 5,
        titulo: filtroTitulo,
        descricao: filtroDescricao,
      });

      setNoticias(data.data);
      setTotalPaginas(data.meta.totalPages);
    } catch {
      setErro('Não foi possível carregar as notícias. Verifique se a API está rodando.');
    } finally {
      setLoading(false);
    }
  }, [pagina, filtroTitulo, filtroDescricao]);

  useEffect(() => {
    carregarNoticias();
  }, [carregarNoticias]);

  function resetForm() {
    setForm(formInicial);
    setEditandoId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErro('');
    setSucesso('');

    try {
      if (editandoId) {
        await atualizarNoticia(editandoId, form);
        setSucesso('Notícia atualizada com sucesso.');
      } else {
        await criarNoticia(form);
        setSucesso('Notícia criada com sucesso.');
      }

      resetForm();
      setPagina(1);
      await carregarNoticias();
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar notícia.';
      setErro(message);
    }
  }

  function handleEditar(noticia) {
    setEditandoId(noticia.id);
    setForm({ titulo: noticia.titulo, descricao: noticia.descricao });
  }

  async function handleExcluir(id) {
    setErro('');
    setSucesso('');

    try {
      await deletarNoticia(id);
      setSucesso('Notícia removida.');
      await carregarNoticias();
    } catch {
      setErro('Erro ao excluir notícia.');
    }
  }

  return (
    <section className="card">
      <h2>CRUD de Notícias</h2>
      <p className="card__subtitle">Integração com a API RESTful do backend.</p>

      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="titulo">Título</label>
        <input
          id="titulo"
          value={form.titulo}
          onChange={(event) => setForm({ ...form, titulo: event.target.value })}
          required
        />

        <label htmlFor="descricao">Descrição</label>
        <textarea
          id="descricao"
          rows="4"
          value={form.descricao}
          onChange={(event) => setForm({ ...form, descricao: event.target.value })}
          required
        />

        <div className="form__actions">
          <button type="submit">{editandoId ? 'Atualizar' : 'Criar'}</button>
          {editandoId && (
            <button type="button" className="button-secondary" onClick={resetForm}>
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      <div className="filters">
        <input
          placeholder="Filtrar por título"
          value={filtroTitulo}
          onChange={(event) => {
            setPagina(1);
            setFiltroTitulo(event.target.value);
          }}
        />
        <input
          placeholder="Filtrar por descrição"
          value={filtroDescricao}
          onChange={(event) => {
            setPagina(1);
            setFiltroDescricao(event.target.value);
          }}
        />
      </div>

      {loading && <p className="feedback feedback--loading">Carregando notícias...</p>}
      {erro && (
        <p className="feedback feedback--error" role="alert">
          {erro}
        </p>
      )}
      {sucesso && <p className="feedback feedback--success">{sucesso}</p>}

      <ul className="lista-noticias">
        {noticias.map((noticia) => (
          <li key={noticia.id} className="lista-noticias__item">
            <div>
              <strong>{noticia.titulo}</strong>
              <p>{noticia.descricao}</p>
            </div>
            <div className="lista-noticias__actions">
              <button type="button" onClick={() => handleEditar(noticia)}>
                Editar
              </button>
              <button type="button" className="button-danger" onClick={() => handleExcluir(noticia.id)}>
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>

      {!loading && noticias.length === 0 && <p>Nenhuma notícia encontrada.</p>}

      <div className="pagination">
        <button type="button" disabled={pagina <= 1} onClick={() => setPagina((p) => p - 1)}>
          Anterior
        </button>
        <span>
          Página {pagina} de {totalPaginas}
        </span>
        <button
          type="button"
          disabled={pagina >= totalPaginas}
          onClick={() => setPagina((p) => p + 1)}
        >
          Próxima
        </button>
      </div>
    </section>
  );
}
