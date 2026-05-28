export default {
	modalconfig: {
		action: "Delete",
		message: "",
		row: {},
		icon: "plus",
		color: "blue"
	},

async executeAction() {
    const action = this.modalconfig.action;
    const actionsMap = {
        "Insert": InsertVeterinario,
        "Update": UpdateVeterinario,
        "Delete": DeleteVeterinario
    };

    const targetQuery = actionsMap[action];

    if (targetQuery) {
        return targetQuery.run()
            .then(async () => {
                showAlert(`${action} realizado com sucesso!`, "success");

                closeModal("ModalConfirmation");

                if (action === "Insert") {
                    await storeValue('modalContexto', {
                        ...appsmith.store.modalContexto,
                        acaoTipo: "EDITAR"
                    });
                }

                await Promise.all([SelectVeterinarioCount.run(), SelectVeterinario.run()]);

								resetWidget("InputNome", true);
								resetWidget("InputID", true);
								resetWidget("InputCRMV", true);
								resetWidget("InputCep", true);
								resetWidget("InputEndereco", true);
								resetWidget("InputNumero", true);
								resetWidget("InputComplemento", true);
								resetWidget("InputBairro", true);
								resetWidget("InputCidade", true);
								resetWidget("SelectUF", true);
								resetWidget("InputEmail", true);
								resetWidget("InputTelefone", true);
								resetWidget("InputCelular", true);
								resetWidget("SelectClinica", true);
								resetWidget("ApiViaCep", true);
            })
            .catch((err) => showAlert("Erro: " + err.message, "error"));
    }
},

async cancelarOperacao() {
    closeModal("ModalConfirmation");

    await storeValue('modalContexto', {
        ...appsmith.store.modalContexto,
        acaoTipo: "EDITAR"
    });

								resetWidget("InputNome", true);
								resetWidget("InputID", true);
								resetWidget("InputCRMV", true);
								resetWidget("InputCep", true);
								resetWidget("InputEndereco", true);
								resetWidget("InputNumero", true);
								resetWidget("InputComplemento", true);
								resetWidget("InputBairro", true);
								resetWidget("InputCidade", true);
								resetWidget("SelectUF", true);
								resetWidget("InputEmail", true);
								resetWidget("InputTelefone", true);
								resetWidget("InputCelular", true);
								resetWidget("SelectClinica", true);
								resetWidget("ApiViaCep", true);

    showAlert("Alterações descartadas.", "info");
	},

	showModal(config) {
		this.modalconfig = config;
		showModal("ModalConfirmation");
	}
}
