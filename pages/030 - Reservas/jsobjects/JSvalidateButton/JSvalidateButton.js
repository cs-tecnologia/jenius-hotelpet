export default {

	podeSalvar: () => {
		const action   = appsmith.store.modalContexto?.acaoTipo;
		const selected = appsmith.store.reservaSelecionada || {};

		const petAtual    = SelectPetReserva.selectedOptionValue;
		const acomoAtual  = SelectAcomodacaoReserva.selectedOptionValue;
		const inAtual     = DatePickerCheckIn.formattedDate  || "";
		const outAtual    = DatePickerCheckOut.formattedDate || "";

		const camposPreenchidos =
			!!petAtual &&
			!!acomoAtual &&
			inAtual.trim().length > 0 &&
			outAtual.trim().length > 0;

		if (action === "ADICIONAR") return camposPreenchidos;

		// Modo EDITAR: habilita somente se algo mudou
		const houveMudanca =
			String(petAtual)   !== String(selected.reserva001_ani002_id   || "") ||
			String(acomoAtual) !== String(selected.reserva001_acomo001_id || "") ||
			inAtual            !== (selected.reserva001_checkin  || "")          ||
			outAtual           !== (selected.reserva001_checkout || "");

		return camposPreenchidos && houveMudanca;
	},

	temAlteracao: () => {
		return JSvalidateButton.podeSalvar();
	},

	podeCancelar: () => {
		const action = appsmith.store.modalContexto?.acaoTipo;
		if (action === "ADICIONAR") return true;
		return JSvalidateButton.temAlteracao();
	},

	resetForm: async () => {
		await storeValue("modalContexto", {
			...appsmith.store.modalContexto,
			acaoTipo: "EDITAR"
		});
		JSReserva.resetWidgetsReserva();
		JSutils.resetInactivityTimer();
		showAlert("Operação cancelada. Retornando ao registro selecionado.", "info");
	}
}
