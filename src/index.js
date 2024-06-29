const sidebar=document.querySelector(".side-bar"),btnCookies=document.querySelector(".close-bottom-cookies"),dialogCookies=document.querySelector(".back-container-bottom-cookies");sidebar.style.display="none","enabled"===localStorage.getItem("cookies")&&(sidebar.style.display="block",dialogCookies.style.display="none"),btnCookies.addEventListener("click",()=>{localStorage.setItem("cookies","enabled"),dialogCookies.style.display="none",sidebar.style.display="block"});const btnShowSidebar=document.querySelector(".toggle-sidebar"),backSideBar=document.querySelector(".back-sidebar"),itensSideBar=document.querySelectorAll(".options-side-bar");backSideBar.addEventListener("click",()=>{sidebar.classList.remove("active"),backSideBar.classList.remove("active")}),btnShowSidebar.addEventListener("click",()=>{sidebar.classList.toggle("active"),backSideBar.classList.toggle("active")});const generatePassSection=document.querySelector(".generatePassSection"),listPasswordsSection=document.querySelector(".list-passwords-content"),listPasswordsContent=document.querySelector(".list-pass-area");itensSideBar.forEach(a=>{a.addEventListener("click",()=>{itensSideBar.forEach(a=>a.classList.remove("active")),a.classList.add("active"),sidebar.classList.remove("active");const b=a.getAttribute("data-section");"generatePass"===b?(generatePassSection.style.display="block",listPasswordsSection.style.display="none"):"listPasswords"===b&&(generatePassSection.style.display="none",listPasswordsSection.style.display="block")})});const mainItem=document.querySelector(".options-side-bar[data-section='generatePass']");mainItem.classList.add("active"),generatePassSection.style.display="block",listPasswordsSection.style.display="none";async function exportSinglePassword(b,c,d,e,f,g,h,i){const j=await getKey(),k=await exportKey(j),l=new Blob([JSON.stringify({key:k,data:{version:"1.0",appName:c,password:b,dateCreated:d,hash:e,useSpecialChars:f,useRandomNumbers:g,useCaseSensitive:h,passwordStrength:i}})]),m=URL.createObjectURL(l),n=document.createElement("a");n.href=m,n.download=`${c}-password.npsu`,n.click(),URL.revokeObjectURL(m)}const totalPasswords=document.querySelector("#list-length"),weakPasswords=document.querySelector("#pass-weak"),mediumPasswords=document.querySelector("#pass-medium"),strongPasswords=document.querySelector("#pass-strong"),savedPasswords=JSON.parse(localStorage.getItem("savedPasswords"))||[],notPasswords=document.querySelector(".not-passwords"),notFoundText=document.querySelector(".not-found-text");let weakCount=0,mediumCount=0,strongCount=0;const searchInput=document.getElementById("search-input");searchInput.addEventListener("input",function(){const a=this.value.toLowerCase(),b=document.querySelectorAll(".option-content-pass");let c=!1;b.forEach(b=>{const d=b.querySelector(".app-pass").innerText.toLowerCase();d.includes(a)?(b.style.display="flex",c=!0):b.style.display="none"}),c?notPasswords.style.display="none":(notPasswords.style.display="flex",notFoundText.textContent="Nenhuma senha encontrada! Tente novamente!")});const backInfoPass=document.querySelector(".back-info-pass"),closeBackInfoPass=document.querySelector(".close-dados-dialog");closeBackInfoPass.addEventListener("click",()=>{backInfoPass.classList.remove("active")});function updateDados(a,b,c,d,e,f,g){const h=document.querySelector(".pass-set").textContent=b,i=document.querySelector(".appNameInfor").textContent=a,j=document.querySelector(".data-created").textContent=`Data de criação: ${c}`,k=document.querySelector(".prog-security"),l=document.querySelector(".useRandomNumbers"),m=document.querySelector(".useRandomNumbersText"),n=document.querySelector(".useRandomNumbersIcon"),o=document.querySelector(".useCaseSensitive"),p=document.querySelector(".useCaseSensitiveText"),q=document.querySelector(".useCaseSensitiveIcon"),r=document.querySelector(".useSpecialChars"),s=document.querySelector(".useSpecialCharsText"),t=document.querySelector(".useSpecialCharsIcon");"Forte"===d?(k.classList.add("strongest"),k.classList.remove("medium","weak")):"Fraca"===d?(k.classList.add("weak"),k.classList.remove("medium","strongest")):(k.classList.add("medium"),k.classList.remove("weak","strongest")),e?(m.textContent="Sim",l.classList.add("true"),n.classList.add("bi-check-circle-fill","true"),l.classList.remove("false"),n.classList.remove("bi-exclamation-octagon","false")):(m.textContent="N\xE3o",l.classList.add("false"),n.classList.add("bi-exclamation-octagon","false"),l.classList.remove("true"),n.classList.remove("bi-check-circle-fill","true")),f?(p.textContent="Sim",o.classList.add("true"),o.classList.remove("false"),q.classList.add("bi-check-circle-fill","true"),q.classList.remove("bi-exclamation-octagon","false")):(p.textContent="N\xE3o",o.classList.add("false"),o.classList.remove("true"),q.classList.add("bi-exclamation-octagon","false"),q.classList.remove("bi-check-circle-fill","true")),g?(s.textContent="Sim",r.classList.add("true"),t.classList.add("bi-check-circle-fill","true"),r.classList.remove("false"),t.classList.remove("bi-exclamation-octagon","false")):(s.textContent="N\xE3o",r.classList.add("false"),t.classList.add("bi-exclamation-octagon","false"),r.classList.remove("true"),t.classList.remove("bi-check-circle-fill","true"))}async function displayPasswords(){async function a(){weakCount=0,mediumCount=0,strongCount=0,savedPasswords.forEach(a=>{const b=calculatePasswordStrength(a.password,a.useSpecialChars,a.useRandomNumbers,a.useCaseSensitive);"Forte"===b?strongCount++:"M\xE9dia"===b?mediumCount++:weakCount++}),totalPasswords.textContent=`Total de senhas: ${savedPasswords.length}`,weakPasswords.textContent=`Senhas Fracas: ${weakCount}`,mediumPasswords.textContent=`Senhas Médias: ${mediumCount}`,strongPasswords.textContent=`Senhas Fortes: ${strongCount}`}listPasswordsContent.innerHTML="",0>=savedPasswords.length?(notPasswords.style.display="flex",notFoundText.textContent="N\xE3o h\xE1 nada por aqui. Crie uma senha primeiramente."):notPasswords.style.display="none",savedPasswords.forEach(b=>{const c=document.createElement("div");c.classList.add("option-content-pass");const d=document.createElement("div");d.classList.add("one-area");const e=document.createElement("div");e.classList.add("rigth-area");const f=document.createElement("i");f.classList.add("bi","bi-clipboard");const g=document.createElement("div");g.innerHTML="For\xE7a da senha: ",g.classList.add("showpassio");const h=document.createElement("h4");h.textContent=b.passwordStrength,h.classList.add("force-set");const i=document.createElement("div");i.classList.add("status-div"),"Forte"===b.passwordStrength?i.classList.add("strongest"):"Fraca"===b.passwordStrength?i.classList.add("weak"):"M\xE9dia"===b.passwordStrength&&i.classList.add("medium"),g.appendChild(h),g.appendChild(i);const j=document.createElement("i");j.classList.add("bi","bi-cloud-arrow-up"),j.addEventListener("click",async()=>{exportSinglePassword(b.password,b.appName,b.dateCreated,b.hash,b.useSpecialChars,b.useRandomNumbers,b.useCaseSensitive,b.passwordStrength)});const k=document.createElement("h3");k.classList.add("app-pass"),k.textContent=b.appName;const l=document.createElement("h4");l.classList.add("showpass"),l.textContent="Mostrar Senha",f.addEventListener("click",async()=>{const a=await decryptPassword(b.password);copyToClipboard(a),toast("Senha copiada com sucesso"),f.classList.add("bi-clipboard-check"),f.classList.remove("bi-clipboard"),setTimeout(()=>{f.classList.remove("bi-clipboard-check"),f.classList.add("bi-clipboard")},2e3)});const m=document.createElement("i");m.classList.add("bi","bi-trash3"),m.addEventListener("click",()=>{const c=savedPasswords.indexOf(b);savedPasswords.splice(c,1),localStorage.setItem("savedPasswords",JSON.stringify(savedPasswords)),displayPasswords(),a()}),l.addEventListener("click",async()=>{backInfoPass.classList.add("active");const a=await decryptPassword(b.password);updateDados(b.appName,a,b.dateCreated,b.passwordStrength,b.useRandomNumbers,b.useCaseSensitive,b.useSpecialChars)}),d.appendChild(j),d.appendChild(k),e.appendChild(l),e.appendChild(g),e.appendChild(m),e.appendChild(f),c.appendChild(d),c.appendChild(e),listPasswordsContent.appendChild(c);const n=calculatePasswordStrength(b.password,b.useSpecialChars,b.useRandomNumbers,b.useCaseSensitive);"Forte"===n?strongCount++:"M\xE9dia"===n?mediumCount++:weakCount++}),totalPasswords.textContent=`Total de senhas: ${savedPasswords.length}`,weakPasswords.textContent=`Senhas Fracas: ${weakCount}`,mediumPasswords.textContent=`Senhas Médias: ${mediumCount}`,strongPasswords.textContent=`Senhas Boas: ${strongCount}`}function calculatePasswordStrength(a,b,c,d){let e=0;switch(12<=a.length?e+=2:8<=a.length&&(e+=1),b&&(e+=2),c&&(e+=1),d&&(e+=1),e){case 5:case 6:return"Forte";case 3:case 4:return"M\xE9dia";case 1:case 2:default:return"Fraca";}}const baseurl="https://app-npass.vercel.app/send-email";function toast(a){const b=document.querySelector(".back-toast"),c=document.querySelector(".text-toast");return b.classList.add("active"),c.textContent=a,void setTimeout(()=>{b.classList.add("animate__animated","animate__fadeOut"),setTimeout(()=>(b.classList.remove("active"),void b.classList.remove("animate__animated","animate__fadeOut")),1e3)},3e3)}function toastSaveChange(){const a=document.querySelector(".back-toastchange"),b=document.querySelector(".text-toast1").textContent="Para salvar as altera\xE7\xF5es, reinicie a pagina",c=document.querySelector(".bi-arrow-clockwise");return c.addEventListener("click",()=>{location.reload()}),void setTimeout(()=>{a.classList.add("active"),setTimeout(()=>{a.classList.add("animate__animated","animate__fadeOut"),setTimeout(()=>(a.classList.remove("active"),void a.classList.remove("animate__animated","animate__fadeOut")),1e3)},5e3)},4e3)}const showDialogToGetPasswordsBtn=document.querySelector(".receber-senhas"),closeDRS=document.querySelector(".close-dialog-get-pass"),dialogSetEmail=document.querySelector(".back-setemailuser"),sendEmailBtn=document.querySelector(".send-email");showDialogToGetPasswordsBtn.addEventListener("click",()=>{dialogSetEmail.classList.add("active")}),closeDRS.addEventListener("click",()=>{dialogSetEmail.classList.remove("active")}),sendEmailBtn.addEventListener("click",()=>{dialogSetEmail.classList.remove("active");const a=document.querySelector("#email-user").value;if(console.log(a),a){const b=JSON.parse(localStorage.getItem("savedPasswords")||[]);0<b.length?sendEmailWithPasswords(a,b):toast("Nenhuma senha para salvar")}else toast("Email Inv\xE1lido")}),document.querySelector(".export").addEventListener("click",exportPasswords),document.querySelector(".import").addEventListener("change",importPasswords),document.querySelector(".import-onepass").addEventListener("change",importSinglePassword),document.querySelector(".import-trigger").addEventListener("click",()=>{document.querySelector(".import").click()}),document.querySelector(".import-pass").addEventListener("click",()=>{document.querySelector(".import-onepass").click()});async function exportKey(a){const b=await crypto.subtle.exportKey("raw",a);return btoa(String.fromCharCode(...new Uint8Array(b)))}async function exportPasswords(){const b=JSON.parse(localStorage.getItem("savedPasswords"))||[],c=await getKey(),d=await exportKey(c),e=await encryptData({version:"1.0",passwords:b},c),f=new Blob([JSON.stringify({key:d,data:e})]),g=URL.createObjectURL(f),h=document.createElement("a");h.href=g,h.download="passwords.nps",h.click(),URL.revokeObjectURL(g)}async function importKey(a){const b=Uint8Array.from(atob(a),a=>a.charCodeAt(0));return await crypto.subtle.importKey("raw",b,{name:"AES-GCM",length:256},!0,["encrypt","decrypt"])}async function importPasswords(a){const b=a.target.files[0];if(!b)return void console.error("Nenhum arquivo selecionado");const c=new FileReader;c.onload=async function(a){try{console.log("Arquivo lido com sucesso");const b=JSON.parse(a.target.result),c=await importKey(b.key);console.log("Chave importada com sucesso");const d=await decryptData(b.data,c);if("1.0"!==d.version)throw console.error("Vers\xE3o de arquivo n\xE3o suportada"),new Error("Vers\xE3o de arquivo n\xE3o suportada");const e=d.passwords,f=JSON.parse(localStorage.getItem("savedPasswords"))||[];e.forEach(a=>{const b=f.find(b=>b.id===a.id);b?console.warn(`Senha com ID ${a.id} já existe e não será adicionada novamente.`):f.push(a)}),localStorage.setItem("savedPasswords",JSON.stringify(f)),toast("Senhas importadas com sucesso!"),toastSaveChange()}catch(a){console.error("Erro ao importar senhas: ",a),toast("Falha ao importar senhas: Arquivo imcompativel ou desatualizado")}},c.readAsText(b)}async function importSinglePassword(a){const b=a.target.files[0];if(!b)return void console.error("Nenhum arquivo selecionado");const c=new FileReader;c.onload=async function(a){try{toast("Arquivo lido com sucesso");const b=JSON.parse(a.target.result),c=await importKey(b.key);if(console.log(`Chave importada com sucesso`),"1.0"!==b.data.version)throw console.error("Vers\xE3o de arquivo n\xE3o suportada"),new Error("Vers\xE3o de arquivo n\xE3o suportada");const d={id:generateUniqueId(),password:b.data.password,appName:b.data.appName,dateCreated:"> Importado em: "+new Date().toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"}),hash:b.data.hash,useSpecialChars:b.data.useSpecialChars,useRandomNumbers:b.data.useRandomNumbers,useCaseSensitive:b.data.useCaseSensitive,passwordStrength:b.data.passwordStrength},e=JSON.parse(localStorage.getItem("savedPasswords"))||[];e.push(d),localStorage.setItem("savedPasswords",JSON.stringify(e)),toast(`Senha importada com sucesso!`),toastSaveChange()}catch(a){console.error("Erro ao importar senha: ",a),toast("Falha ao importar senha: Arquivo icompat\xEDvel ou desatualizado!")}},c.readAsText(b)}async function encryptData(a,b){const c=new TextEncoder().encode(JSON.stringify(a)),d=crypto.getRandomValues(new Uint8Array(12)),e=await crypto.subtle.encrypt({name:"AES-GCM",iv:d},b,c),f=new Uint8Array(e),g=new Uint8Array(d.byteLength+f.byteLength);return g.set(d,0),g.set(f,d.byteLength),btoa(String.fromCharCode(...g))}async function decryptData(a,b){const c=Uint8Array.from(atob(a),a=>a.charCodeAt(0)),d=c.slice(0,12),e=c.slice(12),f=await crypto.subtle.decrypt({name:"AES-GCM",iv:d},b,e);return JSON.parse(new TextDecoder().decode(f))}async function encryptPassword(a){const b=new TextEncoder().encode(a),c=await getKey(),d=crypto.getRandomValues(new Uint8Array(12)),e=await crypto.subtle.encrypt({name:"AES-GCM",iv:d},c,b);return{iv:btoa(String.fromCharCode(...d)),encrypted:btoa(String.fromCharCode(...new Uint8Array(e)))}}async function decryptPassword(a){const b=Uint8Array.from(atob(a.iv),a=>a.charCodeAt(0)),c=Uint8Array.from(atob(a.encrypted),a=>a.charCodeAt(0)),d=await getKey(),e=await crypto.subtle.decrypt({name:"AES-GCM",iv:b},d,c);return new TextDecoder().decode(e)}async function getKey(){const a=await crypto.subtle.importKey("raw",new TextEncoder().encode("some-unique-password"),{name:"PBKDF2"},!1,["deriveKey"]),b=await crypto.subtle.deriveKey({name:"PBKDF2",salt:new TextEncoder().encode("some-salt"),iterations:1e5,hash:"SHA-256"},a,{name:"AES-GCM",length:256},!0,["encrypt","decrypt"]);return b}async function sendEmailWithPasswords(a,b){const c=await Promise.all(b.map(async a=>{const b=await decryptPassword(a.password);return{...a,password:b}}));fetch(baseurl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:a,passwords:c})}).then(a=>a.json()).then(a=>{"Email sent successfully."===a.message?toast("Email enviado com sucesso!"):toast("Erro ao enviar email.")}).catch(a=>{console.error("Error:",a),toast("Erro ao enviar email.")})}const showClearLocal=document.querySelector(".clear-cache"),dialogClearCache=document.querySelector(".back-dialog-clear");showClearLocal.addEventListener("click",()=>{dialogClearCache.classList.add("active")});const btnClearCache=document.querySelector(".confirm-dialog-clear-cache"),btnCancel=document.querySelector(".close-dialog-clear-cache");btnCancel.addEventListener("click",()=>{dialogClearCache.classList.remove("active")}),btnClearCache.addEventListener("click",()=>{dialogClearCache.classList.remove("active"),localStorage.removeItem("savedPasswords"),toast("Suas senhas foram deletadas com sucesso do seu navegador!")});const generatePassBtn=document.querySelector(".generatepassbtn"),savePassBtn=document.querySelector(".savepassbtn"),output=document.querySelector(".output"),textoutput=document.querySelector(".text-output"),copyPass=document.querySelector(".bi-clipboard");localStorage.getItem("password-output")&&(textoutput.textContent=`Senha atual gerada: ${localStorage.getItem("password-output")}`,output.classList.add("active"),copyPass.addEventListener("click",()=>{copyPass.classList.add("bi-clipboard-check"),copyPass.classList.remove("bi-clipboard");const a=textoutput.textContent;copyToClipboard(a),setTimeout(()=>{copyPass.classList.add("bi-clipboard"),copyPass.classList.remove("bi-clipboard-check")},4e3)}),setTimeout(()=>{output.classList.remove("active"),textoutput.textContent=""},5e4)),generatePassBtn.addEventListener("click",()=>{const a=parseInt(document.querySelector("#length-pass").value,10);return isNaN(a)||8>a?(toast("O n\xFAmero de caracteres deve ser pelo menos 8 para uma melhor seguran\xE7a!"),void loadingDialog.classList.remove("active")):25<a?(toast("N\xFAmero m\xE1ximo de caracteres atingido! Use menor do que 25 e maior do que 8!"),void loadingDialog.classList.remove("active")):void generatePassword(!1)}),savePassBtn.addEventListener("click",()=>{const a=parseInt(document.querySelector("#length-pass").value,10);return isNaN(a)||8>a?(toast("O n\xFAmero de caracteres deve ser pelo menos 8 para uma melhor seguran\xE7a!"),void loadingDialog.classList.remove("active")):25<a?(toast("N\xFAmero m\xE1ximo de caracteres atingido! Use menor do que 25 e maior do que 8!"),void loadingDialog.classList.remove("active")):void showDialog("newP")});function showDialog(a){const b=document.querySelector(".back-dialog-infor"),c=document.querySelector(".aviso-d"),d=document.querySelector(".title-dialog"),e=document.querySelector(".aviso"),f=document.querySelector(".close-dialog"),g=document.querySelector(".new-d"),h=document.querySelector("#name-app"),i=document.querySelector(".next-dialog"),j=document.querySelector(".close-dialog-create-pass");b.classList.add("active"),j.addEventListener("click",()=>{b.classList.remove("active")}),"alert"===a?(c.classList.add("active"),d.textContent="Aviso",e.textContent="Para garantir a seguran\xE7a de suas senhas, armazenamos seus dados criptografados localmente no navegador. Embora n\xE3o sejam enviados a servidores, \xE9 essencial manter seu dispositivo seguro e realizar backups peri\xF3dicos, pois a limpeza do cache ou a desinstala\xE7\xE3o do navegador podem resultar na perda de suas informa\xE7\xF5es. Nosso site assegura a prote\xE7\xE3o de suas informa\xE7\xF5es pessoais, mas n\xE3o nos responsabilizamos por infec\xE7\xF5es de v\xEDrus no seu dispositivo ou pela exclus\xE3o de dados devido \xE0 limpeza do cache ou desinstala\xE7\xE3o do navegador. Agradecemos por utilizar nosso site. Aproveite e guarde suas senhas de forma segura, evitando compartilh\xE1-las.",f.removeEventListener("click",handleCloseDialogClick),f.addEventListener("click",handleCloseDialogClick)):"newP"==a&&(g.classList.add("active"),i.removeEventListener("click",handleNextDialogClick),i.addEventListener("click",handleNextDialogClick))}function handleCloseDialogClick(){generatePassword();const a=document.querySelector(".back-dialog-infor"),b=document.querySelector(".aviso-d");a.classList.remove("active"),b.classList.remove("active")}function handleNextDialogClick(){const a=document.querySelector(".new-d"),b=document.querySelector(".aviso-d"),c=document.querySelector(".title-dialog"),d=document.querySelector(".aviso"),e=document.querySelector(".close-dialog"),f=document.querySelector("#name-app");a.classList.remove("active"),b.classList.add("active"),c.textContent="Aviso",d.textContent="Para garantir a seguran\xE7a de suas senhas, armazenamos seus dados criptografados localmente no navegador. Embora n\xE3o sejam enviados a servidores, \xE9 essencial manter seu dispositivo seguro e realizar backups peri\xF3dicos, pois a limpeza do cache ou a desinstala\xE7\xE3o do navegador podem resultar na perda de suas informa\xE7\xF5es. Nosso site assegura a prote\xE7\xE3o de suas informa\xE7\xF5es pessoais, mas n\xE3o nos responsabilizamos por infec\xE7\xF5es de v\xEDrus no seu dispositivo ou pela exclus\xE3o de dados devido \xE0 limpeza do cache ou desinstala\xE7\xE3o do navegador. Agradecemos por utilizar nosso site. Aproveite e guarde suas senhas de forma segura, evitando compartilh\xE1-las.",e.removeEventListener("click",handleCloseDialogNewPassword),e.addEventListener("click",handleCloseDialogNewPassword.bind(null,f.value||"[App Sem Nome]"))}function handleCloseDialogNewPassword(a){generatePassword(!0,a);const b=document.querySelector(".back-dialog-infor"),c=document.querySelector(".aviso-d");b.classList.remove("active"),c.classList.remove("active")}const settingsAdvancedBtn=document.querySelector(".settings-advanced"),settingsNormalBtn=document.querySelector(".settings-normal"),advancedContent=document.querySelector(".advanced-content"),useSpecialCharsSwicth=document.querySelector("#chk1"),useRandomNumbersSwitch=document.querySelector("#chk2"),useCaseSensitiveSwitch=document.querySelector("#chk3");settingsAdvancedBtn.addEventListener("click",()=>{advancedContent.classList.add("active"),settingsAdvancedBtn.classList.add("active"),settingsNormalBtn.classList.remove("active")}),settingsNormalBtn.addEventListener("click",()=>{useCaseSensitiveSwitch.checked=!1,useRandomNumbersSwitch.checked=!1,useSpecialCharsSwicth.checked=!1,advancedContent.classList.remove("active"),settingsAdvancedBtn.classList.remove("active"),settingsNormalBtn.classList.add("active")});function generatePassword(a=!1,b="Aplicativo Desconhecido"){function c(a,b,c){h.style.width=100*(a/5)+"%",g.textContent=b,setTimeout(c,1e3)}const d=document.querySelector("#name-user").value||"",e=parseInt(document.querySelector("#length-pass").value,10),f=document.querySelector(".loading-back"),g=document.querySelector(".loading-text"),h=document.querySelector(".progress");f.classList.add("active"),c(1,"Validando o n\xFAmero de caracteres..."),()=>isNaN(e)||8>e?(toast("O n\xFAmero de caracteres deve ser pelo menos 8 para uma melhor seguran\xE7a!"),void f.classList.remove("active")):25<e?(toast("N\xFAmero m\xE1ximo de caracteres atingido! Use menor do que 25 e maior do que 8!"),void f.classList.remove("active")):void 0,c(2,"Analisando escolhas de caracteres",()=>{const g=d.slice(0,3);let h,i,j,k="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";useSpecialCharsSwicth.checked?(k+="!@#$%^&*()_+{}:\"<>?|[];',./`~",h=!0):h=!1,useRandomNumbersSwitch.checked?(k+="0123456789",j=!0):j=!1,useCaseSensitiveSwitch.checked?i=!0:(k=k.toLowerCase(),i=!1),c(3,"Gerando sua senha do seu jeito :)",()=>{let d="";for(let a=0;a<e;a++)d+=k.charAt(Math.floor(Math.random()*k.length));const l=g+d;localStorage.setItem("password-output",l),output.classList.add("active"),textoutput.textContent=`Sua senha gerada: ${l}`,copyPass.addEventListener("click",()=>{copyPass.classList.add("bi-clipboard-check"),copyPass.classList.remove("bi-clipboard"),copyToClipboard(l),setTimeout(()=>{copyPass.classList.add("bi-clipboard"),copyPass.classList.remove("bi-clipboard-check")},4e3)}),setTimeout(()=>{output.classList.remove("active"),textoutput.textContent=""},5e4),c(4,"Calculando a seguran\xE7a da senha...",()=>{const d=calculatePasswordStrength(l,h,j,i);if(a?(toast("Erro ao gerar senha"),f.classList.remove("active")):(toast(`Senha Gerada: ${l} (Segurança: ${d})`),setTimeout(()=>{f.classList.remove("active")},2e3)),a){c(5,"Salvando sua senha...");const a={id:generateUniqueId(),password:l,appName:b,dateCreated:new Date().toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"}),useSpecialChars:h,useRandomNumbers:j,useCaseSensitive:i,passwordStrength:d};hashPassword(l).then(b=>{a.hash=b,savePasswordData(a),toast(`Senha salva no seu navegador! Segurança da senha: ${d}`),f.classList.remove("active"),toastSaveChange()})}else f.classList.remove("active")})})})}async function hashPassword(a){const b=new TextEncoder().encode(a),c=await crypto.subtle.digest("SHA-256",b),d=Array.from(new Uint8Array(c)),e=d.map(a=>a.toString(16).padStart(2,"0")).join("");return e}async function savePasswordData(a){const b=JSON.parse(localStorage.getItem("savedPasswords"))||[],c=await encryptPassword(a.password);a.password=c,b.push(a),localStorage.setItem("savedPasswords",JSON.stringify(b))}function copyToClipboard(a){if(navigator.clipboard)navigator.clipboard.writeText(a).then(()=>{toast("Senha copiada com sucesso!")}).catch(a=>{console.error("Erro ao copiar a senha: ",a),toast("Erro ao copiar a senha")});else{const b=document.querySelector("#hidden-password-input");b.value=a,b.select(),document.execCommand("copy"),b.blur(),toast("Senha copiada com sucesso!")}}function generateUniqueId(){return"id-"+new Date().getTime()+"-"+Math.floor(1e4*Math.random())}displayPasswords();