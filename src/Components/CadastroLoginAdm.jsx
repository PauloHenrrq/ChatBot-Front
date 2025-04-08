// ... imports
import { useState, useEffect } from "react";
import { api } from "../Routes/api";
import Header from "../Layout/Header";

export default function CadastroLoginAdm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    data_nascimento: "",
    password: "",
    endereco: {
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      telefones: [{ numero: "", tipo: "celular" }],
    },
  });

  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    if (showModal) {
      api.get("/users").then((res) => setUsuarios(res.data));
    }
  }, [showModal]);

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar este usuário?")) {
      await api.delete(`/users/${id}`);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const handleEdit = (user) => {
    setEditUser({ ...user, endereco: user.endereço[0] }); // adaptando para form
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("endereco.")) {
      const field = name.split(".")[1];
      setEditUser((prev) => ({
        ...prev,
        endereco: { ...prev.endereco, [field]: value },
      }));
    } else if (name === "telefone") {
      setEditUser((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          telefones: [{ ...prev.endereco.telefones[0], numero: value }],
        },
      }));
    } else {
      setEditUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedUser = {
        ...editUser,
        endereço: [editUser.endereco],
      };
      await api.put(`/users/${editUser.id}`, updatedUser);
      alert("Usuário atualizado com sucesso!");
      setEditUser(null);
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao atualizar o usuário.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("endereco.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [field]: value,
        },
      }));
    } else if (name === "telefone") {
      setFormData((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          telefones: [{ ...prev.endereco.telefones[0], numero: value }],
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/users", {
        ...formData,
        endereco: [formData.endereco],
        role: "admin",
      });
      alert("Administrador cadastrado com sucesso!");
      setFormData({
        name: "",
        email: "",
        data_nascimento: "",
        password: "",
        endereco: {
          rua: "",
          numero: "",
          bairro: "",
          cidade: "",
          estado: "",
          cep: "",
          telefones: [{ numero: "", tipo: "celular" }],
        },
      });
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar administrador.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-xl mx-auto p-6 bg-white mt-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-orange-500">Cadastro de Administrador</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nome" className="w-full p-2 border rounded" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" required />
          <input type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Senha" className="w-full p-2 border rounded" required />

          <h3 className="text-lg font-semibold mt-4">Endereço</h3>
          <input type="text" name="endereco.rua" value={formData.endereco.rua} onChange={handleChange} placeholder="Rua" className="w-full p-2 border rounded" />
          <input type="text" name="endereco.numero" value={formData.endereco.numero} onChange={handleChange} placeholder="Número" className="w-full p-2 border rounded" />
          <input type="text" name="endereco.bairro" value={formData.endereco.bairro} onChange={handleChange} placeholder="Bairro" className="w-full p-2 border rounded" />
          <input type="text" name="endereco.cidade" value={formData.endereco.cidade} onChange={handleChange} placeholder="Cidade" className="w-full p-2 border rounded" />
          <input type="text" name="endereco.estado" value={formData.endereco.estado} onChange={handleChange} placeholder="Estado" className="w-full p-2 border rounded" />
          <input type="text" name="endereco.cep" value={formData.endereco.cep} onChange={handleChange} placeholder="CEP" className="w-full p-2 border rounded" />
          <input type="text" name="telefone" value={formData.endereco.telefones[0].numero} onChange={handleChange} placeholder="Telefone" className="w-full p-2 border rounded" />

          <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white w-full p-2 rounded cursor-pointer">
            Cadastrar Administrador
          </button>
        </form>
      </div>

      {/* Botão Flutuante */}
      <button onClick={() => setShowModal(true)} className="fixed bottom-6 right-6 bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-orange-600 transition">
        Gerenciar Usuários
      </button>

      {/* Modal de Listagem */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-lg relative">
            <h2 className="text-xl font-bold text-orange-500 mb-4">Usuários Cadastrados</h2>
            <button onClick={() => setShowModal(false)} className="absolute bg-red-500 hover:bg-red-600 top-2 right-2 text-white text-xl cursor-pointer">×</button>

            {usuarios.length === 0 ? (
              <p className="text-gray-600">Nenhum usuário encontrado.</p>
            ) : (
              <ul className="space-y-4">
                {usuarios.map((user) => (
                  <li key={user.id} className="bg-gray-100 p-4 rounded flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-500">Role: {user.role}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(user)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Editar</button>
                      <button onClick={() => handleDelete(user.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Deletar</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {editUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg relative">
            <h2 className="text-xl font-bold text-blue-500 mb-4">Editar Usuário</h2>
            <button onClick={() => setEditUser(null)} className="absolute bg-red-500 hover:bg-red-600 top-2 right-2 text-white text-xl cursor-pointer">×</button>

            <div className="space-y-3">
              <input name="name" value={editUser.name} onChange={handleUpdateChange} className="w-full p-2 border rounded" />
              <input name="email" value={editUser.email} onChange={handleUpdateChange} className="w-full p-2 border rounded" />
              <input name="data_nascimento" type="date" value={editUser.data_nascimento} onChange={handleUpdateChange} className="w-full p-2 border rounded" />
              <input name="password" type="text" value={editUser.password} onChange={handleUpdateChange} className="w-full p-2 border rounded" />

              <input name="endereco.rua" value={editUser.endereco.rua} onChange={handleUpdateChange} placeholder="Rua" className="w-full p-2 border rounded" />
              <input name="endereco.numero" value={editUser.endereco.numero} onChange={handleUpdateChange} placeholder="Número" className="w-full p-2 border rounded" />
              <input name="endereco.bairro" value={editUser.endereco.bairro} onChange={handleUpdateChange} placeholder="Bairro" className="w-full p-2 border rounded" />
              <input name="endereco.cidade" value={editUser.endereco.cidade} onChange={handleUpdateChange} placeholder="Cidade" className="w-full p-2 border rounded" />
              <input name="endereco.estado" value={editUser.endereco.estado} onChange={handleUpdateChange} placeholder="Estado" className="w-full p-2 border rounded" />
              <input name="endereco.cep" value={editUser.endereco.cep} onChange={handleUpdateChange} placeholder="CEP" className="w-full p-2 border rounded" />
              <input name="telefone" value={editUser.endereco.telefones[0].numero} onChange={handleUpdateChange} placeholder="Telefone" className="w-full p-2 border rounded" />

              <button onClick={handleUpdate} className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded">Salvar Alterações</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
