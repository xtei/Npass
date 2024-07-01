//Cookies
const sidebar = document.querySelector(".side-bar");
const btnCookies = document.querySelector(".close-bottom-cookies");
const dialogCookies = document.querySelector(".back-container-bottom-cookies");
sidebar.style.display = "none";

if (localStorage.getItem("cookies") === "enabled") {
  sidebar.style.display = "block";
  dialogCookies.style.display = "none";
}

btnCookies.addEventListener("click", () => {
  localStorage.setItem("cookies", "enabled");
  dialogCookies.style.display = "none";
  sidebar.style.display = "block";
});

//sidebar
const btnShowSidebar = document.querySelector(".toggle-sidebar");
const backSideBar = document.querySelector(".back-sidebar");
const itensSideBar = document.querySelectorAll(".options-side-bar");

backSideBar.addEventListener("click", () => {
  sidebar.classList.remove("active");
  backSideBar.classList.remove("active");
});

btnShowSidebar.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  backSideBar.classList.toggle("active");
});

const generatePassSection = document.querySelector(".generatePassSection");
const listPasswordsSection = document.querySelector(".list-passwords-content");
const listPasswordsContent = document.querySelector(".list-pass-area");

const savedPasswords = JSON.parse(localStorage.getItem("savedPasswords")) || [];
let currentPage = 1;
const itemsPerPage = 5;
let totalPages = 0;
let currentPasswords = [];

itensSideBar.forEach((item) => {
  item.addEventListener("click", () => {
    itensSideBar.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    sidebar.classList.remove("active");
    const section = item.getAttribute("data-section");
    if (section === "generatePass") {
      generatePassSection.style.display = "block";
      listPasswordsSection.style.display = "none";
      clearPasswordSelection();
    } else if (section === "listPasswords") {
      generatePassSection.style.display = "none";
      listPasswordsSection.style.display = "block";
    }
  });
});

const mainItem = document.querySelector(
  ".options-side-bar[data-section='generatePass']"
);
mainItem.classList.add("active");

generatePassSection.style.display = "block";
listPasswordsSection.style.display = "none";

//Exportar senhas função
async function exportSinglePassword(
  password,
  appName,
  dateCreated,
  hash,
  useSpecialChars,
  useRandomNumbers,
  useCaseSensitive,
  strength
) {
  const key = await getKey();
  const keyString = await exportKey(key);

  const data = {
    version: "1.0",
    appName: appName,
    password: password,
    dateCreated:
      "Arquivo exportado em: " +
      new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }) +
      "Data de criação: " +
      dateCreated,
    hash: hash,
    useSpecialChars: useSpecialChars,
    useRandomNumbers: useRandomNumbers,
    useCaseSensitive: useCaseSensitive,
    passwordStrength: strength,
  };

  const blob = new Blob([JSON.stringify({ key: keyString, data: data })], {
    type: "application/octet-stream",
  });
  saveAs(blob, `${appName}.npsu`);
}

//lista de senhas
const totalPasswords = document.querySelector("#list-length");
const weakPasswords = document.querySelector("#pass-weak");
const mediumPasswords = document.querySelector("#pass-medium");
const strongPasswords = document.querySelector("#pass-strong");
const notPasswords = document.querySelector(".not-passwords");
const notFoundText = document.querySelector(".not-found-text");

let weakCount = 0;
let mediumCount = 0;
let strongCount = 0;

//Filtragem de senhas
//interação

const bgOptionsFilter = document.querySelector(".bg-dropfilter");
const showbgOptionsFilter = document.querySelector(".back-options");
const closebgOptionsFilter = document.querySelector(".closeOptsFilter");

showbgOptionsFilter.addEventListener("click", () => {
  bgOptionsFilter.classList.add("active");
});

closebgOptionsFilter.addEventListener("click", () => {
  bgOptionsFilter.classList.remove("active");
});

const typeFilterContainer = document.querySelector(".bf");

const previousBtn = document.querySelector(".previous");
const nextBtn = document.querySelector(".next");

let modeselect = false;

const selectsPasswordsBg = document.querySelector(".back-mode-select");

//dialogpass

const backInfoPass = document.querySelector(".back-info-pass");
const closeBackInfoPass = document.querySelector(".close-dados-dialog");

