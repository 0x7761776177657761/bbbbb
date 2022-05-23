const myPositions = document.querySelector('.my-positions');

myPositions.addEventListener('click', () => {
  displayPositons();
});

async function showPositionCard(_address) {

	var borrowContract = new ethers.Contract(_address, borrowAbi, provider);
	var state = await borrowContract.state();

	if (state == 2) {
		var tokensForBorrow = await borrowContract.tokensForBorrow();
		var tokensForBorrowAddress = await borrowContract.tokensForBorrowAddress();
		var baseTokenAddress = await borrowContract.baseTokenAddress();
		var tokensForBorrowAddress = await borrowContract.tokensForBorrowAddress();

		var tokensForBorrowContract = new ethers.Contract(tokensForBorrowAddress, ERC20Abi, provider);
		var tokensForBorrowTicker = await tokensForBorrowContract.symbol();

		var baseTokenContract = new ethers.Contract(baseTokenAddress, ERC20Abi, provider);
		var baseTokenTicker = await baseTokenContract.symbol();
		var baseTokenBalance = await baseTokenContract.balanceOf(_address);

		var $div = $(`
						<div class="col">
						    <div class="card card-bg" style="width: 18rem;">
						      <div class="card-body text">
						        <h3 class="text">`+ ethers.utils.formatUnits(tokensForBorrow, 18) + ` ` + tokensForBorrowTicker + `</h3>
						      </div>
						      <ul class="list-group list-group-flush list-group-mine">
						        <li class="list-group-item">Available collateral:</li>
						        <li class="list-group-item">` + baseTokenBalance + ` ` + baseTokenTicker + `</li>
						        <li class="list-group-item">PnL:</li>
						        <li class="list-group-item">N/A</li>
						        <li class="list-group-item">Liquidation price:</li>
						        <li class="list-group-item">N/A</li>
						        <li class="list-group-item">Expiry:</li>
						        <li class="list-group-item">N/A</li>
						      </ul>
						      <div class="card-body">
						        <div class="row">
						          <div class="col">
						            <button class="btn btn-outline-primary" type="submit" onclick=addCollateral('` + _address + `')>Add more collateral</button>
						            <button class="btn btn-primary" type="submit" onclick=closeBorrow('` + _address + `')>Close</button>
						          </div>
						        </div>
						      </div>
						    </div>
					    </div>
		`);
		$(".borrow-container").append($div);
	}
}

async function closeBorrow(_address) {
	var borrowContract = new ethers.Contract(_address, borrowAbi, provider);
	var borrowContractWithSigner = await borrowContract.connect(signer);
	tx = await borrowContractWithSigner.close();
}

function addCollateral(_address) {
	alert("Liquidations are disabled for this round of alpha testing. Adding more collateral is not needed.")
}


function displayPositons() {
	if (accounts == null) {
		alert("Please connect your wallet to display your currently active positions.")
	} else {
		borrowContainer.innerHTML= "";
		activeBorrows.classList.remove("active");
	  	myPositions.classList.add("active");
		for (var i = borrowArray.length - 1; i >= 0; i--) {
			showPositionCard(borrowArray[i]);
		}
	}
}


/*
100 UNI
Available Collateral
x
PnL
x
Liquidation price
x
|Add more collateral|
|close|
*/