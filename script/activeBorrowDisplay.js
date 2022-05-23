const activeBorrows = document.querySelector('.active-borrows');
const borrowContainer = document.querySelector('.borrow-container');

let borrowArray = new Array();
borrowArray.push('0x14F5e149EA8Ac96932a80b5AFF674D4E8Bc8907a');
borrowArray.push('0xf46F1B651f5A5CB22db31B591285C174f9690a38');
borrowArray.push('0x70C9ad762A424552D593B771eDa429090A890DF2');
borrowArray.push('0xbB19D3a4fdE7aae11cEaCf3EEc73DfBCA10eAC07');

activeBorrows.addEventListener('click', () => {
  displayActiveBorrows();
});

function addToBorrowArray() {
	borrowArray.push(prompt('Type address here'));
}

async function takeBorrow(_borrowAddress) {
/*	var signerAddress = await ethereum.request({ method: 'eth_requestAccounts' });

	var borrowContract = new ethers.Contract(_address, borrowAbi, provider);
	var baseTokenAddress = await borrowContract.baseTokenAddress();

	var baseTokenContract = new ethers.Contract(baseTokenAddress, ERC20Abi, provider);
	// var baseTokensApproved = await baseTokenContract.allowance(signerAddress, _address);

	var baseTokenContractWithSigner = baseTokenContract.connect(signer);
	tx = await baseTokenContractWithSigner.approve(_address, '999999999999999999999999');*/

	var borrowContract = new ethers.Contract(_borrowAddress, borrowAbi, provider);
	var baseTokenAddress = await borrowContract.baseTokenAddress();

	new WinBox("Borrow", {
  width: 272,
  height: 213,
  x: "center",
  y: "center",
  splitscreen: false,
  onresize: function(width, height){
      this.width = 272;
      this.height = 213;
  },
	html: `
		<!DOCTYPE html>
		<html>
		<head>
		    <meta charset='utf-8'>
		    <meta name='viewport' content='width=device-width, initial-scale=1'>
		</head>
		<body>
		    <div class='card-bg'>
		        <div class='create-borrow-content margin-auto text-center'>
		        		<h6>Note: You need to approve before you take a borrow.</h3>
		            <form class='margin-auto text-center' style='padding-top: 18px;'>
		                <button class='btn btn-secondary createBorrowUiButton' type='button' onclick='approveContract("`+_borrowAddress+`", "`+baseTokenAddress+`")'>Approve</button>
		            </form>
		            <form class='margin-auto text-center' style='padding-top: 18px;'>
		                <button class='btn btn-secondary createBorrowUiButton' type='button' onclick='fundWithMarginAndOpen("`+_borrowAddress+`")'>Borrow</button>
		            </form>
		        </div>
		    </div>
		</body>
		</html>`
	});
}

async function fundWithMarginAndOpen(_address, _extraMargin = '0') {
    var borrowContract = new ethers.Contract(_address, borrowAbi, provider);
    var borrowContractWithSigner = await borrowContract.connect(signer);
    tx = await borrowContractWithSigner.fundWithMarginAndOpen(_extraMargin);
}

async function NewBorrowCard(_address) {

	var borrowContract = new ethers.Contract(_address, borrowAbi, provider);
	var state = await borrowContract.state();

	if (state == 1) {
		var tokensForBorrow = await borrowContract.tokensForBorrow();
		var tokensForBorrowAddress = await borrowContract.tokensForBorrowAddress();
		var baseTokenAddress = await borrowContract.baseTokenAddress();
		var maintanenceMargin = await borrowContract.maintanenceMargin();
		var tokensForBorrowAddress = await borrowContract.tokensForBorrowAddress();

		var tokensForBorrowContract = new ethers.Contract(tokensForBorrowAddress, ERC20Abi, provider);
		var tokensForBorrowTicker = await tokensForBorrowContract.symbol();

		var baseTokenContract = new ethers.Contract(baseTokenAddress, ERC20Abi, provider);
		var baseTokenTicker = await baseTokenContract.symbol();

		var $div = $(`
									<div class="col">
								    <div class="card card-bg" style="width: 18rem;">
								      <div class="card-body text">
								        <h3 class="text">`+ ethers.utils.formatUnits(tokensForBorrow, 18) + ` ` + tokensForBorrowTicker + `</h3>
								      </div>
								      <ul class="list-group list-group-flush list-group-mine">
								        <li class="list-group-item">Margin token:</li>
								        <li class="list-group-item">` + baseTokenTicker + `</li>
								        <li class="list-group-item">Maintanance margin:</li>
								        <li class="list-group-item">` + ethers.utils.formatUnits(maintanenceMargin, 18) + `%</li>
								        <li class="list-group-item">Expiry:</li>
								        <li class="list-group-item">N/A</li>
								      </ul>
								      <div class="card-body">
								        <div class="row">
								          <div class="col">
								            <button class="btn btn-primary" type="submit" onclick=takeBorrow('` + _address + `')>Borrow</button>
								          </div>
								        </div>
								      </div>
								    </div>
							    </div>
		`);
		$(".borrow-container").append($div);
	}
}

function displayActiveBorrows() {
	borrowContainer.innerHTML= "";
  myPositions.classList.remove("active");
  activeBorrows.classList.add("active");
	for (var i = borrowArray.length - 1; i >= 0; i--) {
		NewBorrowCard(borrowArray[i]);
	}
}
displayActiveBorrows();
// add a default array of borrow addresses, enumerate through and add to borrowContainer

