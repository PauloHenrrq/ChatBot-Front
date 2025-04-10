import { useNavigate } from "react-router-dom";
import { useState } from "react";
import * as yup from "yup"; // Importando Yup
import { Formik, Form, Field, ErrorMessage } from "formik";
import { api } from "../../Routes/server/api";

// Definindo o esquema de validação para login
const loginValidationSchema = yup.object({
  email: yup
    .string()
    .email("Por favor, insira um e-mail válido")
    .required("O e-mail é obrigatório"),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("A senha é obrigatória"),
});

// Definindo o esquema de validação para cadastro
const cadastroValidationSchema = yup.object({
  nome: yup.string().required("O nome é obrigatório"),
  email: yup
    .string()
    .email("Por favor, insira um e-mail válido")
    .required("O e-mail é obrigatório"),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("A senha é obrigatória"),
});

export default function LoginAdmin() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate(); // Hook para navegação programática

  async function handleLogin(values) {
    try {
      const { email, password } = values;

      // Requisição GET para verificar se o usuário existe
      const response = await api.get("/users", {
        params: {
          email: email,
          password: password,
        },
      });

      if (response.data.length > 0) {
        const user = response.data[0];
        const token = user.id;
        localStorage.setItem("authToken", token);

        // Redirecionamento baseado no tipo de usuário
        if (user.role === "admin") {
          navigate("/vagas");
        } else {
          navigate("/home");
        }
      } else {
        alert("E-mail ou senha inválidos");
      }
    } catch (error) {
      console.error("Erro ao verificar as credenciais", error);
      alert("Erro ao tentar fazer login. Tente novamente.");
    }
  }

  async function handleCadastro(values, { setSubmitting }) {
    try {
      await api.post("/users", {
        name: values.nome,
        email: values.email,
        password: values.password,
        role: "user", // Definindo o tipo de usuário padrão como "user"
      });
      alert("Cadastro realizado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro no cadastro", error);
      alert("Erro ao tentar cadastrar. Tente novamente.");
    }
    setSubmitting(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-orange-500 to-orange-400">
      <div className="bg-white rounded-xl shadow-lg flex max-lg:flex-col w-[50%] max-sm:w-[70%] transition-all overflow-hidden">
        <div className="w-1/2 max-lg:w-full px-8 py-12">
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

          {isLogin ? (
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginValidationSchema}
              onSubmit={handleLogin}
            >
              {({ isSubmitting }) => (
                <Form>
                  <h2 className="text-3xl font-semibold text-center text-orange-600">Login</h2>
                  <div className="mb-4">
                    <Field type="email" name="email" placeholder="E-mail" className="w-full border border-zinc-500 p-2 mt-4 rounded" />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div className="mb-4">
                    <Field type="password" name="password" placeholder="Senha" className="w-full border border-zinc-500 p-2 mt-2 rounded" />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                  </div>
                  <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white py-2 mt-4 rounded cursor-pointer" disabled={isSubmitting}>Entrar</button>
                </Form>
              )}
            </Formik>
          ) : (
            <Formik
              initialValues={{ nome: "", email: "", password: "" }}
              validationSchema={cadastroValidationSchema}
              onSubmit={handleCadastro}
            >
              {({ isSubmitting }) => (
                <Form>
                  <h2 className="text-3xl font-semibold text-center text-orange-600">Cadastrar</h2>
                  <div className="mb-4">
                    <Field type="text" name="nome" placeholder="Nome completo" className="w-full border border-zinc-500 p-2 mt-4 rounded" />
                    <ErrorMessage name="nome" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div className="mb-4">
                    <Field type="email" name="email" placeholder="E-mail" className="w-full border border-zinc-500 p-2 mt-2 rounded" />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div className="mb-4">
                    <Field type="password" name="password" placeholder="Senha" className="w-full border border-zinc-500 p-2 mt-2 rounded" />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                  </div>
                  <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white py-2 mt-4 rounded" disabled={isSubmitting}>Cadastrar</button>
                </Form>
              )}
            </Formik>
          )}
        </div>
        
        
        <div className="w-1/2 max-lg:w-full flex flex-col items-start max-lg:items-center justify-center bg-orange-50 p-8">
          <p className="text-orange-600 font-medium text-xl max-md:text-[16px] max-md:text-center">Bem-vindo ao nosso sistema!</p>
          <p className="text-orange-600 font-medium text-xl max-md:text-[16px] max-md:text-center">Por favor, faça seu login ou cadastro.</p>
        </div>
      </div>
    </div>
  );
}
