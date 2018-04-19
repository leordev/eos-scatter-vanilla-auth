let scatter = null;

const scatterDetection = setTimeout(() => {
  if(scatter == null) {
    contentInstallStep();
  }
}, 5000);

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

  var installLink = document.createElement('a');
  installLink.textContent = 'Install Scatter Wallet';
  installLink.setAttribute('rel','chrome-webstore-item');
  installLink.setAttribute('href','https://chrome.google.com/webstore/detail/gmbgaklkmjakoegficnlkhebmhkjfich');
  replaceContent([newContent, installLink]);
}

const identityStep = () => {
  var newContent = document.createElement('p');
  newContent.innerHTML = 'Ok! Now we need your Wallet identification! Which one do you want to use?';
  replaceContent([newContent]);
}