closeBackInfoPass.addEventListener("click", () => {
  backInfoPass.classList.remove("active");
});
//function updateDados
function updateDados(
  appName,
  password,
  passDataCreate,
  progSecurity,
  useRandomNumbers,
  useCaseSensitive,
  useSpecialChars
) {
  document.querySelector(".pass-set").textContent = password;
  document.querySelector(".appNameInfor").textContent = appName;
  document.querySelector(
    ".data-created"
  ).textContent = `Data de criação: ${passDataCreate}`;

  const progSecurityBar = document.querySelector(".prog-security");
  updateSecurityBar(progSecurityBar, progSecurity);

  updateFeatureStatus(
    document.querySelector(".useRandomNumbers"),
    document.querySelector(".useRandomNumbersText"),
    document.querySelector(".useRandomNumbersIcon"),
    useRandomNumbers
  );

  updateFeatureStatus(
    document.querySelector(".useCaseSensitive"),
    document.querySelector(".useCaseSensitiveText"),
    document.querySelector(".useCaseSensitiveIcon"),
    useCaseSensitive
  );

  updateFeatureStatus(
    document.querySelector(".useSpecialChars"),
    document.querySelector(".useSpecialCharsText"),
    document.querySelector(".useSpecialCharsIcon"),
    useSpecialChars
  );
}

function updateFeatureStatus(element, textElement, iconElement, status) {
  textElement.textContent = status ? "Sim" : "Não";
  element.classList.toggle("true", status);
  element.classList.toggle("false", !status);
  iconElement.classList.toggle("bi-check-circle-fill", status);
  iconElement.classList.toggle("bi-exclamation-octagon", !status);
  iconElement.classList.toggle("true", status);
  iconElement.classList.toggle("false", !status);
}

//shhow pass

async function displayPasswords(passwords = currentPasswords) {
  listPasswordsContent.innerHTML = "";
  let weakCount = 0;
  let mediumCount = 0;
  let strongCount = 0;

  totalPages = Math.ceil(passwords.length / itemsPerPage);

  if (passwords.length <= 0) {
    notPasswords.style.display = "flex";
    notFoundText.textContent = "Não há nada por aqui.";
  } else {
    notPasswords.style.display = "none";
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const passwordsToDisplay = passwords.slice(startIndex, endIndex);

  passwordsToDisplay.forEach((passwordData, index) => {
    const optionContentPass = document.createElement("div");
    optionContentPass.classList.add("option-content-pass");
    optionContentPass.setAttribute("data-id", passwordData.id || index);

    optionContentPass.addEventListener("dblclick", () => {
      modeselect = true;
    });

    optionContentPass.addEventListener("click", () => {
      if (modeselect) {
        togglePasswordsSelection(optionContentPass.getAttribute("data-id"));
      }
    });

    const oneArea = document.createElement("div");
    oneArea.classList.add("one-area");

    const rigthArea = document.createElement("div");
    rigthArea.classList.add("rigth-area");

    const copyPassList = document.createElement("i");
    copyPassList.classList.add("bi", "bi-clipboard");

    const forceValueArea = document.createElement("div");
    forceValueArea.classList.add("showpassio");

    const forceOcultMob = document.createElement("h6");
    forceOcultMob.classList.add("ts");

    const forceValueText = document.createElement("h4");
    const strength = passwordData.passwordStrength;
    forceValueText.textContent = strength;
    forceValueText.classList.add("force-set");

    const forceValueStatus = document.createElement("div");
    forceValueStatus.classList.add("status-div");

    if (strength === "Forte") {
      forceValueStatus.classList.add("strongest");
      optionContentPass.classList.add("strongest");
      strongCount++;
    } else if (strength === "Fraca") {
      forceValueStatus.classList.add("weak");
      optionContentPass.classList.add("weak");
      weakCount++;
    } else if (strength === "Média") {
      forceValueStatus.classList.add("medium");
      optionContentPass.classList.add("medium");
      mediumCount++;
    }

    forceValueArea.appendChild(forceOcultMob);
    forceValueArea.appendChild(forceValueText);
    forceValueArea.appendChild(forceValueStatus);

    const iconCloud = document.createElement("i");
    iconCloud.classList.add("bi", "bi-cloud-arrow-up");
    iconCloud.addEventListener("click", async () => {
      exportSinglePassword(
        passwordData.password,
        passwordData.appName,
        passwordData.dateCreated,
        passwordData.hash,
        passwordData.useSpecialChars,
        passwordData.useRandomNumbers,
        passwordData.useCaseSensitive,
        passwordData.passwordStrength
      );
    });

    const appName = document.createElement("h3");
    appName.classList.add("app-pass");
    appName.textContent = passwordData.appName;

    const showPass = document.createElement("h4");
    showPass.classList.add("showpass");
    showPass.textContent = "Mostrar Senha";

    copyPassList.addEventListener("click", async () => {
      const decryptedPassword = await decryptPassword(passwordData.password);
      copyToClipboard(decryptedPassword);
      toast("Senha copiada com sucesso");
      copyPassList.classList.add("bi-clipboard-check");
      copyPassList.classList.remove("bi-clipboard");
      setTimeout(() => {
        copyPassList.classList.remove("bi-clipboard-check");
        copyPassList.classList.add("bi-clipboard");
      }, 2000);
    });

    const iconDelete = document.createElement("i");
    iconDelete.classList.add("bi", "bi-trash3");
    iconDelete.addEventListener("click", () => {
      const index = savedPasswords.indexOf(passwordData);
      savedPasswords.splice(index, 1);
      localStorage.setItem("savedPasswords", JSON.stringify(savedPasswords));
      toast("Senha deletada com sucesso!");
      displayPasswords();
    });

    showPass.addEventListener("click", async () => {
      backInfoPass.classList.add("active");
      const decryptedPassword = await decryptPassword(passwordData.password);
      updateDados(
        passwordData.appName,
        decryptedPassword,
        passwordData.dateCreated,
        strength,
        passwordData.useRandomNumbers,
        passwordData.useCaseSensitive,
        passwordData.useSpecialChars
      );
    });

    oneArea.appendChild(iconCloud);
    oneArea.appendChild(appName);

    rigthArea.appendChild(showPass);
    rigthArea.appendChild(forceValueArea);
    rigthArea.appendChild(iconDelete);
    rigthArea.appendChild(copyPassList);

    optionContentPass.appendChild(oneArea);
    optionContentPass.appendChild(rigthArea);

    listPasswordsContent.appendChild(optionContentPass);
  });

  totalPasswords.textContent = `Total de senhas: ${passwords.length}`;
  weakPasswords.textContent = `Senhas Fracas: ${weakCount}`;
  mediumPasswords.textContent = `Senhas Médias: ${mediumCount}`;
  strongPasswords.textContent = `Senhas Fortes: ${strongCount}`;
  updatePaginationButtons();
}

function updateSecurityBar(progSecurityBar, progSecurity) {
  progSecurityBar.classList.remove("weak", "medium", "strongest");

  if (progSecurity === "Forte") {
    progSecurityBar.classList.add("strongest");
    progSecurityBar.style.width = "100%";
  } else if (progSecurity === "Fraca") {
    progSecurityBar.classList.add("weak");
    progSecurityBar.style.width = "33%";
  } else {
    progSecurityBar.classList.add("medium");
    progSecurityBar.style.width = "66%";
  }
}

function goToNextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    displayPasswords(currentPasswords);
  }
}

