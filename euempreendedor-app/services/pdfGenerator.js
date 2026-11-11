import * as Print from "expo-print";



export async function gerarPdfOrcamento(orcamento){
    //Pega os itens do orçamento
    const itensHtml = (orcamento?.itens || []).map((item) => `
        <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.descricao}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">R$ ${Number(item.valor || 0).toFixed(2)}</td>
        </tr>
    `).join('');

    //Montar eles em uma página HTML
    const html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    color: #333;
                    margin: 0;
                    padding: 30px;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 2px solid #0284C7;
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                }
                .header h1 {
                    color: #0284C7;
                    margin: 0;
                    font-size: 26px;
                    text-transform: uppercase;
                }
                .header .meta {
                    text-align: right;
                    font-size: 13px;
                    color: #64748B;
                }
                .box-info {
                    background-color: #F8FAFC;
                    border: 1px solid #E2E8F0;
                    border-radius: 8px;
                    padding: 14px;
                    margin-bottom: 20px;
                    font-size: 13px;
                }
                .box-info strong {
                    color: #0F172A;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 25px;
                    font-size: 13px;
                }
                th {
                    background-color: #0284C7;
                    color: #ffffff;
                    padding: 10px;
                    text-align: left;
                }
                th.valor {
                    text-align: right;
                }
                .total-box {
                    text-align: right;
                    margin-bottom: 35px;
                    font-size: 16px;
                }
                .total-valor {
                    font-size: 22px;
                    font-weight: bold;
                    color: #0284C7;
                }
                .observacoes {
                    font-size: 11px;
                    color: #64748B;
                    border-left: 3px solid #0284C7;
                    padding-left: 10px;
                    margin-bottom: 40px;
                }
                .assinaturas {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 50px;
                }
                .linha-assinatura {
                    width: 42%;
                    text-align: center;
                    border-top: 1px solid #94A3B8;
                    padding-top: 8px;
                    font-size: 12px;
                    color: #475569;
                }
            </style>
        </head>
             <body>
                <!-- CABEÇALHO -->
                <div class="header">
                    <h1>Orçamento</h1>
                    <div class="meta">
                        <strong>Nº:</strong> #${orcamento?.numero || orcamento?.id || '001'}<br>
                        <strong>Data: ${orcamento?.data_emissao || '-'}</strong> 
                    </div>
                </div>

                <!-- DADOS DO CLIENTE -->
                <div class="box-info">
                    <strong>Cliente:</strong> ${orcamento?.nome_cliente} <br>
                    <strong>Telefone:</strong> ${orcamento?.telefone} <br>
                    <strong>Status:${orcamento?.status || 'Pendente'}</strong> 
                </div>

                <!-- TABELA DE ITENS -->
                <table>
                    <thead>
                        <tr>
                            <th>Descrição do Serviço</th>
                            <th class="valor">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itensHtml}
                    </tbody>
                </table>

                <!-- TOTAL -->
                <div class="total-box">
                    Total: <span class="total-valor">${Number(orcamento?.calcular_total || 0).toFixed(2)}</span>
                </div>

                <!-- OBSERVAÇÕES -->
                <div class="observacoes">
                    <strong>Observações:</strong> Proposta válida até ${orcamento?.validade || 'A definir'} a partir da data de emissão.
                </div>

                <!-- ASSINATURAS -->
                <div class="assinaturas">
                    <div class="linha-assinatura">Assinatura do Cliente</div>
                    <div class="linha-assinatura">Responsável Técnico</div>
                </div>
            </body>
    `;
    //Usando o expo-print, converte a página HTML em PDF
    await Print.printAsync({ html });
}