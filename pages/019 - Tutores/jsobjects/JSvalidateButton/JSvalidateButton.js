export default {
	// 1. Verifica se houve mudanças e se os campos obrigatórios estão preenchidos
podeSalvar: () => {
    const action = appsmith.store.modalContexto?.acaoTipo;
    const row = TableTutor.selectedRow || {}; // Proteção caso a linha suma

    // --- Valores Atuais (Limpando no ato da captura) ---
    const descAtual = (InputNome.text || "").trim();
    const endAtual = (InputEndereco.text || "").trim();
    const bairroAtual = (InputBairro.text || "").trim();
    const numeroAtual = (InputNumero.text || "").trim();
    const complementoAtual = (InputComplemento.text || "").trim();
    const cidadeAtual = (InputCidade.text || "").trim();
    const emailAtual = (InputEmail.text || "").trim();
    const ufAtual = SelectUF.selectedOptionValue || "";
    const obsAtual = (InputObservacao.text || "").trim();
    
    // CAMPOS COM MÁSCARA (Limpamos para comparar apenas números)
    const telefoneAtual = (PhoneInput1Telefone.text || "").replace(/\D/g, "");
    const celularAtual = (PhoneInput1Celular.text || "").replace(/\D/g, "");
    const cepAtual = (InputCep.text || "").trim().toUpperCase().replace(/\D/g, "");
    const rgAtual = (InputRG.text || "").trim().toUpperCase();
    const cpfAtual = (InputCPF.text || "").trim().toUpperCase().replace(/\D/g, "");

    // --- Valores Originais (Protegendo contra nulos) ---
    const descOriginal = (row.prop001_nome || "").trim();
    const endOriginal = (row.prop001_endereco || "").trim();
    const bairroOriginal = (row.prop001_bairro || "").trim();
    const numeroOriginal = (row.prop001_numero || "").trim();
    const complementoOriginal = (row.prop001_complemento || "").trim();
    const cidadeOriginal = (row.prop001_cidade || "").trim();
    const emailOriginal = (row.prop001_email || "").trim();
    const ufOriginal = row.prop001_uf || "";
    const obsOriginal = (row.prop001_observacao || "").trim();
    
    // ORIGINAIS MASCARADOS (Transforma em string antes de limpar)
    const telefoneOriginal = (row.prop001_telefone || "").toString().replace(/\D/g, "");
    const celularOriginal = (row.prop001_celular || "").toString().replace(/\D/g, "");
    const cepOriginal = (row.prop001_cep || "").toString().replace(/\D/g, "");
    const rgOriginal = (row.prop001_rg || "").toString();
    const cpfOriginal = (row.prop001_cpf || "").toString().replace(/\D/g, "");

    // 1. Validação de preenchimento obrigatório
    const camposPreenchidos = descAtual.length > 0 && ufAtual !== "" && cepAtual.length === 8;

    if (action === "ADICIONAR") {
        return camposPreenchidos;
    } else {
        // 2. Comparação direta (mais limpa)
        const houveMudanca = 
            descAtual !== descOriginal ||
            endAtual !== endOriginal ||
            bairroAtual !== bairroOriginal ||
            numeroAtual !== numeroOriginal ||
            complementoAtual !== complementoOriginal ||
            cidadeAtual !== cidadeOriginal ||
            emailAtual !== emailOriginal ||
            telefoneAtual !== telefoneOriginal ||
            celularAtual !== celularOriginal ||
            ufAtual !== ufOriginal ||
            obsAtual !== obsOriginal ||
            cepAtual !== cepOriginal ||
            rgAtual !== rgOriginal ||
            cpfAtual !== cpfOriginal;
        return camposPreenchidos && houveMudanca;
    }
},
	
// 2. Função para o botão CANCELAR refatorada
	resetForm: async () => {
		// 1. Mudamos o estado de volta para "Visualizar/Editar" 
		// Isso faz com que o Default Value do Input aponte para a TableAlimentos.selectedRow
		await storeValue("modalContexto", { 
			...appsmith.store.modalContexto, 
			acaoTipo: "EDITAR" 
		});

		// 2. Resetamos o widget. Agora ele vai ler o Default Value novo (da linha selecionada)
		resetWidget("InputNome", true); // Descomente se esses widgets existirem nesta página
    resetWidget("InputID", true); // Reset o ID também, se necessário
		resetWidget("InputRG", true);
		resetWidget("InputCPF", true);		
		resetWidget("InputCEP", true);
		resetWidget("InputEndereco", true);
		resetWidget("InputNumero", true);
		resetWidget("InputComplemento", true);
		resetWidget("InputBairro", true);
		resetWidget("InputCidade", true);
		resetWidget("SelectUF", true);
		resetWidget("InputEmail", true);					
		resetWidget("PhoneInput1Telefone", true);					
		resetWidget("PhoneInput1Celular", true);				
		resetWidget("InputObservacao", true);		
		resetWidget("ApiViaCep", true);
		// 3. Reiniciamos o cronômetro de inatividade (pois o usuário interagiu com o botão)
		JSutils.resetInactivityTimer();
		
		showAlert("Operação cancelada. Retornando ao registro selecionado.", "info");
	},
	
// Nova função para o botão CANCELAR
podeCancelar: () => {
    const action = appsmith.store.modalContexto?.acaoTipo;
    
    // Chamamos a função de verificação de mudanças que já criamos
    // Importante: use o nome do seu JSObject antes do ponto
    const houveAlteracao = JSvalidateButton.temAlteracao(); 

    if (action === "ADICIONAR") {
        // No modo ADICIONAR, o botão sempre funciona (true)
        return true;
    }

    // No modo EDITAR, só funciona se houve alteração (true/false)
    return houveAlteracao;
},

	// 1. Função que checa se o que está no input é diferente da tabela
temAlteracao: () => {
    const contexto = appsmith.store.modalContexto?.acaoTipo;
    
    // Dados dos Inputs/Selects (Limpando e padronizando)
    const descAtual        = (InputNome.text || "").trim().toUpperCase();
    const endAtual         = (InputEndereco.text || "").trim().toUpperCase();
    const bairroAtual      = (InputBairro.text || "").trim().toUpperCase();
    const numeroAtual      = (InputNumero.text || "").trim().toUpperCase(); // Faltava )
    const complementoAtual = (InputComplemento.text || "").trim().toUpperCase(); // Faltava )
    const cidadeAtual      = (InputCidade.text || "").trim().toUpperCase();
    const emailAtual       = (InputEmail.text || "").trim().toLowerCase(); // Mudei para Upper para comparar igual
    const telefoneAtual    = (PhoneInput1Telefone.text || "").trim().toUpperCase().replace(/\D/g, ""); // Faltava )
    const celularAtual     = (PhoneInput1Celular.text || "").trim().toUpperCase().replace(/\D/g, ""); // Faltava )
    const ufAtual          = (SelectUF.selectedOptionValue || "").trim().toUpperCase();
    const cepAtual         = (InputCep.text || "").trim().toUpperCase().replace(/\D/g, "");
    const obsAtual     		 = (InputObservacao.text || "").trim().toUpperCase();
    const rgAtual 				 = (InputRG.text || "").trim().toUpperCase();
    const cpfAtual 				 = (InputCPF.text || "").trim().toUpperCase().replace(/\D/g, "");
	
    // Dados da Tabela (Original)
    const row = TableTutor.selectedRow;
    const descOriginal        = (row.prop001_nome || "").trim().toUpperCase();
    const endOriginal         = (row.prop001_endereco || "").trim().toUpperCase();
    const bairroOriginal      = (row.prop001_bairro || "").trim().toUpperCase();
    const numeroOriginal      = (row.prop001_numero || "").trim().toUpperCase();        
    const complementoOriginal = (row.prop001_complemento || "").trim().toUpperCase();        
    const cidadeOriginal      = (row.prop001_cidade || "").trim().toUpperCase();                        
    const emailOriginal       = (row.prop001_email || "").trim().toLowerCase();                        
    const telefoneOriginal    = (row.prop001_telefone || "").trim().toUpperCase().replace(/\D/g, "");            
    const celularOriginal     = (row.prop001_celular || "").trim().toUpperCase().replace(/\D/g, "");            
    const ufOriginal          = (row.prop001_uf || "").trim().toUpperCase();            
    const cepOriginal         = (row.prop001_cep || "").trim().toUpperCase().replace(/\D/g, "");        
    const obsOriginal     		= (row.prop001_observacao || "").trim().toUpperCase();        
    const rgOriginal 				 	= (row.prop001_rg || "").toString();
    const cpfOriginal 			  = (row.prop001_cpf || "").toString().replace(/\D/g, "");
	
    // Validação de campos obrigatórios (Ex: Nome, Endereço e UF não podem ser vazios)
    const camposObrigatoriosPreenchidos = descAtual.trim().length > 0  && 
																					endAtual.trim().length > 0  && 
																					ufAtual.trim().length > 0  &&
																					bairroAtual.trim().length > 0  &&      
																					cidadeAtual.trim().length > 0  &&      
																					cepAtual.trim().length > 0 ;         
	
    if (contexto === "ADICIONAR") {
        return camposObrigatoriosPreenchidos;
    }

    // No modo EDIÇÃO, verificamos se algo mudou
    const houveMudanca = 
        descAtual        !== descOriginal ||
        endAtual         !== endOriginal ||
        bairroAtual      !== bairroOriginal ||
        numeroAtual      !== numeroOriginal || 
        complementoAtual !== complementoOriginal ||
        cidadeAtual      !== cidadeOriginal ||
        emailAtual       !== emailOriginal ||
        telefoneAtual.trim().toUpperCase().replace(/\D/g, "")    !== telefoneOriginal.trim().toUpperCase().replace(/\D/g, "") || 
        celularAtual.trim().toUpperCase().replace(/\D/g, "")     !== celularOriginal.trim().toUpperCase().replace(/\D/g, "") ||
        ufAtual          !== ufOriginal || 
        obsAtual     !== obsOriginal || 
        cepAtual.trim().toUpperCase().replace(/\D/g, "")         !== cepOriginal.trim().toUpperCase().replace(/\D/g, "");
        rgAtual.trim().toUpperCase()        !== rgOriginal.trim().toUpperCase();
	      cpfAtual.trim().toUpperCase().replace(/\D/g, "")         !== cpfOriginal.trim().toUpperCase().replace(/\D/g, "");
	
	// Criamos uma lista de todos os campos para debugar de uma vez
 const camposParaChecar = [
   { nome: "NOME", atual: descAtual, original: descOriginal },
   { nome: "UF", atual: ufAtual, original: ufOriginal },
   { nome: "CEP", atual: cepAtual, original: cepOriginal },
   { nome: "FONE", atual: telefoneAtual, original: telefoneOriginal },
   { nome: "END", atual: endAtual, original: endOriginal },
   { nome: "BAIRRO", atual: bairroAtual, original: bairroOriginal },
   { nome: "NUMERO", atual: numeroAtual, original: numeroOriginal },
   { nome: "COMP", atual: complementoAtual, original: complementoOriginal },
   { nome: "CIDADE", atual: cidadeAtual, original: cidadeOriginal },
   { nome: "EMAIL", atual: emailAtual, original: emailOriginal },
   { nome: "CEL", atual: celularAtual, original: celularOriginal },
   { nome: "CONTATO", atual: obsAtual, original: obsOriginal }
 ];
// Usamos o forEach para imprimir cada um concatenado com delimitadores
 camposParaChecar.forEach(campo => {
    // O sinal de | ajuda a ver se tem espaço sobrando: ex: "SP |" vs "SP|"
     console.log(`Campo: ${campo.nome} -> [${campo.atual}] vs [${campo.original}] | Mudou? ${campo.atual !== campo.original}`);
 });

// console.log("Resultado Geral 'houveMudanca':", houveMudanca);
// Imprime no console do Appsmith (aba Logs lá embaixo)
 console.log("Campos Obrigatorios:", camposObrigatoriosPreenchidos);
 console.log("Houve mudança geral?", houveMudanca);
    // Habilita se os obrigatórios estão ok E houve alguma mudança real
    return camposObrigatoriosPreenchidos && houveMudanca; 
// Imprime o valor no console do Appsmith

},
}