function goToPreviousPage() {
  if (currentPage > 1) {
    currentPage--;
    displayPasswords(currentPasswords);
  }
}

previousBtn.addEventListener("click", () => {
  goToPreviousPage();
});

nextBtn.addEventListener("click", () => {
  goToNextPage();
});

function updatePaginationButtons() {
  previousBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || savedPasswords.length === 0;
}

//exibição de senhas (todas, filtros, por pesquisas)

//todas as senhas
async function showAllPasswords() {
  currentPasswords = savedPasswords;
  currentPage = 1;
  displayPasswords(currentPasswords);
}

//Sistema de busca de senhas e filtros

const searchInput = document.getElementById("search-input");

let searchTimeout;
let originalPasswords = savedPasswords;
let filterActive = false;

let activeFilters = [];
let activeStrengthFilter = null;
let filteredPasswords = currentPasswords;

document.querySelectorAll(".options-drop").forEach((item) => {
  item.addEventListener("click", (event) => {
    const filter = event.currentTarget.getAttribute("data-filter");
    bgOptionsFilter.classList.remove("active");
    notPasswords.style.display = "none";
    clearPasswordSelection();

    if (
      ["Senhas-Faceis", "Senhas-Medias", "Senhas-Dificeis"].includes(filter)
    ) {
      if (activeStrengthFilter) {
        activeFilters = activeFilters.filter(
          (activeFilter) => activeFilter !== activeStrengthFilter
        );
        removeFilterElement(activeStrengthFilter);
      }
      activeStrengthFilter = filter;
    }
    if (activeFilters.includes(filter)) {
      return;
    }
    activeFilters.push(filter);
    filterPasswords(filter);
    createFilterElement(filter);
  });
});

