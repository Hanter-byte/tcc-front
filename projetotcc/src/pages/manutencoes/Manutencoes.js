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
import { TbEdit } from 'react-icons/tb';
import { RiDeleteBin2Line } from 'react-icons/ri';

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
    await axios
      .post(baseUrl, manutencaoSelecionado)
      .then((response) => {
        setData(data.concat(response.data));
        abrirFecharModalIncluir();
        alert("Manutenção cadastrado com sucesso!");
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
        alert("Manutenção editada com sucesso!");
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
        alert("Manutenção excluida com sucesso!");
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
      <h3>Relação de Manutencões</h3>
      <header>
        <img src={logoCadastro} alt="Cadastro" />
        <Button
          variant="outline-secondary"
          onClick={() => abrirFecharModalIncluir()}
        >
          <i className="fas fa-plus me-2"></i>Nova Manutencão
        </Button>
      </header>

      <br></br>
      <ul>
        {data.map(manutencao => (
          <li key={manutencao.manutencaoId}>
            <b>Nome: </b>{manutencao.nome}<br />
            <b>Descricao: </b>{manutencao.descricao}<br />
            <b>Preço: R$</b>{manutencao.preco}<br />
            <b>ClienteId: </b>{manutencao.clienteId}<br />
            <b>ProdutoId: </b>{manutencao.produtoId}<br />
            <button onClick={() => selecionarManutencao(manutencao, "Editar")}
            >
              <TbEdit size="25" color="#17202a" />
            </button>
            <button type="button" onClick={() => selecionarManutencao(manutencao, "Excluir")}
            >
              <RiDeleteBin2Line size="25" color="#17202a" />
            </button>
          </li>
        ))}
      </ul>

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Nova Manutenção</ModalHeader>
        <ModalBody>
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

            <Form.Group className="mb-3" controlId="formGridCliente">
              <Form.Label>ClienteId</Form.Label>
              <Form.Control type="text" name="clienteid" onChange={handleChange} />
            </Form.Group>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridProdutoId">
                <Form.Label>ProdutoId</Form.Label>
                <Form.Control type="text" name="produtoid" onChange={handleChange} />
              </Form.Group>

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
        <ModalHeader>Editar Manutenção</ModalHeader>
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
            <label>Descrição: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="descricao"
              onChange={handleChange}
              value={manutencaoSelecionado && manutencaoSelecionado.descricao}
            />
            <br />
            <label>ClienteId: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="clienteid"
              onChange={handleChange}
              value={manutencaoSelecionado && manutencaoSelecionado.clienteId}
            />
            <br />
            <label>ProdutoId: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="produtoid"
              onChange={handleChange}
              value={manutencaoSelecionado && manutencaoSelecionado.produtoId}
            />
            <br />
            <label>Preço: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="preco"
              onChange={handleChange}
              value={manutencaoSelecionado && manutencaoSelecionado.preco}
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
          Confirma a exclusão desta manutenção :{" "}
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