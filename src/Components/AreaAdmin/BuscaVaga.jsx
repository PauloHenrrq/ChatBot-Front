// components/BuscaVaga.js
import { useEffect, useState } from "react";

export default function BuscaVaga({ candidatos, busca, setBusca }) {
  const [sugestoes, setSugestoes] = useState([]);

  useEffect(() => {
    const vagasUnicas = [
      ...new Set(candidatos.map((c) => c.vagaTitulo)),
    ];
    const filtradas = vagasUnicas.filter((vaga) =>
      vaga.toLowerCase().includes(busca.toLowerCase())
    );
    setSugestoes(busca ? filtradas : []);
  }, [busca, candidatos]);

  return (
    <div className="mb-4 relative w-full max-w-md">
      <input
        type="text"
        placeholder="Buscar por vaga..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded shadow-sm"
      />
      {sugestoes.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full max-h-48 overflow-y-auto shadow-lg">
          {sugestoes.map((sugestao, index) => (
            <li
              key={index}
              onClick={() => setBusca(sugestao)}
              className="p-2 cursor-pointer hover:bg-orange-100"
            >
              {sugestao}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
