export default {
	// 1. Verifica se houve mudanças e se os campos obrigatórios estão preenchidos
podeSalvar: () => {
    const action = appsmith.store.modalContexto?.acaoTipo;
    const row = TableAcomodacao.selectedRow || {}; // Proteção caso a linha suma

    // --- Valores Atuais (Limpando no ato da captura) ---
		const descAtual = InputDescricao.text || "";
		const vendaAtual = CurrencyInput1Valor.value || "";
		const obsAtual = InputObservacao.text || "";
		const categoriaAtual = Select1Categoria.selectedOptionValue;

    // --- Valores Originais (Protegendo contra nulos) ---
    const descOriginal = TableAcomodacao.selectedRow.acomo001_desc || "";
    const vendaOriginal = TableAcomodacao.selectedRow.acomo001_valor_base || "";
    const obsOriginal = TableAcomodacao.selectedRow.acomo001_obs || "";
    const categoriaOriginal = TableAcomodacao.selectedRow.acomo001_acomo002_id || "";
    
    // 1. Validação de preenchimento obrigatório
    const camposPreenchidos = 
					descAtual.trim().length > 0  && 
					categoriaAtual !== undefined && 
					categoriaAtual !== null  && 
					vendaAtual > 0 && 
					vendaAtual !== null;       

    if (action === "ADICIONAR") {
        return camposPreenchidos;
    } else {
        // 2. Comparação direta (mais limpa)
		
        const houveMudanca = 
				descAtual !== descOriginal ||
				vendaAtual !== vendaOriginal ||
				obsAtual !== obsOriginal ||
				categoriaAtual !== categoriaOriginal;
			
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
		resetWidget("InputObservacao", true);
		resetWidget("Select1Categoria", true);
		
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
		const obsAtual = InputObservacao.text || "";
		const categoriaAtual = Select1Categoria.selectedOptionValue;
    
    // Dados da Tabela (O que estava salvo originalmente)
		const descOriginal = (TableAcomodacao.selectedRow?.acomo001_desc || "").trim().toUpperCase();
		const vendaOriginal = TableAcomodacao.selectedRow.acomo001_valor_base || "";
		const obsOriginal = TableAcomodacao.selectedRow.acomo001_obs || "";
		const categoriaOriginal = TableAcomodacao.selectedRow.acomo001_acomo002_id || "";

    // Validação de campos obrigatórios (Ex: Nome, Endereço e UF não podem ser vazios)
    const camposObrigatoriosPreenchidos = 
					descAtual.trim().length > 0  && 
					categoriaAtual !== undefined && 
					categoriaAtual !== null  && 
					vendaAtual > 0 && 
					vendaAtual !== null;       
	
    if (contexto === "ADICIONAR") {
        return camposObrigatoriosPreenchidos;
    }

    // No modo EDIÇÃO, verificamos se algo mudou
    const houveMudanca = 
			descAtual !== descOriginal ||
			vendaAtual !== vendaOriginal ||
			obsAtual !== obsOriginal ||
			categoriaAtual !== categoriaOriginal;
	
	// Criamos uma lista de todos os campos para debugar de uma vez
 const camposParaChecar = [
   { nome: "DESC", atual: descAtual, original: descOriginal },
   { nome: "VENDA", atual: vendaAtual, original: vendaOriginal },
   { nome: "OBS", atual: obsAtual, original: obsOriginal },
   { nome: "CATEGORIA", atual: categoriaAtual, original: categoriaOriginal }
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