import React from "react";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import logoCadastro from "./../../assets/cadastro.png";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export default function Clientes() {

  const baseUrl = "https://localhost:44340/api/clientes";
  const [data, setData] = useState([]);
  const [setUpdateData] = useState(true);
  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const [clienteSelecionado, setClienteSelecionado] = useState({
    id: "",
    cpf: "",
    nome: "",
    email: "",
    telefone: "",
  });

  const selecionarCliente = (cliente, opcao) => {
    setClienteSelecionado(cliente);
    opcao === "Editar" ? abrirFecharModalEditar() : abrirFecharModalExcluir();
  };

  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  };

  const abrirFecharModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirFecharModalExcluir = () => {
    setModalExcluir(!modalExcluir);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClienteSelecionado({
      ...clienteSelecionado,
      [name]: value,
    });
    console.log(clienteSelecionado);
  };

  const pedidoGet = async () => {
    await axios
      .get(baseUrl)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const pedidoPost = async () => {
    delete clienteSelecionado.id;
    clienteSelecionado.telefone = parseInt(clienteSelecionado.telefone);
    await axios
      .post(baseUrl, clienteSelecionado)
      .then((response) => {
        setData(data.concat(response.data));
        abrirFecharModalIncluir();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const pedidoPut = async () => {
    await axios
      .put(baseUrl + "/" + clienteSelecionado.clienteId, clienteSelecionado)
      .then((response) => {
        var resposta = response.data;
        var dadosAuxiliar = data;
        dadosAuxiliar.map((cliente) => {
          if (cliente.clienteId === clienteSelecionado.id) {
            cliente.cpf = resposta.cpf;
            cliente.nome = resposta.nome;
            cliente.email = resposta.email;
            cliente.telefone = resposta.telefone;
          }
        });
        //setUpdateData(true); Tela não fecha
        abrirFecharModalEditar();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const pedidoDelete = async () => {
    await axios
      .delete(baseUrl + "/" + clienteSelecionado.clienteId)
      .then((response) => {
        setData(data.filter((cliente) => cliente.clienteId !== response.data));
        //setUpdateData(true); Tela não fecha
        abrirFecharModalExcluir();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    pedidoGet();
  });

  return (
    <div className="cliente-container">
      <br />
      <h3>Cadastro de Clientes</h3>
      <header>
        <img src={logoCadastro} alt="Cadastro" />
        <Button
          variant="outline-secondary"
          onClick={() => abrirFecharModalIncluir()}
        >
          <i className="fas fa-plus me-2"></i>Incluir Novo Cliente
        </Button>
      </header>
      <table className="table table-striped table-hover">
        <thead className="table-dark mt-3">
          <tr>
            <th>Id</th>
            <th>Cpf</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {data.map((cliente) => (
            <tr key={cliente.clienteId}>
              <td>{cliente.clienteId}</td>
              <td>{cliente.cpf}</td>
              <td>{cliente.nome}</td>
              <td>{cliente.email}</td>
              <td>{cliente.telefone}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => selecionarCliente(cliente, "Editar")}
                >
                  {" "}
                  <i className="fas fa-user-edit me-2"></i>Editar
                </button>{" "}
                <button
                  className="btn btn-sm btn-outline-danger me-2"
                  onClick={() => selecionarCliente(cliente, "Excluir")}
                >
                  {" "}
                  <i className="fas fa-user-times me-2"></i>Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Clientes</ModalHeader>
        <ModalBody>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Nome</Form.Label>
                <Form.Control type="text" name="nome" onChange={handleChange} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridcpf">
                <Form.Label>Cpf</Form.Label>
                <Form.Control type="text" name="cpf" onChange={handleChange} />
              </Form.Group>
            </Row>

            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" name="email" onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGridFone">
              <Form.Label>Telefone</Form.Label>
              <Form.Control type="text" name="telefone" onChange={handleChange} />
            </Form.Group>
          </Form>

        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPost()}>Incluir</button>{"   "}
          <button className="btn btn-danger" onClick={() => abrirFecharModalIncluir()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Cliente</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID: </label>
            <input
              type="text"
              className="form-control"
              readOnly
              value={clienteSelecionado && clienteSelecionado.clienteId}
            />
            <br />
            <label>Nome: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="nome"
              onChange={handleChange}
              value={clienteSelecionado && clienteSelecionado.nome}
            />
            <br />
            <label>Cpf: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="cpf"
              onChange={handleChange}
              value={clienteSelecionado && clienteSelecionado.cpf}
            />
            <br />
            <label>Email: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="email"
              onChange={handleChange}
              value={clienteSelecionado && clienteSelecionado.email}
            />
            <br />
            <label>Telefone: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="telefone"
              onChange={handleChange}
              value={clienteSelecionado && clienteSelecionado.telefone}
            />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPut()}>
            Editar
          </button>
          {"  "}
          <button
            className="btn btn-danger"
            onClick={() => abrirFecharModalEditar()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir}>
        <ModalBody>
          Confirma a exclusão deste cliente :{" "}
          {clienteSelecionado && clienteSelecionado.nome} ?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => pedidoDelete()}>
            {" "}
            Sim{" "}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => abrirFecharModalExcluir()}
          >
            {" "}
            Não{" "}
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}