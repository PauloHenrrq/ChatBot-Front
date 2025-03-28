import { Link } from "react-router-dom";
import { useState } from "react";

export default function LoginAdmin() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-orange-500 to-orange-400">
      <div className="bg-white rounded-xl shadow-lg flex max-lg:flex-col w-[50%] max-sm:w-[70%] transition-all overflow-hidden">
        {/* Área do formulário */}
        <div className="w-1/2 max-lg:w-full px-8 py-12">
          {/* Botões de alternância */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              className={`px-4 py-2 cursor-pointer rounded-full transition-colors text-white ${isLogin ? "bg-orange-500" : "bg-orange-600"}`}
              onClick={() => setIsLogin(true)}
            >
              Entrar
            </button>
            <button
              className={`px-4 py-2 cursor-pointer rounded-full transition-colors text-white ${!isLogin ? "bg-orange-500" : "bg-orange-600"}`}
              onClick={() => setIsLogin(false)}
            >
              Cadastrar
            </button>
          </div>

          {/* Formulários */}
          {isLogin ? (
            <div className="">
              <h2 className="text-3xl font-semibold text-center text-orange-600">Login</h2>
              <input type="email" placeholder="E-mail" className="w-full border border-zinc-500 p-2 mt-4 rounded" />
              <input type="password" placeholder="Senha" className="w-full border border-zinc-500 p-2 mt-2 rounded" />
              <Link to={"/painel_admin"}>
                <button className="w-full bg-orange-600 hover:bg-orange-500 text-white py-2 mt-4 rounded">Entrar</button>
              </Link>
              
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-semibold text-center text-orange-600">Cadastrar</h2>
              <input type="text" placeholder="Nome completo" className="w-full border border-zinc-500 p-2 mt-4 rounded" />
              <input type="email" placeholder="E-mail" className="w-full border border-zinc-500 p-2 mt-2 rounded" />
              <input type="password" placeholder="Senha" className="w-full border border-zinc-500 p-2 mt-2 rounded" />
              <button className="w-full bg-orange-600 hover:bg-orange-500 text-white py-2 mt-4 rounded">Cadastrar</button>
            </div>
          )}
        </div>

        {/* Área do texto informativo */}
        <div className="w-1/2 max-lg:w-full flex flex-col items-center justify-center bg-orange-50 p-8">
          <p className="text-orange-600  font-medium text-xl max-md:text-[16px] max-md:text-center">
            Bem-vindo ao nosso sistema!
            </p>
          <p className="text-orange-600 font-medium text-xl max-md:text-[16px] max-md:text-center">
            Por favor, faça seu login ou cadastro.
            </p>
        </div>
      </div>
    </div>
  );
}