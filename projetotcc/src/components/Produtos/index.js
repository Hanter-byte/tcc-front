import React from 'react';
import './styles.css';

import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import logoCadastro from './../assets/produto.png'
import { useEffect, useState } from 'react';

export default function Produtos() {
  const baseUrl = "https://localhost:44340/api/produtos";

  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState(true);

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
    // produtoSelecionado.telefone = parseInt(produtoSelecionado.telefone);
    await axios.post(baseUrl, produtoSelecionado)
      .then(response => {
        setData(data.concat(response.data));
        abrirFecharModalIncluir();
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
        setUpdateData(true);
        abrirFecharModalEditar();
      }).catch(error => {
        console.log(error);
      })
  }

  const pedidoDelete = async () => {
    await axios.delete(baseUrl + "/" + produtoSelecionado.produtoId)
      .then(response => {
        setData(data.filter(produto => produto.produtoId !== response.data));
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
    <div className="produto-container">
      <br />
      <h3>Cadastro de Produtos</h3>
      <header>
        <img src={logoCadastro} alt='Cadastro' />
        <button className="btn btn-success" onClick={() => abrirFecharModalIncluir()}>Incluir Novo Produto</button>
      </header>
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>Id</th>
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
              <td>{produto.produtoId}</td>
              <td>{produto.nome}</td>
              <td>{produto.descricao}</td>
              <td>{produto.preco}</td>
              <td>{produto.estoque}</td>
              <td>{produto.imagemUrl}</td>
              <td>{produto.categoriaId}</td>
              <td>
                <button className='btn btn-primary' onClick={() => selecionarProduto(produto, "Editar")}>Editar</button> {" "}
                <button className='btn btn-danger' onClick={() => selecionarProduto(produto, "Excluir")}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Produtos</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nome: </label>
            <br />
            <input type="text" className="form-control" name="nome" onChange={handleChange} />
            <br />
            <label>Descrição: </label>
            <br />
            <input type="text" className="form-control" name="descricao" onChange={handleChange} />
            <br />
            <label>Preço: </label>
            <br />
            <input type="text" className="form-control" name="preco" onChange={handleChange} />
            <br />
            <label>Estoque: </label>
            <br />
            <input type="text" className="form-control" name="estoque" onChange={handleChange} />
            <br />
            <label>ImagemUrl: </label>
            <br />
            <input type="text" className="form-control" name="imagemurl" onChange={handleChange} />
            <br />
            <label>CategoriaId: </label>
            <br />
            <input type="text" className="form-control" name="categoriaid" onChange={handleChange} />
            <br />
          </div>
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
            <input type="text" className="form-control" name="imagemurl" onChange={handleChange}
              value={produtoSelecionado && produtoSelecionado.imagemUrl} /><br />
            <label>CategoriaId: </label><br />
            <input type="text" className="form-control" name="categoriaid" onChange={handleChange}
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