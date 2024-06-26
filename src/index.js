document.addEventListener("DOMContentLoaded", () => {
  const baseurl = "https://app-npass.vercel.app/send-email";
  function toast(message) {
    const toastBack = document.querySelector(".back-toast");
    const textToast = document.querySelector(".text-toast");
    toastBack.classList.add("active");
    textToast.textContent = message;
    setTimeout(() => {
      toastBack.classList.add("animate__animated", "animate__fadeOut");
      setTimeout(() => {
        toastBack.classList.remove("active");
        toastBack.classList.remove("animate__animated", "animate__fadeOut");
        return;
      }, 3000);
    }, 3000);
    return;
  }

  const showDialogToGetPasswordsBtn = document.querySelector(".receber-senhas");
  const dialogSetEmail = document.querySelector(".back-setemailuser");
  const sendEmailBtn = document.querySelector(".send-email");

  showDialogToGetPasswordsBtn.addEventListener("click", () => {
    dialogSetEmail.classList.add("active");
  });

  sendEmailBtn.addEventListener("click", () => {
    dialogSetEmail.classList.remove("active");
    const emailInput = document.querySelector("#email-user").value;
    console.log(emailInput);
    if (emailInput) {
      const savedPasswords = JSON.parse(
        localStorage.getItem("savedPasswords") || []
      );
      if (savedPasswords.length > 0) {
        sendEmailWithPasswords(emailInput, savedPasswords);
      } else {
        toast("Nenhuma senha para salvar");
      }
    } else {
      toast("Email Inválido");
    }
  });
  async function decryptPassword(encryptedData) {
    const { iv, encrypted } = encryptedData;
    const key = await getKey();
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(iv) },
      key,
      new Uint8Array(encrypted)
    );
    return new TextDecoder().decode(decrypted);
  }
  
  async function getKey() {
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode("some-unique-password"),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: new TextEncoder().encode("some-salt"),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    return key;
  }

  async function sendEmailWithPasswords(email, passwords) {
    const decryptedPasswords = await Promise.all(
      passwords.map(async (passwordData) => {
        const decryptedPassword = await decryptPassword(passwordData.password);
        return { ...passwordData, password: decryptedPassword };
      })
    );

    fetch(baseurl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, passwords: decryptedPasswords }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Email sent successfully.") {
          toast("Email enviado com sucesso!");
        } else {
          toast("Erro ao enviar email.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast("Erro ao enviar email.");
      });
  }

  const showClearLocal = document.querySelector(".clear-cache");
  const dialogClearCache = document.querySelector(".back-dialog-clear");

  showClearLocal.addEventListener("click", () => {
    dialogClearCache.classList.add("active");
  });
  const btnClearCache = document.querySelector(".confirm-dialog-clear-cache");

  const btnCancel = document.querySelector(".close-dialog-clear-cache");

  btnCancel.addEventListener("click", () => {
    dialogClearCache.classList.remove("active");
  });

  btnClearCache.addEventListener("click", () => {
    dialogClearCache.classList.remove("active");
    localStorage.clear();
    toast("Dados do site deletados do seu navegador com sucesso");
  });

  const generatePassBtn = document.querySelector(".generatepassbtn");
  const savePassBtn = document.querySelector(".savepassbtn");
  const output = document.querySelector(".output");
  const textoutput = document.querySelector(".text-output");
  const copyPass = document.querySelector(".bi-clipboard");
  if (localStorage.getItem("password-output")) {
    textoutput.textContent = `Senha atual gerada: ${localStorage.getItem(
      "password-output"
    )}`;
    output.classList.add("active");
    copyPass.addEventListener("click", () => {
      copyPass.classList.add("bi-clipboard-check");
      copyPass.classList.remove("bi-clipboard");
      const password = textoutput.textContent;
      copyToClipboard(password);
      setTimeout(() => {
        copyPass.classList.add("bi-clipboard");
        copyPass.classList.remove("bi-clipboard-check");
      }, 4000);
    });

    setTimeout(() => {
      output.classList.remove("active");
      textoutput.textContent = "";
    }, 50000);
  }

  generatePassBtn.addEventListener("click", () => {
    generatePassword(false);
  });

  savePassBtn.addEventListener("click", () => {
    showDialog("newP");
  });

  function showDialog(modeDialog) {
    const backDialog = document.querySelector(".back-dialog-infor");

    const alertContainer = document.querySelector(".aviso-d");
    const titleDialog = document.querySelector(".title-dialog");
    const textDialog = document.querySelector(".aviso");
    const closeDialog = document.querySelector(".close-dialog");

    const newPassContainer = document.querySelector(".new-d");
    const nameApp = document.querySelector("#name-app");
    const nextDialog = document.querySelector(".next-dialog");

    backDialog.classList.add("active");

    if (modeDialog === "alert") {
      alertContainer.classList.add("active");
      titleDialog.textContent = "Aviso";
      textDialog.textContent =
        "Para garantir a segurança de suas senhas, armazenamos seus dados criptografados localmente no navegador. Embora não sejam enviados a servidores, é essencial manter seu dispositivo seguro e realizar backups periódicos, pois a limpeza do cache ou a desinstalação do navegador podem resultar na perda de suas informações. Nosso site assegura a proteção de suas informações pessoais, mas não nos responsabilizamos por infecções de vírus no seu dispositivo ou pela exclusão de dados devido à limpeza do cache ou desinstalação do navegador. Agradecemos por utilizar nosso site. Aproveite e guarde suas senhas de forma segura, evitando compartilhá-las.";

      closeDialog.removeEventListener("click", handleCloseDialogClick);
      closeDialog.addEventListener("click", handleCloseDialogClick);
    } else if (modeDialog === "newP") {
      newPassContainer.classList.add("active");

      nextDialog.removeEventListener("click", handleNextDialogClick);
      nextDialog.addEventListener("click", handleNextDialogClick);
    }
  }

  function handleCloseDialogClick() {
    generatePassword();
    const backDialog = document.querySelector(".back-dialog-infor");
    const alertContainer = document.querySelector(".aviso-d");
    backDialog.classList.remove("active");
    alertContainer.classList.remove("active");
  }

  function handleNextDialogClick() {
    const newPassContainer = document.querySelector(".new-d");
    const alertContainer = document.querySelector(".aviso-d");
    const titleDialog = document.querySelector(".title-dialog");
    const textDialog = document.querySelector(".aviso");
    const closeDialog = document.querySelector(".close-dialog");
    const nameApp = document.querySelector("#name-app");

    newPassContainer.classList.remove("active");
    alertContainer.classList.add("active");
    titleDialog.textContent = "Aviso";
    textDialog.textContent =
      "Para garantir a segurança de suas senhas, armazenamos seus dados criptografados localmente no navegador. Embora não sejam enviados a servidores, é essencial manter seu dispositivo seguro e realizar backups periódicos, pois a limpeza do cache ou a desinstalação do navegador podem resultar na perda de suas informações. Nosso site assegura a proteção de suas informações pessoais, mas não nos responsabilizamos por infecções de vírus no seu dispositivo ou pela exclusão de dados devido à limpeza do cache ou desinstalação do navegador. Agradecemos por utilizar nosso site. Aproveite e guarde suas senhas de forma segura, evitando compartilhá-las.";

    closeDialog.removeEventListener("click", handleCloseDialogNewPassword);
    closeDialog.addEventListener(
      "click",
      handleCloseDialogNewPassword.bind(
        null,
        nameApp.value || "Aplicativo Desconhecido"
      )
    );
  }

  function handleCloseDialogNewPassword(appName) {
    generatePassword(true, appName);
    const backDialog = document.querySelector(".back-dialog-infor");
    const alertContainer = document.querySelector(".aviso-d");
    backDialog.classList.remove("active");
    alertContainer.classList.remove("active");
  }

  const settingsAdvancedBtn = document.querySelector(".settings-advanced");
  const settingsNormalBtn = document.querySelector(".settings-normal");
  const advancedContent = document.querySelector(".advanced-content");

  settingsAdvancedBtn.addEventListener("click", () => {
    advancedContent.classList.add("active");
    settingsAdvancedBtn.classList.add("active");
    settingsNormalBtn.classList.remove("active");
  });
  settingsNormalBtn.addEventListener("click", () => {
    advancedContent.classList.remove("active");
    settingsAdvancedBtn.classList.remove("active");
    settingsNormalBtn.classList.add("active");
  });

  function generatePassword(save = false, appName = "Aplicativo Desconhecido") {
    const nameUser = document.querySelector("#name-user").value || "";
    const length = parseInt(document.querySelector("#length-pass").value, 10);
    const useSpecialChars = document.querySelector("#chk1").checked;
    const useRandomNumbers = document.querySelector("#chk2").checked;
    const useCaseSensitive = document.querySelector("#chk3").checked;

    if (isNaN(length) || length < 8) {
      toast(
        "O número de caracteres deve ser pelo menos 8 para uma melhor segurança!"
      );
      return;
    }

    if (length > 25) {
      toast(
        "Número máximo de caracteres atingido! Use menor do que 25 e maior do que 8!"
      );
      return;
    }

    const partOfName = nameUser.slice(0, 3);
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    if (useSpecialChars) {
      characters += "!@#$%^&*()_+{}:\"<>?|[];',./`~";
    }

    if (useRandomNumbers) {
      characters += "0123456789";
    }

    if (!useCaseSensitive) {
      characters = characters.toLowerCase();
    }

    let randomChars = "";
    for (let i = 0; i < length - 3; i++) {
      randomChars += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    const password = partOfName + randomChars;
    localStorage.setItem("password-output", password);
    output.classList.add("active");
    textoutput.textContent = `Sua senha gerada: ${password}!`;

    copyPass.addEventListener("click", () => {
      copyPass.classList.add("bi-clipboard-check");
      copyPass.classList.remove("bi-clipboard");
      copyToClipboard(password);
      setTimeout(() => {
        copyPass.classList.add("bi-clipboard");
        copyPass.classList.remove("bi-clipboard-check");
      }, 4000);
    });

    setTimeout(() => {
      output.classList.remove("active");
      textoutput.textContent = "";
    }, 50000);

    const strength = calculatePasswordStrength(
      password,
      useSpecialChars,
      useRandomNumbers,
      useCaseSensitive
    );
    toast(`Senha Gerada: ${password} (Força: ${strength})`);

    if (save) {
      const passwordData = {
        id: generateUniqueId(),
        password,
        appName,
        dateCreated: new Date().toISOString(),
        useSpecialChars,
        useRandomNumbers,
        useCaseSensitive,
      };

      hashPassword(password).then((hash) => {
        passwordData.hash = hash;
        savePasswordData(passwordData);
        toast(`Senha salva no seu navegador! Força da senha: ${strength}`);
      });
    }

    function generateUniqueId() {
      return (
        "id-" + new Date().getTime() + "-" + Math.floor(Math.random() * 10000)
      );
    }

    async function hashPassword(password) {
      const msgBuffer = new TextEncoder().encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      return hashHex;
    }

    async function savePasswordData(passwordData) {
      const savedPasswords =
        JSON.parse(localStorage.getItem("savedPasswords")) || [];
      const encryptedPassword = await encryptPassword(passwordData.password);
      passwordData.password = encryptedPassword;
      savedPasswords.push(passwordData);
      localStorage.setItem("savedPasswords", JSON.stringify(savedPasswords));
    }

    async function encryptPassword(password) {
      const passwordBytes = new TextEncoder().encode(password);
      const key = await getKey();
      const iv = crypto.getRandomValues(new Uint8Array(12)); // GCM nonce/IV
      const encryptedPassword = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        passwordBytes
      );
      return {
        iv: Array.from(iv),
        encrypted: Array.from(new Uint8Array(encryptedPassword)),
      };
    }

    function calculatePasswordStrength(
      password,
      useSpecialChars,
      useRandomNumbers,
      useCaseSensitive
    ) {
      let strength = 0;

      if (password.length >= 12) {
        strength += 2;
      } else if (password.length >= 8) {
        strength += 1;
      }

      if (useSpecialChars) {
        strength += 2;
      }

      if (useRandomNumbers) {
        strength += 1;
      }

      if (useCaseSensitive) {
        strength += 1;
      }

      switch (strength) {
        case 5:
        case 6:
          return "Forte";
        case 3:
        case 4:
          return "Média";
        case 1:
        case 2:
        default:
          return "Fraca";
      }
    }
  }
  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast("Senha copiada com sucesso!");
        })
        .catch((err) => {
          console.error("Erro ao copiar a senha: ", err);
          toast("Erro ao copiar a senha");
        });
    } else {
      const hiddenInput = document.querySelector("#hidden-password-input");
      hiddenInput.value = text;
      hiddenInput.select();
      document.execCommand("copy");
      hiddenInput.blur();
      toast("Senha copiada com sucesso!");
    }
  }
});
