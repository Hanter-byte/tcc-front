import React from "react";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import logoCadastro from "./../../assets/manutencao.png";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export default function Manutencoes() {

  const baseUrl = "https://localhost:44340/api/manutencoes";
  const [data, setData] = useState([]);
  const [setUpdateData] = useState(true);
  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const [manutencaoSelecionado, setManutencaoSelecionado] = useState({
    id: "",
    nome: "",
    descricao: "",
    preco: "",
    clienteid: "",
    produtoid: "",
  });

  const selecionarManutencao = (cliente, opcao) => {
    setManutencaoSelecionado(cliente);
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
    setManutencaoSelecionado({
      ...manutencaoSelecionado,
      [name]: value,
    });
    console.log(manutencaoSelecionado);
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
    delete manutencaoSelecionado.id;
    manutencaoSelecionado.telefone = parseInt(manutencaoSelecionado.telefone);
    await axios
      .post(baseUrl, manutencaoSelecionado)
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
      .put(baseUrl + "/" + manutencaoSelecionado.manutencaoId, manutencaoSelecionado)
      .then((response) => {
        var resposta = response.data;
        var dadosAuxiliar = data;
        dadosAuxiliar.map((manutencao) => {
          if (manutencao.manutencaoId === manutencaoSelecionado.id) {
            manutencao.nome = resposta.nome;
            manutencao.descricao = resposta.descricao;
            manutencao.preco = resposta.preco;
            manutencao.clienteid = resposta.clienteid;
            manutencao.produtoid = resposta.produtoid;
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
      .delete(baseUrl + "/" + manutencaoSelecionado.manutencaoId)
      .then((response) => {
        setData(data.filter((manutencao) => manutencao.manutencaoId !== response.data));
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
    <div className="manutencao-container">
      <br />
      <h3>Cadastro de Manutenções</h3>
      <header>
        <img src={logoCadastro} alt="Cadastro" />
        <Button
          variant="outline-secondary"
          onClick={() => abrirFecharModalIncluir()}
        >
          <i className="fas fa-plus me-2"></i>Nova Manutencão
        </Button>
      </header>
      <table className="table table-striped table-hover">
        <thead className="table-dark mt-3">
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Descricao</th>
            <th>Preço</th>
            <th>ClienteId</th>
            <th>ProdutoId</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {data.map((manutencao) => (
            <tr key={manutencao.manutencaoId}>
              <td>{manutencao.manutencaoId}</td>
              <td>{manutencao.nome}</td>
              <td>{manutencao.descricao}</td>
              <td>R$ {manutencao.preco}</td>
              <td>{manutencao.clienteId}</td>
              <td>{manutencao.produtoId}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => selecionarManutencao(manutencao, "Editar")}
                >
                  {" "}
                  <i className="fas fa-user-edit me-2"></i>Editar
                </button>{" "}
                <button
                  className="btn btn-sm btn-outline-danger me-2"
                  onClick={() => selecionarManutencao(manutencao, "Excluir")}
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
        <ModalHeader>Nova Manutenção</ModalHeader>
        <ModalBody>
          {/* <div className="form-group">
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
          </div> */}

          <Form>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Nome</Form.Label>
                <Form.Control type="text" name="nome" onChange={handleChange} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Descricao</Form.Label>
                <Form.Control type="text" name="descricao" onChange={handleChange} />
              </Form.Group>
            </Row>

            {/* <Form.Group className="mb-3" controlId="formGridPreco">
              <Form.Label>Preco</Form.Label>
              <Form.Control type="text" name="preco" onChange={handleChange} />
            </Form.Group> */}

            <Form.Group className="mb-3" controlId="formGridCliente">
              <Form.Label>ClienteId</Form.Label>
              <Form.Control type="text" name="clienteid" onChange={handleChange} />
            </Form.Group>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridProdutoId">
                <Form.Label>ProdutoId</Form.Label>
                <Form.Control type="text" name="produtoid" onChange={handleChange} />
              </Form.Group>

              {/* <Form.Group as={Col} controlId="formGridState">
                <Form.Label>State</Form.Label>
                <Form.Select defaultValue="Choose...">
                  <option>Choose...</option>
                  <option>...</option>
                </Form.Select>
              </Form.Group> */}

              <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>Preço</Form.Label>
                <Form.Control type="text" name="preco" onChange={handleChange} />
              </Form.Group>
            </Row>
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
              value={manutencaoSelecionado && manutencaoSelecionado.clienteId}
            />
            <br />
            <label>Nome: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="nome"
              onChange={handleChange}
              value={manutencaoSelecionado && manutencaoSelecionado.nome}
            />
            <br />
            <label>Email: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="email"
              onChange={handleChange}
              value={manutencaoSelecionado && manutencaoSelecionado.email}
            />
            <br />
            <label>Telefone: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="telefone"
              onChange={handleChange}
              value={manutencaoSelecionado && manutencaoSelecionado.telefone}
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
          {manutencaoSelecionado && manutencaoSelecionado.nome} ?
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