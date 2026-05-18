export default {
	abrirESTAD: async function() {
		const petID = Input1id.text;

		if (!petID) {
			return showAlert("Selecione um pet primeiro!", "warning");
		}

		await SelectHistoricoEstadias.run();
		showModal("ModalHistoricoEstadias");
	}
}
