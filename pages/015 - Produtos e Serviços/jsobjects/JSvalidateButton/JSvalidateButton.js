export default {
	// 1. Verifica se houve mudanças e se os campos obrigatórios estão preenchidos
podeSalvar: () => {
    const action = appsmith.store.modalContexto?.acaoTipo;
    
    // Valores Atuais (Inputs/Selects)
    const descAtual = InputDescricao.text || "";
	  const custoAtual = InputCusto.text || "";
		const vendaAtual = InputValor.text || "";
		const estoqueAtual = InputEstoqueAtual.text || "";
		const tipoAtual = Select1Tipo.selectedOptionValue;
		const controlaAtual = Select1Controla.selectedOptionValue;
		const unidadeAtual = Select1Unidade.selectedOptionValue;	

    
    // Valores Originais (Tabela)
    const descOriginal = TableProdutos.selectedRow.serv001_desc || "";
    const custoOriginal = TableProdutos.selectedRow.serv001_valor_custo || "";
    const vendaOriginal = TableProdutos.selectedRow.serv001_valor_venda || "";
    const estoqueOriginal = TableProdutos.selectedRow.serv001_estoque_atual || "";
    const tipoOriginal = TableProdutos.selectedRow.serv001_tipo || "";
    const controlaOriginal = TableProdutos.selectedRow.serv001_controla_estoque || "";
    const unidadeOriginal = TableProdutos.selectedRow.serv001_unid001_id || "";
	
	
    // 1. Validação de preenchimento obrigatório
    const camposPreenchidos = descAtual.trim().length > 0 && tipoAtual !== undefined && controlaAtual !== undefined && unidadeAtual !== undefined;

    if (action === "ADICIONAR") {
        // Na adição, basta que os campos obrigatórios estejam preenchidos
        return camposPreenchidos;
    } else {
        // Na edição, precisa estar preenchido E algo deve ter mudado
        const houveMudanca = (descAtual !== descOriginal) || (custoAtual !== custoOriginal) || (vendaAtual !== vendaOriginal) || (estoqueAtual !== estoqueOriginal) || (tipoAtual !== tipoOriginal) || (controlaAtual !== controlaOriginal) || (unidadeAtual !== unidadeOriginal);
        return camposPreenchidos && houveMudanca;
    }
},

// 2. Função para o botão CANCELAR refatorada
	resetForm: async () => {
		// 1. Mudamos o estado de volta para "Visualizar/Editar" 
		// Isso faz com que o Default Value do Input aponte para a TableAlimentos.selectedRow
		await storeValue("modalContexto", { 
			...appsmith.store.modalContexto, 
			acaoTipo: "EDITAR" 
		});

		// 2. Resetamos o widget. Agora ele vai ler o Default Value novo (da linha selecionada)
    resetWidget("InputDescricao", true);
    resetWidget("InputID", true);
    resetWidget("InputCusto", true);
		resetWidget("InputID", true);
 		resetWidget("Select1Tipo", true);
 		resetWidget("Select1Controla", true);
 		resetWidget("Select1Unidade", true);

		// 3. Reiniciamos o cronômetro de inatividade (pois o usuário interagiu com o botão)
		JSutils.resetInactivityTimer();
		
		showAlert("Operação cancelada. Retornando ao registro selecionado.", "info");
	},
	
// Nova função para o botão CANCELAR
    podeCancelar: () => {
        const action = appsmith.store.modalContexto?.acaoTipo;
        
        // Regra: Habilita se for "ADICIONAR" OU se a função podeSalvar for verdadeira (houve edição)
        return action === "ADICIONAR" || this.podeSalvar();
    },	

temAlteracao: () => {
    const contexto = appsmith.store.modalContexto?.acaoTipo;
    
    // Dados dos Inputs/Selects (O que o usuário está fazendo agora)
	  const descAtual = (InputDescricao.text || "").trim().toUpperCase();
	  const custoAtual = InputCusto.text || "";
		const vendaAtual = InputValor.text || "";
		const estoqueAtual = InputEstoqueAtual.text || "";
		const tipoAtual = Select1Tipo.selectedOptionValue;
		const controlaAtual = Select1Controla.selectedOptionValue;
		const unidadeAtual = Select1Unidade.selectedOptionValue;	
    
    // Dados da Tabela (O que estava salvo originalmente)
	  const descOriginal = (TableProdutos.selectedRow?.raca001_desc || "").trim().toUpperCase();
    const custoOriginal = TableProdutos.selectedRow.serv001_valor_custo || "";
    const vendaOriginal = TableProdutos.selectedRow.serv001_valor_venda || "";
    const estoqueOriginal = TableProdutos.selectedRow.serv001_estoque_atual || "";
    const tipoOriginal = TableProdutos.selectedRow.serv001_tipo || "";
    const controlaOriginal = TableProdutos.selectedRow.serv001_controla_estoque || "";
    const unidadeOriginal = TableProdutos.selectedRow.serv001_unid001_id || "";

    // 1. Validação de preenchimento obrigatório (Regra básica para os dois modos)
    const camposValidos = descAtual.length > 0 && (descAtual !== undefined && descAtual !== null) && (tipoAtual !== undefined && tipoAtual !== null) && (controlaAtual !== undefined && controlaAtual !== null) && (unidadeAtual !== undefined && unidadeAtual !== null);

    if (contexto === "ADICIONAR") {
        // No modo Adicionar, basta que os campos obrigatórios estejam preenchidos
        return camposValidos;
    }

    // 2. No modo EDIÇÃO, verificamos se algo mudou em relação ao original
    const houveMudancaDesc = descAtual !== descOriginal;
    const houveMudancaTipo = String(tipoAnimalAtual) !== String(tipoAnimalOriginal);

    // Habilita se os campos estiverem preenchidos E pelo menos um deles for diferente do original
    return camposValidos && (houveMudancaDesc || houveMudancaTipo);
},
}