 pragma solidity ^0.6.1;

contract Bank {
    // 合約擁有者
    address private owner;

    // 儲存所有會員的餘額
    mapping (address => uint256) private balance;

    // 儲存所有會員的coin餘額
    mapping (address => uint256) private coinBalance;

    // 事件們，用於通知前端 web3.js
    event DepositEvent(address indexed from, uint256 value, uint256 timestamp);
    event WithdrawEvent(address indexed from, uint256 value, uint256 timestamp);
    event TransferEvent(address indexed from, address indexed to, uint256 value, uint256 timestamp);

    event MintEvent(address indexed from, uint256 value, uint256 timestamp);
    event BuyCoinEvent(address indexed from, uint256 value, uint256 timestamp);
    event TransferCoinEvent(address indexed from, address indexed to, uint256 value, uint256 timestamp);
    event TransferOwnerEvent(address indexed oldOwner, address indexed newOwner, uint256 timestamp);
    event eventstoreEvent(uint256 timestamp);
    modifier isOwner() {

        require(owner == msg.sender, "you are not owner");
        _;
    }

    // 建構子
    constructor() public payable {
        owner = msg.sender;
    }

    // -------------------------- Ether --------------------------

    // 存款
    function deposit() public payable {
        balance[msg.sender] += msg.value;

        emit DepositEvent(msg.sender, msg.value, now);
    }


    // 提款
    function withdraw(uint256 etherValue) public {
        uint256 weiValue = etherValue * 1 ether;

        require(balance[msg.sender] >= weiValue, "your balances are not enough");

        msg.sender.transfer(weiValue);

        balance[msg.sender] -= weiValue;

        emit WithdrawEvent(msg.sender, etherValue, now);
    }

    // 轉帳
    function transfer(address to, uint256 etherValue) public {
        uint256 weiValue = etherValue * 1 ether;

        require(balance[msg.sender] >= weiValue, "your balances are not enough");

        balance[msg.sender] -= weiValue;
        balance[to] += weiValue;

        emit TransferEvent(msg.sender, to, etherValue, now);
    }

    // -------------------------- Coin --------------------------

    // 鑄幣 (Coin)
    function mint(uint256 coinValue) public isOwner {
        uint256 value = coinValue * 1 ether;

        coinBalance[msg.sender] += value;

        emit MintEvent(msg.sender, coinValue, now);

    }

    // 使用 bank 中的 ether 向 owner 購買 coin
    function buy(uint256 coinValue) public {
        uint256 value = coinValue * 1 ether;

        // require owner 的 coinBalance 不小於 value
        require(balance[msg.sender] >= value, "ether balances are not enough!");

        balance[msg.sender] -= value;
        balance[owner] += value;

        coinBalance[msg.sender] += value;
        coinBalance[owner] -= value;

        // emit BuyCoinEvent
        emit BuyCoinEvent(msg.sender, coinValue, now);

    }

    // 轉移 Coin
    function transferCoin(address to, uint256 coinValue) public {
        uint256 value = coinValue * 1 ether;

        // require msg.sender 的 coinBalance 不小於 value
        require(coinBalance[msg.sender] >= value, "coin balances are not enough!");

        coinBalance[msg.sender] -= value;
        coinBalance[to] += value;


        // emit TransferCoinEvent
        emit TransferCoinEvent(msg.sender, to, coinValue, now);

    }

    // 取得銀行帳戶餘額
    function getBankBalance() public view returns (uint256) {
        return balance[msg.sender];
    }

    // 檢查 coin 餘額
    function getCoinBalance() public view returns (uint256) {
        return coinBalance[msg.sender];
    }

    // get owner
    function getOwner() public view returns (address)  {
        return owner;
    }

    // 轉移 owner
    function transferOwner(address newOwner) public isOwner {
        // transfer ownership
        address oldOwner = owner;
        owner = newOwner;

        // emit TransferOwnerEvent
        emit TransferOwnerEvent(oldOwner, newOwner, now);
    }

    function eventstore() public  returns(address){

        emit eventstoreEvent(now);

    }


    function kill() public isOwner {
        selfdestruct(owner);
    }

}