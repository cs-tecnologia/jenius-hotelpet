export default {
	// 1. Verifica se houve mudanças e se os campos obrigatórios estão preenchidos
podeSalvar: () => {
    const action = appsmith.store.modalContexto?.acaoTipo;
    const row = TableCategoria.selectedRow || {}; // Proteção caso a linha suma

    // --- Valores Atuais (Limpando no ato da captura) ---
    const descAtual = InputDescricao.text || "";
		const vendaAtual = CurrencyInput1Valor.value || "";
		const estoqueAtual = InputQtdade.text || "";
		const tipoAtual = Select1Tipo.selectedOptionValue;

    // --- Valores Originais (Protegendo contra nulos) ---
    const descOriginal = TableCategoria.selectedRow.acomo002_desc || "";
    const vendaOriginal = TableCategoria.selectedRow.acomo002_valor_base || "";
    const estoqueOriginal = TableCategoria.selectedRow.acomo002_limite_pets || "";
    const tipoOriginal = TableCategoria.selectedRow.acomo002_permite_especie || "";
    
    // 1. Validação de preenchimento obrigatório
    const camposPreenchidos = 
					descAtual.trim().length > 0  && 
					tipoAtual !== undefined && 
					tipoAtual !== null  && 
					vendaAtual > 0 && 
					vendaAtual !== null  &&
					estoqueAtual > 0 && 
					estoqueAtual !== null;       

    if (action === "ADICIONAR") {
        return camposPreenchidos;
    } else {
        // 2. Comparação direta (mais limpa)
		
        const houveMudanca = 
				descAtual !== descOriginal ||
				vendaAtual !== vendaOriginal ||
				estoqueAtual !== estoqueOriginal ||
				tipoAtual !== tipoOriginal;
			
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
		resetWidget("CurrencyInput1Valor", true);
		resetWidget("InputEstoqueAtual", true);
		resetWidget("Select1Tipo", true);
		
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
		const vendaAtual = CurrencyInput1Valor.value || "";
		const estoqueAtual = InputQtdade.text || "";
		const tipoAtual = Select1Tipo.selectedOptionValue;
    
    // Dados da Tabela (O que estava salvo originalmente)
	  const descOriginal = (TableCategoria.selectedRow?.acomo002_desc || "").trim().toUpperCase();
    const vendaOriginal = TableCategoria.selectedRow.acomo002_valor_base || "";
    const estoqueOriginal = TableCategoria.selectedRow.acomo002_limite_pets || "";
    const tipoOriginal = TableCategoria.selectedRow.acomo002_permite_especie || "";

    // Validação de campos obrigatórios (Ex: Nome, Endereço e UF não podem ser vazios)
    const camposObrigatoriosPreenchidos = 
					descAtual.trim().length > 0  && 
					tipoAtual !== undefined && 
					tipoAtual !== null  && 
					vendaAtual > 0 && 
					vendaAtual !== null  &&
					estoqueAtual > 0  && 
					estoqueAtual !== null;       
	
    if (contexto === "ADICIONAR") {
        return camposObrigatoriosPreenchidos;
    }

    // No modo EDIÇÃO, verificamos se algo mudou
    const houveMudanca = 
			descAtual !== descOriginal ||
			vendaAtual !== vendaOriginal ||
			estoqueAtual !== estoqueOriginal ||
			tipoAtual !== tipoOriginal;
	
	// Criamos uma lista de todos os campos para debugar de uma vez
 const camposParaChecar = [
   { nome: "DESC", atual: descAtual, original: descOriginal },
   { nome: "VENDA", atual: vendaAtual, original: vendaOriginal },
   { nome: "ESTOQUE", atual: estoqueAtual, original: estoqueOriginal },
   { nome: "TIPO", atual: tipoAtual, original: tipoOriginal }
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