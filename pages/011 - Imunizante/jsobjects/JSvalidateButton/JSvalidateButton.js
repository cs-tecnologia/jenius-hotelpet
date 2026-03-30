export default {
	// 1. Verifica se houve mudanças e se os campos obrigatórios estão preenchidos
podeSalvar: () => {
    const action = appsmith.store.modalContexto?.acaoTipo;
    const row = TableImunizante.selectedRow || {}; // Proteção caso a linha suma

    // --- Valores Atuais (Limpando no ato da captura) ---
    const descAtual		 	= (InputNome.text || "").trim();
    const prazoAtual		 	= (InputPrazo.text || "");
    const especiaAtual 	= Select1Especie.selectedOptionValue || "";
    const formaAtual		= Select2Forma.selectedOptionValue || "";
	  const viaAtual 			= Select3Via.selectedOptionValue || "";

    // --- Valores Originais (Protegendo contra nulos) ---
    const descOriginal 		= (row.imun001_desc || "").trim();
    const prazoOriginal 		= (row.imun001_prazo_dias || "");
    const especieOriginal = row.imun001_ani001_id || "";
    const formaOriginal 	= row.imun001_imuni004_id || "";
    const viaOriginal 		= row.imun001_imuni005_id || "";    
	

    // 1. Validação de preenchimento obrigatório
    const camposPreenchidos = descAtual.length > 0 && especiaAtual !== "" && especiaAtual !== "" && formaAtual !== "" && viaAtual !== "";

    if (action === "ADICIONAR") {
        return camposPreenchidos;
    } else {
        // 2. Comparação direta (mais limpa)
        const houveMudanca = 
            descAtual !== descOriginal ||
            prazoAtual !== prazoOriginal ||
            especiaAtual !== especieOriginal ||
            formaAtual  !== formaOriginal ||
            viaAtual  !== viaOriginal;

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
		resetWidget("InputPrazo", true); // Descomente se esses widgets existirem nesta página
    resetWidget("Select1Especie", true); // Reset o ID também, se necessário
		resetWidget("Select2Forma", true);
		resetWidget("Select3Via", true);
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
    const prazoAtual       = (InputPrazo.text || "");
    const especiaAtual     = Select1Especie.selectedOptionValue || "";
    const formaAtual	     = Select2Forma.selectedOptionValue || "";
    const viaAtual 		     = Select3Via.selectedOptionValue || "";


    // Dados da Tabela (Original)
    const row = TableImunizante.selectedRow;
    const descOriginal 		    = (row.imun001_desc || "").trim().toUpperCase();
    const prazoOriginal 		  = row.imun001_prazo_dias || "";
    const especieOriginal     = row.imun001_ani001_id || "";
    const formaOriginal 	    = row.imun001_imuni004_id || "";
    const viaOriginal 		    = row.imun001_imuni005_id || "";        

    // Validação de campos obrigatórios (Ex: Nome, Endereço e UF não podem ser vazios)
    const camposObrigatoriosPreenchidos = descAtual.trim().length > 0  && 
																					especiaAtual !== "" && 
																					formaAtual !== "" && 
																					viaAtual !== "";         
	
    if (contexto === "ADICIONAR") {
        return camposObrigatoriosPreenchidos;
    }

    // No modo EDIÇÃO, verificamos se algo mudou
    const houveMudanca = 
       descAtual       	 !== descOriginal ||
       prazoAtual        !== prazoOriginal ||
       especiaAtual		   !== especieOriginal ||
       formaAtual	     	 !== formaOriginal 	||
       viaAtual 		     !== viaOriginal ;

	// Criamos uma lista de todos os campos para debugar de uma vez
 const camposParaChecar = [
   { nome: "NOME", atual: descAtual, original: descOriginal },
   { nome: "PRAZO", atual: prazoAtual, original: prazoOriginal },
   { nome: "ESPECIE", atual: especiaAtual, original: especieOriginal },
   { nome: "FORMA", atual: formaAtual, original: formaOriginal },
   { nome: "VIA", atual: viaAtual, original: viaOriginal }

 ];
// Usamos o forEach para imprimir cada um concatenado com delimitadores
// camposParaChecar.forEach(campo => {
    // O sinal de | ajuda a ver se tem espaço sobrando: ex: "SP |" vs "SP|"
//     console.log(`Campo: ${campo.nome} -> [${campo.atual}] vs [${campo.original}] | Mudou? ${campo.atual !== campo.original}`);
// });

// console.log("Resultado Geral 'houveMudanca':", houveMudanca);
// Imprime no console do Appsmith (aba Logs lá embaixo)
// console.log("Campos Obrigatorios:", camposObrigatoriosPreenchidos);
// console.log("Houve mudança geral?", houveMudanca);
    // Habilita se os obrigatórios estão ok E houve alguma mudança real
    return camposObrigatoriosPreenchidos && houveMudanca; 
// Imprime o valor no console do Appsmith

},
}