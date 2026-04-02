export default {
	// 1. Verifica se houve mudanças e se os campos obrigatórios estão preenchidos
podeSalvar: () => {
    const action = appsmith.store.modalContexto?.acaoTipo;
    const row = TableProdutos.selectedRow || {}; // Proteção caso a linha suma

    // --- Valores Atuais (Limpando no ato da captura) ---
    const descAtual = InputDescricao.text || "";
		const custoAtual = CurrencyInput1Custo.value || "";
		const vendaAtual = CurrencyInput1Valor.value || "";
		const estoqueAtual = InputEstoqueAtual.text || "";
		const tipoAtual = Select1Tipo.selectedOptionValue;
		const controlaAtual = !!Switch1Controla.isSwitchedOn;
		const unidadeAtual = Select1Unidade.selectedOptionValue;

    // --- Valores Originais (Protegendo contra nulos) ---
    const descOriginal = TableProdutos.selectedRow.serv001_desc || "";
    const custoOriginal = TableProdutos.selectedRow.serv001_valor_custo || "";
    const vendaOriginal = TableProdutos.selectedRow.serv001_valor_venda || "";
    const estoqueOriginal = TableProdutos.selectedRow.serv001_estoque_atual || "";
    const tipoOriginal = TableProdutos.selectedRow.serv001_tipo || "";
    const controlaOriginal = !!TableProdutos.selectedRow.serv001_controla_estoque;
    const unidadeOriginal = TableProdutos.selectedRow.serv001_unid001_id || "";
    
    // 1. Validação de preenchimento obrigatório
    const camposPreenchidos = descAtual.trim().length > 0 && tipoAtual !== undefined && controlaAtual !== undefined && unidadeAtual !== undefined;

    if (action === "ADICIONAR") {
        return camposPreenchidos;
    } else {
        // 2. Comparação direta (mais limpa)
		
        const houveMudanca = 
				descAtual !== descOriginal ||
				custoAtual !== custoOriginal ||
				vendaAtual !== vendaOriginal ||
				estoqueAtual !== estoqueOriginal ||
				tipoAtual !== tipoOriginal ||
				controlaAtual !== controlaOriginal ||
				unidadeAtual !== unidadeOriginal;
				
        return camposPreenchidos && houveMudanca;
    }
},
	
// 2. Função para o botão CANCELAR refatorada
	resetForm: async () => {
		// 1. Mudamos o estado de volta para "Visualizar/Editar" 
		// Isso faz com que o Default Value do Input aponte para a TableProdutos.selectedRow
		await storeValue("modalContexto", { 
			...appsmith.store.modalContexto, 
			acaoTipo: "EDITAR" 
		});

		// 2. Resetamos o widget. Agora ele vai ler o Default Value novo (da linha selecionada)
		resetWidget("InputDescricao", true);
		resetWidget("InputID", true);
		resetWidget("CurrencyInput1Custo", true);
		resetWidget("CurrencyInput1Valor", true);
		resetWidget("InputEstoqueAtual", true);
		resetWidget("Select1Tipo", true);
 		resetWidget("Switch1Controla", true);
 		resetWidget("Select1Unidade", true);
		
		// 3. Reiniciamos o cronômetro de inatividade (pois o usuário interagiu com o botão)
		JSutils.resetInactivityTimer();
		
		showAlert("Operação cancelada. Retornando ao registro selecionado.", "info");
	},
	
// Nova função para o botão CANCELAR
podeCancelar: () => {
    const action = appsmith.store.modalContexto?.acaoTipo;
    
    // Chamamos a função de verificação de mudanças que já criamos
    // Importante: use o nome do seu JSObject antes do ponto
    const houveAlteracao = JSvalidateButton.temAlteracao(); 

    if (action === "ADICIONAR") {
        // No modo ADICIONAR, o botão sempre funciona (true)
        return true;
    }

    // No modo EDITAR, só funciona se houve alteração (true/false)
    return houveAlteracao;
},

	// 1. Função que checa se o que está no input é diferente da tabela
temAlteracao: () => {
    const contexto = appsmith.store.modalContexto?.acaoTipo;
    
    // Dados dos Inputs/Selects (O que o usuário está fazendo agora)
	  const descAtual = (InputDescricao.text || "").trim().toUpperCase();
	  const custoAtual = CurrencyInput1Custo.value || "";
		const vendaAtual = CurrencyInput1Valor.value || "";
		const estoqueAtual = InputEstoqueAtual.text || "";
		const tipoAtual = Select1Tipo.selectedOptionValue;
		const controlaAtual = !!Switch1Controla.isSwitchedOn;
		const unidadeAtual = Select1Unidade.selectedOptionValue;	
    
    // Dados da Tabela (O que estava salvo originalmente)
	  const descOriginal = (TableProdutos.selectedRow?.serv001_desc || "").trim().toUpperCase();
    const custoOriginal = TableProdutos.selectedRow.serv001_valor_custo || "";
    const vendaOriginal = TableProdutos.selectedRow.serv001_valor_venda || "";
    const estoqueOriginal = TableProdutos.selectedRow.serv001_estoque_atual || "";
    const tipoOriginal = TableProdutos.selectedRow.serv001_tipo || "";
    const controlaOriginal = !!TableProdutos.selectedRow.serv001_controla_estoque;
    const unidadeOriginal = TableProdutos.selectedRow.serv001_unid001_id || "";      

    // Validação de campos obrigatórios (Ex: Nome, Endereço e UF não podem ser vazios)
    const camposObrigatoriosPreenchidos = 
			descAtual.trim().length > 0  && 
			tipoAtual !== undefined && 
			tipoAtual !== null  && 
			controlaAtual !== undefined && 
			controlaAtual !== null  &&
			unidadeAtual !== undefined && 
			unidadeAtual !== null;         
	
    if (contexto === "ADICIONAR") {
        return camposObrigatoriosPreenchidos;
    }

    // No modo EDIÇÃO, verificamos se algo mudou
    const houveMudanca = 
			descAtual !== descOriginal ||
			custoAtual !== custoOriginal ||
			vendaAtual !== vendaOriginal ||
			estoqueAtual !== estoqueOriginal ||
			tipoAtual !== tipoOriginal ||
			controlaAtual !== controlaOriginal ||
			unidadeAtual !== unidadeOriginal;

	// Criamos uma lista de todos os campos para debugar de uma vez
 const camposParaChecar = [
   { nome: "DESC", atual: descAtual, original: descOriginal },
   { nome: "CUSTO", atual: custoAtual, original: custoOriginal },
   { nome: "VENDA", atual: vendaAtual, original: vendaOriginal },
   { nome: "ESTOQUE", atual: estoqueAtual, original: estoqueOriginal },
   { nome: "TIPO", atual: tipoAtual, original: tipoOriginal },
   { nome: "CONTROLA", atual: controlaAtual, original: controlaOriginal },
   { nome: "UNIDADE", atual: unidadeAtual, original: unidadeOriginal }
 ];
// Usamos o forEach para imprimir cada um concatenado com delimitadores
 camposParaChecar.forEach(campo => {
    // O sinal de | ajuda a ver se tem espaço sobrando: ex: "SP |" vs "SP|"
     console.log(`Campo: ${campo.nome} -> [${campo.atual}] vs [${campo.original}] | Mudou? ${campo.atual !== campo.original}`);
 });

// console.log("Resultado Geral 'houveMudanca':", houveMudanca);
// Imprime no console do Appsmith (aba Logs lá embaixo)
 console.log("Campos Obrigatorios:", camposObrigatoriosPreenchidos);
 console.log("Houve mudança geral?", houveMudanca);

    // Habilita se os obrigatórios estão ok E houve alguma mudança real
    return camposObrigatoriosPreenchidos && houveMudanca; 
// Imprime o valor no console do Appsmith

},
}