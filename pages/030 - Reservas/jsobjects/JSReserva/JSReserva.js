export default {
	modalconfig: {
		action: "Insert",
		message: "",
		row: {},
		icon: "plus",
		color: "blue"
	},

	// ─── Widgets do formulário de reserva ────────────────────────────────────────
	widgetsReserva: [
		"InputIDReserva",
		"SelectPetReserva",
		"SelectAcomodacaoReserva",
		"DatePickerCheckIn",
		"DatePickerCheckOut",
		"SelectLeitoReserva",
		"SelectTipoHospedagem",
		"InputPertencesReserva",
		"InputMedicamentosReserva",
		"SwitchTransporteReserva",
		"InputObsTransporteReserva",
		"InputObsGeraisReserva"
	],

	// ─── Reseta todos os widgets do formulário ───────────────────────────────────
	resetWidgetsReserva: function() {
		this.widgetsReserva.forEach(w => resetWidget(w, true));
	},

	// ─── Abre a tela no modo ADICIONAR ──────────────────────────────────────────
	abrirInclusao: async function() {
		await storeValue("modalContexto", {
			entidade: "RESERVA",
			acaoTipo: "ADICIONAR",
			acaoBotao: "SALVAR"
		});

		await storeValue("petID_Reserva", null);
		await storeValue("reservaSelecionada", {});
		await storeValue("reservaContexto", {});
		await storeValue("particularidadesCriticas", []);

		this.resetWidgetsReserva();

		this.modalconfig = {
			action: "Insert",
			message: "",
			row: {},
			icon: "plus",
			color: "blue"
		};
	},

	// ─── Disparado no onOptionChange do SelectPetReserva ────────────────────────
	onPetSelected: async function() {
		const petID = SelectPetReserva.selectedOptionValue;

		if (!petID) return;

		await storeValue("petID_Reserva", petID);

		// Checa imunizações vencidas e dispara alerta (não bloqueia)
		try {
			const vencidas = await CheckImunizacoesVencidas.run();

			if (vencidas && vencidas.length > 0) {
				const nomes = vencidas.map(v => `• ${v.vacina} (venceu em ${v.imun003_datavalidade})`).join("\n");
				showAlert(
					`⚠️ Atenção: este pet possui ${vencidas.length} vacina(s) vencida(s):\n${nomes}`,
					"warning"
				);
			}
		} catch (err) {
			console.log("Erro ao checar imunizações:", err.message);
		}

		// Carrega particularidades de atenção/críticas para exibição na tela
		try {
			const parts = await SelectParticularidadesCriticas.run();
			await storeValue("particularidadesCriticas", parts || []);
		} catch (err) {
			console.log("Erro ao carregar particularidades:", err.message);
		}
	},

	// ─── Lógica completa do botão Salvar ────────────────────────────────────────
	salvarReserva: async function() {
		const action = appsmith.store.modalContexto?.acaoTipo;

		// 1. Captura os valores do formulário
		const petID      = SelectPetReserva.selectedOptionValue;
		const acomoID    = SelectAcomodacaoReserva.selectedOptionValue;
		const checkIn    = DatePickerCheckIn.formattedDate;
		const checkOut   = DatePickerCheckOut.formattedDate;

		// 2. Validação dos campos obrigatórios
		if (!petID || !acomoID || !checkIn || !checkOut) {
			return showAlert("Preencha Pet, Acomodação, Check-in e Check-out antes de salvar.", "warning");
		}

		if (new Date(checkOut) <= new Date(checkIn)) {
			return showAlert("A data de Check-out deve ser posterior ao Check-in.", "warning");
		}

		// 3. Valida capacidade da acomodação no período
		try {
			await storeValue("reservaContexto", {
				acomo001_id: acomoID,
				checkin:  checkIn,
				checkout: checkOut
			});

			const resultado = await CheckCapacidadeAcomodacao.run();
			const ocupacaoAtual = Number(resultado?.[0]?.ocupacao_atual || 0);

			// Busca a capacidade da acomodação selecionada no dropdown
			const acomoData = SelectAcomodacaoReserva.options?.find(
				o => o.value === acomoID
			);
			const capacidadeMaxima = Number(acomoData?.acomo001_capacidade || 1);

			// Ao editar, exclui a própria reserva da contagem
			const idAtual = appsmith.store.reservaSelecionada?.reserva001_id;
			const ocupacaoEfetiva = (action === "EDITAR" && idAtual) ? ocupacaoAtual - 1 : ocupacaoAtual;

			if (ocupacaoEfetiva >= capacidadeMaxima) {
				return showAlert(
					`Acomodação sem vagas para o período selecionado (${ocupacaoEfetiva}/${capacidadeMaxima} ocupada(s)).`,
					"error"
				);
			}
		} catch (err) {
			return showAlert("Erro ao checar capacidade: " + err.message, "error");
		}

		// 4. Monta o payload e guarda no modalconfig
		const row = {
			reserva001_id:             appsmith.store.reservaSelecionada?.reserva001_id || null,
			reserva001_ani002_id:      petID,
			reserva001_acomo001_id:    acomoID,
			reserva001_prevdatain:     checkIn,
			reserva001_checkin:        checkIn,
			reserva001_checkout:       checkOut,
			reserva001_tamanho_leito:  SelectLeitoReserva.selectedOptionValue   || "",
			reserva001_tipo_hospedagem: SelectTipoHospedagem.selectedOptionValue || "",
			reserva001_pertences:      InputPertencesReserva.text               || "",
			reserva001_medicamentos:   InputMedicamentosReserva.text            || "",
			reserva001_transporte:     SwitchTransporteReserva.isSwitchedOn     || false,
			reserva001_obstransporte:  InputObsTransporteReserva.text           || "",
			reserva001_obsgerais:      InputObsGeraisReserva.text               || ""
		};

		this.modalconfig = {
			action: action === "ADICIONAR" ? "Insert" : "Update",
			row
		};

		// 5. Executa a query
		const queryMap = {
			"Insert": InsertReserva,
			"Update": UpdateReserva
		};
		const targetQuery = queryMap[this.modalconfig.action];

		if (!targetQuery) return showAlert("Ação inválida.", "error");

		try {
			const response = await targetQuery.run();

			let idSalvo = row.reserva001_id;
			if (this.modalconfig.action === "Insert") {
				idSalvo = response?.[0]?.reserva001_id || null;
			}

			showAlert(
				this.modalconfig.action === "Insert"
					? "Reserva criada com sucesso!"
					: "Reserva atualizada com sucesso!",
				"success"
			);

			// 6. Atualiza a tabela
			await SelectReservasCount.run();
			await SelectReservas.run();

			// 7. Sincroniza a linha selecionada na tabela pelo ID
			if (idSalvo) {
				await storeValue("idSelecionadoRESERVA", idSalvo);

				const novosDados = SelectReservas.data || [];
				const indice = novosDados.findIndex(r => r.reserva001_id === idSalvo);

				if (indice >= 0) {
					await storeValue("reservaSelecionada", novosDados[indice]);
					// Cravar seleção visual na tabela usando o defaultSelectedRow
					resetWidget("TableReservas", true);
					// Muda para modo EDITAR após salvar
					await storeValue("modalContexto", {
						...appsmith.store.modalContexto,
						acaoTipo: "EDITAR",
						acaoBotao: "ATUALIZAR"
					});
				}
			}
		} catch (err) {
			showAlert("Erro ao salvar reserva: " + err.message, "error");
		}
	},

	// ─── Soft-delete via modal de confirmação ────────────────────────────────────
	deletarReserva: async function() {
		this.modalconfig = {
			action: "Delete",
			row: { reserva001_id: appsmith.store.reservaSelecionada?.reserva001_id }
		};
		showModal("ModalConfirmation");
	},

	// ─── Executado pelo ModalConfirmation (Deletar) ───────────────────────────────
	async executeAction() {
		const config  = this.modalconfig || {};
		const action  = config.action;

		const actionsMap = {
			"Delete": DeleteReserva
		};

		const targetQuery = actionsMap[action];
		if (!targetQuery) return;

		try {
			await targetQuery.run();
			showAlert("Reserva cancelada com sucesso!", "success");
			closeModal("ModalConfirmation");

			await storeValue("reservaSelecionada", {});
			await storeValue("modalContexto", {
				entidade: "RESERVA",
				acaoTipo: "EDITAR",
				acaoBotao: "ATUALIZAR"
			});

			await SelectReservasCount.run();
			await SelectReservas.run();
			this.resetWidgetsReserva();
		} catch (err) {
			showAlert("Erro ao cancelar reserva: " + err.message, "error");
		}
	},

	showModal(config) {
		this.modalconfig = config;
		showModal("ModalConfirmation");
	},

	cancelarOperacao: function() {
		closeModal("ModalConfirmation");
		this.modalconfig = { action: "Delete" };
	}
}
