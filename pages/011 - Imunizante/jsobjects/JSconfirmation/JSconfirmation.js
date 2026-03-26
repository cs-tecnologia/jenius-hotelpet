export default {
	modalconfig: {
		action: "Delete", // Pode ser "Insert", "Update", "Delete", etc.
		message: "",
		row: {},
		icon: "plus",
		color: "blue"
	},

async executeAction() {
    const action = this.modalconfig.action;
    const actionsMap = {
        "Insert": InsertImunizante,
        "Update": UpdateImunizante,
        "Delete": DeleteImunizante
    };

    const targetQuery = actionsMap[action];

    if (targetQuery) {
        return targetQuery.run()
            .then(async () => {
                showAlert(`${action} realizado com sucesso!`, "success");
                
                // 1. Fecha o modal de confirmação
                closeModal("ModalConfirmation");

                // 2. SE FOR INCLUSÃO, mudamos o contexto para EDITAR
                // Isso garante que os campos parem de vir em branco ("") 
                // e passem a olhar para a TableAlimentos.selectedRow
                if (action === "Insert") {
                    await storeValue('modalContexto', {
                        ...appsmith.store.modalContexto,
                        acaoTipo: "EDITAR"
                    });
                }

                // 3. Atualiza os dados da tabela
                // O await aqui é crucial para garantir que a tabela tenha os dados novos
                await SelectImunizanteCount.run(); 
                await SelectImunizante.run(); 
                
                // 4. Resetamos os widgets. 
                // Agora, como o acaoTipo é EDITAR, o Default Value do Input 
                // vai carregar automaticamente o que estiver selecionado na tabela.
								resetWidget("InputNome", true); // Descomente se esses widgets existirem nesta página
								resetWidget("InputID", true); // Reset o ID também, se necessário
								resetWidget("InputCEP", true);
								resetWidget("InputEndereco", true);
								resetWidget("InputNumero", true);
								resetWidget("InputComplemento", true);
								resetWidget("InputBairro", true);
								resetWidget("InputCidade", true);
								resetWidget("SelectUF", true);
								resetWidget("InputContato", true);
								resetWidget("InputEmail", true);					
								resetWidget("InputTelefone", true);					
								resetWidget("InputCelular", true);				
								resetWidget("InputContato", true);		
								resetWidget("ApiViaCep", true);
            })
            .catch((err) => showAlert("Erro: " + err.message, "error"));
    }
},

async cancelarOperacao() {
    // 1. Fecha o modal de confirmação
    closeModal("ModalConfirmation");

    // 2. Voltamos o contexto para "EDITAR" para que os inputs 
    // voltem a mostrar o que está selecionado na tabela
    await storeValue('modalContexto', {
        ...appsmith.store.modalContexto,
        acaoTipo: "EDITAR"
    });

    // 3. Resetamos os widgets para limparem o que o usuário digitou
								resetWidget("InputNome", true); // Descomente se esses widgets existirem nesta página
								resetWidget("InputID", true); // Reset o ID também, se necessário
								resetWidget("InputCEP", true);
								resetWidget("InputEndereco", true);
								resetWidget("InputNumero", true);
								resetWidget("InputComplemento", true);
								resetWidget("InputBairro", true);
								resetWidget("InputCidade", true);
								resetWidget("SelectUF", true);
								resetWidget("InputContato", true);
								resetWidget("InputEmail", true);					
								resetWidget("InputTelefone", true);					
								resetWidget("InputCelular", true);				
								resetWidget("InputContato", true);
								resetWidget("ApiViaCep", true);

    showAlert("Alterações descartadas.", "info");
	},
	
	showModal(config) {
		this.modalconfig = config;
		showModal("ModalConfirmation");
	}
}