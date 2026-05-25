export default {
	abrirESTADIAS: async function() {
		const petID = Input1id.text || TableAnimais.selectedRow?.ani002_id;

		if (!petID) {
			return showAlert("Selecione um pet primeiro!", "warning");
		}

		await storeValue("petID_Estadias", petID);
		await SelectEstadiasPet.run();

		showModal("ModalEstadias");
	}
}
