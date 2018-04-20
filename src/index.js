(() => {
  let scatter = null;

  const scatterDetection = setTimeout(() => {
    if(scatter == null) {
      contentInstallStep();
    }
  }, 5000);

  setTimeout(() => {
    if (!chrome.app.isInstalled) {
      clearTimeout(scatterDetection);
      if(scatter == null) {
        contentInstallStep();
      }
    }
  }, 1000);

  const replaceContent = newContent => {
    var content = document.getElementById('content');
    content.innerHTML = '';
    newContent.forEach(item => content.appendChild(item));
  }

  document.addEventListener('scatterLoaded', scatterExtension => {
      clearTimeout(scatterDetection);
      scatter = window.scatter;
      identityStep();
  });

  const contentInstallStep = () => {
    var newContent = document.createElement('p');
    newContent.innerHTML = 'First Step: You need to install our Extension Wallet to be protected, handle your identities and tokens. It\'s a one time process and it\'s super easy!';

    const chromeInstall = () => chrome.webstore.install(null, installationSuccess, installationFail);

    const installAction = document.createElement('a');
    installAction.textContent = 'Install Scatter Wallet';
    installAction.setAttribute('href','javascript:;');
    installAction.addEventListener('click', chromeInstall);

    replaceContent([newContent, installAction]);
  }

  const installationSuccess = () => {
    var newContent = document.createElement('p');
    newContent.innerHTML = 'Ok, the Scatter Wallet was installed Successfully! Now you need to create your first Identity and we will generate the account for you... TODO: account generation endpoint';
    replaceContent([newContent]);
  }

  const installationFail = () => {
    return installationSuccess(); // TODO: remove it when the chrome store is working
    var newContent = document.createElement('p');
    newContent.className = 'has-text-danger';
    newContent.innerHTML = 'The installation has failed, please refresh the page and try again';
    replaceContent([newContent]);
  }

  const identityStep = () => {
    var newContent = document.createElement('p');
    newContent.innerHTML = 'Ok! Now we need your Wallet identification! Which one do you want to use?';
    replaceContent([newContent]);
  }
})();
