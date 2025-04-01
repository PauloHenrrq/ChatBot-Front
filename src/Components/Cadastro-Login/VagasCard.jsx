import { useEffect, useState } from "react";
import { api } from '../../Routes/api';
import { Form, Formik, ErrorMessage, Field } from "formik";
import * as Yup from 'yup';
import { Textarea } from "@headlessui/react";

export default function VagasCard() {
    const [modalAberto, setModalAberto] = useState(null);
    const [vagas, setVagas] = useState([]);

    useEffect(() => {
        api.get('/vagas')
            .then(response => setVagas(response.data))
            .catch(err => console.error(err));
    }, []);

    async function delVagas(id) {
        try {
            await api.delete(`/vagas/${id}`);
            alert('Vaga excluída com sucesso!');
            setVagas(vagas.filter(vaga => vaga.id !== id));
        } catch (error) {
            console.error('Erro ao excluir vaga', error);
        }
    }

    async function salvarDados(values) {
        try {
            await api.put(`/vagas/${modalAberto}`, values);
            alert("Vaga Atualizada com Sucesso.");
            setVagas(vagas.map(vaga => vaga.id === modalAberto ? { ...vaga, ...values } : vaga));
            setModalAberto(null);
        } catch (error) {
            console.error("Erro ao salvar dados", error);
            alert("Erro ao salvar dados. Tente novamente.");
        }
    }

    const validationSchema = Yup.object().shape({
        titulo: Yup.string().required('Campo Obrigatório'),
        empresa: Yup.string().required('Campo Obrigatório'),
        localizacao: Yup.string().required('Campo Obrigatório'),
        descricao: Yup.string().required('Campo Obrigatório'),
        descricaodetalhada: Yup.string().required('Campo Obrigatório'),
        salario: Yup.string().required('Campo Obrigatório')
    });

    return (
        <div className="h-full grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 mx-auto gap-5">
            {vagas.map((vaga) => (
                <div className="bg-gradient-to-b from-orange-200 to-white shadow-md rounded-lg p-4 w-full max-w-md flex flex-col justify-between mx-auto" key={vaga.id}>
                    <div className="flex flex-col items-start h-fit">
                        <h3 className="text-xl font-semibold">{vaga.titulo}</h3>
                        <h1 className="text-gray-600">{vaga.empresa}</h1>
                    </div>
                    <p className="text-gray-500 mt-2">{vaga.descricao}</p>

                    <div className="flex items-center justify-center h-fit mt-8">
                        <p className="text-gray-600 w-1/2">{vaga.salario}</p>
                        <button
                            className="w-1/2 py-1 bg-orange-500 hover:bg-orange-400 text-white rounded cursor-pointer"
                            onClick={() => setModalAberto(vaga.id)}
                        >
                            Editar
                        </button>
                    </div>

                    {modalAberto === vaga.id && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
                            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-5xl w-full flex flex-col justify-center">
                                <Formik
                                    enableReinitialize
                                    initialValues={vaga}
                                    validationSchema={validationSchema}
                                    onSubmit={salvarDados}
                                >
                                    <Form className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="w-full">
                                                <label htmlFor="titulo" className="text-sm font-semibold">Cargo</label>
                                                <Field type="text" name="titulo" className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                                                <ErrorMessage name="titulo" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>

                                            <div className="w-full">
                                                <label htmlFor="empresa" className="text-sm font-semibold">Nome Empresarial</label>
                                                <Field type="text" name="empresa" className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                                                <ErrorMessage name="empresa" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label htmlFor="localizacao" className="text-sm font-semibold">Localização</label>
                                            <Field type="text" name="localizacao" className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                                            <ErrorMessage name="localizacao" component="div" className="text-red-600 text-sm mt-1" />

                                            <div className="flex gap-4">
                                                <div className="w-full">
                                                    <label htmlFor="descricao" className="text-sm font-semibold">Descrição simplificada</label>
                                                    <Field as={Textarea} name="descricao" className="w-full h-40 resize-none p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                                                    <ErrorMessage name="descricao" component="div" className="text-red-600 text-sm mt-1" />
                                                </div>

                                                <div className="w-full">
                                                    <label htmlFor="descricaodetalhada" className="text-sm font-semibold">Descrição detalhada</label>
                                                    <Field as={Textarea} name="descricaodetalhada" className="w-full h-40 resize-none p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                                                    <ErrorMessage name="descricaodetalhada" component="div" className="text-red-600 text-sm mt-1" />
                                                </div>
                                            </div>

                                            <div className="w-full">
                                                <label htmlFor="salario" className="text-sm font-semibold">Salário</label>
                                                <Field type="text" name="salario" className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                                                <ErrorMessage name="salario" component="div" className="text-red-600 text-sm mt-1" />
                                            </div>

                                            <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-md w-full transition-colors duration-300">
                                                Salvar
                                            </button>
                                        </div>
                                    </Form>
                                </Formik>
                                <div className="flex gap-4 mt-6">
                                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md w-1/2" onClick={() => setModalAberto(null)}>Fechar</button>
                                    <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md w-1/2" onClick={() => delVagas(vaga.id)}>Deletar</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
