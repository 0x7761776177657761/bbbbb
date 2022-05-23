const createBorrowButton = document.querySelector('.createBorrow');
const factoryContract = new ethers.Contract(factoryAddress, factoryAbi, provider);
let factoryContractWithSigner = factoryContract.connect(signer);

// God help whoever is looking at this code

// Parsing input

function countDecimals () {
    if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0; 
}

function parseTokensForBorrow(_number) {
    for (var i = 0; i < 18 - countDecimals(number); i++) {
        _number *= 10;
    }
    return _number
}

async function createBorrow () {
    var _tokensForBorrow = parseTokensForBorrow(document.getElementById('tokensForBorrow').value);
    var _tokensForBorrowAddress = document.getElementById('tokensForBorrowAddress').value;
    var _baseTokenAddress = document.getElementById('baseTokenAddress').value;
    var _maintanenceMargin = parseMaintananceMargin(document.getElementById('maintanenceMargin').value);
    //console.log(_tokensForBorrow+_tokensForBorrowAddress+_baseTokenAddress+_maintanenceMargin);
    factoryContractWithSigner = factoryContract.connect(signer);
    tx = await factoryContractWithSigner.createBorrow(_tokensForBorrow, _tokensForBorrowAddress, _baseTokenAddress, _maintanenceMargin, '0xE592427A0AEce92De3Edee1F18E0157C05861564', '0x4d1892f15B03db24b55E73F9801826a56d6f0755');
}

function parseMaintananceMargin (arg) {
    var temp = 0;
    for (var i = 0; Number.isInteger(Number(arg[i])); i++) {
        if (i == 0) {
            temp += Number(arg[i]);
        } else {
            temp = temp * 10 + Number(arg[i]);
        }
    }

    return ethers.utils.parseUnits(temp.toString(), 18);
}

createBorrowButton.addEventListener('click', () => {
    if (ethereum.selectedAddress != null) {
        factoryContractWithSigner = factoryContract.connect(signer)
        new WinBox({

            class: ["no-full", "my-theme"],
            title: "Create a borrow",
            width: 300,
            height: 410,
            x: "center",
            y: "center",
            splitscreen: false,
            onresize: function(width, height){
                this.width = 300;
                this.height = 405;
            },
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset='utf-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1'>
            </head>
            <body >
                <div class='card-bg'>
                    <div class='create-borrow-content'>
                        <h3>Create a new borrow:</h2>
                        I want to lend:
                        <div class='form-group'>
                        <input type='text' class='form-control' id='tokensForBorrow' placeholder='1000'>
                        <input style='padding-top: 4px;' type='text' class='form-control' id='tokensForBorrowAddress' placeholder='Token address'>
                        </div>
                        ...tokens.
                        <br>
                        The address of the margin token is:
                        <div class='form-group'>
                                <input type='text' class='form-control' id='baseTokenAddress' placeholder='Margin token address'>
                        </div>
                        The maintanance margin will be:
                        <div class='form-group'>
                                <input type='text' class='form-control' id='maintanenceMargin' placeholder='100%'>
                        </div>
                        <form class='margin-auto text-center' style='padding-top: 18px;'>
                            <button class='btn btn-secondary createBorrowUiButton' type='button' onclick='createBorrow()'>Create borrow</button>
                        </form>
                    </div>
                </div>
                <script>

                </script>
            </body>
            </html>`,

            onclose: function(force){
                return !confirm("Are you sure you want to abort?");
            }
        });
        document.getElementById('tokensForBorrowAddress').value = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
        document.getElementById('baseTokenAddress').value = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";

    } else {
        alert("Please connect your wallet.");
    }
});


// Listening for various events related to creating borrows. TODO: Add creator address to logs

// calls function to approve the borrow on creation, doesnt check who created it which is a bit fucked
let newlyCreatedContractAddress = '';
filter = factoryContract.filters.createdBorrow();
factoryContract.on(filter, (address, id) => {
    console.log(address)
    approveContract(address);
    borrowArray.push(address);
    newlyCreatedContractAddress = address;
});

// approves _address to use uniswap TODO: make this use any token
async function approveContract(_address, _tokenAddress = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984') {
    var borrowTokenContract = new ethers.Contract(_tokenAddress, ERC20Abi, provider);
    var borrowTokenContractWithSigner = await borrowTokenContract.connect(signer);
    tx = await borrowTokenContractWithSigner.approve(_address, '999999999999999999999999');
}


const borrowTokenContract0 = new ethers.Contract('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', ERC20Abi, provider); // this is really bad
borrowCreateTokenApprovalfilter = borrowTokenContract0.filters.Approval();
borrowTokenContract0.on(borrowCreateTokenApprovalfilter, (address) => {
    console.log("UNI APPROVED")
    console.log(address)
    fundWithTokensAndOpen(newlyCreatedContractAddress);
});

async function fundWithTokensAndOpen(address) {
    var borrowContract = new ethers.Contract(address, borrowAbi, provider);
    var borrowContractWithSigner = await borrowContract.connect(signer);
    tx = await borrowContractWithSigner.fundWithTokensAndOpen();
    alert("Borrow created and funded. It is now safe to close the Create a borrow window if you wish to do so.");
    displayActiveBorrows();
}
//0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6