function createFilterElement(filter) {
  const outputfilter = document.createElement("div");
  outputfilter.classList.add("output-filter");
  outputfilter.setAttribute("data-filter", filter);

  const outputfilterText = document.createElement("h5");
  outputfilterText.textContent = filter;

  const outputfilterRemove = document.createElement("i");
  outputfilterRemove.classList.add("bi", "bi-x");

  outputfilter.appendChild(outputfilterText);
  outputfilter.appendChild(outputfilterRemove);
  typeFilterContainer.appendChild(outputfilter);

  outputfilterRemove.addEventListener("click", () => {
    activeFilters = activeFilters.filter(
      (activeFilter) => activeFilter !== filter
    );
    if (activeStrengthFilter === filter) {
      activeStrengthFilter = null;
    }
    typeFilterContainer.removeChild(outputfilter);

    if (activeFilters.length > 0) {
      filterPasswords(null, true);
    } else {
      notPasswords.style.display = "none";
      filterActive = false;
      showAllPasswords();
    }
  });
}

function removeFilterElement(filter) {
  const filterElement = document.querySelector(
    `.output-filter[data-filter="${filter}"]`
  );
  if (filterElement) {
    filterElement.querySelector("i").click();
  }
}

function filterPasswords(criteria, reapply = false) {
  if (!reapply) {
    if (!activeFilters.includes(criteria)) {
      activeFilters.push(criteria);
    }
  }

  filteredPasswords = savedPasswords.filter((passwordData) => {
    return activeFilters.every((filter) => {
      if (filter === "Senhas-Faceis") {
        return passwordData.passwordStrength === "Fraca";
      } else if (filter === "Senhas-Medias") {
        return passwordData.passwordStrength === "Média";
      } else if (filter === "Senhas-Dificeis") {
        return passwordData.passwordStrength === "Forte";
      } else if (filter === "Recentes") {
        return true; // Sorting will be handled separately
      } else if (filter === "Antigas") {
        return true; // Sorting will be handled separately
      }
      return false;
    });
  });

  if (activeFilters.includes("Recentes")) {
    filteredPasswords.sort(
      (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
    );
  } else if (activeFilters.includes("Antigas")) {
    filteredPasswords.sort(
      (a, b) => new Date(a.dateCreated) - new Date(b.dateCreated)
    );
  }

  currentPasswords = filteredPasswords;
  currentPage = 1;
  filterActive = activeFilters.length > 0;
  if (!filterActive) {
    displayPasswords(filteredPasswords);
  } else {
    searchPasswords(searchInput.value);
  }
}

searchInput.addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase();
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchPasswords(searchTerm);
  }, 300);
});

function searchPasswords(query) {
  if (query === "") {
    currentPasswords = filterActive ? filteredPasswords : savedPasswords;
    displayPasswords(currentPasswords);
  } else {
    const searchTarget = filterActive ? filteredPasswords : savedPasswords;
    currentPasswords = searchTarget.filter((passwordData) => {
      const appNameString = String(passwordData.appName).toLowerCase();
      return appNameString.includes(query.toLowerCase());
    });
    displayPasswords(currentPasswords);
  }
  currentPage = 1;
}

function calculatePasswordStrength(
  password,
  useSpecialChars,
  useRandomNumbers,
  useCaseSensitive
) {
  let strength = 0;

  // Comprimento da senha
  if (password.length >= 12) {
    strength += 2;
  } else if (password.length >= 8) {
    strength += 1;
  }

  // Caracteres especiais
  if (useSpecialChars) {
    strength += 2;
  } else if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    strength += 1;
  }

  // Números
  if (useRandomNumbers) {
    strength += 1;
  } else if (/\d/.test(password)) {
    strength += 1;
  }

  // Letras maiúsculas e minúsculas
  if (useCaseSensitive) {
    strength += 1;
  } else if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    strength += 1;
  }

  // Diversidade de caracteres
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  if (hasLetters && hasNumbers && hasSpecial) {
    strength += 2;
  } else if (
    (hasLetters && hasNumbers) ||
    (hasLetters && hasSpecial) ||
    (hasNumbers && hasSpecial)
  ) {
    strength += 1;
  }

  if (strength >= 7) {
    return "Forte";
  } else if (strength >= 4) {
    return "Média";
  } else {
    return "Fraca";
  }
}

//mode selectpasswords
const numberPasswordSelect = document.querySelector(".number-passwordSelect");
let selectedPasswords = [];

//funções necessárias

document.querySelector(".closeModeSelect").addEventListener("click", () => {
  clearPasswordSelection();
});

