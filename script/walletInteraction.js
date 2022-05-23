const ethereumButton = document.querySelector('.enableEthereumButton');
const showAccount = document.querySelector('.showAccount');
const provider = new ethers.providers.Web3Provider(window.ethereum)
let signer;
let accounts;

ethereumButton.addEventListener('click', () => {
  getAccount();
  signer = provider.getSigner();
  //signerAddress = await ethereum.request({ method: 'eth_requestAccounts' });
});

async function getAccount() {
  accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  ethereumButton.style.display = "none";
  showAccount.style.display = "block";
}