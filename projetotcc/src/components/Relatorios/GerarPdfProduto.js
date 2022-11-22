import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

function gerarPdf(produtos) {

    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const reportTitle = [
        {
            text: 'Relatório de Produtos 01/10/2022 12:00',
            fontSize: 15,
            bold: true,
            margin: [15, 20, 0, 45] // left, top, right, bottom
        }
    ];

    const dados = produtos.map((produto) => {
        return [
            { text: produto.produtoId, fontSize: 9, margin: [0, 2, 0, 2] },
            { text: produto.nome, fontSize: 9, margin: [0, 2, 0, 2] },
            { text: produto.descricao, fontSize: 9, margin: [0, 2, 0, 2] },
            { text: 'R$ ' + produto.preco, fontSize: 9, margin: [0, 2, 0, 2] },
            { text: produto.estoque, fontSize: 9, margin: [0, 2, 0, 2] },
            { text: produto.imagemUrl, fontSize: 9, margin: [0, 2, 0, 2] },
            { text: produto.categoriaId, fontSize: 9, margin: [0, 2, 0, 2] }
        ]
    });

    const details = [
        {
            table: {
                headerRows: 1,
                widths: [10, '*', '*', '*', '*', '*', '*'],
                body: [
                    [
                        { text: 'ID', style: 'tableHeader', fontSize: 10 },
                        { text: 'Nome', style: 'tableHeader', fontSize: 10 },
                        { text: 'Descricao', style: 'tableHeader', fontSize: 10 },
                        { text: 'Preço', style: 'tableHeader', fontSize: 10 },
                        { text: 'Estoque', style: 'tableHeader', fontSize: 10 },
                        { text: 'ImagemUrl', style: 'tableHeader', fontSize: 10 },
                        { text: 'CategoriaId', style: 'tableHeader', fontSize: 10 }
                    ],
                    ...dados
                ]
            },
            layout: 'lightHorizontalLines' // headerLineOnly
        }
    ];

    function Rodape(currentPage, pageCount) {
        return [
            {
                text: currentPage + ' / ' + pageCount,
                alignment: 'right',
                fontSize: 9,
                margin: [0, 10, 20, 0] // left, top, right, bottom
            }
        ]
    }

    const docDefinitios = {
        pageSize: 'A4',
        pageMargins: [15, 50, 15, 40],

        header: [reportTitle],
        content: [details],
        footer: Rodape
    }

    pdfMake.createPdf(docDefinitios).open();
}

export default gerarPdf;