document
  .querySelector(".deletePasswordsSelects")
  .addEventListener("click", () => {
    deleteSelectedPasswords();
  });

document
  .querySelector(".exportsPasswordsSelects")
  .addEventListener("click", () => {
    exportSelectedPasswords();
  });

function updatePasswordSelection() {
  if (selectedPasswords.length > 0) {
    selectsPasswordsBg.classList.add("active");
    numberPasswordSelect.textContent = `${selectedPasswords.length}/${savedPasswords.length} Senhas Selecionadas`;
  } else {
    selectsPasswordsBg.classList.remove("active");
  }
}

function togglePasswordsSelection(passwordId) {
  const passwordItem = document.querySelector(
    `.option-content-pass[data-id='${passwordId}']`
  );

  if (passwordItem.classList.contains("active")) {
    passwordItem.classList.remove("active");
    selectedPasswords = selectedPasswords.filter((id) => id !== passwordId);
  } else {
    passwordItem.classList.add("active");
    selectedPasswords.push(passwordId);
  }
  updatePasswordSelection();
}

function clearPasswordSelection() {
  selectedPasswords = [];
  document.querySelectorAll(".option-content-pass").forEach((passwordItem) => {
    passwordItem.classList.remove("active");
  });
  updatePasswordSelection();
  modeselect = false;
}

function deleteSelectedPasswords() {
  let savedPasswords = JSON.parse(localStorage.getItem("savedPasswords")) || [];

  selectedPasswords.forEach((passwordId) => {
    const index = savedPasswords.findIndex(
      (passwordData) => passwordData.id === passwordId
    );
    if (index > -1) {
      savedPasswords.splice(index, 1);
    }
  });

  localStorage.setItem("savedPasswords", JSON.stringify(savedPasswords));
  toast(`${selectedPasswords.length} Senhas deletadas com sucesso!`);
  toastSaveChange();
  clearPasswordSelection();
}

async function exportSelectedPasswords() {
  const savedPasswords =
    JSON.parse(localStorage.getItem("savedPasswords")) || [];
  const passwordsToExport = savedPasswords.filter((passwordData) =>
    selectedPasswords.includes(passwordData.id)
  );

  const key = await getKey();
  const keyString = await exportKey(key);
  const data = {
    version: "1.0",
    passwords: passwordsToExport,
  };
  const encryptedData = await encryptData(data, key);
  const blob = new Blob(
    [JSON.stringify({ key: keyString, data: encryptedData })],
    { type: "application/octet-stream" }
  );

  saveAs(blob, "selected_passwords.nps");
  clearPasswordSelection();
}

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
    }, 1000);
  }, 3000);
  return;
}
function toastSaveChange() {
  const toastBack = document.querySelector(".back-toastchange");
  const textToast = (document.querySelector(".text-toast1").textContent =
    "Para salvar as alterações, reinicie a pagina");
  const iconReload = document.querySelector(".bi-arrow-clockwise");
  iconReload.addEventListener("click", () => {
    location.reload();
  });
  setTimeout(() => {
    toastBack.classList.add("active");
    setTimeout(() => {
      toastBack.classList.add("animate__animated", "animate__fadeOut");
      setTimeout(() => {
        toastBack.classList.remove("active");
        toastBack.classList.remove("animate__animated", "animate__fadeOut");
        return;
      }, 1000);
    }, 5000);
  }, 4000);
  return;
}

const showDialogToGetPasswordsBtn = document.querySelector(".receber-senhas");
const closeDRS = document.querySelector(".close-dialog-get-pass");
const dialogSetEmail = document.querySelector(".back-setemailuser");
const sendEmailBtn = document.querySelector(".send-email");

