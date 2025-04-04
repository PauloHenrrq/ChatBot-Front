import { useState, useEffect } from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { api } from "../../Routes/api";

export default function BarraPesquisa({ onSearch }) {
  const [termo, setTermo] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [sugestoesVagas, setSugestoesVagas] = useState([]); // Sugestões de vagas
  const [sugestoesLocal, setSugestoesLocal] = useState([]); // Sugestões de localizações
  const [mostrarSugestoesVagas, setMostrarSugestoesVagas] = useState(false);
  const [mostrarSugestoesLocal, setMostrarSugestoesLocal] = useState(false);

  // Buscar sugestões de vagas conforme o usuário digita
  const buscarSugestoesVagas = async (valor) => {
    if (valor.length < 2) {
      setSugestoesVagas([]);
      return;
    }

    try {
      const response = await api.get(`/vagas?q=${valor}`);
      setSugestoesVagas(response.data);
      setMostrarSugestoesVagas(true);
    } catch (error) {
      console.error("Erro ao buscar sugestões de vagas:", error);
    }
  };

  // Buscar sugestões de localizações
  const buscarSugestoesLocal = async (valor) => {
    if (valor.length < 2) {
      setSugestoesLocal([]);
      return;
    }

    try {
      const response = await api.get(`/vagas`);
      // Filtra localizações únicas
      const locaisUnicos = [...new Set(response.data.map((vaga) => vaga.localizacao))];
      const filtrados = locaisUnicos.filter((local) =>
        local.toLowerCase().includes(valor.toLowerCase())
      );
      setSugestoesLocal(filtrados);
      setMostrarSugestoesLocal(true);
    } catch (error) {
      console.error("Erro ao buscar sugestões de localizações:", error);
    }
  };

  // Buscar vagas ao clicar no botão
  const buscarVagas = async () => {
    try {
      const response = await api.get(`/vagas`, {
        params: { q: termo, localizacao }
      });
      onSearch(response.data);
      setMostrarSugestoesVagas(false);
      setMostrarSugestoesLocal(false);
    } catch (error) {
      console.error("Erro ao buscar vagas:", error);
    }
  };

  // Quando o usuário clicar em uma sugestão de vaga
  const selecionarSugestaoVaga = (vaga) => {
    setTermo(vaga.titulo);
    setSugestoesVagas([]);
    setMostrarSugestoesVagas(false);
  };

  // Quando o usuário clicar em uma sugestão de local
  const selecionarSugestaoLocal = (local) => {
    setLocalizacao(local);
    setSugestoesLocal([]);
    setMostrarSugestoesLocal(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Barra de pesquisa */}
      <div className="flex items-center bg-white shadow-md rounded-full px-4 py-2 w-full">
        <FaSearch className="text-gray-500 mx-2 text-3xl" />
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Cargo, palavras-chave ou empresa..."
            className="w-full outline-none"
            value={termo}
            onChange={(e) => {
              setTermo(e.target.value);
              buscarSugestoesVagas(e.target.value);
            }}
          />
          {/* Dropdown de sugestões de vagas */}
          {mostrarSugestoesVagas && sugestoesVagas.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full shadow-lg">
              {sugestoesVagas.map((vaga) => (
                <li
                  key={vaga.id}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => selecionarSugestaoVaga(vaga)}
                >
                  {vaga.titulo} - {vaga.empresa}
                </li>
              ))}
            </ul>
          )}
        </div>

        <span className="border-l h-6 mx-2"></span>
        <FaMapMarkerAlt className="text-gray-500 mx-2 text-3xl" />
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Localização"
            className="w-full outline-none"
            value={localizacao}
            onChange={(e) => {
              setLocalizacao(e.target.value);
              buscarSugestoesLocal(e.target.value);
            }}
          />
          {/* Dropdown de sugestões de localizações */}
          {mostrarSugestoesLocal && sugestoesLocal.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full shadow-lg">
              {sugestoesLocal.map((local, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => selecionarSugestaoLocal(local)}
                >
                  {local}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg ml-2 w-1/2"
          onClick={buscarVagas}
        >
          Achar vagas
        </button>
      </div>
    </div>
  );
}
