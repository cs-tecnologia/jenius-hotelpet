export default {
	modalconfig: {
		action: "Delete",
		message: "",
		row: {},
		icon: "plus",
		color: "blue"
	},

	// Lista centralizada de widgets para reset (Formulário do Tutor)
	widgetsTutor: [
		"InputNome", "InputID", "InputRG", "InputCPF", "InputCEP", 
		"InputEndereco", "InputNumero", "InputComplemento", "InputBairro", 
		"InputCidade", "SelectUF", "InputEmail", "PhoneInput1Telefone", 
		"PhoneInput1Celular", "InputObservacao"
	],

	// Função auxiliar para resetar todos os campos do Tutor
	resetAllWidgets: function() {
		this.widgetsTutor.forEach(w => resetWidget(w, true));
		// Caso queira resetar a query da API ViaCep também:
		resetWidget("ApiViaCep", true);
	},

	async executeAction() {
		const action = this.modalconfig.action;
		const actionsMap = {
			"Insert": InsertTutor,
			"Update": UpdateTutor,
			"Delete": DeleteTutor
		};

		const targetQuery = actionsMap[action];

		if (targetQuery) {
			try {
				await targetQuery.run();
				showAlert(`${action} realizado com sucesso!`, "success");
				
				closeModal("ModalConfirmation");

				// Se for INCLUSÃO (Insert), mudamos o contexto para EDITAR
				if (action === "Insert") {
					await storeValue('modalContexto', {
						...appsmith.store.modalContexto,
						acaoTipo: "EDITAR"
					});
				}

				// Atualiza os dados da tabela e contadores
				await SelectTutorCount.run(); 
				await SelectTutor.run(); 
				
				// Limpa/Restaura os widgets
				this.resetAllWidgets();

			} catch (err) {
				showAlert("Erro ao processar " + action + ": " + err.message, "error");
			}
		}
	},

	async cancelarOperacao() {
		closeModal("ModalConfirmation");

		// Garante que o contexto volte para EDITAR
		await storeValue('modalContexto', {
			...appsmith.store.modalContexto,
			acaoTipo: "EDITAR"
		});

		// Restaura os valores originais da linha selecionada
		this.resetAllWidgets();

		showAlert("Alterações descartadas.", "info");
	},

	showModal(config) {
		this.modalconfig = config;
		showModal("ModalConfirmation");
	}
}