export default {
	timeoutId: null,
	intervalId: null,
	tempoRestante: 3600,
	tempoPadrao: 3600,

	async aoCarregarPagina() {
		if (this.timeoutId) clearTimeout(this.timeoutId);
		await storeValue("modalContexto", {
			entidade: "RESERVA",
			acaoTipo: "EDITAR",
			acaoBotao: "ATUALIZAR"
		});
		this.resetInactivityTimer();
	},

	async resetInactivityTimer() {
		if (appsmith.store.currentTimeoutId) clearTimeout(appsmith.store.currentTimeoutId);
		if (appsmith.store.currentIntervalId) clearInterval(appsmith.store.currentIntervalId);

		this.tempoRestante = this.tempoPadrao;

		const newInterval = setInterval(() => {
			if (this.tempoRestante > 0) {
				this.tempoRestante -= 1;
			} else {
				clearInterval(newInterval);
			}
		}, 1000);

		const newTimeout = setTimeout(async () => {
			await this.executarAutoLogoff();
		}, this.tempoPadrao * 1000);

		await storeValue("currentTimeoutId",  newTimeout);
		await storeValue("currentIntervalId", newInterval);
	},

	formatarTempo() {
		const minutos  = Math.floor(this.tempoRestante / 60);
		const segundos = this.tempoRestante % 60;
		return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
	},

	async executarAutoLogoff() {
		await clearStore();
		navigateTo("home", {}, "SAME_WINDOW");
	},

	async limparESair() {
		await clearStore();
		navigateTo("home", {}, "SAME_WINDOW");
	},

	currentSchema: () => {
		return appsmith.store.selectedSchema || "100000";
	},

	customerLogo: () => {
		return appsmith.store.customerLogo || "/logo.png";
	}
}
