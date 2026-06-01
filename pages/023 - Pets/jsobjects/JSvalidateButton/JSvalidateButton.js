export default {
	getFormData: () => {
		const pet = appsmith.store.petSelecionado || {};
		const cleanTxt = (v) => (v || "").toString().trim().toUpperCase();
		const cleanNum = (v) => (v || "").toString().replace(/\D/g, "");
		const fmtDate = (d) => {
			if (!d) return "";
			const m = moment(d);
			return m.isValid() ? m.format("YYYY-MM-DD") : "";
		};

		return {
			atual: {
				ani002_nome:        cleanTxt(Input1Nome.text),
				ani002_tipo:        (Select1Especie.selectedOptionValue || "").toString(),
				ani002_raca:        (Select1Raca.selectedOptionValue || "").toString(),
				ani002_sexo:        cleanTxt(Select1Sexo.selectedOptionValue),
				ani002_castrado:    cleanTxt(Select1Castrado.selectedOptionValue),
				ani002_porte:       (Select1Porte.selectedOptionValue || "").toString(),
				ani002_pelagem:     (Select1Pelagem.selectedOptionValue || "").toString(),
				ani002_cor:         (Select1Cor.selectedOptionValue || "").toString(),
				ani002_temp:        (Select1Temperamento.selectedOptionValue || "").toString(),
				ani002_convivio:    (Select1Convivio.selectedOptionValue || "").toString(),
				ani002_vet:         (Select1Veterinario.selectedOptionValue || "").toString(),
				ani002_clinica:     (Select1Clinica.selectedOptionValue || "").toString(),
				ani002_peso:        (Input3Peso.text || "").toString(),
				ani002_registro:    cleanTxt(Input3Registro.text),
				ani002_microchip:   cleanTxt(Input3Microchip.text),
				ani002_canil:       cleanTxt(Input1Canil.text),
				ani002_pedigree:    cleanTxt(Input1Pedigree.text),
				ani002_ped_nome:    cleanTxt(Input1PedigreeNome.text),
				ani002_observacao:  cleanTxt(Input1Observacao.text),
				ani002_datanasc:    fmtDate(DatePicker1Nascimento.selectedDate),
				ani002_data_obito:  fmtDate(DatePicker1Obito.selectedDate)
			},
			original: {
				ani002_nome:        cleanTxt(pet.ani002_nome),
				ani002_tipo:        (pet.ani002_tipo || "").toString(),
				ani002_raca:        (pet.ani002_raca || "").toString(),
				ani002_sexo:        cleanTxt(pet.ani002_sexo),
				ani002_castrado:    cleanTxt(pet.ani002_castrado),
				ani002_porte:       (pet.ani002_porte || "").toString(),
				ani002_pelagem:     (pet.ani002_pelagem || "").toString(),
				ani002_cor:         (pet.ani002_cor || "").toString(),
				ani002_temp:        (pet.ani002_temp || "").toString(),
				ani002_convivio:    (pet.ani002_convivio || "").toString(),
				ani002_vet:         (pet.ani002_vet || "").toString(),
				ani002_clinica:     (pet.ani002_clinica || "").toString(),
				ani002_peso:        (pet.ani002_peso || "").toString(),
				ani002_registro:    cleanTxt(pet.ani002_registro),
				ani002_microchip:   cleanTxt(pet.ani002_microchip),
				ani002_canil:       cleanTxt(pet.ani002_canil),
				ani002_pedigree:    cleanTxt(pet.ani002_registro_pedigree),
				ani002_ped_nome:    cleanTxt(pet.ani002_nome_registro),
				ani002_observacao:  cleanTxt(pet.ani002_observacao),
				ani002_datanasc:    fmtDate(pet.ani002_datanasc),
				ani002_data_obito:  fmtDate(pet.ani002_data_obito)
			}
		};
	},

	temAlteracao: function() {
		const data = this.getFormData();
		const campos = Object.keys(data.atual);
		const houveMudanca = campos.some(c => data.atual[c] !== data.original[c]);
		if (houveMudanca) {
			campos.forEach(c => {
				if (data.atual[c] !== data.original[c]) {
					console.log(`[PET] ${c}: [${data.original[c]}] → [${data.atual[c]}]`);
				}
			});
		}
		return houveMudanca;
	},

	podeSalvar: function() {
		const action = appsmith.store.modalContexto?.acaoTipo;
		const data = this.getFormData().atual;
		const ok = data.ani002_nome.length > 0 &&
		           data.ani002_tipo.length > 0 &&
		           data.ani002_datanasc.length > 0;
		if (action === "ADICIONAR") return ok;
		return ok && this.temAlteracao();
	},

	podeCancelar: function() {
		const action = appsmith.store.modalContexto?.acaoTipo;
		if (action === "ADICIONAR") return true;
		return this.temAlteracao();
	},

	resetForm: async function() {
		await storeValue("modalContexto", {
			...appsmith.store.modalContexto,
			acaoTipo: "EDITAR",
			acaoBotao: "ATUALIZAR"
		});
		const widgets = [
			"Input1Nome", "DatePicker1Nascimento", "Input3Peso", "Input3Registro",
			"Input3Microchip", "Input1Canil", "Input1Pedigree", "Input1PedigreeNome",
			"Input1Observacao", "Select1Especie", "Select1Raca", "Select1Sexo",
			"Select1Castrado", "Select1Porte", "Select1Pelagem", "Select1Cor",
			"Select1Temperamento", "Select1Convivio", "Select1Veterinario",
			"Select1Clinica", "DatePicker1Obito"
		];
		widgets.forEach(w => resetWidget(w, true));
		JSutils.resetInactivityTimer();
		showAlert("Alterações descartadas.", "info");
	}
}