showDialogToGetPasswordsBtn.addEventListener("click", () => {
  dialogSetEmail.classList.add("active");
});
closeDRS.addEventListener("click", () => {
  dialogSetEmail.classList.remove("active");
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

document.querySelector(".export").addEventListener("click", exportPasswords);
document.querySelector(".import").addEventListener("change", importPasswords);
document
  .querySelector(".import-onepass")
  .addEventListener("change", importSinglePassword);
document.querySelector(".import-trigger").addEventListener("click", () => {
  document.querySelector(".import").click();
});
document.querySelector(".import-pass").addEventListener("click", () => {
  document.querySelector(".import-onepass").click();
});

async function exportKey(key) {
  const exported = await crypto.subtle.exportKey("raw", key);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

async function exportPasswords() {
  const passwords = JSON.parse(localStorage.getItem("savedPasswords")) || [];
  const key = await getKey();
  const keyString = await exportKey(key);
  const data = {
    version: "1.0",
    passwords: passwords,
  };
  const encryptedData = await encryptData(data, key);
  const blob = new Blob(
    [JSON.stringify({ key: keyString, data: encryptedData })],
    { type: "application/octet-stream" }
  );

  saveAs(blob, "passwords.nps");
}

async function importKey(keyString) {
  const rawKey = Uint8Array.from(atob(keyString), (c) => c.charCodeAt(0));
  return await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

async function importPasswords(event) {
  const file = event.target.files[0];
  if (!file) {
    console.error("Nenhum arquivo selecionado");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function (e) {
    try {
      toast("Arquivo lido com sucesso");
      const fileContent = JSON.parse(e.target.result);
      const key = await importKey(fileContent.key);
      console.log("Chave importada com sucesso");
      const decryptedData = await decryptData(fileContent.data, key);
      if (decryptedData.version !== "1.0") {
        console.error("Versão de arquivo não suportada");
        throw new Error("Versão de arquivo não suportada");
      }

      const newPasswords = decryptedData.passwords;
      const savedPasswords =
        JSON.parse(localStorage.getItem("savedPasswords")) || [];
      newPasswords.forEach((newPassword) => {
        const existingPassword = savedPasswords.find(
          (password) => password.id === newPassword.id
        );
        if (!existingPassword) {
          savedPasswords.push(newPassword);
        } else {
          console.warn(
            `Senha com ID ${newPassword.id} já existe e não será adicionada novamente.`
          );
        }
      });

      localStorage.setItem("savedPasswords", JSON.stringify(savedPasswords));
      toast("Senhas importadas com sucesso!");
      toastSaveChange();
    } catch (err) {
      console.error("Erro ao importar senhas: ", err);
      toast("Falha ao importar senhas: Arquivo imcompativel ou desatualizado");
    }
  };
  reader.readAsText(file);
}

//Importar uma unica senha

async function importSinglePassword(event) {
  const file = event.target.files[0];
  if (!file) {
    console.error("Nenhum arquivo selecionado");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function (e) {
    try {
      toast("Arquivo lido com sucesso");
      const fileContent = JSON.parse(e.target.result);
      const key = await importKey(fileContent.key);
      console.log(`Chave importada com sucesso`);
      if (fileContent.data.version !== "1.0") {
        console.error("Versão de arquivo não suportada");
        throw new Error("Versão de arquivo não suportada");
      }

      const passwordData = {
        id: generateUniqueId(),
        password: fileContent.data.password,
        appName: fileContent.data.appName,
        dateCreated: fileContent.data.dateCreated,
        hash: fileContent.data.hash,
        useSpecialChars: fileContent.data.useSpecialChars,
        useRandomNumbers: fileContent.data.useRandomNumbers,
        useCaseSensitive: fileContent.data.useCaseSensitive,
        passwordStrength: fileContent.data.passwordStrength,
      };

      const savedPasswords =
        JSON.parse(localStorage.getItem("savedPasswords")) || [];
      savedPasswords.push(passwordData);
      localStorage.setItem("savedPasswords", JSON.stringify(savedPasswords));
      toast(`Senha importada com sucesso!`);
      toastSaveChange();
    } catch (err) {
      console.error("Erro ao importar senha: ", err);
      toast("Falha ao importar senha: Arquivo icompatível ou desatualizado!");
    }
  };
  reader.readAsText(file);
}

async function encryptData(data, key) {
  const encodedData = new TextEncoder().encode(JSON.stringify(data));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encodedData
  );
  const buffer = new Uint8Array(encrypted);
  const encryptedArray = new Uint8Array(iv.byteLength + buffer.byteLength);
  encryptedArray.set(iv, 0);
  encryptedArray.set(buffer, iv.byteLength);
  return btoa(String.fromCharCode(...encryptedArray));
}

async function decryptData(encryptedData, key) {
  const encryptedArray = Uint8Array.from(atob(encryptedData), (c) =>
    c.charCodeAt(0)
  );
  const iv = encryptedArray.slice(0, 12);
  const data = encryptedArray.slice(12);
  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    data
  );
  return JSON.parse(new TextDecoder().decode(decrypted));
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
    iv: btoa(String.fromCharCode(...iv)),
    encrypted: btoa(String.fromCharCode(...new Uint8Array(encryptedPassword))),
  };
}

async function decryptPassword(encryptedData) {
  const iv = Uint8Array.from(atob(encryptedData.iv), (c) => c.charCodeAt(0));
  const encrypted = Uint8Array.from(atob(encryptedData.encrypted), (c) =>
    c.charCodeAt(0)
  );
  const key = await getKey();
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encrypted
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

//drag files

const importArea = document.querySelector(".importfilecontent");

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  importArea.addEventListener(eventName, preventDefaults, false);
});

["dragenter", "dragover"].forEach((eventName) => {
  importArea.addEventListener(eventName, () =>
    importArea.classList.add("dragover")
  );
});

["dragleave", "drop"].forEach((eventName) => {
  importArea.addEventListener(
    eventName,
    () => importArea.classList.remove("dragover"),
    false
  );
});

importArea.addEventListener("drop", handleDrop, false);

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

async function handleDrop(e) {
  const files = e.dataTransfer.files;
  if ((files.length = 0)) return;

  const file = files[0];
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".nps")) {
    await importPasswordsFromFile(file);
  } else if (fileName.endsWith(".npsu")) {
    await importSinglePasswordFromFile(file);
  } else {
    toast("Formato de arquivo não suportado!");
  }
}

