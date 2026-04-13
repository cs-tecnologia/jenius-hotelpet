export default {
	// 1. Centralizador de Captura de Dados
	getFormData: () => {
		// MUDANÇA CHAVE: Agora olhamos para o Store, que é nossa fonte da verdade
		const row = appsmith.store.petSelecionado || {};
		
		// Helper para capturar valores de widgets de forma limpa
		const getW = (w) => (w?.text || w?.selectedOptionValue || "").toString().trim();

		return {
			atual: {
				ani002_imagem:            (ImagePet.image || "").trim(),
				ani002_nome:              getW(Input1Nome),
				ani002_datanasc:          DatePicker1Nascimento.selectedDate ? moment(DatePicker1Nascimento.selectedDate).format("YYYY-MM-DD") : "",
				ani002_registro:          getW(Input3Registro),
				ani002_microchip:         getW(Input3Microchip),
				ani002_data_obito:        DatePicker1Obito.selectedDate ? moment(DatePicker1Obito.selectedDate).format("YYYY-MM-DD") : "",
				ani002_tipo:              Select1Especie.selectedOptionValue || "",
				ani002_raca:              Select1Raca.selectedOptionValue || "",
				ani002_sexo:              Select1Sexo.selectedOptionValue || "",
				ani002_castrado:          Select1Castrado.selectedOptionValue || "",
				ani002_porte:             Select1Porte.selectedOptionValue || "",
				ani002_pelagem:           Select1Pelagem.selectedOptionValue || "",
				ani002_cor:               Select1Cor.selectedOptionValue || "",
				ani002_temp:              Select1Temperamento.selectedOptionValue || "",
				ani002_convivio:          Select1Convivio.selectedOptionValue || "",
				ani002_vet:               Select1Veterinario.selectedOptionValue || "",
				ani002_clinica:           Select1Clinica.selectedOptionValue || "",
				ani002_canil:             getW(Input1Canil),
				ani002_registro_pedigree: getW(Input1Pedigree),
				ani002_nome_registro:     getW(Input1PedigreeNome),
				ani002_observacao:        getW(Input1Observacao),
				ani002_cuidados:          getW(Input1Cuidados),
				ani002_saude:             getW(Input1Saude),
				ani002_tosa:              getW(Input1Tosa)
			},
			original: {
				ani002_imagem:            (row.ani002_imagem || ""),
				ani002_nome:              (row.ani002_nome || "").toString().trim(),
				ani002_datanasc:          row.ani002_datanasc ? moment(row.ani002_datanasc).format("YYYY-MM-DD") : "",
				ani002_registro:          (row.ani002_registro || "").toString().trim(),
				ani002_microchip:         (row.ani002_microchip || "").toString().trim(),
				ani002_data_obito:        row.ani002_data_obito ? moment(row.ani002_data_obito).format("YYYY-MM-DD") : "",
				ani002_tipo:              row.ani002_tipo || "",
				ani002_raca:              row.ani002_raca || "",
				ani002_sexo:              row.ani002_sexo || "",
				ani002_castrado:          row.ani002_castrado || "",
				ani002_porte:             row.ani002_porte || "",
				ani002_pelagem:           row.ani002_pelagem || "",
				ani002_cor:               row.ani002_cor || "",
				ani002_temp:              row.ani002_temp || "",
				ani002_convivio:          row.ani002_convivio || "",
				ani002_vet:               row.ani002_vet || "",
				ani002_clinica:           row.ani002_clinica || "",
				ani002_canil:             (row.ani002_canil || "").toString().trim(),
				ani002_registro_pedigree: (row.ani002_registro_pedigree || "").toString().trim(),
				ani002_nome_registro:     (row.ani002_nome_registro || "").toString().trim(),
				ani002_observacao:        (row.ani002_observacao || "").toString().trim(),
				ani002_cuidados:          (row.ani002_cuidados || "").toString().trim(),
				ani002_saude:             (row.ani002_saude || "").toString().trim(),
				ani002_tosa:              (row.ani002_tosa || "").toString().trim()
			}
		};
	},

	temAlteracaoPET: function() {
		const data = this.getFormData();
		const campos = Object.keys(data.atual);
		
		// Compara atual vs original
		return campos.some(campo => data.atual[campo] != data.original[campo]);
	},

	podeSalvarPET: function() {
		const action = appsmith.store.modalContexto?.acaoTipo;
		const data = this.getFormData().atual;

		const obrigatoriosOk = data.ani002_nome.length > 0 && 
								data.ani002_datanasc !== "" && 
								data.ani002_tipo !== "" && 
								data.ani002_raca !== "" && 
								data.ani002_sexo !== "" &&
								data.ani002_convivio !== "";

		if (action === "ADICIONAR") return obrigatoriosOk;
		
		// No EDITAR, precisa ser válido E ter mudado algo (evita updates desnecessários)
		return obrigatoriosOk && this.temAlteracaoPET();
	},

	podeCancelarPET: function() {
		const action = appsmith.store.modalContexto?.acaoTipo;
		// Se estiver adicionando, sempre pode cancelar. 
		// Se estiver editando, só cancela se houver alteração para descartar.
		return action === "ADICIONAR" || this.temAlteracaoPET();
	},

	resetFormPET: async function() {
		// Voltamos o contexto para EDITAR
		await storeValue("modalContexto", { 
			...appsmith.store.modalContexto, 
			acaoTipo: "EDITAR" 
		});

		// Chamamos o resetAllWidgets do seu outro JS Object para manter o padrão
		// Ou usamos a lista local aqui:
		const widgets = [
			"ImagePet", "FilePicker1Pet", "Input1Nome", "DatePicker1Nascimento", 
			"Input2Idade", "Input3Peso", "Input3Registro", "Input3Microchip", 
			"DatePicker1Obito", "Select1Especie", "Select1Raca", "Select1Sexo", 
			"Select1Castrado", "Select1Porte", "Select1Pelagem", "Select1Cor", 
			"Select1Temperamento", "Select1Convivio", "Select1Veterinario", 
			"Select1Clinica", "Input1Canil", "Input1Pedigree", "Input1PedigreeNome", 
			"Input1Observacao", "Input1Cuidados", "Input1Saude", "Input1Tosa"
		];

		widgets.forEach(w => resetWidget(w, true));
		
		JSutils.resetInactivityTimer();
		showAlert("Alterações descartadas. Retornando ao registro original.", "info");
	}
}