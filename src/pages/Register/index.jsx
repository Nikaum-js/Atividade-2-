import { Header } from "../../components/Header";
import { useForm } from "react-hook-form";
import api from "../../service/api";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import AttentionImg from "../../assets/attention.svg";

import "./styles.css";

export function Register() {
  const { register, handleSubmit } = useForm();
  const [fieldErrors, setFieldErrors] = useState({
    name: undefined,
    email: undefined,
    birth: undefined,
    gender: undefined,
    cpf: undefined,
    cep: undefined,
    logradouro: undefined,
    numeroLogradouro: undefined,
    city: undefined,
    uf: undefined,
  });
  const [verifiedTerms, setVerifiedTerms] = useState();

  useEffect(() => {
    const cep = document.querySelector("#cep");

    //percorre o json enviado pela API e separa apenas a parte que me importa
    const showData = (result) => {
      for (const campo in result) {
        if (document.querySelector("#" + campo)) {
          document.querySelector("#" + campo).value = result[campo];
        }
      }
    };

    //função para pegar o campo enviado pelo input e colocar ele na API dos correios
    cep.addEventListener("blur", (e) => {
      //função para encontrar o "-" caso encontrar troque por vazio
      let searchTrace = cep.value.replace("-", "");

      //regras que eu defini para o fetch
      const options = {
        method: "GET",
        mode: "cors",
        cache: "default",
      };

      //estou enviando os dados para a API dos correios
      fetch(`https://viacep.com.br/ws/${searchTrace}/json`, options)
        //estou dizendo o que eu quero fazer com a minha promise
        .then((response) => {
          response
            .json()
            //estou dizendo o que eu quero fazer com a minha outra promise
            .then((data) => showData(data));
        })
        //caso dê errado eu quero que ele mostre uma mensagem com o erro encontrado
        .catch((e) => console.log("Deu um tal erro" + e));
    });
  }, []);

  useEffect(() => {
    console.log(verifiedTerms);
  }, [verifiedTerms]);

  function handleSubmitForm(data) {
    if (verifiedTerms) {
      api
        .post("cadastro", data)
        .then((response) => {
          toast.success(response.data.message);
        })
        .catch((res) => {
          if (res.response.status === 422) {
            setFieldErrors({
              name: res.response.data.errors.nomeCompleto,
              email: res.response.data.errors.email,
              birth: res.response.data.errors.dataNascimento,
              gender: res.response.data.errors.sexo,
              cpf: res.response.data.errors.cpf,
              cep: res.response.data.errors.cep,
              logradouro: res.response.data.errors.logradouro,
              numeroLogradouro: res.response.data.errors.numeroLogradouro,
              city: res.response.data.errors.cidade,
              uf: res.response.data.errors.uf,
            });
            toast.error("erro ao criar cadastro, verifique os campos!");
          } else if (res.response.status === 412) {
            toast.success(res.response.data.message);
            setFieldErrors({
              name: undefined,
              email: undefined,
              birth: undefined,
              gender: undefined,
              cpf: undefined,
              cep: undefined,
              logradouro: undefined,
              numeroLogradouro: undefined,
              city: undefined,
              uf: undefined,
            });
          }
        });
    } else {
      toast.error("marque o campo de termos e condições");
    }
  }

  return (
    <>
      <Header />

      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <h1>Seus dados</h1>

        <section>
          <div class="box-form-1">
            <div class="content-input">
              <label for="">Nome Completo</label>
              <input
                className={fieldErrors.name === undefined ? "" : "error"}
                type="text"
                placeholder="Nome Completo"
                {...register("nomeCompleto")}
              />
              {fieldErrors.name === undefined ? (
                <p className="error-message"></p>
              ) : (
                <p className="error-message">{fieldErrors.name}</p>
              )}
            </div>

            <div class="content-input">
              <label for="">E-mail</label>
              <input
                className={fieldErrors.email === undefined ? "" : "error"}
                type="text"
                placeholder="E-mail"
                {...register("email")}
              />
              {fieldErrors.email === undefined ? (
                <p className="error-message"></p>
              ) : (
                <p className="error-message">{fieldErrors.email}</p>
              )}
            </div>

            <div class="content-input">
              <label for="">Data de Nascimento</label>
              <input
                className={fieldErrors.birth === undefined ? "" : "error"}
                type="date"
                {...register("dataNascimento")}
              />
              {fieldErrors.birth === undefined ? (
                <p className="error-message"></p>
              ) : (
                <p className="error-message">{fieldErrors.birth}</p>
              )}
            </div>

            <div class="content-input">
              <label for="">Sexo</label>
              <select
                name=""
                id=""
                className={fieldErrors.gender === undefined ? "" : "error"}
                {...register("sexo")}
              >
                <option value="" selected>
                  Selecione
                </option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
              {fieldErrors.gender === undefined ? (
                <p className="error-message"></p>
              ) : (
                <p className="error-message">{fieldErrors.gender}</p>
              )}
            </div>

            <div class="content-input">
              <label for="">CPF</label>
              <input
                className={fieldErrors.cpf === undefined ? "" : "error"}
                type="number"
                placeholder="CPF"
                data-mask="000.000.000-00"
                {...register("cpf")}
              />
              {fieldErrors.cpf === undefined ? (
                <p className="error-message"></p>
              ) : (
                <p className="error-message">{fieldErrors.cpf}</p>
              )}
            </div>
          </div>

          <div class="box-form-2">
            <div class="content-input">
              <label htmlFor="cep">CEP</label>
              <input
                id="cep"
                className={fieldErrors.cep === undefined ? "" : "error"}
                type="text"
                placeholder="CEP"
                {...register("cep")}
              />
              {fieldErrors.cep === undefined ? (
                <p className="error-message"></p>
              ) : (
                <p className="error-message">{fieldErrors.cep}</p>
              )}
            </div>
            <div htmlFor="logradouro" class="content-input">
              <label for="">Logradouro</label>
              <input
                id="logradouro"
                className={fieldErrors.logradouro === undefined ? "" : "error"}
                type="text"
                placeholder="Logradouro"
                {...register("logradouro")}
              />
              {fieldErrors.logradouro === undefined ? (
                <p className="error-message"></p>
              ) : (
                <p className="error-message">{fieldErrors.logradouro}</p>
              )}
            </div>
            <div class="content-input">
              <label for="">Número</label>
              <input
                className={
                  fieldErrors.numeroLogradouro === undefined ? "" : "error"
                }
                type="text"
                placeholder="Número"
                {...register("numeroLogradouro")}
              />
              {fieldErrors.numeroLogradouro === undefined ? (
                <p className="error-message"></p>
              ) : (
                <p className="error-message">{fieldErrors.numeroLogradouro}</p>
              )}
            </div>
            <div class="content-input">
              <label htmlFor="localidade">Cidade</label>
              <input
                id="localidade"
                className={fieldErrors.city === undefined ? "" : "error"}
                type="text"
                placeholder="Cidade"
                {...register("cidade")}
              />
              {fieldErrors.city === undefined ? (
                <p className="error-message"></p>
              ) : (
                <p className="error-message">{fieldErrors.city}</p>
              )}
            </div>

            <div class="content-input">
              <label htmlFor="uf">UF</label>
              <input
                id="uf"
                className={fieldErrors.uf === undefined ? "" : "error"}
                type="text"
                placeholder="UF"
                {...register("uf")}
              />
              {fieldErrors.uf === undefined ? (
                <p className="error-message"></p>
              ) : (
                <p className="error-message">{fieldErrors.uf}</p>
              )}
            </div>
            <div class="content-input">
              <label for="">Expectativa</label>
              <input
                type="text"
                placeholder="Expectativa"
                {...register("expectativa")}
              />
            </div>
          </div>
        </section>

        <div class="form-footer">
          <div class="attention">
            <img src={AttentionImg} alt="attention" />
            <h2>Preencha todos os campos</h2>
          </div>

          <div className="terms">
            <label>Eu aceito todos os termos e condições</label>
            <input
              type="checkbox"
              onChange={(value) => setVerifiedTerms(value.target.checked)}
            />
          </div>

          <button type="submit">Cadastrar</button>
        </div>
      </form>
    </>
  );
}
