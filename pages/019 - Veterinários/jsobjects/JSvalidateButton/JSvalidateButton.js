export default {
	// 1. Verifica se houve mudanças e se os campos obrigatórios estão preenchidos
podeSalvar: () => {
    const action = appsmith.store.modalContexto?.acaoTipo;
    const row = TableVeterinario.selectedRow || {};

    const nomeAtual    = (InputNome.text || "").trim();
    const crmvAtual    = (InputCRMV.text || "").toString().trim();
    const endAtual     = (InputEndereco.text || "").trim();
    const bairroAtual  = (InputBairro.text || "").trim();
    const numeroAtual  = (InputNumero.text || "").trim();
    const complementoAtual = (InputComplemento.text || "").trim();
    const cidadeAtual  = (InputCidade.text || "").trim();
    const emailAtual   = (InputEmail.text || "").trim();
    const ufAtual      = SelectUF.selectedOptionValue || "";

    const telefoneAtual = (InputTelefone.text || "").replace(/\D/g, "");
    const celularAtual  = (InputCelular.text || "").replace(/\D/g, "");
    const cepAtual      = (InputCep.text || "").replace(/\D/g, "");

    const nomeOriginal    = (row.vet001_nome || "").trim();
    const crmvOriginal    = (row.vet001_crmv || "").toString().trim();
    const endOriginal     = (row.vet001_endereco || "").trim();
    const bairroOriginal  = (row.vet001_bairro || "").trim();
    const numeroOriginal  = (row.vet001_numero || "").trim();
    const complementoOriginal = (row.vet001_complemento || "").trim();
    const cidadeOriginal  = (row.vet001_cidade || "").trim();
    const emailOriginal   = (row.vet001_email || "").trim();
    const ufOriginal      = row.vet001_uf || "";

    const telefoneOriginal = (row.vet001_telefone || "").toString().replace(/\D/g, "");
    const celularOriginal  = (row.vet001_celular || "").toString().replace(/\D/g, "");
    const cepOriginal      = (row.vet001_cep || "").toString().replace(/\D/g, "");

    const camposPreenchidos = nomeAtual.length > 0 && crmvAtual.length > 0 && ufAtual !== "" && cepAtual.length === 8;

    if (action === "ADICIONAR") {
        return camposPreenchidos;
    } else {
        const houveMudanca =
            nomeAtual !== nomeOriginal ||
            crmvAtual !== crmvOriginal ||
            endAtual !== endOriginal ||
            bairroAtual !== bairroOriginal ||
            numeroAtual !== numeroOriginal ||
            complementoAtual !== complementoOriginal ||
            cidadeAtual !== cidadeOriginal ||
            emailAtual !== emailOriginal ||
            telefoneAtual !== telefoneOriginal ||
            celularAtual !== celularOriginal ||
            ufAtual !== ufOriginal ||
            cepAtual !== cepOriginal;

        return camposPreenchidos && houveMudanca;
    }
},

	resetForm: async () => {
		await storeValue("modalContexto", {
			...appsmith.store.modalContexto,
			acaoTipo: "EDITAR"
		});

		resetWidget("InputNome", true);
    resetWidget("InputID", true);
		resetWidget("InputCRMV", true);
		resetWidget("InputCep", true);
		resetWidget("InputEndereco", true);
		resetWidget("InputNumero", true);
		resetWidget("InputComplemento", true);
		resetWidget("InputBairro", true);
		resetWidget("InputCidade", true);
		resetWidget("SelectUF", true);
		resetWidget("InputEmail", true);
		resetWidget("InputTelefone", true);
		resetWidget("InputCelular", true);
		resetWidget("SelectClinica", true);
		resetWidget("ApiViaCep", true);
		JSutils.resetInactivityTimer();

		showAlert("Operação cancelada. Retornando ao registro selecionado.", "info");
	},

podeCancelar: () => {
    const action = appsmith.store.modalContexto?.acaoTipo;
    const houveAlteracao = JSvalidateButton.temAlteracao();

    if (action === "ADICIONAR") {
        return true;
    }

    return houveAlteracao;
},

	temAlteracao: () => {
    const contexto = appsmith.store.modalContexto?.acaoTipo;

    const nomeAtual    = (InputNome.text || "").trim().toUpperCase();
    const crmvAtual    = (InputCRMV.text || "").toString().trim();
    const endAtual     = (InputEndereco.text || "").trim().toUpperCase();
    const bairroAtual  = (InputBairro.text || "").trim().toUpperCase();
    const numeroAtual  = (InputNumero.text || "").trim().toUpperCase();
    const complementoAtual = (InputComplemento.text || "").trim().toUpperCase();
    const cidadeAtual  = (InputCidade.text || "").trim().toUpperCase();
    const emailAtual   = (InputEmail.text || "").trim().toLowerCase();
    const telefoneAtual = (InputTelefone.text || "").trim().replace(/\D/g, "");
    const celularAtual  = (InputCelular.text || "").trim().replace(/\D/g, "");
    const ufAtual      = (SelectUF.selectedOptionValue || "").trim().toUpperCase();
    const cepAtual     = (InputCep.text || "").trim().replace(/\D/g, "");

    const row = TableVeterinario.selectedRow;
    const nomeOriginal    = (row.vet001_nome || "").trim().toUpperCase();
    const crmvOriginal    = (row.vet001_crmv || "").toString().trim();
    const endOriginal     = (row.vet001_endereco || "").trim().toUpperCase();
    const bairroOriginal  = (row.vet001_bairro || "").trim().toUpperCase();
    const numeroOriginal  = (row.vet001_numero || "").trim().toUpperCase();
    const complementoOriginal = (row.vet001_complemento || "").trim().toUpperCase();
    const cidadeOriginal  = (row.vet001_cidade || "").trim().toUpperCase();
    const emailOriginal   = (row.vet001_email || "").trim().toLowerCase();
    const telefoneOriginal = (row.vet001_telefone || "").toString().trim().replace(/\D/g, "");
    const celularOriginal  = (row.vet001_celular || "").toString().trim().replace(/\D/g, "");
    const ufOriginal      = (row.vet001_uf || "").trim().toUpperCase();
    const cepOriginal     = (row.vet001_cep || "").toString().trim().replace(/\D/g, "");

    const camposObrigatoriosPreenchidos = nomeAtual.trim().length > 0 &&
                                          crmvAtual.trim().length > 0 &&
                                          endAtual.trim().length > 0 &&
                                          ufAtual.trim().length > 0 &&
                                          bairroAtual.trim().length > 0 &&
                                          cidadeAtual.trim().length > 0 &&
                                          cepAtual.trim().length > 0;

    if (contexto === "ADICIONAR") {
        return camposObrigatoriosPreenchidos;
    }

    const houveMudanca =
        nomeAtual    !== nomeOriginal ||
        crmvAtual    !== crmvOriginal ||
        endAtual     !== endOriginal ||
        bairroAtual  !== bairroOriginal ||
        numeroAtual  !== numeroOriginal ||
        complementoAtual !== complementoOriginal ||
        cidadeAtual  !== cidadeOriginal ||
        emailAtual   !== emailOriginal ||
        telefoneAtual !== telefoneOriginal ||
        celularAtual  !== celularOriginal ||
        ufAtual      !== ufOriginal ||
        cepAtual     !== cepOriginal;

    return camposObrigatoriosPreenchidos && houveMudanca;
},
}
