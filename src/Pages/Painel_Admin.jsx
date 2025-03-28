import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  ChevronDownIcon,
  Bars3Icon
} from '@heroicons/react/16/solid'

export default function PainelAdmin() {
  const [candidatos, setCandidatos] = useState([
    { nome: "Carlos Silva", email: "carlos@email.com", status: "Em análise" },
    { nome: "Ana Souza", email: "ana@email.com", status: "Aprovado para entrevista" },
  ]);

  const [vagas, setVagas] = useState([
    { titulo: "Desenvolvedor Web", descricao: "Desenvolvimento de aplicações web responsivas." },
    { titulo: "Analista de Dados", descricao: "Análise de dados e geração de insights." },
  ]);

  const [secaoAtiva, setSecaoAtiva] = useState("candidatos");
  const [mostrarModal, setMostrarModal] = useState(false);

  function atualizarStatus(index, novoStatus) {
    const novosCandidatos = [...candidatos];
    novosCandidatos[index].status = novoStatus;
    setCandidatos(novosCandidatos);
  }

  function criarVaga(event) {
    event.preventDefault();
    const titulo = event.target.tituloVaga.value;
    const descricao = event.target.descricaoVaga.value;
    setVagas([...vagas, { titulo, descricao }]);
    event.target.reset();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-orange-500 shadow-md p-4 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-xl text-white font-bold">Painel RH</h1>
        <div className="w-52 text-right hidden max-sm:flex max-sm:justify-center max-sm:mt-4">
          <Menu>
            <MenuButton className="inline-flex items-center gap-2 rounded-md bg-zinc-200 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-orange-200 data-[open]:bg-orange-100 data-[focus]:outline-1 data-[focus]:outline-white">
              <Bars3Icon className="size-6 fill-black/60" />
              <ChevronDownIcon className="size-4 fill-black/60" />
            </MenuButton>

            <MenuItems
              transition
              anchor="bottom end"
              className="w-52 origin-top-right space-y-1 rounded-xl border border-white/5 bg-black/20 p-1 text-sm/6 text-black transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
            >
              <MenuItem>
                <button className={`group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 text-white font-semibold data-[focus]:bg-orange-400/50 ${secaoAtiva === "candidatos" ? "bg-orange-400" : "bg-orange-500"}`} onClick={() => setSecaoAtiva("candidatos")}>
                  Candidatos 
                </button>
              </MenuItem>

              <MenuItem>
                <button className={`group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 text-white font-semibold data-[focus]:bg-orange-400/50 ${secaoAtiva === "vagas" ? "bg-orange-400 " : "bg-orange-500"}`} onClick={() => setSecaoAtiva("vagas")}>
                  Vagas 
                </button>
              </MenuItem>
              
            </MenuItems>
          </Menu>
        </div>
        <div className="flex flex-col sm:flex-row mt-2 sm:mt-0 text-white font-semibold max-sm:hidden">

          <button className={`group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/50 ${secaoAtiva === "candidatos" ? "bg-orange-400" : "bg-orange-500"}`} onClick={() => setSecaoAtiva("candidatos")}>
            Candidatos
          </button>
          <button className={`group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/50 ${secaoAtiva === "vagas" ? "bg-orange-400 " : "bg-orange-500"}`} onClick={() => setSecaoAtiva("vagas")}>
            Vagas
          </button>
        </div>
      </nav>

      <div className="p-6 max-w-4xl mx-auto">
        {secaoAtiva === "candidatos" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Candidatos</h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-orange-500 text-white">
                  <tr>
                    <th className="p-3">Nome</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {candidatos.map((cand, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3 whitespace-nowrap">{cand.nome}</td>
                      <td className="p-3 whitespace-nowrap">{cand.email}</td>
                      <td className="p-3">
                        <select className="border p-1 rounded w-full" value={cand.status} onChange={(e) => atualizarStatus(index, e.target.value)}>
                          <option value="Em análise">Em análise</option>
                          <option value="Aprovado para entrevista">Aprovado para entrevista</option>
                          <option value="Reprovado">Reprovado</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <button className="bg-orange-500 hover:bg-orange-400 transition-all text-white px-3 py-1 rounded w-full" onClick={() => setMostrarModal(true)}>
                          Visualizar Currículo
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {secaoAtiva === "vagas" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Vagas</h2>
            <form className="mb-3" onSubmit={criarVaga}>
              <input type="text" className="w-full p-2 border rounded mb-2" name="tituloVaga" placeholder="Título da Vaga" required />
              <textarea className="w-full p-2 border rounded mb-2" name="descricaoVaga" placeholder="Descrição" required></textarea>
              <button type="submit" className="bg-orange-500 hover:bg-orange-400 cursor-pointer transition-all text-white px-4 py-2 rounded w-full">Criar Vaga</button>
            </form>
            <ul className="bg-white p-4 rounded shadow">
              {vagas.map((vaga, index) => (
                <li key={index} className="border-b p-3">
                  <h3 className="font-semibold">{vaga.titulo}</h3>
                  <p>{vaga.descricao}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold">Currículo do Candidato</h3>
            <p className="mt-2">Currículo aqui</p>
            <button className="bg-orange-600 text-white px-4 py-2 rounded mt-4 w-full" onClick={() => setMostrarModal(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}