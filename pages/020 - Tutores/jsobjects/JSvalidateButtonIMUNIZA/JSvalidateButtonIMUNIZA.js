export default {
	// 1. Verifica se houve mudanças e se os campos obrigatórios estão preenchidos
podeSalvarIMUNIZA: () => {
    const action = appsmith.store.modalContexto?.acaoTipo;
    const row = Table1Imuniza.selectedRow || {};

    // --- Valores Atuais ---
    const observacaoAtual  = (InputDescImuniza.text || "").trim().toUpperCase();
    const imunizanteAtual  = (Select1Imuniza.selectedOptionValue || "").toString();

    // --- Valores Originais ---
    const observacaoOriginal  = (row.imun003_observacao || "").toString().trim().toUpperCase();
    const imunizanteOriginal  = (row.imun003_imun001 || "").toString();

    // Validação: imunizante (FK) é obrigatório
    const camposPreenchidos = imunizanteAtual.length > 0;

    if (action === "ADICIONAR") {
        return camposPreenchidos;
    } else {
        const houveMudanca =
            observacaoAtual  !== observacaoOriginal ||
            imunizanteAtual  !== imunizanteOriginal;

        return camposPreenchidos && houveMudanca;
    }
},

	// 2. Função para o botão CANCELAR
	resetFormIMUNIZA: async () => {
		await storeValue("modalContexto", {
			...appsmith.store.modalContexto,
			acaoTipo: "EDITAR"
		});

		resetWidget("Input1IDImuniza", true);
		resetWidget("InputDescImuniza", true);
		resetWidget("Select1Imuniza", true);
		resetWidget("Switch1Imuniza", true);

		JSutils.resetInactivityTimer();

		showAlert("Operação cancelada. Retornando ao registro selecionado.", "info");
	},

	// 3. Regra de ativação do botão CANCELAR
podeCancelarIMUNIZA: () => {
    const action = appsmith.store.modalContexto?.acaoTipo;

    // Usa o próprio JSObject IMUNIZA (corrigido: era JSvalidateButtonAMIGO por engano)
    const houveAlteracao = JSvalidateButtonIMUNIZA.temAlteracaoIMUNIZA();

    if (action === "ADICIONAR") {
        return true;
    }

    return houveAlteracao;
},

	// 4. Detecta se o que está nos inputs é diferente da tabela
temAlteracaoIMUNIZA: () => {
    const contexto = appsmith.store.modalContexto?.acaoTipo;

    const observacaoAtual  = (InputDescImuniza.text || "").trim().toUpperCase();
    const imunizanteAtual  = (Select1Imuniza.selectedOptionValue || "").toString();

    const row = Table1Imuniza.selectedRow || {};
    const observacaoOriginal  = (row.imun003_observacao || "").toString().trim().toUpperCase();
    const imunizanteOriginal  = (row.imun003_imun001 || "").toString();

    const camposObrigatoriosPreenchidos = imunizanteAtual.length > 0;

    if (contexto === "ADICIONAR") {
        return camposObrigatoriosPreenchidos;
    }

    const houveMudanca =
        observacaoAtual  !== observacaoOriginal ||
        imunizanteAtual  !== imunizanteOriginal;

    const camposParaChecar = [
        { nome: "Imunizante", atual: imunizanteAtual,  original: imunizanteOriginal },
        { nome: "Observacao", atual: observacaoAtual,  original: observacaoOriginal }
    ];
    camposParaChecar.forEach(campo => {
        console.log(`[IMUNIZA] ${campo.nome} -> [${campo.atual}] vs [${campo.original}] | Mudou? ${campo.atual !== campo.original}`);
    });
    console.log("[IMUNIZA] Houve mudança?", houveMudanca);

    // Em EDITAR: habilita com qualquer mudança (sem exigir campos obrigatórios para o CANCELAR)
    return houveMudanca;
},

	// 5. Delete direto (sem modal de confirmação)
	deleteIMUNIZA: async function() {
		JSutils.resetInactivityTimer();
		const idExcluir = Table1Imuniza.selectedRow.imun003_id;

		if (!idExcluir) return showAlert("Selecione um registro.", "warning");

		try {
			await DeleteImuniza.run({ imun003_id: idExcluir });
			showAlert("Excluído com sucesso!", "success");
			await storeValue('imunizaSelecionado', {});
			await SelectImuniza.run();
		} catch (error) {
			showAlert("Erro ao excluir.", "error");
		}
	}
}
