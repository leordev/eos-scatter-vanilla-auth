import axios from 'axios'
import ecc from 'eosjs-ecc'
import Eos from 'eosjs'

(() => {
    const apiBaseUrl = 'http://localhost:4000/api';
    const apiSignupUrl = apiBaseUrl + '/chain/signup';
    const network = {host: "127.0.0.1", port: 8888};
    const eosOptions = {};
    let eos = null;

    let scatter = null;

    const scatterDetection = setTimeout(() => {
        if (scatter == null) {
            contentInstallStep();
        }
    }, 5000);

    setTimeout(() => {
        if (!chrome.app.isInstalled) {
            clearTimeout(scatterDetection);
            if (scatter == null) {
                contentInstallStep();
            }
        }
    }, 1000);

    const replaceContent = newContent => {
        const content = document.getElementById('content');
        content.innerHTML = '';
        newContent.forEach(item => content.appendChild(item));
    };

    document.addEventListener('scatterLoaded', scatterExtension => {
        clearTimeout(scatterDetection);
        scatter = window.scatter;
        scatter.requireVersion(3.0);
        window.scatter = null;
        eos = scatter.eos(Eos.Localnet, network, eosOptions);

        if(scatter.identity) {
            homeContent();
        } else {
            identityStep();
        }
    });

    const homeContent = () => {
        const newContent = document.createElement('p');
        newContent.innerHTML = 'Welcome aboard ' + scatter.identity.name;

        replaceContent([newContent]);
    };

    const contentInstallStep = () => {
        const newContent = document.createElement('p');
        newContent.innerHTML = 'First Step: You need to install our Extension Wallet to be protected, handle your identities and tokens. It\'s a one time process and it\'s super easy!';

        const chromeInstall = () => chrome.webstore.install(null, identityStep, installationFail);

        const installAction = document.createElement('a');
        installAction.textContent = 'Install Scatter Wallet';
        installAction.setAttribute('href', 'javascript:;');
        installAction.addEventListener('click', chromeInstall);

        replaceContent([newContent, installAction]);
    };

    const installationFail = (error) => {
        console.error(error);
        const newContent = document.createElement('p');
        newContent.className = 'has-text-danger';
        newContent.innerHTML = 'The installation has failed, please install manually from Chrome Extensions Store and refresh this page';

        const manualInstall = document.createElement('a');
        manualInstall.textContent = 'Install Scatter Wallet from Chrome Store';
        manualInstall.setAttribute('href', 'https://chrome.google.com/webstore/detail/scatter/ammjpmhgckkpcamddpolhchgomcojkle');
        manualInstall.setAttribute('target', '_blank');

        replaceContent([newContent, manualInstall]);
    };

    const requestIdentity = () => {
        scatter.getIdentity(['account']).then(() => {
            homeContent();
        }).catch(error => {
            console.error(error);
        });
    };

    const newAccount = (tries = 0) => {
        if (tries > 5) {
            alert("Error while creating account... Check the blockchain servers that you are using, " +
                "try again in a few or report an issue on GitHub :P");
            return false;
        }

        ecc.randomKey().then(privateKey => {
            const publicKey = ecc.privateToPublic(privateKey);

            const data = {
                ownerKey: publicKey,
                activeKey: publicKey
            };

            axios.post(apiSignupUrl, data).then(res => {
                contentAccountCreated({data, accountName: res.data.account}, privateKey);
            }).catch(e => {
                console.error('account creation exception', e);
                newAccount(tries + 1); // Recursing, probably existing name or invalid character.
            });
        })
    };

    const contentAccountCreated = (data, privateKey) => {
        const newContent = document.createElement('p');
        newContent.innerHTML = 'Woohooo! Your account was created! Now, pay attention! ' +
            'You must write down the following private key and keep it in a safe place from ' +
            'anyone that\'s not you. This private key is the only thing that you have ' +
            'to enable the full control of your account!';

        const accountName = document.createElement('p');
        accountName.innerHTML = '<strong>Account Name:</strong> ' + data.accountName;

        const privateKeyContent = document.createElement('p');
        privateKeyContent.innerHTML = `<strong>Private Key:</strong> ${privateKey}<br/>&nbsp;<br/>`;

        const scatterContent = document.createElement('p');
        scatterContent.innerHTML = 'Okay, now that you saved your private key safely, ' +
            'it\'s time to create a Scatter identity! So you are going to copy the above ' +
            'private key to your clipboard and on the right top hand side of the browser you ' +
            'will click in the Scatter icon. It\'s a blue square with white S. <br/>&nbsp;<br/>' +
            '1) If it\'s the first time using Scatter you must setup a password for your Scatter wallet.<br/>' +
            '2) Then, after unlock Scatter, click in Identities and click on Create Identity!<br/>' +
            '3) Now you will paste the private key that and select your account name!<br/>' +
            'Click on save and that\'s it! You are all set. If you want you can fill all the ' +
            'identity fields as Name, birth date, address. It\'s a one time process that you can ' +
            'reutilize from now on in all Next generation Decentralized apps as [Test Platform]!!!<br/>&nbsp;<br/>' +
            'Finally, just click on the Login button below and provide your created identity to ' +
            'start play on [Test Plaform]!<br/>&nbsp;<br/>';


        const loginButton = document.createElement('a');
        loginButton.textContent = 'Login';
        loginButton.className = 'button is-info';
        loginButton.setAttribute('href', 'javascript:;');
        loginButton.addEventListener('click', requestIdentity);

        replaceContent([newContent, accountName, privateKeyContent, scatterContent, loginButton]);
    };

    const identityStep = () => {
        const newContent = document.createElement('p');
        newContent.innerHTML = 'Ok, we see that you have Scatter! ' +
            'If you don\'t have any account yet, click on the below button Generate Account. ' +
            'Otherwise, if you already have a Scatter Identity linked to an Account ' +
            'click in the Login button and we will request your identity!';

        const accountLink = document.createElement('a');
        accountLink.textContent = 'Generate Account';
        accountLink.className = 'button is-danger';
        accountLink.setAttribute('href', 'javascript:;');
        accountLink.addEventListener('click', () => newAccount());

        const loginButton = document.createElement('a');
        loginButton.textContent = 'Login';
        loginButton.className = 'button is-info';
        loginButton.style = 'margin-left: 15px;';
        loginButton.setAttribute('href', 'javascript:;');
        loginButton.addEventListener('click', requestIdentity);

        replaceContent([newContent, accountLink, loginButton]);
    }
})();
