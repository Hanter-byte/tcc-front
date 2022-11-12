import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import Cliente from './pages/clientes/Cliente';
import Categoria from './pages/categorias';
import Produtos from './pages/produtos/Produtos';
import Manutencoes from './pages/manutencoes/Manutencoes';

export default function App() {
    return (
        <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/Produtos/*' element={<Produtos />} />
            <Route path='/clientes/*' element={<Cliente />} />
            <Route path='/Categorias/*' element={<Categoria />} />
            <Route path='/Manutencoes/*' element={<Manutencoes />} />
        </Routes>
    );
}