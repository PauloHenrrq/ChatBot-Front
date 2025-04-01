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
        <div className="h-full grid grid-cols-3 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 justify-center gap-5">
            {vagas.map((vaga) => (
                <div className="bg-linear-to-b from-orange-200 to-white shadow-md rounded-lg p-4 w-full max-w-md flex flex-col justify-between" key={vaga.id}>
                    <div className="flex flex-col items-start h-fit">
                        <h3 className="text-xl font-semibold">{vaga.titulo}</h3>
                        <h1 className="text-gray-600">{vaga.empresa}</h1>
                    </div>
                    <p className="text-gray-500 mt-2">{vaga.descricao}</p>

                    <div className="flex items-center justify-center h-fit mt-8">
                        <p className="text-gray-600 w-1/2">{vaga.salario}</p>
                        <button
                            className="w-1/2 py-1 bg-orange-500 text-white rounded"
                            onClick={() => setModalAberto(vaga.id)}
                        >
                            Editar
                        </button>
                    </div>

                    {modalAberto === vaga.id && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
                            <div className="bg-zinc-100 p-6 rounded shadow-lg max-w-5xl flex flex-col justify-center h-full w-full">
                                <div className="bg-white h-full content-center rounded-2xl shadow-lg">


                                    <div className="m-6 mx-auto">


                                        <Formik
                                            enableReinitialize
                                            initialValues={vaga}
                                            validationSchema={validationSchema}
                                            onSubmit={salvarDados}
                                        >
                                            <Form className="px-4">
                                                <div className="flex gap-2">
                                                    <div className="w-full">
                                                        <label htmlFor="titulo">Cargo</label>
                                                        <Field type="text" name="titulo" className="w-full p-2 border rounded mb-1" />
                                                        <ErrorMessage name="titulo" component="div" className="text-red-600" />
                                                    </div>

                                                    <div className="w-full">
                                                        <label htmlFor="empresa">Nome Empresarial</label>
                                                        <Field type="text" name="empresa" className="w-full p-2 border rounded mb-1" />
                                                        <ErrorMessage name="empresa" component="div" className="text-red-600" />
                                                    </div>
                                                </div>


                                                <label htmlFor="localizacao">Localização</label>
                                                <Field type="text" name="localizacao" className="w-full p-2 border rounded mb-1" />
                                                <ErrorMessage name="localizacao" component="div" className="text-red-600" />

                                                <div className="flex h-4 gap-2 mb-8">
                                                    <div className="w-full">
                                                        <label htmlFor="descricao">Descrição simplificada</label>
                                                        <Field as={Textarea} name="descricao" className="w-full h-full resize-none p-2 border rounded mb-1" />
                                                        <ErrorMessage name="descricao" component="div" className="text-red-600" />
                                                    </div>
                                                    <div className="w-full">
                                                        <label htmlFor="descricaodetalhada">Descrição detalhada</label>
                                                        <Field as={Textarea} name="descricaodetalhada" className="w-full h-full resize-none p-2 border rounded mb-1" />
                                                        <ErrorMessage name="descricaodetalhada" component="div" className="text-red-600" />
                                                    </div>
                                                </div>
                                                <label htmlFor="salario">Salário</label>
                                                <Field type="number" name="salario" className="w-full p-2 border rounded mb-1" />

                                                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full cursor-pointer">
                                                    Salvar
                                                </button>
                                            </Form>
                                        </Formik>
                                    </div>
                                </div>
                                <div className="flex gap-5 px-4">
                                    <button className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded w-1/2 cursor-pointer" onClick={() => setModalAberto(null)}>Fechar</button>
                                    <button className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-1/2 cursor-pointer" onClick={() => delVagas(vaga.id)}>Deletar</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
