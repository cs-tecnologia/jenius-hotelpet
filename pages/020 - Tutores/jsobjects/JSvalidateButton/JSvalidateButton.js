export default {
	// 1. Centralizador de Dados (Limpa e padroniza tudo em um único lugar)
	getFormData: () => {
		const row = TableTutor.selectedRow || {};
		
		// Função auxiliar para limpar apenas números (CPF, CEP, Telefone)
		const cleanNum = (val) => (val || "").toString().replace(/\D/g, "");
		// Função auxiliar para texto padrão (Trim + Upper)
		const cleanTxt = (val) => (val || "").toString().trim().toUpperCase();

		return {
			atual: {
				prop001_nome:        cleanTxt(InputNome.text),
				prop001_endereco:    cleanTxt(InputEndereco.text),
				prop001_bairro:      cleanTxt(InputBairro.text),
				prop001_numero:      cleanTxt(InputNumero.text),
				prop001_complemento: cleanTxt(InputComplemento.text),
				prop001_cidade:      cleanTxt(InputCidade.text),
				prop001_email:       (InputEmail.text || "").trim().toLowerCase(),
				prop001_uf:          cleanTxt(SelectUF.selectedOptionValue),
				prop001_observacao:  cleanTxt(InputObservacao.text),
				prop001_telefone:    cleanNum(PhoneInput1Telefone.text),
				prop001_celular:     cleanNum(PhoneInput1Celular.text),
				prop001_cep:         cleanNum(InputCep.text),
				prop001_rg:          cleanTxt(InputRG.text),
				prop001_cpf:         cleanNum(InputCPF.text)
			},
			original: {
				prop001_nome:        cleanTxt(row.prop001_nome),
				prop001_endereco:    cleanTxt(row.prop001_endereco),
				prop001_bairro:      cleanTxt(row.prop001_bairro),
				prop001_numero:      cleanTxt(row.prop001_numero),
				prop001_complemento: cleanTxt(row.prop001_complemento),
				prop001_cidade:      cleanTxt(row.prop001_cidade),
				prop001_email:       (row.prop001_email || "").trim().toLowerCase(),
				prop001_uf:          cleanTxt(row.prop001_uf),
				prop001_observacao:  cleanTxt(row.prop001_observacao),
				prop001_telefone:    cleanNum(row.prop001_telefone),
				prop001_celular:     cleanNum(row.prop001_celular),
				prop001_cep:         cleanNum(row.prop001_cep),
				prop001_rg:          cleanTxt(row.prop001_rg),
				prop001_cpf:         cleanNum(row.prop001_cpf)
			}
		};
	},

	// 2. Verifica se algo mudou
	temAlteracao: () => {
		const data = this.getFormData();
		const campos = Object.keys(data.atual);
		
		const houveMudanca = campos.some(c => data.atual[c] !== data.original[c]);

		if (houveMudanca) {
			campos.forEach(c => {
				if (data.atual[c] !== data.original[c]) {
					console.log(`[TUTOR] Alteração em ${c}: [${data.original[c]}] -> [${data.atual[c]}]`);
				}
			});
		}
		return houveMudanca;
	},

	// 3. Regra de ativação do botão Salvar
	podeSalvar: () => {
		const action = appsmith.store.modalContexto?.acaoTipo;
		const data = this.getFormData().atual;

		const obrigatoriosOk = data.prop001_nome.length > 0 && 
													 data.prop001_uf.length > 0 && 
													 data.prop001_cep.length === 8;

		if (action === "ADICIONAR") return obrigatoriosOk;
		
		return obrigatoriosOk && this.temAlteracao();
	},

	// 4. Regra de ativação do botão Cancelar
	podeCancelar: () => {
		const action = appsmith.store.modalContexto?.acaoTipo;
		if (action === "ADICIONAR") return true;
		return this.temAlteracao();
	},

	// 5. Reset do Formulário
	resetForm: async () => {
		await storeValue("modalContexto", { 
			...appsmith.store.modalContexto, 
			acaoTipo: "EDITAR" 
		});

		const widgets = [
			"InputNome", "InputRG", "InputCPF", "InputCep", "InputEndereco", 
			"InputNumero", "InputComplemento", "InputBairro", "InputCidade", 
			"SelectUF", "InputEmail", "PhoneInput1Telefone", 
			"PhoneInput1Celular", "InputObservacao"
		];

		widgets.forEach(w => resetWidget(w, true));
		
		JSutils.resetInactivityTimer();
		showAlert("Operação cancelada. Registro restaurado.", "info");
	}
}