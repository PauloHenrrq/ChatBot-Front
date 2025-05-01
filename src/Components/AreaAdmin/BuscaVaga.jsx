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
    <div className="mb-4 flex justify-center relative w-full max-w-md">
      <input
        type="text"
        placeholder="Buscar por canditato..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="sm:w-full max-sm:w-[80%] p-2 border border-gray-300 rounded shadow-sm"
      />
      {sugestoes.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-10 sm:w-full w-[80%] max-h-48 overflow-y-auto shadow-lg">
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
