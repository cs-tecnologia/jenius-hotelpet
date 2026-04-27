export default {
	// A única fonte de verdade para o que o modal exibe
	getModalConfig: () => {
		const ent = appsmith.store.modalContexto?.entidade;
		
		if (ent === 'PART') return JSconfirmationPART.modalconfig;
		if (ent === 'PET') return JSconfirmationPET.modalconfig;
		return JSconfirmation.modalconfig; // Fallback para Tutor
	},

	// A função que o botão "Confirmar" (Verde) vai chamar
	executarConfirmacao: async () => {
		const ent = appsmith.store.modalContexto?.entidade;
		
		if (ent === 'PART') return await JSconfirmationPART.executeAction();
		if (ent === 'PET') return await JSconfirmationPET.executeAction();
		return await JSconfirmation.executeAction();
	}
}