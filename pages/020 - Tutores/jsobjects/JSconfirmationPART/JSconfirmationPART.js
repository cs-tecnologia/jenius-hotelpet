export default {
	modalconfig: {
		action: "Delete",
		message: "",
		row: {},
		icon: "plus",
		color: "blue"
	},

	// Widgets específicos do Modal de Particularidades
	widgetsPART: [
		"InputID", "InputDescricao", "Select1Particularidade", "Switch1Atencao"
	],

	cancelarOperacao: function() {
		closeModal("ModalConfirmation"); // Fecha o modal de confirmação (o pequeno)
		this.modalconfig = { action: "Delete" };
	},

	resetAllWidgets: function() {
		this.widgetsPART.forEach(w => resetWidget(w, true));
	},

	async executeAction() {
		const config = this.modalconfig || { action: "Delete" };
		const action = config.action;
		
		// Mapeamento para as queries da tabela hotpar002
		const actionsMap = {
			"Insert": InsertParticularidadesPet, // Query de inclusão individual
			"Update": UpdateParticularidadesPet, // Query de edição
			"Delete": DeleteParticularidadesPet  // Query de exclusão (soft delete)
		};

		const targetQuery = actionsMap[action];

		if (targetQuery) {
			try {
				// Executa a query passando a row capturada no botão Salvar
				const queryResponse = await targetQuery.run(config.row);
				
				let idParaSincronizar;
				
				if (action === "Insert") {
					// Captura o ID da nova particularidade (requer RETURNING par002_id)
					idParaSincronizar = queryResponse?.[0]?.par002_id || queryResponse?.par002_id;
				} else {
					idParaSincronizar = config.row?.par002_id;
				}

				// 1. Atualiza a lista de particularidades do modal
				// Certifique-se de que esta query usa o storeValue petID_Particularidades no WHERE
				const novosDados = await SelectParticularidadesPET.run();

				// 2. Sincroniza a particularidade selecionada no Store
				if (idParaSincronizar) {
					const registroSincronizado = novosDados.find(p => p.par002_id == idParaSincronizar);
					if (registroSincronizado) {
						await storeValue('particularidadeSelecionada', registroSincronizado);
					}
				}

				// 3. Limpa widgets se for uma exclusão ou nova inclusão bem sucedida
				if (action !== "Update") {
					this.resetAllWidgets();
				}

				closeModal("ModalConfirmation");
				
				showAlert(`Particularidade: ${action === 'Insert' ? 'Incluída' : action === 'Update' ? 'Atualizada' : 'Excluída'} com sucesso!`, "success");

			} catch (err) {
				showAlert(`Erro ao realizar ${action}: ` + err.message, "error");
				console.error("Erro detalhado PART:", err);
			}
		}
	},

	showModal(config) {
		this.modalconfig = config;
		return showModal("ModalConfirmation");
	},
	
abrirParticularidades: async function() {
		// 1. Garante que o ID do pet esteja no Store para as queries de listagem
		const petID = appsmith.store.petSelecionado?.ani002_id;
		await storeValue("petID_Particularidades", petID);

		// 2. Muda o contexto para Particularidades (Ajustado para 'PART')
		// Isso garante que o Modal de Confirmação use o JSconfirmationPART
		await storeValue('modalContexto', {
			...appsmith.store.modalContexto,
			entidade: 'PART', 
			acaoTipo: "EDITAR",
			acaoBotao: "ATUALIZAR"
		});
		
		// 3. Reseta a particularidade selecionada para começar um formulário limpo
		await storeValue('particularidadeSelecionada', {});
		
		// 4. Roda a query para listar as particularidades deste pet específico
		await SelectParticularidadesPET.run();
		
		// 5. Abre o modal principal de Particularidades
		showModal("ModalParticularidades");
	}
}