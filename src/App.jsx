import { useState, useEffect } from 'react'; // Importa o Hook useState para gerenciar estado
import Tarefa from './components/Tarefa'; // Importa o componente Tarefa
import Filtro from './components/Filtro'; 
import './App.css'; // Importa os estilos de App.css

function App() {
  // Estado para a lista de tarefas (array de objetos { id, texto, concluida })
  const [tarefas, setTarefas] = useState(() => {
    //tenta carregar tarefas do localStorage
    const tarefasSalvas = localStorage.getItem('tarefas');
    //retorna o array parsed (se existir) ou um array vazio
    return tarefasSalvas ? JSON.parse(tarefasSalvas) : [];
  });
  // Estado para o texto do input
  const [novaTarefa, setNovaTarefa] = useState('');
  const [filtro, setFiltro] =useState('todas');

  useEffect(() => {  //Converte o array tarefas para uma string JSON e salva no localStorage.
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
  }, [tarefas]);

  // Função para adicionar uma nova tarefa
  const adicionarTarefa = () => {
    if (novaTarefa.trim()) { // Verifica se o input não está vazio
      setTarefas([...tarefas, { id: Date.now(), texto: novaTarefa, concluida: false }]);
      setNovaTarefa(''); // Limpa o input
    }
  };

  // Função para alternar o estado concluida de uma tarefa
  const toggleConcluida = (id) => {
    // Mapeia as tarefas, atualizando apenas a tarefa com o id correspondente
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
      )
    );
  };

  //função para remover tarefa pelo id
  const removerTarefa = (id) => {
    //filtra tarefas, mantendo apenas com o id diferente do fornecido
    setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
  };

  //Filtra as tarefas com base no valor do filtro
  const tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtro === 'concluidas') return tarefa.concluida;
    if (filtro === 'nao-concluidas') return !tarefa.concluida;
    return true; //'todas' retorna todas as tarefas
  })

  return (
    // Div principal com estilos de App.css
    <div className="app">
      <h1>Gerenciador de Tarefas</h1>
      <div className="form">
        <input
          type="text"
          value={novaTarefa}
          onChange={(e) => setNovaTarefa(e.target.value)}
          placeholder="Digite uma tarefa"
        />
        <button onClick={adicionarTarefa}>Adicionar</button>
      </div>
      <Filtro filtro={filtro} setFiltro={setFiltro} /> 

      {tarefasFiltradas.length === 0 ? (
        <p className="sem-tarefas">Nenhuma tarefa adicionada</p>
      ) : (
      <ul className="tarefas"> 
        {tarefasFiltradas.map((tarefa) => (
          <Tarefa
            key={tarefa.id} // Key para otimizar a renderização
            tarefa={tarefa} // Passa o objeto tarefa como prop
            onToggleConcluida={toggleConcluida} // Passa a função como prop
            onRemover={removerTarefa} //função para remover
          />
        ))}
      </ul>
       )}
    </div>
  );
}

// Exporta o componente App
export default App;