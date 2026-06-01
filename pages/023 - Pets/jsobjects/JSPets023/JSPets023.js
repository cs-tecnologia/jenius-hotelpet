export default {
	async abrirParticularidades() {
		const idPet = TabelaPets023.selectedRow?.ani002_id;
		if (!idPet) return showAlert("Selecione um pet na lista.", "warning");
		await storeValue("petID_Particularidades023", idPet);
		await SelectParticularidades023.run();
		showModal("ModalParticularidades023");
	},

	async abrirImunizacao() {
		const idPet = TabelaPets023.selectedRow?.ani002_id;
		if (!idPet) return showAlert("Selecione um pet na lista.", "warning");
		await storeValue("petID_Imuniza023", idPet);
		await SelectImuniza023.run();
		showModal("ModalImuniza023");
	},

	async abrirAlimentacao() {
		const idPet = TabelaPets023.selectedRow?.ani002_id;
		if (!idPet) return showAlert("Selecione um pet na lista.", "warning");
		await storeValue("petID_Alimentos023", idPet);
		await SelectAlimentos023.run();
		showModal("ModalAlimentos023");
	},

	async abrirEstadias() {
		const idPet = TabelaPets023.selectedRow?.ani002_id;
		if (!idPet) return showAlert("Selecione um pet na lista.", "warning");
		await storeValue("petID_Estadias023", idPet);
		await SelectEstadias023.run();
		showModal("ModalEstadias023");
	},

	async abrirConvivencia() {
		const idPet = TabelaPets023.selectedRow?.ani002_id;
		if (!idPet) return showAlert("Selecione um pet na lista.", "warning");
		await storeValue("petID_Amigos023", idPet);
		await SelectAmigos023.run();
		showModal("ModalConvivencia023");
	}
}
