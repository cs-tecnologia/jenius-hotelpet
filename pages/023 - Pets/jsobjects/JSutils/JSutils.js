export default {
	timeoutId: null,
	intervalId: null,
	tempoRestante: 3600,
	tempoPadrao: 3600,

	async aoCarregarPagina() {
		if (this.timeoutId) clearTimeout(this.timeoutId);
		if (this.intervalId) clearInterval(this.intervalId);
		this.tempoRestante = this.tempoPadrao;
		this.resetInactivityTimer();
		await SelectAllPets023.run();
	},

	async resetInactivityTimer() {
		if (appsmith.store.currentTimeoutId) clearTimeout(appsmith.store.currentTimeoutId);
		if (appsmith.store.currentIntervalId) clearInterval(appsmith.store.currentIntervalId);
		this.tempoRestante = this.tempoPadrao;

		const newInterval = setInterval(() => {
			if (this.tempoRestante > 0) {
				this.tempoRestante--;
			}
		}, 1000);

		const newTimeout = setTimeout(async () => {
			await this.executarAutoLogoff();
		}, this.tempoPadrao * 1000);

		await storeValue("currentTimeoutId", newTimeout);
		await storeValue("currentIntervalId", newInterval);
	},

	formatarTempo() {
		const minutos = Math.floor(this.tempoRestante / 60);
		const segundos = this.tempoRestante % 60;
		return `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
	},

	async executarAutoLogoff() {
		showAlert("Sessão encerrada por inatividade.", "warning");
		navigateTo("home");
	},

	async limparESair() {
		showAlert("Sessão encerrada com segurança.", "info");
		navigateTo("home");
	},

	currentSchema() {
		return appsmith.store.selectedSchema || "100000";
	},

	customerLogo() {
		return appsmith.store.logoBase64 || "";
	}
}
