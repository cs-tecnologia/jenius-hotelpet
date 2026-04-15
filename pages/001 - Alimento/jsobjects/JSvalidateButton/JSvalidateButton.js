export default {
	// 1. Verifica se houve mudanças e se os campos obrigatórios estão preenchidos
	podeSalvar: () => {
		const action = appsmith.store.modalContexto?.acaoTipo;
		
		// Valores Atuais nos Widgets
		const descAtual = (InputDescricao.text || "").trim();
		const imgAtual = Image1Alimento.image || ""; // URL ou Base64 atual da imagem
		
		// Valores Originais da Tabela
		const descOriginal = (TableAlimentos.selectedRow.ali001_desc || "").trim();
		const imgOriginal = TableAlimentos.selectedRow.ali001_imagem || ""; // Ajuste para o nome da sua coluna de foto

		// Validação obrigatória: Descrição não pode ser vazia
		const temConteudo = descAtual.length > 0;

		if (action === "ADICIONAR") {
			// Habilita se tiver texto OU se tiver selecionado uma imagem/logo
			const temImagemNova = FilePicker1logo.files.length > 0;
			return temConteudo || temImagemNova; 
		} else {
			// Habilita se for válido E (texto mudou OU imagem mudou)
			const textoMudou = descAtual !== descOriginal;
			const imagemMudou = imgAtual !== imgOriginal;
			
			return temConteudo && (textoMudou || imagemMudou);
		}
	},

	// 2. Função para o botão CANCELAR refatorada
	resetForm: async () => {
		await storeValue("modalContexto", { 
			...appsmith.store.modalContexto, 
			acaoTipo: "EDITAR" 
		});

		// Resetamos todos os widgets envolvidos
		resetWidget("InputDescricao", true);
		resetWidget("InputID", true);
		resetWidget("FilePicker1logo", true);
		resetWidget("Image1Alimento", true);
		// O Image1Alimento geralmente reseta sozinho ao resetar o FilePicker ou mudar o row selecionado

		JSutils.resetInactivityTimer();
		showAlert("Operação cancelada.", "info");
	},
	
	// 3. Função para habilitar/desabilitar o botão CANCELAR
	podeCancelar: () => {
		const action = appsmith.store.modalContexto?.acaoTipo;
		// Habilita se estiver no modo ADICIONAR ou se houve qualquer alteração nos campos
		return action === "ADICIONAR" || this.podeSalvar();
	},	

	// 4. Função auxiliar para detectar qualquer alteração (UI/UX)
	temAlteracao: () => {
		const contexto = appsmith.store.modalContexto?.acaoTipo;
		const descAtual = (InputDescricao.text || "").trim().toUpperCase();
		const descOriginal = (TableAlimentos.selectedRow?.ali001_desc || "").trim().toUpperCase();
		
		const imgAtual = Image1Alimento.image || "";
		const imgOriginal = TableAlimentos.selectedRow?.ali001_imagem || "";

		if (contexto === "ADICIONAR") {
			return descAtual.length > 0 || FilePicker1logo.files.length > 0;
		}

		// Modo edição: texto mudou ou imagem mudou
		return (descAtual.length > 0 && descAtual !== descOriginal) || (imgAtual !== imgOriginal);
	},	
}