pragma solidity >=0.6.0 <0.8.0;

import '../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '../node_modules/@openzeppelin/contracts/access/Ownable.sol';
import '../node_modules/@openzeppelin/contracts/math/SafeMath.sol';

contract Wallet is Ownable {
    using SafeMath for uint256;
    struct Token {
        bytes32 ticker;
        address tokenAddress;
    }
    
    mapping(bytes32 => Token) public tokens;
    bytes32[] public tokenList;
    mapping(address => mapping(bytes32 => uint256)) public traderBalances;

    bytes32 constant ETH = bytes32('ETH');
    
    function addToken(bytes32 ticker,address tokenAddress) onlyOwner external {
        tokens[ticker] = Token(ticker, tokenAddress);
        tokenList.push(ticker);
    }
    
    function deposit(uint amount,  bytes32 ticker) tokenExist(ticker) external payable {
        if(ticker == ETH){
            traderBalances[msg.sender][ticker] = msg.value;
        }
        else{
            IERC20(tokens[ticker].tokenAddress).transferFrom(msg.sender, address(this), amount);
            traderBalances[msg.sender][ticker] = traderBalances[msg.sender][ticker].add(amount);
        }
    }
    
    function withdraw(uint amount, bytes32 ticker) tokenExist(ticker) external {
        require(
            traderBalances[msg.sender][ticker] >= amount,
            'balance too low'
        ); 
        traderBalances[msg.sender][ticker] = traderBalances[msg.sender][ticker].sub(amount);
        IERC20(tokens[ticker].tokenAddress).transfer(msg.sender, amount);
    }
    
    modifier tokenExist(bytes32 ticker) {
        require(
            tokens[ticker].tokenAddress != address(0),
            'this token does not exist'
        );
        _;
    }
}