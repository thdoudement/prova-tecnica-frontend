import { useState } from 'react';
import { buscarEnderecoPorCep } from '../services/api.js';

function formatarCep(valor) {
  const digits = valor.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function limparCep(valor) {
  return valor.replace(/\D/g, '');
}

export default function BuscaCep() {
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const cepLimpo = limparCep(cep);

    if (cepLimpo.length !== 8) {
      setErro('Informe um CEP válido com 8 dígitos.');
      setEndereco(null);
      return;
    }

    setLoading(true);
    setErro('');
    setEndereco(null);

    try {
      const { data } = await buscarEnderecoPorCep(cepLimpo);

      if (data.erro) {
        setErro('CEP não encontrado.');
        return;
      }

      setEndereco(data);
    } catch {
      setErro('Não foi possível consultar o CEP. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h2>Busca de endereço por CEP</h2>
      <p className="card__subtitle">Consulta a API pública ViaCEP.</p>

      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="cep">CEP</label>
        <div className="form__row">
          <input
            id="cep"
            name="cep"
            type="text"
            inputMode="numeric"
            placeholder="00000-000"
            value={cep}
            onChange={(event) => setCep(formatarCep(event.target.value))}
            aria-invalid={Boolean(erro)}
            aria-describedby={erro ? 'cep-erro' : undefined}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>

      {loading && <p className="feedback feedback--loading">Carregando endereço...</p>}
      {erro && (
        <p id="cep-erro" className="feedback feedback--error" role="alert">
          {erro}
        </p>
      )}

      {endereco && (
        <article className="resultado" aria-live="polite">
          <h3>Endereço encontrado</h3>
          <dl>
            <div>
              <dt>Logradouro</dt>
              <dd>{endereco.logradouro || '—'}</dd>
            </div>
            <div>
              <dt>Bairro</dt>
              <dd>{endereco.bairro || '—'}</dd>
            </div>
            <div>
              <dt>Cidade</dt>
              <dd>
                {endereco.localidade}/{endereco.uf}
              </dd>
            </div>
            <div>
              <dt>CEP</dt>
              <dd>{endereco.cep}</dd>
            </div>
          </dl>
        </article>
      )}
    </section>
  );
}