async function importPasswordsFromFile(file) {
  const reader = new FileReader();
  reader.onload = async function (e) {
    try {
      const fileContent = JSON.parse(e.target.result);
      const key = await importKey(fileContent.key);
      const decryptedData = await decryptData(fileContent.data, key);
      if (decryptedData.version !== "1.0") {
        throw new Error("Versão de arquivo não suportada");
      }

      const passwords =
        JSON.parse(localStorage.getItem("savedPasswords")) || [];
      const newPasswords = decryptedData.passwords;
      const updatedPasswords = passwords.concat(newPasswords);
      localStorage.setItem("savedPasswords", JSON.stringify(updatedPasswords));

      toast("Senhas importadas com sucesso!");
      toastSaveChange();
    } catch (err) {
      toast(
        "Falha ao importar senhas: Arquivo Não Suportado ou Desatualizado!"
      );
    }
  };
  reader.readAsText(file);
}

async function importSinglePasswordFromFile(file) {
  const reader = new FileReader();
  reader.onload = async function (e) {
    try {
      const fileContent = JSON.parse(e.target.result);
      const key = await importKey(fileContent.key);
      if (fileContent.data.version !== "1.0") {
        throw new Error("Versão de arquivo não suportada");
      }

      const savedPasswords =
        JSON.parse(localStorage.getItem("savedPasswords")) || [];
      const newPasswordData = {
        id: generateUniqueId(),
        password: fileContent.data.password,
        appName: fileContent.data.appName,
        dateCreated: new Date().toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        useSpecialChars: fileContent.data.useSpecialChars,
        useRandomNumbers: fileContent.data.useRandomNumbers,
        useCaseSensitive: fileContent.data.useCaseSensitive,
        passwordStrength: fileContent.data.passwordStrength,
      };

      savedPasswords.push(newPasswordData);
      localStorage.setItem("savedPasswords", JSON.stringify(savedPasswords));

      toast("Senha importada com sucesso!");
      toastSaveChange();
    } catch (err) {
      toast("Falha ao importar senha: Arquivo não suportado ou desatualizado!");
    }
  };
  reader.readAsText(file);
}

//send email
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
  localStorage.removeItem("savedPasswords");
  toast("Suas senhas foram deletadas com sucesso do seu navegador!");
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
  const length = parseInt(document.querySelector("#length-pass").value, 10);
  if (isNaN(length) || length < 8) {
    toast(
      "O número de caracteres deve ser pelo menos 8 para uma melhor segurança!"
    );
    loadingDialog.classList.remove("active");
    return;
  }
  if (length > 25) {
    toast(
      "Número máximo de caracteres atingido! Use menor do que 25 e maior do que 8!"
    );
    loadingDialog.classList.remove("active");
    return;
  }
  generatePassword(false);
});

