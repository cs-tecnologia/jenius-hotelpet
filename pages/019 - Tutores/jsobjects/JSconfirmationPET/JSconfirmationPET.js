export default {
	// Inicializamos com valores padrão para evitar o erro de 'undefined'
	modalconfig: {
		action: "Delete",
		message: "",
		row: {},
		icon: "plus",
		color: "blue"
	},

	widgetsPet: [
		"ImagePet", "FilePicker1Pet", "Input1Nome", "DatePicker1Nascimento", 
		"Input2Idade", "Input3Peso", "Input3Registro", "Input3Microchip", 
		"DatePicker1Obito", "Select1Especie", "Select1Raca", "Select1Sexo", 
		"Select1Castrado", "Select1Porte", "Select1Pelagem", "Select1Cor", 
		"Select1Temperamento", "Select1Convivio", "Select1Veterinario", 
		"Select1Clinica", "Input1Canil", "Input1Pedigree", "Input1PedigreeNome", 
		"Input1Observacao", "Input1Cuidados", "Input1Saude", "Input1Tosa"
	],

	resetAllWidgets: function() {
		this.widgetsPet.forEach(w => resetWidget(w, true));
		storeValue("abaAtiva", "Pets");
	},

	async executeAction() {
		// Proteção: se por algum motivo for undefined, usamos um fallback
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
				const novosDados = await SelectPets.run();
				await SelectPetsCount.run();

				let idParaSincronizar;
				if (action === "Update") {
					idParaSincronizar = appsmith.store.petSelecionado?.ani002_id;
				} else if (action === "Insert") {
					idParaSincronizar = queryResponse?.[0]?.ani002_id || novosDados?.[0]?.ani002_id;
				}

				if (idParaSincronizar) {
					const petSincronizado = novosDados.find(p => p.ani002_id === idParaSincronizar);
					if (petSincronizado) {
						await storeValue('petSelecionado', petSincronizado);
					}
				}

				if (action === "Insert" || action === "Update") {
					await storeValue('modalContexto', {
						...appsmith.store.modalContexto,
						acaoTipo: "EDITAR"
					});
				}

				this.resetAllWidgets(); 
				closeModal("ModalConfirmation");
				
				showAlert(`${action === 'Insert' ? 'Inclusão' : action === 'Update' ? 'Atualização' : 'Exclusão'} realizada com sucesso!`, "success");

			} catch (err) {
				showAlert(`Erro ao realizar ${action}: ` + err.message, "error");
			}
		}
	},

	// Restante das funções (cancelarOperacao, showModal)...
	showModal(config) {
		this.modalconfig = config;
		return showModal("ModalConfirmation");
	}
}