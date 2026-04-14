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

	// Função para navegar do Tutor para os Pets
	irParaPets: async function(linhaTutor) {
    // 1. Limpa seleções anteriores
    await storeValue('petSelecionado', {});

    // 2. Seta o Tutor clicado
    await storeValue('modalContexto', {
        ...appsmith.store.modalContexto,
        tutorID: linhaTutor.prop001_id,
        tutorNome: linhaTutor.prop001_nome 
    });

    // 3. Busca os dados
    const pets = await SelectPets.run();

    // 4. Seleciona o primeiro pet se ele existir
    if (pets && pets.length > 0) {
        await storeValue('petSelecionado', pets[0]);
    }

    // 5. Só agora muda de tela
    await storeValue("telaAtiva", "PETS");
},

	cancelarOperacao: function() {
		// Fecha o modal e limpa a configuração temporária
		closeModal("ModalConfirmation");
		this.modalconfig = { action: "Delete" };
	},

	resetAllWidgets: function() {
		this.widgetsPet.forEach(w => resetWidget(w, true));
		// Se estiver usando containers, o storeValue abaixo garante a tela correta
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

	showModal(config) {
		this.modalconfig = config;
		return showModal("ModalConfirmation");
	}
}