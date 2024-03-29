import React from 'react';
import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import logoCadastro from './../../assets/produto.png'
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import gerarPdf from '../../components/Relatorios/GerarPdfProduto';

export default function Produtos() {

  const baseUrl = "https://localhost:7121/api/produtos";
  const [data, setData] = useState([]);
  //const [setUpdateData] = useState(true);
  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const [produtoSelecionado, setprodutoSelecionado] = useState({
    id: '',
    nome: '',
    descricao: '',
    preco: '',
    imagemurl: '',
    estoque: '',
    categoriaid: ''
  })

  const selecionarProduto = (produto, opcao) => {
    setprodutoSelecionado(produto);
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
    setprodutoSelecionado({
      ...produtoSelecionado, [name]: value
    });
    console.log(produtoSelecionado);
  }

  const pedidoGet = async () => {
    await axios.get(baseUrl)
      .then(response => {
        setData(response.data);
      }).catch(error => { console.log(error); })
  }

  const pedidoPost = async () => {
    delete produtoSelecionado.id;
    await axios.post(baseUrl, produtoSelecionado)
      .then(response => {
        setData(data.concat(response.data));
        abrirFecharModalIncluir();
        alert("Produto cadastrado com sucesso!");
      }).catch(error => {
        console.log(error);
      })
  }

  const pedidoPut = async () => {
    await axios.put(baseUrl + "/" + produtoSelecionado.produtoId, produtoSelecionado)
      .then(response => {
        var resposta = response.data;
        var dadosAuxiliar = data;
        dadosAuxiliar.map(produto => {
          if (produto.produtoId === produtoSelecionado.id) {
            produto.nome = resposta.nome;
            produto.descricao = resposta.descricao;
            produto.preco = resposta.preco;
            produto.estoque = resposta.estoque;
            produto.imagemUrl = resposta.imagemurl;
            produto.categoriaId = resposta.categoriaid
          }
        });
        //setUpdateData(true); Tela não fecha
        abrirFecharModalEditar();
        alert("Produto editado com sucesso!");
      }).catch(error => {
        console.log(error);
      })
  }

  const pedidoDelete = async () => {
    await axios.delete(baseUrl + "/" + produtoSelecionado.produtoId)
      .then(response => {
        setData(data.filter(produto => produto.produtoId !== response.data));
        //setUpdateData(true); Tela não fecha
        abrirFecharModalExcluir();
        alert("Produto excluido com sucesso!");
      }).catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    pedidoGet();
  })

  return (
    <div className="produto-container">
      <br />
      <h3>Cadastro de Produtos</h3>
      <header>
        <img src={logoCadastro} alt='Cadastro' />
        <Button variant='outline-secondary' onClick={() => abrirFecharModalIncluir()}><i className='fas fa-plus me-2'></i>Incluir Novo Produto</Button>
        <Button
          variant="outline-secondary"
          onClick={() => gerarPdf(data)} className="btn btn-sm btn-outline-danger me-2"><i className="far fa-file-pdf"></i> Gerar PDF
        </Button>
      </header>
      <table className='table table-striped table-hover'>
        <thead className='table-dark mt-3'>
          <tr>
           {/*  <th>Id</th> */}
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>ImagemUrl</th>
            <th>CategoriaId</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {data.map(produto => (
            <tr key={produto.produtoId}>
              {/* <td>{produto.produtoId}</td> */} 
              <td>{produto.nome}</td>
              <td>{produto.descricao}</td>
              <td>R${produto.preco}</td>
              <td>{produto.estoque}</td>
              <td>{produto.imagemUrl}</td>
              <td>{produto.categoriaId}</td>
              <td>
                <button className='btn btn-sm btn-outline-primary me-2' onClick={() => selecionarProduto(produto, "Editar")}> <i className='fa fa-cube me-2' ></i>Editar</button> {" "}
                <button className='btn btn-sm btn-outline-danger me-2' onClick={() => selecionarProduto(produto, "Excluir")}> <i className='fa fa-cube me-2' ></i>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Produtos</ModalHeader>
        <ModalBody>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Nome</Form.Label>
                <Form.Control type="text" name="nome" onChange={handleChange} />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Descrição</Form.Label>
                <Form.Control type="text" name="descricao" onChange={handleChange} />
              </Form.Group>
            </Row>
            <Form.Group className="mb-3" controlId="formGridCliente">
              <Form.Label>Preço</Form.Label>
              <Form.Control type="text" name="preco" onChange={handleChange} />
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridProdutoId">
                <Form.Label>Estoque</Form.Label>
                <Form.Control type="text" name="estoque" onChange={handleChange} />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>ImagemUrl</Form.Label>
                <Form.Control type="text" name="imagemurl" onChange={handleChange} />
              </Form.Group>
            </Row>
            <Form.Group className="mb-3" controlId="formGridCliente">
              <Form.Label>CategoriaId</Form.Label>
              <Form.Control type="text" name="categoriaid" onChange={handleChange} />
            </Form.Group>
            {/* <Form.Group className="form-group col-md-4">
                <label for="inputState">CategoriaId</label>
                <select id="inputState" class="form-control">
                  <option selected>Selecione...</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
            </Form.Group> */}
          </Form>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPost()}>Incluir</button>{"   "}
          <button className="btn btn-danger" onClick={() => abrirFecharModalIncluir()} >Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Produto</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID: </label>
            <input type="text" className="form-control" readOnly
              value={produtoSelecionado && produtoSelecionado.produtoId} />
            <br />
            <label>Nome: </label><br />
            <input type="text" className="form-control" name="nome" onChange={handleChange}
              value={produtoSelecionado && produtoSelecionado.nome} /><br />
            <label>Descrição: </label><br />
            <input type="text" className="form-control" name="descricao" onChange={handleChange}
              value={produtoSelecionado && produtoSelecionado.descricao} /><br />
            <label>Preço: </label><br />
            <input type="text" className="form-control" name="preco" onChange={handleChange}
              value={produtoSelecionado && produtoSelecionado.preco} /><br />
            <label>Estoque: </label><br />
            <input type="text" className="form-control" name="estoque" onChange={handleChange}
              value={produtoSelecionado && produtoSelecionado.estoque} /><br />
            <label>ImagemUrl: </label><br />
            <input type="text" className="form-control" name="imagemUrl" onChange={handleChange}
              value={produtoSelecionado && produtoSelecionado.imagemUrl} /><br />
            <label>CategoriaId: </label><br />
            <input type="text" className="form-control" name="categoriaId" onChange={handleChange}
              value={produtoSelecionado && produtoSelecionado.categoriaId} /><br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPut()}>Editar</button>{"  "}
          <button className="btn btn-danger" onClick={() => abrirFecharModalEditar()} >Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir}>
        <ModalBody>
          Confirma a exclusão deste produto : {produtoSelecionado && produtoSelecionado.nome} ?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => pedidoDelete()} > Sim </button>
          <button className="btn btn-secondary" onClick={() => abrirFecharModalExcluir()}> Não </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}