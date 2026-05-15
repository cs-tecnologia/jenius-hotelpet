export default {
	modalconfig: {
		action: "Delete",
		message: "",
		row: {},
		icon: "plus",
		color: "blue"
	},

	// Widgets específicos do Modal de Amigos
	widgetsAMIGOS: [
		"Input1IDConveniencia", "InputDescConvivencia", "Select1Convivencia", "Switch1Convivencia"
	],

	cancelarOperacao: function() {
		closeModal("ModalConfirmation");
		this.modalconfig = { action: "Delete" };
	},

	resetAllWidgets: function() {
		// Corrigido: widgetsAMIGOS e forEach sem espaço
		this.widgetsAMIGOS.forEach(w => resetWidget(w, true));
	},

	async executeAction() {
		const config = this.modalconfig || { action: "Delete" };
		const action = config.action;
		
		const actionsMap = {
			"Insert": InsertPetAmigos,
			"Update": UpdatePetAmigos,
			"Delete": DeletePetAmigos
		};

		const targetQuery = actionsMap[action];

		if (targetQuery) {
			try {
				const queryResponse = await targetQuery.run(config.row);
				
				let idParaSincronizar;
				
				if (action === "Insert") {
					idParaSincronizar = queryResponse?.[0]?.amigo001_id || queryResponse?.amigo001_id;
				} else {
					idParaSincronizar = config.row?.amigo001_id;
				}

				const novosDados = await SelectPetAmigos.run();

				if (idParaSincronizar) {
					const registroSincronizado = novosDados.find(p => p.amigo001_id == idParaSincronizar);
					if (registroSincronizado) {
						await storeValue('amigoSelecionado', registroSincronizado);
					}
				}

				if (action !== "Update") {
					this.resetAllWidgets();
				}

				closeModal("ModalConfirmation");
				showAlert(`Amigo: ${action === 'Insert' ? 'Incluído' : action === 'Update' ? 'Atualizado' : 'Excluído'} com sucesso!`, "success");

			} catch (err) {
				showAlert(`Erro ao realizar ${action}: ` + err.message, "error");
			}
		}
	},

	showModal(config) {
		this.modalconfig = config;
		return showModal("ModalConfirmation");
	},
	
	abrirAmigos: async function() {
		// 1. Pega o ID do animal que está selecionado na tabela principal de ANIMAIS
		// Ajuste 'TableAnimais' para o nome correto da sua tabela de pets
		const petID = Input1id.text;
		
		if (!petID) {
			return showAlert("Selecione um pet primeiro!", "warning");
		}

		await storeValue("petID_Amigos", petID);

		await storeValue('modalContexto', {
			entidade: 'AMIGO', 
			acaoTipo: "EDITAR",
			acaoBotao: "ATUALIZAR"
		});
		
		await storeValue('amigoSelecionado', {});
		await SelectPetAmigos.run();
		
		showModal("ModalConvivencia");
	}
}