savePassBtn.addEventListener("click", () => {
  const length = parseInt(document.querySelector("#length-pass").value, 10);
  if (isNaN(length) || length < 8) {
    toast(
      "O número de caracteres deve ser pelo menos 8 para uma melhor segurança!"
    );
    loadingDialog.classList.remove("active");
    return;
  }
  if (length > 25) {
    toast(
      "Número máximo de caracteres atingido! Use menor do que 25 e maior do que 8!"
    );
    loadingDialog.classList.remove("active");
    return;
  }
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
  const closedialogcreatepass = document.querySelector(
    ".close-dialog-create-pass"
  );

  backDialog.classList.add("active");
  closedialogcreatepass.addEventListener("click", () => {
    backDialog.classList.remove("active");
  });

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
    handleCloseDialogNewPassword.bind(null, nameApp.value || "[App Sem Nome]")
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

const useSpecialCharsSwicth = document.querySelector("#chk1");
const useRandomNumbersSwitch = document.querySelector("#chk2");
const useCaseSensitiveSwitch = document.querySelector("#chk3");

settingsAdvancedBtn.addEventListener("click", () => {
  advancedContent.classList.add("active");
  settingsAdvancedBtn.classList.add("active");
  settingsNormalBtn.classList.remove("active");
});
settingsNormalBtn.addEventListener("click", () => {
  useCaseSensitiveSwitch.checked = false;
  useRandomNumbersSwitch.checked = false;
  useSpecialCharsSwicth.checked = false;
  advancedContent.classList.remove("active");
  settingsAdvancedBtn.classList.remove("active");
  settingsNormalBtn.classList.add("active");
});

function generatePassword(save = false, appName = "Aplicativo Desconhecido") {
  const nameUser = document.querySelector("#name-user").value || "";
  const length = parseInt(document.querySelector("#length-pass").value, 10);

  const loadingDialog = document.querySelector(".loading-back");
  const loadingText = document.querySelector(".loading-text");
  const progressBar = document.querySelector(".progress");

  loadingDialog.classList.add("active");

  function updateProgress(step, message, callback) {
    const totalStep = 5;
    const progress = (step / totalStep) * 100;
    progressBar.style.width = progress + "%";
    loadingText.textContent = message;
    setTimeout(callback, 1000);
  }

  updateProgress(1, "Validando o número de caracteres..."),
    () => {
      if (isNaN(length) || length < 8) {
        toast(
          "O número de caracteres deve ser pelo menos 8 para uma melhor segurança!"
        );
        loadingDialog.classList.remove("active");
        return;
      }
      if (length > 25) {
        toast(
          "Número máximo de caracteres atingido! Use menor do que 25 e maior do que 8!"
        );
        loadingDialog.classList.remove("active");
        return;
      }
    };

  updateProgress(2, "Analisando escolhas de caracteres", () => {
    const partOfName = nameUser.slice(0, 3);
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let useSpecialChars;
    let useCaseSensitive;
    let useRandomNumbers;

    if (useSpecialCharsSwicth.checked) {
      characters += "!@#$%^&*()_+{}:\"<>?|[];',./`~";
      useSpecialChars = true;
    } else {
      useSpecialChars = false;
    }

    if (useRandomNumbersSwitch.checked) {
      characters += "0123456789";
      useRandomNumbers = true;
    } else {
      useRandomNumbers = false;
    }

    if (!useCaseSensitiveSwitch.checked) {
      characters = characters.toLowerCase();
      useCaseSensitive = false;
    } else {
      useCaseSensitive = true;
    }

    updateProgress(3, "Gerando sua senha do seu jeito :)", () => {
      let randomChars = "";
      for (let i = 0; i < length; i++) {
        randomChars += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      const password = partOfName + randomChars;
      localStorage.setItem("password-output", password);
      output.classList.add("active");
      textoutput.textContent = `Sua senha gerada: ${password}`;

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

      updateProgress(4, "Calculando a segurança da senha...", () => {
        const strength = calculatePasswordStrength(
          password,
          useSpecialChars,
          useRandomNumbers,
          useCaseSensitive
        );
        if (!save) {
          toast(`Senha Gerada: ${password} (Segurança: ${strength})`);
          setTimeout(() => {
            loadingDialog.classList.remove("active");
          }, 2000);
        } else {
          toast("Erro ao gerar senha");
          loadingDialog.classList.remove("active");
        }
        if (save) {
          updateProgress(5, "Salvando sua senha...");
          const passwordData = {
            id: generateUniqueId(),
            password,
            appName,
            dateCreated: new Date().toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            useSpecialChars,
            useRandomNumbers,
            useCaseSensitive,
            passwordStrength: strength,
          };

          hashPassword(password).then((hash) => {
            passwordData.hash = hash;
            savePasswordData(passwordData);
            toast(
              `Senha salva no seu navegador! Segurança da senha: ${strength}`
            );
            loadingDialog.classList.remove("active");
            toastSaveChange();
          });
        } else {
          loadingDialog.classList.remove("active");
        }
      });
    });
  });
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

function generateUniqueId() {
  return "id-" + new Date().getTime() + "-" + Math.floor(Math.random() * 10000);
}

showAllPasswords();
