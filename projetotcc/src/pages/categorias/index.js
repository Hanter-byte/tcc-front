import React from 'react';
import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Button } from 'react-bootstrap';
import logoCadastro from './../../assets/categoria.png'
import { useEffect, useState } from 'react';

export default function Categorias() {
  
  const baseUrl = "https://localhost:44340/api/categorias";
  const [data, setData] = useState([]);
  const [setUpdateData] = useState(true);
  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const [categoriaSelecionado, setcategoriaSelecionado] = useState({
    id: '',
    nome: '',
    imagemurl: ''
  })

  const selecionarCategoria = (categoria, opcao) => {
    setcategoriaSelecionado(categoria);
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
    setcategoriaSelecionado({
      ...categoriaSelecionado, [name]: value
    });
    console.log(categoriaSelecionado);
  }

  const pedidoGet = async () => {
    await axios.get(baseUrl)
      .then(response => {
        setData(response.data);
      }).catch(error => { console.log(error); })
  }

  const pedidoPost = async () => {
    delete categoriaSelecionado.id;
    await axios.post(baseUrl, categoriaSelecionado)
      .then(response => {
        setData(data.concat(response.data));
        abrirFecharModalIncluir();
        alert("Categoria cadastrada com sucesso!");
      }).catch(error => {
        console.log(error);
      })
  }

  const pedidoPut = async () => {
    await axios.put(baseUrl + "/" + categoriaSelecionado.categoriaId, categoriaSelecionado)
      .then(response => {
        var resposta = response.data;
        var dadosAuxiliar = data;
        dadosAuxiliar.map(categoria => {
          if (categoria.categoriaId === categoriaSelecionado.id) {
            categoria.nome = resposta.nome;
            categoria.imagemurl = resposta.imagemUrl;
          }
        });
        //setUpdateData(true); Tela não fecha
        abrirFecharModalEditar();
        alert("Categoria editada com sucesso!");
      }).catch(error => {
        console.log(error);
      })
  }

  const pedidoDelete = async () => {
    await axios.delete(baseUrl + "/" + categoriaSelecionado.categoriaId)
      .then(response => {
        setData(data.filter(categoria => categoria.categoriaId !== response.data));
       // setUpdateData(true);
        abrirFecharModalExcluir();
        alert("Categoria excluida com sucesso!");
      }).catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    pedidoGet();
  })

  return (
    <div className="categoria-container">
      <br />
      <h3>Cadastro de Categorias</h3>
      <header>
        <img src={logoCadastro} alt='Cadastro' />
        <Button variant='outline-secondary' onClick={() => abrirFecharModalIncluir()}><i className='fas fa-plus me-2'></i>Incluir Nova Categoria</Button>
      </header>
      <table className='table table-striped table-hover'>
        <thead className='table-dark mt-3'>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>ImagemUrl</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {data.map(categoria => (
            <tr key={categoria.categoriaId}>
              <td>{categoria.categoriaId}</td>
              <td>{categoria.nome}</td>
              <td>{categoria.imagemUrl}</td>
              <td>
                <button className='btn btn-sm btn-outline-primary me-2' onClick={() => selecionarCategoria(categoria, "Editar")}> <i className='fas fa-user-edit me-2'></i>Editar</button> {" "}
                <button className='btn btn-sm btn-outline-danger me-2' onClick={() => selecionarCategoria(categoria, "Excluir")}> <i className='fas fa-user-times me-2'></i>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Categoria</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nome: </label>
            <br />
            <input type="text" className="form-control" name="nome" onChange={handleChange} />
            <br />
            <label>ImagemUrl: </label>
            <br />
            <input type="text" className="form-control" name="imagemUrl" onChange={handleChange} />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPost()}>Incluir</button>{"   "}
          <button className="btn btn-danger" onClick={() => abrirFecharModalIncluir()} >Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Categoria</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID: </label>
            <input type="text" className="form-control" readOnly
              value={categoriaSelecionado && categoriaSelecionado.categoriaId} />
            <br />
            <label>Nome: </label><br />
            <input type="text" className="form-control" name="nome" onChange={handleChange}
              value={categoriaSelecionado && categoriaSelecionado.nome} /><br />
            <label>ImagemUrl: </label><br />
            <input type="text" className="form-control" name="imagemUrl" onChange={handleChange}
              value={categoriaSelecionado && categoriaSelecionado.imagemUrl} /><br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPut()}>Editar</button>{"  "}
          <button className="btn btn-danger" onClick={() => abrirFecharModalEditar()} >Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir}>
        <ModalBody>
          Confirma a exclusão desta categoria : {categoriaSelecionado && categoriaSelecionado.nome} ?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => pedidoDelete()} > Sim </button>
          <button className="btn btn-secondary" onClick={() => abrirFecharModalExcluir()}> Não </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}