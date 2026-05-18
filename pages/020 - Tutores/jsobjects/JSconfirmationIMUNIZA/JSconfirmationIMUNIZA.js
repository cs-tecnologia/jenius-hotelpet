export default {
	modalconfig: {
		action: "Delete",
		message: "",
		row: {},
		icon: "plus",
		color: "blue"
	},

	// Widgets específicos do Modal de Imunização
	widgetsIMUNIZA: [
		"Input1IDImuniza", 
		"InputDescImuniza", 
		"Select1Imuniza", 
		"Switch1Imuniza"
	],

	cancelarOperacao: function() {
		closeModal("ModalConfirmation");
		this.modalconfig = { action: "Delete" };
	},

	resetAllWidgets: function() {
		// Corrigido para usar a lista correta e sem espaços no forEach
		this.widgetsIMUNIZA.forEach(w => resetWidget(w, true));
	},

	async executeAction() {
		const config = this.modalconfig || { action: "Delete" };
		const action = config.action;
		
		// Certifique-se que esses nomes de queries existam no seu painel esquerdo
		const actionsMap = {
			"Insert": InsertImuniza,
			"Update": UpdateImuniza,
			"Delete": DeleteImuniza
		};

		const targetQuery = actionsMap[action];

		if (targetQuery) {
			try {
				// config.row contém os dados passados pelo botão salvar/deletar
				const queryResponse = await targetQuery.run(config.row);
				
				let idParaSincronizar;
				
				if (action === "Insert") {
					// Pega o ID retornado pelo banco (hotimun003 usa imun003_id)
					idParaSincronizar = queryResponse?.[0]?.imun003_id || queryResponse?.imun003_id;
				} else {
					idParaSincronizar = config.row?.imun003_id;
				}

				// Atualiza a lista da tabela
				const novosDados = await SelectImuniza.run();

				// Sincroniza a seleção visual
				if (idParaSincronizar) {
					const registroSincronizado = novosDados.find(p => p.imun003_id == idParaSincronizar);
					if (registroSincronizado) {
						await storeValue('imunizaSelecionado', registroSincronizado);
						await storeValue('idSelecionadoIMUN', idParaSincronizar);
					}
				}

				if (action !== "Update") {
					this.resetAllWidgets();
				}

				closeModal("ModalConfirmation");
				showAlert(`Imunização: ${action === 'Insert' ? 'Incluída' : action === 'Update' ? 'Atualizada' : 'Excluída'} com sucesso!`, "success");

			} catch (err) {
				showAlert(`Erro ao realizar ${action}: ` + err.message, "error");
			}
		}
	},

	showModal(config) {
		this.modalconfig = config;
		return showModal("ModalConfirmation");
	},
	
	abrirIMUNIZA: async function() {
		// 1. Pega o ID do animal do Input ou da Tabela principal
		const petID = Input1id.text || TableAnimais.selectedRow?.ani002_id;
		
		if (!petID) {
			return showAlert("Selecione um pet primeiro!", "warning");
		}

		// 2. Salva no store para a query SelectImuniza usar no WHERE
		await storeValue("petID_Amigos", petID); 

		// 3. Define contexto
		await storeValue('modalContexto', {
			entidade: 'IMUNIZA',
			acaoTipo: "EDITAR",
			acaoBotao: "ATUALIZAR"
		});
		
		// 4. Limpa seleções anteriores e carrega dados
		await storeValue('imunizaSelecionado', {});
		await storeValue('idSelecionadoIMUN', undefined);
		
		await SelectImuniza.run();
		
		// 5. Abre o modal (Certifique-se que o nome do modal é este)
		showModal("ModalImuniza");
	}
}