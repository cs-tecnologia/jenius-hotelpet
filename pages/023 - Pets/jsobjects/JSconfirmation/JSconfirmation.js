export default {
	modalconfig: {
		action: "Delete",
		message: "",
		row: {},
		icon: "plus",
		color: "blue"
	},

	widgetsPet: [
		"ImagePet", "Input1Nome", "DatePicker1Nascimento",
		"Input2Idade", "Input3Peso", "Input3Registro", "Input3Microchip",
		"DatePicker1Obito", "Select1Especie", "Select1Raca", "Select1Sexo",
		"Select1Castrado", "Select1Porte", "Select1Pelagem", "Select1Cor",
		"Select1Temperamento", "Select1Convivio", "Select1Veterinario",
		"Select1Clinica", "Input1Canil", "Input1Pedigree", "Input1PedigreeNome",
		"Input1Observacao"
	],

	resetAllWidgets: function() {
		this.widgetsPet.forEach(w => resetWidget(w, true));
	},

	async executeAction() {
		const config = this.modalconfig || { action: "Delete" };
		const action = config.action;

		const actionsMap = {
			"Insert": InsertPet,
			"Update": UpdatePet,
			"Delete": DeletePet
		};

		const targetQuery = actionsMap[action];

		if (targetQuery) {
			try {
				const queryResponse = await targetQuery.run();
				let idParaSincronizar;

				if (action === "Insert") {
					idParaSincronizar = queryResponse?.[0]?.ani002_id || queryResponse?.ani002_id;
				} else if (action === "Update") {
					idParaSincronizar = config.row?.ani002_id;
				}

				// Atualiza listas
				await Promise.all([SelectPetsCount.run(), SelectPets.run()]);

				// Sincroniza selecionado
				if (idParaSincronizar) {
					const novosDados = SelectPets.data || [];
					const petSincronizado = novosDados.find(p => p.ani002_id == idParaSincronizar);
					if (petSincronizado) {
						await storeValue('petSelecionado', petSincronizado);
					}
				}

				if (action === "Insert" || action === "Update") {
					await storeValue('modalContexto', {
						...appsmith.store.modalContexto,
						acaoTipo: "EDITAR",
						acaoBotao: "ATUALIZAR"
					});
				}

				if (action !== "Update") {
					this.resetAllWidgets();
				}

				closeModal("ModalConfirmation");
				showAlert(
					`${action === 'Insert' ? 'Incluído' : action === 'Update' ? 'Atualizado' : 'Excluído'} com sucesso!`,
					"success"
				);

				if (action === "Delete") {
					await storeValue('petSelecionado', {});
				}

			} catch (err) {
				showAlert("Erro ao processar " + action + ": " + err.message, "error");
			}
		}
	},

	async cancelarOperacao() {
		closeModal("ModalConfirmation");
		await storeValue('modalContexto', {
			...appsmith.store.modalContexto,
			acaoTipo: "EDITAR",
			acaoBotao: "ATUALIZAR"
		});
		this.resetAllWidgets();
	},

	showModal(config) {
		this.modalconfig = config;
		return showModal("ModalConfirmation");
	}
}
