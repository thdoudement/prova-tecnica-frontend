import { useState } from 'react';
import BuscaCep from './components/BuscaCep.jsx';
import CrudNoticias from './components/CrudNoticias.jsx';
import './App.css';

const tabs = [
  { id: 'cep', label: 'Busca de CEP' },
  { id: 'noticias', label: 'CRUD Notícias' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('cep');

  return (
    <div className="app">
      <header className="app__header">
        <h1>Prova Técnica Frontend</h1>
        <p>Busca de endereços por CEP e gerenciamento de notícias.</p>
      </header>

      <nav className="tabs" aria-label="Navegação principal">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tabs__button ${activeTab === tab.id ? 'tabs__button--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="app__content">
        {activeTab === 'cep' ? <BuscaCep /> : <CrudNoticias />}
      </main>
    </div>
  );
}
