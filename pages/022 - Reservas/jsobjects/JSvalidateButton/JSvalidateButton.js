export default {
	// Centraliza e padroniza os dados do formulário vs. registro original
	getFormData: () => {
		const row = TableReservas.selectedRow || {};

		return {
			atual: {
				reserva001_ani002_id:   SelectPetReserva.selectedOptionValue   || "",
				reserva001_acomo001_id: SelectAcomodacao.selectedOptionValue   || "",
				reserva001_prevdatain:  DatePickerCheckIn.selectedDate          || "",
				reserva001_checkout:    DatePickerCheckOut.selectedDate         || "",
				reserva001_pertences:   (InputPertences.text    || "").trim().toUpperCase(),
				reserva001_medicamentos:(InputMedicamentos.text || "").trim().toUpperCase(),
				reserva001_transporte:  SwitchTransporte.isSwitchedOn || false,
				reserva001_obstransporte:(InputObsTransporte.text || "").trim().toUpperCase(),
				reserva001_obsgerais:   (InputObsGerais.text    || "").trim().toUpperCase()
			},
			original: {
				reserva001_ani002_id:    String(row.reserva001_ani002_id   || ""),
				reserva001_acomo001_id:  String(row.reserva001_acomo001_id || ""),
				reserva001_prevdatain:   row.reserva001_prevdatain  || "",
				reserva001_checkout:     row.reserva001_checkout    || "",
				reserva001_pertences:    (row.reserva001_pertences    || "").trim().toUpperCase(),
				reserva001_medicamentos: (row.reserva001_medicamentos || "").trim().toUpperCase(),
				reserva001_transporte:   row.reserva001_transporte || false,
				reserva001_obstransporte:(row.reserva001_obstransporte || "").trim().toUpperCase(),
				reserva001_obsgerais:    (row.reserva001_obsgerais   || "").trim().toUpperCase()
			}
		};
	},

	// Detecta se algum campo foi alterado em relação ao registro original
	temAlteracao: () => {
		const data   = JSvalidateButton.getFormData();
		const campos = Object.keys(data.atual);
		return campos.some(c => String(data.atual[c]) !== String(data.original[c]));
	},

	// Regra de habilitação do botão SALVAR
	podeSalvar: () => {
		const action = appsmith.store.modalContexto?.acaoTipo;
		const d      = JSvalidateButton.getFormData().atual;

		const obrigatoriosOk =
			!!d.reserva001_ani002_id   &&
			!!d.reserva001_acomo001_id &&
			!!d.reserva001_prevdatain  &&
			!!d.reserva001_checkout;

		if (action === "ADICIONAR") return obrigatoriosOk;
		return obrigatoriosOk && JSvalidateButton.temAlteracao();
	},

	// Regra de habilitação do botão CANCELAR
	podeCancelar: () => {
		const action = appsmith.store.modalContexto?.acaoTipo;
		if (action === "ADICIONAR") return true;
		return JSvalidateButton.temAlteracao();
	},

	// Reset do formulário (botão Cancelar)
	resetForm: async () => {
		await storeValue("modalContexto", {
			...appsmith.store.modalContexto,
			acaoTipo: "EDITAR"
		});

		[
			"SelectPetReserva", "SelectAcomodacao",
			"DatePickerCheckIn", "DatePickerCheckOut",
			"InputHorarioIn", "InputHorarioOut",
			"InputPertences", "InputMedicamentos",
			"SwitchTransporte", "InputObsTransporte", "InputObsGerais"
		].forEach(w => resetWidget(w, true));

		JSutils.resetInactivityTimer();
		showAlert("Operação cancelada.", "info");
	}
}
