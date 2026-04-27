export default {
	// 1. Centralizador de Captura de Dados
	getFormData: function() {
		const row = appsmith.store.particularidadeSelecionada || {};
		
		return {
			atual: {
				par002_id: Input1ID.text,
				par002_par001_id: Select1Particularidade.selectedOptionValue,
				par002_descricao: (InputDescParticular.text || "").trim().toUpperCase(),
				par002_alerta: Switch1Atencao.isSwitchedOn, 
				par002_ani002_id: appsmith.store.petID_Particularidades
			},
			original: {
				par002_id: String(row.par002_id ?? TableParticularidades.selectedRow?.par002_id ?? ""),
				par002_par001_id: String(row.par002_par001_id ?? TableParticularidades.selectedRow?.par002_par001_id ?? ""),
				par002_descricao: (row.par002_descricao ?? TableParticularidades.selectedRow?.par002_descricao ?? "").trim().toUpperCase(),
				par002_alerta: (row.par002_alerta === 'S' || row.par002_alerta === true || TableParticularidades.selectedRow?.par002_alerta === 'S')
			}
		};
	},

	// 2. Verifica se houve mudanças
	temAlteracaoPART: function() {
		const data = this.getFormData();
		const a = data.atual;
		const o = data.original;

		if (appsmith.store.modalContexto?.acaoTipo === "ADICIONAR") {
			return a.par002_descricao.length > 0 || a.par002_par001_id;
		}

		return (
			String(a.par002_id) !== String(o.par002_id) ||
			String(a.par002_par001_id) !== String(o.par002_par001_id) ||
			a.par002_descricao !== o.par002_descricao ||
			a.par002_alerta !== o.par002_alerta
		);
	},

	podeSalvarPART: function() {
		const action = appsmith.store.modalContexto?.acaoTipo;
		const data = this.getFormData().atual;
		const obrigatoriosOk = data.par002_par001_id && data.par002_descricao.length > 0;

		if (action === "ADICIONAR") return obrigatoriosOk;
		
		// EDITAR: Precisa dos campos preenchidos E ter mudado algo
		return !!(obrigatoriosOk && this.temAlteracaoPART());
	},
	
	podeCancelarPART: function() {
		const action = appsmith.store.modalContexto?.acaoTipo;
		
		// Se o botão Salvar/Atualizar habilitar, o Cancelar TEM que habilitar junto
		if (this.podeSalvarPART()) return true;

		// Caso especial: Se for ADICIONAR, permitimos cancelar mesmo com form vazio
		if (action === "ADICIONAR") return true;

		return false;
	},
	
deleteParticularidade: async function() {
		// 1. Sinaliza atividade para o sistema
		JSutils.resetInactivityTimer();

		// 2. Pega o ID diretamente da linha selecionada na tabela
		const idExcluir = TableParticularidades.selectedRow?.par002_id;

		if (!idExcluir) {
			return showAlert("Selecione um registro na tabela para excluir.", "warning");
		}

		try {
			// 3. Executa a query de delete enviando o ID via params
			await DeleteParticularidadesPet.run({ 
				par002_id: idExcluir 
			});

			showAlert("Registro excluído com sucesso!", "success");

			// 4. Limpa o store para resetar os botões (Salvar/Cancelar voltarão a ficar cinza)
			await storeValue('particularidadeSelecionada', {});
			
			// 5. Atualiza a tabela
			await SelectParticularidadesPET.run();

		} catch (error) {
			showAlert("Erro ao excluir o registro.", "error");
		}
	},

	// 5. Ação de Reset (Garantindo que a Tabela seja a referência)
	resetFormPART: async function() {
		const action = appsmith.store.modalContexto?.acaoTipo;
		
		// Reseta os widgets para os valores definidos no "Default Value"
		resetWidget("Input1ID", true);
		resetWidget("InputDescParticular", true);
		resetWidget("Select1Particularidade", true);
		resetWidget("Switch1Atencao", true);
		
		// Forçamos o Store a ler os dados da linha selecionada novamente
		// Isso garante que 'Atual' e 'Original' voltem a ser idênticos
		if (action === "EDITAR") {
			await storeValue('particularidadeSelecionada', TableParticularidades.selectedRow);
		} else {
			await storeValue('particularidadeSelecionada', {});
		}
		
		showAlert(action === "ADICIONAR" ? "Campos limpos." : "Alterações descartadas.", "info");
	}
}