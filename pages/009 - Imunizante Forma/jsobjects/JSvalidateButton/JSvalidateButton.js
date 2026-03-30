export default {
	// 1. Verifica se houve mudanças e se os campos obrigatórios estão preenchidos
	podeSalvar: () => {
		const action = appsmith.store.modalContexto?.acaoTipo;
		const descAtual = InputDescricao.text;
		const descOriginal = TableImutipo.selectedRow.imun004_desc || "";

		// Validação básica: Descrição não pode ser vazia
		const temConteudo = descAtual.trim().length > 0;

		if (action === "ADICIONAR") {
			return temConteudo; // Habilita se tiver texto
		} else {
			// Habilita se tiver texto E for diferente do original
			return temConteudo && descAtual !== descOriginal;
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
		resetWidget("InputID", true); // Reset o ID também, se necessário

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

// 1. Função que checa se o que está no input é diferente da tabela
	temAlteracao: () => {
		const contexto = appsmith.store.modalContexto?.acaoTipo;
		const descAtual = (InputDescricao.text || "").trim().toUpperCase();
		const descOriginal = (TableImutipo.selectedRow?.imun004_desc || "").trim().toUpperCase();

		if (contexto === "ADICIONAR") {
			return descAtual.length > 0; // Habilita se tiver digitado algo
		}

		// No modo edição, habilita se o texto for diferente do que está na tabela
		return descAtual.length > 0 && descAtual !== descOriginal;
	},	
}