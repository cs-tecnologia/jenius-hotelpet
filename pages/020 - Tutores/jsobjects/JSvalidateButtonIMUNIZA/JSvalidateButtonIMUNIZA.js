export default {
	// 1. Verifica se houve mudanças e se os campos obrigatórios estão preenchidos
podeSalvarIMUNIZA: () => {
    const action = appsmith.store.modalContexto?.acaoTipo;
    const row = Table1Imuniza.selectedRow || {}; // Proteção caso a linha suma

    // --- Valores Atuais (Limpando no ato da captura) ---
		const observacaoAtual = InputDescImuniza.text || "";
		const permitidoAtual = !!Switch1Imuniza.isSwitchedOn;

    // --- Valores Originais (Protegendo contra nulos) ---
    const observacaoOriginal = Table1Imuniza.selectedRow.amigo001_observacao || "";
    const permitidoOriginal = !!Table1Imuniza.selectedRow.amigo001_permitido;
    
    // 1. Validação de preenchimento obrigatório
    const camposPreenchidos = observacaoAtual.trim().length > 0 && permitidoAtual !== undefined;

    if (action === "ADICIONAR") {
        return camposPreenchidos;
    } else {
        // 2. Comparação direta (mais limpa)
		
        const houveMudanca = 
				observacaoAtual !== observacaoOriginal ||
				permitidoAtual !== permitidoOriginal;
				
        return camposPreenchidos && houveMudanca;
    }
},
	
// 2. Função para o botão CANCELAR refatorada
	resetFormIMUNIZA: async () => {
		// 1. Mudamos o estado de volta para "Visualizar/Editar" 
		// Isso faz com que o Default Value do Input aponte para a Table1Imuniza.selectedRow
		await storeValue("modalContexto", { 
			...appsmith.store.modalContexto, 
			acaoTipo: "EDITAR" 
		});

		// 2. Resetamos o widget. Agora ele vai ler o Default Value novo (da linha selecionada)
		resetWidget("Input1IDImuniza", true);
		resetWidget("InputDescImuniza", true);
		resetWidget("Select1Imuniza", true);
		resetWidget("Switch1Imuniza", true);
		
		// 3. Reiniciamos o cronômetro de inatividade (pois o usuário interagiu com o botão)
		JSutils.resetInactivityTimer();
		
		showAlert("Operação cancelada. Retornando ao registro selecionado.", "info");
	},
	
// Nova função para o botão CANCELAR
podeCancelarIMUNIZA: () => {
    const action = appsmith.store.modalContexto?.acaoTipo;
    
    // Chamamos a função de verificação de mudanças que já criamos
    // Importante: use o nome do seu JSObject antes do ponto
    const houveAlteracao = JSvalidateButtonAMIGO.temAlteracaoAMIGO(); 

    if (action === "ADICIONAR") {
        // No modo ADICIONAR, o botão sempre funciona (true)
        return true;
    }

    // No modo EDITAR, só funciona se houve alteração (true/false)
    return houveAlteracao;
},

	// 1. Função que checa se o que está no input é diferente da tabela
temAlteracaoIMUNIZA: () => {
    const contexto = appsmith.store.modalContexto?.acaoTipo;
    
    // Dados dos Inputs/Selects (O que o usuário está fazendo agora)
		const observacaoAtual = InputDescImuniza.text || "";
		const permitidoAtual = !!Switch1Imuniza.isSwitchedOn;

    // --- Valores Originais (Protegendo contra nulos) ---
		const observacaoOriginal = Table1Imuniza.selectedRow.amigo001_observacao || "";
		const permitidoOriginal = !!Table1Imuniza.selectedRow.amigo001_permitido;

    // Validação de campos obrigatórios (Ex: Nome, Endereço e UF não podem ser vazios)
    const camposObrigatoriosPreenchidos = 
			observacaoAtual.trim().length > 0  && 
			permitidoAtual !== undefined && 
			permitidoAtual !== null;       
	
    if (contexto === "ADICIONAR") {
        return camposObrigatoriosPreenchidos;
    }

    // No modo EDIÇÃO, verificamos se algo mudou
    const houveMudanca = 
			observacaoAtual !== observacaoOriginal ||
			permitidoAtual !== permitidoOriginal;

	// Criamos uma lista de todos os campos para debugar de uma vez
 const camposParaChecar = [
   { nome: "Obs", atual: observacaoAtual, original: observacaoOriginal },
   { nome: "Permite", atual: permitidoAtual, original: permitidoOriginal }
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

	// 4. Ações de Banco (Delete e Reset)
	deleteIMUNIZA: async function() {
		JSutils.resetInactivityTimer();
		const idExcluir = Table1Imuniza.selectedRow.imun003_id;

		if (!idExcluir) return showAlert("Selecione um registro.", "warning");

		try {
			await DeleteImuniza.run({ imun003_id: idExcluir }); // Nome da query corrigido
			showAlert("Excluído com sucesso!", "success");
			await storeValue('imunizaSelecionado', {});
			await SelectImuniza.run(); // Nome da query de listagem corrigido
		} catch (error) {
			showAlert("Erro ao excluir.", "error");
		}
	}
}