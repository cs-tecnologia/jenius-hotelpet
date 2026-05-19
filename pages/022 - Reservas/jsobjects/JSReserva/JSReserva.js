export default {
	modalconfig: {
		action: "Insert",
		message: "",
		row: {},
		icon: "plus",
		color: "blue"
	},

	widgetsReserva: [
		"InputIDReserva",
		"SelectPetReserva",
		"SelectAcomodacao",
		"DatePickerCheckIn",
		"DatePickerCheckOut",
		"InputHorarioIn",
		"InputHorarioOut",
		"InputPrevDiasHospedagem",
		"InputPertences",
		"InputMedicamentos",
		"SwitchTransporte",
		"InputObsTransporte",
		"InputObsGerais"
	],

	resetAllWidgets: function() {
		this.widgetsReserva.forEach(w => resetWidget(w, true));
	},

	// Botão "+ NOVO": limpa tudo e seta contexto ADICIONAR
	async abrirInclusao() {
		this.resetAllWidgets();

		await storeValue("modalContexto", { acaoTipo: "ADICIONAR" });
		await storeValue("idSelecionadoRESERVA", null);
		await storeValue("petID_Reserva", null);
		await storeValue("acomodacaoID_Reserva", null);
		await storeValue("checkinReserva", null);
		await storeValue("checkoutReserva", null);
		await storeValue("particularidadesCriticas", []);

		this.modalconfig = { action: "Insert", row: {} };

		JSutils.resetInactivityTimer();
	},

	// Disparado no onOptionChange do SelectPetReserva
	async onPetSelected() {
		const petID = SelectPetReserva.selectedOptionValue;

		if (!petID) return;

		await storeValue("petID_Reserva", petID);

		// Verifica imunizações vencidas (alerta, não bloqueia)
		try {
			await CheckImunizacoesVencidas.run();
			const vencidas = CheckImunizacoesVencidas.data || [];

			if (vencidas.length > 0) {
				const nomesVacinas = vencidas
					.map(v => v.vacina_nome || `ID ${v.imun003_imun001}`)
					.join(", ");
				showAlert(
					`⚠️ Atenção: este pet possui ${vencidas.length} vacina(s) vencida(s): ${nomesVacinas}`,
					"warning"
				);
			}
		} catch (err) {
			console.error("Erro ao verificar imunizações:", err);
		}

		// Busca particularidades com alerta ativo (CRÍTICA/ATENÇÃO)
		try {
			await SelectParticularidadesCriticas.run();
			await storeValue("particularidadesCriticas", SelectParticularidadesCriticas.data || []);
		} catch (err) {
			console.error("Erro ao buscar particularidades:", err);
		}

		JSutils.resetInactivityTimer();
	},

	// Botão SALVAR: valida → checa capacidade → persiste
	async salvarReserva() {
		const acao = appsmith.store.modalContexto?.acaoTipo;

		const petID        = SelectPetReserva.selectedOptionValue;
		const acomodacaoID = SelectAcomodacao.selectedOptionValue;
		const checkin      = DatePickerCheckIn.selectedDate;
		const checkout     = DatePickerCheckOut.selectedDate;

		// Validações obrigatórias
		if (!petID) {
			showAlert("Selecione o Pet para a reserva.", "warning");
			return;
		}
		if (!acomodacaoID) {
			showAlert("Selecione a Acomodação.", "warning");
			return;
		}
		if (!checkin) {
			showAlert("Informe a data prevista de check-in.", "warning");
			return;
		}
		if (!checkout) {
			showAlert("Informe a data prevista de check-out.", "warning");
			return;
		}
		if (new Date(checkout) <= new Date(checkin)) {
			showAlert("A data de check-out deve ser posterior ao check-in.", "warning");
			return;
		}

		// Grava no store para uso pelas queries de checagem
		await storeValue("acomodacaoID_Reserva", acomodacaoID);
		await storeValue("checkinReserva", checkin);
		await storeValue("checkoutReserva", checkout);

		// Checagem de capacidade da acomodação
		try {
			await CheckCapacidadeAcomodacao.run();
			const resultado    = CheckCapacidadeAcomodacao.data?.[0];
			const ocupacao     = Number(resultado?.ocupacao_atual  || 0);
			const capacidade   = Number(resultado?.capacidade_maxima || 0);

			if (capacidade > 0 && ocupacao >= capacidade) {
				showAlert(
					`Acomodação sem disponibilidade para o período (${ocupacao}/${capacidade} vagas ocupadas).`,
					"error"
				);
				return;
			}
		} catch (err) {
			showAlert("Erro ao verificar disponibilidade: " + err.message, "error");
			return;
		}

		// Calcula dias de hospedagem previsto
		const prevDias = Math.max(
			1,
			Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24))
		);

		// Monta o objeto de dados para as queries de escrita
		this.modalconfig = {
			action: acao === "ADICIONAR" ? "Insert" : "Update",
			row: {
				reserva001_id:                  appsmith.store.idSelecionadoRESERVA,
				reserva001_ani002_id:            petID,
				reserva001_acomo001_id:          acomodacaoID,
				reserva001_prevdatain:           checkin,
				reserva001_prevhorarioin:        InputHorarioIn.text  || "",
				reserva001_prevdiashospedagem:   prevDias,
				reserva001_checkout:             checkout,
				reserva001_horarioout:           InputHorarioOut.text || "",
				reserva001_pertences:            InputPertences.text  || "",
				reserva001_medicamentos:         InputMedicamentos.text || "",
				reserva001_transporte:           SwitchTransporte.isSwitchedOn || false,
				reserva001_obstransporte:        InputObsTransporte.text || "",
				reserva001_obsgerais:            InputObsGerais.text  || ""
			}
		};

		try {
			const targetQuery = acao === "ADICIONAR" ? InsertReserva : UpdateReserva;
			const response    = await targetQuery.run();

			showAlert(
				`Reserva ${acao === "ADICIONAR" ? "criada" : "atualizada"} com sucesso!`,
				"success"
			);

			// Após Insert: captura o ID retornado e muda para EDITAR
			if (acao === "ADICIONAR") {
				const novoID = response?.[0]?.reserva001_id;
				if (novoID) await storeValue("idSelecionadoRESERVA", novoID);
				await storeValue("modalContexto", {
					...appsmith.store.modalContexto,
					acaoTipo: "EDITAR"
				});
			}

			// Atualiza tabela e sincroniza seleção visual
			await SelectReservasCount.run();
			await SelectReservas.run();

			const idFinal = appsmith.store.idSelecionadoRESERVA;
			if (idFinal) {
				const idx = (SelectReservas.data || []).findIndex(r => r.reserva001_id === idFinal);
				if (idx >= 0) {
					resetWidget("TableReservas", true);
					await storeValue("indiceReserva", idx);
				}
			}

			this.resetAllWidgets();
			JSutils.resetInactivityTimer();

		} catch (err) {
			showAlert("Erro ao salvar reserva: " + err.message, "error");
		}
	},

	// Botão CANCELAR: descarta alterações e volta ao modo EDITAR
	async cancelarEdicao() {
		await storeValue("modalContexto", {
			...appsmith.store.modalContexto,
			acaoTipo: "EDITAR"
		});
		this.resetAllWidgets();
		JSutils.resetInactivityTimer();
		showAlert("Alterações descartadas.", "info");
	}
}
