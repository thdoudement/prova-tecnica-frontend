import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import BuscaCep from './BuscaCep.jsx';
import * as api from '../services/api.js';

vi.mock('../services/api.js', () => ({
  buscarEnderecoPorCep: vi.fn(),
}));

describe('Feature: Busca de endereço por CEP', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Scenario: consulta bem-sucedida', () => {
    it('Given um CEP válido, When o usuário busca, Then exibe o endereço retornado', async () => {
      api.buscarEnderecoPorCep.mockResolvedValue({
        data: {
          cep: '01001-000',
          logradouro: 'Praça da Sé',
          bairro: 'Sé',
          localidade: 'São Paulo',
          uf: 'SP',
        },
      });

      render(<BuscaCep />);
      const user = userEvent.setup();

      await user.type(screen.getByLabelText('CEP'), '01001000');
      await user.click(screen.getByRole('button', { name: 'Buscar' }));

      await waitFor(() => {
        expect(screen.getByText('Endereço encontrado')).toBeInTheDocument();
        expect(screen.getByText('Praça da Sé')).toBeInTheDocument();
      });

      expect(api.buscarEnderecoPorCep).toHaveBeenCalledWith('01001000');
    });
  });

  describe('Scenario: CEP inválido', () => {
    it('Given um CEP incompleto, When o usuário busca, Then exibe mensagem de erro', async () => {
      render(<BuscaCep />);
      const user = userEvent.setup();

      await user.type(screen.getByLabelText('CEP'), '123');
      await user.click(screen.getByRole('button', { name: 'Buscar' }));

      expect(await screen.findByRole('alert')).toHaveTextContent('Informe um CEP válido');
      expect(api.buscarEnderecoPorCep).not.toHaveBeenCalled();
    });
  });
});
