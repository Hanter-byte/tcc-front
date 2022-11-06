import React from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import logoCadastro from './assets/cadastro.png'
import { useEffect, useState } from 'react';

function App() {

  const baseUrl = "https://localhost:44340/api/clientes";

  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState(true);

  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const [clienteSelecionado, setClienteSelecionado] = useState({
    id: '',
    nome: '',
    email: '',
    telefone: ''
  })

  const selecionarCliente = (cliente, opcao) => {
    setClienteSelecionado(cliente);
    (opcao === "Editar") ?
      abrirFecharModalEditar() : abrirFecharModalExcluir();
  }

  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir)
  }

  const abrirFecharModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  const abrirFecharModalExcluir = () => {
    setModalExcluir(!modalExcluir);
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setClienteSelecionado({
      ...clienteSelecionado, [name]: value
    });
    console.log(clienteSelecionado);
  }

  const pedidoGet = async () => {
    await axios.get(baseUrl)
      .then(response => {
        setData(response.data);
      }).catch(error => { console.log(error); })
  }

  const pedidoPost = async () => {

    delete clienteSelecionado.id;
    clienteSelecionado.telefone = parseInt(clienteSelecionado.telefone);
    await axios.post(baseUrl, clienteSelecionado)
      .then(response => {
        setData(data.concat(response.data));
        abrirFecharModalIncluir();
      }).catch(error => {
        console.log(error);
      })
  }

  const pedidoPut = async () => {
    await axios.put(baseUrl + "/" + clienteSelecionado.clienteId, clienteSelecionado)
      .then(response => {
        var resposta = response.data;
        var dadosAuxiliar = data;
        dadosAuxiliar.map(cliente => {
          if (cliente.clienteId === clienteSelecionado.id) {
            cliente.nome = resposta.nome;
            cliente.email = resposta.email;
            cliente.telefone = resposta.telefone;
          }
        });
        setUpdateData(true);
        abrirFecharModalEditar();
      }).catch(error => {
        console.log(error);
      })
  }

  const pedidoDelete = async () => {
    await axios.delete(baseUrl + "/" + clienteSelecionado.clienteId)
      .then(response => {
        setData(data.filter(cliente => cliente.clienteId !== response.data));
        setUpdateData(true);
        abrirFecharModalExcluir();
      }).catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    pedidoGet();
  })

  return (
    <div className="cliente-container">
      <br />
      <h3>Cadastro de Clientes</h3>
      <header>
        <img src={logoCadastro} alt='Cadastro' />
        <button className="btn btn-success" onClick={() => abrirFecharModalIncluir()}>Incluir Novo Cliente</button>
      </header>
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {data.map(cliente => (
            <tr key={cliente.clienteId}>
              <td>{cliente.clienteId}</td>
              <td>{cliente.nome}</td>
              <td>{cliente.email}</td>
              <td>{cliente.telefone}</td>
              <td>
                <button className='btn btn-primary' onClick={() => selecionarCliente(cliente, "Editar")}>Editar</button> {" "}
                <button className='btn btn-danger' onClick={() => selecionarCliente(cliente, "Excluir")}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Clientes</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nome: </label>
            <br />
            <input type="text" className="form-control" name="nome" onChange={handleChange} />
            <br />
            <label>Email: </label>
            <br />
            <input type="text" className="form-control" name="email" onChange={handleChange} />
            <br />
            <label>telefone: </label>
            <br />
            <input type="text" className="form-control" name="telefone" onChange={handleChange} />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPost()}>Incluir</button>{"   "}
          <button className="btn btn-danger" onClick={() => abrirFecharModalIncluir()} >Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Cliente</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID: </label>
            <input type="text" className="form-control" readOnly
              value={clienteSelecionado && clienteSelecionado.clienteId} />
            <br />
            <label>Nome: </label><br />
            <input type="text" className="form-control" name="nome" onChange={handleChange}
              value={clienteSelecionado && clienteSelecionado.nome} /><br />
            <label>Email: </label><br />
            <input type="text" className="form-control" name="email" onChange={handleChange}
              value={clienteSelecionado && clienteSelecionado.email} /><br />
            <label>Telefone: </label><br />
            <input type="text" className="form-control" name="telefone" onChange={handleChange}
              value={clienteSelecionado && clienteSelecionado.telefone} /><br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPut()}>Editar</button>{"  "}
          <button className="btn btn-danger" onClick={() => abrirFecharModalEditar()} >Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir}>
        <ModalBody>
          Confirma a exclusão deste cliente : {clienteSelecionado && clienteSelecionado.nome} ?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => pedidoDelete()} > Sim </button>
          <button className="btn btn-secondary" onClick={() => abrirFecharModalExcluir()}> Não </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;