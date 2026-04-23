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

	// --- FUNÇÃO PARA VINCULAR GRUPOS ---
	async vincularParticularidades(novoPetId) {
			try {
					const grupos = await SelectParticularidades.run();

					if (grupos && grupos.length > 0) {
							// Usamos um loop for...of para garantir que o Appsmith 
							// processe uma query por vez com seus respectivos parâmetros
							for (const grupo of grupos) {
									console.log(`Vinculando Grupo ${grupo.par001_id} ao Pet ${novoPetId}`);

									await InsertParticularidadesPet.run({
											"par001_id": Number(grupo.par001_id),
											"ani002_id": Number(novoPetId)
									});
							}
							console.log("Sucesso: Particularidades vinculadas.");
					}
			} catch (err) {
					console.error("Erro no vínculo: " + err.message);
					throw err; 
			}
	},

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
					// Captura o ID retornado pelo RETURNING ani002_id
					idParaSincronizar = queryResponse?.[0]?.ani002_id || queryResponse?.ani002_id;
					
					console.log("ID Capturado para sincronização:", idParaSincronizar);

					if (idParaSincronizar) {
						// Aguarda a criação dos registros na hotpar002 antes de finalizar
						await this.vincularParticularidades(idParaSincronizar);
					} else {
						throw new Error("O banco não retornou o ID do novo Pet.");
					}
				} else if (action === "Update") {
					idParaSincronizar = appsmith.store.petSelecionado?.ani002_id;
				}

				// Atualiza as listas e contadores na interface
				const novosDados = await SelectPets.run();
				await SelectPetsCount.run();

				// Sincroniza o objeto no Store para garantir que a UI mostre o pet correto
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
				console.error("Erro detalhado:", err);
			}
		}
	},

	showModal(config) {
		this.modalconfig = config;
		return showModal("ModalConfirmation");
	}
}