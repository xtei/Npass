const btnCookies=document.querySelector(".close-bottom-cookies"),dialogCookies=document.querySelector(".back-container-bottom-cookies");"enabled"===localStorage.getItem("cookies")&&(dialogCookies.style.display="none"),btnCookies.addEventListener("click",()=>{localStorage.setItem("cookies","enabled"),dialogCookies.style.display="none"});const sidebar=document.querySelector(".side-bar"),btnShowSidebar=document.querySelector(".toggle-sidebar"),backSideBar=document.querySelector(".back-sidebar"),itensSideBar=document.querySelectorAll(".options-side-bar");backSideBar.addEventListener("click",()=>{sidebar.classList.remove("active"),backSideBar.classList.remove("active")}),btnShowSidebar.addEventListener("click",()=>{sidebar.classList.toggle("active"),backSideBar.classList.toggle("active")});const generatePassSection=document.querySelector(".generatePassSection"),listPasswordsSection=document.querySelector(".list-passwords-content"),listPasswordsContent=document.querySelector(".list-pass-area");itensSideBar.forEach(a=>{a.addEventListener("click",()=>{itensSideBar.forEach(a=>a.classList.remove("active")),a.classList.add("active"),sidebar.classList.remove("active");const b=a.getAttribute("data-section");"generatePass"===b?(generatePassSection.style.display="block",listPasswordsSection.style.display="none"):"listPasswords"===b&&(generatePassSection.style.display="none",listPasswordsSection.style.display="block")})});const mainItem=document.querySelector(".options-side-bar[data-section='generatePass']");mainItem.classList.add("active"),generatePassSection.style.display="block",listPasswordsSection.style.display="none";function exportPassword(a,b){const c=document.createElement("a"),d=new Blob([`Nome do App: ${b}\nPassword: ${a}\nObrigado por usar o NPASS!`],{type:"text/plain"});c.href=URL.createObjectURL(d),c.download=`${b}-password.txt`,document.body.appendChild(c),c.click(),document.body.removeChild(c)}const totalPasswords=document.querySelector("#list-length"),weakPasswords=document.querySelector("#pass-weak"),mediumPasswords=document.querySelector("#pass-medium"),strongPasswords=document.querySelector("#pass-strong"),savedPasswords=JSON.parse(localStorage.getItem("savedPasswords"))||[];let weakCount=0,mediumCount=0,strongCount=0;async function displayPasswords(){async function a(){weakCount=0,mediumCount=0,strongCount=0,savedPasswords.forEach(a=>{const b=calculatePasswordStrength(a.password,a.useSpecialChars,a.useRandomNumbers,a.useCaseSensitive);"Forte"===b?strongCount++:"M\xE9dia"===b?mediumCount++:weakCount++}),totalPasswords.textContent=`Total de senhas: ${savedPasswords.length}`,weakPasswords.textContent=`Senhas Fracas: ${weakCount}`,mediumPasswords.textContent=`Senhas Médias: ${mediumCount}`,strongPasswords.textContent=`Senhas Fortes: ${strongCount}`}listPasswordsContent.innerHTML="",savedPasswords.forEach(b=>{const c=document.createElement("div");c.classList.add("option-content-pass");const d=document.createElement("div");d.classList.add("one-area");const e=document.createElement("div");e.classList.add("rigth-area");const f=document.createElement("i");f.classList.add("bi","bi-clipboard");const g=document.createElement("i");g.classList.add("bi","bi-cloud-arrow-up"),g.addEventListener("click",async()=>{const a=await decryptPassword(b.password);exportPassword(a,b.appName)});const h=document.createElement("h3");h.classList.add("app-pass"),h.textContent=b.appName;const i=document.createElement("h4");i.classList.add("showpass"),i.textContent="Mostrar Senha",i.classList.add("clicked"),i.addEventListener("click",async()=>{if(i.classList.toggle("clicked"),!i.classList.contains("clicked")){const a=await decryptPassword(b.password);i.textContent=a}else i.textContent="Mostrar Senha"}),f.addEventListener("click",async()=>{const a=await decryptPassword(b.password);copyToClipboard(a),toast("Senha copiada com sucesso"),f.classList.add("bi-clipboard-check"),f.classList.remove("bi-clipboard"),setTimeout(()=>{f.classList.remove("bi-clipboard-check"),f.classList.add("bi-clipboard")},2e3)});const j=document.createElement("i");j.classList.add("bi","bi-trash3"),j.addEventListener("click",()=>{const c=savedPasswords.indexOf(b);savedPasswords.splice(c,1),localStorage.setItem("savedPasswords",JSON.stringify(savedPasswords)),displayPasswords(),a()}),d.appendChild(g),d.appendChild(h),e.appendChild(i),e.appendChild(j),e.appendChild(f),c.appendChild(d),c.appendChild(e),listPasswordsContent.appendChild(c);const k=calculatePasswordStrength(b.password,b.useSpecialChars,b.useRandomNumbers,b.useCaseSensitive);"Forte"===k?strongCount++:"M\xE9dia"===k?mediumCount++:weakCount++}),totalPasswords.textContent=`Total de senhas: ${savedPasswords.length}`,weakPasswords.textContent=`Senhas Fracas: ${weakCount}`,mediumPasswords.textContent=`Senhas Médias: ${mediumCount}`,strongPasswords.textContent=`Senhas Fortes: ${strongCount}`}function calculatePasswordStrength(a,b,c,d){let e=0;switch(12<=a.length?e+=2:8<=a.length&&(e+=1),b&&(e+=2),c&&(e+=1),d&&(e+=1),e){case 5:case 6:return"Forte";case 3:case 4:return"M\xE9dia";case 1:case 2:default:return"Fraca";}}const baseurl="https://app-npass.vercel.app/send-email";function toast(a){const b=document.querySelector(".back-toast"),c=document.querySelector(".text-toast");return b.classList.add("active"),c.textContent=a,void setTimeout(()=>{b.classList.add("animate__animated","animate__fadeOut"),setTimeout(()=>(b.classList.remove("active"),void b.classList.remove("animate__animated","animate__fadeOut")),1e3)},3e3)}const showDialogToGetPasswordsBtn=document.querySelector(".receber-senhas"),closeDRS=document.querySelector(".close-dialog-get-pass"),dialogSetEmail=document.querySelector(".back-setemailuser"),sendEmailBtn=document.querySelector(".send-email");showDialogToGetPasswordsBtn.addEventListener("click",()=>{dialogSetEmail.classList.add("active")}),closeDRS.addEventListener("click",()=>{dialogSetEmail.classList.remove("active")}),sendEmailBtn.addEventListener("click",()=>{dialogSetEmail.classList.remove("active");const a=document.querySelector("#email-user").value;if(console.log(a),a){const b=JSON.parse(localStorage.getItem("savedPasswords")||[]);0<b.length?sendEmailWithPasswords(a,b):toast("Nenhuma senha para salvar")}else toast("Email Inv\xE1lido")});async function decryptPassword(a){const{iv:b,encrypted:c}=a,d=await getKey(),e=await crypto.subtle.decrypt({name:"AES-GCM",iv:new Uint8Array(b)},d,new Uint8Array(c));return new TextDecoder().decode(e)}async function getKey(){const a=await crypto.subtle.importKey("raw",new TextEncoder().encode("some-unique-password"),{name:"PBKDF2"},!1,["deriveKey"]),b=await crypto.subtle.deriveKey({name:"PBKDF2",salt:new TextEncoder().encode("some-salt"),iterations:1e5,hash:"SHA-256"},a,{name:"AES-GCM",length:256},!0,["encrypt","decrypt"]);return b}async function sendEmailWithPasswords(a,b){const c=await Promise.all(b.map(async a=>{const b=await decryptPassword(a.password);return{...a,password:b}}));fetch(baseurl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:a,passwords:c})}).then(a=>a.json()).then(a=>{"Email sent successfully."===a.message?toast("Email enviado com sucesso!"):toast("Erro ao enviar email.")}).catch(a=>{console.error("Error:",a),toast("Erro ao enviar email.")})}const showClearLocal=document.querySelector(".clear-cache"),dialogClearCache=document.querySelector(".back-dialog-clear");showClearLocal.addEventListener("click",()=>{dialogClearCache.classList.add("active")});const btnClearCache=document.querySelector(".confirm-dialog-clear-cache"),btnCancel=document.querySelector(".close-dialog-clear-cache");btnCancel.addEventListener("click",()=>{dialogClearCache.classList.remove("active")}),btnClearCache.addEventListener("click",()=>{dialogClearCache.classList.remove("active"),localStorage.clear(),toast("Dados do site deletados do seu navegador com sucesso")});const generatePassBtn=document.querySelector(".generatepassbtn"),savePassBtn=document.querySelector(".savepassbtn"),output=document.querySelector(".output"),textoutput=document.querySelector(".text-output"),copyPass=document.querySelector(".bi-clipboard");localStorage.getItem("password-output")&&(textoutput.textContent=`Senha atual gerada: ${localStorage.getItem("password-output")}`,output.classList.add("active"),copyPass.addEventListener("click",()=>{copyPass.classList.add("bi-clipboard-check"),copyPass.classList.remove("bi-clipboard");const a=textoutput.textContent;copyToClipboard(a),setTimeout(()=>{copyPass.classList.add("bi-clipboard"),copyPass.classList.remove("bi-clipboard-check")},4e3)}),setTimeout(()=>{output.classList.remove("active"),textoutput.textContent=""},5e4)),generatePassBtn.addEventListener("click",()=>{const a=parseInt(document.querySelector("#length-pass").value,10);return isNaN(a)||8>a?(toast("O n\xFAmero de caracteres deve ser pelo menos 8 para uma melhor seguran\xE7a!"),void loadingDialog.classList.remove("active")):25<a?(toast("N\xFAmero m\xE1ximo de caracteres atingido! Use menor do que 25 e maior do que 8!"),void loadingDialog.classList.remove("active")):void generatePassword(!1)}),savePassBtn.addEventListener("click",()=>{const a=parseInt(document.querySelector("#length-pass").value,10);return isNaN(a)||8>a?(toast("O n\xFAmero de caracteres deve ser pelo menos 8 para uma melhor seguran\xE7a!"),void loadingDialog.classList.remove("active")):25<a?(toast("N\xFAmero m\xE1ximo de caracteres atingido! Use menor do que 25 e maior do que 8!"),void loadingDialog.classList.remove("active")):void showDialog("newP")});function showDialog(a){const b=document.querySelector(".back-dialog-infor"),c=document.querySelector(".aviso-d"),d=document.querySelector(".title-dialog"),e=document.querySelector(".aviso"),f=document.querySelector(".close-dialog"),g=document.querySelector(".new-d"),h=document.querySelector("#name-app"),i=document.querySelector(".next-dialog"),j=document.querySelector(".close-dialog-create-pass");b.classList.add("active"),j.addEventListener("click",()=>{b.classList.remove("active")}),"alert"===a?(c.classList.add("active"),d.textContent="Aviso",e.textContent="Para garantir a seguran\xE7a de suas senhas, armazenamos seus dados criptografados localmente no navegador. Embora n\xE3o sejam enviados a servidores, \xE9 essencial manter seu dispositivo seguro e realizar backups peri\xF3dicos, pois a limpeza do cache ou a desinstala\xE7\xE3o do navegador podem resultar na perda de suas informa\xE7\xF5es. Nosso site assegura a prote\xE7\xE3o de suas informa\xE7\xF5es pessoais, mas n\xE3o nos responsabilizamos por infec\xE7\xF5es de v\xEDrus no seu dispositivo ou pela exclus\xE3o de dados devido \xE0 limpeza do cache ou desinstala\xE7\xE3o do navegador. Agradecemos por utilizar nosso site. Aproveite e guarde suas senhas de forma segura, evitando compartilh\xE1-las.",f.removeEventListener("click",handleCloseDialogClick),f.addEventListener("click",handleCloseDialogClick)):"newP"==a&&(g.classList.add("active"),i.removeEventListener("click",handleNextDialogClick),i.addEventListener("click",handleNextDialogClick))}function handleCloseDialogClick(){generatePassword();const a=document.querySelector(".back-dialog-infor"),b=document.querySelector(".aviso-d");a.classList.remove("active"),b.classList.remove("active")}function handleNextDialogClick(){const a=document.querySelector(".new-d"),b=document.querySelector(".aviso-d"),c=document.querySelector(".title-dialog"),d=document.querySelector(".aviso"),e=document.querySelector(".close-dialog"),f=document.querySelector("#name-app");a.classList.remove("active"),b.classList.add("active"),c.textContent="Aviso",d.textContent="Para garantir a seguran\xE7a de suas senhas, armazenamos seus dados criptografados localmente no navegador. Embora n\xE3o sejam enviados a servidores, \xE9 essencial manter seu dispositivo seguro e realizar backups peri\xF3dicos, pois a limpeza do cache ou a desinstala\xE7\xE3o do navegador podem resultar na perda de suas informa\xE7\xF5es. Nosso site assegura a prote\xE7\xE3o de suas informa\xE7\xF5es pessoais, mas n\xE3o nos responsabilizamos por infec\xE7\xF5es de v\xEDrus no seu dispositivo ou pela exclus\xE3o de dados devido \xE0 limpeza do cache ou desinstala\xE7\xE3o do navegador. Agradecemos por utilizar nosso site. Aproveite e guarde suas senhas de forma segura, evitando compartilh\xE1-las.",e.removeEventListener("click",handleCloseDialogNewPassword),e.addEventListener("click",handleCloseDialogNewPassword.bind(null,f.value||"Aplicativo Desconhecido"))}function handleCloseDialogNewPassword(a){generatePassword(!0,a);const b=document.querySelector(".back-dialog-infor"),c=document.querySelector(".aviso-d");b.classList.remove("active"),c.classList.remove("active")}const settingsAdvancedBtn=document.querySelector(".settings-advanced"),settingsNormalBtn=document.querySelector(".settings-normal"),advancedContent=document.querySelector(".advanced-content");settingsAdvancedBtn.addEventListener("click",()=>{advancedContent.classList.add("active"),settingsAdvancedBtn.classList.add("active"),settingsNormalBtn.classList.remove("active")}),settingsNormalBtn.addEventListener("click",()=>{advancedContent.classList.remove("active"),settingsAdvancedBtn.classList.remove("active"),settingsNormalBtn.classList.add("active")});function generatePassword(a=!1,b="Aplicativo Desconhecido"){function c(a,b,c){p.style.width=100*(a/5)+"%",o.textContent=b,setTimeout(c,1e3)}function d(){return"id-"+new Date().getTime()+"-"+Math.floor(1e4*Math.random())}async function e(a){const b=new TextEncoder().encode(a),c=await crypto.subtle.digest("SHA-256",b),d=Array.from(new Uint8Array(c)),e=d.map(a=>a.toString(16).padStart(2,"0")).join("");return e}async function f(a){const b=JSON.parse(localStorage.getItem("savedPasswords"))||[],c=await g(a.password);a.password=c,b.push(a),localStorage.setItem("savedPasswords",JSON.stringify(b))}async function g(a){const b=new TextEncoder().encode(a),c=await getKey(),d=crypto.getRandomValues(new Uint8Array(12)),e=await crypto.subtle.encrypt({name:"AES-GCM",iv:d},c,b);return{iv:Array.from(d),encrypted:Array.from(new Uint8Array(e))}}const h=document.querySelector("#name-user").value||"",j=parseInt(document.querySelector("#length-pass").value,10),k=document.querySelector("#chk1").checked,l=document.querySelector("#chk2").checked,m=document.querySelector("#chk3").checked,n=document.querySelector(".loading-back"),o=document.querySelector(".loading-text"),p=document.querySelector(".progress");n.classList.add("active"),c(1,"Validando o n\xFAmero de caracteres..."),()=>isNaN(j)||8>j?(toast("O n\xFAmero de caracteres deve ser pelo menos 8 para uma melhor seguran\xE7a!"),void n.classList.remove("active")):25<j?(toast("N\xFAmero m\xE1ximo de caracteres atingido! Use menor do que 25 e maior do que 8!"),void n.classList.remove("active")):void 0,c(2,"Analisando escolhas de caracteres",()=>{const g=h.slice(0,3);let o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";k&&(o+="!@#$%^&*()_+{}:\"<>?|[];',./`~"),l&&(o+="0123456789"),m||(o=o.toLowerCase()),c(3,"Gerando sua senha do seu jeito :)",()=>{let h="";for(let a=0;a<j;a++)h+=o.charAt(Math.floor(Math.random()*o.length));const i=g+h;localStorage.setItem("password-output",i),output.classList.add("active"),textoutput.textContent=`Sua senha gerada: ${i}`,copyPass.addEventListener("click",()=>{copyPass.classList.add("bi-clipboard-check"),copyPass.classList.remove("bi-clipboard"),copyToClipboard(i),setTimeout(()=>{copyPass.classList.add("bi-clipboard"),copyPass.classList.remove("bi-clipboard-check")},4e3)}),setTimeout(()=>{output.classList.remove("active"),textoutput.textContent=""},5e4),c(4,"Calculando a seguran\xE7a da senha...",()=>{const g=calculatePasswordStrength(i,k,l,m);if(a?(toast("Erro ao gerar senha"),n.classList.remove("active")):(toast(`Senha Gerada: ${i} (Segurança: ${g})`),setTimeout(()=>{n.classList.remove("active")},2e3)),a){c(5,"Salvando sua senha...");const a={id:d(),password:i,appName:b,dateCreated:new Date().toISOString(),useSpecialChars:k,useRandomNumbers:l,useCaseSensitive:m};e(i).then(b=>{a.hash=b,f(a),toast(`Senha salva no seu navegador! Segurança da senha: ${g}`),n.classList.remove("active")})}else n.classList.remove("active")})})})}function copyToClipboard(a){if(navigator.clipboard)navigator.clipboard.writeText(a).then(()=>{toast("Senha copiada com sucesso!")}).catch(a=>{console.error("Erro ao copiar a senha: ",a),toast("Erro ao copiar a senha")});else{const b=document.querySelector("#hidden-password-input");b.value=a,b.select(),document.execCommand("copy"),b.blur(),toast("Senha copiada com sucesso!")}}displayPasswords();