import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

function gerarPdf(manutencoes) {

    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const today = new Date();

    const reportTitle = [
        {
            text:'HardwareTech - ' + 'Relatório de Manutenções - ' + today.toLocaleDateString(),
            fontSize: 15,
            bold: true,
            margin: [15, 20, 0, 45]
        }
    ];

    const dados = manutencoes.map((manutencao) => {
        return [
            { text: manutencao.manutencaoId, fontSize: 9, margin: [0, 2, 0, 2] },
            { text: manutencao.nome, fontSize: 9, margin: [0, 2, 0, 2] },
            { text: manutencao.descricao, fontSize: 9, margin: [0, 2, 0, 2] },
            { text: 'R$ ' + manutencao.preco, fontSize: 9, margin: [0, 2, 0, 2] },
            { text: manutencao.clienteId, fontSize: 9, margin: [0, 2, 0, 2] },
            { text: manutencao.produtoId, fontSize: 9, margin: [0, 2, 0, 2] }
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
                        { text: 'ClienteId', style: 'tableHeader', fontSize: 10 },
                        { text: 'ProdutoId', style: 'tableHeader', fontSize: 10 }
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