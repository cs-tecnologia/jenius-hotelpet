export default {
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
		"Input1Observacao"
	],

	irParaPets: async function(linhaTutor) {
		await storeValue('petSelecionado', {});
		await storeValue('modalContexto', {
			...appsmith.store.modalContexto,
			tutorID: linhaTutor.prop001_id,
			tutorNome: linhaTutor.prop001_nome 
		});

		const pets = await SelectPets.run();
		if (pets && pets.length > 0) {
			await storeValue('petSelecionado', pets[0]);
		}
		await storeValue("telaAtiva", "PETS");
	},

	cancelarOperacao: function() {
		closeModal("ModalConfirmation");
		this.modalconfig = { action: "Delete" };
	},

	resetAllWidgets: function() {
		this.widgetsPet.forEach(w => resetWidget(w, true));
		storeValue("telaAtiva", "PETS");
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
					
					if (idParaSincronizar) {
						// AGORA A FUNÇÃO EXISTE ABAIXO E NÃO DARÁ ERRO
						await this.vincularParticularidades(idParaSincronizar);
					} else {
						throw new Error("O banco não retornou o ID do novo Pet.");
					}
				} else if (action === "Update") {
					idParaSincronizar = appsmith.store.petSelecionado?.ani002_id;
				}

				const novosDados = await SelectPets.run();
				await SelectPetsCount.run();

				if (idParaSincronizar) {
					const petSincronizado = novosDados.find(p => p.ani002_id == idParaSincronizar);
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

	showModal(config) {
		this.modalconfig = config;
		return showModal("ModalConfirmation");
	},
	
	abrirParticularidades: async function() {
		await storeValue("petID_Particularidades", appsmith.store.petSelecionado?.ani002_id);
		showModal("ModalParticularidades");
	},

	// ADICIONE ESTA FUNÇÃO PARA CORRIGIR O LINTING ERROR
	vincularParticularidades: async function(idPet) {
		try {
			// Aqui você coloca a lógica para inserir as particularidades padrão do Pet 
			// Ou apenas um log se ainda for implementar a query
			console.log("Vinculando particularidades para o Pet ID:", idPet);
			
			// Exemplo: se você tiver uma query que insere automáticos:
			// await InsertParticularidadesPadrao.run({ petId: idPet });
			
			return true;
		} catch (e) {
			console.error("Erro ao vincular particularidades:", e);
			return false;
		}
	}
}