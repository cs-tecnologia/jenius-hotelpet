export default {
	getFormData: () => {
		const row = appsmith.store.petSelecionado || {};
		
		const getW = (w) => {
			const val = (w?.text !== undefined ? w.text : w?.selectedOptionValue);
			return (val === null || val === undefined) ? "" : val.toString().trim();
		};

		const getDb = (val) => {
			if (val === null || val === undefined) return "";
			return val.toString().trim();
		};

		const formatDate = (date) => {
			return (date && moment(date).isValid()) ? moment(date).format("YYYY-MM-DD") : "";
		};

		return {
			atual: {
				ani002_imagem: (ImagePet.image || "").trim(),
				ani002_nome: getW(Input1Nome),
				ani002_datanasc: formatDate(DatePicker1Nascimento.selectedDate),
				ani002_registro: getW(Input3Registro),
				ani002_microchip: getW(Input3Microchip),
				ani002_data_obito: formatDate(DatePicker1Obito.selectedDate),
				ani002_tipo: getW(Select1Especie),
				ani002_raca: getW(Select1Raca),
				ani002_sexo: getW(Select1Sexo),
				ani002_castrado: getW(Select1Castrado),
				ani002_porte: getW(Select1Porte),
				ani002_pelagem: getW(Select1Pelagem),
				ani002_cor: getW(Select1Cor),
				ani002_temp: getW(Select1Temperamento),
				ani002_convivio: getW(Select1Convivio),
				ani002_vet: getW(Select1Veterinario),
				ani002_clinica: getW(Select1Clinica),
				ani002_canil: getW(Input1Canil),
				ani002_registro_pedigree: getW(Input1Pedigree),
				ani002_nome_registro: getW(Input1PedigreeNome),
				ani002_observacao: getW(Input1Observacao)
			},
			original: {
				ani002_imagem: getDb(row.ani002_imagem),
				ani002_nome: getDb(row.ani002_nome),
				ani002_datanasc: formatDate(row.ani002_datanasc),
				ani002_registro: getDb(row.ani002_registro),
				ani002_microchip: getDb(row.ani002_microchip),
				ani002_data_obito: formatDate(row.ani002_data_obito),
				ani002_tipo: getDb(row.ani002_tipo),
				ani002_raca: getDb(row.ani002_raca),
				ani002_sexo: getDb(row.ani002_sexo),
				ani002_castrado: getDb(row.ani002_castrado),
				ani002_porte: getDb(row.ani002_porte),
				ani002_pelagem: getDb(row.ani002_pelagem),
				ani002_cor: getDb(row.ani002_cor),
				ani002_temp: getDb(row.ani002_temp),
				ani002_convivio: getDb(row.ani002_convivio),
				ani002_vet: getDb(row.ani002_vet),
				ani002_clinica: getDb(row.ani002_clinica),
				ani002_canil: getDb(row.ani002_canil),
				ani002_registro_pedigree: getDb(row.ani002_registro_pedigree),
				ani002_nome_registro: getDb(row.ani002_nome_registro),
				ani002_observacao: getDb(row.ani002_observacao)
			}
		};
	},

	temAlteracaoPET: function() {
		const data = this.getFormData();
		const campos = Object.keys(data.atual);
		return campos.some(campo => data.atual[campo] !== data.original[campo]);
	},

	podeSalvarPET: function() {
		const action = appsmith.store.modalContexto?.acaoTipo;
		const data = this.getFormData().atual;
		const obrigatoriosOk = data.ani002_nome.length > 0 && data.ani002_datanasc !== "";
		
		if (action === "ADICIONAR") return obrigatoriosOk;
		return obrigatoriosOk && this.temAlteracaoPET();
	},

	podeCancelarPET: function() {
		const action = appsmith.store.modalContexto?.acaoTipo;
		if (action === "ADICIONAR") return true;
		return this.temAlteracaoPET();
	},

	resetFormPET: async function() {
		// Lista de widgets para resetar
		const widgets = [
			"ImagePet", "Input1Nome", "DatePicker1Nascimento", "Input3Registro", 
			"Input3Microchip", "Select1Especie", "Select1Raca", "Select1Sexo"
		];
		widgets.forEach(w => resetWidget(w, true));
		
		// Volta o contexto para EDITAR se estiver cancelando uma edição
		await storeValue("modalContexto", { 
			...appsmith.store.modalContexto, 
			acaoTipo: "EDITAR" 
		});
		
		showAlert("Formulário resetado", "info");
	}
};