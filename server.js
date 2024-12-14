const soap = require("soap");
const fs = require("fs");

const pfxPath = "path/to/cert.pfx";
const pfxPassphrase = "passphrase";

const url =
  "https://isscuritiba.curitiba.pr.gov.br/Iss.NfseWebService/NfseWs.asmx?WSDL";

const options = {
  wsdl_options: {
    pfx: fs.readFileSync(pfxPath),
    passphrase: pfxPassphrase,
    strictSSL: false,
  },
};

soap.createClient(url, options, function (err, client) {
  if (err) {
    console.error("Erro ao criar cliente SOAP:", err);
    return;
  }

  console.log("Cliente SOAP criado com sucesso!");
  // console.log(client.describe());

  client.on("request", function (xml) {
    console.log("XML Enviado:", xml);
  });

  client.setEndpoint(
    "https://isscuritiba.curitiba.pr.gov.br/Iss.NfseWebService/nfsews.asmx"
  );

  const args = {
    ConsultarNfseRpsEnvio: {
      IdentificacaoRps: {
        Numero: "123456",
        Serie: "abc",
        Tipo: 11234,
      },
      Prestador: {
        Cnpj: "0000000000000",
        InscricaoMunicipal: "0000000000000",
      },
    },
  };

  console.log("Requisitando SOAP...");

  client.ConsultarNfsePorRps(args, function (err, result) {
    if (err) {
      console.error("Erro na requisição SOAP:", err);
      return;
    }

    console.log("Requisição SOAP realizada com sucesso!");

    if (result) {
      console.log("Resposta SOAP:", JSON.stringify(result, null, 2));
    } else {
      console.log("Resposta vazia do servidor.");
    }
  });
});
